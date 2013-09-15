package com.kevin.user.service;

import javax.ejb.Stateless;
import javax.inject.Inject;

import com.kevin.dao.UserDao;
import com.kevin.entity.User;

@Stateless
public class UserService {
	@Inject
	private UserDao userDao;
	
	/**
	 * 检查用户是否密码正确
	 */
	public boolean login(User user){
		boolean pass= false;
		User user_db = userDao.query("phone", user.getPhone());
		if(user_db!=null && user_db.getPassword().equals(user.getPassword()))
			pass = true;
		return pass;
	}
}
