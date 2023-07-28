import { InferModel, relations } from "drizzle-orm";
import {
  int,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const events = sqliteTable(
  "events",
  {
    id: int("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    startTime: int("start_time", { mode: "timestamp_ms" }).notNull(),
    location: text("location").notNull(),
    userId: text("user_id").notNull(),
    slug: text("slug").notNull(),
    stripeProductId: text("stripe_product_id"),
    isPublic: int("is_public", { mode: "boolean" }).notNull(),
    capacity: int("capacity").notNull(),
    createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: int("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    slugIndex: uniqueIndex("event_slug_index").on(table.slug),
  })
);

export const eventsRelations = relations(events, ({ many }) => ({
  tickets: many(tickets),
  ticketPrices: many(ticketPrices),
  eventMedia: many(eventMedia),
}));

export type Event = InferModel<typeof events, "select">;
export type NewEvent = InferModel<typeof events, "insert">;
export const selectEventSchema = createSelectSchema(events);
export const insertEventSchema = createInsertSchema(events, {
  capacity: z.coerce.number().gt(0, {
    message: "Capacity must be a number greater than 0",
  }),
  description: (schema) =>
    schema.description.min(15, {
      message: "Description must be longer than 15 characters",
    }),
  name: (schema) =>
    schema.name.min(3, {
      message: "Name must be longer than 3 characters",
    }),
});

export const tickets = sqliteTable(
  "tickets",
  {
    id: int("id").primaryKey(),
    quantity: int("quantity").notNull(),
    userId: text("user_id").notNull(),
    eventId: int("event_id").notNull(),
    ticketPriceId: int("ticket_price_id").notNull(),
    slug: text("slug").notNull(),
    stripeSessionId: text("stripe_session_id"),
    createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: int("updated_at", { mode: "timestamp_ms" }).notNull(),
    status: text("status", { enum: ["success", "pending"] }).notNull(),
  },
  (table) => ({
    slugIndex: uniqueIndex("ticket_slug_index").on(table.slug),
  })
);

export const ticketRelations = relations(tickets, ({ one }) => ({
  event: one(events, { fields: [tickets.eventId], references: [events.id] }),
  price: one(ticketPrices, {
    fields: [tickets.ticketPriceId],
    references: [ticketPrices.id],
  }),
}));

export type Ticket = InferModel<typeof tickets, "select">;
export type NewTicket = InferModel<typeof tickets, "insert">;
export const selectTicketSchema = createSelectSchema(tickets);
export const insertTicketSchema = createInsertSchema(tickets);

export const ticketPrices = sqliteTable("ticket_prices", {
  id: int("id").primaryKey(),
  name: text("name").notNull(),
  // Cost of ticket in cents CAD
  price: real("price").notNull(),
  eventId: int("event_id").notNull(),
  stripePriceId: text("stripe_price_id"),
  isFree: int("is_free", { mode: "boolean" }).notNull(),
});

export const ticketPriceRelations = relations(
  ticketPrices,
  ({ one, many }) => ({
    event: one(events, {
      fields: [ticketPrices.eventId],
      references: [events.id],
    }),
    tickets: many(tickets),
  })
);

export type TicketPrice = InferModel<typeof ticketPrices, "select">;
export type NewTicketPrice = InferModel<typeof ticketPrices, "insert">;
export const selectTicketPriceSchema = createSelectSchema(ticketPrices);
export const insertTicketPriceSchema = createInsertSchema(ticketPrices, {
  price: z.coerce
    .number()
    .gt(0.5, { message: "Price must be greater than $0.50" }),
});

export const eventMedia = sqliteTable("event_media", {
  id: int("id").primaryKey(),
  eventId: int("event_id").notNull(),
  url: text("url").notNull(),
  isPoster: int("is_poster", { mode: "boolean" }).notNull(),
  order: int("order").notNull(),
});

export const eventMediaRelations = relations(eventMedia, ({ one }) => ({
  event: one(events, { fields: [eventMedia.eventId], references: [events.id] }),
}));

export type EventMedia = InferModel<typeof eventMedia, "select">;
export type NewEventMedia = InferModel<typeof eventMedia, "insert">;
export const selectEventMediaSchema = createSelectSchema(eventMedia);
export const insertEventMediaSchema = createInsertSchema(eventMedia);
