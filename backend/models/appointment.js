module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    "appointment",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      availability_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "availability",
          key: "id",
        },
      },
      insurance_type: {
        type: DataTypes.ENUM,
        values: ["public", "private"],
        allowNull: false,
      },
      book_translation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return Appointment;
};
