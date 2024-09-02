<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/res/res004Receipt.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="${sessionScope.path}/style/res/res002Time.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<input type="hidden" id="userId" value="<c:out value="${userId}"/>">
<input type="hidden" id="resNo"  value="<c:out value="${resNo}"/>">
<input type="hidden" id="isNew"  value="N">
	
<%--남은금액확인 --%>
<div class="amount-wrap hide alert">
	<div class="amount-top">
		<input type="text" class="addPayAmount" onkeyup="commonMoneyFormat(this.value , this)" placeholder="충전 금액을 입력해 주세요.">
		
		<span id="addPayment" onclick="insertUserPayment(1)">충전</span>
	</div>
	
	<ul class="amount-list scroll"></ul>
	
	<div class="amount-write">
		<input placeholder="사용 금액을 입력해 주세요." class="delPayAmount" onkeyup="commonMoneyFormat(this.value , this)">
		
		<div class="amount-write-btn">
			<button type="button" id="delPayment" class="blue-btn" onclick="insertUserPayment(-1)">저장</button>
			<button type="button" class="white-btn" onclick="popUserPayment()">닫기</button>
		</div>
	</div>
</div>
	
<%--회원정보 영역 --%>
<div class="left-pop">
	<div class="info-wrap">
		<div class="title">
			<p>예약 정보</p>
		</div>
		
		<div class="input-wrap">
			<label class="need">이름 / 휴대폰 번호</label>
			
			<div class="input">
				<input type='text' id="name" disabled/>
				<input type='text' id="mobile" disabled/>
			</div>
		</div>
		
		<div class="input-wrap">
			<label class="need">남은 금액</label>
			
			<div class="input">
				<input type='text' id="remainAmount" disabled/>
				<button type='button' class="dark-btn hide" onclick="popUserPayment()">충전/사용</button>
			</div>
		</div>
		
		<div class="input-wrap">
			<label class="need">예약 경로</label>
			
			<div class="input">
				<div class="select-box">
			    	<select id="resType"></select>
					<div class="icon-arrow"></div>	
				</div>
			</div>
		</div>
		
		<div class="input-wrap">
			<label class="need">예약 날짜</label>
			
			<div class="input">
		        <div class="con date">
	       			<input type="text" class="start-date" id="reserveDate" name="reserveDate" placeholder="날짜 선택" autocomplete="off" value='<c:out value="${resDate}"/>' onclick="receiptReservePopup()" readonly required>
		        </div>
		        
		    	<input id="reserveTime" onclick="receiptReservePopup()" placeholder="시간 선택" readonly/>
			</div>
		</div>
		
		<div class="text-wrap">
			<label>고객 요청사항</label>
			<textarea id="resNote" placeholder="고객이 병원에 요청한 사항입니다."></textarea>
	        <div class="check">
	            <input type="checkbox" id="adviceYn" class="rec-check">
	            <label for="adviceYn"></label>
	            <label for="adviceYn">시술 전 자세한 상담을 희망합니다.</label>
	        </div>
		</div>
		
		<div class="text-wrap">
			<label>병원 메모</label>
			<textarea id="hospitalNote" placeholder="병원에 남기실 메모를 입력해 주세요."></textarea>
		</div>
	</div>
</div>

