package com.kevin.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity(name="city")
public class City {
	@Id
	private Integer id;
	private String name;
	private String ename;
	private Integer parentId;
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="parentId", insertable=false, updatable=false)
	private City parent;
	private String code;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEname() {
		return ename;
	}
	public void setEname(String ename) {
		this.ename = ename;
	}
	public Integer getParentId() {
		return parentId;
	}
	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public City getParent() {
		return parent;
	}
	public void setParent(City parent) {
		this.parent = parent;
	}
}
