import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env")
});

const config = {
    PORT: process.env.PORT || 5000,
    CONNECTION_STRING: process.env.CONNECTION_STRING || ""
}

export default config;
