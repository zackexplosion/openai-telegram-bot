
import TelegramBot from "node-telegram-bot-api"
import { hey_juni } from "./hey_juni.js";
import hey_juni_create_blog from "./hey_juni_create_blog.js"

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const STATIC_RESPONSE_MAP = {
  '/heyjuni': 'Hmm en?',
  'doyouknowdeway': 'Yes Captain Lena know de way.',
  'saylovelena': 'Yes I know you love Lena'
}

// Listen for any kind of message. There are different kinds of
// messages.

const COMMAND_WORD = 'hey juni'
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  var input = STATIC_RESPONSE_MAP[msg.text]

  if(input){
    return bot.sendMessage(chatId, input)
  }
  // Matches everything start with COMMAND_WORD
  else if(msg.text.toLowerCase().includes(COMMAND_WORD)){
    var input = msg.text.toLowerCase().split(COMMAND_WORD)
    if(input[1]){
      input = input[1]
    }else {
      input = false
    }

    hey_juni(bot, msg, input)
  } else {
    console.log(msg)
  }
});

// Matches "/juni [whatever]"
// Matches "/heyjuni [whatever]"
bot.onText(/(\/juni|\/heyjuni) (.+)/gms, async (msg, match) => {
  console.log(match)
  hey_juni(bot, msg, match[2])
});


bot.onText(/(\/blog|\/blog) (.+)/gms, async (msg, match) => {
  hey_juni_create_blog(bot, msg, match[2])
});

bot.onText(/(\/image) (.+)/gms, async (msg, match) => {
  hey_juni_create_image(bot, msg, match[1])
});