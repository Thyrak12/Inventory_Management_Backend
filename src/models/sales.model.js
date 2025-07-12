export default (sequelize, DataTypes) =>
    sequelize.define('Sales', {
        status: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        total_price: DataTypes.DECIMAL(10, 2)
    });
