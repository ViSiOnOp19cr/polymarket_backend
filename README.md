# Polymarket Backend

A prediction market backend built with TypeScript, Express.js, Prisma, and PostgreSQL.

## Features

### Authentication & Users
- JWT-based authentication
- User registration and login
- User profile management
- Balance tracking
- Leaderboard system

### Markets
- Create and update prediction markets (admin only)
- Binary outcome markets (YES/NO)
- Market categories (Sports, Esports)
- Market search by title
- Lock betting before resolution
- Resolve markets with outcome

### Betting System
- Place bets on market outcomes
- Dynamic odds calculation based on betting pool
- Automatic payout distribution on market resolution
- Betting history tracking

### Transactions
- Track all financial transactions
- Transaction types: BET_PLACED, BET_WON, DEPOSIT, WITHDRAW
- Transaction history per user

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt for password hashing

## API Endpoints

### Users
- `POST /api/v1/users/signup` - Register new user
- `POST /api/v1/users/signin` - User login
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/leaderboard` - Get winning leaderboard

### Markets
- `POST /api/v1/markets/create` - Create market (admin)
- `PUT /api/v1/markets/update/:id` - Update market (admin)
- `GET /api/v1/markets/getallmarkets` - List all markets
- `GET /api/v1/markets/getmarket/:id` - Get market by ID
- `GET /api/v1/markets/openmarkets` - Get open markets
- `GET /api/v1/markets/getmarketsbycatagory/:category` - Filter by category
- `GET /api/v1/markets/search?title=` - Search markets
- `POST /api/v1/markets/lockbets/:id` - Lock market (admin)
- `POST /api/v1/markets/resolvemarket/:id` - Resolve market (admin)

### Bets
- `POST /api/v1/bets/placebets` - Place a bet
- `GET /api/v1/bets/getallbets` - Get user's bets
- `GET /api/v1/bets/getallbetsmarket/:id` - Get user's bets for a market

### Transactions
- `GET /api/v1/transactions/getalltransactions` - Get user's transactions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/polymarket"
JWT_SECRET="your-secret-key-min-32-chars"
PORT="3005"
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Build and run:
```bash
npm run build
npm run dev
```

## Database Schema

- **User**: Stores user accounts with email, password, balance
- **Market**: Prediction markets with outcomes, odds, and metadata
- **Bets**: User bets with amount, outcome choice, and locked-in odds
- **Transactions**: Financial transaction history

## Current Implementation Notes

- Initial user balance: 10,000 units
- Odds calculation: Dynamic based on total betting pool
- Market outcomes: Binary (YES/NO)
- All monetary values in smallest unit (cents)