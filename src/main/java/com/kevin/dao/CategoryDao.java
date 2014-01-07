package com.kevin.dao;

import java.util.List;

import javax.ejb.Stateless;

import com.kevin.entity.Category;

@Stateless
public class CategoryDao extends CommonDao<Category>{
	public List<Category> getByShop(String shop_id){
		List<Category> categoryList = super.queryList("shop_id", shop_id);
		return categoryList;
	}
}
