import 'dotenv/config'
import { Agent, run, hostedMcpTool, tool } from '@openai/agents'
import { describe } from 'zod/v4/core'

const myAgent = new Agent({
    name: 'MCP Assistant',
    instructions: 'You must use MCP tools to answer questions.',
    tools: [
        hostedMcpTool({
        serverLabel: 'gitMcp',
        serverUrl: 'https://gitmcp.io/openai/codex',
    })
]
});

async function main(query: string) {

    const result = await run(myAgent, query);
    console.log(result.finalOutput);    
}

main('What is the repo about');