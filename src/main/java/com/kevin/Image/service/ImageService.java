package com.kevin.Image.service;

import javax.ejb.Stateless;
import javax.inject.Inject;
import org.apache.commons.lang3.StringUtils;
import com.kevin.dao.ImageDao;
import com.kevin.entity.Image;
import com.kevin.util.Constant;

@Stateless
public class ImageService {
	@Inject
	private ImageDao imageDao;
	
	public String saveImage(String product_id, String url){
		url = StringUtils.substringBefore(url, ",");
		String path = StringUtils.substringBeforeLast(url, "_");
		String postfix= "." + StringUtils.substringAfter(url, ".");
		Image image = new Image(product_id,path);
		image.setPostfix(postfix);
		imageDao.save(image);
		String resut = path + Constant.S + postfix;
		return resut;
	}
}
