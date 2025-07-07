import express from "express"
import cors from "cors"
import { userRoutes } from "../src/routes/user.router"
import { marketRoutes } from "../src/routes/market.router"
import { betsRoutes } from "../src/routes/bets.router"
import { transactionRoutes } from "../src/routes/transaction.router"

const app = express()

app.use(cors({
    origin: "*",
    credentials: true,
}))
app.use(express.json())

// API Routes
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/markets", marketRoutes)
app.use("/api/v1/bets", betsRoutes)
app.use("/api/v1/transactions", transactionRoutes)

export default app 