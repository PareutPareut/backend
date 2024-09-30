import {
  Sequelize,
  Model,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Association,
} from "sequelize";
import { Events } from "./events";
import { EventDatesAttributes } from "../interfaces/sequelize";

export class EventDates extends Model<EventDatesAttributes> {
  declare eventId: number;
  declare date: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare getEvents: HasManyGetAssociationsMixin<Events>;
  declare addEvents: HasManyAddAssociationMixin<Events, number>;
  declare hasEvents: HasManyHasAssociationMixin<Events, number>;
  declare countEvents: HasManyCountAssociationsMixin;
  declare createEvents: HasManyCreateAssociationMixin<Events>;

  declare static associations: {
    userHasManyEvents: Association<Events, Events>;
  };
}

export function eventDates(sequelize: Sequelize, DataTypes: any) {
  EventDates.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      modelName: "EventDates",
      tableName: "EventDates",
      sequelize,
      freezeTableName: true,
      timestamps: true,
      updatedAt: "updateTimestamp",
    }
  );
  return EventDates;
}
