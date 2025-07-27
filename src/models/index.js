import { Sequelize } from 'sequelize';
import dbConfig from '../config/db.config.js';
import ProductModel from './product.model.js';
import UserModel from './user.model.js';
import SalesRecordModel from './sales_record.js';
import StockTransactionModel from './stock_transaction.js';
import SalesModel from './sales.model.js';
import ProductVariantModel from './product_variant.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Product = ProductModel(sequelize, Sequelize);
db.User = UserModel(sequelize, Sequelize);
db.SalesRecord = SalesRecordModel(sequelize, Sequelize);
db.StockTransaction = StockTransactionModel(sequelize, Sequelize);
db.Sales = SalesModel(sequelize, Sequelize);
db.ProductVariant = ProductVariantModel(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Sales, { foreignKey: 'user_id' });
db.Sales.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.StockTransaction, { foreignKey: 'user_id' });
db.StockTransaction.belongsTo(db.User, { foreignKey: 'user_id' });

db.ProductVariant.belongsTo(db.Product, { foreignKey: 'product_id'});
db.Product.hasMany(db.ProductVariant, { foreignKey: 'product_id' });

db.ProductVariant.hasMany(db.SalesRecord, { foreignKey: 'product_variant_id' , as: 'salesRecords',});
db.SalesRecord.belongsTo(db.ProductVariant, { foreignKey: 'product_variant_id' , as: 'productVariant',});

db.ProductVariant.hasMany(db.StockTransaction, { foreignKey: 'product_variant_id' });
db.StockTransaction.belongsTo(db.ProductVariant, { foreignKey: 'product_variant_id' });

db.Sales.hasMany(db.SalesRecord, { foreignKey: 'sales_id' });
db.SalesRecord.belongsTo(db.Sales, { foreignKey: 'sales_id' , as : 'sales',});

await sequelize.sync({ alter: true }); // dev only

export default db;
