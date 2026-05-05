import 'dotenv/config';

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  throw new Error('Missing BREVO_API_KEY');
}

async function sendEmail() {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Saket Test App',
          email: 'saket.amraotkar@gmail.com', // must be verified
        },
        to: [
          {
            email: 'amraotkar.saket@gmail.com',
            name: 'Test User',
          },
        ],
        subject: 'Test Email from Brevo API',
        htmlContent: `
          <h2>Hello!</h2>
          <p>Email sent using Brevo API (no SDK 🚀)</p>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error:', data);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log(data);
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error(error);
  }
}

sendEmail();