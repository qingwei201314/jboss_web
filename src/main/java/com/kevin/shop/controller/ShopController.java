package com.kevin.shop.controller;

import java.util.List;
import javax.enterprise.context.SessionScoped;
import javax.faces.bean.ManagedBean;
import javax.faces.model.SelectItem;
import javax.inject.Inject;
import com.kevin.entity.Shop;
import com.kevin.shop.service.ShopService;

@ManagedBean
@javax.faces.bean.SessionScoped
public class ShopController {
	@Inject
	private ShopService shopService;
	
	@SessionScoped
	private String phoneSession;
	private Shop shop = new Shop();
	private Integer province;
	private Integer town;
	private Integer city;
	private List<SelectItem> townList;//市集合
	private List<SelectItem> cityList; //县集合
	private static final Integer noChoice = -1; //页面请选择项的值
	
	public String saveShop(){
//		shop = shopService.dealShop(shop,phoneSession);
		return "/category/addCategory";
	}
	
	/**
	 * 取出页面用到的下拉框中的值
	 */
	public List<SelectItem> getProvinces(){
		return shopService.getCity();
	}
	
	public List<SelectItem> getTowns(){
		townList = shopService.getTown(province);
		return townList;
	}
	
	public Shop getShop() {
		return shop;
	}

	public void setShop(Shop shop) {
		this.shop = shop;
	}

	public String getPhoneSession() {
		return phoneSession;
	}

	public void setPhoneSession(String phoneSession) {
		this.phoneSession = phoneSession;
	}

	public Integer getProvince() {
		return province;
	}

	/**
	 * 根据省查出市
	 */
	public void setProvince(Integer province) {
		this.province = province;
		this.town =  noChoice;
		this.city = noChoice;
		this.townList = null;
	    this.cityList = null;
		townList = shopService.getTown(province);
	}

	public void setCity(Integer city) {
		this.city = city;
	}

	public Integer getCity() {
		return city;
	}

	public List<SelectItem> getCities(){
		return cityList;
	}
	
	public void setTown(Integer town) {
		this.town = town;
		cityList = shopService.getTown(town);
	}
	
	public Integer getTown() {
		return town;
	}
}
