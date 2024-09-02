<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="/resources/plugins/editor/spectrum.min.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="${sessionScope.path}/style/prd/prd001Edit.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<input type="hidden" id="prdCode" value="<c:out value="${param.code}"/>"/>
<input type="hidden" id="prdSubCode" value="<c:out value="${param.sub}"/>"/>
<input type="hidden" id="detailList"/>

<div class="main-btn">
	<button class="white-btn list-btn" type="button" onclick="popListOrder()">순서변경</button>
	<button class="save-btn blue-btn" type="button" onclick="drawPopup()">일반 시술 추가</button>
</div>

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>상세 페이지 설정</h2>
	        <p>상세 페이지에 내용을 설정할 수 있습니다.</p>
	    </div>
	    
   	    <div class="btn-tit">
       	    <button class="add-mts-btn dark-btn" type="button" onclick="popDetailList()">상세 노출 순서</button>
	    </div>
	</div>
	
    <%-- 기본 정보 --%>
	<div class="col0">
	    <div class="con">
  			<%-- 본사 관리자만 조회 --%>
 			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<input type="text" id="hospitalName" disabled="disabled">
		   			<input type="hidden" id="hospitalCode" name="hospitalCode" value='<c:out value="${sessionScope.hospitalCode}"/>'>
		   		</div>
		   		
		   		<div class="select-box">		   			
		   			<input type="text" class="small" id="officeLocation" disabled="disabled">
		   			<input type="hidden" id="officeCode" name="officeCode" value='<c:out value="${sessionScope.officeCode}"/>'>
		   		</div>
		    </sec:authorize>
		    
		    <%-- 지점 관리자, 직원인 경우 조회 --%>
		    <sec:authorize access="hasRole('ROLE_ADMIN')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<input type="text" id="hospitalName" value='<c:out value="${sessionScope.hospitalName}"/>' disabled="disabled">
		   			<input type="hidden" id="hospitalCode" name="hospitalCode">
		   		</div>
		   		
		   		<div class="select-box">		   			
		   			<input type="text" class="small" id="officeLocation" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
		   			<input type="hidden" id="officeCode" name="officeCode">
		   		</div>
		    </sec:authorize>
	
	        <div class="page-address">
	            <p>홈페이지 주소</p>
	            <a class="page-url"></a>
	        </div>
	    </div>
	</div>
	
    <div class="col1 col">
	    <div class="tit-bar">시술 설정</div>
	
	    <%-- 중분류메뉴 --%>
	    <div class="prd-area">
	        <ul class="prd"></ul>
	    </div>
	
        <div class="left">
	        <%-- 기본 정보 --%>
	        <form id="frm1" onsubmit="return false">
       	        <div class="step step1">
	            	<input type="text" class="main-tit" id="prdSubName" placeholder="소분류(상세 페이지)를 입력해 주세요." required>
		            <textarea placeholder="설명을 입력해 주세요." id="prdSubContent" class="scroll" required></textarea>
		            <input type="text" placeholder="최소 가격(미 입력 시 자동으로 측정됩니다.)" id="prdSubPrice" onkeyup="commonMoneyFormat(this.value , this)">
		
		            <button type="button" class="save-detail border-btn" onclick="insertProductSurgicalSub()">상단 저장하기</button>
		        </div>
	        </form>

	         <%-- 메인 이미지/영상 정보 --%>
	         <form id="frm2" onsubmit="return false">
       	         <div class="step step2">
		             <div class="type">
		                 <div class="con"> 
		                     <input id="chk1" class="chk" data-state='1' type="radio" name="check" value="video" onclick="checkToggle(1)"/>
		                     <label for="chk1"></label>
		                     <label for="chk1" class="check">영상</label>
		
		                     <input id="chk2" class="chk" data-state='2' type="radio" name="check" value="img" onclick="checkToggle(2)"/>
		                     <label for="chk2" ></label>
		                     <label for="chk2" class="check">이미지</label>
		                 </div>
		                 
		                 <ul class="tab-con">
		                 	<li class="video active">
   		                 		<input type="text" placeholder="영상 링크를 입력해 주세요." id="prdSubVideo">		                 	
		                 	</li>
		                 	
		                 	<li class="img">
		                        <div class="file-upload">
	                            <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" data-object/> 
		                            <input type="hidden" id="prdSubImage" data-object/>
		                            <i class="icon"></i>
		
		                            <img src="" alt="이미지" style="display:none;" data-object>
		                            
                                    <div class="resolution">이미지해상도 (1400 x 800)</div>	
		                        </div>
		
		                        <div class="img-del">
		                            <button type="button" class="img-del-btn" onclick="delImage(this)">이미지 삭제</button>
		                        </div>
		                 	</li>
		                 </ul>
		             </div>
		
		             <button type="button" class="save-detail border-btn" onclick="updateProductSurgicalSub()">저장하기</button>
	         	</div>
	         </form>

	        <%-- 상세 정보 --%>
	        <div class="step step3">
	            <%-- 상세정보 탭영역 --%>
	            <ul class="detail-add"></ul>
	
	            <%-- 에디터영역 --%>
	            <div class="con">
	                <div class="tit-area"><p class="con-tit"></p><span>시술안내</span></div>
	
	                <%-- 에디터 버튼 영역 --%>
	                <div id="toolbar" class="row">
	                    <div class="tags buttons"></div>
	                </div>
	
	                <%-- 시술안내 --%>
	                <div class="editor" data-type="A">
	                    <div class="scroll con-content subject" contentEditable="true" placeholder="시술안내를 입력해 주세요."></div>
	                </div>
	
	                <%-- 시술추천 --%>
	                <div class="editor" id="listOrderB" data-type="B">
	                    <div class="reco subject">
	                        <p class="eng tag">point <span>01</span>.</p>
	                        <div class="con-content" contentEditable="true" placeholder="시술추천을 입력해 주세요."></div>
	                        <button class="add-history" value="true" onclick="addList(this)">+</button>
	                    </div>
	                </div>
	
	                <%-- 시술과정 --%>
	                <div class="editor" id="listOrderC" data-type="C">
	                    <div class="reco subject">
	                        <p class="eng tag">step <span>01</span>.</p>
	                        <div class="con-content" contentEditable="true" placeholder="시술과정을 입력해 주세요."></div>
	                        <button class="add-history" value="true" onclick="addList(this)">+</button>
	                    </div>
	                </div>
	
	                <%-- 효과&주기 --%>
	                <div class="editor" id="listOrderD" data-type="D">
	                    <div class="reco subject">
	                        <p class="eng tag"><span>01</span>.</p>
	                        <div class="con-content" contentEditable="true" placeholder="시술효과&시술주기를 입력해 주세요."></div>
	                        <button class="add-history" value="true" onclick="addList(this)">+</button>
	                    </div>
	                </div>
	
	                <%-- QnA --%>
	                <div class="editor" id="listOrderE" data-type="E">
	                    <div class="qna-ul subject">
	                        <div class="q-area">
	                            <label>Q :</label>
	                            <div class="q-desc con-content" contentEditable="true" placeholder="질문을 입력해 주세요."></div>
	                        </div>
	
	                        <div class="a-area">
	                            <label>A :</label>
	                            <div class="a-desc con-content scroll" contentEditable="true" placeholder="답변을 입력해 주세요."></div>
	                        </div>
	                        
                    	    <button class="add-history" value="true" onclick="addList(this)">+</button>
	                    </div>
	                </div>
	
	                <%-- 주의사항 --%>
	                <div class="editor" id="listOrderF" data-type="F">
	                    <div class="caution subject">
	                        <span>-</span>
	                        <div class="con-content" contentEditable="true" placeholder="주의사항을 입력해 주세요."></div>
	                        <button class="add-history" value="true" onclick="addList(this)">+</button>
	                    </div>
	                </div>
	
	                <%-- 이미지 --%>
	                <div class="editor" data-type="G">
	                    <div class="img subject">
	                        <div class="file-upload">
	                            <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')"/>
	                            <input type="hidden" id="detailImg" class="con-content"/>
	                            <i class="icon"></i>
	
	                            <img style="display: none;">
	                        </div>
	                    </div>
	                </div>
	                
	                <%--맞춤시술--%>
	                <div class="editor" data-type="H">
						<ul class="together-ul" id="listOrderH" data-type="H">
							<li class="add-together-pro">
								<button type="button" class="write" onclick="addTogetherList()"></button>
							</li>
						</ul>
	                </div>
	            </div>
	
				<div class="btn-section">
	            	<button type="button" class="get-detail border-btn" onclick="commonDrawPopup('load', '/prd/prd001EditPopup');">내용 불러오기</button>
	            	<button type="button" class="save-detail border-btn" onclick="insertProductSurgicalSubDt()">내용 추가하기</button>
				</div>
	        </div>

            <%-- 추가된 상세 --%>
            <div class="step4 detail-con"></div>
      </div>
    
    	<div class="right">
	        <div class="right-area">
      	        <%-- 이벤트 시술 --%>
	            <ul class="event"></ul>
	
	          	<%-- 일반 시술 --%>
	            <ul class="normal"></ul>
	        </div>
	    </div>
    </div>
</div>

<script src="/resources/plugins/sortable/Sortable.min.js"></script>
<script src="/resources/plugins/editor/spectrum.min.js"></script>
<script src="/resources/plugins/editor/editor.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script src="${sessionScope.path}/script/prd/prd001Edit.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	init();

	editorInit(); //에디터
</script>