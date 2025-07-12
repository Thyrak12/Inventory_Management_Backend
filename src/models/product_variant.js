export default (sequelize, DataTypes) =>
    sequelize.define('Product_Variant', {
        color: DataTypes.STRING,
        size: DataTypes.STRING,
        price: DataTypes.DECIMAL(10, 2),
        stock: DataTypes.INTEGER
    });
