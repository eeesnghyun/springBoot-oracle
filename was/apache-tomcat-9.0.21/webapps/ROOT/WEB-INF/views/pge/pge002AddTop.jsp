 <%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
 
<div class="con" style="align-items: flex-start;">
	<label class ="need img-label-margin">팝업 내용(PC)</label>
	<div class="img-wrap">
		<label class ="img-upload" for="uploadP" class="need">이미지 업로드</label>
 		<input type="file" id="uploadP" onchange="popupFileReader(this)" accept="image/*" >
 		<input type="hidden" name="topPcImage" required>
 		
 		<img id="popupImgP" src="" alt="이미지" style="display:none;">
 		<div class="resolution">이미지해상도 (2400 x 84)</div>
	</div>
 </div>
 
<div class="con">
    <label for="color" class="need">상단 배경(PC)</label>
    <div class="color-picker">
        <input type="text" id="colorPC" name="topPcColor" placeholder="색상" required>
        <input type="color" class="color-input" placeholder="색상" onchange="colorPicker(this)">
    </div>
</div>
 
<div class="con line" style="align-items: baseline;">
     <label for="UrlPC" class="URL">연결링크</label>
     <div class="con-wrap">
	     <input type="text" class ="url-input" id="UrlPC" name="topPcUrl" placeholder="연결할 링크를 입력해 주세요.">
	     <div class="app-link-chk">
	   		<input type="checkbox" class="chk" id="appLink1" name="topPcLinkYn" onclick="checkAppLink(this)" value="N">
	   		<label for="appLink1"></label>
	   		<label for="appLink1" class="check">뷰티올 다운로드 링크로 연결</label> 
	   	</div>
   	</div>
</div>
 
<div class="con" style="align-items: flex-start;">
	<label class ="need img-label-margin">팝업 내용(M)</label>
	<div class="img-wrap">
		<label class ="img-upload" for="uploadM" class="need">이미지 업로드</label>
 		<input type="file" id="uploadM" onchange="popupFileReader(this)" accept="image/*" >
 		<input type="hidden" name="topMobileImage" required>
 		
 		<img id="popupImgM" src="" alt="이미지" style="display:none;">
 		<div class="resolution">이미지해상도 (720 x 84)</div>
 		
	</div>
</div>
 
<div class="con">
     <label for="colorM" class="need">상단 배경(M)</label>
     <div class="color-picker">
         <input type="text" id="colorM" name="topMobileColor" placeholder="색상" name="siteColor" required>
         <input type="color" class="color-input" placeholder="색상" onchange="colorPicker(this)">
     </div>
</div>
 
<div class="con" style="align-items:baseline;">
     <label for="UrlPC" class="URL">연결링크</label>
      <div class="con-wrap">
	     <input type="text" class ="url-input" id="UrlPC" name="topMobileUrl" placeholder="연결할 링크를 입력해 주세요.">
	     <div class="app-link-chk">
	  		<input type="checkbox" class="chk" id="appLink2" name="topMobileLinkYn" onclick="checkAppLink(this)" value="N">
	  		<label for="appLink2"></label>
	  		<label for="appLink2" class="check">뷰티올 다운로드 링크로 연결</label> 
	  	</div>
  	</div>
</div> 