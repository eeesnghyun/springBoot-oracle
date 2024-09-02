<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/pge/pge002.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>팝업 관리</h2>
	        <p>홈페이지에 노출할 팝업을 관리할 수있습니다.</p>
	    </div>
	</div>
	
	<div class="pge-area">
		<div class="main-btn">
			<button class="cancel-btn white-btn" type="button" onclick="commonGoPage('/pge/pge002');">취소하기</button>
		    <button class="save-btn blue-btn" type="button" onclick="checkSave()">저장하기</button>  
		</div>
		
		<form id="frm" action="/pge/insertHomePopup" method="post">
			<input type="hidden" name="seq" value="<c:out value='${seq}'/>">
			
			<div class="pge02">	 		
				<div class="col1">
				    <div class="tit-bar">팝업 정보</div>
				    <div class="contents">
				    	<div class="con">
					  		<%-- 본사 관리자만 조회 --%>
				   			<sec:authorize access="hasRole('ROLE_WWL')">
				   				<c:choose>
						         	<c:when test="${null eq seq}">	<%-- 신규 입력 --%>
						            	<div class="select-box">
								   			<label for="hospitalCode" class="need hos">병원</label>	   							
								   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'getOfficeSite')"></select>
								   			<div class="icon-arrow"></div>
								   		</div>
								   		
								   		<div class="select-box">
								   			<select id="officeCode" name="officeCode" onchange="getOfficeSite()"></select>
								   			<div class="icon-arrow"></div>
								   		</div>				            	
						         	</c:when>         
						         	<c:otherwise>					<%-- 수정 모드 --%>
						            	<div class="select-box">
								   			<label for="hospitalCode" class="need hos">병원</label>	   							
								   			<input type="text" class="sel-hos" value='<c:out value="${hospitalName}"/>' disabled="disabled">
						   					<input type="hidden" id="hospitalCode" name="hospitalCode" value='<c:out value="${hospitalCode}"/>'>
								   		</div>
								   		
								   		<div class="select-box">
								   			<input type="text" class="sel-hos" value='<c:out value="${officeLocation}"/>' disabled="disabled">
						   					<input type="hidden" id="officeCode" name="officeCode" value='<c:out value="${officeCode}"/>'>
								   		</div>
						        	</c:otherwise>
						      	</c:choose>				   		
						    </sec:authorize>
						    
						    <%-- 병원 관계자인 경우 조회 --%>
						    <sec:authorize access="hasRole('ROLE_ADMIN')">
						   		<div class="select-box">
						   			<label for="hospitalCode" class="need hos">병원</label>	   							
						   			<input type="text" value='<c:out value="${sessionScope.hospitalName}"/>' disabled="disabled">
						   			<input type="hidden" id="hospitalCode" name="hospitalCode">		   		
						   		</div>		
						   		
						   		<div class="select-box">		   			
						   			<input type="text" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
									<input type="hidden" id="officeCode" name="officeCode">	
						   		</div>
						    </sec:authorize>
						    
						    <p id="homePageUrl" style="display:none"></p>
						</div>
						    	        
				        <div class="con">
				            <label for="popTitle" class="need" style="flex-start">팝업 제목</label>
				            <input type="text" class="big" id="popTitle" name="popTitle" placeholder="제목을 입력해 주세요." onkeyup="setPopEventRightContent();" required>
				        </div>
				
				        <div class="con">
				            <label for="number" class="need">타입</label>
			 			   	<div class="select-box">			 			   								         	
					        	<select id="popType" name="popType" onchange="typeChange(this.value);" required></select>
			   					<div class="icon-arrow"></div>						         						   				
				   			</div>
				        </div>
				        
						<div class="basic-con order">
				        </div>
				
				        <div class="con">
				            <label for="show" class="need">노출</label>
					   		<div class="select-box">
				   				<select name="displayYn" required>
				   					<option value="Y">노출</option>
				   					<option value="N">미노출</option>
				   				</select>
				   				<div class="icon-arrow"></div>
				   			</div>
				        </div>
				        
				        <div class="con term">
			            	<label for="startDate" class="need">게시일</label>
					        <div class="con date">
				       			<input type="text" class="start-date" id="startDate" name="startDate" placeholder="시작일" required autocomplete="off">
					        </div>
				       		<span class="wave">~</span>
				        	<div class="con date">
				       			<input type="text" class="end-date" id="endDate" name="endDate" placeholder="종료일" required autocomplete="off">
					        </div>
						</div>
				        
				        <div class="basic-con img" style="display:none;">
					        <div class="con">
					       		<label class="need img-label-margin">팝업 내용</label>
					       		<div class="img-wrap">
						       		<label class="img-upload" for="upload" class="need">이미지 업로드</label>
						       		<input type="file" id="upload" onchange="popupFileReader(this)" accept="image/*" >
						       		<input type="hidden" id="basicImg" name="popImage" required>
						       		
						       		<img id="popupImg" src="" alt="이미지" style="display:none;">
						       		<div class="resolution">이미지해상도 (800 x 800)</div>
					       		</div>
					        </div>
					        
					        <div class="con" style="align-items:baseline;">
					            <label for="popUpUrl" class="URL">연결링크</label>
					            <div class="con-wrap">
					            <input type="text" class="url-input" id="popUpUrl" name="popUrl" placeholder="연결할 링크를 입력해 주세요.">
					            	<div class="app-link-chk">
					            		<input type="checkbox" class="chk" id="appLink" name="linkYn" onclick="checkAppLink(this)">
					            		<label for="appLink"></label>
					            		<label for="appLink" class="check">뷰티올 다운로드 링크로 연결</label> 
					            	</div>
					            </div>
					        </div>
				        </div>
				        
				        <div id="selectDiv"></div>		        	        
				    </div>
				</div>
			</div>
		</form>
	</div>
</div>

<script src="${sessionScope.path}/script/pge/pge002Add.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${hospitalCode}"/>', '<c:out value="${officeCode}"/>');	
</script>