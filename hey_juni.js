import OpenAI from "openai"
const openai = new OpenAI();
const THINKING_WORDS = [
  'Hm....I am thinking....',
  'Give me a second!....',
  '🤔....'
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
  
  promises.push(
    openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "user",
          "content": input
        }
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
  )

  const [message, response] = await Promise.all(promises)


  var messageToChange = thinking_word
  if(response && Array.isArray(response.choices) && response.choices[0]) {
    messageToChange += `\n\n${response.choices[0].message.content}`
  }

  bot.editMessageText(messageToChange, {
    chat_id: message.chat.id,
    message_id: message.message_id,
  })
}