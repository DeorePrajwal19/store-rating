const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/fs_intern', {
  dialect: 'postgres',
  logging: false
});
const User = sequelize.define('User', {
  id:{ type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  name: { type: DataTypes.STRING(60), allowNull:false },
  email: { type: DataTypes.STRING, allowNull:false, unique:true },
  password: { type: DataTypes.STRING, allowNull:false },
  address: { type: DataTypes.STRING(400) },
  role: { type: DataTypes.ENUM('admin','user','owner'), defaultValue:'user' }
});
const Store = sequelize.define('Store', {
  id:{ type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  name: { type: DataTypes.STRING(100), allowNull:false },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING(400) }
});
const Rating = sequelize.define('Rating', {
  id:{ type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  score: { type: DataTypes.INTEGER, allowNull:false, validate:{ min:1, max:5 } }
});
// Associations
User.hasMany(Rating, { foreignKey:'userId' });
Rating.belongsTo(User, { foreignKey:'userId' });
Store.hasMany(Rating, { foreignKey:'storeId' });
Rating.belongsTo(Store, { foreignKey:'storeId' });
// If a Store has an owner (User)
User.hasMany(Store, { foreignKey:'ownerId' });
Store.belongsTo(User, { foreignKey:'ownerId' });
module.exports = { sequelize, User, Store, Rating };
