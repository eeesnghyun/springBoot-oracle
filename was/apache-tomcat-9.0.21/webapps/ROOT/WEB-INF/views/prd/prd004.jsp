<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="/resources/plugins/grid/tabulator/tabulator_semanticui.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="${sessionScope.path}/style/prd/prd004.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<c:if test="${empty seq}">
	<div class="main-btn">
	    <button class="dark-btn preview-btn" type="button" onclick="preview()">화면 미리보기</button>
	    <button class="update-btn blue-btn" type="button" onclick="drawUpdatePopup()">최종 업데이트</button>
	</div>
</c:if>

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>전체 시술 확인</h2>
	        <p>변경된 전체 시술을 확인할 수 있습니다. 최종 업데이트를 진행해야 홈페이지에 반영됩니다.</p>
	    </div>
	    
	    <div class="btn-tit">
       	    <button class="update-alarm-btn dark-btn" type="button" onclick="popUpdateAlarm()">업데이트 알림</button>
	   		<button class="history-btn dark-btn" type="button" onclick="goHistory()">업데이트 기록</button>
	    </div>
	</div>
	
	<div class="col0">
		<div class="con">
  			<%-- 본사 관리자만 조회 --%>
 			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'showGrid')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select id="officeCode" class="small" name="officeCode" onchange="showGrid()"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		    </sec:authorize>
		    
		    <%-- 지점 관리자, 직원인 경우 조회 --%>
		    <sec:authorize access="hasRole('ROLE_ADMIN')">
		   		<div class="select-box">
		   			<label for="hospitalCode">병원</label>	   							
		   			<input type="text" value='<c:out value="${sessionScope.hospitalName}"/>' disabled="disabled">
		   			<input type="hidden" id="hospitalCode" name="hospitalCode">
		   		</div>
		   		
		   		<div class="select-box">		   			
		   			<input type="text" class="small" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
		   			<input type="hidden" id="officeCode" name="officeCode">
		   		</div>
		    </sec:authorize>		    
	    </div>
	    
	    <p id="homePageUrl" style="display:none"></p> 
	    
	    <div class="tab-tit">
   	    	<ul>
		    	<li class="active" data-type="event">이벤트 시술</li>
		    	<li data-type="price">일반 시술</li>
		    </ul>
	    </div>
	    	    
	    <%-- 이벤트 시술 --%>
	    <div class="tab-con event active">
	    	<%-- 이벤트 그룹 --%>
	    	<div class="prd">
	    		<label>이벤트 그룹 확인</label>	    		
	    	</div>
	    	
	    	<div id="eventGrid"></div>
	    	
	    	<%-- 이벤트 시술 --%>
	    	<div class="prd">
	    		<label>이벤트 시술 확인</label>	    		
	    	</div>
	    	
	    	<div class="sort-area">	    	
   				<label for="search">검색</label>	
		    	<div class="select-box">   	
	    			<c:choose>
	    				<c:when test="${empty seq}">
							<select id="event" onchange="getEventSubList()"></select>	
	    				</c:when>		    				
	    				<c:otherwise>
							<select id="event" onchange="getEventSubList('${seq}')"></select>	
	    				</c:otherwise>
	    			</c:choose>			
					<div class="icon-arrow"></div>
				</div>
				
		    	<div class="select-box">   	
	    			<c:choose>
	    				<c:when test="${empty seq}">
							<select id="eventSub" class="small" onchange="getUpdateEventItemList()"></select>	
	    				</c:when>		    				
	    				<c:otherwise>
	    					<select id="eventSub" class="small" onchange="getEventItemHistory('${seq}')"></select>	
	    				</c:otherwise>
	    			</c:choose>		
					<div class="icon-arrow"></div>
				</div>
				
			   	<div class="search-box">
			    	<input type="text" id="eventTitle" class="search" placeholder="이벤트 시술 검색"> 
		   			<div class="icon-search"></div>
			   	</div> 
		    </div>
		    		    
		    <div class="explan-area">
		    	<c:if test="${empty seq}">
   		    		<p class="highlight">새롭게 추가된 이벤트 시술 내역</p>
   		    	</c:if>
	    	</div> 		    
		    
	    	<div id="eventItemGrid"></div>
	    </div>
	    
	     <%-- 일반 시술 --%>
	    <div class="tab-con price">
	    	<div class="prd">
	    		<div class="prd-div">
		    		<label>일반 시술 확인</label>
		    		<div class="select-box">		    			
		    			<c:choose>
		    				<c:when test="${empty seq}">
		    					<select id="productMt" onchange="getProductList()"></select>	
		    				</c:when>		    				
		    				<c:otherwise>
		    					<select id="productMt" onchange="getProductList('${seq}')"></select>
		    				</c:otherwise>
		    			</c:choose>		    			
		    			<button class="arrow"></button>
		    		</div>
	    		</div>
	    		
	    		<div>
		    		<div class="sort-area">
	   					<label for="search">검색</label>	
				    	<div class="select-box">   			
   			    			<c:choose>
			    				<c:when test="${empty seq}">
			    					<select id="product" onchange="getProductSubList()"></select>	
			    				</c:when>		    				
			    				<c:otherwise>
			    					<select id="product" onchange="getProductSubList('${seq}')"></select>
			    				</c:otherwise>
			    			</c:choose>			
							<div class="icon-arrow"></div>
						</div>
						
				    	<div class="select-box">   		
   			    			<c:choose>
			    				<c:when test="${empty seq}">
			    					<select id="productSub" class="small" onchange="getUpdateProductItemList()">
			    						<option value=''>소분류 선택</option>
			    					</select>	
			    				</c:when>		    				
			    				<c:otherwise>
			    					<select id="productSub" class="small" onchange="getProductItemHistory('${seq}')">
			    						<option value=''>소분류 선택</option>
			    					</select>
			    				</c:otherwise>
			    			</c:choose>							
							<div class="icon-arrow"></div>
						</div>
						
					   	<div class="search-box">
					    	<input type="text" id="prdItemName" class="search" placeholder="일반 시술 검색"> 
				   			<div class="icon-search"></div>
					   	</div>  
				    </div>
	    		</div>
	    			    		
	  			<div class="explan-area">
	  				<c:if test="${empty seq}">
	   		    		<p class="highlight">새롭게 추가된 일반 시술 내역</p>
	   		    	</c:if>
		   		</div>	   		 	
	    	</div>	    			    
	    	
	    	<div id="prdGrid"></div>
	    </div>
	</div>
</div>

<script src="${sessionScope.path}/script/prd/prd004.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	if (isNullStr('<c:out value="${seq}"/>')) {
		initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');			
	} else {
		getHistory('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>', '<c:out value="${seq}"/>');		
	}	
</script>