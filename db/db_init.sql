CREATE TABLE `sp_air`.`user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `contact` INT(8) NOT NULL,
  `role` VARCHAR(45) NULL,
  `profile_pic_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);



-- ! The tables below will be the actual tables that will be used in the application

CREATE TABLE user (
	  id INT NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact INT(8) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(45) NULL,
    profile_pic_url VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE (username)
);

CREATE TABLE airport (
	  id INT NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    country varchar(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
);
