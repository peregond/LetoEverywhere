CREATE TABLE `game_progress` (
	`user_id` text PRIMARY KEY NOT NULL,
	`save_json` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
