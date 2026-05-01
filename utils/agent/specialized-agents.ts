import { callAgent, AGENT_MODELS } from './base'

export class DesignAgent {
  async proposeChanges(instruction: string, currentSiteData: any) {
    const prompt = `
      You are the Zemen Design Agent. You specialize in visual aesthetics.
      USER WANT: "${instruction}"
      
      Suggest specific visual changes (colors, fonts, spacing) to achieve this.
      Return a set of specific instructions for a Code Agent.
    `
    return await callAgent(prompt, AGENT_MODELS.DESIGN)
  }
}

export class ContentAgent {
  async proposeChanges(instruction: string, currentSiteData: any) {
    const prompt = `
      You are the Zemen Content Agent. You specialize in copywriting.
      USER WANT: "${instruction}"
      
      Suggest specific text changes (headlines, descriptions) to achieve this.
      Return a set of specific instructions for a Code Agent.
    `
    return await callAgent(prompt, AGENT_MODELS.CONTENT)
  }
}
