<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="org.apache.commons.fileupload.disk.DiskFileItemFactory" %>
<%@ page import="org.apache.commons.fileupload.FileItemFactory" %>
<%@ page import="javax.servlet.ServletContext" %>
<%@ page import="org.apache.commons.fileupload.servlet.ServletFileUpload" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.List" %>
<%@ page import="org.apache.commons.fileupload.FileItem" %>
<%
	DiskFileItemFactory factory = new DiskFileItemFactory();
	ServletContext servletContext = this.getServletConfig().getServletContext();
	File repository = (File) servletContext.getAttribute("C:/logs/temp");
	factory.setRepository(repository);
	ServletFileUpload upload = new ServletFileUpload(factory);
	List<FileItem> items = upload.parseRequest(request);
	if(items != null && items.size() >0){
		for(int i=0; i< items.size(); i++){
			FileItem fileItem = items.get(i);
			if(!fileItem.isFormField()){
				File file = new File("C:/logs/submit.gif");
				fileItem.write(file);
			}
		}
	}
%>
