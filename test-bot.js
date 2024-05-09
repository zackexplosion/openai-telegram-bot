import TelegramBot from "node-telegram-bot-api"

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN
const TEST_ID = process.env.TEST_ID

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token);


var THINKING_WORDS = [
  'Hm....I am thinking....',
  'Okay...Get me a second!....'
]

// https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
const thinking_word = THINKING_WORDS[Math.floor(Math.random() * THINKING_WORDS.length)];

bot.sendMessage(TEST_ID, thinking_word).then(_ =>{
  
  setTimeout(() =>{
    bot.editMessageText("Choose!",{
      chat_id: _.chat.id,
      message_id:_.message_id,
    })
  }, 1000)

})


// {
//   message_id: 94,
//   from: {
//     id: 7141644633,
//     is_bot: false,
//     first_name: 'Гоша',
//     last_name: 'ХХХ',
//     username: 'zackexplosion',
//     language_code: 'en'
//   },
//   chat: {
//     id: 7141644633,
//     first_name: 'Гоша',
//     last_name: 'ХХХ',
//     username: 'zackexplosion',
//     type: 'private'
//   },
//   date: 1715280678,
//   text: '/heyjuni can you translate this to Russian? ""Lena, I just want you to know that I have feelings for you and care about you deeply. I wanted to share this with you because you mean a lot to me." Good luck!"',
//   entities: [ { offset: 0, length: 8, type: 'bot_command' } ]
// }