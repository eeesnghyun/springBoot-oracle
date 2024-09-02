<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<%-- csrf token --%>
	<meta id="_csrf" name="_csrf" content="${_csrf.token}" />
	<meta id="_csrf_header" name="_csrf_header" content="${_csrf.headerName}" />
	
	<title><c:out value="${title}" /></title>
	
	<%-- jquery 3.6 --%>
	<script src="/resources/plugins/jquery-3.6.0.min.js"></script>
	
	<%-- 공통 함수 --%>
	<script src="${sessionScope.path}/script/common/common.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
	
	<%-- 그리드 컴포넌트 : Tabulator 5.1 --%>
	<script src="/resources/plugins/grid/tabulator/tabulator.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"/></script>
	
	<%-- Datepicker --%>
	<link rel="stylesheet" type="text/css" href="/resources/plugins/airdatepicker/datepicker.min.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"/>
	<script src="/resources/plugins/airdatepicker/datepicker.min.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
	<script src="/resources/plugins/airdatepicker/datepicker.en.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
	
	<%-- 공통 CSS --%>
	<link rel="stylesheet" type="text/css" href="${sessionScope.path}/style/main/menu.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">	
	<link rel="stylesheet" type="text/css" href="${sessionScope.path}/style/common/common.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">	
</head>
<body>
	<div style="background-color: #fff; margin-inline: 20px;">
		<tiles:insertAttribute name="normalBody" />
	</div>	
</body>
</html>