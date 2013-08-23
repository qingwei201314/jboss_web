package com.kevin.user.controller;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.kevin.dao.UserDao;
import com.kevin.entity.User;
import com.kevin.util.Constant;

@Named
@RequestScoped
public class UserController {
	@Inject
    private UserDao userDao;
    @RequestScoped
	private User user = new User();
	
	public String saveUser(){
		userDao.save(user);
		HttpSession session = ((HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest()).getSession();
		session.setAttribute(Constant.phone, user.getPhone());
		return "/shop/addShop";
	}
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}

}
