export default (sequelize, DataTypes) =>
    sequelize.define('Sales_Record', {
        qty: DataTypes.integer,
        price_each: DataTypes.decimal(10, 2)
    });
