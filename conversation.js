import  'dotenv/config'
import { Agent, run, tool } from '@openai/agents'


let conversationHistory = [];

const myAgent = new Agent({
    name: 'Expert Agent',
    instructions: `You are Expert in answerig user queries`,
    
})

async function main(query = '') {
try{
    conversationHistory.push({role: 'user', content: query});
    const result = await run(myAgent, conversationHistory);
    conversationHistory = result.history;
    console.log(`Result:`, result.finalOutput);
    console.log(`History:`, result.history);
}
catch(e){
    console.log('error here')
}
}

main(`Who is Prime minister of India`).then(() => {
    main('what is his age');
})