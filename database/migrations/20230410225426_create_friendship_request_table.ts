import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("friendship_request", function (table) {
    table.increments("id");
    table.uuid("senderId").notNullable();
    table.uuid("receiverId").notNullable();
    table.string("status").checkIn(["pending", "accepted", "refused"]);
    table.string("createdAt").defaultTo(knex.fn.now());
    table.string("updatedAt").defaultTo(knex.fn.now());
    table
      .foreign("senderId")
      .references("user.id")
      .onDelete("NO ACTION")
      .onUpdate("NO ACTION");
    table
      .foreign("receiverId")
      .references("user.id")
      .onDelete("NO ACTION")
      .onUpdate("NO ACTION");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("friendship_request");
}
