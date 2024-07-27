require('dotenv').config()
const express = require('express')
const app = express()
const errorHandler = require('./middlewares/error')
const cors = require('cors')
const path = require('path');

// cors settings if you need
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4000',
    'http://localhost:5000',
    'http://localhost:5173'
  ]
}

app.use(cors(corsOptions))

app.use(express.static('public'))

// db config
require('./config/db')

// Serve static files from the 'uploads' directory
app.use('/api/v1.0.0/uploads', express.static(path.join(__dirname, 'uploads')));

// reponses jsons correctly
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// route files
app.use(process.env.API_PREFIX, require('./routes'))

// error handler middleware
app.use(errorHandler)

// app will listen this port
app.listen(process.env.API_PORT || 80, () => console.log('Server is started'))
