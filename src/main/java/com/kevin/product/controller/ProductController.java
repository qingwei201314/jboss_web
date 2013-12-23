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

import org.apache.commons.lang3.StringUtils;

import com.kevin.dao.ProductDao;
import com.kevin.entity.Product;
import com.kevin.product.service.ProductService;
import com.kevin.product.vo.ProductVo;
import com.kevin.util.Constant;

@Named
@RequestScoped
public class ProductController {
	@Inject
	private ProductService productService;
	@Inject
	private ProductDao productDao;

	private Product product = new Product();
	private ProductVo productVo = new ProductVo();
	@SuppressWarnings("unused")
	private List<SelectItem> categoryList;
	private List<Product> productList ;
	private String category;

	public String addProduct(String categoryId) {
		if (categoryId == null && productVo.getCategory_id() != null) {
			categoryId = productVo.getCategory_id();
		}
		product.setCategory_id(categoryId);
		return "/admin/product/addProduct";
	}

	public String saveProduct() throws IllegalAccessException,
			InvocationTargetException {
		HttpServletRequest request = (HttpServletRequest) FacesContext
				.getCurrentInstance().getExternalContext().getRequest();
		String description = request.getParameter("description");
		HttpSession session = request.getSession();
		String phone = (String) session.getAttribute(Constant.phone);
		productService.save(product, phone, description);
		productVo = productService.get(product.getId());
		return "/admin/product/addProductImage";
	}

	public String editProduct() {
		product = productDao.get(productVo.getId());
		return "/admin/product/addProduct";
	}

	public String editProductById(String productId) {
		product = productDao.get(productId);
		return "/admin/product/addProduct";
	}

	public String deleteProduct(String productId, String curCategory) {
		productDao.deleteById(productId);
		category = curCategory;
		HttpSession session = ((HttpServletRequest) FacesContext
				.getCurrentInstance().getExternalContext().getRequest())
				.getSession();
		String phone = (String) session.getAttribute(Constant.phone);
		productList = productService.getFirstCategoryProduct(phone);
		return "/admin/image/addImage";
	}

	public Product getProduct() {
		HttpServletRequest request = (HttpServletRequest) FacesContext
				.getCurrentInstance().getExternalContext().getRequest();
		//如果有产品id,则把各项填上
		String productId = request.getParameter("productId");
		if(StringUtils.isNotBlank(productId))
			product = productDao.get(productId);
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public List<SelectItem> getCategoryList() {
		HttpSession session = ((HttpServletRequest) FacesContext
				.getCurrentInstance().getExternalContext().getRequest())
				.getSession();
		String phone = (String) session.getAttribute(Constant.phone);
		List<SelectItem> categoryList = productService.getCategoryList(phone);
		
		return categoryList;
	}

	public ProductVo getProductVo() throws IllegalAccessException, InvocationTargetException {
		HttpServletRequest request = (HttpServletRequest) FacesContext
				.getCurrentInstance().getExternalContext().getRequest();
		String productId = request.getParameter("productId");
		if(productVo.getId() == null && StringUtils.isNotBlank(productId))
			productVo = productService.get(productId);
		return productVo;
	}

	public void setProductVo(ProductVo productVo) {
		this.productVo = productVo;
	}

	public List<Product> getProductList() {
		HttpSession session = ((HttpServletRequest) FacesContext
				.getCurrentInstance().getExternalContext().getRequest())
				.getSession();
		String phone = (String) session.getAttribute(Constant.phone);
		if(category!=null)
		productList = productDao.queryList("category_id", category);
		
		if (productList == null) 
			productList = productService.getFirstCategoryProduct(phone);
		
		return productList;
	}

	public void setProductList(List<Product> productList) {
		this.productList = productList;
	}

	public String getCategory() {
		HttpServletRequest request = (HttpServletRequest) FacesContext
				.getCurrentInstance().getExternalContext().getRequest();
		String category = request.getParameter("category");
		if (category != null)
			this.category = category;
		//删除产品
		String deleteProductId = request.getParameter("deleteProductId");
		if(StringUtils.isNotBlank(deleteProductId)){
			this.category = productDao.get(deleteProductId).getCategory_id();
			productDao.deleteById(deleteProductId);
			
		}
		return this.category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
}
