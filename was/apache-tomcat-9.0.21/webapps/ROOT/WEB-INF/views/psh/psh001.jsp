<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/psh/psh001.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="/resources/plugins/grid/tabulator/tabulator_semanticui.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>푸시 발송 이력</h2>
	        <p>푸시를 발송한 이력과 등록된 푸시 예약 목록을 확인할 수 있습니다.</p>
	    </div>
	    
	    <div class="btn-tit">
       	    <button class="add-mts-btn dark-btn" type="button" onclick="goAddPage()">푸시 등록</button>
	    </div>
	</div>
	
	<%-- 기본 정보 --%>
	<div class="col0">
	    <div class="con">
  			<%-- 본사 관리자만 조회 --%>
 			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'getPushList')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select class="small" id="officeCode" name="officeCode" onchange="getPushList()"></select>
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
		    
		    <%-- 병원 사이트 주소 --%>
		    <div style="display: none"><a class="page-url"></a></div>
	
			<div class="area">
				<label for="startDate">날짜</label>	
				<div class="con date">
					<input type="text" class="start-date" id="startDate" name="startDate" placeholder="시작일" autocomplete="off">
				</div>
				
				<span class="wave">~</span>
			
				<div class="con date">
					<input type="text" class="end-date" id="endDate" name="endDate" placeholder="종료일" autocomplete="off">
				</div>
			</div>
	    </div>
	</div>
	
	<div class="col">		
	  	<div id="divGrid"></div> 	
	</div>
</div>

<script src="${sessionScope.path}/script/psh/psh001.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');

	commonDatePicker(["startDate" , "endDate"], '', setParams);	
	getPushList();
</script>	