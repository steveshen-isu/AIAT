CREATE TABLE `question_bank` (
  `id` int NOT NULL AUTO_INCREMENT,
  `qa_json` json DEFAULT NULL,
  `source_name` text,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
