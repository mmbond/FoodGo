/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50719
Source Host           : localhost:3306
Source Database       : foodgo

Target Server Type    : MYSQL
Target Server Version : 50719
File Encoding         : 65001

Date: 2020-01-23 13:48:12
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for customers
-- ----------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `customerId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` char(20) NOT NULL,
  `lastName` char(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `addresses` varchar(255) NOT NULL,
  `password` varchar(64) NOT NULL,
  `fav_food` varchar(255) DEFAULT NULL,
  `fav_restaurants` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`customerId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of customers
-- ----------------------------
INSERT INTO `customers` VALUES ('1', 'Marko', 'Milic', 'marko@marko.com', '0648979549', 'Paunova 25', 'e3c4a8e68c23890091f9b9531ef3e0f805ce0a9378d6fb4bbcb6eed403c91342', 'pica, piletina, pasta', null);
INSERT INTO `customers` VALUES ('2', 'Toma', 'Joksimovic', 'toma.joksimovic@gmail.com', '065344744', 'Pozeska 69', 'adb4052aad053dacb971db23206a047c8a6c3b1486873e434017f60f7a352ee9', 'giros, burger, pasta', null);

-- ----------------------------
-- Table structure for ingredients
-- ----------------------------
DROP TABLE IF EXISTS `ingredients`;
CREATE TABLE `ingredients` (
  `ingredientId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `mealId` int(11) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ingredientId`),
  KEY `FK_MEAL` (`mealId`),
  CONSTRAINT `FK_MEAL` FOREIGN KEY (`mealId`) REFERENCES `meals` (`mealId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ingredients
-- ----------------------------

-- ----------------------------
-- Table structure for meals
-- ----------------------------
DROP TABLE IF EXISTS `meals`;
CREATE TABLE `meals` (
  `mealId` int(11) NOT NULL AUTO_INCREMENT,
  `mealName` varchar(100) DEFAULT NULL,
  `mealCategory` varchar(20) DEFAULT NULL,
  `mealImagePath` varchar(255) DEFAULT NULL,
  `meal_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`mealId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of meals
-- ----------------------------

-- ----------------------------
-- Table structure for meals_restaurants
-- ----------------------------
DROP TABLE IF EXISTS `meals_restaurants`;
CREATE TABLE `meals_restaurants` (
  `mealId` int(11) NOT NULL,
  `restaurantId` int(4) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`mealId`,`restaurantId`),
  KEY `FK_RESTAURANT2` (`restaurantId`),
  CONSTRAINT `FK_MEAL2` FOREIGN KEY (`mealId`) REFERENCES `meals` (`mealId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_RESTAURANT2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`restaurantId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of meals_restaurants
-- ----------------------------

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL AUTO_INCREMENT,
  `customerId` int(11) NOT NULL,
  `restaurantId` int(4) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `timestamp` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `meals_ids` varchar(255) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `status` set('finished','in progress','canceled') NOT NULL DEFAULT 'in progress',
  `meal_count` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `mark` set('1','2','3','4','5') DEFAULT '3',
  PRIMARY KEY (`orderId`),
  KEY `FK_CUSTOMER` (`customerId`),
  KEY `FK_RESTAURANT` (`restaurantId`),
  CONSTRAINT `FK_CUSTOMER` FOREIGN KEY (`customerId`) REFERENCES `customers` (`customerId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_RESTAURANT` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`restaurantId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of orders
-- ----------------------------

-- ----------------------------
-- Table structure for restaurants
-- ----------------------------
DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE `restaurants` (
  `restaurantId` int(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `category` char(255) DEFAULT NULL,
  `address` varchar(60) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `work_time` varchar(15) DEFAULT NULL,
  `mark` decimal(3,2) DEFAULT NULL,
  `restaurantLogo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`restaurantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of restaurants
-- ----------------------------
