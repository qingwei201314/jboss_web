/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2013/1/19 23:41:42                           */
/*==============================================================*/


drop table if exists category;

drop table if exists image;

drop table if exists product;

drop table if exists shop;

/*==============================================================*/
/* Table: category                                              */
/*==============================================================*/
create table category
(
   id                   varchar(32) not null,
   name                 varchar(18) not null,
   primary key (id)
);

/*==============================================================*/
/* Table: image                                                 */
/*==============================================================*/
create table image
(
   id                   varchar(32) not null,
   product_id           varchar(32) not null,
   url                  varchar(512) not null,
   primary key (id)
);

/*==============================================================*/
/* Table: product                                               */
/*==============================================================*/
create table product
(
   id                   varchar(32) not null,
   name                 varchar(32) not null,
   description          varchar(1024),
   shop_id              varchar(32) not null,
   category_id          varchar(32) not null,
   primary key (id)
);

/*==============================================================*/
/* Table: shop                                                  */
/*==============================================================*/
create table shop
(
   id                   varchar(32) not null,
   phone                varchar(15) not null,
   name                 varchar(64) not null,
   contact              varchar(32) not null,
   address              varchar(128) not null,
   district             varchar(32) not null,
   gate_url             varchar(256) not null,
   descript             varchar(1024) not null,
   primary key (id)
);

