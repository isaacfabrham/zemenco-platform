import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export class MemoryAgent {
  async storePreference(businessId: string, content: string) {
    // 1. Generate embedding using Ollama nomic-embed-text
    const embeddingRes = await fetch(`${process.env.OLLAMA_API_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: content
      })
    })
    
    const { embedding } = await embeddingRes.json()

    // 2. Store in Supabase
    await supabase.from('agent_memory').insert({
      business_id: businessId,
      content,
      embedding
    })
  }

  async getRelevantContext(businessId: string, query: string) {
    const embeddingRes = await fetch(`${process.env.OLLAMA_API_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: query
      })
    })
    
    const { embedding } = await embeddingRes.json()

    // RPC call for vector similarity search
    const { data: memories } = await supabase.rpc('match_agent_memory', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 5,
      p_business_id: businessId
    })

    return memories?.map((m: any) => m.content).join('\n') || ''
  }
}
