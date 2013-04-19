package com.kevin.dao;

import javax.ejb.Stateful;
import javax.enterprise.inject.Alternative;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.kevin.entity.User;

@Stateful
@Alternative
public class UserDaoImpl implements UserDao{
	@Inject
    private EntityManager entityManager;
    
    public void createUser(User user) {
        entityManager.persist(user);
    }
}
