import  'dotenv/config'
import { Agent, run, tool } from '@openai/agents'


interface myContext {
    userId: string;
    userName: string;
}

const myAgent = new Agent<myContext>({
    name: 'Expert Agent',
    instructions: ({context}) => {
        return `You are expert resolving queries \n Context:${JSON.stringify(context)}`
    },
    
})

async function main(query: string, ctx: myContext) {
try{
    
    const result = await run(myAgent, query, { context: ctx });
    console.log(`Result:`, result.finalOutput);
    // console.log(`History:`, result.history);
}
catch(e){
    console.log('error here')
}
}

main(`what is my name`, {
    userId: '1',
    userName: 'Saket'
})