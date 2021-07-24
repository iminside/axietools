import { Context, NarrowedContext } from 'telegraf'
import { MountMap } from 'telegraf/typings/telegram-types'
import { loadBinancePrices } from './binance'

const PARSE_REGEX = /^\/(slp|axs|eth|usd)2(slp|axs|eth|usd)\s+([0-9]+(?:\.[0-9]+)?)$/

export const exchangeController = async (ctx: NarrowedContext<Context, MountMap['text']>) => {
    const match = ctx.message.text.match(PARSE_REGEX)!

    if (!match) {
        ctx.reply(`Unknown command`)
        return
    }

    const [_, from, to, rawAmount] = match
    const amount = parseFloat(rawAmount)
    const result = await exchange(from as Coin, to as Coin, amount)
    const fromFmt = from.toUpperCase()
    const toFmt = to.toUpperCase()
    const resultFmt = result.toFixed(2)

    ctx.replyWithHTML(`<pre>Exchange info
${amount} ${fromFmt} ~> ${resultFmt} ${toFmt}</pre>`)
}

type Coin = 'usd' | 'slp' | 'axs' | 'eth'

const exchange = async (from: Coin, to: Coin, amount: number) => {
    switch (from) {
        case 'usd':
            return usdExchange(to, amount)
        case 'slp':
            return slpExchange(to, amount)
        case 'axs':
            return axsExchange(to, amount)
        case 'eth':
            return ethExchange(to, amount)
    }
}

const usdExchange = async (to: Coin, amount: number) => {
    const { SLP, AXS, ETH } = await loadBinancePrices()

    switch (to) {
        case 'slp':
            return amount / SLP
        case 'axs':
            return amount / AXS
        case 'eth':
            return amount / ETH
        default:
            return amount
    }
}

const slpExchange = async (to: Coin, amount: number) => {
    const { SLP, AXS, ETH } = await loadBinancePrices()

    switch (to) {
        case 'usd':
            return amount * SLP
        case 'axs':
            return (amount * SLP) / AXS
        case 'eth':
            return (amount * SLP) / ETH
        default:
            return amount
    }
}

const axsExchange = async (to: Coin, amount: number) => {
    const { SLP, AXS, ETH } = await loadBinancePrices()

    switch (to) {
        case 'usd':
            return amount * AXS
        case 'slp':
            return (amount * AXS) / SLP
        case 'eth':
            return (amount * AXS) / ETH
        default:
            return amount
    }
}

const ethExchange = async (to: Coin, amount: number) => {
    const { SLP, AXS, ETH } = await loadBinancePrices()

    switch (to) {
        case 'usd':
            return amount * ETH
        case 'slp':
            return (amount * ETH) / SLP
        case 'axs':
            return (amount * ETH) / AXS
        default:
            return amount
    }
}
