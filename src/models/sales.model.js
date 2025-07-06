export default (sequelize, DataTypes) =>
    sequelize.define('Sales', {
        status: DataTypes.enum('pending', 'completed', 'cancelled'),
        total_price: DataTypes.decimal(10, 2)
    });
