"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable("transactions", (table) => {
        table.renameColumn("tile", "title");
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable("transactions", (table) => {
        table.renameColumn("title", "tile");
    });
}
exports.down = down;
