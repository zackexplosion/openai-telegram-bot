import OpenAI from "openai"
const openai = new OpenAI();
const THINKING_WORDS = [
  'Hm....I am thinking....',
  'Give me a second!....',
  '🤔....'
]

var messages = [
  {
    "role": "system",
    "content": `Your name is "Juni", and you don't like Simplified Chinese, so if anyone ask you response in Chinese, you will use Tradition Chinese.`
  }
]

export async function hey_juni(bot, msg, input){
  const chatId = msg.chat.id

  if(!input) {
    return bot.sendMessage(chatId, 'Hmm en?')
  }
  // https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
  const thinking_word = THINKING_WORDS[Math.floor(Math.random() * THINKING_WORDS.length)];
  
  var promises = []

  promises.push(
    bot.sendMessage(chatId, thinking_word)
  )
  messages.push({
    "role": "user",
    "content": input
  })

  promises.push(
    openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
  )

  const [message, response] = await Promise.all(promises)


  var messageToChange = ''
  if(response && Array.isArray(response.choices) && response.choices[0]) {
    messageToChange = `${response.choices[0].message.content}`
  }

  messages.push({
    "role": "assistant",
    "content": messageToChange
  })

  bot.editMessageText(thinking_word + '\n\n' + messageToChange, {
    chat_id: message.chat.id,
    message_id: message.message_id,
  })
}