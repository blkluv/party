ALTER TABLE events ADD `hide_location` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `location_drop_time`;