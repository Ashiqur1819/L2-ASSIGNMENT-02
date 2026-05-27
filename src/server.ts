import app from "./app"
import config from "./config/env"
import { initDB } from "./db"

const main = async () => {
    initDB()
    app.listen(config.PORT, () => {
        console.log("Server running on port: ", config.PORT)
    })
}

main()