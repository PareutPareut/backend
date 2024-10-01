import { dbConfig } from "../config/db";
import { Sequelize, DataTypes } from "sequelize";
import { eventDates, EventDates } from "./eventDates";
import { events, Events } from "./events";
import { users, Users } from "./users";
import { userTimes, UserTimes } from "./userTimes";
export const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: "mysql",
});

export const db = {
  sequelize: sequelize,
  user: users(sequelize, DataTypes),
  event: events(sequelize, DataTypes),
  eventDate: eventDates(sequelize, DataTypes),
  userTime: userTimes(sequelize, DataTypes),
};

db.event.hasMany(EventDates, {
  sourceKey: "eventId",
  foreignKey: "eventId",
  as: "eventHasManyEventDates",
});
db.eventDate.belongsTo(Events, {
  foreignKey: "eventId",
});

db.event.hasMany(Users, {
  sourceKey: "eventId",
  foreignKey: "eventId",
  as: "eventHasManyUsers",
});

db.user.belongsTo(Events, {
  foreignKey: "eventId",
});

db.eventDate.hasMany(UserTimes, {
  sourceKey: "date",
  foreignKey: "date",
  as: "eventDateHasManyUserTimes",
});
db.userTime.belongsTo(EventDates, {
  foreignKey: "eventId",
});

/*
db.user.hasMany(UserTimes, {
  sourceKey: "userName",
  foreignKey: "userName",
  as: "userHasManyUserTimes",
});
db.userTime.belongsTo(Users, {
  foreignKey: "userName",
});
*/
