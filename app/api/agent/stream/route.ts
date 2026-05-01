import { OrchestratorAgent } from '@/utils/agent/orchestrator'
import { MemoryAgent } from '@/utils/agent/memory-agent'
import { DesignAgent, ContentAgent } from '@/utils/agent/specialized-agents'
import { CodeAgent } from '@/utils/agent/code-agent'
import { ReviewAgent } from '@/utils/agent/review-agent'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userMessage = searchParams.get('message')
  const siteId = searchParams.get('siteId')
  const userId = searchParams.get('userId')

  if (!userMessage || !siteId || !userId) {
    return new Response('Missing parameters', { status: 400 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 1. Get current site data
        const { data: site } = await supabase.from('sites').select('*').eq('id', siteId).single()
        let currentData = site.site_data
        
        // 2. Get Memory Context
        send({ status: 'Retrieving business memory...' })
        const memoryAgent = new MemoryAgent()
        const context = await memoryAgent.getRelevantContext(siteId, userMessage)

        // 3. Run Orchestrator
        send({ status: 'Analyzing your request...' })
        const orchestrator = new OrchestratorAgent()
        const plan = await orchestrator.processRequest(userId, siteId, `${context}\n\nUser: ${userMessage}`, currentData)

        send({ status: 'Planning changes...', message: plan.responseToUser })

        // 4. Sequential Execution (Specialized Agents)
        for (const task of plan.tasks) {
          if (task.agent === 'design') {
            send({ status: 'Design Agent at work...' })
            const design = new DesignAgent()
            const proposal = await design.proposeChanges(task.instruction, currentData)
            task.instruction = proposal.suggestion // Refine instruction
          } else if (task.agent === 'content') {
            send({ status: 'Content Agent at work...' })
            const content = new ContentAgent()
            const proposal = await content.proposeChanges(task.instruction, currentData)
            task.instruction = proposal.suggestion
          }

          if (task.agent === 'code' || task.agent === 'design' || task.agent === 'content') {
            send({ status: 'Code Agent applying patches...' })
            const codeAgent = new CodeAgent()
            const updatedData = await codeAgent.applyChanges(task.instruction, currentData)
            
            // 5. Review Agent
            send({ status: 'Reviewing for quality...' })
            const reviewAgent = new ReviewAgent()
            const review = await reviewAgent.reviewChanges(updatedData, currentData)

            if (review.approved) {
              currentData = updatedData
              send({ updatedData: currentData })
            } else {
              send({ status: `Review Agent feedback: ${review.feedback}. Retrying...` })
              // Simple retry logic could go here
            }
          }
        }

        // 6. Store Memory
        await memoryAgent.storePreference(siteId, userMessage)
        
        send({ status: 'Completed', complete: true })
        controller.close()
      } catch (error: any) {
        send({ error: error.message })
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
