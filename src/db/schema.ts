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
  maxUses: int("max_uses").notNull().default(100),
  createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: int("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const promotionCodeRelations = relations(
  promotionCodes,
  ({ one, many }) => ({
    event: one(events, {
      fields: [promotionCodes.eventId],
      references: [events.id],
    }),
    tickets: many(tickets),
  })
);

export type PromotionCode = InferSelectModel<typeof promotionCodes>;
export type NewPromotionCode = InferInsertModel<typeof promotionCodes>;
export const selectPromotionCodeSchema = createSelectSchema(promotionCodes);
export const insertPromotionCodeSchema = createInsertSchema(promotionCodes, {
  name: z.string().min(3, { message: "Minimum 3 characters" }),
  code: z
    .string()
    .min(3, { message: "Minium 3 characters" })
    .refine((val) => new RegExp(/[A-z0-9]+/).test(val), {
      message: "Promotion code does not match expected format. (ex. FALL20)",
    }),
  percentageDiscount: z.coerce
    .number()
    .gt(0, { message: "Must be greater than 0" }),
  maxUses: z.coerce.number().gt(0, { message: "Must be greater than 0" }),
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
  promotionCodeId: text("promotion_code_id"),
  createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: int("updated_at", { mode: "timestamp_ms" }).notNull(),
  status: text("status", {
    enum: ["success", "pending", "refunded"],
  }).notNull(),
});

export const ticketRelations = relations(tickets, ({ one, many }) => ({
  event: one(events, { fields: [tickets.eventId], references: [events.id] }),
  price: one(ticketPrices, {
    fields: [tickets.ticketPriceId],
    references: [ticketPrices.id],
  }),
  promotionCode: one(promotionCodes, {
    fields: [tickets.promotionCodeId],
    references: [promotionCodes.id],
  }),
  scans: many(ticketScans),
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

export const ticketScans = sqliteTable("ticket_scans", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  /**
   * The event that this ticket is for
   */
  eventId: text("event_id").notNull(),

  /**
   * The ID of the ticket being scanned
   */
  ticketId: text("ticket_id").notNull(),
  /**
   * The user who scanned the ticket
   */
  userId: text("user_id").notNull(),
  /**
   * The time the ticket was scanned
   */
  createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const ticketScanRelations = relations(ticketScans, ({ one }) => ({
  event: one(events, {
    fields: [ticketScans.eventId],
    references: [events.id],
  }),
  ticket: one(tickets, {
    fields: [ticketScans.ticketId],
    references: [tickets.id],
  }),
}));

export type TicketScan = InferSelectModel<typeof ticketScans>;
export type NewTicketScan = InferInsertModel<typeof ticketScans>;
export const selectTicketScanSchema = createSelectSchema(ticketScans);
export const insertTicketScanSchema = createInsertSchema(ticketScans);

export const eventRoleRequests = sqliteTable("event_role_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  /**
   * The event that this request is for
   */
  eventId: text("event_id").notNull(),

  /**
   * The user making the request
   */
  userId: text("user_id").notNull(),

  /**
   * A user-specified message describing why they want this role
   */
  message: text("message").notNull(),

  status: text("status", {
    enum: ["pending", "rejected", "approved"],
  }).notNull(),
  requestedRole: text("request_role", { enum: EVENT_ROLES }).notNull(),
  createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const eventRoleRequestRelations = relations(
  eventRoleRequests,
  ({ one }) => ({
    event: one(events, {
      fields: [eventRoleRequests.eventId],
      references: [events.id],
    }),
  })
);

export type EventRoleRequest = InferSelectModel<typeof eventRoleRequests>;
export type NewEventRoleRequest = InferInsertModel<typeof eventRoleRequests>;
export const selectEventRoleRequestSchema =
  createSelectSchema(eventRoleRequests);
export const insertEventRoleRequestSchema =
  createInsertSchema(eventRoleRequests);
