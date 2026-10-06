CREATE TABLE `rounds` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`snapshot` text NOT NULL,
	`salt` text NOT NULL,
	`commitment` text NOT NULL,
	`status` text NOT NULL,
	`answer` text,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`planning_until` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `round_session` ON `rounds` (`session_id`);--> statement-breakpoint
CREATE TABLE `usage` (
	`bucket` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL
);
