<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/psh/psh001.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="/resources/plugins/grid/tabulator/tabulator_semanticui.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>푸시 발송 이력</h2>
	        <p>푸시를 발송한 이력과 등록된 푸시 예약 목록을 확인할 수 있습니다.</p>
	    </div>
	    
	    <div class="btn-tit">
       	    <button class="load-btn dark-btn" type="button" onclick="loadPushList()">불러오기</button>
	    </div>
	</div>
	
	<div class="main-btn">
	    <button class="save-btn blue-btn" type="button" onclick="openTestPushPopup()">발송하기</button>  
	</div>
	
	<%-- 기본 정보 --%>
	<div class="col0">
	    <div class="con">
  			<%-- 본사 관리자만 조회 --%>
 			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'reset')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select class="small" id="officeCode" name="officeCode" onchange="reset()"></select>
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
	
	<form id="pushForm">
		<input type="hidden" id="pushSeq">
		<div class="col">
			<div class="col1">		
				<div class="tit-bar">푸시 타겟 설정</div>
				<div class="contents">
					<div class="con psh">
						<label class="need">발송 타입</label>
						<div class="radio-box">
							<input type="radio" id="radio1" name="pushType" value="0" onclick="setPushType(this)" required checked="checked">
			            	<label for="radio1" class="btn-radio">즉시 발송</label>
			            	<input type="radio" id="radio2" name="pushType" value="1" onclick="setPushType(this)">
			            	<label for="radio2" class="btn-radio">예약 발송</label>
			            </div>
			            
			            <div class="select-area time"></div>
					</div>
					
					<div class="con psh last">						
						<label class="need">발송 대상</label>
						<input type="checkbox" class="chk" id="android" name="targetType" onclick="showSpecificBox('N')">
						
						<label for="android"></label>
						<label class="check" for="android">Android</label>						
						<input type="checkbox" class="chk" id="ios" name="targetType" onclick="showSpecificBox('N')">
						
						<label for="ios"></label>
						<label class="check" for="ios">iOS</label>
						<input type="checkbox" class="chk" id="specific" name="targetType" onclick="showSpecificBox('Y')">
						
						<label for="specific"></label>
						<label class="check" for="specific">특정 조건</label>
					</div>
					
					<div id="specificBox"></div>
					
					<div class="preview-box">
						<label class="need">총 예상 발송 대상</label>
						<span class="pre-user-num">0</span>
						<span>(발송 제외 대상은 예상 발송 대상에 미포함 됩니다.)</span>
					</div>	  		  	
				</div>
			</div>
			
			<div class="col2">
				<div class="tit-bar">푸시 메시지</div>
				<div class="contents">
					<div class="con">
					 	<label class="need">메세지 제목</label>
						<input type="text" class="push-tit" id="messageTitle" placeholder="메세지 제목을 입력해 주세요." required>
					</div>
					
					<div class="con">
						<label class="need psh-con">메세지 내용</label>
					 	<textarea class="push-content" id="messageContent" placeholder="메세지 내용을 입력해 주세요." required></textarea>
					</div>
					
			        <div class="con">
			       		<label class="add-img img-label-margin">이미지 추가</label>
			       		
			       		<div class="img-wrap">
				       		<label class="img-upload" for="upload" class="need">이미지 업로드</label>
				       		<div class="remove-wrap">
				       			<input type="file" id="upload" name="upload" accept="image/*" onchange="viewThumnail(this)" >
			       				<img id="pushImg" alt="이미지" style="display:none;">
			       				
			       				<div class="img-del">
		                        	<button type="button" class="img-del-btn" onclick="pushDelImage(this)">이미지 삭제</button>
		                    	</div>
		       				</div>	       		
			       		</div>
			        </div>
			        
			        <div class="con">
					 	<label class="need">연결 링크</label>
						<input type="text" class="push-url" id="pushLink" placeholder="연결할 링크를 입력해 주세요." required>
					</div>			
				</div>
			</div>
		</div>
	</form>
</div>

<script src="${sessionScope.path}/script/psh/psh001.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script src="${sessionScope.path}/script/psh/psh001Add.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>	