<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/res/res002.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="${sessionScope.path}/style/res/res002Time.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="${sessionScope.path}/style/res/res004member.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>예약 대기</h2>
	        <p>홈페이지에서 접수된 예약을 확인하고 확정/변경/취소 처리할 수 있습니다.</p>
	    </div>

		<button class="reserve-btn dark-btn" type="button" onclick='commonDrawPopup("load","/res/res004FindMember")'>예약 접수</button>
	</div>
	
    <%-- 기본 정보 --%>
	<div class="col0">
	    <div class="con">
  			<%-- 본사 관리자만 조회 --%>
 			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'initConnect')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select class="small" id="officeCode" name="officeCode" onchange="initConnect()"></select>
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
	
   	<div class="col col1">
	    <div class="tab-tit">
	        <ul>
	            <li data-page="apply">예약 신청<p class="reserve-count"></p></li>
	            <li data-page="change">예약 변경<p class="reserve-count"></p></li>
	        </ul>
	    </div>
	    
	    <div class="tab-top">
	    	<div class="top">
                <div class="select-option-area">
                	<div class="select-box">   							
			   			<select id="view">
			   				<option value="create">예약 신청일 기준</option>
			   				<option value="reserve">희망 예약일 기준</option>
			   			</select>
			   			<div class="icon-arrow"></div>
			   		</div>	
			   					   		
			   		<div class="select-box">
			   			<select class="small" id="sort">
			   				<option value="">초진/재진 전체</option>
			   				<option value="1">초진</option>
			   				<option value="2">재진</option>
			   			</select>
			   			
			   			<div class="icon-arrow"></div>
		   			</div>
                </div>

                <div class="search-box">
                	<input type="text" class="search" id="field" placeholder="고객명 / 예약 시술 검색">
                	<div class="icon-search"></div>
                </div>
             </div>
	    </div>

        <%-- 예약신청 --%>
        <div class="tab-con">
            <div>
				<%-- 리스트 --%>
                <div class="left-area">   
                    <ul class="left-con"></ul>
                </div>
                
                <%-- 페이지 --%>
               	<div class="pagination">
		         	<button type="button" class="btn-prev-page"  onclick="pageBtnClick('prev');">Prev</button>
		         	<div class="page-wrap"></div> 
			        <button type="button" class="btn-next-page" onclick="pageBtnClick('next');">Next</button>
		    	</div>
            </div>

			<%-- 예약 현황 --%>
            <div class="right-area">
               	<div class="top">
                    <span class="date-txt"></span>
                    <span>예약 인원 현황</span>
                </div>

                <ul class="right-con">
                    <li class="prd-mst">
                        <div class="count-area"></div>

                        <ul class="detail-area"></ul>
                    </li>
                    
                    <%-- 소분류 예약 현황 --%>
                    <li class="prd-sub">
                        <div class="count-area">
                        </div>
                    </li>
                </ul>
            </div>
        </div>

       	<%-- 예약변경 --%>
       	<div class="tab-con">
			<div>
	          	<%-- 리스트 --%>
           	  	<div class="left-area">   
		        	<ul class="left-con"></ul>
		      	</div>
		      	
		      	<%-- 페이지 --%>
		      	<div class="pagination">
		         	<button type="button" class="btn-prev-page"  onclick="pageBtnClick('prev');">Prev</button>
		         	<div class="page-wrap"></div> 
			        <button type="button" class="btn-next-page" onclick="pageBtnClick('next');">Next</button>
		    	</div>    
			</div> 
			
			<%-- 예약 현황 --%>
            <div class="right-area">
       	        <div class="top">
                    <span class="date-txt"></span>
                    <span>예약 인원 현황</span>
                </div>

                <ul class="right-con">
                    <li class="prd-mst">
                        <div class="count-area"></div>

                        <ul class="detail-area"></ul>
                    </li>
                    
                    <%-- 소분류 예약 현황 --%>
                    <li class="prd-sub">
                        <div class="count-area">
                        </div>
                    </li>
                </ul>
            </div>     
    	</div>
	</div>
</div>

<%
	String sysUserId = (String) session.getAttribute("sysUserId");
	String url = request.getServerName().toString();
	String connectURI;
	
	if ("localhost".equals(url)) {
		connectURI = "http://localhost:18080";
	} else {		
		connectURI = "https://api.beautyon.co.kr";
	}
%>
<script src="${sessionScope.path}/script/res/res002.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script src="${sessionScope.path}/script/res/res002Time.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	var listArr    	  = [];						<%-- 작업 리스트 --%>
	var worksId       = '<%=sysUserId %>';		<%-- 작업자 아이디(세션) --%>
	var connectURI    = '<%=connectURI %>' + "/reserve/channels/connect";	<%-- SSE 연결주소 --%>
	var actionURI     = '<%=connectURI %>' + "/reserve/channels/works";		<%-- SSE 작업상태 변경주소 --%>
	var disconnectURI = '<%=connectURI %>' + "/reserve/channels/disconnect";<%-- SSE 연결종료주소 --%>	
	var confirmURI 	  = '<%=connectURI %>' + "/reserve/channels/workend";	<%-- SSE 작업종료주소 --%>
	var updateURI     = '<%=connectURI %>' + "/reserve/work";				<%-- SSE 예약상태변경주소 --%>	
		
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');	
	
	<%-- 새로고침시 작업 종료 --%>
	if (performance.navigation.type == 1) {
		disConnectServer();
	}
	
	<%-- 브라우저 종료 감지 --%>
	window.addEventListener("unload", function(event) {
		event.returnValue = "";
		
		disConnectServer();
	});
	
	<%-- 페이징, 페이지 이동시 작업 종료 --%>
	disConnectServer();
</script>