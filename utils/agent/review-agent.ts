import { callAgent, AGENT_MODELS } from './base'

export class ReviewAgent {
  async reviewChanges(proposedData: any, originalData: any) {
    const prompt = `
      You are the Zemen Review Agent (Elite Quality Control).
      You must rigorously evaluate the following site changes.
      
      CRITERIA:
      1. WCAG 2.1 AA Compliance: Check background-to-text contrast ratios.
      2. Mobile Layout: Ensure no horizontal scrolling or overlapping elements on 390px width.
      3. Brand Integrity: Ensure the color palette is harmonious and not "AI slop" (random bright colors).
      4. Typography: Check readability at all sizes (desktop and mobile).
      
      PROPOSED DATA: ${JSON.stringify(proposedData)}
      ORIGINAL DATA: ${JSON.stringify(originalData)}
      
      Respond STRICTLY in JSON format:
      {
        "approved": boolean,
        "feedback": "Detailed explanation of findings",
        "score": number (1-10),
        "issues": ["list of specific issues if any"]
      }
    `
    return await callAgent(prompt, AGENT_MODELS.ORCHESTRATOR) // Use 70b for review
  }
}
