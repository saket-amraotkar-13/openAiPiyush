import 'dotenv/config'
import { Agent, run } from '@openai/agents'


const myAgent = new Agent({
  name: 'Expert Agent',
  instructions: `You are a story teller, and write story on provided topic`
})

async function main(query: string) {
  try {
    const result = await run(myAgent, query, {stream: true})
    const stream = result.toTextStream()

    for await (const str of stream){
      console.log(str)
    }
  } catch (e) {
    console.error('Error:', e)
  }
}

main('write a stroy on cricket')