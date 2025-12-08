// Copyright 2024 Tether Operations Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict'

import { MoonPay } from "@moonpay/moonpay-node";
import { FiatProtocol } from "@tetherto/wdk-wallet/protocols";
import BigNumber from "bignumber.js";

/** @typedef {import('@tetherto/wdk-wallet').IWalletAccount} IWalletAccount */
/** @typedef {import('@tetherto/wdk-wallet').IWalletAccountReadOnly} IWalletAccountReadOnly */

/** @typedef {import("@tetherto/wdk-wallet/protocols").BuyOptions} BuyOptions */
/** @typedef {import("@tetherto/wdk-wallet/protocols").SellOptions} SellOptions */
/** @typedef {import('@tetherto/wdk-wallet/protocols').FiatTransactionStatus} FiatTransactionStatus */
/** @typedef {import('@tetherto/wdk-wallet/protocols').FiatTransactionDetail} FiatTransactionDetail */
/** @typedef {import('@tetherto/wdk-wallet/protocols').SupportedCountry} SupportedCountry */
/** @typedef {import('@tetherto/wdk-wallet/protocols').SupportedFiatCurrency} SupportedFiatCurrency */
/** @typedef {import('@tetherto/wdk-wallet/protocols').SupportedCryptoAsset} SupportedCryptoAsset */

/**
 * @typedef {Object} MoonPayWidgetUiParams
 * @property {string} [colorCode] - The hexadecimal color code for the widget's main color.
 * @property {'dark' | 'light'} [theme] - The default appearance for the widget.
 * @property {string} [themeId] - The ID of the theme created for your application or website.
 * @property {string} [language] - The ISO 639-1 standard language code for the widget.
 * @property {boolean} [showAllCurrencies] - If true, shows all cryptocurrencies enabled on your account.
 * @property {string} [showOnlyCurrencies] - A comma-separated list of currency codes to display.
 * @property {boolean} [showWalletAddressForm] - If true, shows the wallet address form even if an address is pre-filled.
 * @property {string} [redirectURL] - A URL to redirect the customer to after the flow is complete.
 * @property {string} [unsupportedRegionRedirectUrl] - A URL to redirect the customer to if they are from an unsupported region.
 * @property {boolean} [skipUnsupportedRegionScreen] - If true, skips the unsupported region screen and redirects immediately.
 */

/**
 * @typedef {MoonPayWidgetUiParams & {
 *   apiKey: string,
 *   currencyCode?: string,
 *   defaultCurrencyCode?: string,
 *   walletAddress?: string,
 *   walletAddressTag?: string,
 *   walletAddresses?: string,
 *   walletAddressTags?: string,
 *   baseCurrencyCode?: string,
 *   baseCurrencyAmount?: number,
 *   quoteCurrencyAmount?: number,
 *   contractAddress?: string,
 *   networkCode?: string,
 *   lockAmount?: boolean,
 *   email?: string,
 *   externalTransactionId?: string,
 *   externalCustomerId?: string,
 *   paymentMethod?: string
 * }} MoonPayBuyParams
 */

/**
 * @typedef {MoonPayWidgetUiParams & {
 *   apiKey: string,
 *   baseCurrencyCode?: string,
 *   defaultBaseCurrencyCode?: string,
 *   refundWalletAddress?: string,
 *   refundWalletAddresses?: string,
 *   quoteCurrencyCode?: string,
 *   baseCurrencyAmount?: number,
 *   quoteCurrencyAmount?: number,
 *   lockAmount?: boolean,
 *   email?: string,
 *   externalTransactionId?: string,
 *   externalCustomerId?: string,
 *   paymentMethod?: string
 * }} MoonPaySellParams
 */

/**
 * @typedef {Object} MoonPayBankDepositInfo
 * @property {string | null} iban - The IBAN of the bank account.
 * @property {string | null} bic - The BIC of the bank account.
 * @property {string | null} accountNumber - The account number of the bank account.
 * @property {string | null} sortCode - The sort code of the bank account.
 * @property {string | null} bankName - The name of the bank.
 * @property {string | null} bankAddress - The address of the bank.
 * @property {string} accountName - The account name of the bank account.
 * @property {string} accountAddress - The address of the bank account.
 */

