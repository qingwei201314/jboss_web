package com.kevin.shop.controller;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.kevin.entity.Shop;
import com.kevin.shop.service.ShopService;

@Named
@RequestScoped
public class ShopController {
	@Inject
	private ShopService shopService;
	@SessionScoped
	private String phoneSession;
	private Shop shop = new Shop();
	
	public String saveShop(){
		shop = shopService.dealShop(shop,phoneSession);
		return "/category/addCategory";
	}

	public Shop getShop() {
		return shop;
	}

	public void setShop(Shop shop) {
		this.shop = shop;
	}

	public String getPhoneSession() {
		return phoneSession;
	}

	public void setPhoneSession(String phoneSession) {
		this.phoneSession = phoneSession;
	}
}
