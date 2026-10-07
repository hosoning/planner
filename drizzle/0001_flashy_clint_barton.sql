CREATE TABLE `itineraries` (
	`round_id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`plan` text NOT NULL,
	`revealed` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `itinerary_session` ON `itineraries` (`session_id`);