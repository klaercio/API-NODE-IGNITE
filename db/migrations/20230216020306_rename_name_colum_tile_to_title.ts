import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable("transactions", (table) => {
		table.renameColumn("tile", "title");
	});
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("transactions", (table) => {
		table.renameColumn("title", "tile");
	});
}

