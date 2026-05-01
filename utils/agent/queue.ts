import { Queue, Worker, Job } from 'bullmq'
import IORedis from 'ioredis'

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

export const agentQueue = new Queue('zemen-agent-tasks', { connection })

export interface AgentTask {
  type: 'orchestrate' | 'design' | 'content' | 'code' | 'review' | 'memory'
  userId: string
  siteId: string
  payload: any
  context?: any
}

// Function to add tasks to the queue
export async function addAgentTask(task: AgentTask) {
  return await agentQueue.add(task.type, task, {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  })
}
