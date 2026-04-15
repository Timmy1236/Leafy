import Sequelize, { Model } from "sequelize";
import sequelize from "../database.js";
import { UserAttributes } from "../../types/Database.js";

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: string;
  declare xp: number;
  declare level: number;
  declare commandsCount: number;
}

User.init(
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    xp: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    commandsCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'user'
  }
);

export default User;