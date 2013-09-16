package com.kevin.dao;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;

public abstract class CommonDao<T> {
	@Inject
	private EntityManager entityManager;

	private Class<T> entityClass;

	// public Criteria getCriteria() {
	// Criteria criteria = getSession().createCriteria(entityClass);
	// return criteria;
	// }

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public CommonDao() {
		Class c = getClass();
		Type type = c.getGenericSuperclass();
		if (type instanceof ParameterizedType) {
			Type[] types = ((ParameterizedType) type).getActualTypeArguments();
			entityClass = (Class<T>) types[0];
		}
	}

	/**
	 * 保存记录.
	 * 
	 * @param entity
	 */
	public void save(T entity) {
		entityManager.persist(entity);
	}

	/**
	 * 更新记录.
	 * 
	 * @param entity
	 */
	public void update(T entity) {
		entityManager.merge(entity);
	}

	/**
	 * 取出指定ID的对象.
	 * 
	 * @param entityClass
	 * @param id
	 * @return
	 */
	public T get(Serializable id) {
		T t = (T) entityManager.find(entityClass, id);
		return t;
	}

	/**
	 * 删除一个对象.
	 * 
	 * @param entity
	 */
	public void delete(T entity) {
		entityManager.remove(entity);
	}
	
	/**
	 * 根据id删除记录
	 */
	public void deleteById(String id) {
		T entity = this.get(id);
		entityManager.remove(entity);
	}

	/**
	 * 取得表的总记录数
	 * 
	 * @return
	 */
	public Long getCount(String sql) {
		String countSql = "select (1) from " + StringUtils.substringAfter(sql, "from");
		Query query = entityManager.createQuery(countSql);
		Long totalCount = (Long)query.getSingleResult();
		return totalCount;
	}
	
	/**
	 * 根据某一个字段的值查出第一个对象(适合查询唯一对象)
	 * @param property
	 * @param value
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public T query(String property, Object value){
		Query query = entityManager.createQuery("from " + entityClass.getName() + " t where t." + property +"=?");
		query.setParameter(1, value);
		Object result = query.getSingleResult();
		return result==null?null:(T)result;
	} 
	
	/**
	 * 根据某个属性的值查出列表
	 * @param property
	 * @param value
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<T> queryList(String property, Object value){
		Query query = entityManager.createQuery("from " + entityClass.getName() + " t where t." + property +"=?");
		query.setParameter(1, value);
		List<T> result = (List<T>)query.getResultList();
		return result;
	}

	/**
	 * 取得指定页的记录
	 */
	@SuppressWarnings("unchecked")
	public List<T> listByPage(Criteria criteria, int pageNo, int pageSize) {
		int firstResult = (pageNo - 1) * pageSize;
		
		criteria.setFirstResult(firstResult);
		criteria.setMaxResults(pageSize);
		List<T> list = criteria.list();
		return list;
	}


//	public Page<T> getPage(Criteria criteria, int pageNo, int pageSize) {
//		// 查出总记录数.
//		Long total = getCount(criteria);
//		Page<T> page = new Page<T>(pageNo, pageSize, total);
//		// 查找当前页记录.
//		List<T> list = listByPage(criteria, pageNo, pageSize);
//
//		page.setList(list);
//		return page;
//	}
	
	public EntityManager getEntityManager() {
		return entityManager;
	}
}
