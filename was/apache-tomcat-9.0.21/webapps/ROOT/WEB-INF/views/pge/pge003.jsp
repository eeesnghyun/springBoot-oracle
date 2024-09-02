<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="/resources/plugins/swiper/swiper-bundle.min.css" type="text/css"/>
<link rel="stylesheet" href="${sessionScope.path}/style/pge/pge003.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<form id="frm" action="/pge/insertHomeMain" method="post" enctype="multipart/form-data" onsubmit="return checkData();">
	<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
	
	<div class="main-btn">
	    <button class="white-btn list-btn" type="button" onclick="listOrder()">순서변경</button>
	    <button class="save-btn blue-btn" type="button" onclick="checkSave()">저장하기</button>
	</div>
	
	<div class="body-container">
		<div class="top">
		    <div class="tit">
		        <h2>메인관리</h2>
		        <p>홈페이지 메인 화면을 관리 할 수 있습니다.</p>
		    </div>
				    
		    <%-- 본사 관리자만 조회 --%>
	   		<sec:authorize access="hasRole('ROLE_WWL')">
		    	<button class="load-btn dark-btn" type="button" onclick="drawPopup()">불러오기</button>
		    </sec:authorize>
		</div>
		
		<%-- 기본 정보 ---%>
		<div class="col0">
		    <div class="con">
	   			<%-- 본사 관리자만 조회 --%>
	   			<sec:authorize access="hasRole('ROLE_WWL')">
			   		<div class="select-box">
			   			<label for="hospitalCode">병원</label>	   							
			   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'getHomeMain')"></select>
			   			<div class="icon-arrow"></div>
			   		</div>
			   		
			   		<div class="select-box">
			   			<select id="officeCode" class="small" name="officeCode" class="small" onchange="getHomeMain()"></select>
			   			<div class="icon-arrow"></div>
			   		</div>
			    </sec:authorize>
			    
			    <%-- 지점 관리자, 직원인 경우 조회 --%>
			    <sec:authorize access="hasRole('ROLE_ADMIN')">
			   		<div class="select-box">
			   			<label for="hospitalCode">병원</label>	   							
			   			<input type="text" value='<c:out value="${sessionScope.hospitalName}"/>' disabled="disabled">
			   			<input type="hidden" id="hospitalCode">
			   		</div>
			   		
			   		<div class="select-box">		   			
			   			<input type="text" class="small" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
			   			<input type="hidden" id="officeCode">
			   		</div>
			    </sec:authorize>
		
		        <div class="page-address">
		            <p>홈페이지 주소</p>
		            <a class="page-url" id="homePageUrl"></a>
		        </div>
		    </div>
		</div>
		
		<%-- 메인 영역 ---%>
		<div class="col1 col">
		    <div class="tit-bar">메인 영역(PC)</div>
		
		    <div class="contents">
		        <div class="con">
		            <label class="need">메인 종류</label>
		            
		            <input id="chk2" type="radio" class="slide chk" name="mainType" onchange="selectMainType('col1' , 'slide')" value="slide" data-object/>
		            <label for="chk2" ></label>
		            <label for="chk2" class="check">슬라이드</label>
		            
		            <input id="chk1" type="radio" class="video chk" name="mainType" onchange="selectMainType('col1' , 'video')" value="video" data-object/>
		            <label for="chk1"></label>
		            <label for="chk1" class="check">동영상</label>
		        </div>
		
		        <%-- 영상업로드 --%>
		        <div class="video type active">
		        	<div class="inputs">
		        		<input type="text" class="span" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
			            <input type="text" class="h2" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>
			
		                <button class="line-btn" type="button">바로 예약하기</button>
			            
			            <div class="file-upload2">
			                <input type="file" id="upload2" name="mainFile" class="item-img" onchange="commonfileReader(this, 'video')" accept="video/*" data-object/>
			                
			            	<label for="upload2" class="vlabel">영상 업로드</label>		                		            	    				
			            </div>		            	           
		        	</div>	  

			   		<video style="width:100%; height:100%; object-fit:cover;" src="" autoplay muted="muted" data-object></video>	  
		        	<input type="hidden" name="mainVideo" class="require">
		        				   		
                    <div class="resolution">비디오해상도 (1900 x 810)</div>        
		        </div>
		
		        <%-- 슬라이드 이미지 업로드 --%>
		        <div class="swiper pcSwiper slide type">
		            <ul class="swiper-wrapper" id="pcOrder">
		                <li class="swiper-slide" data-object>
   		               	 	<i>1</i>
	                		               	 	
		                    <input type="text" class="span list-input" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
		                    <input type="text" class="h2 list-input" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>	
		                    
		                    <div class="url-area list-input">
		                    	<span>연결링크 : </span>
		                    	<input type="text" class="url" placeholder="바로 예약하기 URL을 입력하세요." name="url" data-object>
		                    </div>
		                    
		                 	<div class="file-btn-area list-input">
   			                    <div class="file-upload2">
			                        <input type="file" id="upload2" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" class="require" name="mainImage" data-object/>
			                        <label for="upload2" class="img">이미지 업로드</label>
			                    </div>
			                    
			                    <button type="button" class="file-del" onclick="delUploadFile(this)">이미지 삭제</button>
		                 	</div>
		                    
		                    <div class="resolution list-input">이미지해상도 (1900 x 810)</div>
		                </li>	<%-- 이미지1 --%>
			
		                <li class="swiper-slide" data-object>
   		               	 	<i>2</i>
   		               	 	
		                    <input type="text" class="span list-input" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
		                    <input type="text" class="h2 list-input" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>	
		                    
		                    <div class="url-area list-input">
		                    	<span>연결링크 : </span>
		                    	<input type="text" class="url" placeholder="바로 예약하기 URL을 입력하세요." name="url" data-object>
		                    </div>
		                 
		                 	<div class="file-btn-area list-input">
   			                    <div class="file-upload2">
			                        <input type="file" id="upload2" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="mainImage" data-object/>
			                        <label for="upload2" class="img">이미지 업로드</label>
			                    </div>
			                    
			                    <button type="button" class="file-del" onclick="delUploadFile(this)">이미지 삭제</button>
		                 	</div>
		                    
		                    <div class="resolution list-input">이미지해상도 (1900 x 810)</div>
		                </li>	<%-- 이미지2 --%>
		
		                <li class="swiper-slide" data-object>
   		               	 	<i>3</i>
   		               	 	
		                    <input type="text" class="span list-input" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
		                    <input type="text" class="h2 list-input" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>	
		                    
		                    <div class="url-area list-input">
		                    	<span>연결링크 : </span>
		                    	<input type="text" class="url" placeholder="바로 예약하기 URL을 입력하세요." name="url" data-object>
		                    </div>
		                    
		                 	<div class="file-btn-area list-input">
   			                    <div class="file-upload2">
			                        <input type="file" id="upload2" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="mainImage" data-object/>
			                        <label for="upload2" class="img">이미지 업로드</label>
			                    </div>
			                    
			                    <button type="button" class="file-del" onclick="delUploadFile(this)">이미지 삭제</button>
		                 	</div>
		                    
		                    <div class="resolution list-input">이미지해상도 (1900 x 810)</div>
		                </li>	<%-- 이미지3 --%>
		
		                <li class="swiper-slide" data-object>
   		               	 	<i>4</i>
   		               	 	
		                    <input type="text" class="span list-input" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
		                    <input type="text" class="h2 list-input" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>
		
		                    <div class="url-area list-input">
		                    	<span>연결링크 : </span>
		                    	<input type="text" class="url" placeholder="바로 예약하기 URL을 입력하세요." name="url" data-object>
		                    </div>
		                    
		                 	<div class="file-btn-area list-input">
   			                    <div class="file-upload2">
			                        <input type="file" id="upload2" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="mainImage" data-object/>
			                        <label for="upload2" class="img">이미지 업로드</label>
			                    </div>
			                    
			                    <button type="button" class="file-del" onclick="delUploadFile(this)">이미지 삭제</button>
		                 	</div>
		                    
		                    <div class="resolution list-input">이미지해상도 (1900 x 810)</div>
		                </li>	<%-- 이미지4 --%>
		
		                <li class="swiper-slide" data-object>
   		               	 	<i>5</i>
   		               	 	
		                    <input type="text" class="span list-input" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
		                    <input type="text" class="h2 list-input" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>
		
		                    <div class="url-area list-input">
		                    	<span>연결링크 : </span>
		                    	<input type="text" class="url" placeholder="바로 예약하기 URL을 입력하세요." name="url" data-object>
		                    </div>
		                    
		                 	<div class="file-btn-area list-input">
   			                    <div class="file-upload2">
			                        <input type="file" id="upload2" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="mainImage" data-object/>
			                        <label for="upload2" class="img">이미지 업로드</label>
			                    </div>
			                    
			                    <button type="button" class="file-del" onclick="delUploadFile(this)">이미지 삭제</button>
		                 	</div>
		                    
		                    <div class="resolution list-input">이미지해상도 (1900 x 810)</div>
		                </li>	<%-- 이미지5 --%>
	       			</ul>
	   				<div class="swiper-pagination"></div>
	       		</div>
	    	</div>
		</div>
		
		<div class="col5 col">
		    <div class="tit-bar">메인 영역(Mobile)</div>
		    
   		    <div class="contents">
		        <div class="con">
		            <label class="need">메인 종류</label>
		
		            <input id="chk3" type="radio" class="slide chk" name="mobileMainType" onchange="selectMainType('col5' , 'slide')" value="slide" data-object/>
		            <label for="chk3" ></label>
		            <label for="chk3" class="check">슬라이드</label>
		            
   		            <input id="chk4" type="radio" class="video chk" name="mobileMainType" onchange="selectMainType('col5' , 'video')" value="video" data-object/>
		            <label for="chk4" ></label>
		            <label for="chk4" class="check">동영상</label>
		        </div>
		        
   		        <%-- 영상업로드 --%>
		        <ul class="type video">
   		        	<li class="poster-area">
                 		<div class="file-btn-area list-input">
		                    <div class="file-upload2">
		                        <input type="file" id="upload2" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
		                        <input type="hidden" name="mVideoPoster" data-object/>	
		                                                
		                        <label for="upload2" class="ilabel">포스터 업로드</label>
		                    </div>
		                    
		                    <button type="button" class="file-del" onclick="delUploadFile(this)">포스터 삭제</button>
	                 	</div>
			   				        	
	                    <div class="resolution">포스터해상도 (1200 x 1200)</div>      
		        	</li>  
		        	
		        	<li class="video-area">
  			        	<div class="inputs">
			        		<input type="text" class="span list-input" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
				            <input type="text" class="h2 list-input" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>
				            
				            <div class="file-upload2">
				                <input type="file" id="upload2" name="mobileFile" class="item-img" onchange="commonfileReader(this, 'video')" accept="video/*" data-object/>
				                
				            	<label for="upload2" class="vlabel">영상 업로드</label>		                		            	    				
				            </div>		            	           
			        	</div>	  
			        	
				   		<video style="width:100%; height:100%; object-fit:cover;" src="" autoplay muted="muted" data-object></video>	  
			        	<input type="hidden" name="mMainVideo" class="require">
			   				        	
	                    <div class="resolution">비디오해상도 (1200 x 1200)</div>      
		        	</li>  
		        </ul>
		
		        <%-- 슬라이드 이미지 업로드 --%>
		        <div class="swiper mobileSwiper type slide active">
		            <ul class="swiper-wrapper" id="mobileOrder">
		                <li class="swiper-slide" data-object>
		               	 	<i>1</i>
		               	 	
		                    <input type="text" class="span list-input" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
		                    <input type="text" class="h2 list-input" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>	
		                    
		                    <div class="url-area list-input">
		                    	<span>연결링크 : </span>
		                    	<input type="text" class="url" placeholder="바로 예약하기 URL을 입력하세요." name="url" data-object>
		                    </div>
		                    
   		                 	<div class="file-btn-area list-input">
			                    <div class="file-upload2">
			                        <input type="file" id="upload2" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" class="require" name="mainImage" data-object required/>	                        
			                        <label for="upload2" class="ilabel">이미지 업로드</label>
			                    </div>
			                    
			                    <button type="button" class="file-del" onclick="delUploadFile(this)">이미지 삭제</button>
		                 	</div>
		                    
		                    <div class="resolution list-input">이미지해상도 (720 x 1000)</div>
		                </li>	<%-- 이미지1 --%>
			
		                <li class="swiper-slide" data-object>
	                		<i>2</i>
	                		
		                    <input type="text" class="span list-input" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
		                    <input type="text" class="h2 list-input" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>	
		                    
		                    <div class="url-area list-input">
		                    	<span>연결링크 : </span>
		                    	<input type="text" class="url" placeholder="바로 예약하기 URL을 입력하세요." name="url" data-object>
		                    </div>
		                 
   		                 	<div class="file-btn-area list-input">
			                    <div class="file-upload2">
			                        <input type="file" id="upload2" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="mainImage" data-object/>	                        
			                        <label for="upload2" class="ilabel">이미지 업로드</label>
			                    </div>
			                    
			                    <button type="button" class="file-del" onclick="delUploadFile(this)">이미지 삭제</button>
		                 	</div>
		                    
		                    <div class="resolution list-input">이미지해상도 (720 x 1000)</div>
		                </li>	<%-- 이미지2 --%>
		
		                <li class="swiper-slide" data-object>
               				<i>3</i>
               				
		                    <input type="text" class="span list-input" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
		                    <input type="text" class="h2 list-input" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>	
		                    
		                    <div class="url-area list-input">
		                    	<span>연결링크 : </span>
		                    	<input type="text" class="url" placeholder="바로 예약하기 URL을 입력하세요." name="url" data-object>
		                    </div>
		                    
   		                 	<div class="file-btn-area list-input">
			                    <div class="file-upload2">
			                        <input type="file" id="upload2" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="mainImage" data-object/>	                        
			                        <label for="upload2" class="ilabel">이미지 업로드</label>
			                    </div>
			                    
			                    <button type="button" class="file-del" onclick="delUploadFile(this)">이미지 삭제</button>
		                 	</div>
		                    
		                    <div class="resolution list-input">이미지해상도 (720 x 1000)</div>
		                </li>	<%-- 이미지3 --%>
		
		                <li class="swiper-slide" data-object>
		                	<i>4</i>
		                	
		                    <input type="text" class="span list-input" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
		                    <input type="text" class="h2 list-input" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>
		
		                    <div class="url-area list-input">
		                    	<span>연결링크 : </span>
		                    	<input type="text" class="url" placeholder="바로 예약하기 URL을 입력하세요." name="url" data-object>
		                    </div>
		                    
   		                 	<div class="file-btn-area list-input">
			                    <div class="file-upload2">
			                        <input type="file" id="upload2" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="mainImage" data-object/>	                        
			                        <label for="upload2" class="ilabel">이미지 업로드</label>
			                    </div>
			                    
			                    <button type="button" class="file-del" onclick="delUploadFile(this)">이미지 삭제</button>
		                 	</div>
		                    
		                    <div class="resolution list-input">이미지해상도 (720 x 1000)</div>
		                </li>	<%-- 이미지4 --%>
		
		                <li class="swiper-slide" data-object>
		                	<i>5</i>
		                		
		                    <input type="text" class="span list-input" name="content2" placeholder="서브타이틀을 입력해 주세요." data-object>
		                    <input type="text" class="h2 list-input" name="content1" placeholder="메인타이틀을 입력해 주세요." data-object>
		
		                    <div class="url-area list-input">
		                    	<span>연결링크 : </span>
		                    	<input type="text" class="url" placeholder="바로 예약하기 URL을 입력하세요." name="url" data-object>
		                    </div>
		                    
   		                 	<div class="file-btn-area list-input">
			                    <div class="file-upload2">
			                        <input type="file" id="upload2" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="mainImage" data-object/>	                        
			                        <label for="upload2" class="ilabel">이미지 업로드</label>
			                    </div>
			                    
			                    <button type="button" class="file-del" onclick="delUploadFile(this)">이미지 삭제</button>
		                 	</div>
		                    
		                    <div class="resolution list-input">이미지해상도 (720 x 1000)</div>
		                </li>	<%-- 이미지5 --%>
	       			</ul>
	       		</div>
		    </div>
		</div>
		
		<ul id="listOrder">
			<%-- 포스트 영역 --%>
			<li class="col2 col" id="post" data-seq="1">
				<input type="hidden" name="orderPost">
			    <div class="tit-bar t">
	        		포스트 영역
			        <div class="toggle toggle-knob">
			            <input type="checkbox" id="toggle-knob1" class="toggle-checkbox" onclick="commonToggle(this)" name="showPost" checked data-object>
			            <label class="toggle-btn" for="toggle-knob1">
			                <span class="toggle-feature" data-label-on="on"  data-label-off="off"></span>
			            </label>
			        </div>
			    </div>
			
			    <div class="contents list">
			        <div class="con write">
			            <div class="txt">
			                <input type="text" class="h4" name="title1Post" placeholder="메인타이틀을 입력해 주세요." data-object required>
			                <input type="text" class="span-desc" name="title2Post" placeholder="서브타이틀을 입력해 주세요." data-object required>
			            </div>
			        </div>
			
			        <ul class="item">
			            <li>
			                <div class="file-upload">
			                    <input type="file" id="upload" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                    <input type="hidden" name="postImage" data-object required/>
			                    <i class="icon"></i>
			                    
		                        <img src="" alt="이미지" style="display: none;" data-object>
		                        
		                        <div class="resolution">이미지해상도 (460 x 264)</div>
			                </div>
			                <div class="item-con">
			                    <input type="text" class="item-keywords" placeholder="#을 이용해서 태그를 사용해보세요" name="postTag" data-object required>
			                    <input type="text" class="item-tit" placeholder="제목을 입력하세요" name="postTitle" data-object required>
			                    <textarea class="item-desc scroll" placeholder="설명을 입력하세요." name="postContent" data-object></textarea>
			                    <div class="price-con">
			                        <span class="percent num">00</span>
			                        <div class="price">
			                            <input type="text" class="origin" placeholder="정상가를 입력하세요" onkeyup="calPercent(this)" name="postPrice1" data-object required>
			                            <input type="text" class="sale" placeholder="할인가를 입력하세요" onkeyup="calPercent(this)" name="postPrice2" data-object required>
			                        </div>
			                    </div>
			                    <input type="text" class="item-url" placeholder="링크를 입력하세요." name="postUrl" data-object required>
			                </div>
			            </li>
			            
			            <li>
			                <div class="file-upload">
			                    <input type="file" id="upload" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                    <input type="hidden" name="postImage" data-object required/>
			                    <i class="icon"></i>
			                    
		                        <img src="" alt="이미지" style="display: none;" data-object>
		                        
		                        <div class="resolution">이미지해상도 (460 x 264)</div>
			                </div>
			                <div class="item-con">
			                    <input type="text" class="item-keywords" placeholder="#을 이용해서 태그를 사용해보세요" name="postTag" data-object required>
			                    <input type="text" class="item-tit" placeholder="제목을 입력하세요" name="postTitle" data-object required>
			                    <textarea class="item-desc scroll" placeholder="설명을 입력하세요." name="postContent" data-object></textarea>
			                    <div class="price-con">
			                        <span class="percent num">00</span>
			                        <div class="price">
			                            <input type="text" class="origin" placeholder="정상가를 입력하세요" onkeyup="calPercent(this)" name="postPrice1" data-object required>
			                            <input type="text" class="sale" placeholder="할인가를 입력하세요" onkeyup="calPercent(this)" name="postPrice2" data-object required>
			                        </div>
			                    </div>
			                    <input type="text" class="item-url" placeholder="링크를 입력하세요." name="postUrl" data-object required>
			                </div>
			            </li>
			            
			            <li>
			                <div class="file-upload">
			                    <input type="file" id="upload" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                    <input type="hidden" name="postImage" data-object required/>
			                    <i class="icon"></i>
			                    
		                        <img src="" alt="이미지" style="display: none;" data-object>
		                        
		                        <div class="resolution">이미지해상도 (460 x 264)</div>
			                </div>
			                <div class="item-con">
			                    <input type="text" class="item-keywords" placeholder="#을 이용해서 태그를 사용해보세요" name="postTag" data-object required>
			                    <input type="text" class="item-tit" placeholder="제목을 입력하세요" name="postTitle" data-object required>
			                    <textarea class="item-desc scroll" placeholder="설명을 입력하세요." name="postContent" data-object></textarea>
			                    <div class="price-con">
			                        <span class="percent num">00</span>
			                        <div class="price">
			                            <input type="text" class="origin" placeholder="정상가를 입력하세요" onkeyup="calPercent(this)" name="postPrice1" data-object required>
			                            <input type="text" class="sale" placeholder="할인가를 입력하세요" onkeyup="calPercent(this)" name="postPrice2" data-object required>
			                        </div>
			                    </div>
			                    <input type="text" class="item-url" placeholder="링크를 입력하세요." name="postUrl" data-object required>
			                </div>
			            </li>
			            
			            <li>
			                <div class="file-upload">
			                    <input type="file" id="upload" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                    <input type="hidden" name="postImage" data-object required/>
			                    <i class="icon"></i>
			                    
		                        <img src="" alt="이미지" style="display: none;" data-object>
		                        
		                        <div class="resolution">이미지해상도 (460 x 264)</div>
			                </div>
			                <div class="item-con">
			                    <input type="text" class="item-keywords" placeholder="#을 이용해서 태그를 사용해보세요" name="postTag" data-object required>
			                    <input type="text" class="item-tit" placeholder="제목을 입력하세요" name="postTitle" data-object required>
			                    <textarea class="item-desc scroll" placeholder="설명을 입력하세요." name="postContent" data-object></textarea>
			                    <div class="price-con">
			                        <span class="percent num">00</span>
			                        <div class="price">
			                            <input type="text" class="origin" placeholder="정상가를 입력하세요" onkeyup="calPercent(this)" name="postPrice1" data-object required>
			                            <input type="text" class="sale" placeholder="할인가를 입력하세요" onkeyup="calPercent(this)" name="postPrice2" data-object required>
			                        </div>
			                    </div>
			                    <input type="text" class="item-url" placeholder="링크를 입력하세요." name="postUrl" data-object required>
			                </div>
			            </li>
			            
			            <li>
			                <div class="file-upload">
			                    <input type="file" id="upload" class="item-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                    <input type="hidden" name="postImage" data-object required/>
			                    <i class="icon"></i>
			                    
		                        <img src="" alt="이미지" style="display: none;" data-object>
		                        
		                        <div class="resolution">이미지해상도 (460 x 264)</div>
			                </div>
			                <div class="item-con">
			                    <input type="text" class="item-keywords" placeholder="#을 이용해서 태그를 사용해보세요" name="postTag" data-object required>
			                    <input type="text" class="item-tit" placeholder="제목을 입력하세요" name="postTitle" data-object required>
			                    <textarea class="item-desc scroll" placeholder="설명을 입력하세요." name="postContent" data-object></textarea>
			                    <div class="price-con">
			                        <span class="percent num">00</span>
			                        <div class="price">
			                            <input type="text" class="origin" placeholder="정상가를 입력하세요" onkeyup="calPercent(this)" name="postPrice1" data-object required>
			                            <input type="text" class="sale" placeholder="할인가를 입력하세요" onkeyup="calPercent(this)" name="postPrice2" data-object required>
			                        </div>
			                    </div>
			                    <input type="text" class="item-url" placeholder="링크를 입력하세요." name="postUrl" data-object required>
			                </div>
			            </li>
			        </ul>
			    </div>
			</li>
			
			<%-- 검색 영역 --%>
			<li class="col3 col" id="search" data-seq="2">
				<input type="hidden" name="orderSearch">
			    <div class="tit-bar t">
			                검색 영역
			        <div class="toggle toggle-knob">
			            <input type="checkbox" id="toggle-knob2" class="toggle-checkbox" onclick="commonToggle(this)" name="showSearch" checked data-object>
			            <label class="toggle-btn" for="toggle-knob2">
			                <span class="toggle-feature" data-label-on="on"  data-label-off="off"></span>
			            </label>
			        </div>
			    </div>
			
			    <div class="contents list">
			        <div class="con write">
			            <div class="txt">
			                <input type="text" class="p" name="searchContent1" placeholder="메인타이틀을 입력해 주세요." data-object required>
			                <input type="text" class="span-desc" name="searchContent2" placeholder="서브타이틀을 입력해 주세요." data-object required>
			            </div>
			        </div>
			    </div>
			</li>
			
			<%-- 탭 영역 --%>
			<li class="col4 col" id="tab" data-seq="3">
				<input type="hidden" name="orderTab">
			    <div class="tit-bar t">
			       	 탭(Tab) 영역
			        <div class="toggle toggle-knob">
			            <input type="checkbox" id="toggle-knob3" class="toggle-checkbox" onclick="commonToggle(this)" name="showTab" checked data-object>
			            <label class="toggle-btn" for="toggle-knob3">
			                <span class="toggle-feature" data-label-on="on"  data-label-off="off"></span>
			            </label>
			        </div>
			    </div>
			
			    <div class="contents list">
			        <div class="con write">
			            <div class="txt">
			                <input type="text" class="h4" name="title1Tab" placeholder="메인타이틀을 입력해 주세요." data-object required>
			                <input type="text" class="span-desc" name="title2Tab" placeholder="서브타이틀을 입력해 주세요." data-object required>
			            </div>
			        </div>
			
			        <div class="tab">
			            <%-- 탭 타이틀 --%>
			            <ul class="tab-tit">
			                <li class="active"><input type="text" name="tabType" placeholder="탭 타이틀" data-object required></li>
			                <li><input type="text" name="tabType" placeholder="탭 타이틀" data-object required></li>
			                <li><input type="text" name="tabType" placeholder="탭 타이틀" data-object required></li>
			                <li><input type="text" name="tabType" placeholder="탭 타이틀" data-object required></li>
			            </ul>
			
			            <%-- 탭 컨텐츠 --%>
			            <ul class="tab-con">
			                <li class="active">
			                    <div class="file-upload">
			                        <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="tabImage" data-object required/>
			                        <i class="icon"></i>
			                       
		                        	<img src="" alt="이미지" style="display: none;" data-object>
		                        	
                   			        <div class="resolution">이미지해상도 (1180 x 680)</div>
			                    </div>
			                    <div class="txt">
			                        <input type="text" class="tab-con-tit" placeholder="상품명을 입력해 주세요." name="tabTitle" data-object required>
			                        <textarea class="tab-con-desc scroll" placeholder="상세설명을 입력해 주세요." name="tabContent" data-object></textarea>
			                        <div class="price">
                			            <input type="text" class="sale" placeholder="할인가" onkeyup="calPercent(this)" name="tabPrice2" data-object required>
			                            <input type="text" class="origin" placeholder="정상가" onkeyup="calPercent(this)" name="tabPrice1" data-object required>
			                        </div>
			                        <input type="text" class="tab-con-btn" placeholder="버튼 텍스트를 입력해 주세요." name="tabUrlTitle" data-object required>
			                        <input type="text" class="tab-con-direct" placeholder="링크를 입력해 주세요." name="tabUrl" data-object required> 
			                    </div>
			                </li>
			
			                <li>
			                    <div class="file-upload">
			                        <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="tabImage" data-object required/>
			                        <i class="icon"></i>
			                       
		                        	<img src="" alt="이미지" style="display: none;" data-object>
		                        	
                   			        <div class="resolution">이미지해상도 (1180 x 680)</div>
			                    </div>
			                    <div class="txt">
			                        <input type="text" class="tab-con-tit" placeholder="상품명을 입력해 주세요." name="tabTitle" data-object required>
			                        <textarea class="tab-con-desc scroll" placeholder="상세설명을 입력해 주세요." name="tabContent" data-object></textarea>
			                        <div class="price">
			                            <input type="text" class="sale" placeholder="할인가" onkeyup="calPercent(this)" name="tabPrice2" data-object required>
                       			        <input type="text" class="origin" placeholder="정상가" onkeyup="calPercent(this)" name="tabPrice1" data-object required>
			                        </div>
			                        <input type="text" class="tab-con-btn" placeholder="버튼 텍스트를 입력해 주세요." name="tabUrlTitle" data-object required>
			                        <input type="text" class="tab-con-direct" placeholder="링크를 입력해 주세요." name="tabUrl" data-object required> 
			                    </div>
			                </li>
			
			                <li>
			                    <div class="file-upload">
			                        <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="tabImage" data-object required/>
			                        <i class="icon"></i>
			                       
		                        	<img src="" alt="이미지" style="display: none;" data-object>
		                        	
                   			        <div class="resolution">이미지해상도 (1180 x 680)</div>
			                    </div>
			                    <div class="txt">
			                        <input type="text" class="tab-con-tit" placeholder="상품명을 입력해 주세요." name="tabTitle" data-object required>
			                        <textarea class="tab-con-desc scroll" placeholder="상세설명을 입력해 주세요." name="tabContent" data-object></textarea>
			                        <div class="price">
			                            <input type="text" class="sale" placeholder="할인가" onkeyup="calPercent(this)" name="tabPrice2" data-object required>
                        			    <input type="text" class="origin" placeholder="정상가" onkeyup="calPercent(this)" name="tabPrice1" data-object required>
			                        </div>
			                        <input type="text" class="tab-con-btn" placeholder="버튼 텍스트를 입력해 주세요." name="tabUrlTitle" data-object required>
			                        <input type="text" class="tab-con-direct" placeholder="링크를 입력해 주세요." name="tabUrl" data-object required> 
			                    </div>
			                </li>
			
			                <li>
			                    <div class="file-upload">
			                        <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
			                        <input type="hidden" name="tabImage" data-object required/>
			                        <i class="icon"></i>
			                       
		                        	<img src="" alt="이미지" style="display: none;" data-object>
		                        	
                   			        <div class="resolution">이미지해상도 (1180 x 680)</div>
			                    </div>
			                    <div class="txt">
			                        <input type="text" class="tab-con-tit" placeholder="상품명을 입력해 주세요." name="tabTitle" data-object required>
			                        <textarea class="tab-con-desc scroll" placeholder="상세설명을 입력해 주세요." name="tabContent" data-object></textarea>
			                        <div class="price">
			                            <input type="text" class="sale" placeholder="할인가" onkeyup="calPercent(this)" name="tabPrice2" data-object required>
                           			    <input type="text" class="origin" placeholder="정상가" onkeyup="calPercent(this)" name="tabPrice1" data-object required>
			                        </div>
			                        <input type="text" class="tab-con-btn" placeholder="버튼 텍스트를 입력해 주세요." name="tabUrlTitle" data-object required>
			                        <input type="text" class="tab-con-direct" placeholder="링크를 입력해 주세요." name="tabUrl" data-object required> 
			                    </div>
			                </li>
			            </ul>
			        </div>
			    </div>
			</li>
		</ul>
	</div>
</form>

<script src="/resources/plugins/swiper/swiper-bundle.min.js"></script>
<script src="/resources/plugins/sortable/Sortable.min.js"></script>
<script src="${sessionScope.path}/script/pge/pge003.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script> 	
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
	tabSlider();
</script>

