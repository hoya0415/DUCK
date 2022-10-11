create schema common_pjt;
use common_pjt;

create table user(
	user_id int unsigned Auto_increment primary key not null,
    email varchar(30) unique not null,
    password varchar(20) not null,
    nickname varchar(20) not null,
    bio varchar(20),
    sign_up_date timestamp default current_timestamp
);

create table follow (
    follow_id int unsigned Auto_increment Primary key not null,
    from_user_id int unsigned not null,
    to_user_id int unsigned not null
);

create table alert (
	alert_id int unsigned Auto_increment Primary key not null,
    sender_id int unsigned not null,
    sender_nickname varchar(20) not null,
    target_id int unsigned not null,
    feed_id int unsigned,
    comment_id int unsigned,
    type varchar(20) not null,
    checked boolean,
    alert_date timestamp default current_timestamp
);

create table feed(
    feed_id int unsigned primary key not null auto_increment,
    user_id int unsigned not null,
    title varchar(30) not null,
    category varchar(10) not null,
    contents varchar(500),
    upload_date timestamp default current_timestamp,
    edit_date timestamp,
    like_cnt int unsigned default 0
);

create table comment(
	comment_id int unsigned primary key not null auto_increment,
    user_id int unsigned not null,
    nickname varchar(20) not null,
    feed_id int unsigned not null,
    contents varchar(300),
    is_hidden boolean default false,
    create_date timestamp default current_timestamp,
    edit_date timestamp,
    comment_like_cnt int unsigned default 0
);

create table feed_like(
	feed_like_id int unsigned primary key not null auto_increment,
    user_id int unsigned not null,
    feed_id int unsigned not null,
    like_date timestamp default current_timestamp
);

create table comment_like(
	comment_like_id int unsigned primary key not null auto_increment,
    user_id int unsigned not null,
    comment_id int unsigned not null,
    like_date timestamp default current_timestamp
);

create table chat(
    chat_id int unsigned primary key not null auto_increment,
    user_id int unsigned not null,
    chat_title varchar(30) not null,
    chat_contents varchar(50),
    create_date timestamp default current_timestamp,
    video_url varchar(100)
);

create table message(
	message_id int unsigned primary key not null auto_increment,
    chat_id int unsigned not null,
    user_id int unsigned not null,
    contents varchar(100),
    send_time timestamp default current_timestamp
);

create table chat_log(
	log_id int primary key not null auto_increment,
    chat_id int unsigned not null,
    user_id int unsigned not null
);


CREATE TABLE `file_info` (
  `file_id` int unsigned primary key not null auto_increment,
  `feed_id` int unsigned NOT NULL,
  `file_url` varchar(100) DEFAULT NULL,
  `file_name` varchar(50) DEFAULT NULL,
  KEY `file_info_feed_id_fk_idx` (`feed_id`),
  CONSTRAINT `file_info_feed_id_fk` FOREIGN KEY (`feed_id`) REFERENCES `feed` (`feed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `file_profile` (
  `file_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `file_url` varchar(100) DEFAULT NULL,
  `file_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`file_id`),
  KEY `file_profile_user_id_fk_idx` (`user_id`),
  CONSTRAINT `file_info_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `file_chat` (
  `file_id` int unsigned NOT NULL AUTO_INCREMENT,
  `chat_id` int unsigned NOT NULL,
  `file_url` varchar(100) DEFAULT NULL,
  `file_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`file_id`),
  KEY `file_chat_chat_id_fk_idx` (`chat_id`),
  CONSTRAINT `file_chat_chat_id_fk` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`chat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;