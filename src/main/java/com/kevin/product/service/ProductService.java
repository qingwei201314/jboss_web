package com.kevin.product.service;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.faces.model.SelectItem;
import javax.inject.Inject;

import com.kevin.dao.CategoryDao;
import com.kevin.dao.ImageDao;
import com.kevin.dao.ProductDao;
import com.kevin.dao.ShopDao;
import com.kevin.entity.Category;
import com.kevin.entity.Image;
import com.kevin.entity.Product;
import com.kevin.entity.Shop;

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
	
	public void save(Product product, String phone, String[] image_url){
		Shop shop =shopDao.getByPhone(phone);
		product.setShop_id(shop.getId());
		productDao.save(product);
		//保存此产品关联的图片
		if(image_url!=null && image_url.length > 0){
			for(String url: image_url){
				Image image =new Image(product.getId(), url);
				imageDao.save(image);
			}
		}
	}
}
