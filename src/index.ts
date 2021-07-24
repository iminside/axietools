import { Telegraf } from 'telegraf'
import { rateController } from './rate'
import { breedController } from './breed'
import { exchangeController } from './exchange'
import { helpController } from './help'

const bot = new Telegraf(process.env.API_TOKEN!)

bot.start((ctx) => ctx.reply('Welcome to Axie Tools, say /help to see the list of commands'))

bot.help(helpController)

bot.command('rate', rateController)
bot.command('breed', breedController)
bot.command(
    // prettier-ignore
    [
        'slp2usd', 'slp2axs', 'slp2eth', 
        'axs2usd', 'axs2slp', 'axs2eth', 
        'eth2usd', 'eth2slp', 'eth2axs',
        'usd2slp', 'usd2axs', 'usd2eth'
    ],
    exchangeController
)

bot.launch()

console.log('Axie tools runned')
