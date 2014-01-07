package com.kevin.util.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.kevin.util.Constant;

/**
 * 用于检查当前用户是不是处于登录状态.
 * @author Kevin Zhang
 *
 */
public class LoginFilter implements Filter{
	@Override
	public void destroy() {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest)request;
		Object phone = httpRequest.getSession().getAttribute(Constant.phone);
		if(phone!=null){
			chain.doFilter(httpRequest, response);
		}
		else{
			HttpServletResponse httpResponse = (HttpServletResponse)response;
			httpResponse.sendRedirect("/" + httpRequest.getContextPath() + "/user/login.jsf");
		}
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}
}
