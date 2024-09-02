<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/res/res001.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container" oncontextmenu="return false">
	<div class="top">
	    <div class="tit">
	        <h2>예약 설정</h2>
	        <p>예약에 필요한 설정을 할 수 있습니다.</p>
	    </div>
	    
  	    <button class="res-btn dark-btn" type="button" onclick="checkReservePop()">예약 마감 확인</button>
	</div>
	
    <%-- 기본 정보 --%>
	<div class="col0">
	    <div class="con">
  			<%-- 본사 관리자만 조회 --%>
 			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'getReserveMtInfo')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select id="officeCode" name="officeCode" class="small" onchange="getReserveMtInfo()"></select>
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
       <div class="left-area">
           <div class="tit-area">
               <p>휴무일 설정</p>
               <button type="button" class="blue-btn basic" onclick="popHoliday()">추가</button>
           </div>

           <div class="con-area">
               <div class="label-area">
                   <label>[대메뉴]소분류</label>
                   <label>휴무일</label>
               </div>

               <ul class="list border-style scroll"></ul>
           </div>
       </div>

       <div class="center-area">
           <div class="tit-area">
               <p>
                   예약 시간 및 인원 설정
                   <span class="color">(오른쪽 클릭 시 인원 무제한 활성화)</span>
               </p>

               <div class="btn-area">
                   <button type="button" class="basic-w white-btn" onclick='commonDrawPopup("load", "/res/res001Popup")'>특정일 추가</button>
                   <button type="button" class="basic blue-btn" onclick="updateReserve()">월요일 저장</button>
               </div>
           </div>

           <div class="con-area">
               <ul class="tab">
                   <li class="active" data-num="1">월요일</li>
                   <li data-num="2">화요일</li>
                   <li data-num="3">수요일</li>
                   <li data-num="4">목요일</li>
                   <li data-num="5">금요일</li>
                   <li data-num="6">토요일</li>
                   <li data-num="0">일요일</li>
               </ul>

               <div class="date-con">
                   <div class="btn-area">
                       <button class="copy-btn border-btn" type="button" onclick="popCopy()">설정 복사</button>
                   </div>

					<div class="table"></div>							
               </div>
           </div>
       </div>

       <div class="right-area">
           <div class="top-area">
               <div class="tit-area">
                   <p><span class="spec-date">월요일</span> 소분류 인원 설정</p>
                   <button type="button" class="basic blue-btn" onclick="popSubList()">추가</button>
               </div>

               <div class="con-area">
                   <div class="label-area">
                       <label>[대메뉴]소분류</label>
                       <label>인원</label>
                       <label>시간</label>
                   </div>

                   <ul class="list scroll border-style"></ul>
               </div>
           </div>

           <div class="bottom-area">
               <div class="tit-area">
                   <p>기타 예약 설정</p>
               </div>

               <div class="con-area scroll">
                   <span>ON설정 시 예약가능한 시간이 모두 오픈됩니다.</span>

                   <div class="check-area"></div>
               </div>
           </div>
       </div>
   </div>
</div>

<script src="${sessionScope.path}/script/res/res001.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>