import 'dotenv/config'
import { Agent, run } from '@openai/agents'
import { Stream } from 'openai/streaming'
import { tr } from 'zod/locales'



const myAgent = new Agent({
  name: 'Expert Agent',
  instructions: `You are a story teller, and write story on provided topic`
})


async function* streamOutPut(query: string){
  const result = await run(myAgent, query, { stream: true} )
  const textStream = result.toTextStream()

  for await (const val of textStream){
    yield { isCompleted: false, value: val}
  }
  yield { isCompleted: true, value: result.finalOutput}
}

async function main(query: string) {
  try {
   
    for await (const x of streamOutPut(query)){
      console.log(x)
    }

  } catch (e) {
    console.error('Error:', e)
  }
}

main('write a stroy on cricket')