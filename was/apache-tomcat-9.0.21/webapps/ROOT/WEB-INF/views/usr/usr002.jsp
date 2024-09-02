<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<link rel="stylesheet" href="${sessionScope.path}/style/usr/usr001.css" type="text/css"/>
<link rel="stylesheet" href="/resources/plugins/grid/tabulator/tabulator_semanticui.css" type="text/css"/> 

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>차단 계정 관리</h2>
	        <p>병원에서 사용하는 계정을 관리할 수 있습니다.</p>
	    </div>	
	</div>
	   	
   	<div class="col0" id="usrArea">
	    <div class="con">
   			<%-- 본사 관리자만 조회 --%>
   			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<select id="hospitalCode" onchange="commonGetOffice(this.value, 'getBlockUser', true)"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select id="officeCode" class="small" onchange="getBlockUser()"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		    </sec:authorize>
		    
		    <%-- 지점 관리자, 직원인 경우 조회 --%>
		    <sec:authorize access="hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<input type="text" value='<c:out value="${sessionScope.hospitalName}"/>' disabled="disabled">
		   			<input type="hidden" id="hospitalCode" value='<c:out value="${sessionScope.hospitalCode}"/>'>
		   		</div>
		   		
		   		<div class="select-box">		   			
		   			<input type="text" class="small" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
		   			<input type="hidden" id="officeCode" value='<c:out value="${sessionScope.officeCode}"/>'>
		   		</div>
		    </sec:authorize>
		   
		   <div class="sort-area">
  	   	   	   <label for="user">검색</label>
			   <div class="search-box">
				   <input type="text" id="user" class="search" placeholder="이름 / 아이디 / 휴대폰 번호 검색"> 
			   	   <div class="icon-search"></div>
			   </div>  
		   </div>
		   
		   <div class="page-url" style="display:none"></div>		
   		</div>
	    
   		<div id="divGrid"></div>
   	</div>
</div>

<script src="${sessionScope.path}/script/usr/usr002.js"></script>
<script>
	initSelect();
</script>	