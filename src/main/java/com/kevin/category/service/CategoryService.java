package com.kevin.category.service;

import javax.ejb.Stateless;
import javax.inject.Inject;

import com.kevin.dao.CategoryDao;
import com.kevin.dao.ShopDao;
import com.kevin.entity.Category;
import com.kevin.entity.Shop;

@Stateless
public class CategoryService {
	@Inject
	private CategoryDao categoryDao;
	@Inject
	private ShopDao shopDao;

	public void save(Category category, String phone) {
		Shop shop =shopDao.getByPhone(phone);
		category.setShop_id(shop.getId());
		categoryDao.save(category);
	}
}
