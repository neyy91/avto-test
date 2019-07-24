CREATE DATABASE avto;

USE avto;

DROP TABLE IF EXISTS users; CREATE TABLE users ( id int(11) NOT NULL AUTO_INCREMENT, login varchar(10) NOT NULL, token varchar(140) DEFAULT NULL, password varchar(40) NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;


------------
need :
mysql
redis
npm
-----------
For init service 

nodemon --exec npm run dev