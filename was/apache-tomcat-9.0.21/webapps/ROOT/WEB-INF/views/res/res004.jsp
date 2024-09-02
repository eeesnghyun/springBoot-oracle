<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/res/res004.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="${sessionScope.path}/style/res/res004member.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>예약 현황</h2>
	        <p>확정된 예약의 날짜별 조회가 가능하며, 내원 현황/남은 시술권/예약된 시술을 확인하고 관리할 수 있습니다.</p>
        </div>
        <div class="btn-tit">
        	<button type="button" class="btn-color dark-btn" onclick="colorChangePopup();">배경 변경</button>
        	<button type="button" class="btn-reserve dark-btn" onclick='commonDrawPopup("load","/res/res004FindMember")'>예약 접수</button>
        </div>	
    </div>

	<div class="col0">
	    <div class="con qna">
	  		<%-- 본사 관리자만 조회 --%>
   			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospital">병원</label>	   							
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'initConnect')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select id="officeCode" name="officeCode" onchange="initConnect()"></select> 
		   			<div class="icon-arrow"></div>
		   		</div>
		    </sec:authorize>
		    
		    <%-- 병원 관계자인 경우 조회 --%>
		    <sec:authorize access="hasRole('ROLE_ADMIN')">
		   		<div class="select-box">
		   			<label for="hospital">병원</label>	   							
		   			<input type="text" value='<c:out value="${sessionScope.hospitalName}"/>' disabled="disabled">
		   			<input type="hidden" id="hospitalCode" name="hospitalCode">
		   		</div>
		   		
		   		<div class="select-box">		   			
		   			<input type="text" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
		   			<input type="hidden" id="officeCode" name="officeCode">
		   		</div>
		    </sec:authorize>
		    
		    <%-- 병원 사이트 주소 --%>		    
		    <div style="display: none"><a class="page-url"></a></div>
	    </div>
	</div>
	
    <div class="member-area">
        <div class="member-table">
            <div class="date-bar">
            	<div>	
                	<button type="button" onclick="dateButton('prev');"></button>
                	<input type="text" id="selectDate">
                	<button type="button" onclick="dateButton('next');"></button>
                </div>
                <div class="reserve-state">
                	<div>총 예약(<span class="blue" id="totalCnt">0</span>건) / 초진(<span class="blue" id="firstVisit">0</span>건), 재진(<span class="blue" id="revisit">0</span>건)</div>
            	</div> 	
            </div>
            
            <div class="member-wrap">
                <div class="member-list">
                    <div class="top-title first">
                        <div>예약회원(<span class="red" id="cnt0">0</span>건) / 부도(<b id="cntNoShow">0</b>건)</div>
                    </div>
                   	<div id="status0" class="card-wrap scroll">	
                    </div>
                </div>

                <div class="member-list">
                    <div class="top-title">
                        <div>도착한 회원(<span class="blue" id="cnt1">0</span>건)</div>
                        <div class="card-color"><div class="color" id="color1" style="background-color: #678fff;"></div>도착한 회원</div>
                    </div>
                   	<div id="status1" class="card-wrap scroll">
                    </div>
                </div>

                <div class="member-list">
                    <div class="top-title">
                        <div>확인필요(<span class="blue" id="cnt2">0</span>건) /  CRM 전송(<span class="blue" id="cnt3">0</span>건)</div>
                        <div class="card-color"><div class="color" id="color2" style="background-color:#ff8d8d;"></div> 확인필요</div>
                        <div class="card-color" style="margin-left:8px;"><div class="color" id="color3" style="background-color:#ff8d8d;"></div> CRM 전송</div>
                    </div>
                   	<div id="status2" class="card-wrap scroll">
                    </div>
                </div>

                <div class="member-list">
                    <div class="top-title last">
                        <div>확인완료(<span class="blue"id="cnt4">0</span>건)</div>
                        <div class="card-color"><div class="color" id="color4" style="background-color:#c58bff;"></div>확인완료</div>
                    </div>
                   	<div id="status3" class="card-wrap scroll">
                    </div>
                </div>

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
<script src="${sessionScope.path}/script/res/res004.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script src="${sessionScope.path}/script/res/res004Member.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	var jobArr        = [];					    <%-- 작업 리스트 --%>
	var worksId       = '<%=sysUserId %>';		<%-- 작업자 아이디(세션) --%>	
	var connectURI    = '<%=connectURI %>' + "/member/channels/connect";	<%-- SSE 연결주소 --%>
	var actionURI     = '<%=connectURI %>' + "/member/channels/works";		<%-- SSE 작업상태 확인주소 --%>
	var disconnectURI = '<%=connectURI %>' + "/member/channels/disconnect";	<%-- SSE 연결종료주소 --%>	
	var confirmURI    = '<%=connectURI %>' + "/member/channels/workend";	<%-- SSE 작업종료/예약확인주소 --%>
	var updateURI     = '<%=connectURI %>' + "/member/work";				<%-- SSE 예약상태변경주소 --%>	

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