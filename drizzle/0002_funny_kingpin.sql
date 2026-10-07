CREATE TABLE `provider_cache` (
	`key` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`round_id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `schedule_session` ON `schedules` (`session_id`);