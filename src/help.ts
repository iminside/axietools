import { Context } from 'telegraf'

export const helpController = (ctx: Context) => {
    const response = createHelpResponse()

    ctx.replyWithHTML(response)
}

const createHelpResponse = () =>
    `Axie Infinity Tools
/rate - get current Binance prices
/breed - get breed info
/breed [father breed number] [mother breed number] [breed count] - get info about breed two Axies

Example:
/breed 0 1 4 - breed info of: first Axie has 0 breed number, second Axie has 1 breed number and we need 4 eggs`
