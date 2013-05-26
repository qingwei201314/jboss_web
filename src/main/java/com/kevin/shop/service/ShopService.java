package com.kevin.shop.service;

import javax.ejb.Stateless;
import javax.inject.Inject;

import com.kevin.dao.ShopDao;
import com.kevin.dao.UserDao;
import com.kevin.entity.Shop;
import com.kevin.entity.User;

@Stateless
public class ShopService {
	@Inject
	private UserDao userDao;
	@Inject
	private ShopDao shopDao;
	public Shop dealShop(Shop shop, String phoneSession){
		User user = userDao.query("phone", phoneSession);
		shop.setUser_id(user.getId());
		shopDao.save(shop);
		return shop;
	}
}
