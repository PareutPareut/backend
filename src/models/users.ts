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
import { UsersAttributes } from "../interfaces/sequelize";

export class Users extends Model<UsersAttributes> {
  declare readonly userId: number;
  declare eventId: number;
  declare userName: string;
  declare password: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare getEvents: HasManyGetAssociationsMixin<Events>;
  declare addEvents: HasManyAddAssociationMixin<Events, number>;
  declare hasEvents: HasManyHasAssociationMixin<Events, number>;
  declare countEvents: HasManyCountAssociationsMixin;
  declare createEvents: HasManyCreateAssociationMixin<Events>;

  declare static associations: {
    userHasManyEvents: Association<Users, Events>;
  };
}
export function users(sequelize: Sequelize, DataTypes: any) {
  Users.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
    },
    {
      modelName: "User",
      tableName: "User",
      sequelize,
      freezeTableName: true,
      timestamps: true,
      updatedAt: "updateTimestamp",
      indexes: [
        {
          unique: true,
          fields: ["eventId", "userName"],
        },
      ],
    }
  );
  return Users;
}
