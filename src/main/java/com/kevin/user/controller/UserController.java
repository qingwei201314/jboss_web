package com.kevin.user.controller;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.context.SessionScoped;
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
    @SessionScoped
    private String phoneSession;
    
	public String saveUser(){
		userDao.save(user);
		phoneSession = user.getPhone();
		return "/shop/addShop";
	}
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}

	public String getPhoneSession() {
		return phoneSession;
	}

	public void setPhoneSession(String phoneSession) {
		this.phoneSession = phoneSession;
	}
}
