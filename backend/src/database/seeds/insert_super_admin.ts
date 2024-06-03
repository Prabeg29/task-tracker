import bcrypt from "bcrypt";
import { Knex } from "knex";
import { faker } from "@faker-js/faker";

import { roles } from "../../enums/roles.enum";
import { dbTables } from "../../enums/db-tables.enum";
import { CreateUserDto } from "../../modules/users/user.type";

export async function seed(knex: Knex): Promise<void> {
  await knex(dbTables.USERS).del();

  const superAdmin: CreateUserDto = {
    name    : faker.person.fullName(),
    email   : faker.internet.email(),
    password: await bcrypt.hash("P@ssword123$", 10),
    role    : roles.SUPER_ADMIN
  };

  await knex(dbTables.USERS).insert(superAdmin);
};
