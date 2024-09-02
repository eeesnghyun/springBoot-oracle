<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="/resources/plugins/grid/tabulator/tabulator_semanticui.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="${sessionScope.path}/style/prd/prd003.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>상세 페이지 설정</h2>
	        <p>상세 페이지에 내용을 설정할 수 있습니다.</p>
	    </div>
	</div>
	
    <%-- 기본 정보 --%>
	<div class="col0" id="usrArea">
	    <div class="con">
  			<%-- 본사 관리자만 조회 --%>
 			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'getProductSubDtList')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select id="officeCode" class="small" name="officeCode" onchange="getProductSubDtList()"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		    </sec:authorize>
		    
		    <%-- 지점 관리자, 직원인 경우 조회 --%>
		    <sec:authorize access="hasRole('ROLE_ADMIN')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<input type="text" value='<c:out value="${sessionScope.hospitalName}"/>' disabled="disabled">
		   			<input type="hidden" id="hospitalCode" name="hospitalCode" value='<c:out value="${sessionScope.hospitalCode}"/>'>
		   		</div>
		   		
		   		<div class="select-box">		   			
		   			<input type="text" class="small" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
		   			<input type="hidden" id="officeCode" name="officeCode" value='<c:out value="${sessionScope.officeCode}"/>'>
		   		</div>
		    </sec:authorize>
		    
		    <p id="homePageUrl" style="display:none"></p>
		    
		    <div class="sort-area">
   				<label for="search">검색</label>	
		    	<div class="select-box">   							
					<select id="productMt" onchange="document.getElementById('productCode').value=''; search()"></select>
					
					<div class="icon-arrow"></div>
				</div>
				
		    	<div class="select-box">   							
					<select id="productCode" class="small" onchange="search()"></select>
					
					<div class="icon-arrow"></div>
				</div>
				
			   	<div class="search-box">
			    	<input type="text" id="productSub" class="search" placeholder="소분류 검색"> 
		   			<div class="icon-search"></div>
			   	</div>  
		    </div>
	    </div>
	    
   		<div id="divGrid"></div>
	</div>
</div>

<script src="${sessionScope.path}/script/prd/prd003.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>	
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>