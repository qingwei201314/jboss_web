/*
Navicat MySQL Data Transfer

Source Server         : 113.106.92.109
Source Server Version : 50524
Source Host           : 113.106.92.109:3306
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 50524
File Encoding         : 65001

Date: 2013-05-10 20:14:53
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `category`
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` varchar(32) NOT NULL,
  `name` varchar(18) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('4028d8473e8e4f41013e8e5108010002', 'sdf');
INSERT INTO `category` VALUES ('4028d8473e8e4f41013e8e5a7e200003', 'sdf');
INSERT INTO `category` VALUES ('4028d8473e8e5c2a013e8e5cc7730002', 'asdf');

-- ----------------------------
-- Table structure for `image`
-- ----------------------------
DROP TABLE IF EXISTS `image`;
CREATE TABLE `image` (
  `id` varchar(32) NOT NULL,
  `product_id` varchar(32) NOT NULL,
  `url` varchar(512) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of image
-- ----------------------------

-- ----------------------------
-- Table structure for `product`
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `shop_id` varchar(32) NOT NULL,
  `category_id` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES ('4028d8473e8e5c2a013e8e5cda010003', 'sd', 'asdf', 'asdf', 'asdf');

-- ----------------------------
-- Table structure for `shop`
-- ----------------------------
DROP TABLE IF EXISTS `shop`;
CREATE TABLE `shop` (
  `id` varchar(32) NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `name` varchar(64) NOT NULL,
  `contact` varchar(32) NOT NULL,
  `address` varchar(128) NOT NULL,
  `district` varchar(32) NOT NULL,
  `gate_url` varchar(256) NOT NULL,
  `descript` varchar(1024) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shop
-- ----------------------------
INSERT INTO `shop` VALUES ('4028d8473e891d43013e8926426d000e', '4028d8473e3be3c0013e3beac2760001', 'sdf', 'sdf', 'sdf', '445121', 'sdf', 'sdf');
INSERT INTO `shop` VALUES ('4028d8473e8e3b6f013e8e3c10e10001', 'sdf', 'sdf', 'sdf', 'sdf', '445121', 'sdf', 'sdf');
INSERT INTO `shop` VALUES ('4028d8473e8e3b6f013e8e4c55db0002', 'sdf', 'sdf', 'sdf', 'sdf', '445121', 'sdf', 'sdf');
INSERT INTO `shop` VALUES ('4028d8473e8e4f41013e8e5049b20001', 'sdf', 'er', 'sdf', 'sdf', '445121', 'sdf', 'sdf');
INSERT INTO `shop` VALUES ('4028d8473e8e5c2a013e8e5cc0010001', 'fasdf', 'asdf', 'asdf', 'asdfasd', '445121', 'asdfasd', 'fasdf');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(32) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('4028d8473e31ba22013e31c643790000', 'fsdaf', 'adsfasdf');
INSERT INTO `user` VALUES ('4028d8473e369787013e369a5e440000', 'test', 'test');
INSERT INTO `user` VALUES ('4028d8473e371deb013e371e739f0000', 'ggggggggggggg', 'ggggg');
INSERT INTO `user` VALUES ('4028d8473e371deb013e371ebcae0001', 'ppppppppppppppp', 'pppppppppppppppp');
INSERT INTO `user` VALUES ('4028d8473e3bd2b2013e3bd4a3bd0000', '66', '66');
INSERT INTO `user` VALUES ('4028d8473e3be3c0013e3be80cac0000', 'Kevin', 'asdffffffff');
INSERT INTO `user` VALUES ('4028d8473e3be3c0013e3beac2760001', 'fff', '333');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c192f490000', 'f', 'f');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c195d3f0001', 'e', 'e');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c1d56850002', 'e', 'e');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c1d68960003', 'f', 'f');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c208fc60004', 'd', 'd');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c20f8c10005', '4', '4');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c214c500006', '3', '3');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c21a4e00007', 'f', 'd');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c2246400008', 'f', 'd');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c2254790009', 's', 'a');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c2575dd000a', 'f', 'd');
INSERT INTO `user` VALUES ('4028d8473e3c18cb013e3c25ea33000b', 'c', 'c');
INSERT INTO `user` VALUES ('4028d8473e3c36aa013e3c37557d0000', '1', '1');
INSERT INTO `user` VALUES ('4028d8473e3c396d013e3c39d2730000', 'f', 'd');
INSERT INTO `user` VALUES ('4028d8473e3c396d013e3c3db7950001', 'f', 'd');
INSERT INTO `user` VALUES ('4028d8473e3c396d013e3c3dcdfb0002', 'f', 'f');
INSERT INTO `user` VALUES ('4028d8473e3c396d013e3c3e2e0d0003', 'f', 'f');
INSERT INTO `user` VALUES ('4028d8473e3c396d013e3c3e49650004', 'fdfdf', 'fd');
INSERT INTO `user` VALUES ('4028d8473e3c396d013e3c3f4c2f0005', '888888888888888', '888888888888888888888');
INSERT INTO `user` VALUES ('4028d8473e88a581013e88a93a4f0000', 'kevin03', 'test');
INSERT INTO `user` VALUES ('4028d8473e89196f013e891a98d50000', 'fdsf', 'sdf');
INSERT INTO `user` VALUES ('4028d8473e891d43013e891dcc1b0000', 'ff', 'ff');
INSERT INTO `user` VALUES ('4028d8473e891d43013e891eb9c70001', 'sadf', 'asdf');
INSERT INTO `user` VALUES ('4028d8473e891d43013e8921001d0002', 'sdf', 'sdf');
INSERT INTO `user` VALUES ('4028d8473e891d43013e892198370003', 'sdf', 'sdf');
INSERT INTO `user` VALUES ('4028d8473e891d43013e8922f6cd0005', 'fdsd', 'sdf');
INSERT INTO `user` VALUES ('4028d8473e891d43013e89232a8f0007', 'sdf', 'sdf');
INSERT INTO `user` VALUES ('4028d8473e891d43013e892395100009', 'df', 'sfg');
INSERT INTO `user` VALUES ('4028d8473e891d43013e8924ebb7000b', 'asdf', 'df');
INSERT INTO `user` VALUES ('4028d8473e891d43013e892601ca000d', 'f', 'f');
INSERT INTO `user` VALUES ('4028d8473e8e3b6f013e8e3bf76d0000', 'dfadf', 'adsf');
INSERT INTO `user` VALUES ('4028d8473e8e4f41013e8e5031680000', 'asdf', 'asdf');
INSERT INTO `user` VALUES ('4028d8473e8e5c2a013e8e5caebb0000', 'asdf', 'asdf');
