package com.kevin.dao;

import javax.ejb.Stateless;
import javax.inject.Inject;

import com.kevin.entity.Shop;
import com.kevin.entity.User;

@Stateless
public class ShopDao extends CommonDao<Shop>{
	@Inject
	private UserDao userDao;
	
	public Shop getByPhone(String phone){
		User user = userDao.query("phone", phone);
		return user.getShop();
	}
}
