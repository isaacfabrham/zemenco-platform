import { callAgent, AGENT_MODELS } from './base'

export class ReviewAgent {
  async reviewChanges(proposedData: any, originalData: any) {
    const prompt = `
      You are the Zemen Review Agent. Quality Control.
      Check the following changes for:
      1. WCAG contrast standards.
      2. Mobile responsiveness.
      3. Professional look.
      
      PROPOSED DATA: ${JSON.stringify(proposedData)}
      ORIGINAL DATA: ${JSON.stringify(originalData)}
      
      Respond with:
      {
        "approved": boolean,
        "feedback": "string explaining why or what to fix",
        "score": number (1-10)
      }
    `
    return await callAgent(prompt, AGENT_MODELS.ORCHESTRATOR) // Use 70b for review
  }
}
