import { Context, NarrowedContext } from 'telegraf'
import { MountMap } from 'telegraf/typings/telegram-types'
import { loadBinancePrices } from './binance'

const PARSE_REGEX = /^\/breed(?:\s+([0-6])(?:([0-6])([1-7])?)?)?$/
const BREED_SLP_COST = [300, 450, 750, 1200, 1950, 3150, 5100]
const BREED_AXS_COST = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]

export const breedController = async (ctx: NarrowedContext<Context, MountMap['text']>) => {
    const match = ctx.message.text.match(PARSE_REGEX)!

    if (!match) {
        ctx.reply(`Unknown breed input values`)
        return
    }

    const [_, one = null, two = one, count = '1'] = match

    if (one !== null && two !== null) {
        await replyDetailedInfo(ctx, parseInt(one), parseInt(two), parseInt(count))
    } else {
        await replyCommonInfo(ctx)
    }
}

const replyDetailedInfo = async (
    ctx: NarrowedContext<Context, MountMap['text']>,
    one: number,
    two: number,
    count: number
) => {
    const { SLP, AXS, ETH } = await loadBinancePrices()

    if (one + count > 7) {
        const max = 7 - one

        ctx.reply(`Sorry, but the first Axie cannot be breeded more than ${max} times`)
        return
    }

    if (two + count > 7) {
        const max = 7 - two

        ctx.reply(`Sorry, but the second Axie cannot be breeded more than ${max} times`)
        return
    }

    const response = detailedInfoTpl(one, two, count, SLP, AXS, ETH)

    ctx.replyWithHTML(response)
}

const replyCommonInfo = async (ctx: NarrowedContext<Context, MountMap['text']>) => {
    const { SLP, AXS } = await loadBinancePrices()
    const response = breedCommonInfoTlp(SLP, AXS)

    ctx.replyWithHTML(response)
}

const detailedInfoTpl = (one: number, two: number, count: number, SLP: number, AXS: number, ETH: number) => {
    let needAXS = 0
    let needSLP = 0

    for (let i = 0; i < count; i++) {
        needAXS += BREED_AXS_COST[one + i]
        needAXS += BREED_AXS_COST[two + i]
        needSLP += BREED_SLP_COST[one + i]
        needSLP += BREED_SLP_COST[two + i]
    }

    const breedCost = needAXS * AXS + needSLP * SLP
    const breedCostETH = breedCost / ETH
    const eggCost = breedCost / count
    const eggCostETH = eggCost / ETH
    const needAXSFmt = needAXS.toString().padStart(5, ' ')
    const needSLPFmt = needSLP.toString().padStart(5, ' ')
    const breedCostFmt = breedCost.toFixed(2).padStart(7, ' ')
    const breedCostETHFmt = breedCostETH.toFixed(3)
    const eggCostFmt = eggCost.toFixed(2).padStart(7, ' ')
    const eggCostETHFmt = eggCostETH.toFixed(3)

    return `<pre>First Axie:    ${one} 
Second Axie:   ${two} 
Eggs amount:   ${count}
Need AXS:  ${needAXSFmt}
Need SLP:  ${needSLPFmt}
----------------
Total:   ${breedCostFmt} USD | ${breedCostETHFmt} ETH
Per egg: ${eggCostFmt} USD | ${eggCostETHFmt} ETH</pre>`
}

const breedCommonInfoTlp = (SLP: number, AXS: number) => {
    return `<pre>  | AXS |  SLP |     USD |   PER 2 
----------------------------------
${breedCommonInfoRowTpl(0, SLP, AXS)}
${breedCommonInfoRowTpl(1, SLP, AXS)}
${breedCommonInfoRowTpl(2, SLP, AXS)}
${breedCommonInfoRowTpl(3, SLP, AXS)}
${breedCommonInfoRowTpl(4, SLP, AXS)}
${breedCommonInfoRowTpl(5, SLP, AXS)}
${breedCommonInfoRowTpl(6, SLP, AXS)} 
</pre>`
}

const breedCommonInfoRowTpl = (breedNumber: number, SLP: number, AXS: number) => {
    const axsCost = BREED_AXS_COST[breedNumber]
    const slpCost = BREED_SLP_COST[breedNumber]
    const breedCost = calcBreedCost(breedNumber, SLP, AXS)
    const per2cost = breedCost * 2

    const axsCostFmt = axsCost
    const slpCostFmt = slpCost.toString().padStart(4, ' ')
    const breedCostFmt = formatBreedCost(breedCost)
    const per2costFmt = formatBreedCost(per2cost)

    return `${breedNumber} |   ${axsCostFmt} | ${slpCostFmt} | ${breedCostFmt} | ${per2costFmt}`
}

const calcBreedCost = (breedNumber: number, SLP: number, AXS: number) => {
    return BREED_AXS_COST[breedNumber] * AXS + BREED_SLP_COST[breedNumber] * SLP
}

const formatBreedCost = (cost: number) => {
    return cost.toFixed(2).padStart(7, ' ')
}
