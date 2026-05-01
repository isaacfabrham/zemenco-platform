import { callAgent, AGENT_MODELS } from './base'
import { addAgentTask } from './queue'

export class OrchestratorAgent {
  async processRequest(userId: string, siteId: string, userMessage: string, currentSiteData: any) {
    const prompt = `
      You are the Zemen Orchestrator. Your job is to analyze the user request and delegate tasks to specialized agents.
      
      USER REQUEST: "${userMessage}"
      
      AVAILABLE AGENTS:
      - Design Agent: Handles colors, fonts, layouts, spacing, imagery.
      - Content Agent: Handles text, headlines, descriptions, menu items.
      - Code Agent: Applies the actual JSON changes to the site data.
      - Memory Agent: Retrieves past preferences.
      
      CURRENT SITE DATA: ${JSON.stringify(currentSiteData)}
      
      Respond in JSON format:
      {
        "plan": "Brief explanation of what you will do",
        "tasks": [
          { "agent": "design" | "content" | "code", "instruction": "detailed instruction for the agent" }
        ],
        "responseToUser": "A friendly message to the user explaining the plan"
      }
    `

    const result = await callAgent(prompt, AGENT_MODELS.ORCHESTRATOR)
    
    // Add tasks to the queue
    for (const task of result.tasks) {
      await addAgentTask({
        type: task.agent,
        userId,
        siteId,
        payload: { instruction: task.instruction, currentSiteData }
      })
    }

    return result
  }
}
