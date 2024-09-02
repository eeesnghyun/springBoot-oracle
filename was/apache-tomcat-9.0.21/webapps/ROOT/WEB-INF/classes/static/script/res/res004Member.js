function checkInputNum(obj){
	const RegExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;	//정규식 구문
	
    if (RegExp.test(obj.value)) {
      // 특수문자 모두 제거    
      obj.value = obj.value.replace(RegExp , '');
    }
}

//회원 정보 조회
function getUserInfo() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"userId"       : document.getElementById("userEditId").value
	};

	commonAjax.call("/res/getUserInfo", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.result;
			
			//비회원인 경우 숨김처리
			if (result.memberYn == "N") {
				const input = document.querySelectorAll('.user-input');
				
				for (let i = 0; i < input.length; i++) {
					input[i].style.display = 'none';
				}
			} 
						
			document.getElementById('grade').value 	        = result.gradeCode;
			document.getElementById('userName').value       = result.name;
			document.getElementById('userPhone').value      = result.mobile;
			document.getElementById('birthDate').value      = result.birthdate;
			document.getElementById('doctor').value 	    = result.fixedDoctor;
			document.getElementById('staff').value 	        = result.fixedStaff;
			document.getElementById('visit').value 		    = result.visitType;
			document.getElementById('grade').value 	        = result.gradeCode;
			document.getElementById('gender').value         = result.gender;
			document.getElementById('doctor').value 	    = nvlStr(result.fixedDoctor);
			document.getElementById('staff').value          = nvlStr(result.fixedStaff);
			document.getElementById('totalRes').innerText   = result.reserveCnt;
			document.getElementById('totalPrice').innerText = result.totalPrice;
			
			if (isNullStr(result.tempNote)) {
				document.getElementById('userMemo').value = '';
			} else {
				document.getElementById('userMemo').value       = result.tempNote;
			}

			if (result.marketingYn == 'Y') {
				document.getElementById('marketing').checked = true;
			}

			if (result.pushReserveYn == 'Y') {
				document.getElementById('appPush').checked = true;
			}
		}
	});
}

//예약접수 - 회원검색
function getSearchUserList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"userId"        : document.getElementById("userName").value
	};

	commonAjax.call("/res/getSearchUserList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			const ul     = document.querySelector('.search-wrap');
			
			ul.innerHTML = '';
			if (result.length > 0) {	
				for (let i = 0; i < result.length; i++) {
					const mobile = result[i].mobile.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
					
					ul.innerHTML += 
						`<div class="member-li" id="${result[i].userId}">
                            <div class="button-div">
                             	<div class="rank" style="display: ${result[i].gradeName == "" ? "none" : "block"};background-color:${result[i].gradeColor};">${result[i].gradeDisplay}</div>
                                <div class="visit-type">${result[i].visitType}</div>
                                <button type="button" class="btn-send" onclick="openSendPopup(this);"></button>
                                <button type="button" class="btn-edit-user" onclick="drawPopupUserInfo('${result[i].userId}');"></button>
                            </div>
                            
                            <div class="top-wrap" style="margin-left:${result[i].gradeCode == "" ? "22px" : "0"}" >
                               	<span class="name">
                               		<span>${result[i].name}</span>
                               	  	<span class="user-gen-age">(<span class="gender">${result[i].gender == "male" ? "남" : "여"}</span>/${result[i].age})</span>
                               	</span>
                            	<div class="mobile">${mobile}</div>
                            </div>
                            
                            <div class="fixed-doctor" style="opacity:${result[i].fixedDoctorName == "" ? "0" : "1"};">
                            	<span class="label-doc">지정:&nbsp;</span>
                            	<span class="${result[i].fixedDoctorName == "" ? "doc-hide" : "doc-show"}">${result[i].fixedDoctorName},</span>
                            	<span class="${result[i].fixedStaffName == "" ? "doc-hide" : "doc-show"}">&nbsp;${result[i].fixedStaffName},</span>
                            </div>
                            
                            <div class="bottom-wrap">
                            	<botton type="button" class="btn-res" onclick="goNewReceipt(this)">예약 접수</botton>
                            </div>
                            <input type="hidden" name="user_info" data-id="${result[i].userId}" data-name="${result[i].name}" data-remain="${result[i].remainAmount}">
                         </div>`;
					
					// 지정의사 , 표시
					const docShow = document.getElementById(`${result[i].userId}`).querySelectorAll('.doc-show');
						
					if (docShow.length != 0) {
						docShow[docShow.length - 1].innerText = docShow[docShow.length - 1].innerText.replace(',', ''); 
					}
				}
			} else {
				ul.innerHTML += `<div id="noSearch">검색된 회원이 없습니다.</div>`;
			}
		} 
	});
} 

//회원 정보 수정팝업 조회
function drawPopupUserInfo(userId) {
	event.stopPropagation();
	const params = {
		"userId" : userId
	}; 
	
	commonDrawPopup("load", "/res/res004Edit", params);
}

