package com.kevin.category.controller;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import com.kevin.dao.CategoryDao;
import com.kevin.entity.Category;
@Named
@RequestScoped
public class CategoryController {
	@Inject
	private CategoryDao categoryDao;
	private Category category = new Category();;

	public String saveCategory(){
		categoryDao.save(category);
		return "/product/addProduct";
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}
	
}
