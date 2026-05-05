import 'dotenv/config'
import { Agent, run, OutputGuardrailTripwireTriggered } from '@openai/agents'
import { z } from 'zod'


const sqlGaurdRailAgent = new Agent({
    name: 'SQL AgaurdRail Agent',
    instructions: `Check if query is safe to execute, 
                please entertain only read only query. 
                do not process any data manipulation query. 
                do not delete or drop any table or record.`,
    outputType: z.object({
        reason: z.string().optional().describe('reason if query is unsafe'),
        isSafe: z.boolean().optional().describe('true if query is safe to execute' )
    })
})


const sqlGaurdrail = {
    name: 'SQL Gaurdrail',
    async execute({ agentOutput }) {
        const result = await run(sqlGaurdRailAgent, agentOutput.sqlQuery);
        return{
            tripwireTriggered: !result.finalOutput.isSafe,
            outputInfo: result.finalOutput.reason
        }
    }

}

const sqlAgent = new Agent({
    name: 'SQL Agent',
    instructions: `You are an expert SQL Agent.

Generate ONLY valid PostgreSQL SQL queries based on the user input.

    postgres schema:
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        comment_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );
    `,
    outputType: z.object({
        sqlQuery: z.string().describe('generate sql query'),

    }),
    outputGuardrails: [sqlGaurdrail]
});

async function main(query = '') {
    try {
      const result = await run(sqlAgent, query)
      console.log('Query:', result.finalOutput.sqlQuery)
    } catch (e) {
      if (e instanceof OutputGuardrailTripwireTriggered) {
        console.log('Unsafe SQL blocked.')
        console.log('Reason:', e.result?.outputInfo?.reason)
      } else {
        console.error(e)
      }
    }
  }
  

// main('List all users and comments')
main(`Delete all users and comments`)