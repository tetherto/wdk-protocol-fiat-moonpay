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

import { FiatProtocol } from '@tetherto/wdk-wallet/protocols'
import BigNumber from 'bignumber.js'

/** @typedef {import('@tetherto/wdk-wallet').IWalletAccount} IWalletAccount */
/** @typedef {import('@tetherto/wdk-wallet').IWalletAccountReadOnly} IWalletAccountReadOnly */

/** @typedef {import("@tetherto/wdk-wallet/protocols").BuyOptions} BuyOptions */
/** @typedef {import("@tetherto/wdk-wallet/protocols").BuyResult} BuyResult */

/** @typedef {import("@tetherto/wdk-wallet/protocols").SellOptions} SellOptions */
/** @typedef {import("@tetherto/wdk-wallet/protocols").SellCommonOptions} SellCommonOptions */
/** @typedef {import("@tetherto/wdk-wallet/protocols").SellExactCryptoAmountOptions} SellExactCryptoAmountOptions */
/** @typedef {import("@tetherto/wdk-wallet/protocols").SellResult} SellResult */

/** @typedef {import('@tetherto/wdk-wallet/protocols').FiatQuote} FiatQuote */

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
 * @typedef {Object} MoonPayWidgetUiBuyParams
 * @property {string} [defaultCurrencyCode] - The code of the cryptocurrency you would prefer the customer to purchase. The customer can still select another currency. If both currencyCode and defaultCurrencyCode are passed, currencyCode will take precedence.
 * @property {string} [walletAddress] - The cryptocurrency wallet address the purchased funds will be sent to. If you pass a valid wallet address the customer won't be prompted to enter one.
 * @property {string} [walletAddressTag] - The secondary cryptocurrency wallet address identifier/memo for coins such as EOS, XLM, XRP and XMR. This parameter will be skipped if walletAddress or currencyCode is not passed.
 * @property {string} [walletAddresses] - A JSON string representing the wallet addresses you want to use for multiple cryptocurrencies. If the customer selects a cryptocurrency for which you have passed a valid wallet address, the customer won't be prompted to enter one. The currency code must be lowercase.
 * @property {string} [walletAddressTags] - A JSON string representing the wallet address tags you want to use for various cryptocurrencies. An example with EOS and XRP wallet address tags: {"eos":"myeostag","xrp":"0123456789"}.
 * @property {string} [contractAddress] - The contract address of the token you want pre-selected for the user in the widget. [Only supported for DeFi Buy integrations.]
 * @property {string} [networkCode] - Defines the network where the token contract exists (e.g., solana, ethereum). Must match the blockchain where the token contract is deployed. [Only supported for DeFi Buy integrations.]
 * @property {boolean} [lockAmount] - Set this parameter to true to lock the baseCurrencyAmount set for the customer and prevent them from modifying it. This parameter will be skipped if baseCurrencyAmount is not passed.
 * @property {string} [email] - The customer's email address. If you pass a valid email address, the customer won't be prompted to enter one.
 * @property {string} [externalTransactionId] - An identifier you would like to associate with the transaction. This identifier will be present whenever we pass you transaction data.
 * @property {string} [externalCustomerId] - An identifier you would like to associate with the customer. This identifier will be present whenever we pass you customer data, allowing you to match our data with your own existing customer data.
 * @property {string} [paymentMethod] - Pre-select the payment method you want the customer to use.
 */

/** @typedef {MoonPayWidgetUiParams & MoonPayWidgetUiBuyParams } MoonPayBuyParams */

/**
 * @typedef {Object} MoonPayWidgetUiSellParams
 * @property {string} [defaultBaseCurrencyCode] - The code of the cryptocurrency you would prefer the customer to sell. If you pass a defaultBaseCurrencyCode, the currency will be selected by default, but the customer will still be able to select another currency.
 * @property {string} [refundWalletAddresses] - A JSON string representing the wallet addresses you want to use for various cryptocurrencies in case we have to issue a refund. An example with BTC and BCH wallet addresses: {"btc": "tb1qst9rvjnhym6kwmdkwgfs4h5dtp7cau5346jp9x", "bch": "bchtest:qraax8trdwct02968swqf4mpq3y5msqp8y7tmalm77"}
 * @property {boolean} [lockAmount] - Set this parameter to true to lock the baseCurrencyAmount set for the customer and prevent them from modifying it. This parameter will be skipped if baseCurrencyAmount is not passed.
 * @property {string} [email] - The customer's email address. If you pass a valid email address, the customer won't be prompted to enter one.
 * @property {string} [externalTransactionId] - An identifier you would like to associate with the transaction. This identifier will be present whenever we pass you transaction data.
 * @property {string} [externalCustomerId] - An identifier you would like to associate with the customer. This identifier will be present whenever we pass you customer data, allowing you to match our data with your own existing customer data.
 * @property {string} [paymentMethod] - Pre-select the payout method you want the customer to use.
 */

