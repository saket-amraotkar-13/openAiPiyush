import  'dotenv/config'
import { Agent, run, tool } from '@openai/agents'



const myAgent = new Agent({
    name: 'Expert Agent',
    instructions: `You are Expert in answerig user queries`,
    
})

async function main(query = '') {
try{
   
    const result = await run(myAgent, query, {
        conversationId: 'conv_69f1161c3704819690f16b68ab42606d05897ee1f2800c34'
    });
  
    console.log(`Result:`, result.finalOutput);
    console.log(`History:`, result.history);
}
catch(e){
    console.log('error here')
}
}
//1
main(`Who is Prime minister of India`);
//2
// main(`what is his age`);