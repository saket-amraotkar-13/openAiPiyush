import 'dotenv/config'
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';


const getWeatherTool = tool({
    name: 'get_weather',
    description: 'return current weather of city asked by user',
    parameters: z.object({
        city: z.string().describe('name of city'),

    }),
    execute: async function ({city}) {
        return `The weather of ${city} is 12 with rain`;
        
    }
})


const myAgent = new Agent({
    name: 'Hello Agent',
    agent: 'gpt-5.5',
    tools: [getWeatherTool],
    instructions: 'You are weather expert, please provide weather information for city asked by user'

})

async function main(query = '') {
    const result = await run(myAgent, query)
    console.log(result.finalOutput);
}

main(`what is weather of Austin`);