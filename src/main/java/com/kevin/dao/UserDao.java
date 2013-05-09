package com.kevin.dao;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import com.kevin.entity.User;

@Stateless
public class UserDao {
	@Inject
    private EntityManager entityManager;
    
    public void createUser(User user) {
        entityManager.persist(user);
    }
}
