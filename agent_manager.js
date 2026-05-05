import 'dotenv/config'
import { Agent, tool, run } from '@openai/agents'
import { z } from 'zod'
import { describe } from 'zod/v4/core';
import fs from 'node:fs/promises'
import { tr } from 'zod/locales';



const processRefund = new tool({
    name: 'process_refund',
    description: 'tool to process customer refund amount',
    parameters: z.object({
        customer_id: z.string().describe('id of customer'),
        reason: z.string().describe('reason for refund'),
    }),
    execute: async function (input) {
        const { customer_id, reason } = input
       await fs.appendFile('./refunds.txt', `Refund for customer ${customer_id} and reason ${reason}`, 'utf-8');
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
            {plan_id: '1', price: 399, speed: '30 MBPS'},
            {plan_id: '2', price: 999, speed: '100 MBPS'},
            {plan_id: '3', price: 1499, speed: '200 MBPS'}
        ]
    }
});


const salesAgent = new Agent({
    name: 'Sales Agant',
    instructions: `You are an Expert Sales Agent for Internet Broadband company.
    You help customer with plans and query`,
    tools: [fetchAvialbalePlans, refundAgent.asTool({
        toolName: 'refund_expert',
        toolDescription: 'Refund as per customer query'
    })]
});


async function runAgent(query = '') {
    const result = await run(salesAgent, query);
    console.log(`Result`, result.finalOutput)
}


// runAgent(`Hey There`)
// runAgent(`Hey There, please show me new plans`)
runAgent(`I have plan, but its not working so i need my refund, my customer_id is cust112 and reason is internet is not working`)