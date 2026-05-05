import { OpenAI } from 'openai'
import 'dotenv/config'

const client = new OpenAI()
client.conversations.create({}).then( e => {
    console.log(`conversation id created with id=`, e.id)
});