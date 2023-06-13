UPDATE thedinne_backend.users SET roles = "USER" WHERE roles = 'a:1:{i:0;s:9:\"ROLE_USER\";}' limit 1000;
UPDATE thedinne_backend.users SET roles = "ADMIN" WHERE roles = 'a:2:{i:0;s:9:\"ROLE_USER\";i:1;s:10:\"ROLE_ADMIN\";}' limit 1000;
UPDATE thedinne_backend.users SET roles = "SUBADMIN" WHERE roles = 'a:2:{i:0;s:9:\"ROLE_USER\";i:1;s:18:\"ROLE_ADMIN_LIMITED\";}' limit 1000;
UPDATE thedinne_backend.users SET roles = "SUBADMIN" WHERE roles = 'a:2:{i:0;s:9:\"ROLE_USER\";i:1;s:19:\"ROLE_CONTENT_PERSON\";}' limit 1000;