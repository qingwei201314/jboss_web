package com.kevin.product.controller;

import java.lang.reflect.InvocationTargetException;
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
import com.kevin.product.vo.ProductVo;
import com.kevin.util.Constant;

@Named
@RequestScoped
public class ProductController {
	@Inject
	private ProductService productService;
	private Product product =new Product();
	private ProductVo productVo = new ProductVo();
	@SuppressWarnings("unused")
	private List<SelectItem> categoryList;
	
	public String addProduct(String categoryId){
		if(categoryId ==null && productVo.getCategory_id() !=null){
			categoryId = productVo.getCategory_id();
		}
		product.setCategory_id(categoryId);
		return "/admin/product/addProduct";
	}
	
	public String saveProduct() throws IllegalAccessException, InvocationTargetException{
		HttpServletRequest request = (HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest();
		HttpSession session = request.getSession();
		String phone = (String)session.getAttribute(Constant.phone);
		productService.save(product, phone);
		productVo = productService.get(product.getId());
		return "/admin/product/addProductImage";
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

	public ProductVo getProductVo() {
		return productVo;
	}

	public void setProductVo(ProductVo productVo) {
		this.productVo = productVo;
	}
	
}
