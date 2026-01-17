# Gold Website - Clone of sp-today.com

A complete clone of the sp-today.com website, a Syrian Pound exchange rate tracking website.

## Features

- Real-time currency exchange rates (USD, EUR, TRY, SAR, AED, EGP, etc.)
- Gold prices in different karats (24K, 22K, 21K, 18K, 14K)
- Cryptocurrency prices
- Energy prices (fuel, gas, electricity)
- News section
- Responsive design with RTL (Right-to-Left) support for Arabic
- Dark theme

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 19** - UI library

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build the production version:

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── currencies/         # Currency rates page
│   ├── gold/              # Gold prices page
│   ├── crypto/            # Cryptocurrency page
│   ├── energy/            # Energy prices page
│   ├── news/              # News page
│   └── currency/[slug]/   # Currency detail page
├── components/
│   ├── Header.tsx         # Site header/navigation
│   ├── Footer.tsx         # Site footer
│   ├── CurrencyTicker.tsx # Top currency ticker
│   ├── HeroSection.tsx    # Hero section with main currency
│   ├── CurrencyRates.tsx  # Currency rates table
│   └── GoldPrices.tsx     # Gold prices section
└── public/
    └── images/            # Static images
```

## API Integration

The website is designed to fetch data from an API. Update the API endpoints in the components to connect to your data source.

## License

This is a clone project for educational purposes.