/** @typedef {MoonPayWidgetUiParams & MoonPayWidgetUiSellParams } MoonPaySellParams */

/**
 * @typedef {Object} MoonPayQuoteBuyParams
 * @property {number} [extraFeePercentage] - A positive integer representing your extra fee percentage for the transaction. The minimum is 0 and the maximum is 10. If you don't provide it, we'll use the default value set to your account.
 * @property {string} [paymentMethod] - The transaction's payment method.
 * @property {boolean} [areFeesIncluded] - A boolean indicating whether baseCurrencyAmount should include extra fees. Defaults to false.
 * @property {string} [walletAddress] - Wallet address of the customer who requested the quote.
 */

/**
 * @typedef {Object} MoonPayQuoteSellParams
 * @property {number} [extraFeePercentage] - A positive integer representing your extra fee percentage for the transaction. The minimum is 0 and the maximum is 10. If you don't provide it, we'll use the default value set to your account.
 * @property {string} [payoutMethod] - The transaction's payment method.
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
 * @property {number | null} decimals - The currency's decimals.
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
 * @typedef {Object} MoonPayBuyQuoteMetadata
 * @property {string} accountId - ID of your business account
 * @property {MoonPayFiatCurrencyDetails} baseCurrency - The fiat currency the customer wants to use for the transaction.
 * @property {string} baseCurrencyCode
 * @property {number} baseCurrencyAmount - A positive number representing how much the customer wants to spend. The minimum amount is 20.
 * @property {MoonPayCryptoCurrencyDetails} quoteCurrency - The cryptocurrency the customer wants to purchase.
 * @property {string} quoteCurrencyCode
 * @property {number} quoteCurrencyAmount - A positive number representing the amount of cryptocurrency the customer will receive. Set when the purchase of cryptocurrency has been executed.
 * @property {number} quoteCurrencyPrice - The price of the crypto the customer will receive
 * @property {string} paymentMethod - The transaction's payment method.
 * @property {number} feeAmount - A positive number representing the fee for the transaction.
 * @property {number} extraFeePercentage
 * @property {number} extraFeeAmount
 * @property {number} networkFeeAmount - A positive number representing the network fee for the transaction. It is added to baseCurrencyAmount, feeAmount and extraFeeAmount when the customer's card is charged.
 * @property {boolean} networkFeeAmountNonRefundable
 * @property {number} totalAmount
 * @property {string | null} externalId
 * @property {string | null} externalCustomerId
 * @property {string | null} signature - The signature for executing the quote for fixed flow
 * @property {number | null} expiresIn - The time in seconds until the quote expires.
 * @property {string | null} expiresAt - Time at which the quote expires. Returned as an ISO 8601 string.
 */

/**
 * @typedef {Object} MoonPaySellQuoteMetadata
 * @property {string} quoteCurrencyCode - Fiat currency the customer wants to get.
 * @property {MoonPayFiatCurrencyDetails} quoteCurrency - The fiat currency the customer wants to use for the transaction.
 * @property {string} baseCurrencyCode - Crypto currency the customer wants to sell.
 * @property {MoonPayCryptoCurrencyDetails} baseCurrency - The cryptocurrency the customer wants to sell.
 * @property {number} baseCurrencyAmount - A positive number representing how much the customer wants to sell.
 * @property {number} quoteCurrencyAmount - A positive number representing the amount of cryptocurrency the customer will receive.
 * @property {number} baseCurrencyPrice - The price of the crypto the customer wants to sell
 * @property {number} feeAmount - A positive number representing the fee for the transaction.
 * @property {number} extraFeeAmount - A positive number representing your extra fee for the transaction.
 * @property {string} payoutMethod - The transaction's payout method.
 * @property {string | null} signature - The signature for executing the quote for fixed flow
 * @property {number | null} expiresIn - The time in seconds until the quote expires.
 * @property {string | null} expiresAt - Time at which the quote expires. Returned as an ISO 8601 string.
 */