//예약 접수 페이지 이동
function goNewReceipt(ele){
	event.stopPropagation();
	
	const parent = ele.parentElement.parentElement;
	const params = {
		"userId"       : parent.querySelector('[name="user_info"]').dataset.id,
		"name"         : parent.querySelector('[name="user_info"]').dataset.name,
		"mobile"       : parent.querySelector('.mobile').innerText,
		"remainAmount" : parent.querySelector('[name="user_info"]').dataset.remain,
	};
	
	commonDrawPopup("load", "/res/res004Receipt", params);	
}

//필수값 체크 
function checkRequired() {
	const req    = document.querySelectorAll('.req');
	const mobile = document.getElementById('userPhone');
	const birth  = document.getElementById('birthDate');	
	
	for (let i=0; i < req.length; i++) {
		if (isNullStr(req[i].value)) {
			alert('필수값을 입력해 주세요.');
			req[i].style.border = '1px solid red';
			req[i].focus();			
			
			return false;
		}
	}
	
	if (mobile.value.length < 11) {
		alert('휴대폰 번호를 확인해주세요.');
		mobile.style.border = '1px solid red';
		mobile.focus();
		
		return false;
	}
	
	if (birth.value.length < 8) {
		alert('생년월일을 확인해 주세요.');
		birth.style.border = '1px solid red';
		birth.focus();
		
		return false;
	}
	
	return true
}

//예약접수 - 회원 추가
function insertUser(){
	if (!checkRequired()) {
		return;
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"name"         : document.getElementById("userName").value,
		"gender"       : document.getElementById("gender").value,
		"gradeCode"    : document.getElementById("grade").value,
		"mobile"       : document.getElementById("userPhone").value,
		"birthdate"    : document.getElementById("birthDate").value,
		"fixedDoctor"  : document.getElementById("doctor").value,
		"fixedStaff"   : document.getElementById("staff").value,
		"marketingYn"  : document.getElementById("marketing").checked == true ? "Y" : "N",
		"tempNote"     : document.getElementById("userMemo").value
	};
	
	commonAjax.call("/res/insertUser", "POST", params, function(data){
		if (data.message == "OK") {		
			const mobile = params.mobile.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
						
			drawReservePopup("b" + params.mobile, mobile, params.name);
		} else {
			alert(data.message);
		}
	});
}

//회원 정보 수정
function updateUserInfo() {
	if (!checkRequired()) {
		return;
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"userId"       : document.getElementById("userEditId").value,
		"gradeCode"    : document.getElementById('grade').value,
		"gender"       : document.getElementById('gender').value,
		"name"         : document.getElementById('userName').value,
		"mobile"       : document.getElementById('userPhone').value.replace(/[^0-9]/g, ""),
		"birthdate"    : document.getElementById('birthDate').value,
		"fixedDoctor"  : document.getElementById('doctor').value,
		"fixedStaff"   : document.getElementById('staff').value,
		"marketingYn"  : document.getElementById('marketing').checked == true ? "Y" : "N",		
		"pushReserveYn": document.getElementById('appPush').checked == true ? "Y" : "N",		
		"tempNote"     : document.getElementById('userMemo').value		
	};
	
	commonAjax.call("/res/updateUserInfo", "POST", params, function(data) {
		if (data.message == "OK") {		
			popupClose();
			
			//회원 현황 페이지 일경우 예약 회원 재조회
			if (window.location.href.indexOf('res004') != -1 ) {
				getReserveUserList();
			}		
		} else {
			alert(data.message); 
		} 
	});
}

//예약접수 팝업 
function drawReservePopup(id, mobile, name) {	
	const params = {
		"userId" : id,	
		"mobile" : mobile,
		"name"   : name
	};
	
	commonDrawPopup("load", "/res/res004Receipt", params);
}

//등급리스트 콤보박스
function getGradeList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"view"		   : "all"
	};
	
	commonAjax.call("/mbr/getGradeList", "POST", params, function(data) {
		const result = data.resultList;
		
		if (data.message == "OK") {
			let dataList = new Array();
			let comboObj;
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].gradeCode;
		        data.name = result[idx].gradeName;

				dataList.push(data);
			}
			comboObj = {"target" : "grade", "data" : dataList};
			commonInitCombo(comboObj);				
		}
	});
}

//의사 스탭 콤보박스
function getMedicalTeam() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/res/getMedicalTeam", "POST", params, function(data) {
		const director = data.result.director;
		const staff = data.result.staff;
		
		if (data.message == "OK") {
			let dataList1 = new Array();
			let comboObj1;
			let dataList2 = new Array();
			let comboObj2;
			
			for (idx in director) {				
		        let data = new Object();
		        
		        data.code = director[idx].sysUserId;
		        data.name = director[idx].sysName;

				dataList1.push(data);
			}
			
			for (idx in staff) {				
		        let data = new Object();
		        
		        data.code = staff[idx].sysUserId;
		        data.name = staff[idx].sysName;

				dataList2.push(data);
			}
			comboObj1 = {"target" : "doctor", "data" : dataList1 , "defaultOpt" : "없음"};
			comboObj2 = {"target" : "staff", "data" : dataList2 , "defaultOpt"  : "없음"};
			commonInitCombo(comboObj1);
			commonInitCombo(comboObj2);
		}
	});
}
