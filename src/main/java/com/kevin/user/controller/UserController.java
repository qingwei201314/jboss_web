package com.kevin.user.controller;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.jboss.arquillian.core.api.annotation.Inject;

import com.kevin.dao.UserDao;
import com.kevin.entity.User;

@Named
@RequestScoped
public class UserController {
	@Inject
	private UserDao userDao;
	private User user = new User();

	public String saveUser(){
		userDao.createUser(user);
		return "";
	}
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
}
