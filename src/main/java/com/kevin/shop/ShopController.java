package com.kevin.shop;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.persistence.EntityManager;

import com.kevin.entity.Shop;

@Named
@RequestScoped
public class ShopController {
	@Inject
    private EntityManager entityManager;
	
	private Shop shop = new Shop();
	
	public String saveShop(){
		
		return null;
	}

	public Shop getShop() {
		return shop;
	}

	public void setShop(Shop shop) {
		this.shop = shop;
	}
}
