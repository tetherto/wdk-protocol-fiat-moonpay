export default class MoonPayProtocol extends FiatProtocol {
    /**
     * Creates a new interface to interact with the MoonPay protocol without binding it to a wallet account.
     *
     * @overload
     * @param {undefined} account - The wallet account to use to interact with the protocol.
     * @param {MoonPayProtocolConfig} config - The MoonPay protocol configuration.
     */
    constructor(account: undefined, config: MoonPayProtocolConfig);
    /**
     * Creates a new read-only interface to interact with the MoonPay protocol.
     *
     * @overload
     * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
     * @param {MoonPayProtocolConfig} config - The MoonPay protocol configuration.
     */
    constructor(account: IWalletAccountReadOnly, config: MoonPayProtocolConfig);
    /**
     * Creates a new interface to interact with the MoonPay protocol.
     *
     * @overload
     * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
     * @param {MoonPayProtocolConfig} config - The MoonPay protocol configuration.
     */
    constructor(account: IWalletAccount, config: MoonPayProtocolConfig);
    /** @private */
    private _apiKey;
    /** @private */
    private _signUrl;
    /** @private */
    private _environment;
    /** @private */
    private _supportedCurrenciesCache;
    /** @private */
    private _cacheThreshold;
    /** @private */
    private _getAssetDetails(cryptoAsset: string, fiatCurrency: string): Promise<{
        cryptoInfo: MoonPayCryptoCurrencyDetails;
        fiatInfo: MoonPayFiatCurrencyDetails;
    }>;
    /**
     * Generates a widget URL for a user to purchase a crypto asset with fiat currency.
     * @override
     * @param {MoonPayBuyOptions} options - The options for the purchase.
     * @returns {Promise<BuyResult>} The URL for the user to complete the purchase.
     */
    override buy(options: MoonPayBuyOptions): Promise<BuyResult>;
    /**
     * Gets a quote for a crypto asset purchase.
     * @override
     * @param {MoonPayQuoteBuyOptions} options - The options for the quote.
     * @returns {Promise<MoonPayBuyQuote>} A quote for the transaction.
     */
    override quoteBuy(options: MoonPayQuoteBuyOptions): Promise<MoonPayBuyQuote>;
    /**
     * Gets a quote for a crypto asset sale.
     * @override
     * @param {MoonPayQuoteSellOptions} options - The options for the quote.
     * @returns {Promise<MoonPaySellQuote>} A quote for the transaction.
     */
    override quoteSell(options: MoonPayQuoteSellOptions): Promise<MoonPaySellQuote>;
    /**
     * Generates a widget URL for a user to sell a crypto asset for fiat currency.
     * @override
     * @param {MoonPaySellOptions} options - The options for the sale.
     * @returns {Promise<SellResult>} The URL for the user to complete the sale.
     */
    override sell(options: MoonPaySellOptions): Promise<SellResult>;
    /**
     * Retrieves the details of a specific transaction from the provider.
     * @override
     * @param {string} txId - The unique identifier of the transaction.
     * @param {'buy' | 'sell'} [direction] - The direction of the transaction.
     * @returns {Promise<MoonPayTransactionDetail>} The transaction details.
     */
    override getTransactionDetail(txId: string, direction?: "buy" | "sell"): Promise<MoonPayTransactionDetail>;
    /**
     * Fetches and caches supported currencies from MoonPay.
     * @private
     * @returns {Promise<Array<MoonPayCryptoCurrencyDetails | MoonPayFiatCurrencyDetails>>}
     */
    private _fetchAndCacheSupportedCurrencies;
    /**
     * Retrieves a list of supported crypto assets from the provider.
     * @override
     * @returns {Promise<MoonPaySupportedCryptoAsset[]>} An array of supported crypto assets.
     */
    override getSupportedCryptoAssets(): Promise<MoonPaySupportedCryptoAsset[]>;
    /**
     * Retrieves a list of supported fiat currencies from the provider.
     * @override
     * @returns {Promise<MoonPaySupportedFiatCurrency[]>} An array of supported fiat currencies.
     */
    override getSupportedFiatCurrencies(): Promise<MoonPaySupportedFiatCurrency[]>;
    /**
     * Retrieves a list of supported countries from the provider.
     * @override
     * @returns {Promise<MoonPaySupportedCountry[]>} An array of supported countries.
     */
    override getSupportedCountries(): Promise<MoonPaySupportedCountry[]>;
}
export type IWalletAccount = import("@tetherto/wdk-wallet").IWalletAccount;
export type IWalletAccountReadOnly = import("@tetherto/wdk-wallet").IWalletAccountReadOnly;
export type BuyOptions = import("@tetherto/wdk-wallet/protocols").BuyOptions;
export type BuyResult = import("@tetherto/wdk-wallet/protocols").BuyResult;
export type SellOptions = import("@tetherto/wdk-wallet/protocols").SellOptions;
export type SellCommonOptions = import("@tetherto/wdk-wallet/protocols").SellCommonOptions;
export type SellExactCryptoAmountOptions = import("@tetherto/wdk-wallet/protocols").SellExactCryptoAmountOptions;
export type SellResult = import("@tetherto/wdk-wallet/protocols").SellResult;
export type FiatQuote = import("@tetherto/wdk-wallet/protocols").FiatQuote;
export type FiatTransactionStatus = import("@tetherto/wdk-wallet/protocols").FiatTransactionStatus;
export type FiatTransactionDetail = import("@tetherto/wdk-wallet/protocols").FiatTransactionDetail;
export type SupportedCountry = import("@tetherto/wdk-wallet/protocols").SupportedCountry;
export type SupportedFiatCurrency = import("@tetherto/wdk-wallet/protocols").SupportedFiatCurrency;
export type SupportedCryptoAsset = import("@tetherto/wdk-wallet/protocols").SupportedCryptoAsset;
export type MoonPayWidgetUiParams = {
    /**
     * - The hexadecimal color code for the widget's main color.
     */
    colorCode?: string;
    /**
     * - The default appearance for the widget.
     */
    theme?: "dark" | "light";
    /**
     * - The ID of the theme created for your application or website.
     */
    themeId?: string;
    /**
     * - The ISO 639-1 standard language code for the widget.
     */
    language?: string;
    /**
     * - If true, shows all cryptocurrencies enabled on your account.
     */
    showAllCurrencies?: boolean;
    /**
     * - A comma-separated list of currency codes to display.
     */
    showOnlyCurrencies?: string;
    /**
     * - If true, shows the wallet address form even if an address is pre-filled.
     */
    showWalletAddressForm?: boolean;
    /**
     * - A URL to redirect the customer to after the flow is complete.
     */
    redirectURL?: string;
    /**
     * - A URL to redirect the customer to if they are from an unsupported region.
     */
    unsupportedRegionRedirectUrl?: string;
    /**
     * - If true, skips the unsupported region screen and redirects immediately.
     */
    skipUnsupportedRegionScreen?: boolean;
};
export type MoonPayWidgetUiBuyParams = {
    /**
     * - The code of the cryptocurrency you would prefer the customer to purchase. The customer can still select another currency. If both currencyCode and defaultCurrencyCode are passed, currencyCode will take precedence.
     */
    defaultCurrencyCode?: string;
    /**
     * - The cryptocurrency wallet address the purchased funds will be sent to. If you pass a valid wallet address the customer won't be prompted to enter one.
     */
    walletAddress?: string;
    /**
     * - The secondary cryptocurrency wallet address identifier/memo for coins such as EOS, XLM, XRP and XMR. This parameter will be skipped if walletAddress or currencyCode is not passed.
     */
    walletAddressTag?: string;
    /**
     * - A JSON string representing the wallet addresses you want to use for multiple cryptocurrencies. If the customer selects a cryptocurrency for which you have passed a valid wallet address, the customer won't be prompted to enter one. The currency code must be lowercase.
     */
    walletAddresses?: string;
    /**
     * - A JSON string representing the wallet address tags you want to use for various cryptocurrencies. An example with EOS and XRP wallet address tags: {"eos":"myeostag","xrp":"0123456789"}.
     */
    walletAddressTags?: string;
    /**
     * - The contract address of the token you want pre-selected for the user in the widget. [Only supported for DeFi Buy integrations.]
     */
    contractAddress?: string;
    /**
     * - Defines the network where the token contract exists (e.g., solana, ethereum). Must match the blockchain where the token contract is deployed. [Only supported for DeFi Buy integrations.]
     */
    networkCode?: string;
    /**
     * - Set this parameter to true to lock the baseCurrencyAmount set for the customer and prevent them from modifying it. This parameter will be skipped if baseCurrencyAmount is not passed.
     */
    lockAmount?: boolean;
    /**
     * - The customer's email address. If you pass a valid email address, the customer won't be prompted to enter one.
     */
    email?: string;
    /**
     * - An identifier you would like to associate with the transaction. This identifier will be present whenever we pass you transaction data.
     */
    externalTransactionId?: string;
    /**
     * - An identifier you would like to associate with the customer. This identifier will be present whenever we pass you customer data, allowing you to match our data with your own existing customer data.
     */
    externalCustomerId?: string;
    /**
     * - Pre-select the payment method you want the customer to use.
     */
    paymentMethod?: string;
};
export type MoonPayBuyParams = MoonPayWidgetUiParams & MoonPayWidgetUiBuyParams;
export type MoonPayWidgetUiSellParams = {
    /**
     * - The code of the cryptocurrency you would prefer the customer to sell. If you pass a defaultBaseCurrencyCode, the currency will be selected by default, but the customer will still be able to select another currency.
     */
    defaultBaseCurrencyCode?: string;
    /**
     * - A JSON string representing the wallet addresses you want to use for various cryptocurrencies in case we have to issue a refund. An example with BTC and BCH wallet addresses: {"btc": "tb1qst9rvjnhym6kwmdkwgfs4h5dtp7cau5346jp9x", "bch": "bchtest:qraax8trdwct02968swqf4mpq3y5msqp8y7tmalm77"}
     */
    refundWalletAddresses?: string;
    /**
     * - Set this parameter to true to lock the baseCurrencyAmount set for the customer and prevent them from modifying it. This parameter will be skipped if baseCurrencyAmount is not passed.
     */
    lockAmount?: boolean;
    /**
     * - The customer's email address. If you pass a valid email address, the customer won't be prompted to enter one.
     */
    email?: string;
    /**
     * - An identifier you would like to associate with the transaction. This identifier will be present whenever we pass you transaction data.
     */
    externalTransactionId?: string;
    /**
     * - An identifier you would like to associate with the customer. This identifier will be present whenever we pass you customer data, allowing you to match our data with your own existing customer data.
     */
    externalCustomerId?: string;
    /**
     * - Pre-select the payout method you want the customer to use.
     */
    paymentMethod?: string;
};
export type MoonPaySellParams = MoonPayWidgetUiParams & MoonPayWidgetUiSellParams;
export type MoonPayQuoteBuyParams = {
    /**
     * - A positive integer representing your extra fee percentage for the transaction. The minimum is 0 and the maximum is 10. If you don't provide it, we'll use the default value set to your account.
     */
    extraFeePercentage?: number;
    /**
     * - The transaction's payment method.
     */
    paymentMethod?: string;
    /**
     * - A boolean indicating whether baseCurrencyAmount should include extra fees. Defaults to false.
     */
    areFeesIncluded?: boolean;
    /**
     * - Wallet address of the customer who requested the quote.
     */
    walletAddress?: string;
};
export type MoonPayQuoteSellParams = {
    /**
     * - A positive integer representing your extra fee percentage for the transaction. The minimum is 0 and the maximum is 10. If you don't provide it, we'll use the default value set to your account.
     */
    extraFeePercentage?: number;
    /**
     * - The transaction's payment method.
     */
    payoutMethod?: string;
};
export type MoonPayBankDepositInfo = {
    /**
     * - The IBAN of the bank account.
     */
    iban: string | null;
    /**
     * - The BIC of the bank account.
     */
    bic: string | null;
    /**
     * - The account number of the bank account.
     */
    accountNumber: string | null;
    /**
     * - The sort code of the bank account.
     */
    sortCode: string | null;
    /**
     * - The name of the bank.
     */
    bankName: string | null;
    /**
     * - The address of the bank.
     */
    bankAddress: string | null;
    /**
     * - The account name of the bank account.
     */
    accountName: string;
    /**
     * - The address of the bank account.
     */
    accountAddress: string;
};
export type MoonPayFiatCurrencyDetails = {
    /**
     * - Unique identifier for the currency.
     */
    id: string;
    /**
     * - Time at which the object was created. Returned as an ISO 8601 string.
     */
    createdAt: string;
    /**
     * - Time at which the object was last updated. Returned as an ISO 8601 string.
     */
    updatedAt: string;
    /**
     * - Always 'fiat'.
     */
    type: "fiat";
    /**
     * - The currency's name.
     */
    name: string;
    /**
     * - The currency's code.
     */
    code: string;
    /**
     * - The currency's precision (number of digits after decimal point).
     */
    precision: number;
    /**
     * - The currency's decimals.
     */
    decimals: number | null;
    /**
     * - Represents the minimum transaction buy amount when using this currency as a base currency.
     */
    minBuyAmount: number | null;
    /**
     * - Represents the maximum transaction buy amount when using this currency as a base currency.
     */
    maxBuyAmount: number | null;
    /**
     * - Whether sales for this currency are supported.
     */
    isSellSupported: boolean;
};
export type MoonPayCryptoCurrencyDetails = {
    /**
     * - Unique identifier for the currency.
     */
    id: string;
    /**
     * - Time at which the object was created. Returned as an ISO 8601 string.
     */
    createdAt: string;
    /**
     * - Time at which the object was last updated. Returned as an ISO 8601 string.
     */
    updatedAt: string;
    /**
     * - Always 'crypto'.
     */
    type: "crypto";
    /**
     * - The currency's name.
     */
    name: string;
    /**
     * - The currency's code.
     */
    code: string;
    /**
     * - The currency's precision (number of digits after decimal point).
     */
    precision: number;
    /**
     * - The currency's decimals.
     */
    decimals: number;
    /**
     * - Represents the minimum amount of cryptocurrency you can buy.
     */
    minBuyAmount: number | null;
    /**
     * - Represents the maximum amount of cryptocurrency you can buy.
     */
    maxBuyAmount: number | null;
    /**
     * - The minimum amount of cryptocurrency you can sell.
     */
    minSellAmount: number | null;
    /**
     * - The maximum amount of cryptocurrency you can sell.
     */
    maxSellAmount: number | null;
    /**
     * - A regular expression which you can test against your end user's wallet addresses.
     */
    addressRegex: string;
    /**
     * - A regular expression which you can test against your end user's testnet wallet addresses.
     */
    testnetAddressRegex: string;
    /**
     * - Whether the currency supports address tags.
     */
    supportsAddressTag: boolean;
    /**
     * - A regular expression which you can test against a wallet address tag. Defined only if the currency supports address tags.
     */
    addressTagRegex: string | null;
    /**
     * - Whether the currency supports test mode.
     */
    supportsTestMode: boolean;
    /**
     * - Whether purchases for this currency are suspended.
     */
    isSuspended: boolean;
    /**
     * - Whether purchases for this currency are supported in the US.
     */
    isSupportedInUs: boolean;
    /**
     * - Whether sales for this currency are supported.
     */
    isSellSupported: boolean;
    /**
     * - A list with all the US states for this currency that are not supported.
     */
    notAllowedUSStates: Array<string>;
    /**
     * - A list with all the ISO 3166-1 alpha-2 country codes for this currency that are not supported.
     */
    notAllowedCountries: Array<string>;
    /**
     * - Additional metadata for the currency.
     */
    metadata: {
        contractAddress: string | null;
        chainId: string | null;
        networkCode: string;
    };
};
export type MoonPayBuyTransactionStage = {
    /**
     * - Stage type.
     */
    stage: "stage_one_ordering" | "stage_two_verification" | "stage_three_processing" | "stage_four_delivery";
    /**
     * - Stage status.
     */
    status: "not_started" | "in_progress" | "success" | "failed";
    /**
     * - Possible values for failure reason.
     */
    failureReason: string | null;
    /**
     * - An array of actions required for the stage.
     */
    actions: Array<{
        type: string;
        url: string;
    }>;
};
/**
 * Type definition for the status of a MoonPay transaction.
 */
