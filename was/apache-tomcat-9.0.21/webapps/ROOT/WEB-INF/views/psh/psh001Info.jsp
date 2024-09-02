<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/psh/psh001.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>푸시 발송 이력</h2>
	        <p>푸시를 발송한 이력과 등록된 푸시 예약 목록을 확인할 수 있습니다.</p>
	    </div>
	</div>
	
	<div class="psh-info-area">
		<%-- 기본 정보 --%>
		<div class="left-area">
			<div class="col0">
			    <div class="con">
			   		<%-- 본사 관리자만 조회 --%>
		 			<sec:authorize access="hasRole('ROLE_WWL')">
				   		<div class="select-box">
				   			<label for="hospitalCode">병원</label>	   							
				   			<select id="hospitalCode" name="hospitalCode" disabled="disabled"></select>
				   			<div class="icon-arrow"></div>
				   		</div>
				   		
				   		<div class="select-box">
				   			<select class="small" id="officeCode" name="officeCode" disabled="disabled"></select>
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
			    </div>
			</div>
			
			<div class="col">
				<div class="col1">		
					<div class="tit-bar">푸시 타겟 설정</div>
					<div class="contents">
						<input type="hidden" id="pushType">					
						<div class="con">
							<label class="need">발송 타입</label>
							<span class="psh-info-type"></span>		            
							<span class="psh-info-time"></span>		            
						</div>
						
						<div class="con">
							<label class="need">발송 대상</label>
							<span id="pushTarget"></span>		            
						</div>
					</div>	  		  	
				</div>
				
				<div class="col2">
					<div class="div-left">
						<div class="tit-bar">푸시 타켓 특정 조건</div>
						<div class="contents">
							<div class="con">
								<label class="need">초진/재진</label>
								 <span id="userType">전체</span>
							</div>
							<div class="con">
								<label class="need">성별</label>
								 <span id="userGender">성별 전체</span>
							</div>
							<div class="con">
								<label class="need">나이</label>
								 <span id="userAge">나이 전체</span>
							</div>
							<div class="con">
								<label class="need">결제</label>
								 <span id="pushPay">선택 안함</span>
							</div>
							<div class="con">
								<label class="need">의료진 지정</label>
								 <span id="fixedStaff">의료진 전체</span>
							</div>
							<div class="con">
								<label class="need">등급</label>
								 <span id="userGrade">등급 전체</span>
							</div>
						</div>
					</div>	
					
					<div class="div-right">
						<div class="tit-bar">푸시 통계</div>
						<div class="contents">
							<div class="con">
								<label class="need">발송 상태</label>
								<span id="pushStatus"></span>
								<button type="button" class="info-push-cancel" onclick="pushCancel();">발송 취소</button>
								<button type="button" class="info-push-test" onclick="infoPageTestPush();">테스트 발송</button>
							</div>
							<div class="con">
								<label class="need">발송 수</label>
								<span id="expectCnt"></span>
							</div>
							<div class="con">
								<label class="need">발송 성공</label>
								<span id="successCnt"></span><span id="successPercent"></span>
							</div>
							<div class="con">
								<label class="need">클릭수</label>
								 <span id="clickCnt"></span><span id="clickPercent"></span>
								 <button type="button" class="btn-push-detail" onclick="goStatistics()">푸시 통계 상세 확인하기</button>
							</div>
						</div>
					</div>
					
				</div>
				
				<div class="guide-box">
					<div class="guide-tit">도움말</div>
					<div class="con">
					 	<label>· 발송 수</label>
					 	<span>전체 발송된 푸시 수입니다.</span>
					</div>
					<div class="con">
					 	<label>· 발송 성공</label>
					 	<span>푸시가 사용자에게 성공적으로 발송된 누적 수 입니다.</span>
					</div>
					<div class="con">
					 	<label>· 클릭 수</label>
					 	<span>발송된 푸시를 사용자가 클릭한 수입니다.</span>
					</div>
				</div>
			</div>			
		</div>
		
		<div class="right-area">
			<div class="preview-img">
				<div class="pre-div">
    				<div class="pre-office"><span id="preOffice">뷰티온 클리닉 강서점</span><span class="push-time">2분전</span></div>
    				<div class="pre-content">
    					<span class="pre-tit" id="pushTitle"></span>
    					<pre id="pushContent"></pre>
    				</div>
    			</div>
			</div>
		</div>	
	</div>
</div>

<script src="${sessionScope.path}/script/psh/psh001.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
	getPushInfo();
</script>	