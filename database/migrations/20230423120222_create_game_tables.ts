import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("game", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("ownerId").notNullable();
    table.string("type").notNullable().checkIn(["golden_goal", "2v2"]);
    table
      .string("status")
      .notNullable()
      .checkIn(["setup", "active", "over"])
      .defaultTo("setup");
    table.integer("teamAScore").notNullable().defaultTo(0);
    table.integer("teamBScore").notNullable().defaultTo(0);
    table
      .foreign("ownerId")
      .references("user.id")
      .onDelete("NO ACTION")
      .onUpdate("NO ACTION");
    table.check("?? >= 0", ["teamAScore"]);
    table.check("?? >= 0", ["teamBScore"]);
  });
  await knex.schema.createTable("user_plays", function (table) {
    table.uuid("gameId").notNullable();
    table.uuid("userId").notNullable();
    table.string("team", 1).notNullable().checkIn(["A", "B"]);
    table
      .foreign("gameId")
      .references("game.id")
      .onDelete("NO ACTION")
      .onUpdate("NO ACTION");
    table
      .foreign("userId")
      .references("user.id")
      .onDelete("NO ACTION")
      .onUpdate("NO ACTION");
    table.primary(["gameId", "userId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("user_plays");
  await knex.schema.dropTable("game");
}
