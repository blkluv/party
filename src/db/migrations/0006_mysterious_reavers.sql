CREATE TABLE `ticket_scans` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`ticket_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL
);
