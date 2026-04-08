CREATE TABLE `smsOptIns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`email` varchar(320),
	`stripeChargeId` varchar(100),
	`stripeCustomerId` varchar(100),
	`ticketType` enum('virtual','general','vip'),
	`amountInCents` int,
	`status` enum('active','unsubscribed','invalid','bounced') NOT NULL DEFAULT 'active',
	`verified` int NOT NULL DEFAULT 0,
	`verificationCode` varchar(10),
	`smsSentCount` int NOT NULL DEFAULT 0,
	`lastSmsSentAt` timestamp,
	`optedInAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `smsOptIns_id` PRIMARY KEY(`id`)
);
