require("dotenv").config()
const http = require('http')
const connectToMongo = require('./config/database')
const express = require('express')
const cors = require('cors')
const mainRoute = require('./routes/index')
const initialRoute = require('./controllers/initial_route')
const fileUpload = require('express-fileupload')
connectToMongo()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

app.use(fileUpload({
    useTempFiles: true
}))


app.use(mainRoute)
app.get('*', initialRoute)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


// module.exports = app