<%@ page import="com.kevin.util.Util"%>
<%@ page import="com.kevin.user.service.Uploadify" %>
<%@ page import="com.kevin.user.service.WidthHeight" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%
	Uploadify uploadify = new Uploadify();
	WidthHeight widthHeight = new WidthHeight(580, 290);
	List<WidthHeight> arguments = new ArrayList<WidthHeight>();
	arguments.add(widthHeight);
	String path = uploadify.uplodate(request,arguments);
	out.clear();
	out.print(Util.repository() + path);
	out.flush();
	out.clear();
%>
