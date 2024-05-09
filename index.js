import OpenAI from "openai"
import TelegramBot from "node-telegram-bot-api"

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/saylovelena/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, 'Yes I know you love Lena');
});

bot.onText(/\/doyouknowdeway/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, 'Yes Captain Lena know de way.');
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, 'Received your message');

  if(msg.text === '/heyjuni') {
    return bot.sendMessage(chatId, 'Hmm en?');
  }
  console.log(msg)
});


const openai = new OpenAI();
const THINKING_WORDS = [
  'Hm....I am thinking....',
  'Get me a second!....'
]

// Matches "/juni [whatever]"
bot.onText(/\/heyjuni (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  var input = match[1]

  if(!input) {
    return  bot.sendMessage(chatId, 'Hmm en?');
  }
  
  // https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
  const thinking_word = THINKING_WORDS[Math.floor(Math.random() * THINKING_WORDS.length)];
  
  var promises = [];

  promises.push(
    bot.sendMessage(chatId, thinking_word)
  )
  
  promises.push(
    openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "user",
          "content": match[1]
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


  var messageToChange = ''
  if(response && Array.isArray(response.choices) && response.choices[0]) {
    messageToChange = response.choices[0].message.content
  }

  bot.editMessageText(messageToChange, {
    chat_id: message.chat.id,
    message_id: message.message_id,
  })
});