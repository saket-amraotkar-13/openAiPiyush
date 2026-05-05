import 'dotenv/config'
import { Agent, run, MCPServerStreamableHttp, tool } from '@openai/agents'

const gitHubMCPServer = new MCPServerStreamableHttp({
    url:'https://gitmcp.io/openai/codex',
    name: 'gitMCP Document Server'
})

const myAgent = new Agent({
    name: 'MCP Assistant',
    instructions: 'You must use MCP tools to answer questions.',
    mcpServers: [gitHubMCPServer]
});

async function main(query: string) {
    await gitHubMCPServer.connect()
    const result = await run(myAgent, query);
    console.log(result.finalOutput);    
    await gitHubMCPServer.close()
}

main('What is the repo about');