export default (sequelize, DataTypes) =>
    sequelize.define('Product', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        category: DataTypes.STRING
    });
