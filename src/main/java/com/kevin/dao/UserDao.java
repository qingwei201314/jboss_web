package com.kevin.dao;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import com.kevin.entity.User;

@Stateless
public class UserDao extends CommonDao<User>{
    
}
