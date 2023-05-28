require('dotenv').config();
import mongoose from 'mongoose';
import config from 'config';
import { IDBConnector } from '../dtos/DBConnector';

const [defaultDbName, defaultDbUsername, defaultDbPassword] = [
  config.get<string>('database.name'),
  config.get<string>('database.username'),
  config.get<string>('database.password'),
];
 
export default class DBConnector implements IDBConnector {
  database_username: string;
  database_password: string;
  database_name: string;
  retries: number = 3;

  constructor(
    database_username?: string,
    database_password?: string,
    database_name?: string
  ) {
    this.database_username = database_username || defaultDbUsername;
    this.database_password = database_password || defaultDbPassword;
    this.database_name = database_name || defaultDbName;
  }

  get databaseURL(): string {
    return `mongodb+srv://${this.database_username}:${this.database_password}` + 
     `@cluster0.dyclt.gcp.mongodb.net/${this.database_name}?retryWrites=true&w=majority`;
  }

  async connect() {
    try {
      await mongoose.connect(this.databaseURL);
    } catch (error: any) {
      console.log(error.message);
      if (this.retries > 0) {
        console.log(`Retries left: ${this.retries}`);
        this.retries -= 1;
        setTimeout(this.connect.bind(this), 2000);
      }
    }
  }
}
