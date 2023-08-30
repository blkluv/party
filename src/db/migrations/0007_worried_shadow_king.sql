CREATE TABLE `event_role_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`message` text NOT NULL,
	`status` text NOT NULL,
	`request_role` text NOT NULL,
	`created_at` integer NOT NULL
);
