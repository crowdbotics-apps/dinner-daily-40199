UPDATE heroku_52b3caaac7494c9.users SET roles = "USER" WHERE roles = 'a:1:{i:0;s:9:\"ROLE_USER\";}' limit 10000;
UPDATE heroku_52b3caaac7494c9.users SET roles = "ADMIN" WHERE roles = 'a:2:{i:0;s:9:\"ROLE_USER\";i:1;s:10:\"ROLE_ADMIN\";}' limit 10000;
UPDATE heroku_52b3caaac7494c9.users SET roles = "SUBADMIN" WHERE roles = 'a:2:{i:0;s:9:\"ROLE_USER\";i:1;s:18:\"ROLE_ADMIN_LIMITED\";}' limit 10000;
UPDATE heroku_52b3caaac7494c9.users SET roles = "SUBADMIN" WHERE roles = 'a:2:{i:0;s:9:\"ROLE_USER\";i:1;s:19:\"ROLE_CONTENT_PERSON\";}' limit 10000;
UPDATE heroku_52b3caaac7494c9.users SET referral_code = CONCAT(SUBSTRING(MD5(RAND()), 1, 4), '-', LPAD(FLOOR(RAND() * 10000), 4, '0')) limit 10000;