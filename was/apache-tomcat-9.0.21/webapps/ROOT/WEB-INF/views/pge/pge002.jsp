<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="/resources/plugins/grid/tabulator/tabulator_semanticui.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="${sessionScope.path}/style/pge/pge002.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>팝업 관리</h2>
	        <p>홈페이지에 노출할 팝업을 관리할 수있습니다.</p>
	    </div>
	    <button type="button" class="btn-popup-add dark-btn" onclick="addPopup();">팝업추가</<button>
	</div>
	
	 <div class="pge-area">
		 <div class="col0">
		    <div class="con">
	   			<%-- 본사 관리자만 조회 --%>
	   			<sec:authorize access="hasRole('ROLE_WWL')">
			   		<div class="select-box">
			   			<label for="hospitalCode">병원</label>	   							
			   			<select id="hospitalCode" onchange="commonGetOffice(this.value, 'getPopList')"></select>
			   			<div class="icon-arrow"></div>
			   		</div>
			   		
			   		<div class="select-box">
			   			<select id="officeCode" class="small" onchange="getPopList()"></select>
			   			<div class="icon-arrow"></div>
			   		</div>
			    </sec:authorize>
			    
			    <%-- 병원 관계자인 경우 조회 --%>
			    <sec:authorize access="hasRole('ROLE_ADMIN')">
			   		<div class="select-box">
			   			<label for="hospitalCode">병원</label>	   							
			   			<input type="text" value='<c:out value="${sessionScope.hospitalName}"/>' disabled="disabled">
			   			<input type="hidden" id="hospitalCode">
			   		</div>
			   		
			   		<div class="select-box">		   			
			   			<input type="text" class="small" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
			   			<input type="hidden" id="officeCode">
			   		</div>
			    </sec:authorize>
			    
			     <p id="homePageUrl" style="display:none"></p>
	   		</div>	
	    
   			<div id="divGrid"></div>
   		</div>
   	</div>
</div>

<script src="${sessionScope.path}/script/pge/pge002.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>	