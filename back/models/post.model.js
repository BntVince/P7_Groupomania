const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("posts", {
        userId: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        imageUrl: {
            type: Sequelize.STRING
        },
        likes: {
            type: Sequelize.INTEGER
        }
    });
    return Post
};