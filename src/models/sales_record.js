export default (sequelize, DataTypes) =>
    sequelize.define('Sales_Record', {
        qty: DataTypes.INTEGER,
        price_each: DataTypes.DECIMAL(10, 2)
    });
