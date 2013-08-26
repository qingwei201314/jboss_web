package com.kevin.product.controller;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.kevin.entity.Product;
import com.kevin.product.service.ProductService;
import com.kevin.util.Constant;

@Named
@RequestScoped
public class ProductController {
	@Inject
	private ProductService productService;
	private Product product =new Product();
	@SuppressWarnings("unused")
	private List<SelectItem> categoryList;
	
	public String saveProduct(){
		HttpServletRequest request = (HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest();
		HttpSession session = request.getSession();
		String phone = (String)session.getAttribute(Constant.phone);
		String[]  image_url = request.getParameterValues("image_url");
		productService.save(product, phone, image_url);
		return "product/addProduct";
	}
	
	public Product getProduct() {
		return product;
	}
	public void setProduct(Product product) {
		this.product = product;
	}

	public List<SelectItem> getCategoryList() {
		HttpSession session = ((HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest()).getSession();
		String phone = (String)session.getAttribute(Constant.phone);
		List<SelectItem> categoryList = productService.getCategoryList(phone);
		return categoryList;
	}
}
