import type { Knex } from "knex";

import { dbTables } from "../../enums/db-tables.enum";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(dbTables.TASKS, function (table) {
    table.increments();

    table.string("title").notNullable();
    table.text("description");
    table.integer("createdBy").unsigned().notNullable();
    table.integer("assignedTo").unsigned();
    table.string("status").defaultTo("todo");
    table.dateTime("completedAt").defaultTo(null);

    table.dateTime("createdAt").defaultTo(knex.fn.now());
    table.dateTime("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.dateTime("deletedAt").defaultTo(null);

    table.foreign("createdBy").references(`${dbTables.USERS}.id`);
    table.foreign("assignedTo").references(`${dbTables.USERS}.id`);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(dbTables.TASKS, function (table) {
    table.dropForeign(["createdBy"]);
    table.dropForeign(["assignedTo"]);
  });
  await knex.schema.dropTable(dbTables.TASKS);
}
