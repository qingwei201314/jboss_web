package com.kevin.product.controller;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.kevin.dao.ProductDao;
import com.kevin.entity.Product;

@Named
@RequestScoped
public class ProductController {
	@Inject
	private ProductDao productDao;
	private Product product =new Product();
	
	public String saveProduct(){
		productDao.save(product);
		return "product/addProduct";
	}
	
	public Product getProduct() {
		return product;
	}
	public void setProduct(Product product) {
		this.product = product;
	}
}
