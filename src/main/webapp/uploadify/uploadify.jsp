<%@ page import="com.kevin.util.Util"%>
<%@ page import="com.kevin.user.service.Uploadify" %>
<%
	Uploadify uploadify = new Uploadify();
	String path = uploadify.uplodate(request);
	out.clear();
	out.print(Util.repository() + path);
	out.flush();
	out.clear();
%>
