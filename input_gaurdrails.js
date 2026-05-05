import 'dotenv/config'
import { Agent, run, InputGuardrailTripwireTriggered } from '@openai/agents'
import { z } from 'zod'



const mathsInputAgent = new Agent({
    name: 'Match Query Checker Agent',
    instructions: `You are input gaurdrail expert agent to validate user input query, please check if user input is maths question or not`,
    outputType: z.object({
        isValidMathsQuestion: z.boolean().describe('true if the user input is a maths question'),
        reason: z.string().optional().describe('reason to reject')
    })
})


const mathGarudRails = {
    name: 'Math gaurd rail',
    execute: async ({ input }) => {
        console.log(`Validating input`)
        const result1 = await run(mathsInputAgent, input);
    return{
       tripwireTriggered : !result1.finalOutput.isValidMathsQuestion,
       outputType: result1.finalOutput,
       outputInfo: result1.finalOutput.reason
    };
    }
}

const mathsAgent = new Agent({
    name: 'Maths Agent',
    instructions: `You are an expert Math Agent and respond only when query is related to Maths, for any other query do not respond`,
    inputGuardrails: [mathGarudRails]
});

async function main(query = '') {
    try {

    const result = await run(mathsAgent, query)
    console.log(`Result:`,result.finalOutput);
    }
    catch(e){
        if (e instanceof InputGuardrailTripwireTriggered)
            {
            console.log(`Invalid Input or query asked: ${e.message}`)
        } 
    }
    finally
        {
            process.exit(0)
        }
}

main(`What is 2 + 2`)
// main(`write a poem to add two numbers`)