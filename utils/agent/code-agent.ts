import { callAgent, AGENT_MODELS } from './base'

export class CodeAgent {
  async applyChanges(instruction: string, currentSiteData: any) {
    const prompt = `
      You are the Zemen Code Agent. Your job is to take an instruction and apply it to the site data JSON.
      
      INSTRUCTION: "${instruction}"
      CURRENT SITE DATA: ${JSON.stringify(currentSiteData)}
      
      You must return the ENTIRE updated JSON object. Do not include any explanation.
      If the change involves colors or fonts, add/update a "theme" object in the JSON.
      
      Example Theme Structure:
      {
        "theme": {
          "primaryColor": "#HEX",
          "backgroundColor": "#HEX",
          "fontFamily": "Inter, sans-serif",
          "headingFont": "Outfit, sans-serif"
        }
      }
    `

    const updatedData = await callAgent(prompt, AGENT_MODELS.CODE)
    return updatedData
  }
}
