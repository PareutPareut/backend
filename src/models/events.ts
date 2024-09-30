import { Sequelize, Model } from "sequelize";
import { EventsAttributes } from "../interfaces/sequelize";

export class Events extends Model<EventsAttributes> {
  declare readonly eventId?: number;
  declare eventName: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export function events(sequelize: Sequelize, DataTypes: any) {
  Events.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      eventName: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
    },
    {
      modelName: "Events",
      tableName: "Events",
      sequelize,
      freezeTableName: true,
      timestamps: true,
      updatedAt: "updateTimestamp",
    }
  );
  return Events;
}
