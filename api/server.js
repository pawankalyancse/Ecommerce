require('dotenv').config()
let express = require('express')
let connectDB = require('./db')
let cors = require('cors')

let router = require('./routes')


let app = express()
const PORT = 1818

// 1. cors middleware
app.use(cors({
    origin: ["http://localhost:5500"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))

// 2. body parser middleware
app.use(express.json())


// 3. connect to DB (if not connected)
app.use(async (req, res, next) => {
    await connectDB()
    next()
})


// 4. register routes
app.use(router)


app.use((err, req, res, next) => {
    if (err) {
        return res.status(500).send({message : err.message || "Internal Server Error"})
    }
    return res.sendStatus(404)
})


const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`✅ Server is Running at PORT : ${PORT}`);
            console.log(`url ⏩ http://localhost:${PORT} or http://127.0.0.1:${PORT}`);
        })
    } catch (error) {
        console.log("⛔ Failed to connect to MongoDB");
        console.log(error);
    }
}

startServer()