package com.kevin.shop.service;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.faces.model.SelectItem;
import javax.inject.Inject;

import org.apache.commons.beanutils.BeanUtils;

import com.kevin.dao.CityDao;
import com.kevin.dao.ShopDao;
import com.kevin.dao.UserDao;
import com.kevin.entity.City;
import com.kevin.entity.Shop;
import com.kevin.entity.User;

@Stateless
public class ShopService {
	@Inject
	private UserDao userDao;
	@Inject
	private ShopDao shopDao;
	@Inject
	private CityDao cityDao;
	
	/**
	 * 保存对象
	 * @throws InvocationTargetException 
	 * @throws IllegalAccessException 
	 */
	public Shop dealShop(Shop shop, String phone) throws IllegalAccessException, InvocationTargetException{
		User user = userDao.query("phone", phone);
		Shop shop_db = user.getShop();
		if(shop_db==null){
			shop_db = shop;
		}
		else{
			shop.setId(shop_db.getId());
			BeanUtils.copyProperties(shop_db, shop);
		}
		shop_db.setId(shop_db.getId());
		shop_db.setUser_id(user.getId());
		shopDao.save(shop_db);
		return shop;
	}
	
	/**
	 * 取出页面用到的下拉框中的值
	 */
	public List<SelectItem> getCity(){
		List<SelectItem> itemList= new ArrayList<SelectItem>();
		//加上默认值
		SelectItem defaultItem = new SelectItem();
		defaultItem.setLabel("请选择");
		defaultItem.setValue(-1);
		itemList.add(defaultItem);
		
		List<City> cityList = cityDao.queryFirst();
		for(City city: cityList){
			SelectItem item = new SelectItem();
			item.setLabel(city.getName());
			item.setValue(city.getId());
			itemList.add(item);
		}
		return itemList;
	}
	
	/**
	 * 取得指id下的子城市
	 */
	public List<SelectItem> getTown(Integer parentId){
		List<SelectItem> itemList= new ArrayList<SelectItem>();
		
		List<City> townList = cityDao.queryList("parentId", parentId);
		if(townList != null & townList.size() > 0){
			//加上默认值
			SelectItem defaultItem = new SelectItem();
			defaultItem.setLabel("请选择");
			defaultItem.setValue(-1);
			itemList.add(defaultItem);
			
			for(City town: townList){
				SelectItem item = new SelectItem();
				item.setLabel(town.getName());
				item.setValue(town.getId());
				itemList.add(item);
			}
		}

		return itemList;
	}
}
