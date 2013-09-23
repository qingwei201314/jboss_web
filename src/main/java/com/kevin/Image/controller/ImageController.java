package com.kevin.Image.controller;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.kevin.dao.ImageDao;

@Named
@RequestScoped
public class ImageController {
	@Inject
	private ImageDao imageDao;
	private String product_id;
	private String url;
	
	public String saveImage(){
		return "/admin/product/addProduct";
	}

	public String getProduct_id() {
		return product_id;
	}

	public void setProduct_id(String product_id) {
		this.product_id = product_id;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
