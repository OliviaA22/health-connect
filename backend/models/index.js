require('dotenv').config();

const dbConfig = require("../config/db.js");

const { Sequelize, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Op;

db.Specialization = require("./specialization.js")(sequelize, DataTypes);
db.User = require("./user.js")(sequelize, DataTypes);
db.UserLanguage = require("./user_language.js")(sequelize, DataTypes);

db.Language = require("./language.js")(sequelize, DataTypes);

db.Appointment = require("./appointment.js")(sequelize, DataTypes);
db.Availability = require("./availability.js")(sequelize, DataTypes);

db.Blog = require("./blog.js")(sequelize, DataTypes);


// Define relationships
db.Specialization.hasMany(db.User, {
  foreignKey: 'specialization_id',
});
db.User.belongsTo(db.Specialization, {
  foreignKey: 'specialization_id',
});


db.User.belongsToMany(db.Language, {
  through: "user_language",
  foreignKey: "user_id",
  otherKey: "language_id",
});
db.Language.belongsToMany(db.User, {
  through: "user_language",
  foreignKey: "language_id",
  otherKey: "user_id",
});

db.User.hasMany(db.Blog, {
  foreignKey: "created_by",
});
db.Blog.belongsTo(db.User, {
  foreignKey: "created_by",
});


db.Appointment.belongsTo(db.Availability, {
  foreignKey: 'availability_id',
  as: 'availability',
});
db.Availability.hasOne(db.Appointment, {
  foreignKey: "availability_id",
});

db.User.hasMany(db.Appointment, {
  foreignKey: "user_id",
});
db.Appointment.belongsTo(db.User, {
  foreignKey: "user_id",
  as: 'patient',
});

db.User.hasMany(db.Appointment, {
  foreignKey: "doctor_id",
});
db.Appointment.belongsTo(db.User, {
  foreignKey: "doctor_id",
  as: 'doctor',
});


db.User.hasMany(db.Availability, {
  foreignKey: "doctor_id",
});
db.Availability.belongsTo(db.User, {
  foreignKey: "doctor_id",
});

db.sequelize.sync({ force: false }).then(() => {});

module.exports = db;
