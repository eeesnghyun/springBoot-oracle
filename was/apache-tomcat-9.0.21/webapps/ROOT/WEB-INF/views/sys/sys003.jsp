<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
    
<link rel="stylesheet" href="${sessionScope.path}/style/sys/sys003.css" type="text/css"/>  

<div class="body-container">
    <div class="top">
        <div class="tit">
            <h2>의료법 문구 설정</h2>
            <p>의료법 위반에 해당하는 문구를 설정합니다.</p>
        </div>
    </div>
    
    <div class="col0">
     	<div class="con">						
   			<div class="select-box">
	   			<label for="hospitalCode">병원</label>	   							
	   			<select id="hospitalCode" onchange="commonGetOffice(this.value , 'getHospitalLaw')"></select>
	   			<div class="icon-arrow"></div>
	   		</div>
	   		
	   		<div class="select-box">
	   			<select id="officeCode" class="small" onchange="getHospitalLaw()"></select>
	   			<div class="icon-arrow"></div>
	   		</div>  
     	</div>
     </div>
     
     <div class="col1 col">
   	    <div class="tit-bar">의료법 문구 추가</div>
   	    	<div class="contents">
	        	<div class="con">
	            	<label for="text" class="need anno">문구 추가</label>
	            	<input type="text" id="text" placeholder="추가할 의료법 문구를 입력해 주세요.">
	            	
	            	<button class="add-btn-s border-btn" onclick="insertHospitalLaw()">추가하기</button>
	        	</div>
	        </div>
     </div>
     
     <div class="col2 col">
   	    <div class="tit-bar">추가된 의료법 문구</div>
    	<div class="contents">
        	<div class="con">
            	<label class="need anno">추가된 문구</label>
				<ul class="add-list">
				</ul>
        	</div>
        </div>
   	 </div>	
</div>

<script src="${sessionScope.path}/script/sys/sys003.js"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>