/** @typedef {FiatTransactionDetail & { metadata: MoonPayBuyTransaction | MoonPaySellTransaction }} MoonPayTransactionDetail */

/** @typedef {SupportedCountry & { metadata: MoonPayCountryDetail }} MoonPaySupportedCountry */

/** @typedef {SupportedCryptoAsset & { metadata: MoonPayCryptoCurrencyDetails }} MoonPaySupportedCryptoAsset */

/** @typedef {SupportedFiatCurrency & { metadata: MoonPayFiatCurrencyDetails }} MoonPaySupportedFiatCurrency */

/** @typedef {BuyOptions & { config?: MoonPayBuyParams }} MoonPayBuyOptions */

/** @typedef {Omit<BuyOptions, 'recipient'> & { config?: MoonPayQuoteBuyParams }} MoonPayQuoteBuyOptions */

/** @typedef {FiatQuote & { metadata: MoonPayBuyQuoteMetadata }} MoonPayBuyQuote */

/** @typedef {Omit<SellCommonOptions, 'refundAddress'> & SellExactCryptoAmountOptions & { config?: MoonPayQuoteSellParams }} MoonPayQuoteSellOptions */

/** @typedef {FiatQuote & { metadata: MoonPaySellQuoteMetadata }} MoonPaySellQuote */

/** @typedef {SellOptions & { config?: MoonPaySellParams }} MoonPaySellOptions */

/**
 * @typedef {Object} MoonPayProtocolConfig
 * @property {string} apiKey - Your publishable Moonpay API key.
 * @property {(urlForSignature: string) => Promise<string>} [signUrl] - Callback used to sign buy/sell URLs via a trusted provider (e.g., a backend service). If not provided, the protocol returns unsigned URLs.
 * @property {number} [cacheTime] - The duration in milliseconds to cache supported currencies.
 * @property {"production" | "sandbox"} [environment] - The environment to use for MoonPay endpoints and widget URLs. Defaults to "production". Use "production" for live transactions and "sandbox" for testing with non-real funds.
 */

/**
 * Converts a MoonPay transaction status to a standardized WdkRampTransactionStatus.
 * @param {MoonPayTransactionStatus} moonPayStatus - The status from the MoonPay API.
 * @returns {FiatTransactionStatus} The standardized status.
 */
function toWdkStatus (moonPayStatus) {
  switch (moonPayStatus) {
    case 'completed':
      return 'completed'
    case 'failed':
      return 'failed'
    case 'pending':
    case 'waitingForDeposit':
      return 'in_progress'
    default:
      return 'in_progress'
  }
}

/**
 * Gets the decimals for a fiat currency, falling back to precision.
 * @param {MoonPayFiatCurrencyDetails} currencyDetail
 * @returns {number}
 */
function getFiatDecimals (currencyDetail) {
  const decimals = currencyDetail.decimals ?? currencyDetail.precision

  if (typeof decimals !== 'number') {
    throw new Error(`Could not determine decimals for fiat currency: ${currencyDetail.code}`)
  }
  return decimals
}

const MOONPAY_ORIGINS = {
  API: 'https://api.moonpay.com/',
  BUY: {
    production: 'https://buy.moonpay.com/',
    sandbox: 'https://buy-sandbox.moonpay.com'
  },
  SELL: {
    production: 'https://sell.moonpay.com/',
    sandbox: 'https://sell-sandbox.moonpay.com'
  }
}
const MOONPAY_CACHE_TIME = 10 * 60 * 1000

export default class MoonPayProtocol extends FiatProtocol {
  /**
   * Creates a new interface to interact with the MoonPay protocol without binding it to a wallet account.
   *
   * @overload
   * @param {undefined} account - The wallet account to use to interact with the protocol.
   * @param {MoonPayProtocolConfig} config - The MoonPay protocol configuration.
   */

