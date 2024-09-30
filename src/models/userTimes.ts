import { Sequelize, Model, Association } from "sequelize";
import { EventDates } from "./eventDates";
import { UserTimesAttributes } from "../interfaces/sequelize";

export class UserTimes extends Model<UserTimesAttributes> {
  declare readonly userTimeId: number;
  declare userName: string;
  declare eventId: number;
  declare date: Date;
  declare time: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare static associations: {
    //userTimesHasManyUsers: Association<UserTimes, Users>;
    userTimesHasManyEventDates: Association<UserTimes, EventDates>;
  };
}

export function userTimes(sequelize: Sequelize, DataTypes: any) {
  UserTimes.init(
    {
      userTimeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      userName: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      modelName: "UserTimes",
      tableName: "UserTimes",
      sequelize,
      freezeTableName: true,
      timestamps: true,
      updatedAt: "updateTimestamp",
    }
  );
  return UserTimes;
}
