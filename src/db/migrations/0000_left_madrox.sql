CREATE TABLE `event_media` (
	`id` integer PRIMARY KEY NOT NULL,
	`event_id` integer NOT NULL,
	`url` text NOT NULL,
	`is_poster` integer NOT NULL,
	`order` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`start_time` integer NOT NULL,
	`location` text NOT NULL,
	`user_id` text NOT NULL,
	`slug` text NOT NULL,
	`stripe_product_id` text,
	`is_public` integer NOT NULL,
	`capacity` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ticket_prices` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`event_id` integer NOT NULL,
	`stripe_price_id` text,
	`stripe_payment_link_id` text,
	`stripe_payment_link` text,
	`is_free` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` integer PRIMARY KEY NOT NULL,
	`quantity` integer NOT NULL,
	`user_id` text NOT NULL,
	`event_id` integer NOT NULL,
	`ticket_price_id` integer NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_slug_index` ON `events` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `ticket_slug_index` ON `tickets` (`slug`);