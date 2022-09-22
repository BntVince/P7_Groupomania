const { sequelize, Sequelize } = require('.')

module.exports = (sequelize, Sequelize) => {
   const User = sequelize.define('users', {
      userName: {
         type: Sequelize.STRING,
         unique: true,
      },
      email: {
         type: Sequelize.STRING,
         unique: true,
      },
      password: {
         type: Sequelize.STRING,
      },
      profilImg: {
         type: Sequelize.STRING,
      },
   })
   return User
}
