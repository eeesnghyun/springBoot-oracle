<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    

<%-- jquery 3.6 --%>
<script src="/resources/plugins/jquery-3.6.0.min.js"></script>
<script>
	const msg = "<c:out value='${msg}'/>";
	const page = "<c:out value='${url}'/>";
	
	alert("<c:out value='${msg}'/>");		
		
	location.href = page;
</script>
