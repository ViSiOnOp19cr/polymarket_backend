import express from "express"
import cors from "cors"







const app = express ()

app.use(cors())

app.use("/api/v1", userRoutes)
app.use("/api/v1", marketRoutes)

app.listen(3005,()=>{
    console.log("server is running in port 30005")
})

