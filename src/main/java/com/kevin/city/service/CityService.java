package com.kevin.city.service;

import javax.ejb.Stateless;
import javax.inject.Inject;
import com.kevin.dao.CityDao;
import com.kevin.entity.City;
import com.kevin.shop.CityVo;

@Stateless
public class CityService {
	@Inject
	private CityDao cityDao;
	
	public CityVo getByShopDistrict(Integer district){
		City city  = cityDao.get(district);
		CityVo cityVo = new CityVo();
		cityVo.setCity(city.getId()); //区
		City town = city.getParent();
		cityVo.setTown(town.getId()); //市
		cityVo.setProvince(town.getParentId()); //省
		return cityVo;
	}
}
