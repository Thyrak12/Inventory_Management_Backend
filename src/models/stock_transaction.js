export default (sequelize, DataTypes) =>
    sequelize.define('Stock_Transaction', {
        qty: DataTypes.STRING,
        type: DataTypes.enum('in', 'out')
    });