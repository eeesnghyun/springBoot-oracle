<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<style>
.popup-inner {
	width:776px;
}
</style>
<div class="popup-tit">
	<p>계정 정보</p>
</div>

<div class="popup-con">
	<form id = "frm" class="flex-wrap">
		<div class="left">
			<div class="inputs">
				<input type="hidden" id="popOfficeCode" value="<c:out value="${param.officeCode}"/>" disabled="disabled">
				
				<label for="id" class="need">아이디</label>
		        <input type="text" id="id" placeholder="아이디를 입력해 주세요." required>
			
		        <div class="div-flex">
		        	<div>
			       	 	<label for="name" class="need">이름</label>
		        	 	<input type="text" id="name" placeholder="이름을 입력해 주세요." required>
		        	</div>
		        	
		        	<div>
			            <label for="job" class="need">직책</label>
				       	<div class="select-box">
							<select id=position></select>
							<div class="icon-arrow"></div>
				       	</div>
			       	</div>
		        </div>
		     </div>
		
			<div class="inputs">
		        <label for="num" class="need">휴대폰 번호</label>
		        <input type="text" id="num" placeholder="휴대폰 번호를 입력해 주세요.  (-제외)" maxlength="11" onkeyup="characterCheck(this.value , this)" required>
		
				<label for="password" class="need">비밀번호</label>
				<div id="passWrap">	
		        </div>
			</div>
		</div>
		
		<div class="right">
			<div class="inputs">
				<label class="need">메뉴 권한</label>
				<div class="check-wrap"></div>

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
	</form>
</div>

<div class="popup-btn">
	<button class="save-btn blue-btn" id="callBtn" onclick="insertOfficeUser()">저장하기</button>
</div>
<script>
	function init() {											
		//직책코드 그리기
		const comboObj = {"target" : "position", "code" : "POS001", "defaultOpt" : ""};			
		commonCodeList(comboObj);
		
		drawMenuCode();  //메뉴코드 그리기	
		changeContent(); // 비밀번호 컨텐츠 변경
		drawUpdateOfficeUser(); // 계정 조회 
	}
	
	// 본인계정이 아닐때 비밀번호 초기화 버튼 변경
	function changeContent() {
		const area = document.getElementById('passWrap');
		const id   = '<c:out value="${param.sysUserId}"/>';

 		if (document.getElementById('loginUserId').value == id) {
			area.innerHTML = 
				'<input type="password" id="password" placeholder="비밀번호를 입력해 주세요."><input type="password" id="confirmPw" placeholder="비밀번호를 재입력해 주세요.">';
		} else {
			area.innerHTML = '<button type="button" class="btn-reset-pw" onclick="resetPassword();">비밀번호 초기화</button>';
		}
	} 
	
	//휴대폰 번호 정규식
	function characterCheck(str, target) {
		var num =  str.toString()
						.replace(/[^-0-9]+/g, '')
						.replace(/[ \{\}\[\]\/?.,;:|\)*~`!^\-_┼<>@\#$%&\'\"\\\(\=]/gi, "");
				
		!isNullStr(target) ? target.value = num : null;
				
		return num;
	}
	
	//필수값 체크
	function checkInput(){
		const mobile    = document.getElementById("num");

		if (mobile.value.length < 11) {
			alert('휴대폰 번호를 확인해 주세요.');
			mobile.style.border = '1px solid red';
	        return false;
		}
		
		//같은 계정일때
		if (document.getElementById('loginUserId').value == '<c:out value="${param.sysUserId}"/>') {
			const password  = document.getElementById("password").value;
			const confirmPw = document.getElementById("confirmPw");	
			
			if (password != confirmPw.value){
				alert('비밀번호를 확인해 주세요.');
				confirmPw.style.border = '1px solid red';
		        return false;
			}
			
			if (password && password.length < 8) {
				alert('비밀번호는 최소 8자리 이상입니다.');
				return false;
			}	
		}
		
		return true;
	}

	//계정 정보 조회
	function drawUpdateOfficeUser() {
		document.getElementById("popOfficeCode").value = '<c:out value="${param.officeCode}"/>';
		document.getElementById("position").value = '<c:out value="${param.sysPosition}"/>';
		document.getElementById("num").value = '<c:out value="${param.mobile}"/>';
		document.getElementById("name").value = '<c:out value="${param.sysName}"/>';
		document.getElementById("id").value = '<c:out value="${param.sysUserId}"/>';		
		document.getElementById("id").setAttribute('disabled', true);		
		document.getElementById("popOfficeCode").setAttribute('disabled', true);
		
		const menuCode = '<c:out value="${param.menuCode}"/>';
		const menuArr = menuCode.split(',');
		const btn = document.querySelectorAll('.check-wrap div');
		
		for (let i = 0; i < btn.length; i++) {
			for (let j = 0; j < menuArr.length; j++) {
				if (btn[i].dataset.code == menuArr[j]) {
					btn[i].classList.add('active');
				}	
			}
		}
		
		if ('<c:out value="${param.authCheck}"/>' == 'Y') {
			document.getElementById('2ndAccess').checked = true;
		}
		
		document.getElementById("callBtn").setAttribute('onclick','updateOfficeUser()');	
	}
	
	//계정 수정
	function updateOfficeUser() {
		const menu      = document.querySelectorAll('.check-wrap div');
		const menuArr   = [];
		
		for (let i = 0; i < menu.length; i++) {
			if (menu[i].classList.contains('active')) {
				menuArr.push(menu[i].dataset.code);
			}
		}
		
		if (isNullStr(menuArr)) {
			alert('메뉴 권한 1개 이상 필수 선택입니다.');
	        return;
		}
		
		if (commonCheckRequired("#frm")) {
			if (checkInput()) {
				const params = {
					"officeCode"   : document.getElementById("popOfficeCode").value,
					"sysName"      : document.getElementById("name").value,
					"sysMobile"    : document.getElementById("num").value,
					"sysPosition"  : document.getElementById("position").value,
					"sysUserId"    : document.getElementById("id").value,
					"sysUserPw"    : isNullStr(document.getElementById("password")) ? "" : document.getElementById("password").value,
					"pwSalt"       : isNullStr(document.getElementById("confirmPw")) ? "" : document.getElementById("confirmPw").value,
					"menuList"     : JSON.stringify(menuArr),
					"authCheck"    : document.getElementById('2ndAccess').checked ? "Y" : "N",
					"useYn"		   : "Y"
				};	

		  		commonAjax.call("/usr/updateOfficeUser", "POST", params, function(data){
					if (data.message == "OK") {				    
						alert('계정 정보가 저장되었습니다.');

						location.reload();						
					} else {
						alert(data.message);
					}
				}); 
			}
		}
	}
	
	//비밀번호 초기화
	function resetPassword() {
		const params = {
				  "sysUserId" : document.getElementById("id").value,
				  "officeCode": document.getElementById("popOfficeCode").value,
				  "sysMobile" : document.getElementById("num").value,
				  "resetPwYn" : "Y"
		};
				
		commonAjax.call("/usr/resetPassword", "POST", params, function(data){			
			if (data.message == "OK") {
				alert('비밀번호를 초기화했습니다.');
				popupClose();
			}
		});
	}
	
	init();	
</script>	