/**
 * @typedef {Object} MoonPayFiatCurrencyDetails
 * @property {string} id - Unique identifier for the currency.
 * @property {string} createdAt - Time at which the object was created. Returned as an ISO 8601 string.
 * @property {string} updatedAt - Time at which the object was last updated. Returned as an ISO 8601 string.
 * @property {'fiat'} type - Always 'fiat'.
 * @property {string} name - The currency's name.
 * @property {string} code - The currency's code.
 * @property {number} precision - The currency's precision (number of digits after decimal point).
 * @property {number} decimals - The currency's decimals.
 * @property {number | null} minBuyAmount - Represents the minimum transaction buy amount when using this currency as a base currency.
 * @property {number | null} maxBuyAmount - Represents the maximum transaction buy amount when using this currency as a base currency.
 * @property {boolean} isSellSupported - Whether sales for this currency are supported.
 */

/**
 * @typedef {Object} MoonPayCryptoCurrencyDetails
 * @property {string} id - Unique identifier for the currency.
 * @property {string} createdAt - Time at which the object was created. Returned as an ISO 8601 string.
 * @property {string} updatedAt - Time at which the object was last updated. Returned as an ISO 8601 string.
 * @property {'crypto'} type - Always 'crypto'.
 * @property {string} name - The currency's name.
 * @property {string} code - The currency's code.
 * @property {number} precision - The currency's precision (number of digits after decimal point).
 * @property {number} decimals - The currency's decimals.
 * @property {number | null} minBuyAmount - Represents the minimum amount of cryptocurrency you can buy.
 * @property {number | null} maxBuyAmount - Represents the maximum amount of cryptocurrency you can buy.
 * @property {number | null} minSellAmount - The minimum amount of cryptocurrency you can sell.
 * @property {number | null} maxSellAmount - The maximum amount of cryptocurrency you can sell.
 * @property {string} addressRegex - A regular expression which you can test against your end user's wallet addresses.
 * @property {string} testnetAddressRegex - A regular expression which you can test against your end user's testnet wallet addresses.
 * @property {boolean} supportsAddressTag - Whether the currency supports address tags.
 * @property {string | null} addressTagRegex - A regular expression which you can test against a wallet address tag. Defined only if the currency supports address tags.
 * @property {boolean} supportsTestMode - Whether the currency supports test mode.
 * @property {boolean} isSuspended - Whether purchases for this currency are suspended.
 * @property {boolean} isSupportedInUs - Whether purchases for this currency are supported in the US.
 * @property {boolean} isSellSupported - Whether sales for this currency are supported.
 * @property {Array<string>} notAllowedUSStates - A list with all the US states for this currency that are not supported.
 * @property {Array<string>} notAllowedCountries - A list with all the ISO 3166-1 alpha-2 country codes for this currency that are not supported.
 * @property {object} metadata - Additional metadata for the currency.
 * @property {string | null} metadata.contractAddress - Unique contract address where the token smart contract is hosted.
 * @property {string | null} metadata.chainId - ID used to identify different EVM compatible chains.
 * @property {string} metadata.networkCode - Name of the cryptocurrency.
 */

/**
 * @typedef {Object} MoonPayBuyTransactionStage
 * @property {'stage_one_ordering' | 'stage_two_verification' | 'stage_three_processing' | 'stage_four_delivery'} stage - Stage type.
 * @property {'not_started' | 'in_progress' | 'success' | 'failed'} status - Stage status.
 * @property {string | null} failureReason - Possible values for failure reason.
 * @property {Array<{type: string, url: string}>} actions - An array of actions required for the stage.
 */

/**
 * Type definition for the status of a MoonPay transaction.
 * @typedef {'waitingForDeposit' | 'pending' | 'failed' | 'completed'} MoonPayTransactionStatus
 */

