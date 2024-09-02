<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/sys/sys001.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
    <div class="top">
        <div class="tit">
            <h2>병원 관리</h2>
            <p>병원을 자유롭게 추가, 변경, 삭제를 할 수 있습니다.</p>
        </div>
    </div>
	
	<div class="con">
	    <div class="list col1">
	    	<div class="tit-con">
   		        <p>병원명</p>
   		        <button type="button" class="blue-btn basic" onclick="drawPopup('list')">추가</button>
	    	</div>
	        
	        <div class="list-con">
      	        <ul id="hospitalList" class="scroll list-style"></ul>
	        </div>
	    </div>
	    
	    <div class="location col1">
   	    	<div class="tit-con">
	       		<p>병원위치</p>	       
   		        <button type="button" class="blue-btn basic" onclick="drawPopup('location')">추가</button>
	    	</div>
	    	 
           	<input type="hidden" id="hospitalCode">
	
			<div class="list-con">
				<ul id="officeList" class="scroll list-style"></ul>
			</div>
	    </div>
	    
	    <div class="info col2">
		   <div class="tit-con">
				<p>병원정보</p>	   
				<div class="btn-area">
				    <button type="button" class="white-btn basic-w" onclick="drawKeyPopup()">키 관리</button>	
			    	<button type="button" class="blue-btn basic" onclick="updateOffice()">저장</button>
				</div>    
		   </div>
	
	       <div class="inputs">
	       	   <form id="frm">
				   <div class="info-div">
					   <div>
         	   	            <label for="officeCode" class="need">병원코드</label>
			           		<input type="text" name="officeCode" id="officeCode" style="max-width:300px" disabled>
					   </div>
					   
					   <div>
							<label for="accessKey">앱 병원코드 (숫자 4자리)</label>
			           		<input type="text" name="accessKey" id="accessKey" style="max-width:300px" pattern="\d*" maxlength="4" oninput="this.value = this.value.replace(/[^0-9.]/gi, '')">
					   </div>
					   
					   <div>
			           		<label for="officeSite" class="need">홈페이지 주소</label>
			           		<input type="text" id="officeSite" name="officeSite" required>
					   </div>
				   </div>
	       	   
     	   	       <div class="account-div">
				   		<label class="need">계정 최대 허용</label>
				   		<div class="count-div">
			       		    <div>
							    <input type="radio" id="5-account" value="1" name="count">
							    <label for="5-account">5명</label>
						    </div>
						    
						    <div>
							    <input type="radio" id="10-account" value="2" name="count">
							    <label for="10-account">10명</label>
						    </div>
						    
						    <div>
							    <input type="radio" id="15-account" value="3" name="count">
							    <label for="15-account">15명</label>
						    </div>
						    
						    <div>
							    <input type="radio" id="99999-account" value="4" name="count">
							    <label for="99999-account">무제한</label>
						    </div>
				   		</div>
			       </div>
	       	   </form>
	       </div>
	    </div>
    </div>               
</div>

<script src="${sessionScope.path}/script/sys/sys001.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	getHospital();
</script>