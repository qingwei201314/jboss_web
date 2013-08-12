package com.kevin.util;

import java.io.File;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.io.SAXReader;

@Named
@ApplicationScoped
public class Util {
	private static Document document;
	// 工程url中的目录
	private static String path;
	// 上传路径
	private static String upload;
	//存放图片的工程路径
	private static String repository;

	public Util() throws DocumentException {
		if (document == null) {
			SAXReader saxReader = new SAXReader();
			String path = StringUtils.substringBefore(Util.class
					.getResource("").getPath(), "com/kevin");
			document = saxReader.read(new File(path + "config.xml"));
		}
		path = document.selectSingleNode("//root//path").getStringValue();
		upload = document.selectSingleNode("//root//upload").getStringValue();
		repository = document.selectSingleNode("//root//repository").getStringValue();
	}


	public String getPath() {
		return path;
	}

	public static String path() {
		return path;
	}

	public String getUpload() {
		return upload;
	}

	public static String upload() {
		return upload;
	}

	public String getRepository() {
		return repository;
	}
	
	public static String repository() {
		return repository;
	}
}
