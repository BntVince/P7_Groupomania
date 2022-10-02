const dbConfig = require('../db.config.js')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
   host: dbConfig.HOST,
   dialect: dbConfig.dialect,
   operatorsAliases: false,
   pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
   },
})
const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./user.model.js')(sequelize, Sequelize)
db.posts = require('./post.model.js')(sequelize, Sequelize)
db.likes = require('./like.model.js')(sequelize, Sequelize)

db.users.belongsToMany(db.posts, { through: db.likes })
db.posts.belongsTo(db.users, {
   onDelete: 'CASCADE',
})
db.users.hasOne(db.posts)

module.exports = db
