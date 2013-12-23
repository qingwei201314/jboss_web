package com.kevin.user.controller;

import javax.enterprise.context.RequestScoped;
import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.kevin.dao.UserDao;
import com.kevin.entity.User;
import com.kevin.user.service.UserService;
import com.kevin.util.Constant;

@Named
@RequestScoped
public class UserController {
	@Inject
    private UserDao userDao;
	@Inject
	private UserService userService;
    @RequestScoped
	private User user = new User();
	
    /**
     * 用户登录
     */
	public String login(){
		String resultPath = "/user/login";
		boolean pass = userService.login(user);
		if(pass){
			resultPath = "/admin/shop/addShop";
			HttpSession session = ((HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest()).getSession();
			session.setAttribute(Constant.phone, user.getPhone());
		}
		else{
			FacesContext context = FacesContext.getCurrentInstance(); 
			context.addMessage(null, new FacesMessage("电话或密码错误!"));
		}
		return resultPath;
	}
	
	/**
	 * 用户注册
	 */
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
