import { DataTypes, Model } from "sequelize";
import sequelize from "../database.js";
import { ServerAttributes } from "../../types/Database.js";

class Server extends Model<ServerAttributes> implements ServerAttributes {
  declare id: string;
  declare welcomeChannel: string | null;
}

Server.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    welcomeChannel: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'server'
  }
);

export default Server;