package com.kevin.dao;

import javax.ejb.Stateless;
import javax.inject.Inject;

import com.kevin.entity.Shop;
import com.kevin.entity.User;
import com.kevin.util.Util;

@Stateless
public class ShopDao extends CommonDao<Shop>{
	@Inject
	private UserDao userDao;
	
	public Shop getByPhone(String phone){
		User user = userDao.query("phone", phone);
		Shop shop =user.getShop();
		return user.getShop();
	}
}
