package com.kevin.category.controller;

import java.util.ArrayList;
import java.util.List;

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
	private Category category = new Category();
	private List<Category> categoryList = new ArrayList<Category>();

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

	/**
	 * addCategory.xhtml中取得分类列表
	 */
	public List<Category> getCategoryList() {
		HttpSession session = ((HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest()).getSession();
		String phone = (String)session.getAttribute(Constant.phone);
		categoryList = categoryService.list(phone);
		return categoryList;
	}

	public void setCategoryList(List<Category> categoryList) {
		this.categoryList = categoryList;
	}
}
