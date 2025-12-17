# @tetherto/wdk-protocol-fiat-moonpay

Note: This package is in beta. Please test in a dev setup first.

A simple way to integrate MoonPay widget for on-ramp and off-ramp services. You can generate signed URLs for the MoonPay widget, get quotes for buying and selling crypto, and read protocol-related data. This module is intended to be run on the backend.

## 🔍 About WDK

This is part of WDK (Wallet Development Kit). WDK helps you build safe, non‑custody wallets. Read more at https://docs.wallet.tether.io.

## 🌟 Features

- Generate signed widget URL to buy Crypto (On-ramp)
- Generate signed widget URL to sell Crypto (Off-ramp)
- Get quotes (buy and sell)
- Get supported currencies, countries
- Get buy/sell transaction details

## ⬇️ Installation

```bash
npm install @tetherto/wdk-protocol-fiat-moonpay
```

## 🚀 Quick Start

### Basic Usage

```javascript
import MoonPayProtocol from '@tetherto/wdk-protocol-fiat-moonpay'

// Initialize protocol
const moonpay = new MoonPayProtocol(undefined, {
  apiKey: 'YOUR_PUBLISHABLE_API_KEY',
  secretKey: 'YOUR_SECRET_KEY'
})

// Get a buy quote
const buyQuote = await moonpay.quoteBuy({
  fiatCurrency: 'usd',
  cryptoAsset: 'eth',
  fiatAmount: 100
})

// Generate a buy widget URL
const { buyUrl } = await moonpay.buy({
  fiatCurrency: 'usd',
  cryptoAsset: 'eth',
  fiatAmount: 100,
  recipient: '0xabc'
})

console.log('Buy URL:', buyUrl)

// Get a sell quote
const sellQuote = await moonpay.quoteSell({
  fiatCurrency: 'usd',
  cryptoAsset: 'eth',
  cryptoAmount: 100
})

// Generate a sell widget URL
const { sellUrl } = await moonpay.sell({
  fiatCurrency: 'usd',
  cryptoAsset: 'eth',
  cryptoAmount: 100,
  refundAddress: '0xabc'
})
```

## 📚 API Reference

### MoonPayProtocol

Main class for MoonPay integration.

#### Constructor

```javascript
new MoonPayProtocol(account, config)
```

Parameters:
- `account` (IWalletAccount | IWalletAccountReadOnly | undefined): The wallet account to use to interact with the protocol
- `config` (object): The protocol config
  - `apiKey` (string): MoonPay public key
  - `secretKey` (string): MoonPay secret key for signing
  - `cacheTime` (number, optional): The duration in milliseconds to cache supported currencies

### Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `buy(options)` | Generates a widget URL to purchase crypto | `Promise<BuyResult>` |
| `sell(options)` | Generates a widget URL to sell crypto | `Promise<SellResult>` |
| `quoteBuy(options)` | Gets a quote for a crypto asset purchase | `Promise<MoonPayBuyQuote>` |
| `quoteSell(options)` | Gets a quote for a crypto asset sale | `Promise<MoonPaySellQuote>` |
| `getTransactionDetail(txId, direction)` | Retrieves the details of a transaction | `Promise<MoonPayTransactionDetail>` |
| `getSupportedCryptoAssets()` | Retrieves a list of supported crypto assets | `Promise<MoonPaySupportedCryptoAsset[]>` |
| `getSupportedFiatCurrencies()` | Retrieves a list of supported fiat currencies | `Promise<MoonPaySupportedFiatCurrency[]>` |
| `getSupportedCountries()` | Retrieves a list of supported countries | `Promise<MoonPaySupportedCountry[]>` |

#### `buy(options)`
Generates a widget URL to purchase crypto.

Options:
- `fiatCurrency` (string): The fiat currency code (e.g., 'usd').
- `cryptoAsset` (string): The crypto asset code (e.g., 'eth').
- `fiatAmount` (number, optional): The amount in fiat currency.
- `cryptoAmount` (number, optional): The amount in crypto asset.
- `recipient` (string, optional): The wallet address to receive funds. If not provided, uses the account address.
- `config` (object, optional): Additional MoonPay widget parameters.

#### `sell(options)`
Generates a widget URL to sell crypto.

Options:
- `fiatCurrency` (string): The fiat currency code (e.g., 'usd').
- `cryptoAsset` (string): The crypto asset code (e.g., 'eth').
- `fiatAmount` (number, optional): The amount in fiat currency.
- `cryptoAmount` (number, optional): The amount in crypto asset.
- `refundAddress` (string, optional): The wallet address for refunds. If not provided, uses the account address.
- `config` (object, optional): Additional MoonPay widget parameters.

#### `quoteBuy(options)`
Gets a quote for a crypto asset purchase.

Options:
- `fiatCurrency` (string): The fiat currency code.
- `cryptoAsset` (string): The crypto asset code.
- `fiatAmount` (number, optional): The amount in fiat currency.
- `cryptoAmount` (number, optional): The amount in crypto asset.
- `config` (object, optional): Additional MoonPay quote parameters.

#### `quoteSell(options)`
Gets a quote for a crypto asset sale.

Options:
- `fiatCurrency` (string): The fiat currency code.
- `cryptoAsset` (string): The crypto asset code.
- `cryptoAmount` (number): The amount in crypto asset (Required).
- `config` (object, optional): Additional MoonPay quote parameters.

#### `getTransactionDetail(txId, direction)`
Retrieves the details of a transaction.

Parameters:
- `txId` (string): The transaction ID.
- `direction` ('buy' | 'sell'): The direction of the transaction. Defaults to 'buy'.

#### `getSupportedCryptoAssets()`
Retrieves a list of supported crypto assets.

#### `getSupportedFiatCurrencies()`
Retrieves a list of supported fiat currencies.

#### `getSupportedCountries()`
Retrieves a list of supported countries.

## 📝 Notes

Works with networks and currencies supported by MoonPay.
Check MoonPay documentation for the full list of widget parameters, supported cryptocurrencies and regions.
The package provides the baseline for MoonPay integration. To fully utilize the power of MoonPay widget, take a look at [MoonPay documentation](https://dev.moonpay.com/docs/ramps-sdk-buy-params) for the full list of parameters.
The `secretKey` can be retrieved through [MoonPay dashboard](https://dashboard.moonpay.com/).
It is highly recommended to test the entire buy/sell flow in sandbox environment. Read more [here](https://dev.moonpay.com/docs/faq-sandbox-testing).

## 🔒 Security Considerations

- Keep your `secretKey` safe. Do not expose it in client-side code; always generate buy/sell widget URLs on a backend.

## 🛠️ Development

### Building

```bash
# Install dependencies
npm install

# Build TypeScript definitions
npm run build:types

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📜 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆘 Support

For support, please open an issue on the GitHub repository.