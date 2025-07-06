import { Sequelize } from 'sequelize';
import dbConfig from '../config/db.config.js';
import StudentModel from './sales.model.js';
import CourseModel from './product.model.js';
import TeacherModel from './user.model.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Student = StudentModel(sequelize, Sequelize);
db.Course = CourseModel(sequelize, Sequelize);
db.Teacher = TeacherModel(sequelize, Sequelize);

// Associations
db.Teacher.hasMany(db.Course);
db.Course.belongsTo(db.Teacher);

db.Course.belongsToMany(db.Student, { through: "CourseStudent" });
db.Student.belongsToMany(db.Course, { through: "CourseStudent" });

await sequelize.sync({ alter: true }); // dev only

export default db;
