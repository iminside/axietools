import { Context } from 'telegraf'
import { loadBinancePrices } from './binance'

export const rateController = async (ctx: Context) => {
    const { SLP, AXS, ETH } = await loadBinancePrices()

    const response = createRateResponse(SLP, AXS, ETH)

    ctx.replyWithHTML(response)
}

function createRateResponse(SLP: number, AXS: number, ETH: number) {
    return `<code><b>Current Binance prices (USDT)</b>
SLP: ${formatPrice(SLP)}
AXS: ${formatPrice(AXS)}
ETH: ${formatPrice(ETH)}
</code>`
}

function formatPrice(amount: number) {
    const { 0: left, 1: right } = amount.toFixed(3).split('.')
    return `${left.padStart(4, ' ')}.${right.padEnd(4, ' ')}`
}
