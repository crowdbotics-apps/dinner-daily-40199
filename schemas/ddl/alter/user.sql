ALTER TABLE heroku_52b3caaac7494c9.users ADD notification int(11) NOT NULL DEFAULT 1;

ALTER TABLE heroku_52b3caaac7494c9.users ADD phone_number VARCHAR(50) NULL;

ALTER TABLE heroku_52b3caaac7494c9.users MODIFY roles VARCHAR(255) COMMENT 'Roles comma Separated';

ALTER TABLE heroku_52b3caaac7494c9.users ALTER COLUMN roles SET DEFAULT "USER";

ALTER TABLE heroku_52b3caaac7494c9.users MODIFY password VARCHAR(255);

ALTER TABLE heroku_52b3caaac7494c9.users add stripe_customer_id VARCHAR(255);

