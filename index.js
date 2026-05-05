import 'dotenv/config'
import { Agent, run } from '@openai/agents';

const location = 'USA';

const myAgent = new Agent({
    name: 'Hello Agent',
    agent: 'gpt-5.5',
    instructions: function() {
        if (location === 'USA'){
            return 'Always Say Namaste...';        
        }
        else{
            return 'Always Say HELLO...'
        }
    }

})


const result = await run(myAgent, 'Hey Man, I am Saket')
console.log(result.finalOutput);
