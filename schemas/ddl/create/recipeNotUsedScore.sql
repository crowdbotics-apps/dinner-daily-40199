Use `heroku_52b3caaac7494c9`;

CREATE TABLE `recipeNotUsedScore` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT unique_recipe_user UNIQUE (recipe_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;