  /**
   * Creates a new read-only interface to interact with the MoonPay protocol.
   *
   * @overload
   * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
   * @param {MoonPayProtocolConfig} config - The MoonPay protocol configuration.
   */

  /**
   * Creates a new interface to interact with the MoonPay protocol.
   *
   * @overload
   * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
   * @param {MoonPayProtocolConfig} config - The MoonPay protocol configuration.
   */
  constructor (account, { apiKey, signUrl, environment = 'production', cacheTime = MOONPAY_CACHE_TIME }) {
    super(account)

    /** @private */
    this._apiKey = apiKey

    /** @private */
    this._signUrl = signUrl

    /** @private */
    this._environment = environment

    /** @private */
    this._supportedCurrenciesCache = undefined

    /** @private */
    this._cacheThreshold = cacheTime
  }

  /** @private */
  async _getAssetDetails (cryptoAsset, fiatCurrency) {
    const supportedAssets = await this._fetchAndCacheSupportedCurrencies()

    const cryptoInfo = supportedAssets.find((asset) => asset.code === cryptoAsset)
    const fiatInfo = supportedAssets.find((asset) => asset.code === fiatCurrency)

    if (!cryptoInfo || !fiatInfo) {
      throw new Error('Cannot find info for cryptoAsset and fiatCurrency')
    }
    return { cryptoInfo, fiatInfo }
  }

