import express, { Application, Request, Response } from "express"
import { authRouter } from "./modules/auth/auth.route"

const app: Application = express()  

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRouter)


app.get("/", (req: Request, res: Response) => {
    res.send("Server is running successfully...")
})

export default app;