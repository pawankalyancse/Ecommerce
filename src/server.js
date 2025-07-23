require('dotenv').config()
let express = require('express')
let connectDB = require('./db')
let cors = require('cors')
let userRoutes = require('./routes/userRoutes')

let productRoutes = require('./routes/productRoutes')


let app = express()
const PORT = 1818



// middleware
app.use(express.json())

// connect to DB
app.use(async (req, res, next) => {
    await connectDB()
    next()
})

app.use(cors({
    origin: ["http://localhost:5500"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))

// register routes
app.use('/user', userRoutes)
app.use('/product', productRoutes)


app.use((req, res) => {
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