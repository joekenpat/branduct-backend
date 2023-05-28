export interface IDBConnector {
  database_name: string;
  database_username: string;
  database_password: string;
  get databaseURL(): string;
  connect: () => Promise<void>;
};
