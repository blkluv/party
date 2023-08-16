import type { InferModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const EVENT_TYPES = ["event", "discussion"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/**
 * This table contains both events and discussions. They are differentiated by the "type" column
 * Discussions don't have tickets prices, tickets, and their capacity should be 0
 */
export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startTime: int("start_time", { mode: "timestamp_ms" }).notNull(),
  location: text("location").notNull(),
  locationDropTime: int("location_drop_time", {
    mode: "timestamp_ms",
  }).notNull(),
  userId: text("user_id").notNull(),
  type: text("type", { enum: EVENT_TYPES }).notNull(),
  stripeProductId: text("stripe_product_id").notNull(),
  isPublic: int("is_public", { mode: "boolean" }).notNull(),
  isFeatured: int("is_featured", { mode: "boolean" }).notNull(),
  capacity: int("capacity").notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: int("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const eventsRelations = relations(events, ({ many }) => ({
  tickets: many(tickets),
  ticketPrices: many(ticketPrices),
  eventMedia: many(eventMedia),
  roles: many(eventRoles),
  promotionCodes: many(promotionCodes),
}));

export type Event = InferModel<typeof events, "select">;
export type NewEvent = InferModel<typeof events, "insert">;
export const selectEventSchema = createSelectSchema(events);
export const insertEventSchema = createInsertSchema(events, {
  capacity: z.coerce.number().gte(0, {
    message: "Capacity must be a number greater than or equal to 0.",
  }),
  name: (schema) =>
    schema.name.min(3, {
      message: "Name must be longer than 3 characters.",
    }),
  location: (schema) =>
    schema.name
      .min(3, {
        message: "Location must be longer than 3 characters.",
      })
      .refine(
        (e) => e.split("").filter((letter) => letter !== " ").length > 3,
        {
          message: "Location must be longer than 3 characters.",
        }
      ),
});

export const promotionCodes = sqliteTable("promotion_codes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  stripePromotionCodeId: text("stripe_promotion_code_id").notNull(),
  code: text("code").notNull(),
  eventId: text("event_id").notNull(),
  percentageDiscount: int("percentage_discount").notNull(),
  stripeCouponId: text("stripe_coupon_id").notNull(),
  // The creator of this promotion code
  userId: text("user_id").notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: int("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const promotionCodeRelations = relations(promotionCodes, ({ one }) => ({
  event: one(events, {
    fields: [promotionCodes.eventId],
    references: [events.id],
  }),
}));

export type PromotionCode = InferModel<typeof promotionCodes, "select">;
export type NewPromotionCode = InferModel<typeof promotionCodes, "insert">;
export const selectPromotionCodeSchema = createSelectSchema(promotionCodes);
export const insertPromotionCodeSchema = createInsertSchema(promotionCodes, {
  code: () =>
    z
      .string()
      .min(3, {
        message: "Promotion code must be at least 3 characters long.",
      })
      .refine((val) => new RegExp(/[A-z0-9]+/).test(val), {
        message: "Promotion code does not match expected format. (ex. FALL20)",
      }),
  percentageDiscount: z.coerce.number(),
});

export const tickets = sqliteTable("tickets", {
  id: text("id").primaryKey(),
  quantity: int("quantity").notNull(),
  userId: text("user_id").notNull(),
  eventId: text("event_id").notNull(),
  ticketPriceId: text("ticket_price_id").notNull(),
  stripeSessionId: text("stripe_session_id"),
  createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: int("updated_at", { mode: "timestamp_ms" }).notNull(),
  status: text("status", { enum: ["success", "pending"] }).notNull(),
});

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
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  // Cost of ticket in cents CAD
  price: real("price").notNull(),
  eventId: text("event_id").notNull(),
  stripePriceId: text("stripe_price_id"),
  userId: text("user_id").notNull(),
  isFree: int("is_free", { mode: "boolean" }).notNull(),
  // The maximum number of tickets that are allowed to be sold for this price
  limit: int("limit").notNull(),
  order: int("order").notNull(),
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
  limit: z.coerce.number(),
});

export const eventMedia = sqliteTable("event_media", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull(),
  url: text("url").notNull(),
  isPoster: int("is_poster", { mode: "boolean" }).notNull(),
  order: int("order").notNull(),
  userId: text("user_id").notNull(),
  // The ID within Cloudflare Images
  // Need this to delete
  imageId: text("image_id").notNull(),
});

export const eventMediaRelations = relations(eventMedia, ({ one }) => ({
  event: one(events, { fields: [eventMedia.eventId], references: [events.id] }),
}));

export type EventMedia = InferModel<typeof eventMedia, "select">;
export type NewEventMedia = InferModel<typeof eventMedia, "insert">;
export const selectEventMediaSchema = createSelectSchema(eventMedia);
export const insertEventMediaSchema = createInsertSchema(eventMedia);

export const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull(),
  userId: text("user_id").notNull(),
  message: text("message").notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const chatMessageRelations = relations(
  chatMessages,
  ({ one, many }) => ({
    event: one(events, {
      fields: [chatMessages.eventId],
      references: [events.id],
    }),
    attachments: many(chatMessageAttachments),
  })
);

export type ChatMessage = InferModel<typeof chatMessages, "select">;
export type NewChatMessage = InferModel<typeof chatMessages, "insert">;
export const selectChatMessageSchema = createSelectSchema(chatMessages);
export const insertChatMessageSchema = createInsertSchema(chatMessages, {
  createdAt: () => z.coerce.date(),
});

export const chatMessageAttachments = sqliteTable("chat_message_attachments", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull(),
  userId: text("user_id").notNull(),
  // The ID within Cloudflare Images
  // Need this to delete
  imageId: text("image_id").notNull(),
  url: text("url").notNull(),
  // Chat message this belongs to
  messageId: text("message_id").notNull(),
});

export const chatMessageAttachmentRelations = relations(
  chatMessageAttachments,
  ({ one }) => ({
    message: one(chatMessages, {
      fields: [chatMessageAttachments.messageId],
      references: [chatMessages.id],
    }),
  })
);

export type ChatMessageAttachment = InferModel<
  typeof chatMessageAttachments,
  "select"
>;
export type NewChatMessageAttachment = InferModel<
  typeof chatMessageAttachments,
  "insert"
>;
export const selectChatMessageAttachmentSchema = createSelectSchema(
  chatMessageAttachments
);
export const insertChatMessageAttachmentSchema = createInsertSchema(
  chatMessageAttachments
);

export const EVENT_ROLES = ["admin", "manager", "promoter"] as const;
export const eventRoles = sqliteTable("event_roles", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull(),
  userId: text("user_id").notNull(),
  role: text("role", { enum: EVENT_ROLES }).notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: int("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const eventRolesRelations = relations(eventRoles, ({ one }) => ({
  event: one(events, {
    fields: [eventRoles.eventId],
    references: [events.id],
  }),
}));

export type EventRole = InferModel<typeof eventRoles, "select">;
export type NewEventRole = InferModel<typeof eventRoles, "insert">;
export const selectEventRoleSchema = createSelectSchema(eventRoles);
export const insertEventRoleSchema = createInsertSchema(eventRoles);
