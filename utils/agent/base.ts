export async function callAgent(prompt: string, model: string = 'llama3.1:70b') {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model })
  })

  if (!res.ok) {
    throw new Error(`Agent call failed: ${res.statusText}`)
  }

  // Handle both standard JSON and potential stream responses (simplified for now)
  const data = await res.json()
  return data
}

export const AGENT_MODELS = {
  ORCHESTRATOR: 'llama3.1:70b',
  CODE: 'llama3.1:70b',
  DESIGN: 'llama3.1:8b',
  CONTENT: 'llama3.1:8b',
  MEMORY: 'nomic-embed-text'
}
