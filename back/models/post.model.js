const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("posts", {
        userId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        publisherName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        publisherImg: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
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