<%--시술권 관리 영역 --%>
<div class="center-pop">
	<div class="pro-wrap">
		<div class="title">
			<p>시술권 관리</p>
			
			<div class="tit-btn-area">
				<button type='button' onclick="popUserReserveHistory()">회원 예약 리스트 확인</button>
				<button type='button' onclick="popDeleteProductHistory()">삭제된 남은 시술권 확인</button>
			</div>
		</div>	
		
		<div class="input-wrap">
			<label class="need">추가된 이벤트 / 일반 시술권</label>
			
			<div class="input">
				<div class="select-box">
			    	<select id="product" onchange="getProductSubList()"></select>
					<div class="icon-arrow"></div>	
				</div>
				
				<div class="select-box">
			    	<select id="productSub" onchange="getProductItem()">
			    		<option value=''>소분류 선택</option>
			    	</select>
					<div class="icon-arrow"></div>	
				</div>
			</div>
		</div>
		
		<%--예약 시술 영역 --%>
		<div class="reserve-add-area">
			<div class="reserve-search-area">
				<div class="reserve-search-top">
					<input type='text' id="productField" placeholder="시술명을 검색해 주세요."/>
					<button onclick="getProductItem()"></button>
				</div>
				
				<ul class="reserve-search-result scroll"></ul>
			</div>
			
			<span></span>
			
			<div class="reserve-insert-area">
				<ul class="reserve-insert-result scroll"></ul>
				
				<div class="reserve-insert-bottom">
					<p>총 <label id="totalCount">0</label>개의 시술 금액 :<label id="totalPrice">0</label></p>
					<div class="discount-area">
						<input type='text' id="discount" placeholder='0' onkeyup="commonMoneyFormat(this.value , this)"/>
						
						<div class="discount-btn">
							<button type='button' class="plus-btn" onclick="calServicePrice(this)" value='1'>추가</button>
							<button type='button' class="minus-btn" onclick="calServicePrice(this)" value='-1'>할인</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<%--남은 시술권 영역 --%>	
		<div class="product-insert-area">
			<label class="need">남은 시술권</label>	
			<ul class="product-insert-result scroll"></ul>
		</div>
		
		<button type='button' class="dark-btn" onclick="drawTodayUsePro()">메모 생성</button>
	</div>
</div>

<%--당일 사용 시술 영역 --%>
<div class="right-pop">
	<div class="today-wrap">
		<div class="title">
			<p>메모</p>
		</div>
		
		<div class="today-use-area">
			<label class="need">생성된 메모 시술권</label>
			
			<ul class="today-use-con scroll">
				<li id="noSearch">
					시술권 관리에서 시술권을 체크 후<br>
					&quot;<bold>메모 생성</bold>&quot; 버튼을 <br>
					선택해 주세요.
				</li>
			</ul>
		</div>
		
		<%--이전 사용 시술 영역 --%>
		<div class="previous-wrap">
			<div class="label-wrap">
				<label class="need">이전 메모 (최근 3개)</label>
				
				<div class="tit-btn-area">
					<button type='button' onclick="updateProductHistoryDisplay('all')">전체 메모 삭제</button>	
					<button type='button' onclick="popOneProductHistory()">이전 메모 검색</button>
				</div>
			</div>
			
			<div class="previous-use-con scroll">
			</div>
		</div>	
		
		<div class="btn-area confirm">
			<button type='button' class="save-crm white-btn" data-status="false" onclick="popSendCRM()">CRM 전송</button>
			<button type='button' class="save-btn blue-btn" onclick="saveData()">확인완료</button>		
		</div>
		
		<div class="btn-area new">
			<button type='button' class="save-btn blue-btn" onclick="insertCrmData()">예약완료</button>		
		</div>
	</div>
</div>

<%
	String url = request.getServerName().toString();
	String connectURI;
	
	if ("localhost".equals(url)) {
		connectURI = "http://localhost:18080";
	} else {
		connectURI = "https://api.beautyon.co.kr";
	}
%>
<script src="${sessionScope.path}/script/res/res004Receipt.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script src="${sessionScope.path}/script/res/res002Time.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	if (!isNullStr('<c:out value="${resNo}"/>')) { //예약 접수일 경우
		originInit();

		<%-- 
		팝업 영역 : template.jsp
		팝업 닫기(popupClose())시 작업종료 상태로 변경이 필요하다.(팝업 레이어 클릭도 동일)
		SSE API 호출을 위해 공통으로 사용되는 함수(popupClose) 제거 후 특정 함수(confirmClose)를 등록시켜 사용한다. 	
		--%>	
		document.querySelector('.popup-overlay').removeAttribute('onclick');	
		document.querySelector('.popup-overlay').setAttribute('onclick', 'res004PopupClose()');
		document.querySelector('.popup .del-btn').removeAttribute('onclick');
		document.querySelector('.popup .del-btn').setAttribute('onclick', 'res004PopupClose()');
	} else {                                       //신규 접수일 경우 
		//회원 정보
		document.getElementById("userId").value = '<c:out value="${userId}"/>';
		document.getElementById("name").value   = '<c:out value="${name}"/>';
		document.getElementById("mobile").value = '<c:out value="${mobile}"/>';
		document.getElementById("remainAmount").value = isNullStr('<c:out value="${remainAmount}"/>') ? '0' : '<c:out value="${remainAmount}"/>';
		
		newInit();
	}
</script>