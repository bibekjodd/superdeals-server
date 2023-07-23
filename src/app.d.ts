import { EnvType } from "./lib/validateEnv";
import { IUser } from "./models/User.Model";
export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvType {
      NODE_ENV: "production" | "development";
      FRONTEND_URL: string;
    }
  }
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
  var envLoaded: boolean;
  var databaseConnected: boolean;
}
