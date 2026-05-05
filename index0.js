import 'dotenv/config'
import { Agent, run } from '@openai/agents';


const myAgent = new Agent({
    name: 'Hello Agent',
    instructions: 'You are expert Agant who always says Hi There...',
    

})

run(myAgent, 'Hey Man, I am Saket').then((result) => {
    console.log(result.finalOutput)
});

// OR
// const result = await run(myAgent, 'Hey Man, I am Saket')
// console.log(result.finalOutput);
