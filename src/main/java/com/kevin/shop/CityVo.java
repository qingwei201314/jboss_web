package com.kevin.shop;

/*
 *用于取得商店的省市区 
 */
public class CityVo {
	private Integer province;
	private Integer town;
	private Integer city;
	
	public Integer getProvince() {
		return province;
	}
	public void setProvince(Integer province) {
		this.province = province;
	}
	public Integer getTown() {
		return town;
	}
	public void setTown(Integer town) {
		this.town = town;
	}
	public Integer getCity() {
		return city;
	}
	public void setCity(Integer city) {
		this.city = city;
	}
}
