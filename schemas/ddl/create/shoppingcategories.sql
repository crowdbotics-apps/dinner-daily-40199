Use `thedinne_backend`;

CREATE TABLE `shoppingcategories` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT '',
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