  /**
   * Generates a widget URL for a user to purchase a crypto asset with fiat currency.
   * @override
   * @param {MoonPayBuyOptions} options - The options for the purchase.
   * @returns {Promise<BuyResult>} The URL for the user to complete the purchase.
   */
  async buy (options) {
    const { cryptoAsset, fiatCurrency, recipient, config } = options

    const params = {
      ...config,
      currencyCode: cryptoAsset,
      baseCurrencyCode: fiatCurrency,
      apiKey: this._apiKey
    }

    const { cryptoInfo, fiatInfo } = await this._getAssetDetails(cryptoAsset, fiatCurrency)

    const fiatDecimals = getFiatDecimals(fiatInfo)

    if ('cryptoAmount' in options && 'fiatAmount' in options) {
      throw new Error('\'cryptoAmount\' and \'fiatAmount\' cannot both be provided')
    }

    if ('cryptoAmount' in options) {
      params.quoteCurrencyAmount = new BigNumber(options.cryptoAmount)
        .shiftedBy(-1 * cryptoInfo.decimals)
        .toFixed(cryptoInfo.precision, 1)
    } else if ('fiatAmount' in options) {
      params.baseCurrencyAmount = new BigNumber(options.fiatAmount)
        .shiftedBy(-1 * fiatDecimals)
        .toFixed(fiatInfo.precision, 1)
    } else {
      throw new Error('Either \'cryptoAmount\' or \'fiatAmount\' must be provided')
    }

    if (recipient) {
      params.walletAddress = recipient
    } else if (this._account) {
      params.walletAddress = await this._account.getAddress()
    }

    const url = new URL('/', MOONPAY_ORIGINS.BUY[this._environment])

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })

    const urlForSignature = url.toString()

    if (!this._signUrl) {
      return {
        buyUrl: urlForSignature
      }
    }

    const buyUrl = await this._signUrl(urlForSignature)

    return {
      buyUrl
    }
  }

  /**
   * Gets a quote for a crypto asset purchase.
   * @override
   * @param {MoonPayQuoteBuyOptions} options - The options for the quote.
   * @returns {Promise<MoonPayBuyQuote>} A quote for the transaction.
   */
  async quoteBuy (options) {
    const { cryptoAsset, fiatCurrency, config } = options

    const params = {
      ...config,
      baseCurrencyCode: fiatCurrency
    }

    const { cryptoInfo, fiatInfo } = await this._getAssetDetails(cryptoAsset, fiatCurrency)

    const fiatDecimals = getFiatDecimals(fiatInfo)

    if ('cryptoAmount' in options && 'fiatAmount' in options) {
      throw new Error('\'cryptoAmount\' and \'fiatAmount\' cannot both be provided')
    }

    if ('cryptoAmount' in options) {
      params.quoteCurrencyAmount = new BigNumber(options.cryptoAmount)
        .shiftedBy(-1 * cryptoInfo.decimals)
        .toFixed(cryptoInfo.precision, 1)
    } else if ('fiatAmount' in options) {
      params.baseCurrencyAmount = new BigNumber(options.fiatAmount)
        .shiftedBy(-1 * fiatDecimals)
        .toFixed(fiatInfo.precision, 1)
    } else {
      throw new Error('Either \'cryptoAmount\' or \'fiatAmount\' must be provided')
    }

    const url = new URL(`v3/currencies/${cryptoAsset}/buy_quote`, MOONPAY_ORIGINS.API)

    url.searchParams.append('apiKey', this._apiKey)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })

    const resp = await fetch(url.toString(), {
      headers: { accept: 'application/json' }
    })

    if (!resp.ok) {
      throw new Error(`Failed to fetch MoonPay buy quote: ${resp.status} ${resp.statusText}`)
    }

    const quote = await resp.json()

    const cryptoAmount = new BigNumber(quote.quoteCurrencyAmount).shiftedBy(cryptoInfo.decimals)
    const fiatAmount = new BigNumber(quote.baseCurrencyAmount).shiftedBy(fiatDecimals)
    const totalFee = new BigNumber(quote.feeAmount).plus(quote.extraFeeAmount).plus(quote.networkFeeAmount).shiftedBy(fiatDecimals)

    return {
      cryptoAmount: BigInt(cryptoAmount.toFixed()),
      fiatAmount: BigInt(fiatAmount.toFixed()),
      fee: BigInt(totalFee.toFixed()),
      rate: quote.quoteCurrencyPrice.toString(),
      metadata: quote
    }
  }

  /**
   * Gets a quote for a crypto asset sale.
   * @override
   * @param {MoonPayQuoteSellOptions} options - The options for the quote.
   * @returns {Promise<MoonPaySellQuote>} A quote for the transaction.
   */
  async quoteSell (options) {
    const { cryptoAsset, fiatCurrency, cryptoAmount, config } = options

    if (cryptoAmount === undefined) {
      throw new Error('\'cryptoAmount\' must be provided')
    }

    const params = {
      ...config,
      quoteCurrencyCode: fiatCurrency
    }

    const { cryptoInfo, fiatInfo } = await this._getAssetDetails(cryptoAsset, fiatCurrency)

    const fiatDecimals = getFiatDecimals(fiatInfo)

    params.baseCurrencyAmount = new BigNumber(cryptoAmount)
      .shiftedBy(-1 * cryptoInfo.decimals)
      .toFixed(cryptoInfo.precision, 1)

    const url = new URL(`v3/currencies/${cryptoAsset}/sell_quote`, MOONPAY_ORIGINS.API)

    url.searchParams.append('apiKey', this._apiKey)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })

    const resp = await fetch(url.toString(), {
      headers: { accept: 'application/json' }
    })

    if (!resp.ok) {
      throw new Error(`Failed to fetch MoonPay sell quote: ${resp.status} ${resp.statusText}`)
    }

    const quote = await resp.json()

    const quotedCryptoAmount = new BigNumber(quote.baseCurrencyAmount).shiftedBy(cryptoInfo.decimals)
    const quotedFiatAmount = new BigNumber(quote.quoteCurrencyAmount).shiftedBy(fiatDecimals)
    const totalFee = new BigNumber(quote.feeAmount).plus(quote.extraFeeAmount).shiftedBy(fiatDecimals)

    return {
      cryptoAmount: BigInt(quotedCryptoAmount.toFixed()),
      fiatAmount: BigInt(quotedFiatAmount.toFixed()),
      fee: BigInt(totalFee.toFixed()),
      rate: quote.baseCurrencyPrice.toString(),
      metadata: quote
    }
  }

  /**
   * Generates a widget URL for a user to sell a crypto asset for fiat currency.
   * @override
   * @param {MoonPaySellOptions} options - The options for the sale.
   * @returns {Promise<SellResult>} The URL for the user to complete the sale.
   */
  async sell (options) {
    const { cryptoAsset, fiatCurrency, refundAddress, config } = options

    const params = {
      ...config,
      baseCurrencyCode: cryptoAsset,
      quoteCurrencyCode: fiatCurrency,
      apiKey: this._apiKey
    }

    const { cryptoInfo, fiatInfo } = await this._getAssetDetails(cryptoAsset, fiatCurrency)

    const fiatDecimals = getFiatDecimals(fiatInfo)

    if ('cryptoAmount' in options && 'fiatAmount' in options) {
      throw new Error('\'cryptoAmount\' and \'fiatAmount\' cannot both be provided')
    }

    if ('cryptoAmount' in options) {
      params.baseCurrencyAmount = new BigNumber(options.cryptoAmount)
        .shiftedBy(-1 * cryptoInfo.decimals)
        .toFixed(cryptoInfo.precision, 1)
    } else if ('fiatAmount' in options) {
      params.quoteCurrencyAmount = new BigNumber(options.fiatAmount)
        .shiftedBy(-1 * fiatDecimals)
        .toFixed(fiatInfo.precision, 1)
    } else {
      throw new Error('Either \'cryptoAmount\' or \'fiatAmount\' must be provided')
    }

    if (refundAddress) {
      params.refundWalletAddress = refundAddress
    } else if (this._account) {
      params.refundWalletAddress = await this._account.getAddress()
    }

    const url = new URL('/', MOONPAY_ORIGINS.SELL[this._environment])

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })

    const urlForSignature = url.toString()

    if (!this._signUrl) {
      return {
        buyUrl: urlForSignature
      }
    }

    const sellUrl = await this._signUrl(urlForSignature)

    return {
      sellUrl
    }
  }

  /**
   * Retrieves the details of a specific transaction from the provider.
   * @override
   * @param {string} txId - The unique identifier of the transaction.
   * @param {'buy' | 'sell'} [direction] - The direction of the transaction.
   * @returns {Promise<MoonPayTransactionDetail>} The transaction details.
   */
  async getTransactionDetail (txId, direction = 'buy') {
    if (!['buy', 'sell'].includes(direction)) {
      throw new Error('Invalid direction')
    }

    const path = direction === 'buy' ? `v1/transactions/${txId}` : `v3/sell_transactions/${txId}`

    const url = new URL(path, MOONPAY_ORIGINS.API)

    url.searchParams.append('apiKey', this._apiKey)

    const resp = await fetch(url.toString(), {
      headers: {
        accept: 'application/json'
      }
    })

    if (!resp.ok) {
      throw new Error(`Failed to fetch MoonPay transaction detail: ${resp.status} ${resp.statusText}`)
    }

    const moonPayTransaction = await resp.json()
    const cryptoAssetId = direction === 'buy' ? moonPayTransaction.currencyId : moonPayTransaction.baseCurrencyId
    const fiatCurrencyId = direction === 'buy' ? moonPayTransaction.baseCurrencyId : moonPayTransaction.quoteCurrencyId

    return {
      status: toWdkStatus(moonPayTransaction.status),
      cryptoAsset: cryptoAssetId,
      fiatCurrency: fiatCurrencyId,
      metadata: moonPayTransaction
    }
  }

  /**
   * Fetches and caches supported currencies from MoonPay.
   * @private
   * @returns {Promise<Array<MoonPayCryptoCurrencyDetails | MoonPayFiatCurrencyDetails>>}
   */
  async _fetchAndCacheSupportedCurrencies () {
    const now = Date.now()

    if (!this._supportedCurrenciesCache || (now - this._supportedCurrenciesCache.timestamp >= this._cacheThreshold)) {
      const url = new URL('v3/currencies', MOONPAY_ORIGINS.API)
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
  async getSupportedCryptoAssets () {
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
  async getSupportedFiatCurrencies () {
    const allCurrencies = await this._fetchAndCacheSupportedCurrencies()

    return allCurrencies
      .filter((currency) => currency.type === 'fiat')
      .map((currencyDetail) => ({
        code: currencyDetail.code,
        decimals: getFiatDecimals(currencyDetail),
        name: currencyDetail.name,
        metadata: currencyDetail
      }))
  }

  /**
   * Retrieves a list of supported countries from the provider.
   * @override
   * @returns {Promise<MoonPaySupportedCountry[]>} An array of supported countries.
   */
  async getSupportedCountries () {
    const url = new URL('v3/countries', MOONPAY_ORIGINS.API)

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
