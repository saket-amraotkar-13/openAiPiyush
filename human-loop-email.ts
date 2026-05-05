import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import axios from 'axios';
import readline from 'node:readline/promises';

const brevoApiKey = process.env.BREVO_API_KEY;

if (!brevoApiKey) {
  throw new Error('Missing BREVO_API_KEY');
}

const getWeatherTool = tool({
  name: 'get_weather',
  description: 'Return current weather of city asked by user',
  parameters: z.object({
    city: z.string().describe('Name of city'),
  }),
  execute: async ({ city }) => {
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=%C+%t`;
    const response = await axios.get(url, { responseType: 'text' });

    return `The weather of ${city} is ${response.data}`;
  },
});

const sendEmailTool = tool({
  name: 'send_email',
  description: 'Send email to a user using Brevo API',
  parameters: z.object({
    to: z.string().describe('Receiver email address. For multiple emails, use comma separated emails.'),
    subject: z.string().describe('Subject of email'),
    html: z.string().describe('HTML body of email'),
  }),
  needsApproval: true,

  execute: async ({ to, subject, html }) => {
    const recipients = to.split(',').map((email) => ({
      email: email.trim(),
      name: 'User',
    }));

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Saket Test App',
          email: 'saket.amraotkar@gmail.com',
        },
        to: recipients,
        subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return {
      success: true,
      message: 'Email sent successfully',
      data,
    };
  },
});

const myAgent = new Agent({
  name: 'Weather Email Expert Agent',
  tools: [getWeatherTool, sendEmailTool],
  instructions: `
    You are a weather expert and email assistant.
    First get the weather for all cities asked by the user.
    Then prepare a clear HTML email body.
    If the user asks to send email, use the send_email tool.
  `,
});

async function askUserConfirmationEmail(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(`${question}\nDo you want to approve? (y/n): `);
  rl.close();

  const normalizedAnswer = answer.toLowerCase().trim();
  return normalizedAnswer === 'y' || normalizedAnswer === 'yes';
}

async function main(query: string) {
  let result = await run(myAgent, query);

  let hasInterruptions = result.interruptions?.length > 0;

  while (hasInterruptions) {
    const state = result.state;

    for (const interruption of result.interruptions) {
      const approved = await askUserConfirmationEmail(
        `Agent "${interruption.agent.name}" wants to call tool "${interruption.name}" with args:\n${JSON.stringify(
          interruption.arguments,
          null,
          2
        )}`
      );

      if (approved) {
        state.approve(interruption);
      } else {
        state.reject(interruption);
      }
    }

    result = await run(myAgent, state);
    hasInterruptions = result.interruptions?.length > 0;
  }

  console.log(result.finalOutput);
}

main(`
Find the weather of Austin and Nagpur and send it to these email addresses:
amraotkar.saket@gmail.com, saket.amraotkar@gmail.com

Subject: Weather Report for asked cities

Body:
Hello Saket,
Please find the weather report for Austin and Nagpur.
`);