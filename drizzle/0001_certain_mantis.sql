CREATE TABLE `discountLeads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`discountCode` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `discountLeads_id` PRIMARY KEY(`id`),
	CONSTRAINT `discountLeads_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `emailVerifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`code` varchar(6) NOT NULL,
	`verified` int NOT NULL DEFAULT 0,
	`attempts` int NOT NULL DEFAULT 0,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailVerifications_id` PRIMARY KEY(`id`)
);
