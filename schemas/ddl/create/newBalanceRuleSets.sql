Use `thedinne_backend`;

CREATE TABLE `newBalanceRuleSets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(128) NOT NULL DEFAULT '',
  `rule_id` varchar(1028) NOT NULL DEFAULT '',
  `value` varchar(50) NOT NULL DEFAULT '',
  `comment` varchar(255) NOT NULL DEFAULT '',
  `yaml_key` varchar(50) NOT NULL DEFAULT '',
  `additional_rule` varchar(255) NOT NULL DEFAULT '',
  `soft` varchar(8) DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
