ALTER TABLE ticket_prices ADD `description` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE ticket_prices ADD `visibility` text DEFAULT 'default' NOT NULL;