export type MoonPayTransactionStatus = "waitingForDeposit" | "pending" | "failed" | "completed";
export type MoonPayBuyTransaction = {
    /**
     * - Unique identifier for the object.
     */
    id: string;
    /**
     * - Time at which the object was created. Returned as an ISO 8601 string.
     */
    createdAt: string;
    /**
     * - Time at which the object was last updated. Returned as an ISO 8601 string.
     */
    updatedAt: string;
    /**
     * - A positive number representing how much the customer wants to sell.
     */
    baseCurrencyAmount: number;
    /**
     * - A positive number representing the amount of cryptocurrency the customer will receive.
     */
    quoteCurrencyAmount: number;
    /**
     * - A positive number representing the fee for the transaction.
     */
    feeAmount: number;
    /**
     * - A positive number representing your extra fee for the transaction.
     */
    extraFeeAmount: number;
    /**
     * - The transaction's payout method.
     */
    paymentMethod: string;
    /**
     * - The network fee for the transaction.
     */
    networkFeeAmount: number;
    /**
     * - A boolean indicating whether baseCurrencyAmount includes or excludes the feeAmount, extraFeeAmount and networkFeeAmount.
     */
    areFeesIncluded: boolean;
    /**
     * - The transaction's status.
     */
    status: MoonPayTransactionStatus;
    /**
     * - The transaction's failure reason. Set when transaction's status is failed.
     */
    failureReason: string | null;
    /**
     * - The cryptocurrency wallet address the purchased funds will be sent to.
     */
    walletAddress: string;
    /**
     * - The secondary cryptocurrency wallet address identifier for coins such as EOS, XRP and XMR.
     */
    walletAddressTag: string | null;
    /**
     * - The cryptocurrency transaction identifier representing the transfer to the customer's wallet. Set when the withdrawal has been executed.
     */
    cryptoTransactionId: string | null;
    /**
     * - The URL provided to you, when required, to which to redirect the customer as part of a redirect authentication flow.
     */
    redirectUrl: string | null;
    /**
     * - The URL the customer is returned to after they authenticate or cancel their payment on the payment method's app or site. If you are using our widget implementation, this is always our transaction tracker page, which provides the customer with real-time information about their transaction.
     */
    returnUrl: string;
    /**
     * - An optional URL used in a widget implementation. It is passed to us by you in the query parameters, and we include it as a link on the transaction tracker page.
     */
    widgetRedirectUrl: string | null;
    /**
     * - The exchange rate between the transaction's base currency and Euro at the time of the transaction.
     */
    eurRate: number;
    /**
     * - The exchange rate between the transaction's base currency and US Dollar at the time of the transaction.
     */
    usdRate: number;
    /**
     * - The exchange rate between the transaction's base currency and British Pound at the time of the transaction.
     */
    gbpRate: number;
    /**
     * - Information about the bank deposit.
     */
    bankDepositInformation: MoonPayBankDepositInfo | null;
    /**
     * - For bank transfer transactions, the reference code the customer should cite when making the transfer.
     */
    bankTransferReference: string | null;
    /**
     * - The identifier of the cryptocurrency the customer wants to purchase.
     */
    currencyId: string;
    /**
     * - Details of the crypto currency.
     */
    currency: MoonPayCryptoCurrencyDetails;
    /**
     * - The identifier of the fiat currency the customer wants to use for the transaction.
     */
    baseCurrencyId: string;
    /**
     * - Details of the fiat currency.
     */
    baseCurrency: MoonPayFiatCurrencyDetails;
    /**
     * - The identifier of the customer the transaction is associated with.
     */
    customerId: string;
    /**
     * - For token or card transactions, the identifier of the payment card used for this transaction.
     */
    cardId: string | null;
    /**
     * - For bank transfer transactions, the identifier of the bank account used for this transaction.
     */
    bankAccountId: string | null;
    /**
     * - An identifier associated with the customer, provided by you.
     */
    externalCustomerId: string | null;
    /**
     * - An identifier associated with the transaction, provided by you.
     */
    externalTransactionId: string | null;
    /**
     * - The customer's country. Returned as an ISO 3166-1 alpha-3 code.
     */
    country: string;
    /**
     * - The customer's state, if the customer is from the USA. Returned as a two-letter code.
     */
    state: string | null;
    /**
     * - The customer's state, if the customer is from the USA. Returned as a two-letter code.
     */
    cardType: string | null;
    /**
     * - The customer's state, if the customer is from the USA. Returned as a two-letter code.
     */
    cardPaymentType: string;
    /**
     * - An array of four objects, each representing one of the four stages of the purchase process.
     */
    stages: Array<MoonPayBuyTransactionStage>;
};
export type MoonPaySellTransactionStage = {
    /**
     * - Stage type.
     */
    stage: "sell_stage_one_verification" | "sell_stage_two_waiting_for_deposit" | "sell_stage_three_processing" | "sell_stage_four_withdrawal";
    /**
     * - Stage status.
     */
    status: "not_started" | "in_progress" | "success" | "failed";
    /**
     * - Possible values for failure reason.
     */
    failureReason: string | null;
    /**
     * - An array of actions required for the stage.
     */
    actions: Array<{
        type: string;
        url: string;
    }>;
};
export type MoonPaySellTransaction = {
    /**
     * - Unique identifier for the object.
     */
    id: string;
    /**
     * - Time at which the object was created. Returned as an ISO 8601 string.
     */
    createdAt: string;
    /**
     * - Time at which the object was last updated. Returned as an ISO 8601 string.
     */
    updatedAt: string;
    /**
     * - A positive number representing how much the customer wants to sell.
     */
    baseCurrencyAmount: number;
    /**
     * - A positive number representing the amount of cryptocurrency the customer will receive. Set when the purchase of cryptocurrency has been executed.
     */
    quoteCurrencyAmount: number;
    /**
     * - A positive number representing the fee for the transaction.
     */
    feeAmount: number;
    /**
     * - A positive number representing your extra fee for the transaction.
     */
    extraFeeAmount: number;
    /**
     * - The transaction's status.
     */
    status: MoonPayTransactionStatus;
    /**
     * - The transaction's failure reason. Set when transaction's status is failed.
     */
    failureReason: string | null;
    /**
     * - A wallet address at which the customer can receive cryptocurrency. In case we cannot process the sale of the customer's cryptocurrency, we will return the cryptocurrency to this wallet address. Might be empty
     */
    refundWalletAddress: string;
    /**
     * - The cryptocurrency transaction identifier representing the transfer from the customer's wallet to MoonPay's wallet. Set when the deposit has been executed and received.
     */
    depositHash: string | null;
    /**
     * - An optional URL used in a widget implementation. It is passed to us by you in the query parameters, and we include it as a link on the transaction tracker page.
     */
    widgetRedirectUrl: string | null;
    /**
     * - The transaction's payout method.
     */
    payoutMethod: string;
    /**
     * - The exchange rate between the transaction's base currency and Euro at the time of the transaction.
     */
    eurRate: number;
    /**
     * - The exchange rate between the transaction's base currency and US Dollar at the time of the transaction.
     */
    usdRate: number;
    /**
     * - The exchange rate between the transaction's base currency and British Pound at the time of the transaction.
     */
    gbpRate: number;
    /**
     * - The identifier of the fiat the customer wants to get.
     */
    quoteCurrencyId: string;
    /**
     * - The identifier of the crypto currency the customer wants to sell.
     */
    baseCurrencyId: string;
    /**
     * - The identifier of the customer the transaction is associated with.
     */
    customerId: string;
    /**
     * - The identifier of the bank account used for this transaction.
     */
    bankAccountId: string | null;
    /**
     * - An identifier associated with the customer, provided by you.
     */
    externalCustomerId: string | null;
    /**
     * - An identifier associated with the transaction, provided by you.
     */
    externalTransactionId: string | null;
    /**
     * - An array of objects, each representing one of the stages of the sell process.
     */
    stages: Array<MoonPaySellTransactionStage>;
    /**
     * - Details of the crypto currency.
     */
    baseCurrency: MoonPayCryptoCurrencyDetails;
    /**
     * - Details of the fiat currency.
     */
    quoteCurrency: MoonPayFiatCurrencyDetails;
};
export type MoonPayCountryDetail = {
    /**
     * - The country's ISO 3166-1 alpha-2 code.
     */
    alpha2: string;
    /**
     * - The country's ISO 3166-1 alpha-3 code.
     */
    alpha3: string;
    /**
     * - Whether residents of this country can use the service.
     */
    isAllowed: boolean;
    /**
     * - Whether residents of this country can buy cryptocurrencies.
     */
    isBuyAllowed: boolean;
    /**
     * - Whether residents of this country can sell cryptocurrencies.
     */
    isSellAllowed: boolean;
    /**
     * - The country's name.
     */
    name: string;
    /**
     * - A list of supported identity documents for the country.
     */
    supportedDocuments: string[];
};
export type MoonPayBuyQuoteMetadata = {
    /**
     * - ID of your business account
     */
    accountId: string;
    /**
     * - The fiat currency the customer wants to use for the transaction.
     */
    baseCurrency: MoonPayFiatCurrencyDetails;
    baseCurrencyCode: string;
    /**
     * - A positive number representing how much the customer wants to spend. The minimum amount is 20.
     */
    baseCurrencyAmount: number;
    /**
     * - The cryptocurrency the customer wants to purchase.
     */
    quoteCurrency: MoonPayCryptoCurrencyDetails;
    quoteCurrencyCode: string;
    /**
     * - A positive number representing the amount of cryptocurrency the customer will receive. Set when the purchase of cryptocurrency has been executed.
     */
    quoteCurrencyAmount: number;
    /**
     * - The price of the crypto the customer will receive
     */
    quoteCurrencyPrice: number;
    /**
     * - The transaction's payment method.
     */
    paymentMethod: string;
    /**
     * - A positive number representing the fee for the transaction.
     */
    feeAmount: number;
    extraFeePercentage: number;
    extraFeeAmount: number;
    /**
     * - A positive number representing the network fee for the transaction. It is added to baseCurrencyAmount, feeAmount and extraFeeAmount when the customer's card is charged.
     */
    networkFeeAmount: number;
    networkFeeAmountNonRefundable: boolean;
    totalAmount: number;
    externalId: string | null;
    externalCustomerId: string | null;
    /**
     * - The signature for executing the quote for fixed flow
     */
    signature: string | null;
    /**
     * - The time in seconds until the quote expires.
     */
    expiresIn: number | null;
    /**
     * - Time at which the quote expires. Returned as an ISO 8601 string.
     */
    expiresAt: string | null;
};
export type MoonPaySellQuoteMetadata = {
    /**
     * - Fiat currency the customer wants to get.
     */
    quoteCurrencyCode: string;
    /**
     * - The fiat currency the customer wants to use for the transaction.
     */
    quoteCurrency: MoonPayFiatCurrencyDetails;
    /**
     * - Crypto currency the customer wants to sell.
     */
    baseCurrencyCode: string;
    /**
     * - The cryptocurrency the customer wants to sell.
     */
    baseCurrency: MoonPayCryptoCurrencyDetails;
    /**
     * - A positive number representing how much the customer wants to sell.
     */
    baseCurrencyAmount: number;
    /**
     * - A positive number representing the amount of cryptocurrency the customer will receive.
     */
    quoteCurrencyAmount: number;
    /**
     * - The price of the crypto the customer wants to sell
     */
    baseCurrencyPrice: number;
    /**
     * - A positive number representing the fee for the transaction.
     */
    feeAmount: number;
    /**
     * - A positive number representing your extra fee for the transaction.
     */
    extraFeeAmount: number;
    /**
     * - The transaction's payout method.
     */
    payoutMethod: string;
    /**
     * - The signature for executing the quote for fixed flow
     */
    signature: string | null;
    /**
     * - The time in seconds until the quote expires.
     */
    expiresIn: number | null;
    /**
     * - Time at which the quote expires. Returned as an ISO 8601 string.
     */
    expiresAt: string | null;
};
export type MoonPayTransactionDetail = FiatTransactionDetail & {
    metadata: MoonPayBuyTransaction | MoonPaySellTransaction;
};
export type MoonPaySupportedCountry = SupportedCountry & {
    metadata: MoonPayCountryDetail;
};
export type MoonPaySupportedCryptoAsset = SupportedCryptoAsset & {
    metadata: MoonPayCryptoCurrencyDetails;
};
export type MoonPaySupportedFiatCurrency = SupportedFiatCurrency & {
    metadata: MoonPayFiatCurrencyDetails;
};
export type MoonPayBuyOptions = BuyOptions & {
    config?: MoonPayBuyParams;
};
export type MoonPayQuoteBuyOptions = Omit<BuyOptions, "recipient"> & {
    config?: MoonPayQuoteBuyParams;
};
export type MoonPayBuyQuote = FiatQuote & {
    metadata: MoonPayBuyQuoteMetadata;
};
export type MoonPayQuoteSellOptions = Omit<SellCommonOptions, "refundAddress"> & SellExactCryptoAmountOptions & {
    config?: MoonPayQuoteSellParams;
};
export type MoonPaySellQuote = FiatQuote & {
    metadata: MoonPaySellQuoteMetadata;
};
export type MoonPaySellOptions = SellOptions & {
    config?: MoonPaySellParams;
};
export type MoonPayProtocolConfig = {
    /**
     * - Your publishable Moonpay API key.
     */
    apiKey: string;
    /**
     * - Callback used to sign buy/sell URLs via a trusted provider (e.g., a backend service). If not provided, the protocol returns unsigned URLs.
     */
    signUrl?: (urlForSignature: string) => Promise<string>;
    /**
     * - The duration in milliseconds to cache supported currencies.
     */
    cacheTime?: number;
    /**
     * - The environment to use for MoonPay endpoints and widget URLs. Defaults to "production". Use "production" for live transactions and "sandbox" for testing with non-real funds.
     */
    environment?: "production" | "sandbox";
};
import { FiatProtocol } from '@tetherto/wdk-wallet/protocols';
