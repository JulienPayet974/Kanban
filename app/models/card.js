const { DataTypes, Model } = require('sequelize');
const sequelize = require ('../database');

class Card extends Model {}

Card.init({
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: DataTypes.STRING,
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  sequelize,
  tableName: "card",
});

module.exports = Card;
