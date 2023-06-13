Use `thedinne_backend`;

CREATE TABLE `uploadContent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content_type` varchar(128) NOT NULL,
  `title` varchar(128) NOT NULL DEFAULT '',
  `content` varchar(586) NOT NULL DEFAULT '',
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;