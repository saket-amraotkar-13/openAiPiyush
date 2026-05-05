import 'dotenv/config'
import { Agent, tool, run } from '@openai/agents'
import { z } from 'zod'
import fs from 'node:fs/promises'
import os from 'node:os'
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions'


const processRefund = new tool({
    name: 'process_refund',
    description: 'tool to process customer refund amount',
    parameters: z.object({
        customer_id: z.string().describe('id of customer'),
        reason: z.string().describe('reason for refund'),
    }),
    execute: async function (input) {
        const { customer_id, reason } = input
        await fs.appendFile('./refunds.txt', `Refund for customer ${customer_id} and reason ${reason}${os.EOL}`, 'utf-8');
        return { refundIssed: true }
    }
})

const refundAgent = new Agent({
    name: 'Refund Agent',
    instructions: `You are and expert in resolving customer queries including refund amount in case customer is not satisfied`,
    tools: [processRefund]
})

const fetchAvialbalePlans = tool({
    name: 'fetch_available_plans',
    description: 'Get all internet plans available',
    parameters: z.object(),
    execute: async function () {
        return [
            { plan_id: '1', price: 399, speed: '30 MBPS' },
            { plan_id: '2', price: 999, speed: '100 MBPS' },
            { plan_id: '3', price: 1499, speed: '200 MBPS' }
        ]
    }
});

const salesAgent = new Agent({
    name: 'Sales Agant',
    instructions: `You are an Expert Sales Agent for Internet Broadband company.
    You help customer with plans and query`,
    tools: [fetchAvialbalePlans]
});


const receptionAgent = new Agent({
    name: 'Reception Agent',
    instructions: `${RECOMMENDED_PROMPT_PREFIX}
    You are an Reception Agent who interacts with customer initially and depending on customer query direvt or handoffs the request to respective agent available`,
    handoffDescription:`You have two agents available as below:
    - salesAgent: Expert to handle new customer and able to explain available plans
    - refundAgent: Expert to handle customer issues and refund process`,
    handoffs: [salesAgent, refundAgent]
})

async function main(query = '') {

 const result = await run(receptionAgent, query)
 console.log(`Result`, result.finalOutput)
 console.log(`History`, result.history)
    
}

// main(`Hey what are the new plans`)
// main(`Hey help me to understand if refund is possible`)
main(`My customer_id is cust11 and reason to refund is internet is now working, please initiate my refund`)