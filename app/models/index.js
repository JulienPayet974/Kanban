const List = require ('./list.js');
const Card = require ('./card.js');
const Tag = require ('./tag.js');

// association carte - liste
List.hasMany(Card, {
  as: 'cards',
  foreignKey: 'list_id', 
});

Card.belongsTo(List, {
  as: "list",
  foreignKey: 'list_id',
});

// association carte - label

Card.belongsToMany(Tag, {
  as: "tags",
  through: 'card_has_tag',
  foreignKey: 'card_id',
  otherKey: 'tag_id',
  timestamps: true,
  updatedAt: false,
});

Tag.belongsToMany(Card, { 
  as: "cards",
  through: 'card_has_tag',
  foreignKey: 'tag_id',
  otherKey: 'card_id',
  timestamps: true,
  updatedAt: false,
});

module.exports = {
  List,
  Card,
  Tag,
};