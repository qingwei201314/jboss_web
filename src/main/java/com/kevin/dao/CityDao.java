package com.kevin.dao;

import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.Query;
import com.kevin.entity.City;

@Stateless
public class CityDao extends CommonDao<City>{
	/**
	 * 取出第一层的城市
	 */
	@SuppressWarnings("unchecked")
	public List<City> queryFirst(){
		Query query = getEntityManager().createQuery("from " + City.class.getName() + " t where t.parentId is null");
		List<City> result = (List<City>)query.getResultList();
		return result;
	}

}
