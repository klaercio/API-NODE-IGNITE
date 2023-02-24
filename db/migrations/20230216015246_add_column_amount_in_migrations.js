"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable("transactions", (table) => {
        table.integer("amount").notNullable();
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable("transactions", (table) => {
        table.dropColumn("amount");
    });
}
exports.down = down;
