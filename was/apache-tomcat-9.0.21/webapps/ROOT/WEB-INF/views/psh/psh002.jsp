<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/psh/psh002.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>발송/수신 통계</h2>
	        <p>푸시 메시지 발송 및 수신 관련 지표들을 표와 그래프로 확인할 수 있습니다.</p>
	    </div>
	</div>
	
	<%-- 기본 정보 --%>
	<div class="col0">
	    <div class="con">
  			<%-- 본사 관리자만 조회 --%>
 			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'changeDataList')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select class="small" id="officeCode" name="officeCode" onchange="getSendPushList(); changeDataList()"></select>
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
				<label for="sort">푸시 발송 리스트</label>	
				<div class="select-box">
		   			<select class="big" id="sort" onchange="changeDataList()">
		   				<option value="">전체 리스트</option>
		   			</select>
		   			
		   			<div class="icon-arrow"></div>
	   			</div>
				
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
		<div class="bar-chart chart">
			<p class="graph-tit">발송 통계</p>
			
			<div>
				<div class="chart-area" id="bar">
					<div class="all"></div>
					<div class="sucess"></div>
					<div class="check"></div>
				</div>
				
				<ul class="legend">
					<li><span>전체 발송 수</span><p id="totalCnt">00</p></li>
					<li><span>성공률</span><p class="percent" id="successPercent">00</p></li>
					<li><span>수신확인률</span><p class="percent" id="clickPercent">00</p></li>
				</ul>
			</div>
			<div id="noSearch">해당 데이터가 없습니다.</div>
		</div>
		
		<div class="round-chart chart">
			<p class="graph-tit">발송 대상별 점유율</p>
			
			<div>
				<div class="chart-area" id="round"></div>
				<ul class="legend">
					<li><span>ios</span><p class="percent" id="iosPercent">00</p></li>
					<li><span>Android</span><p class="percent" id="androidPercent">00</p></li>
				</ul>
			</div>			
			<div id="noSearch">해당 데이터가 없습니다.</div>
		</div>
	</div>
	
	<div class="col col2">
		<div class="graph-chart active chart day">
			<div class="tit-area">
				<div>
					<p class="graph-tit">날짜별 데이터</p>
				
					<div class="btn-area">
						<button type="button" class="active" data-type="date">날짜</button>
						<button type="button" data-type="time">시간</button>
					</div>
				</div>
				
				<ul class="legend">
					<li><i style="background-color: #4e41ff"></i>발송</li>
					<li><i style="background-color: #ffe39e"></i>발송실패</li>
					<li><i style="background-color: #93ef93"></i>수신</li>
					<li><i style="background-color: #ff6b6b"></i>수신 확인</li>
				</ul>
			</div>
			<div class="chart-area" id="graph"></div>
			<div id="noSearch">해당 데이터가 없습니다.</div>
		</div>
		
		<div class="table">
			<ul class="date-table">
				<li class="table-tit">일시</li>
			</ul>
			
			<ul class="send-table">
				<li class="table-tit">발송</li>
			</ul>
			
			<ul class="fail-table">
				<li class="table-tit">발송 실패</li>
			</ul>
			
			<ul class="accept-table">
				<li class="table-tit">수신</li>
			</ul>
			
			<ul class="accept-fail-table">
				<li class="table-tit">수신 실패</li>
			</ul>
		</div>
		
        <%-- 페이지 --%>
       	<div class="pagination">
	        	<button type="button" class="btn-prev-page"  onclick="pageBtnClick('prev');">Prev</button>
	        	<div class="page-wrap"></div> 
	        <button type="button" class="btn-next-page" onclick="pageBtnClick('next');">Next</button>
	   	</div>
	</div>
</div>

<script src="/resources/plugins/eChart/eCharts.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script src="${sessionScope.path}/script/psh/psh002.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>