/**
 * @typedef {Object} MoonPayBuyTransaction
 * @property {string} id - Unique identifier for the object.
 * @property {string} createdAt - Time at which the object was created. Returned as an ISO 8601 string.
 * @property {string} updatedAt - Time at which the object was last updated. Returned as an ISO 8601 string.
 * @property {number} baseCurrencyAmount - A positive number representing how much the customer wants to sell.
 * @property {number} quoteCurrencyAmount - A positive number representing the amount of cryptocurrency the customer will receive.
 * @property {number} feeAmount - A positive number representing the fee for the transaction.
 * @property {number} extraFeeAmount - A positive number representing your extra fee for the transaction.
 * @property {string} paymentMethod - The transaction's payout method.
 * @property {number} networkFeeAmount - The network fee for the transaction.
 * @property {boolean} areFeesIncluded - A boolean indicating whether baseCurrencyAmount includes or excludes the feeAmount, extraFeeAmount and networkFeeAmount.
 * @property {MoonPayTransactionStatus} status - The transaction's status.
 * @property {string | null} failureReason - The transaction's failure reason. Set when transaction's status is failed.
 * @property {string} walletAddress - The cryptocurrency wallet address the purchased funds will be sent to.
 * @property {string | null} walletAddressTag - The secondary cryptocurrency wallet address identifier for coins such as EOS, XRP and XMR.
 * @property {string | null} cryptoTransactionId - The cryptocurrency transaction identifier representing the transfer to the customer's wallet. Set when the withdrawal has been executed.
 * @property {string | null} redirectUrl - The URL provided to you, when required, to which to redirect the customer as part of a redirect authentication flow.
 * @property {string} returnUrl - The URL the customer is returned to after they authenticate or cancel their payment on the payment method's app or site. If you are using our widget implementation, this is always our transaction tracker page, which provides the customer with real-time information about their transaction.
 * @property {string | null} widgetRedirectUrl - An optional URL used in a widget implementation. It is passed to us by you in the query parameters, and we include it as a link on the transaction tracker page.
 * @property {number} eurRate - The exchange rate between the transaction's base currency and Euro at the time of the transaction.
 * @property {number} usdRate - The exchange rate between the transaction's base currency and US Dollar at the time of the transaction.
 * @property {number} gbpRate - The exchange rate between the transaction's base currency and British Pound at the time of the transaction.
 * @property {MoonPayBankDepositInfo | null} bankDepositInformation - Information about the bank deposit.
 * @property {string | null} bankTransferReference - For bank transfer transactions, the reference code the customer should cite when making the transfer.
 * @property {string} currencyId - The identifier of the cryptocurrency the customer wants to purchase.
 * @property {MoonPayCryptoCurrencyDetails} currency - Details of the crypto currency.
 * @property {string} baseCurrencyId - The identifier of the fiat currency the customer wants to use for the transaction.
 * @property {MoonPayFiatCurrencyDetails} baseCurrency - Details of the fiat currency.
 * @property {string} customerId - The identifier of the customer the transaction is associated with.
 * @property {string | null} cardId - For token or card transactions, the identifier of the payment card used for this transaction.
 * @property {string | null} bankAccountId - For bank transfer transactions, the identifier of the bank account used for this transaction.
 * @property {string | null} externalCustomerId - An identifier associated with the customer, provided by you.
 * @property {string | null} externalTransactionId - An identifier associated with the transaction, provided by you.
 * @property {string} country - The customer's country. Returned as an ISO 3166-1 alpha-3 code.
 * @property {string | null} state - The customer's state, if the customer is from the USA. Returned as a two-letter code.
 * @property {string | null} cardType - The customer's state, if the customer is from the USA. Returned as a two-letter code.
 * @property {string} cardPaymentType - The customer's state, if the customer is from the USA. Returned as a two-letter code.
 * @property {Array<MoonPayBuyTransactionStage>} stages - An array of four objects, each representing one of the four stages of the purchase process.
 */

/**
 * @typedef {Object} MoonPaySellTransactionStage
 * @property {'sell_stage_one_verification' | 'sell_stage_two_waiting_for_deposit' | 'sell_stage_three_processing' | 'sell_stage_four_withdrawal'} stage - Stage type.
 * @property {'not_started' | 'in_progress' | 'success' | 'failed'} status - Stage status.
 * @property {string | null} failureReason - Possible values for failure reason.
 * @property {Array<{type: string, url: string}>} actions - An array of actions required for the stage.
 */

