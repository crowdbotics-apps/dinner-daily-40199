ALTER TABLE thedinne_backend.users ADD notification int(11) NOT NULL DEFAULT 1;

ALTER TABLE thedinne_backend.users ADD phone_number VARCHAR(50) NULL;

ALTER TABLE thedinne_backend.users MODIFY roles VARCHAR(255) COMMENT 'Roles comma Separated';

ALTER TABLE thedinne_backend.users ALTER COLUMN roles SET DEFAULT "USER";

ALTER TABLE thedinne_backend.users MODIFY password VARCHAR(255);

ALTER TABLE thedinne_backend.users add stripe_customer_id VARCHAR(255);

