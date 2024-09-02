<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/mbr/mbr002.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>회원 등급 설정</h2>
	        <p>회원의 대한 등급 기준을 설정할 수 있습니다.</p>
        </div>
    </div>

	<div class="col0 grade-page">
	    <div class="con qna">
	  		<%-- 본사 관리자만 조회 --%>
   			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospital">병원</label>	   							
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'getGradeList')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select id="officeCode" class="small" name="officeCode" onchange="getGradeList()"></select> 
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
		   			<input type="text" class="small" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
		   			<input type="hidden" id="officeCode" name="officeCode">
		   		</div>
		    </sec:authorize>		    
	    </div>
	</div>
	
    <div class="grade-area">
        <div class="grade-list-box">
            <div class="con-title">
                회원 등급
                <button type="button" onclick="drawPopup('add');">추가</button>
            </div>
            <div class="list-wrap scroll"></div>
        </div>
        
        <div class="grade-set-box">
        	<form class="grade-set-form">
	            <div class="con-title">
	                <span>회원 등급 세부 설정</span>
	                <button type="button" onclick="drawPopup('save');">저장</button>
	            </div>
				
				<div>	
		            <div class="total">현재 '<span id="gradeName"></span>' 등급 회원: <span id="gradeCnt"></span>명</div>
		            <div class="set-wrap">
		                <div>
		                    <label class="need">등급 이름</label>
		                    <input type="text" class="user-grade" onkeyup="gradePreview();" placeholder="회원 등급명" required>
		                    <input type="hidden" class="grade-code">
		                </div>
		                
		                <div>
		                    <label class="need">등급 표시</label>
		                    <input type="text" class="grade-name" maxlength="2" onkeyup="gradePreview();" placeholder="최대 2글자" required>
		                    <div class="color-picker">	
			                    <input type="text" class="grade-color" placeholder="배경색" required>
			                    <input type="color" class="color-input" placeholder="색상" onchange="colorPicker(this)">
		                    </div>
		                </div>
		                
		                 <div>
		                    <label class="need">미리 보기</label>
		                    <div class="icon-preview"></div>
		                </div>
		                
		                <div style="margin-top:20px;">
		                    <label class="need">결제 금액</label>
		                    <input type="text" class="total-price" placeholder="0" onkeyup="commonMoneyFormat(this.value , this)" required>
		                    <span style="margin-left:10px;"><b>원</b>&nbsp;이상인 회원</span>
		                </div>
		                
		                <div>
		                	<label class="need">의료진</label>
		                	<span class="check-fixed">
			                	<input type="checkbox" class="medical-fixed chk" id="medicalFixed">
			                    <label for="medicalFixed"></label>
			                    <label for="medicalFixed" class="check">의료진 지정이 있을 경우</label>
			                </span>
		                </div>
		            </div> 
	            </div>
            </form>
        </div>
    </div>
</div>

<script src="${sessionScope.path}/script/mbr/mbr002.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>