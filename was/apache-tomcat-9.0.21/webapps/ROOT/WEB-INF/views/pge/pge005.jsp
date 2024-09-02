<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/pge/pge005.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<form id="frm" action="/pge/updateMedteam" method="post">
	<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
		
	<div class="main-btn">
        <button class="white-btn list-btn" type="button" onclick="listOrder()">순서변경</button>
        <button class="save-btn blue-btn" type="button" onclick="checkSave()">저장하기</button>
    </div>
    
	<div class="body-container">
	    <div class="top">
	        <div class="tit">
	            <h2>의료진 관리</h2>
	            <p>병원소개에서 보이는 의료진을 관리할 수 있습니다.</p>
	        </div>
	    </div>

	    <%-- 기본 정보 --%>
		<div class="col0">
		    <div class="con">
		  			<%-- 본사 관리자만 조회 --%>
	  			<sec:authorize access="hasRole('ROLE_WWL')">
			   		<div class="select-box">
			   			<label for="hospitalCode">병원</label>	   							
			   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'getMedteam')"></select>
			   			<div class="icon-arrow"></div>
			   		</div>
			   		
			   		<div class="select-box">
			   			<select id="officeCode" class="small" name="officeCode" onchange="getMedteam()"></select>
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
		            <a class="page-url" id="homePageUrl"></a>
		        </div>
		    </div>
		</div>
	
	    <%-- 병원소개 --%>
	    <div class="col1 col">
	        <div class="tit-bar">의료진 소개</div>
	
	        <div class="contents">
	            <div class="con">
	                <label class="need anno">타입</label>
	
	                <input id="chk1" type="radio" name="medType" class="chk" value="all" onchange="getMedteamMember(this.value)" checked/>
	                <label for="chk1"></label>
	                <label for="chk1" class="check">전체 소개</label>
	
	                <input id="chk2" class="chk" type="radio" name="medType" class="chk" value="profile" onchange="getMedteamMember(this.value)"/>
	                <label for="chk2" ></label>
	                <label for="chk2" class="check">약력 소개</label>
	            </div>
	        </div>
	
	        <input type="text" class="eng h4" placeholder="Medical Team" name="title1" data-object>
	        <input type="text" class="span" placeholder="서브 타이틀을 입력해 주세요." name="title2" data-object>
	        <hr>
	
			<%-- 전체소개 --%>
	        <div class="content type all active">
	            <%-- A = 원장 --%>
	            <div class="con-area" id="A">
	                <input type="text" class="mid-txt" placeholder="포지션" name="positionA" data-object>
	                <ul class="con" id='conList1'>
	                    <li class="add-person" onclick="addAllDiv(this)"></li>
	                </ul>
	            </div>
	
	            <%-- B = 실장 --%>
	            <div class="con-area" id="B">
	                <input type="text" class="mid-txt" placeholder="포지션" name="positionB" data-object>
	                <ul class="con" id='conList2'>
	                    <li class="add-person" onclick="addAllDiv(this)"></li>
	                </ul>
	            </div>
	            
	            <%-- c = 코디 --%>
	            <div class="con-area" id="C">
	                <input type="text" class="mid-txt" placeholder="포지션" name="positionC" data-object>
	                <ul class="con" id='conList3'>
	                    <li class="add-person" onclick="addAllDiv(this)"></li>
	                </ul>
	            </div>
	            
	            <%-- D = 어시스트 --%>
	            <div class="con-area" id="D">
	                <input type="text" class="mid-txt" placeholder="포지션" name="positionD" data-object>
	                <ul class="con" id='conList4'>
	                    <li class="add-person" onclick="addAllDiv(this)"></li>
	                </ul>
	            </div>
	            
	        </div>
	
			<%-- 약력소개 --%>
	        <div class="content type profile"></div>
	    </div>
	</div> 
</form>

<script src="/resources/plugins/sortable/Sortable.min.js"></script>
<script src="${sessionScope.path}/script/pge/pge005.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>	
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>