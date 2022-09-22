const express = require('express')
const app = express()
const postsRoutes = require('./routes/posts.js')
const userRoutes = require('./routes/user.js')
const path = require('path')
const db = require('./models')

db.sequelize.sync()

app.use(express.json())

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*')
   res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
   )
   res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
   )
   next()
})

app.use('/api/auth', userRoutes)
app.use('/api/posts', postsRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
