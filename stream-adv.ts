import 'dotenv/config'
import { Agent, run } from '@openai/agents'


const myAgent = new Agent({
  name: 'Expert Agent',
  instructions: `You are a story teller, and write story on provided topic`
})

async function main(query: string) {
  try {
    const result = await run(myAgent, query, {stream: true})
    result.toTextStream({compatibleWithNodeStreams: true}).pipe(process.stdout)

  } catch (e) {
    console.error('Error:', e)
  }
}

main('write a stroy on cricket')