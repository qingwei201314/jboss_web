package com.kevin.shop.controller;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.kevin.dao.ShopDao;
import com.kevin.entity.Shop;

@Named
@RequestScoped
public class ShopController {
	@Inject
    private ShopDao shopDao;
	private Shop shop = new Shop();
	
	public String saveShop(){
		shopDao.save(shop);
		return null;
	}

	public Shop getShop() {
		return shop;
	}

	public void setShop(Shop shop) {
		this.shop = shop;
	}
}
