package com.kevin.product.service;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.faces.model.SelectItem;
import javax.inject.Inject;

import org.apache.commons.beanutils.BeanUtils;

import com.kevin.dao.CategoryDao;
import com.kevin.dao.ProductDao;
import com.kevin.dao.ShopDao;
import com.kevin.entity.Category;
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
	
	public void save(Product product, String phone){
		Shop shop =shopDao.getByPhone(phone);
		product.setShop_id(shop.getId());
		productDao.save(product);
	}
	
	public ProductVo get(String productId) throws IllegalAccessException, InvocationTargetException{
		Product product = productDao.get(productId);
		ProductVo productVo = new ProductVo();
		BeanUtils.copyProperties(productVo, product);
		productVo.setCategoryName(product.getCategory().getName());
		return productVo;
	}
}
