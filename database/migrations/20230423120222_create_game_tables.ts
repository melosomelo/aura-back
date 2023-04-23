import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("game", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("ownerId").notNullable();
    table
      .string("status")
      .notNullable()
      .checkIn(["setup", "active", "over"])
      .defaultTo("setup");
    table
      .foreign("ownerId")
      .references("user.id")
      .onDelete("NO ACTION")
      .onUpdate("NO ACTION");
    table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
    table.datetime("updatedAt").notNullable().defaultTo(knex.fn.now());
  });
  await knex.schema.createTable("game_invite", function (table) {
    table.uuid("gameId").notNullable();
    table.uuid("recipientId").notNullable();
    table
      .string("status")
      .notNullable()
      .checkIn(["pending", "accepted", "refused"])
      .defaultTo("pending");
    table
      .foreign("gameId")
      .references("game.id")
      .onDelete("NO ACTION")
      .onUpdate("NO ACTION");
    table
      .foreign("recipientId")
      .references("user.id")
      .onDelete("NO ACTION")
      .onUpdate("NO ACTION");
    table.primary(["gameId", "recipientId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("game_invite");
  await knex.schema.dropTable("game");
}
