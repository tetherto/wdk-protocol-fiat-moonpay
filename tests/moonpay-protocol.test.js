import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import MoonpayProtocol from '../src/moonpay-protocol.js'

const signUrl = jest.fn()

const MOCK_API_KEY = 'pk_test_123'
const MOCK_SIGNED_URL = 'MOCK_SIGNED_URL'
const MOCK_ACCOUNT_ADDRESS = 'MOCK_ACCOUNT_ADDRESS'
const MOCK_CURRENCIES = [
  { type: 'crypto', code: 'eth', name: 'Ethereum', decimals: 18, precision: 5, metadata: { networkCode: 'ethereum' } },
  { type: 'fiat', code: 'usd', name: 'US Dollar', decimals: 2, precision: 2 },
  { type: 'fiat', code: 'eur', name: 'The Euro', decimals: null, precision: 2 },
  { type: 'fiat', code: 'bad_fiat', name: 'Bad Fiat', precision: undefined, decimals: undefined }
]

const mockAccount = {
  getAddress: jest.fn().mockResolvedValue(MOCK_ACCOUNT_ADDRESS)
}

describe('MoonPayProtocol', () => {
  const config = { signUrl, apiKey: MOCK_API_KEY, environment: 'sandbox' }

  let moonpay

  beforeEach(() => {
    jest.clearAllMocks()
    moonpay = new MoonpayProtocol(undefined, config)
  })

  describe('buy', () => {
    test('should successfully generate a buy URL to buy an exact crypto amount', async () => {
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      const { buyUrl } = await moonpay.buy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1_000_000_000_000_000_000n
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, {"headers": {"accept": "application/json"}})
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        currencyCode: 'eth',
        baseCurrencyCode: 'usd',
        quoteCurrencyAmount: '1.00000'
      })
      expect(buyUrl).toBe(MOCK_SIGNED_URL)
    })

    test('should successfully generate a buy URL to buy with a specified fiat amount', async () => {
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      const { buyUrl } = await moonpay.buy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        fiatAmount: 1000_00n // 1000 USD
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, {"headers": {"accept": "application/json"}})
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        currencyCode: 'eth',
        baseCurrencyCode: 'usd',
        baseCurrencyAmount: '1000.00'
      })
      expect(buyUrl).toBe(MOCK_SIGNED_URL)
    })

    test('should successfully generate a buy URL with a fiat currency lacking decimals', async () => {
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      const { buyUrl } = await moonpay.buy({
        cryptoAsset: 'eth',
        fiatCurrency: 'eur',
        fiatAmount: 1000_00n
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, {"headers": {"accept": "application/json"}})
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        currencyCode: 'eth',
        baseCurrencyCode: 'eur',
        baseCurrencyAmount: '1000.00'
      })
      expect(buyUrl).toBe(MOCK_SIGNED_URL)
    })

    test('should successfully generate a buy URL when a wallet is passed', async () => {
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      moonpay = new MoonpayProtocol(mockAccount, config)
      const { buyUrl } = await moonpay.buy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        fiatAmount: 1000_00n
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        currencyCode: 'eth',
        baseCurrencyCode: 'usd',
        baseCurrencyAmount: '1000.00',
        walletAddress: MOCK_ACCOUNT_ADDRESS
      })
      expect(buyUrl).toBe(MOCK_SIGNED_URL)
      expect(mockAccount.getAddress).toHaveBeenCalled()
    })

    test('should successfully generate an unsigned URL when the signUrl is not provided', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      moonpay = new MoonpayProtocol(mockAccount, { ...config, signUrl: undefined })
      const { buyUrl } = await moonpay.buy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        fiatAmount: 1000_00n
      })

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(Object.fromEntries(new URL(buyUrl).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        currencyCode: 'eth',
        baseCurrencyCode: 'usd',
        baseCurrencyAmount: '1000.00',
        walletAddress: MOCK_ACCOUNT_ADDRESS
      })
    })

    test('should prioritize recipient over existing account address', async () => {
      const MOCK_RECIPIENT = 'MOCK_RECIPIENT'
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      moonpay = new MoonpayProtocol(mockAccount, config)
      const { buyUrl } = await moonpay.buy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        fiatAmount: 1000_00n,
        recipient: MOCK_RECIPIENT
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        currencyCode: 'eth',
        baseCurrencyCode: 'usd',
        baseCurrencyAmount: '1000.00',
        walletAddress: MOCK_RECIPIENT
      })
      expect(buyUrl).toBe(MOCK_SIGNED_URL)
      expect(mockAccount.getAddress).not.toHaveBeenCalled()
    })

    test('should round down crypto amount with respect to precision', async () => {
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      const { buyUrl } = await moonpay.buy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1_234_567_000_000_000_000n
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        currencyCode: 'eth',
        baseCurrencyCode: 'usd',
        quoteCurrencyAmount: '1.23456'
      })
      expect(buyUrl).toBe(MOCK_SIGNED_URL)
    })

    test('should throw error when cryptoAsset is invalid', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.buy({
        cryptoAsset: 'invalid_crypto',
        fiatCurrency: 'usd',
        fiatAmount: 1000_00n
      })).rejects.toThrow('Cannot find info for cryptoAsset and fiatCurrency')
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    test('should throw error when fiatCurrency is invalid', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.buy({
        cryptoAsset: 'eth',
        fiatCurrency: 'invalid_fiat',
        fiatAmount: 1000_00n
      })).rejects.toThrow('Cannot find info for cryptoAsset and fiatCurrency')
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    test('should throw error when fiat decimal is not found', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.buy({
        cryptoAsset: 'eth',
        fiatCurrency: 'bad_fiat',
        fiatAmount: 1000_00n
      })).rejects.toThrow('Could not determine decimals for fiat currency: bad_fiat')
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    test('should throw error if both cryptoAmount and fiatAmount are provided', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.buy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1n,
        fiatAmount: 100n
      })).rejects.toThrow("'cryptoAmount' and 'fiatAmount' cannot both be provided")
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    test('should throw error if neither cryptoAmount nor fiatAmount is provided', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.buy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd'
      })).rejects.toThrow("Either 'cryptoAmount' or 'fiatAmount' must be provided")
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })
  })

  describe('sell', () => {
    test('should successfully generate a sell URL to sell an exact crypto amount', async () => {
      const MOCK_REFUND_ADDRESS = 'MOCK_REFUND_ADDRESS'
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      const { sellUrl } = await moonpay.sell({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1_000_000_000_000_000_000n,
        refundAddress: MOCK_REFUND_ADDRESS
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        baseCurrencyCode: 'eth',
        quoteCurrencyCode: 'usd',
        baseCurrencyAmount: '1.00000',
        refundWalletAddress: MOCK_REFUND_ADDRESS
      })
      expect(sellUrl).toBe(MOCK_SIGNED_URL)
    })

    test('should successfully generate a sell URL to sell for a specified fiat amount', async () => {
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      const { sellUrl } = await moonpay.sell({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        fiatAmount: 1000_00n // 1000 USD
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        baseCurrencyCode: 'eth',
        quoteCurrencyCode: 'usd',
        quoteCurrencyAmount: '1000.00'
      })
      expect(sellUrl).toBe(MOCK_SIGNED_URL)
    })

    test('should successfully generate a sell URL with a fiat currency lacking decimals', async () => {
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      const { sellUrl } = await moonpay.sell({
        cryptoAsset: 'eth',
        fiatCurrency: 'eur',
        fiatAmount: 1000_00n // 1000 USD
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        baseCurrencyCode: 'eth',
        quoteCurrencyCode: 'eur',
        quoteCurrencyAmount: '1000.00'
      })
      expect(sellUrl).toBe(MOCK_SIGNED_URL)
    })

    test('should successfully generate a sell URL when a wallet is passed', async () => {
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      moonpay = new MoonpayProtocol(mockAccount, config)
      const { sellUrl } = await moonpay.sell({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1_000_000_000_000_000_000n
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        baseCurrencyCode: 'eth',
        quoteCurrencyCode: 'usd',
        baseCurrencyAmount: '1.00000',
        refundWalletAddress: MOCK_ACCOUNT_ADDRESS
      })
      expect(sellUrl).toBe(MOCK_SIGNED_URL)
      expect(mockAccount.getAddress).toHaveBeenCalled()
    })

    test('should successfully generate a unsigned URL when the signUrl is not provided', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      moonpay = new MoonpayProtocol(mockAccount, { ...config, signUrl: undefined })
      const { sellUrl } = await moonpay.sell({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1_000_000_000_000_000_000n
      })

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(Object.fromEntries(new URL(sellUrl).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        baseCurrencyCode: 'eth',
        quoteCurrencyCode: 'usd',
        baseCurrencyAmount: '1.00000',
        refundWalletAddress: MOCK_ACCOUNT_ADDRESS
      })
    })

    test('should prioritize refundAddress over existing account address', async () => {
      const MOCK_REFUND_ADDRESS = 'MOCK_REFUND_ADDRESS'
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      moonpay = new MoonpayProtocol(mockAccount, config)
      const { sellUrl } = await moonpay.sell({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1_000_000_000_000_000_000n,
        refundAddress: MOCK_REFUND_ADDRESS
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        baseCurrencyCode: 'eth',
        quoteCurrencyCode: 'usd',
        baseCurrencyAmount: '1.00000',
        refundWalletAddress: MOCK_REFUND_ADDRESS
      })
      expect(sellUrl).toBe(MOCK_SIGNED_URL)
      expect(mockAccount.getAddress).not.toHaveBeenCalled()
    })

    test('should round down crypto amount with respect to precision', async () => {
      signUrl.mockReturnValue(MOCK_SIGNED_URL)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      const { sellUrl } = await moonpay.sell({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1_234_567_000_000_000_000n
      })

      const [[params]] = signUrl.mock.calls

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(Object.fromEntries(new URL(params).searchParams)).toMatchObject({
        apiKey: MOCK_API_KEY,
        baseCurrencyCode: 'eth',
        quoteCurrencyCode: 'usd',
        baseCurrencyAmount: '1.23456'
      })
      expect(sellUrl).toBe(MOCK_SIGNED_URL)
    })

    test('should throw error when cryptoAsset is invalid', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.sell({
        cryptoAsset: 'invalid_crypto',
        fiatCurrency: 'usd',
        cryptoAmount: 1_000_000_000_000_000_000n
      })).rejects.toThrow('Cannot find info for cryptoAsset and fiatCurrency')
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    test('should throw error when fiatCurrency is invalid', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.sell({
        cryptoAsset: 'eth',
        fiatCurrency: 'invalid_fiat',
        cryptoAmount: 1_000_000_000_000_000_000n
      })).rejects.toThrow('Cannot find info for cryptoAsset and fiatCurrency')
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    test('should throw error when fiat decimal is not found', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.sell({
        cryptoAsset: 'eth',
        fiatCurrency: 'bad_fiat',
        cryptoAmount: 1_000_000_000_000_000_000n
      })).rejects.toThrow('Could not determine decimals for fiat currency: bad_fiat')
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    test('should throw error if both cryptoAmount and fiatAmount are provided', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.sell({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1n,
        fiatAmount: 100n
      })).rejects.toThrow("'cryptoAmount' and 'fiatAmount' cannot both be provided")
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    test('should throw error if neither cryptoAmount nor fiatAmount is provided', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.sell({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd'
      })).rejects.toThrow("Either 'cryptoAmount' or 'fiatAmount' must be provided")
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })
  })

  describe('quoteBuy', () => {
    test('should successfully quote a buy transaction with a specified fiat amount', async () => {
      const MOCK_BUY_QUOTE = {
        baseCurrencyAmount: 1000,
        quoteCurrencyAmount: 0.3,
        feeAmount: 10,
        extraFeeAmount: 5,
        networkFeeAmount: 2,
        quoteCurrencyPrice: 3000.50
      }

      global.fetch = jest.fn()
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue(MOCK_CURRENCIES) })
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue(MOCK_BUY_QUOTE) })

      const buyQuote = await moonpay.quoteBuy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        fiatAmount: 1000_00n // 1000 USD
      })

      const expectedQuoteUrl = new URL('https://api.moonpay.com/v3/currencies/eth/buy_quote')
      expectedQuoteUrl.searchParams.append('apiKey', MOCK_API_KEY)
      expectedQuoteUrl.searchParams.append('baseCurrencyCode', 'usd')
      expectedQuoteUrl.searchParams.append('baseCurrencyAmount', '1000.00')

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenNthCalledWith(1, `https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(global.fetch).toHaveBeenNthCalledWith(2, expectedQuoteUrl.toString(), { headers: { accept: 'application/json' } })

      expect(buyQuote.cryptoAmount).toBe(300000000000000000n)
      expect(buyQuote.fiatAmount).toBe(100000n)
      expect(buyQuote.fee).toBe(1700n) // (10 + 5 + 2) * 100
      expect(buyQuote.rate).toBe('3000.5')
      expect(buyQuote.metadata).toEqual(MOCK_BUY_QUOTE)
    })

    test('should successfully quote a buy transaction with a specified crypto amount', async () => {
      const MOCK_BUY_QUOTE = {
        baseCurrencyAmount: 1000,
        quoteCurrencyAmount: 0.3,
        feeAmount: 10,
        extraFeeAmount: 5,
        networkFeeAmount: 2,
        quoteCurrencyPrice: 3000.50
      }

      global.fetch = jest.fn()
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue(MOCK_CURRENCIES) })
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue(MOCK_BUY_QUOTE) })

      const buyQuote = await moonpay.quoteBuy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1_000_000_000_000_000_000n
      })

      const expectedQuoteUrl = new URL('https://api.moonpay.com/v3/currencies/eth/buy_quote')
      expectedQuoteUrl.searchParams.append('apiKey', MOCK_API_KEY)
      expectedQuoteUrl.searchParams.append('baseCurrencyCode', 'usd')
      expectedQuoteUrl.searchParams.append('quoteCurrencyAmount', '1.00000')

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenNthCalledWith(1, `https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(global.fetch).toHaveBeenNthCalledWith(2, expectedQuoteUrl.toString(), { headers: { accept: 'application/json' } })

      expect(buyQuote.cryptoAmount).toBe(300000000000000000n)
      expect(buyQuote.fiatAmount).toBe(100000n)
      expect(buyQuote.fee).toBe(1700n) // (10 + 5 + 2) * 100
      expect(buyQuote.rate).toBe('3000.5')
      expect(buyQuote.metadata).toEqual(MOCK_BUY_QUOTE)
    })

    test('should throw error when buy quote fetch fails', async () => {
      global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Error'
      })

      await expect(moonpay.quoteBuy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        fiatAmount: 1000_00n
      })).rejects.toThrow(`Failed to fetch MoonPay buy quote: 500 Error`)

      expect(global.fetch).toHaveBeenNthCalledWith(1, `https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    test('should throw error when cryptoAsset is invalid', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.quoteBuy({
        cryptoAsset: 'invalid_crypto',
        fiatCurrency: 'usd',
        fiatAmount: 1000_00n
      })).rejects.toThrow('Cannot find info for cryptoAsset and fiatCurrency')

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    test('should throw error when fiatCurrency is invalid', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.quoteBuy({
        cryptoAsset: 'eth',
        fiatCurrency: 'invalid_fiat',
        fiatAmount: 1000_00n
      })).rejects.toThrow('Cannot find info for cryptoAsset and fiatCurrency')

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    test('should throw error when fiat decimal is not found', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.quoteBuy({
        cryptoAsset: 'eth',
        fiatCurrency: 'bad_fiat',
        fiatAmount: 1000_00n
      })).rejects.toThrow('Could not determine decimals for fiat currency: bad_fiat')

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    test('should throw error if both cryptoAmount and fiatAmount are provided', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.quoteBuy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1n,
        fiatAmount: 100n
      })).rejects.toThrow("'cryptoAmount' and 'fiatAmount' cannot both be provided")
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    test('should throw error if neither cryptoAmount nor fiatAmount is provided', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.quoteBuy({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd'
      })).rejects.toThrow("Either 'cryptoAmount' or 'fiatAmount' must be provided")
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })
  })

  describe('quoteSell', () => {
    test('should successfully quote a sell transaction with a specified crypto amount', async () => {
      const mockQuote = {
        baseCurrencyAmount: 1,
        quoteCurrencyAmount: 2950,
        feeAmount: 45,
        extraFeeAmount: 5,
        baseCurrencyPrice: 3000
      }

      global.fetch = jest.fn()
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue(MOCK_CURRENCIES) })
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue(mockQuote) })

      const sellQuote = await moonpay.quoteSell({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1_000_000_000_000_000_000n // 1 ETH
      })

      const expectedQuoteUrl = new URL('https://api.moonpay.com/v3/currencies/eth/sell_quote')
      expectedQuoteUrl.searchParams.append('apiKey', MOCK_API_KEY)
      expectedQuoteUrl.searchParams.append('quoteCurrencyCode', 'usd')
      expectedQuoteUrl.searchParams.append('baseCurrencyAmount', '1.00000')

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenNthCalledWith(1, `https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(global.fetch).toHaveBeenNthCalledWith(2, expectedQuoteUrl.toString(), { headers: { accept: 'application/json' } })

      expect(sellQuote.cryptoAmount).toBe(1000000000000000000n)
      expect(sellQuote.fiatAmount).toBe(295000n)
      expect(sellQuote.fee).toBe(5000n) // (45 + 5) * 100
      expect(sellQuote.rate).toBe('3000')
      expect(sellQuote.metadata).toEqual(mockQuote)
    })

    test('should throw error if cryptoAmount is not provided', async () => {
      await expect(moonpay.quoteSell({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd'
      })).rejects.toThrow("'cryptoAmount' must be provided")
    })

    test('should throw error when cryptoAsset is invalid', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.quoteSell({
        cryptoAsset: 'invalid_crypto',
        fiatCurrency: 'usd',
        cryptoAmount: 1_000_000_000_000_000_000n
      })).rejects.toThrow('Cannot find info for cryptoAsset and fiatCurrency')

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    test('should throw error when fiatCurrency is invalid', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.quoteSell({
        cryptoAsset: 'eth',
        fiatCurrency: 'invalid_fiat',
        cryptoAmount: 1_000_000_000_000_000_000n
      })).rejects.toThrow('Cannot find info for cryptoAsset and fiatCurrency')

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    test('should throw error when fiat decimal is not found', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.quoteSell({
        cryptoAsset: 'eth',
        fiatCurrency: 'bad_fiat',
        cryptoAmount: 1_000_000_000_000_000_000n
      })).rejects.toThrow('Could not determine decimals for fiat currency: bad_fiat')

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    test('should throw error when sell quote fetch fails', async () => {
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Error'
        })

      await expect(moonpay.quoteSell({
        cryptoAsset: 'eth',
        fiatCurrency: 'usd',
        cryptoAmount: 1_000_000_000_000_000_000n
      })).rejects.toThrow('Failed to fetch MoonPay sell quote: 500 Error')

      expect(global.fetch).toHaveBeenNthCalledWith(1, `https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('getSupportedCryptoAssets', () => {
    test('should successfully return supported crypto assets', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      const supportedCrypto = await moonpay.getSupportedCryptoAssets()

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(supportedCrypto).toHaveLength(1)
      expect(supportedCrypto[0].code).toBe('eth')
      expect(supportedCrypto[0].name).toBe('Ethereum')
    })

    test('should throw when asset fetch fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Error'
      })

      await expect(moonpay.getSupportedCryptoAssets())
        .rejects.toThrow('Failed to fetch MoonPay supported currencies: 500 Error')

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    describe('caching behavior', () => {
      beforeEach(() => {
        jest.useFakeTimers()
      })

      afterEach(() => {
        jest.useRealTimers()
      })

      test('should hit cache when asset data is still valid', async () => {
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
        })

        await moonpay.getSupportedCryptoAssets()
        await moonpay.getSupportedCryptoAssets()

        expect(global.fetch).toHaveBeenCalledTimes(1)
      })

      test('should re-fetch when cache is expired', async () => {
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
        })

        await moonpay.getSupportedCryptoAssets()
        expect(global.fetch).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(10 * 60 * 1000)

        await moonpay.getSupportedCryptoAssets()
        expect(global.fetch).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('getSupportedFiatCurrencies', () => {
    test('should successfully return supported fiat currencies, using precision as a fallback for decimals', async () => {
      const validCurrencies = MOCK_CURRENCIES.filter(c => c.code !== 'bad_fiat')
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(validCurrencies)
      })

      const supportedFiat = await moonpay.getSupportedFiatCurrencies()

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/currencies?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(supportedFiat).toHaveLength(2)
      expect(supportedFiat[0].code).toBe('usd')
      expect(supportedFiat[0].name).toBe('US Dollar')
      expect(supportedFiat[0].decimals).toBe(2)
      expect(supportedFiat[1].code).toBe('eur')
      expect(supportedFiat[1].name).toBe('The Euro')
      expect(supportedFiat[1].decimals).toBe(2) // EUR has null decimals from API, but precision is 2
    })

    test('should throw an error if decimals cannot be determined from decimals or precision', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CURRENCIES)
      })

      await expect(moonpay.getSupportedFiatCurrencies()).rejects.toThrow('Could not determine decimals for fiat currency: bad_fiat')
    })
  })

  describe('getSupportedCountries', () => {
    test('should successfully return supported countries', async () => {
      const MOCK_COUNTRIES = [
        { alpha2: 'US', alpha3: 'USA', name: 'United States', isBuyAllowed: true, isSellAllowed: true },
        { alpha3: 'CAN', name: 'Canada', isBuyAllowed: false, isSellAllowed: false } // No alpha2 to test fallback
      ]
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_COUNTRIES)
      })

      const countries = await moonpay.getSupportedCountries()

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/countries?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(countries).toHaveLength(2)

      expect(countries[0].code).toBe('US')
      expect(countries[0].name).toBe('United States')
      expect(countries[0].isBuyAllowed).toBe(true)
      expect(countries[0].isSellAllowed).toBe(true)
      expect(countries[0].metadata).toEqual(MOCK_COUNTRIES[0])

      expect(countries[1].code).toBe('CAN')
      expect(countries[1].name).toBe('Canada')
      expect(countries[1].isBuyAllowed).toBe(false)
      expect(countries[1].isSellAllowed).toBe(false)
      expect(countries[1].metadata).toEqual(MOCK_COUNTRIES[1])
    })

    test('should throw error when fetch fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Error'
      })

      await expect(moonpay.getSupportedCountries()).rejects.toThrow('Failed to fetch supported countries: 500 Error')
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/countries?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    test('should throw error when data is invalid', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'this is not an array' })
      })

      await expect(moonpay.getSupportedCountries()).rejects.toThrow('Failed to fetch supported countries')
      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/countries?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })
  })

  describe('getTransactionDetail', () => {
    test('should fetch buy transaction details correctly', async () => {
      const mockTx = { id: 'tx123', status: 'completed', currencyId: 'eth', baseCurrencyId: 'usd' }
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockTx)
      })

      const details = await moonpay.getTransactionDetail('tx123', 'buy')

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v1/transactions/tx123?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(details.status).toBe('completed')
      expect(details.cryptoAsset).toBe('eth')
      expect(details.fiatCurrency).toBe('usd')
      expect(details.metadata).toEqual(mockTx)
    })

    test('should fetch sell transaction details correctly', async () => {
      const mockTx = { id: 'tx123', status: 'pending', baseCurrencyId: 'eth', quoteCurrencyId: 'usd' }
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockTx)
      })

      const details = await moonpay.getTransactionDetail('tx123', 'sell')

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v3/sell_transactions/tx123?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(details.status).toBe('in_progress')
      expect(details.cryptoAsset).toBe('eth')
      expect(details.fiatCurrency).toBe('usd')
      expect(details.metadata).toEqual(mockTx)
    })

    test('should handle transaction status gracefully', async () => {
      const mockTx = { id: 'tx123', status: 'unknown', currencyId: 'eth', baseCurrencyId: 'usd' }
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockTx)
      })

      const details = await moonpay.getTransactionDetail('tx123', 'buy')

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v1/transactions/tx123?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(details.status).toBe('in_progress')
      expect(details.cryptoAsset).toBe('eth')
      expect(details.fiatCurrency).toBe('usd')
      expect(details.metadata).toEqual(mockTx)
    })

    test('should fetch buy transaction by default when direction is not declared', async () => {
      const mockTx = { id: 'tx123', status: 'failed', currencyId: 'eth', baseCurrencyId: 'usd' }
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockTx)
      })

      const details = await moonpay.getTransactionDetail('tx123') // No direction

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v1/transactions/tx123?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
      expect(details.status).toBe('failed')
    })

    test('should throw error when transaction fetch fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Error'
      })

      await expect(moonpay.getTransactionDetail('tx123')).rejects.toThrow('Failed to fetch MoonPay transaction detail: 500 Error')

      expect(global.fetch).toHaveBeenCalledWith(`https://api.moonpay.com/v1/transactions/tx123?apiKey=${MOCK_API_KEY}`, { headers: { accept: 'application/json' } })
    })

    test('should throw error when direction is invalid', async () => {
      global.fetch = jest.fn()

      await expect(moonpay.getTransactionDetail('tx123', 'invalid_direction')).rejects.toThrow('Invalid direction')

      expect(global.fetch).not.toHaveBeenCalled()
    })
  })
})