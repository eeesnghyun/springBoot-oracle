<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/sys/sys002.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="/resources/plugins/grid/tabulator/tabulator_semanticui.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>윈윈랩 계정 관리</h2>
	        <p>어드민 관리자를 추가, 삭제할 수 있습니다.</p>
	    </div>
	
	    <button class="manager-add-btn dark-btn" onclick="drawPopup()">계정 추가</button>
	</div>
	
	<div class="col">
		<div class="tit-bar">윈윈랩 계정</div>
		
		<div id="sysArea">
	  		<div id="divGrid"></div>
	  	</div>
	</div>
</div>

<script src="${sessionScope.path}/script/sys/sys002.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	getSysUser();
</script>	