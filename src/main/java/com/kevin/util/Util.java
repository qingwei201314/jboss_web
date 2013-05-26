package com.kevin.util;

import java.io.File;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.io.SAXReader;

@Named
@RequestScoped
public class Util {
	private static Document document;
	private String path;
	public Util() throws DocumentException{
		if(document ==null){
			SAXReader saxReader =new SAXReader();
			String path= StringUtils.substringBefore(Util.class.getResource("").getPath(), "com/kevin");
			document = saxReader.read(new File(path + "config.xml")); 
		}
	}
	
	public String getPath() {
		path = document.selectSingleNode("//path").getStringValue();
		return path;
	}

}
