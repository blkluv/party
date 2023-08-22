import { createId } from "@paralleldrive/cuid2";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
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
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startTime: int("start_time", { mode: "timestamp_ms" }).notNull(),
  location: text("location").notNull(),
  hideLocation: int("hide_location", { mode: "boolean" }).notNull(),
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

export type Event = InferSelectModel<typeof events>;
export type NewEvent = InferInsertModel<typeof events>;
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
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
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

export type PromotionCode = InferSelectModel<typeof promotionCodes>;
export type NewPromotionCode = InferInsertModel<typeof promotionCodes>;
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
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
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

export type Ticket = InferSelectModel<typeof tickets>;
export type NewTicket = InferInsertModel<typeof tickets>;
export const selectTicketSchema = createSelectSchema(tickets);
export const insertTicketSchema = createInsertSchema(tickets);

export const TICKET_PRICE_VISIBILITY = ["default", "always"] as const;
export type TicketPriceVisibility = (typeof TICKET_PRICE_VISIBILITY)[number];

export const ticketPrices = sqliteTable("ticket_prices", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  // If "default", ticket is only shown when it's predecessor (order - 1) has sold out. If "always", this ticket tier is always visible, no matter the state of its predecessors.
  visibility: text("visibility", { enum: TICKET_PRICE_VISIBILITY })
    .notNull()
    .default("default"),
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

export type TicketPrice = InferSelectModel<typeof ticketPrices>;
export type NewTicketPrice = InferInsertModel<typeof ticketPrices>;
export const selectTicketPriceSchema = createSelectSchema(ticketPrices);
export const insertTicketPriceSchema = createInsertSchema(ticketPrices, {
  price: z.coerce
    .number()
    .gt(0.5, { message: "Price must be greater than $0.50" }),
  limit: z.coerce.number(),
});

export const eventMedia = sqliteTable("event_media", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
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

export type EventMedia = InferSelectModel<typeof eventMedia>;
export type NewEventMedia = InferInsertModel<typeof eventMedia>;
export const selectEventMediaSchema = createSelectSchema(eventMedia);
export const insertEventMediaSchema = createInsertSchema(eventMedia);

export const chatMessages = sqliteTable("chat_messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
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

export type ChatMessage = InferSelectModel<typeof chatMessages>;
export type NewChatMessage = InferInsertModel<typeof chatMessages>;
export const selectChatMessageSchema = createSelectSchema(chatMessages);
export const insertChatMessageSchema = createInsertSchema(chatMessages, {
  createdAt: () => z.coerce.date(),
});

export const chatMessageAttachments = sqliteTable("chat_message_attachments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
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

export type ChatMessageAttachment = InferSelectModel<
  typeof chatMessageAttachments
>;
export type NewChatMessageAttachment = InferInsertModel<
  typeof chatMessageAttachments
>;
export const selectChatMessageAttachmentSchema = createSelectSchema(
  chatMessageAttachments
);
export const insertChatMessageAttachmentSchema = createInsertSchema(
  chatMessageAttachments
);

export const EVENT_ROLES = ["admin", "manager", "promoter"] as const;
export const eventRoles = sqliteTable("event_roles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
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

export type EventRole = InferSelectModel<typeof eventRoles>;
export type NewEventRole = InferInsertModel<typeof eventRoles>;
export const selectEventRoleSchema = createSelectSchema(eventRoles);
export const insertEventRoleSchema = createInsertSchema(eventRoles);
