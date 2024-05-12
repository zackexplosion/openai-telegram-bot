import OpenAI from "openai"
import util from 'node:util'
import child_process from 'node:child_process'
import fs from 'node:fs'
import dayjs from 'dayjs'

const THINKING_WORDS = [
  'Hm....I am thinking....',
  'Give me a second!....',
  '🤔....'
]


const openai = new OpenAI();
const exec = util.promisify(child_process.exec)


var messages = [
  {
    "role": "system",
    "content": `Your name is "Juni", and you won't response with "Simplified Chinese" just "Traditional Chinese, English, Russian`
  },
  // {
  //   "role": "system",
  //   "content": `Response the title and content with format 'write title here' # 'write content here'`
  // }
]

export default async function hey_juni_create_blog(bot, msg, input) {
  const chatId = msg.chat.id

  if(!input) {
    return bot.sendMessage(chatId, 'Hmm en?')
  }
  // https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
  const thinking_word = THINKING_WORDS[Math.floor(Math.random() * THINKING_WORDS.length)];

  console.log('input', input)

  messages.push({
    "role": "user",
    "content": input
  })

  var promises = [
    bot.sendMessage(chatId, thinking_word),
    openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    })
  ]

  const [message, completion] = await Promise.all(promises)

  console.log(completion)
  // var response = completion.choices[0].message.content.split("@")
  // var title = response[0]
  // var content = response[1]

  var messageToChange = ''
  if(completion && Array.isArray(completion.choices) && completion.choices[0]) {
    messageToChange = `${completion.choices[0].message.content}`
  }

  messages.push({
    "role": "assistant",
    "content": messageToChange
  })

  bot.editMessageText(messageToChange, {
    chat_id: message.chat.id,
    message_id: message.message_id,
  })

  console.log('title', title)
  console.log('content', content)
  var title = "AI Blogging " + dayjs().format('YYYY-MM-DDTHHmmss')
  var content = messageToChange

  var blog_url = await write_blog(title, content)


  await deploy_to_github(title)
  var deploy_to_message = `\n\nWill Published to ${blog_url}`
  bot.editMessageText(messageToChange + deploy_to_message, {
    chat_id: message.chat.id,
    message_id: message.message_id,
  })
}

const {
  BLOG_PATH,
  BLOG_URL
} = process.env


async function write_blog(title, content) {

  title = title.replace(/\n/, '')

  const COMMANDS = [
    `cd ${BLOG_PATH}`,
    'git clean -fd'
  ]
  const { stdout, stderr } = await exec(COMMANDS.join('&&'));

  var blog_file_content =`---
title: "${title}"
date: ${dayjs().format()}
draft: false
tags: [AI Blogging]
series: openAI-Creation
---
${content}`

  var file_name = title.replace(/ /gm, '_')
  var post_path = `${BLOG_PATH}/content/posts/${file_name}.md`
  var blog_post_url = `${BLOG_URL}/posts/${file_name}`
  fs.writeFileSync(post_path, blog_file_content, 'utf8')

  return blog_post_url.toLocaleLowerCase()
}

async function deploy_to_github(title){
  const COMMANDS = [
    `cd ${BLOG_PATH}`,
    'hugo',
    `git add .`,
    `git commit -m 'Add new Blog Post ${title}'`,
    `git push`
  ]
  const { stdout, stderr } = await exec(COMMANDS.join('&&'));
  console.log('stdout:')
  console.log(stdout)
  console.error('stderr:', stderr)
}


// hey_juni_create_blog(null, null, 'A blog post about Finance, in 100 words')