import express from "express"
import cors from "cors"
import { userRoutes } from "./routes/user.router"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1", userRoutes)

app.listen(3005, () => {
    console.log("server is running on port 3005")
})

