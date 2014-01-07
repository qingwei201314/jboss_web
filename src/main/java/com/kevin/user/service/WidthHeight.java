package com.kevin.user.service;

/**
 * 用于存放图片的宽、高
 * @author Kevin
 */
public class WidthHeight {
	//宽
	private int width;
	//高
	private int height;
	
	public WidthHeight(int width, int height){
		this.width = width;
		this.height = height;
	}
	
	public int getWidth() {
		return width;
	}
	public void setWidth(int width) {
		this.width = width;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}
}
