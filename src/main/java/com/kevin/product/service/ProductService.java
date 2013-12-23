package com.kevin.product.service;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.faces.model.SelectItem;
import javax.inject.Inject;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;

import com.kevin.dao.CategoryDao;
import com.kevin.dao.ImageDao;
import com.kevin.dao.ProductDao;
import com.kevin.dao.ShopDao;
import com.kevin.entity.Category;
import com.kevin.entity.Image;
import com.kevin.entity.Product;
import com.kevin.entity.Shop;
import com.kevin.product.vo.ProductVo;

@Stateless
public class ProductService {
	@Inject
	private ShopDao shopDao;
	@Inject
	private CategoryDao categoryDao;
	@Inject
	private ProductDao productDao;
	@Inject
	private ImageDao imageDao;
	
	/**
	 * 增加产品页面的类别下拉列表
	 */
	public List<SelectItem> getCategoryList(String phone){
		Shop shop =shopDao.getByPhone(phone);
		List<SelectItem> selectItemList = new ArrayList<SelectItem>();
		List<Category> categoryList = categoryDao.getByShop(shop.getId());
		if(categoryList!=null && categoryList.size() >0){
			for(Category category:categoryList){
				SelectItem item =new SelectItem(category.getId(),category.getName());
				selectItemList.add(item);
			}
		}
		return selectItemList;
	}
	
	public void save(Product product, String phone, String description){
		Shop shop =shopDao.getByPhone(phone);
		product.setShop_id(shop.getId());
		product.setDescription(description);
		if(StringUtils.isBlank(product.getId())){
			product.setId(null);
			productDao.save(product);
		}
		else{
			productDao.update(product);
		}
	}
	
	public ProductVo get(String productId) throws IllegalAccessException, InvocationTargetException{
		Product product = productDao.get(productId);
		ProductVo productVo = new ProductVo();
		BeanUtils.copyProperties(productVo, product);
		productVo.setCategory_id(product.getCategory().getId());
		productVo.setCategoryName(product.getCategory().getName());
		List<Image> imageList= imageDao.getImageListByProductId(product.getId());
		productVo.setImageList(imageList);
		return productVo;
	}
	
	public List<Product> getFirstCategoryProduct(String phone){
		List<Product> productList = new ArrayList<Product>();
		List<SelectItem> categoryList  = getCategoryList(phone);
		if(categoryList!=null && categoryList.size() >0){
			SelectItem fist = categoryList.get(0);
			productList = productDao.queryList("category_id", fist.getValue());
		}
		return productList;
	}
	
}