/**
 * @typedef {Object} MoonPaySellTransaction
 * @property {string} id - Unique identifier for the object.
 * @property {string} createdAt - Time at which the object was created. Returned as an ISO 8601 string.
 * @property {string} updatedAt - Time at which the object was last updated. Returned as an ISO 8601 string.
 * @property {number} baseCurrencyAmount - A positive number representing how much the customer wants to sell.
 * @property {number} quoteCurrencyAmount - A positive number representing the amount of cryptocurrency the customer will receive. Set when the purchase of cryptocurrency has been executed.
 * @property {number} feeAmount - A positive number representing the fee for the transaction.
 * @property {number} extraFeeAmount - A positive number representing your extra fee for the transaction.
 * @property {MoonPayTransactionStatus} status - The transaction's status.
 * @property {string | null} failureReason - The transaction's failure reason. Set when transaction's status is failed.
 * @property {string} refundWalletAddress - A wallet address at which the customer can receive cryptocurrency. In case we cannot process the sale of the customer's cryptocurrency, we will return the cryptocurrency to this wallet address. Might be empty
 * @property {string | null} depositHash - The cryptocurrency transaction identifier representing the transfer from the customer's wallet to MoonPay's wallet. Set when the deposit has been executed and received.
 * @property {string | null} widgetRedirectUrl - An optional URL used in a widget implementation. It is passed to us by you in the query parameters, and we include it as a link on the transaction tracker page.
 * @property {string} payoutMethod - The transaction's payout method.
 * @property {number} eurRate - The exchange rate between the transaction's base currency and Euro at the time of the transaction.
 * @property {number} usdRate - The exchange rate between the transaction's base currency and US Dollar at the time of the transaction.
 * @property {number} gbpRate - The exchange rate between the transaction's base currency and British Pound at the time of the transaction.
 * @property {string} quoteCurrencyId - The identifier of the fiat the customer wants to get.
 * @property {string} baseCurrencyId - The identifier of the crypto currency the customer wants to sell.
 * @property {string} customerId - The identifier of the customer the transaction is associated with.
 * @property {string | null} bankAccountId - The identifier of the bank account used for this transaction.
 * @property {string | null} externalCustomerId - An identifier associated with the customer, provided by you.
 * @property {string | null} externalTransactionId - An identifier associated with the transaction, provided by you.
 * @property {Array<MoonPaySellTransactionStage>} stages - An array of objects, each representing one of the stages of the sell process.
 * @property {MoonPayCryptoCurrencyDetails} baseCurrency - Details of the crypto currency.
 * @property {MoonPayFiatCurrencyDetails} quoteCurrency - Details of the fiat currency.
 */

/**
 * @typedef {Object} MoonPayCountryDetail
 * @property {string} alpha2 - The country's ISO 3166-1 alpha-2 code.
 * @property {string} alpha3 - The country's ISO 3166-1 alpha-3 code.
 * @property {boolean} isAllowed - Whether residents of this country can use the service.
 * @property {boolean} isBuyAllowed - Whether residents of this country can buy cryptocurrencies.
 * @property {boolean} isSellAllowed - Whether residents of this country can sell cryptocurrencies.
 * @property {string} name - The country's name.
 * @property {string[]} supportedDocuments - A list of supported identity documents for the country.
 */

/**
 * @typedef {FiatTransactionDetail & { metadata: MoonPayBuyTransaction | MoonPaySellTransaction }} MoonPayTransactionDetail
 */

/**
 * @typedef {SupportedCountry & { metadata: MoonPayCountryDetail }} MoonPaySupportedCountry
 */

/**
 * @typedef {SupportedCryptoAsset & { metadata: MoonPayCryptoCurrencyDetails }} MoonPaySupportedCryptoAsset
 */

/**
 * @typedef {SupportedFiatCurrency & { metadata: MoonPayFiatCurrencyDetails }} MoonPaySupportedFiatCurrency
 */

/**
 * @typedef {BuyOptions & { config?: Omit<MoonPayBuyParams, 'currencyCode' | 'baseCurrencyCode' | 'baseCurrencyAmount'> }} MoonPayBuyOptions
 */

/**
 * @typedef {SellOptions & { config?: Omit<MoonPaySellParams, 'baseCurrencyCode' | 'quoteCurrencyCode' | 'baseCurrencyAmount'> }} MoonPaySellOptions
 */

/**
 * Converts a MoonPay transaction status to a standardized WdkRampTransactionStatus.
 * @param {MoonPayTransactionStatus} moonPayStatus - The status from the MoonPay API.
 * @returns {FiatTransactionStatus} The standardized status.
 */
function toWdkStatus(moonPayStatus) {
  switch (moonPayStatus) {
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    case 'pending':
    case 'waitingForDeposit':
      return 'in_progress';
    default:
      return 'in_progress';
  }
}

