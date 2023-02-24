import  { knex  as setupKnex, Knex} from "knex";
import { env } from "./env/index";

console.log(env.DATABASE_URL);
export const config: Knex.Config = {
	client: "sqlite",
	connection: {
		filename: env.DATABASE_URL
	},
	useNullAsDefault: true,
	migrations: {
		extension: "ts",
		directory: "./db/migrations"
	}
};

export const knex = setupKnex(config);