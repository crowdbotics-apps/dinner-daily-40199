Use `thedinne_backend`;

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(128) NOT NULL DEFAULT '',
  `content` varchar(255) NOT NULL DEFAULT '',
  `notification_repeat` int(2) DEFAULT 0,
  `notification_days_repeat` varchar(255) DEFAULT NULL,
  `user_group` varchar(128) NOT NULL,
  `store_ids` varchar(255) NULL DEFAULT 'All Store',
  `notification_date` varchar(11) NOT NULL,
  `notification_time` varchar(10) DEFAULT '',
  `push_notification_id` varchar(128) DEFAULT '',
  `email_notification_id` varchar(128) DEFAULT '',
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;