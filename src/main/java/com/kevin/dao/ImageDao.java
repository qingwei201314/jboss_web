package com.kevin.dao;

import java.util.List;

import javax.ejb.Stateless;

import com.kevin.entity.Image;

@Stateless
public class ImageDao  extends CommonDao<Image>{
	/**
	 * 根据产品Id找出产品图片
	 */
	public List<Image> getImageListByProductId(String productId){
		List<Image> imageList = queryList("product_id", productId);
		return imageList;
	}
}
