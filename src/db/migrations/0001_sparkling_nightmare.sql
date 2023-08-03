CREATE TABLE `chat_message_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`image_id` text NOT NULL,
	`url` text NOT NULL,
	`message_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`user_image_url` text NOT NULL,
	`user_name` text NOT NULL,
	`message` text NOT NULL
);
