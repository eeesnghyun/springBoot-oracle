<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/pge/pge006.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="main-btn">
    <button class="save-btn blue-btn" type="button" onclick="termsSave();">저장하기</button>
</div>
<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>약관 관리</h2>
	        <p>사이트 이용약관, 개인정보처리방침을 관리할 수있습니다.</p>
	    </div>
	</div>
	
	<div class="col0">
	    <div class="con">
   			<%-- 본사 관리자만 조회 --%>
   			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<select id="hospitalCode" onchange="commonGetOffice(this.value, 'getClause')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select id="officeCode" class="small" onchange="getClause()"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		    </sec:authorize>
		    
		    <%-- 지점 관리자, 직원인 경우 조회 --%>
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
		    		    
		    <div class="page-address">
		        <p>홈페이지 주소</p>
	            <a id="homePageUrl"></a>
	        </div>
   		</div>
	    
   		<div class="pge06">
   			<div class="tab-wrap">
	   			<ul class="tabs">
	   				<li class="btn-tab active">사이트 이용약관</li>
	   				<li class="btn-tab">개인정보 처리방침</li>
	   			</ul>
	   			<div></div>
   			</div>
   			<div class="terms-box">
   				<textarea class="term" id="siteClause" rows="2" cols="20" wrap="hard">
				</textarea>
				<textarea class="term" id="personalInfo" style="display:none;" rows="2" cols="20" wrap="hard">
   				</textarea>
   			</div>
   		</div>
   	</div>
</div>

<script src="${sessionScope.path}/script/pge/pge006.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>