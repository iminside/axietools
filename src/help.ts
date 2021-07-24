import { Context } from 'telegraf'

export const helpController = (ctx: Context) => {
    const response = createHelpResponse()

    ctx.replyWithHTML(response)
}

const createHelpResponse = () =>
    `<pre>Axie Infinity Tools
/rate - get current Binance prices
/breed - get breed info
/breed [father][mother][eggs] - get info about breed two Axies

Example:
/breed 014 - breed info of: first Axie has 0 breed number, second Axie has 1 breed number and we need 4 eggs

Exchanges:
/slp2usd 100
/slp2axs 100
/slp2eth 100
/axs2usd 100
/axs2slp 100
/axs2eth 100
/eth2usd 100
/eth2slp 100
/eth2axs 100
/usd2slp 100
/usd2axs 100
/usd2eth 100
</pre>`
