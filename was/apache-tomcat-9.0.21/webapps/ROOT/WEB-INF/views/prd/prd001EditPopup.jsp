<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="get-detail">
	<div class="popup-tit">
		<div class="text">
		    <p>내용 불러오기</p>
		    <span>기존에 작업하는 내용은 저장되지 않습니다.</span>
		</div>
	</div>
	
	<div class="popup-con" style="width:465px">
		<div>
			<label class="need">대분류</label>
			<div class="select-box">
		    	<select id="popPrdList" onchange="getProductSubListPop(this.value)"></select>
				<div class="icon-arrow"></div>	
			</div>
		</div>
	
		<div>
			<label class="need">소분류</label>
			<div class="select-box">
		    	<select id="popPrdSubList" class="small" onchange="getProductSubDtInfoPop(this.value)"></select>
				<div class="icon-arrow"></div>	
			</div>
		</div>
	
	    <span>에서 데이터를 불러옵니다.</span>
	</div>
	
	<div class="content detail-con scroll"></div>
			 
	<div class="popup-btn">
		<div class="select-box">
	    	<select id="selectType"></select>
			<div class="icon-arrow"></div>	
		</div>

		<button class="save-btn blue-btn" type="button" onclick="updateCallProductSubDt()">저장하기</button>
	</div>
</div>

<script src="${sessionScope.path}/script/prd/prd001EditPopup.js"></script>	
<script>
	getProductListPop();
</script>