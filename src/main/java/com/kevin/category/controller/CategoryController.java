package com.kevin.category.controller;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.kevin.category.service.CategoryService;
import com.kevin.entity.Category;
import com.kevin.util.Constant;
@Named
@RequestScoped
public class CategoryController {
	@Inject
	private CategoryService categoryService;
	private Category category = new Category();;

	public String saveCategory(){
		HttpSession session = ((HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest()).getSession();
		String phone = (String)session.getAttribute(Constant.phone);
		categoryService.save(category, phone);
		return "/product/addProduct";
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}
	
}
