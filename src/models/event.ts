export function event(Model, sequelize, DataTypes) {
  class event extends Model {}

  event.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        defaultValue: 0,
        allowNull: false,
      },
      eventName: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "event",
      timestamps: false,
    }
  );

  return event;
}
