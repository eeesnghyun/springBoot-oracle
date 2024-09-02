<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/prd/prd002.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<input type="hidden" id="eventGroup"/>
<input type="hidden" id="eventGroupName" name="eventGroupName"/>

<div class="main-btn">
	<button class="white-btn list-btn" type="button" onclick="popListOrder()">순서변경</button>
  	<button class="save-btn blue-btn" type="button" onclick='location.href="/prd/prd004"'>시술 전체 확인</button>
</div>

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>이벤트 시술 설정</h2>
	        <p>이벤트 안내에 보이는 내용을 설정할 수 있습니다.</p>
	    </div>
	    
   	    <div class="btn-tit">
	    	<button class="load-btn dark-btn" type="button" onclick="commonDrawPopup('load', '/prd/prd002Get')">불러오기</button>
	    </div>
	</div>
	
	<%-- 기본 정보 --%>
	<div class="col0">
	    <div class="con">
  			<%-- 본사 관리자만 조회 --%>
 			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'reload')"></select>
		   			<div class="icon-arrow"></div>							
		   		</div>
		   		
		   		<div class="select-box">		   			
		   			<select id="officeCode" class="small" name="officeCode" onchange="reload()"></select>
		   			<div class="icon-arrow"></div>		
		   		</div>
		    </sec:authorize>
		    
		    <%-- 지점 관리자, 직원인 경우 조회 --%>
		    <sec:authorize access="hasRole('ROLE_ADMIN')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<input type="text" value='<c:out value="${sessionScope.hospitalName}"/>' disabled="disabled">
		   			<input type="hidden" id="hospitalCode" name="hospitalCode">
		   		</div>
		   		
		   		<div class="select-box">		   			
		   			<input type="text" class="small" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
		   			<input type="hidden" id="officeCode" name="officeCode">
		   		</div>
		    </sec:authorize>
	
	        <div class="page-address">
	            <p>홈페이지 주소</p>
	            <a class="page-url"></a>
	        </div>
	    </div>
	</div>
	
    <div class="col1 col">
	    <div class="tit-bar">이벤트 설정</div>
	
	    <%-- 이벤트 중그룹 --%>
	    <div class="prd-area">
	        <ul class="prd"></ul>
	    </div>
	
		<%-- 이벤트 소그룹 --%>
        <div class="left"></div>
	</div>
</div>

<script src="/resources/plugins/sortable/Sortable.min.js"></script>
<script src="${sessionScope.path}/script/prd/prd002.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>