import express from "express"
import cors from "cors"
import { userRoutes } from "./routes/user.router"
import { marketRoutes } from "./routes/market.router"
import { betsRoutes } from "./routes/bets.router"
import { transactionRoutes } from "./routes/transaction.router"
import { PORT } from "./lib/config"

const app = express()

app.use(cors())
app.use(express.json())

// API Routes
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/markets", marketRoutes)
app.use("/api/v1/bets", betsRoutes)
app.use("/api/v1/transactions", transactionRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

