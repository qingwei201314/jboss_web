package com.kevin.shop.controller;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.kevin.city.service.CityService;
import com.kevin.dao.ShopDao;
import com.kevin.entity.Shop;
import com.kevin.shop.CityVo;
import com.kevin.shop.service.ShopService;
import com.kevin.util.Constant;

@ManagedBean
@javax.faces.bean.SessionScoped
public class ShopController {
	@Inject
	private ShopService shopService;
	@Inject
	private ShopDao shopDao;
	@Inject
	private CityService cityService;
	private Shop shop = new Shop();
	private Integer province;
	private Integer town;
	private Integer city;
	private List<SelectItem> townList;//市集合
	private List<SelectItem> cityList; //县集合
	private static final Integer noChoice = -1; //页面请选择项的值
	
	public String saveShop() throws IllegalAccessException, InvocationTargetException{
		HttpSession session = ((HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest()).getSession();
		String phone = (String)session.getAttribute(Constant.phone);
		shop = shopService.dealShop(shop, phone, city);
		return "/admin/category/addCategory";
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
		HttpSession session = ((HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest()).getSession();
		String phone = (String)session.getAttribute(Constant.phone);
		shop = shopDao.getByPhone(phone);
		CityVo cityVo = cityService.getByShopDistrict(shop.getDistrict());
		this.province = cityVo.getProvince();
		this.town = cityVo.getTown();
		this.city = cityVo.getCity();
		cityList = shopService.getTown(town);
		return shop;
	}

	public void setShop(Shop shop) {
		this.shop = shop;
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
