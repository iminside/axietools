import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import { rateController } from './rate'
import { breedController } from './breed'
import { helpController } from './help'

dotenv.config()

const bot = new Telegraf(process.env.API_TOKEN!)

bot.start((ctx) => ctx.reply('Welcome to Axie Tools'))

bot.help(helpController)

bot.command('rate', rateController)
bot.command('breed', breedController)

bot.launch()

console.log('Axie tools runned')
