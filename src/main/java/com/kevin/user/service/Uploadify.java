package com.kevin.user.service;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;

import com.kevin.util.Constant;
import com.kevin.util.Util;

/**
 * 用于处理上传文件
 * @author Kevin
 */
public class Uploadify {
	public String uplodate(HttpServletRequest request) throws Exception{
		String path = "";
	 	String phone = (String)request.getSession().getAttribute(Constant.phone);
	 	int length = phone.length();
	 	int count = length%4 > 0 ? length/4 +1 : length/4;
	 	for(int i=0; i< count; i++)
	 		path += "/" + phone.substring(i*4, (i*4 + 4)>length?length:i*4 + 4);
	 	File filepath = new File(Util.upload() + path);
	 	if(!filepath.exists()){
	 		filepath.mkdirs();
	 	}
		DiskFileItemFactory factory = new DiskFileItemFactory();
		ServletContext servletContext = request.getServletContext();
		File repository = (File) servletContext.getAttribute(Util.upload());
		factory.setRepository(repository);
		ServletFileUpload upload = new ServletFileUpload(factory);
		List<FileItem> items = upload.parseRequest(request);
		if(items != null && items.size() >0){
			for(int i=0; i< items.size(); i++){
				FileItem fileItem = items.get(i);
				if(!fileItem.isFormField()){
					File file = new File(Util.upload() + path+"/" + fileItem.getName());
					fileItem.write(file);
					Image srcImg = ImageIO.read(file); 
					BufferedImage buffImg = null;
					buffImg = new BufferedImage(580, 290, BufferedImage.TYPE_INT_RGB);   
					buffImg.getGraphics().drawImage(srcImg.getScaledInstance(580, 290, Image.SCALE_SMOOTH), 0, 0, null);
					String postfix = StringUtils.substringAfterLast(fileItem.getName(),".");
					path +=  "/gate."+postfix;
					ImageIO.write(buffImg, postfix, new File(Util.upload() + path));
				}
			}
		}
		return path;
	}
}
