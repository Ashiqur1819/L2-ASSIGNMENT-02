import app from "./app"
import config from "./config/env"

const main = async () => {
    app.listen(config.PORT, () => {
        console.log("Server running on port: ", config.PORT)
    })
}

main()