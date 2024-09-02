<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<style>
#popupInner {
	width:406px;
}
</style>

<div class="popup-tit">
	<p>최종 승인</p>
	<p class="tit-text">부여할 메뉴 권한을 선택해 주세요.</p>
</div>

<div class="popup-con">
	<label class="need">메뉴 권한</label>
	
	<input type="hidden" id ="sysUserId" value="<c:out value='${sysUserId}'/>">
	<input type="hidden" id ="sysMobile" value="<c:out value='${sysMobile}'/>">
	
	<div class="check-wrap"></div>
	<div>
		<label class="need" style="margin-bottom:20px;">계정 보안</label>
		<div class="pass-wrap">
			<div class="text-wrap">
				<span>로그인 2차 인증</span>
				<p>보안을 위해 2차 인증을 설정할 수 있습니다. 활성화 되면,</br>로그인 시 휴대폰 본인확인 인증단계가 추가됩니다.</p>
			</div>
		 	<input type="checkbox" id="2ndAccess" class="cm-toggle"></input>
		 </div>
	</div>
</div>

<div class="popup-btn">
	<button class="save-btn blue-btn" onclick="authorizeUserAccount()">최종 승인</button>
</div>
<script>
	drawMenuCode();
</script>	