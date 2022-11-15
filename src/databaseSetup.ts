import { DataSource } from "typeorm";
import { URL } from "url";

require('dotenv').config();

const dbUrl = new URL(process.env.DATABASE_URL as string);
const routingId = dbUrl.searchParams.get("options");
dbUrl.searchParams.delete("options");

export const AppDataSource = new DataSource({
  type: "cockroachdb",
  url: dbUrl.toString(),
  ssl: true,
  extra: {
    options: routingId
  },
  entities: [__dirname + "/entries/*.js"],
  synchronize: true
});