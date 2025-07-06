export default (sequelize, DataTypes) =>
    sequelize.define('Product', {
        color: DataTypes.STRING,
        size: DataTypes.STRING,
        price: DataTypes.decimal(10, 2),
        stock: DataTypes.INTEGER
    });
