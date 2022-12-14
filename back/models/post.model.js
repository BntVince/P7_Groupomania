const { sequelize, Sequelize } = require('.')

module.exports = (sequelize, Sequelize) => {
   const Post = sequelize.define('posts', {
      description: {
         type: Sequelize.TEXT,
         allowNull: false,
      },
      imageUrl: {
         type: Sequelize.STRING,
      },
      likes: {
         type: Sequelize.INTEGER,
      },
   })
   return Post
}
