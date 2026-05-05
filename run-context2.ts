import 'dotenv/config'
import { Agent, run, tool, RunContext } from '@openai/agents'
import { z } from 'zod'

interface MyContext {
  userId: string
  userName: string,
  
}

const getUserInfo = tool({
  name: 'get_user_info',
  description: 'Get user information from runtime context',
  parameters: z.object({}),
  execute: async (_input, ctx?: RunContext<MyContext>): Promise<string> => {
    return `Your name is ${ctx?.context.userName}. Your user id is ${ctx?.context.userId}.`
  }
})


const myAgent = new Agent<MyContext>({
  name: 'Expert Agent',
  instructions: `You are an expert assistant.
When user asks about their name or user id, you MUST call get_user_info tool.`,
  tools: [getUserInfo]
})

async function main(query: string, ctx: MyContext) {
  try {
    const result = await run(myAgent, query, { context: ctx })
    console.log('Result:', result.finalOutput)
  } catch (e) {
    console.error('Error:', e)
  }
}

main('what is my name', {
  userId: '1',
  userName: 'Saket'
})