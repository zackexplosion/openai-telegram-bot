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
    "content": `Your name is "Juni", You are able to respond with any language, just no "Simplified Chinese"`
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
      // temperature: 1,
      // max_tokens: 256,
      // top_p: 1,
      // frequency_penalty: 0,
      // presence_penalty: 0,
      stream: true
    })
  )

  const [message, stream] = await Promise.all(promises)


  var messageToChange = ''
  var finished = false

  var interval = setInterval(() => {

    if(finished) return

    bot.editMessageText(messageToChange, {
      chat_id: message.chat.id,
      message_id: message.message_id,
    })
  }, 500)

  for await (const chunk of stream) {
    if(chunk.choices &&
      chunk.choices[0] &&
      chunk.choices[0].delta &&
      chunk.choices[0].delta.content
    ) {
      messageToChange += chunk.choices[0].delta.content
      console.log(messageToChange)
    }

    if(chunk.choices && chunk.choices.finish_reason === 'stop') {
      finished = true
    }
  }

  clearInterval(interval)

  console.log('messageToChange final', messageToChange)

  bot.editMessageText(messageToChange, {
    chat_id: message.chat.id,
    message_id: message.message_id,
  })






  // if(response && Array.isArray(response.choices) && response.choices[0]) {
  //   messageToChange = `${response.choices[0].message.content}`
  // }

  // messages.push({
  //   "role": "assistant",
  //   "content": messageToChange
  // })

  // bot.editMessageText(messageToChange, {
  //   chat_id: message.chat.id,
  //   message_id: message.message_id,
  // })
}