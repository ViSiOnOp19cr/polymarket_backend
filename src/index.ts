import express from "express"
import cors from "cors"
import { userRoutes } from "./routes/user.router"
import { PORT } from "./lib/config"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1", userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

