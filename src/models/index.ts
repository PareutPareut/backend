import { dbConfig } from "../config/db.js";
import { Sequelize, DataTypes, Model } from "sequelize";

import { user } from "../models/user.js";
import { userTime } from "./userTime.js";
import { event } from "./event.js";
import { eventDate } from "./eventDate.js";

const db = {}; // 실제 데이터베이스가 이 db 객체와 연결됨

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig.options
);

db.sequelize = sequelize;

db.user = user(Model, sequelize, DataTypes);
db.userTime = userTime(Model, sequelize, DataTypes);

db.event = event(Model, sequelize, DataTypes);
db.eventDate = eventDate(Model, sequelize, DataTypes);

export { db };
