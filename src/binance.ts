import Binance from 'binance-api-node'

const client = Binance()
const cache = {
    updatedAt: 0,
    prices: {
        SLP: 0,
        AXS: 0,
        ETH: 0,
    },
}

export const loadBinancePrices = async () => {
    if (cache.updatedAt + 5000 < Date.now()) {
        const { SLPUSDT, AXSUSDT, ETHUSDT } = await client.prices()
        const SLP = parseFloat(SLPUSDT)
        const AXS = parseFloat(AXSUSDT)
        const ETH = parseFloat(ETHUSDT)

        cache.updatedAt = Date.now()
        cache.prices = { SLP, AXS, ETH }
    }

    return cache.prices
}