const MOONPAY_API_DOMAIN = 'https://api.moonpay.com/'
const MOONPAY_CACHE_TIME = 10 * 60 * 1000

export default class MoonPayProtocol extends FiatProtocol {
  /**
   * @param {object} config - Configuration for the MoonPay handler.
   * @param {string} config.secretKey - Your secret key. MoonPay determines the environment (sandbox or production) based on this key.
   * @param {string} config.apiKey - Your publishable API key.
   * @param {number} [config.cacheTime]
   * @param {IWalletAccount | IWalletAccountReadOnly} [account]
   */
  constructor({ secretKey, apiKey, cacheTime = MOONPAY_CACHE_TIME }, account) {
    super(account)
    this._moonPay = new MoonPay(secretKey)
    this._apiKey = apiKey
    this._supportedCurrenciesCache = undefined
    this._cacheThreshold = cacheTime
  }

  /**
   * Generates a widget URL for a user to purchase a crypto asset with fiat currency.
   * @override
   * @param {MoonPayBuyOptions} options
   * @returns {Promise<string>} The URL for the user to complete the purchase.
   */
  async buy(options) {
    const { cryptoAsset, fiatCurrency, recipient, config } = options

    const params = {
      ...config,
      currencyCode: cryptoAsset,
      baseCurrencyCode: fiatCurrency
    }

    const supportedAssets = await this._fetchAndCacheSupportedCurrencies()

    const cryptoInfo = supportedAssets.find((asset) => asset.code === cryptoAsset)
    const fiatInfo = supportedAssets.find((asset) => asset.code === fiatCurrency)

    if (!cryptoInfo || !fiatInfo) {
      throw new Error('Cannot find info for cryptoAsset and fiatCurrency')
    }

    if ('cryptoAmount' in options) {
      params.quoteCurrencyAmount = new BigNumber(options.cryptoAmount)
        .shiftedBy(-1 * cryptoInfo.decimals)
        .toFixed(cryptoInfo.precision, 1)
    } else {
      params.baseCurrencyAmount = new BigNumber(options.fiatAmount)
        .shiftedBy(-1 * fiatInfo.decimals)
        .toFixed(fiatInfo.precision, 1)
    }

    if (this._account) {
      params.walletAddress = await this._account.getAddress()
    } else if (recipient) {
      params.walletAddress = recipient
    }

    const generatedUrl = this._moonPay.url.generate({
      flow: 'buy',
      params
    })

    return this._moonPay.url.generateSignature(generatedUrl, { returnFullUrl: true })
  }

  /**
   * Generates a widget URL for a user to sell a crypto asset for fiat currency.
   * @override
   * @param {MoonPaySellOptions} options The provider-specific code of the crypto asset to sell.
   * @returns {Promise<string>} The URL for the user to complete the sale.
   */
  async sell(options) {
    const { cryptoAsset, fiatCurrency, refundAddress, config } = options

    const params = {
      ...config,
      baseCurrencyCode: cryptoAsset,
      quoteCurrencyCode: fiatCurrency
    }

    const supportedAssets = await this._fetchAndCacheSupportedCurrencies()

    const cryptoInfo = supportedAssets.find((asset) => asset.code === cryptoAsset)
    const fiatInfo = supportedAssets.find((asset) => asset.code === fiatCurrency)

    if ('cryptoAmount' in options) {
      params.baseCurrencyAmount = new BigNumber(options.cryptoAmount)
        .shiftedBy(-1 * cryptoInfo.decimals)
        .toFixed(cryptoInfo, 1)
    } else {
      params.quoteCurrencyAmount = new BigNumber(options.fiatAmount)
        .shiftedBy(-1 * fiatInfo.decimals)
        .toFixed(fiatInfo.precision, 1)
    }

    if (this._account) {
      params.walletAddress = await this._account.getAddress()
    } else if (refundAddress) {
      params.refundWalletAddress = refundAddress
    }

    const generatedUrl = this._moonPay.url.generate({
      flow: 'sell',
      params
    })

    return this._moonPay.url.generateSignature(generatedUrl, { returnFullUrl: true })
  }

