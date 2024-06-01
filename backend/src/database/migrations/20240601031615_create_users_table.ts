import type { Knex } from "knex";

import { roles } from "../../enums/roles.enum";
import { dbTables } from "../../enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(dbTables.USERS, function (table) {
    table.increments();

    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password', 500).notNullable();
    table.enu('role', [roles.SUPER_ADMIN, roles.ADMIN, roles.MEMBER]).notNullable();

    table.dateTime('createdAt').defaultTo(knex.fn.now());
    table.dateTime('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.dateTime('deletedAt').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(dbTables.USERS);
}
