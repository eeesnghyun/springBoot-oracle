<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/pge/pge001.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<form id="frm" action="/pge/updateHomepage" method="post">
	<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
	
	<div class="main-btn">
	    <button class="save-btn blue-btn" type="button" onclick="homeSave()">저장하기</button>
	</div>	    
	    
	<div class="body-container">
		<div class="top">
		    <div class="tit">
		        <h2>기본 설정</h2>
		        <p>홈페이지에서 필요한 기본 설정을 입력합니다.</p>
		    </div>
		</div>
		
		<%-- 기본 정보 --%>
		<div class="col0">
		    <div class="con">
	   			<sec:authorize access="hasRole('ROLE_WWL')">
			   		<div class="select-box">
			   			<label for="hospital">병원</label>	   							
			   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'getHomepage')"></select>
			   			<div class="icon-arrow"></div>
			   		</div>
			   		
			   		<div class="select-box">
			   			<select id="officeCode" name="officeCode" class="small" onchange="getHomepage()"></select> 
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
		
		        <div class="page-address">
		            <p>홈페이지 주소</p>
		            <a class="page-url"></a>
		        </div>
		    </div>
		
		    <div class="con">
		        <div class="files">
		            <div class="h-logo">
		                <div class="tit-bar">상단 로고 (LOGO)</div>
		                <div class="file-upload">
		                    <input type="file" id="upload" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
	                        <input type="hidden" name="logoTop" required data-object/>
		                    <i class="icon"></i>
		                    
	                        <img src="" alt="이미지" style="display: none;" data-object>
	                        
                            <div class="resolution">이미지해상도 (auto x 108)</div>	
		                </div>
		            </div>
		
		            <div class="f-logo">
		                <div class="tit-bar">하단 로고 (LOGO)</div>
		                <div class="file-upload">
		                    <input type="file" id="upload" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
		                    <input type="hidden" name="logoBottom" required data-object/>
		                    <i class="icon"></i>
		                    
	                        <img src="" alt="이미지" style="display: none;" data-object>
	                        
                            <div class="resolution">이미지해상도 (auto x 30)</div>	
		                </div>
		            </div>
		            
   		            <div class="o-logo">
		                <div class="tit-bar">오픈 그래프 (Open Graph)</div>
		                <div class="file-upload">
		                    <input type="file" id="logoOpenGraph" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
		                    <input type="hidden" name="logoOpenGraph" required data-object/>
		                    <i class="icon"></i>
		                    
	                        <img src="" alt="이미지" style="display: none;" data-object>
	                        
                            <div class="resolution">이미지해상도 (1200 x 635)</div>	
		                </div>
		            </div>
		            
   		            <div class="i-logo">
		                <div class="tit-bar">파비콘 (Favicon)</div>
		                <div class="file-upload">
		                    <input type="file" id="logoFavicon" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
		                    <input type="hidden" name="logoFavicon" required data-object/>
		                    <i class="icon"></i>
		                    
	                        <img src="" alt="이미지" style="display: none;" data-object>
	                        
                            <div class="resolution">이미지해상도 (90 x 90)</div>	
		                </div>
		            </div>
		        </div>
		    </div>
		</div>
			
		<%-- 홈페이지 색상 정보 --%>
		<div class="col1 col">
		    <div class="tit-bar">홈페이지 색상 정보</div>
		    <div class="contents">
		        <div class="con">
		            <label for="color" class="need anno">메인 색상</label>
		            <div class="color-picker">
		                <input type="text" id="siteColor" name="siteColor" placeholder="색상" data-object required>
		                <input type="color" class="color-input" placeholder="색상" onchange="colorPicker(this)">
		            </div>
		        </div>
		        
   		        <div class="con">
		            <label for="color" class="need anno">서브 색상</label>
		            <div class="color-picker">
		                <input type="text" id="siteSubColor" name="siteSubColor" placeholder="색상" data-object required>
		                <input type="color" class="color-input" placeholder="색상" onchange="colorPicker(this)">
		            </div>
		        </div>
		        
   		        <div class="con">
		            <label for="color" class="need anno">그라데이션</label>
		            <div class="color-picker">
		                <input type="text" id="siteGrdColor" name="siteGrdColor" placeholder="색상" data-object required>
		                <input type="color" class="color-input" placeholder="색상" onchange="colorPicker(this)">
		            </div>
		        </div>
		    </div>
		</div>
		
		<%-- 병원 정보 --%>
		<div class="col3 col">
		    <div class="tit-bar">병원 정보</div>
		    <div class="contents">
   		        <div class="con">
		            <label for="intro" class="need anno">홈페이지 소개</label>
		            <input type="text" class="big" id="intro" name="siteIntro" placeholder="홈페이지 소개 문구를 입력해 주세요." data-object required>
		        </div>
		        
		        <div class="con">
		            <label for="kakao" class="need anno">카카오</label>
		            <input type="text" id="kakao" name="kakaoName" placeholder="카카오명을 입력해 주세요." data-object required>
		        </div>
		
		        <div class="con">
		            <label for="kakaoURL" class="need anno">카카오URL</label>
		            <input type="text" class="big" id="kakaoURL" name="kakaoUrl" placeholder="카카오명을 입력해 주세요." data-object required>
		        </div>
		
		        <div class="con">
		            <label for="time" class="need anno">진료시간</label>
		            <div class="big inputs">
		                <input type="text" name="clinicDay01" placeholder="ex)  평일" data-object required>
		                <input type="text" name="clinicTime01" placeholder="ex)  AM 10:30 - PM 08:30" data-object required>
		
		                <input type="text" name="clinicDay02" placeholder="ex)  토요일" data-object required>
		                <input type="text" name="clinicTime02" placeholder="ex)  AM 10:30 - PM 04:30" data-object required>
		
		                <input type="text" name="clinicDay03" placeholder="ex)  일요일" data-object required>
		                <input type="text" name="clinicTime03" placeholder="ex)  AM 10:30 - PM 04:30" data-object required>
		            </div>
		        </div>
		
		        <div class="con">
		            <label for="naverMap" class="no-need anno">네이버 지도</label>
		            <input type="text" class="big" id="naverMap" name="mapNaver" placeholder="네이버 지도 URL을 입력해 주세요." data-object>
		        </div>
		
		        <div class="con">
		            <label for="kakaoMap" class="no-need anno">카카오 지도</label>
		            <input type="text" class="big" id="kakaoMap" name="mapKakao" placeholder="카카오 지도 URL을 입력해 주세요." data-object>
		        </div>
		
		        <div class="con">
		            <label for="googleMap" class="no-need anno">구글 지도</label>
		            <input type="text" class="big" id="googleMap" name="mapGoogle" placeholder="구글 지도 URL을 입력해 주세요." data-object>
		        </div>
		    </div>
		</div>
			
		<%-- 사업자정보 --%>
		<div class="col2 col">
		    <div class="tit-bar">사업자 정보</div>
		    <div class="contents">
		        <div class="con">
		            <label for="storeName" class="need anno">상호명</label>
		            <input type="text" id="storeName" name="officeName" placeholder="상호명을 입력해 주세요." data-object required>
		        </div>
		
		        <div class="con">
		            <label for="owner" class="need anno">대표</label>
		            <input type="text" id="owner" name="officeOwner" placeholder="대표를 입력해 주세요." data-object required>
		        </div>
		
		        <div class="con">
		            <label for="number" class="need anno">대표번호</label>
		            <input type="text" id="number" name="officePhone" placeholder="대표번호를 입력해 주세요." data-object required>
		        </div>
		
		        <div class="con">
		            <label for="busiNum" class="need anno">사업자번호</label>
		            <input type="text" id="busiNum" name="businessNum" placeholder="사업자번호를 입력해 주세요." onkeyup="characterCheck(this.value , this)" maxlength="12" data-object required>
		        </div>
		
		        <div class="con">
		            <label for="address" class="need anno">주소</label>
		            <textarea class="big scroll" id="address" name="address" placeholder="주소를 입력해 주세요." data-object required></textarea>
		        </div>
		    </div>
		</div>
			
		<%-- 주차안내 --%>
	    <div class="col4 col">
	        <div class="tit-bar">주차 안내</div>
	
	        <div class="contents">
  		        <div class="con">
	   	            <label for="toggle-knob" class="no-need anno">사용 / 미사용</label>
		            <div class="toggle toggle-knob">
		                <input type="checkbox" class="toggle-checkbox active" id="toggle-knob" name="parkingYn" onclick="commonToggle(this)" data-object checked>
		                <label class="toggle-btn" for="toggle-knob">
		                    <span class="toggle-feature" data-label-on="on" data-label-off="off"></span>
		                </label>
		            </div>
		        </div>
		        
		        <div>
       	            <div class="con">
		                <label for="parking" class="no-need anno">주차 안내</label>
       		            <textarea class="big scroll" id="parking" name="parkingComment" placeholder="주차 안내 문구를 입력해 주세요." data-object></textarea>
		            </div>
		
		            <div class="con">
		                <label for="upload" class="no-need anno">안내 이미지</label>
		                <div class="file-upload parking-img">
		                    <input type="file" id="upload" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
		                    <input type="hidden" name="parkingImg" data-object/>
		                    <i class="icon"></i>
		                    
		                    <img src="" alt="이미지" style="display: none;" data-object>
		                    
                            <div class="resolution">이미지해상도 (1600 x auto)</div>
		                </div>
		            </div>
		        </div>
	        </div>
	    </div>
			
		<%-- sns정보 --%>
		<div class="col5 col">
		    <div class="tit-bar">SNS 정보</div>
		    <div class="contents">
		        <div class="con">
		            <label for="insta" class="no-need anno">인스타그램</label>
		            <input type="text" class="big" id="insta" name="snsInstagram" placeholder="지점 인스타그램 주소를 입력해 주세요." data-object>
		        </div>
		
		        <div class="con">
		            <label for="youtube" class="no-need anno">유튜브</label>
		            <input type="text" class="big" id="youtube" name="snsYoutube" placeholder="지점 유튜브 주소를 입력해 주세요." data-object>
		        </div>
		
		        <div class="con">
		            <label for="facebook" class="no-need anno">페이스북</label>
		            <input type="text" class="big" id="facebook" name="snsFacebook" placeholder="지점 페이스북 주소를 입력해 주세요." data-object>
		        </div>
		
		        <div class="con">
		            <label for="blog" class="no-need anno">블로그</label>
		            <input type="text" class="big" id="blog" name="snsBlog" placeholder="지점 블로그 주소를 입력해 주세요." data-object>
		        </div>
		    </div>
		</div>
	</div>
</form>

<script src="${sessionScope.path}/script/pge/pge001.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>
