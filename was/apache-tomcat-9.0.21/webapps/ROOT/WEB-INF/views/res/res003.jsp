<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/res/res003.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>자동 승인</h2>
	        <p>홈페이지에서 접수된 예약에 승인 조건을 설정할 수 있습니다.</p>
	    </div>
	</div>
	
    <%-- 기본 정보 --%>
	<div class="col0">
	    <div class="con">
  			<%-- 본사 관리자만 조회 --%>
 			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'getOfficeReserve')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select id="officeCode" name="officeCode" class="small" onchange="getOfficeReserve()"></select>
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
		    
		    <div class="page-address" style="display: none">
	            <p>홈페이지 주소</p>
	            <a class="page-url"></a>
	        </div>
	    </div>
	</div>
	
   	<div class="col col1">
	    <div class="tit-bar">
	        <p>자동 승인 시간 설정</p>
	        <div class="set-auto">
	            <button type="button" class="btn-auto">자동 승인 중지</button>
	            <div class="auto-area">
	                <label>자동승인 설정</label>
                    <div>
                      	<input type="checkbox" class="cm-toggle" id="autoCheck" value="N" onclick="updateOfficeSetting()">
                        <p class="eng">OFF</p>
                    </div>
	            </div>
	        </div>
	    </div>
	    
        <div class="time-con">
        	<div class="btn">
  		        <button type="button" class="basic blue-btn" onclick="addTimePopup()">시간 추가</button>
        	</div>
        	
	        <ul class="con" id="dateTimeArea">
	            <li data-seq="1">
	                <p>월요일</p>
	                <ul class="con-date scroll"></ul>
	            </li>
	
	            <li data-seq="2">
	                <p>화요일</p>
	                <ul class="con-date scroll"></ul>
	            </li>
	
	            <li data-seq="3">
	                <p>수요일</p>
	                <ul class="con-date scroll"></ul>
	            </li>
	
	            <li data-seq="4">
	                <p>목요일</p>
	                <ul class="con-date scroll"></ul>
	            </li>
	
	            <li data-seq="5">
	                <p>금요일</p>
	                <ul class="con-date scroll"></ul>
	            </li>
	
	            <li data-seq="6">
	                <p>토요일</p>
	                <ul class="con-date scroll"></ul>
	            </li>
	
	            <li data-seq="0">
	                <p>일요일</p>
	                <ul class="con-date scroll"></ul>
	            </li>
	        </ul>
	    </div>
    </div>
    
    <div class="col2 col">
	    <div class="tit-bar">
	        <p>자동 승인 예외 설정</p>
	    </div>

	    <div class="excep-con">
	        <div class="left">
	            <div class="add">
	                <div>
	                    <label for="" class="need">특정 소분류 예외</label>
	                </div>
	
	                <div>
						<div class="select-box">
					    	<select id="prdMtList" onchange="getProductMtSubList(this.value)"></select>
							<div class="icon-arrow"></div>	
						</div>
						
						<div class="select-box">
					    	<select id="prdSubList" class="small"></select>
							<div class="icon-arrow"></div>	
						</div>
						
	                    <button type="button" class="basic blue-btn" onclick="addProductSub()">추가</button>
	                </div>
	            </div>
	
	            <ul class="add-list"></ul>
	        </div>
	
	        <div class="right">
	            <label class="need">기타 예외</label>
	
                <div class="check-area"></div>
	        </div>
	    </div>
	</div>
</div>

<script src="${sessionScope.path}/script/res/res003.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>	
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');		
</script>