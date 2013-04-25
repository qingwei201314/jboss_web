package com.kevin.user.controller;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.kevin.dao.UserDao;
import com.kevin.entity.User;

@Named
@RequestScoped
public class UserController {
	@Inject
    private UserDao userDao;
    
    @RequestScoped
	private User user = new User();

	public String saveUser(){
		userDao.createUser(user);
		return "/shop/addShop";
	}
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
}
