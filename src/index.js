const express = require('express')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000



const userRouter = require('./routers/user')
const innoRouter = require('./routers/inventory')
app.use(express.json())
app.use(userRouter)
app.use(innoRouter)

app.listen(port, ()=>{
    console.log("Server run on port",port)
})