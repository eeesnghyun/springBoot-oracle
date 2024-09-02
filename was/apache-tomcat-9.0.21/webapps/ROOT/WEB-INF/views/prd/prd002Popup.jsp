<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/prd/prd002Popup.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
	
<form id="frm" action="/prd/insertEventProductSurgical" method="post">
	<input type="hidden" name="_csrf" value="${_csrf}" />
	<input type="hidden" id="eventUpdateSeq"   name="eventUpdateSeq"   value="${eventUpdateSeq}">	
	<input type="hidden" id="eventSeq" 		   name="eventSeq" 		   value="${eventSeq}">	
	<input type="hidden" id="eventSubSeq" 	   name="eventSubSeq" 	   value="${eventSubSeq}">
	<input type="hidden" id="eventProductCode" name="eventProductCode" value="${eventProductCode}">
	
	<div class="left">
	    <div class="popup-tit">
	        <p>이벤트 시술 ${type == 'edit' ? '수정' : '추가'}</p>
	    </div>
	
		<input type="hidden" name="eventProductType" value="P">	<%-- 이벤트초기값 : 패키지 --%>
		
	    <ul class="tab">	    	
	        <li class="event" data-type="E" onclick="tabBtn(this.dataset.type)">1회 체험</li>
	        <li class="package active" data-type="P" onclick="tabBtn(this.dataset.type)">패키지</li>
	        <li class="number" data-type="C" onclick="tabBtn(this.dataset.type)">포인트</li>
	    </ul>
	
	    <div class="popup-con">
	        <div class="name-area">
	            <label class="need">이벤트 그룹</label>
	            <input type="text" name="eventProductHead" disabled> 
	        </div>
	
	        <div class="icon-area">
	            <label for="">이벤트 강조 문구 (쉼표로 구분)</label>
	            <input type="text" name="eventProductWord" placeholder="이벤트 강조문구를 입력해 주세요." data-object>
	        </div>
	
	        <div class="event-area event">
	            <label for="" class="need">이벤트 시술 (시술명 앞에 [EVENT] 추가됩니다.)</label>
   	            <div class="input-area inputs">
         	        <input type="text"  class="small" value="[EVENT]" disabled>	
	                <input type="text" class="name" name="eventProductTitle" placeholder="이벤트 시술을 입력해 주세요." required data-object>
	                <div class="package number change C P">
          	       		<input type="text" class="count" name="eventCnt" placeholder="0" onkeyup="addPackageCount(); commonMoneyFormat(this.value , this)" data-object required="required">
               			<span class="round">회</span>
	                </div>
		       </div>
		    </div>	
	
	        <div class="desc-area">
	            <label for="">이벤트 시술 설명</label>
	            <textarea name="eventProductContent" class="scroll" placeholder="이벤트 시술 설명을 입력해 주세요." data-object></textarea>
	        </div>
	
	        <div class="price-area">
	            <div class="sale">
	                <label for="" class="need">이벤트 할인가</label>
	                <input type="text" name="eventSale" placeholder="이벤트 할인가" onkeyup="commonMoneyFormat(this.value , this)" required data-object>
	            </div>
	            
	            <div class="origin">
	                <label for="">이벤트 정상가</label>
	                <input type="text" name="eventPrice" placeholder="이벤트 정상가" onkeyup="commonMoneyFormat(this.value , this)" required data-object>
	            </div>
	        </div>
	
	        <div class="popup-btn">
	            <button type="button" class="add-btn blue-btn" value="${type}" onclick="checkData()">${type == 'edit' ? '수정' : '추가'}하기</button>
	        </div>
	    </div>
	</div>
	
	<%-- 패키지 --%>
	<div class="right package change P">
	    <div class="package-area">
	        <div class="popup-tit">
	            <div class="text">
	                <p>패키지 설정</p>
	                <span>이벤트 상품명과 방문 회차를 입력하면 자동으로 생성됩니다.</span>
	            </div>
	            
	            <p class="total">
	            	총 합계 <span class="total_price">0</span> 원
	            </p>
	        </div>
	
	        <div class="popup-con">
	            <ul class="package-items items P scroll"></ul>
	            
	            <div class="package-des-wrap">
       	            <label>패키지 설명</label>
		            <textarea name="packageContent" class="scroll"></textarea>
		            
		            <div>
	                	<input id="packageDes" name="packageDisplayYn" class="rec-check" type="checkbox" value="${checked == true ? 'N' : 'Y'}">
	                	<label for="packageDes"></label>
         		        <label for="packageDes">패키지 설명 홈페이지 노출</label>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
	
	<%-- 횟수차감 --%>
	<div class="right number change C" style="display: none;">
	    <div class="number-area">
	        <div class="popup-tit">
	            <div class="text">
	                <p>포인트 설정</p>
	                <span>포인트를 차감할 시술을 추가해 주세요. <br/> 하단에 보이는 버튼으로 진행할 수 있습니다.</span>
	            </div>
	        </div>
	
	        <div class="popup-con">
	            <ul class="number-items items C scroll"></ul>
	
	            <button type="button" class="number-add" onclick="addNumberList('')">포인트 차감 설정 추가</button>
	        </div>
	    </div>
	</div>
	
	<%-- 공통 --%>
	<div class="right common" style="display: none;">
	    <div class="popup-tit">
	        <p>이벤트 시술 구성</p>
	    </div>
	
	    <div class="popup-con">
	        <div class="select-box">
	            <select id="product" onchange="getProductSubList()"></select>
	            <div class="icon-arrow"></div>	
	        </div>
	
	        <div class="select-box">
	            <select id="productSub" onchange="getProductItemList()">
	            	<option value=''>소분류 선택</option>
	            </select>
	            <div class="icon-arrow"></div>	
	        </div>
	    </div>
	
	    <div class="popup-con add-area">
	        <%-- 검색영역 --%>
	        <div class="add-event-left">
	            <div class="search-area">
	                <input type="text" placeholder="일반 시술명을 검색해 주세요.">
	                <button type="button" class="search-btn" onclick="searchItem()"></button>
	            </div>
	
	            <ul class="result-area scroll"></ul>
	        </div>
	
	        <button type="button" class="arrow"></button>
	
	        <%-- 시술 묶는 영역 --%>
	        <div class="add-event-right">
	            <ul class="select-area scroll" id="selectArea"></ul>
	            <div class="total">
	                <p>총 <span class="count">0</span>개 구성</p>
	                <p>합계 <span class="price">0</span>원</p>
	            </div>
	            <button type="button" class="final-add E change" onclick="addListTit()">추가한 시술로 이벤트 시술 명 추가</button>
	        </div>
	    </div>
	
	    <div class="popup-tit">
	        <p>상세페이지 노출 설정</p>
	    </div>
	
	    <div class="popup-con prd-type">
	        <div class="type">
	            <div id="selectType" class="con">
           	        <label class="need">이벤트 시술 구성을 먼저 진행해 주세요.</label>
	            </div>
	        </div>
	    </div>
	</div>
</form>

<script src="${sessionScope.path}/script/prd/prd002Popup.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	if (!isNullStr(document.getElementById("eventProductCode").value)) {
		getEventGroupSubInfo();
	}
	getProductList();	
</script>