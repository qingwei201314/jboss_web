package com.kevin.Image.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.kevin.Image.service.ImageService;

@Named
@RequestScoped
public class ImageController {
	@Inject
	private ImageService imageService;
	private String product_id;
	private String url;
	
	public String addImage(String productId){
		return "/admin/image/addImage";
	}
	
	public String getSaveImage() throws IOException{
		HttpServletRequest request = (HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest();
		HttpServletResponse response = (HttpServletResponse)FacesContext.getCurrentInstance().getExternalContext().getResponse();
		product_id = request.getParameter("product_id");
		url = request.getParameter("url");
		String result = imageService.saveImage(product_id, url);
		PrintWriter pw = response.getWriter();
		pw.append("result." + result + ".result");
		return null;
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
