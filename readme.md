Init data in base

CREATE DATABASE avto;

USE avto;

DROP TABLE IF EXISTS users; CREATE TABLE users ( id int(11) NOT NULL AUTO_INCREMENT, login varchar(10) NOT NULL, token varchar(140) DEFAULT NULL, password varchar(40) NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS position_objects; CREATE TABLE position_objects 
(   id int(11) NOT NULL AUTO_INCREMENT, 
    longitude  float(8,6) NOT NULL, 
    latitude  float(8,6) NOT NULL, 
    city varchar(20) NOT NULL,
    point_name varchar(40) NOT NULL,
    from_file_name varchar(40) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS position_squares; CREATE TABLE position_squares 
(   id int(11) NOT NULL AUTO_INCREMENT, 
    index_squares int(11) NOT NULL,
    longitude  float(8,6) NOT NULL, 
    latitude  float(8,6) NOT NULL, 
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;


INSERT INTO position_squares  
(`index_squares`, `longitude`,`latitude`) 
VALUES  
    ( 1, 37.622106, 75.732358),  
    ( 1, 55.622016, 45.730458), 
    ( 1, 85.625906, 30.739358),  
    ( 1, 25.621406, 35.738308),   
    ( 1, 15.671026, 85.731058);



------------
Service on Fastify framework for nodejs
http://localhost:3000/

swagger
http://127.0.0.1:3000/swagger-docs/static/index.html#/
------------
need :
mysql
redis
npm
-----------
For init service 

nodemon --exec npm run dev

--------------------------
Destination

Create a REST API application in which you can log in. All requests except
Login should be available only if there is a JWT token in the HTTP header
Authorization.
An authorized user can download the file from point 1, and the application
must save all its points to the database.
An authorized user can send a request for a quantity calculation.
matches of the points loaded by him with polygons stored in the file from point 2 and
issue the number of points located in these landfills

--------------------------
example file - 20190701.txt
[ longitude:37.622006, latitude:55.730358 ] Berlin, point 1,
[ longitude:55.621006, latitude:45.730358 ] Tokio, point 2,
[ longitude:85.625006, latitude:40.730358 ] NY, point 3,
[ longitude:75.621006, latitude:65.730358 ] LA, point 4