  /**
   * Retrieves the details of a specific transaction from the provider.
   * @override
   * @param {string} txId - The unique identifier of the transaction.
   * @param {'buy' | 'sell'} [direction] - The direction of the transaction.
   * @returns {Promise<MoonPayTransactionDetail>} The transaction details.
   */
  async getTransactionDetail(txId, direction = 'buy') {
    if (!['buy', 'sell'].includes(direction)) {
      throw new Error('Invalid direction')
    }

    const path = direction === 'buy' ? `v1/transactions/${txId}` : `v3/sell_transactions/${txId}`

    const url = new URL(path, MOONPAY_API_DOMAIN)

    url.searchParams.append('apiKey', this._apiKey)

    const resp = await fetch(url.toString(), {
      headers: {
        accept: 'application/json'
      }
    })

    const moonPayTransaction = await resp.json()
    const cryptoAsset = direction === 'buy' ? moonPayTransaction.currencyId : moonPayTransaction.baseCurrencyId
    const fiatCurrency = direction === 'buy' ? moonPayTransaction.baseCurrencyId : moonPayTransaction.quoteCurrencyId

    return {
      status: toWdkStatus(moonPayTransaction.status),
      cryptoAsset,
      fiatCurrency,
      metadata: moonPayTransaction
    }
  }

  /**
   * Fetches and caches supported currencies from MoonPay.
   * @private
   * @returns {Promise<Array<MoonPayCryptoCurrencyDetails | MoonPayFiatCurrencyDetails>>}
   */
  async _fetchAndCacheSupportedCurrencies() {
    const now = Date.now()

    if (!this._supportedCurrenciesCache || (now - this._supportedCurrenciesCache.timestamp >= this._cacheThreshold)) {
      const url = new URL('v3/currencies', MOONPAY_API_DOMAIN)
      url.searchParams.append('apiKey', this._apiKey)

      const resp = await fetch(url.toString(), {
        headers: { accept: 'application/json' }
      })

      if (!resp.ok) {
        throw new Error(`Failed to fetch MoonPay supported currencies: ${resp.status} ${resp.statusText}`)
      }

      const data = await resp.json()

      this._supportedCurrenciesCache = {
        timestamp: now,
        data
      }
    }

    return this._supportedCurrenciesCache?.data || []
  }

  /**
   * Retrieves a list of supported crypto assets from the provider.
   * @override
   * @returns {Promise<MoonPaySupportedCryptoAsset[]>} An array of supported crypto assets.
   */
  async getSupportedCryptoAssets() {
    const allCurrencies = await this._fetchAndCacheSupportedCurrencies()

    return allCurrencies
      .filter((currency) => currency.type === 'crypto')
      .map((assetDetail) => {
        return {
          code: assetDetail.code,
          decimals: assetDetail.decimals,
          networkCode: assetDetail.metadata.networkCode,
          name: assetDetail.name,
          metadata: assetDetail
        }
      })
  }

  /**
   * Retrieves a list of supported fiat currencies from the provider.
   * @override
   * @returns {Promise<MoonPaySupportedFiatCurrency[]>} An array of supported fiat currencies.
   */
  async getSupportedFiatCurrencies() {
    const allCurrencies = await this._fetchAndCacheSupportedCurrencies()

    return allCurrencies
      .filter((currency) => currency.type === 'fiat')
      .map((currencyDetail) => {
        return {
          code: currencyDetail.code,
          decimals: currencyDetail.decimals,
          name: currencyDetail.name,
          metadata: currencyDetail
        }
      })
  }

  /**
   * Retrieves a list of supported countries from the provider.
   * @override
   * @returns {Promise<MoonPaySupportedCountry[]>} An array of supported countries.
   */
  async getSupportedCountries() {
    const url = new URL('v3/countries', MOONPAY_API_DOMAIN)

    url.searchParams.append('apiKey', this._apiKey)

    const resp = await fetch(url.toString(), {
      headers: {
        accept: 'application/json'
      }
    })

    if (!resp.ok) {
      throw new Error(`Failed to fetch supported countries: ${resp.status} ${resp.statusText}`)
    }

    const moonPaySupportedCountries = await resp.json()

    if (!Array.isArray(moonPaySupportedCountries)) {
      throw new Error('Failed to fetch supported countries')
    }

    return moonPaySupportedCountries.map((countryDetail) => {
      return {
        code: countryDetail.alpha2 || countryDetail.alpha3,
        isBuyAllowed: countryDetail.isBuyAllowed,
        isSellAllowed: countryDetail.isSellAllowed,
        name: countryDetail.name,
        metadata: countryDetail
      }
    })
  }
}