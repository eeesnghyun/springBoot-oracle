//병원 조회
function getHospital() {
	const hospital = document.getElementById("hospitalList");

	commonAjax.call("/sys/getHospital", "POST", "", function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			
			if (result.length > 0) {
				hospital.innerHTML = "";
				
				for (let i = 0; i < result.length; i++) {
					hospital.innerHTML += 
					`<li data-code='${result[i].hospitalCode}' onclick='getOffice(this)'>
						<span>${result[i].hospitalName}</span>
						<button type="button" class="del-btn" onclick="deleteHospital(this)">
					</li>`;
				}
				
				hospital.children[0].click();
			} else {
				document.querySelector('.location button').disabled = 'true';
				alert('병원을 추가해 주세요.');
			}						
		}
	});
}

//지점 조회
function getOffice(obj) {	
	const hospitalCode = obj.dataset.code;
	const hopsital = document.querySelectorAll('#hospitalList li');
	const office = document.getElementById("officeList");		
			
	document.getElementById("hospitalCode").value = hospitalCode;
	
	hopsital.forEach((ele) => ele.classList.remove('active'));	
	obj.classList.add('active');	
	
	const params = {
		"hospitalCode" : hospitalCode
	};
	
	commonAjax.call("/sys/getOffice", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;		
			const access = data.accessList;
			
			office.innerHTML = "";
			
			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					office.innerHTML +=
					`<li onclick="getOfficeInfo(this)">
						<input type="hidden" value='${result[i].officeCode}'>
						<input type="hidden" value='${result[i].officeSite}'>
						<input type="hidden" value='${nvlStr(result[i].accessKey)}'>
						<input type="hidden" value='${nvlStr(result[i].naverKey)}'>
						<input type="hidden" value='${nvlStr(result[i].googleKey)}'>
						<input type="hidden" value='${nvlStr(result[i].kakaoKey)}'>
						<input type="hidden" value='${nvlStr(result[i].facebookKey)}'>
						<input type="hidden" value='${nvlStr(result[i].kakaoNativeKey)}'>
						<input type="hidden" value='${nvlStr(result[i].maxUsrCount)}'>
						<span>${result[i].officeLocation}</span>
						<button type="button" class="del-btn" onclick="deleteOffice(this)"></button>
					</li>`;
				}
				
				document.querySelector('.location').style.opacity = '1';
				document.querySelector('.info ').style.opacity = '1';
				document.querySelector('.info').style.pointerEvents = 'unset';
				
				//앱 코드 넣기
				const officeList = document.querySelectorAll("#officeList li");
				
				officeList.forEach((office) => {
					access.forEach((access) => {
						if (office.querySelectorAll('input')[0].value == access.officeCode) {
							office.querySelectorAll('input')[2].value = access.accessKey
						}
					})
				});
				
				office.children[0].click();	
			} else {
				document.querySelector('.info').style.opacity = '0.5';				
				document.querySelector('.info').style.pointerEvents = 'none';
						
				document.querySelectorAll('.info input').forEach((ele) => ele.value = null)
			}		
		}
	});
}

//병원 저장
function saveHospital() {
	const hospitalName = document.getElementById("hospitalName").value
	const hospital = document.querySelectorAll('#hospitalList li span');

	for (let i = 0; i < hospital.length; i++) {
		if (hospital[i].innerText == hospitalName) {
			alert('해당 병원명이 존재합니다.');
			return;
		}
	}
	
	if (commonCheckRequired("#frm1")) {
		const params = {
			"hospitalName" : hospitalName
		};
		
		commonAjax.call("/sys/insertHospital", "POST", params, function(data){
			if (data.message == "OK") {
				alert("저장되었습니다.");
				
				popupClose();
				getHospital();
			}
		});	
	}
}

//지점 저장
function saveOffice() {	
	const location  = document.getElementById("location").value;
	let appCode     = document.getElementById("appCode").value;
	const office    = document.querySelectorAll('#officeList li');

	for (let i = 0; i < office.length; i++) {
		if (office[i].querySelector('span').innerText == location) {
			alert('입력하신 병원위치가 이미 존재합니다.\n다른 병원위치를 입력해 주세요.');
			return;
		}
	}

	if (!isNullStr(appCode)) {
		appCode = appCode.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi, '');
		
		if (appCode.length < 4) {
			alert('앱 병원코드는 숫자 4자리로 입력해 주세요.');
			return;
		}
		
		for (let i = 0; i < office.length; i++) {
			if (office[i].querySelectorAll('input')[2].value == appCode) {
				alert('입력하신 앱 병원코드가 이미 존재합니다.\n다른 앱 병원코드를 입력해 주세요.');
				return;
			}
		}	
	}
	
	if (commonCheckRequired("#frm1")) {				
		const params = {
			"hospitalCode"   : document.getElementById("hospitalCode").value,
			"officeLocation" : location,
			"accessKey"      : appCode,
			"officeSite" 	 : document.getElementById("site").value,
			"maxUsrCount"    : document.querySelector("input[name='countPop']:checked").value
		};
		
		commonAjax.call("/sys/insertOffice", "POST", params, function(data){
			if (data.message == "OK") {
				alert("저장되었습니다.");
				
				popupClose();
				reLoad();	
			} else {
				alert(data.message);
			}
		});	
	}
}

//지점 재조회
function reLoad() {
	const list = document.querySelectorAll('#hospitalList li');
	
	for (let i = 0; i < list.length; i++) {
		if (list[i].classList.contains('active')) {
			list[i].click();
			break;
		}
	}
}

//지점 정보 조회
function getOfficeInfo(obj) {
	const child = document.querySelectorAll('#officeList li');	
	const input = obj.querySelectorAll('input');
	
	document.getElementById("officeCode").value    = input[0].value;
	document.getElementById("officeSite").value    = input[1].value;          //병원위치
	document.getElementById("accessKey").value     = nvlStr(input[2].value);  //앱 병원코드
	
	if (!isNullStr(input[8].value)) {                                         //계정 최대 허용	
		document.getElementById(`${input[8].value}-account`).checked = true;
	} else {
		document.querySelectorAll('input[name="count"]')[0].checked = true;
	}
	
	for (let i = 0; i < child.length; i++) {
		child[i].classList.remove('active');
	}
	
	obj.classList.add('active');
}

//지점 저장
function updateOffice() {
	if (commonCheckRequired("#frm")) {
		let appCode        = document.getElementById("accessKey").value;
		const office       = document.querySelectorAll('#officeList li');
		const selectOffice = document.querySelector('#officeList li.active');
		const params = { 
			"hospitalCode"  : document.getElementById("hospitalCode").value,
			"officeCode"    : document.getElementById("officeCode").value,
			"officeSite"    : document.getElementById("officeSite").value,
			"accessKey"     : appCode,
			"maxUsrCount"   : document.querySelector("input[name='count']:checked").value,
			"naverKey"      : selectOffice.querySelectorAll('input')[3].value,
			"googleKey"     : selectOffice.querySelectorAll('input')[4].value,
			"kakaoKey"      : selectOffice.querySelectorAll('input')[5].value,
			"facebookKey"   : selectOffice.querySelectorAll('input')[6].value,
			"kakaoNativeKey": selectOffice.querySelectorAll('input')[7].value
		};
		
		if (!isNullStr(appCode)) {
			appCode = appCode.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi, '');
			
			if (appCode.length < 4) {
				alert('앱 병원코드는 숫자 4자리로 입력해 주세요.');
				return;
			}
			
			office.forEach(function(item) {
			    if (!item.classList.contains("active")) {
			    	if (item.querySelectorAll("input")[2].value == appCode) {
			    		alert('입력하신 앱 병원코드가 이미 존재합니다.\n다른 앱 병원코드를 입력해 주세요.');
						return;	
			    	}			        
			    }
			});			
		}
		
		commonAjax.call("/sys/updateOffice", "POST", params, function(data){
			if (data.message == "OK") {
				alert("저장되었습니다.");
				reLoad();
			}
		});	
	}
}

function drawPopup(type) {
    var content;
    
    if (type == 'list') {
    	content = 
	        `<form id="frm1" onsubmit="return false">
		        <div class="popup-tit">
		            <p>병원추가</p>
		        </div>
		        
		        <div class="popup-con hospital" style="min-width:460px">
		        	<label class="need">병원명</label>
	    	        <input type="text" placeholder="병원명을 입력해 주세요." id="hospitalName" required>
		        </div>
		
		        <div class="popup-btn">
		            <button class="save-btn blue-btn" onclick="saveHospital()">저장하기</button>
		        </div>
	        </form>`;
    	
        commonDrawPopup("draw", content);
    } else {
        content = 
	        `<form id="frm1" onsubmit="return false">
		        <div class="popup-tit">
		            <p>병원 위치추가</p>
		        </div>
		
	        	<div class="popup-con office" style="min-width:460px">
			        <div class="inputs">        	
			            <label for="hospital" class="need">선택병원</label>
			        	<input type="text" id="hospital" disabled>
			        	
			        	<label for="location" class="need">병원위치</label>
			            <input type="text" placeholder="병원위치를 입력해 주세요." id="location" required>
			            
			        	<label for="appCode">앱 병원코드 (숫자 4자리)</label>
			            <input type="text" placeholder="앱 병원코드를 입력해 주세요." id="appCode" pattern="\d*" maxlength="4" oninput="this.value = this.value.replace(/[^0-9.]/gi, '')">
			            
			            <label for="site" class="need">홈페이지 주소</label>
			            <input type="text" placeholder="홈페이지 주소를 입력해 주세요." id="site" required>
		        	</div>
		        	
     	   	       <div class="account-div">
				   		<label class="need">계정 최대 허용</label>
				   		<div class="count-div">
			       		    <div>
							    <input type="radio" id="5-accountPop" value="1" name="countPop" checked>
							    <label for="5-accountPop">5명</label>
						    </div>
						    
						    <div>
							    <input type="radio" id="10-accountPop" value="2" name="countPop">
							    <label for="10-accountPop">10명</label>
						    </div>
						    
						    <div>
							    <input type="radio" id="15-accountPop" value="3" name="countPop">
							    <label for="15-accountPop">15명</label>
						    </div>
						    
						    <div>
							    <input type="radio" id="99999-accountPop" value="4" name="countPop">
							    <label for="99999-accountPop">무제한</label>
						    </div>
				   		</div>
			       </div>
	        	</div>
		
		        <div class="popup-btn">
		            <button class="save-btn blue-btn" onclick="saveOffice()">저장하기</button>
		        </div>
	        </form>`;
        
        commonDrawPopup("draw", content);
        
        //선택한 값 팝업안에 넣어줌
        const list = document.querySelector('#hospitalList li.active span');
		document.getElementById('hospital').value = list.innerHTML;
    }
}

//병원 삭제
function deleteHospital(obj) {
	event.stopPropagation();
	
	const name = obj.parentElement.innerText;
	const msg  = `${name} 병원을 삭제하시겠습니까?`	
	
	if (confirm(msg)) {
		const params = {
			"hospitalCode" : obj.parentElement.dataset.code
		};
	
		commonAjax.call("/sys/deleteHospital", "POST", params, function(data){
			if (data.message == "OK") {								
				alert("삭제되었습니다.");

				getHospital();
			}
		});	
	}	
}

//지점 삭제
function deleteOffice(obj) {
	event.stopPropagation();
	
	const name = obj.parentElement.innerText;
	const msg  = `${name} 지점을 삭제하시겠습니까?`	
	
	if (confirm(msg)) {
		const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : obj.parentElement.children[0].value
		};
		
		commonAjax.call("/sys/deleteOffice", "POST", params, function(data){
			if (data.message == "OK") {								
				alert("삭제되었습니다.");

				reLoad();
			}
		});	
	}	
}

//키관리 팝업 그리기 
function drawKeyPopup(){
    const content = 
        `<form id="frm2" onsubmit="return false">
	        <div class="popup-tit">
	            <p>키 관리</p>
	        </div>
	
        	<div class="popup-con key" style="min-width:460px">
        		<div>
        			<div>
		            	<label for="hospital" class="need">선택병원</label>
	        			<input type="text" id="hospital" disabled>
        			</div>
        		</div>
			        	
    			<div>
	           		<div>
	           			<label for="naverKey">네이버 서치어드바이저 KEY</label>
	           			<input type="text" id="naverKey">
	           		</div>
	           		
	           		<div>
	           			<label for="googleKey">구글 애널리틱스 KEY</label>
	           			<input type="text" id="googleKey">
	           		</div>
	           </div>
	           
	           <div>
	           		<div>
	           			<label for="kakaoKey">카카오 비지니스 KEY</label>
	           			<input type="text" id="kakaoKey">
	           		</div>
	           		
	           		<div>
	           			<label for="facebookKey">페이스북 비지니스 KEY</label>
	           			<input type="text" id="facebookKey">
	           		</div>
	           </div>
	           
	           <div>
	           		<div>
	           			<label for="kakaoNativeKey">카카오 자바스크립트 KEY</label>
	           			<input type="text" id="kakaoNativeKey">
	           		</div>
	           </div>
        	</div>
	
	        <div class="popup-btn">
	            <button class="save-btn blue-btn" onclick="saveKey()">저장하기</button>
	        </div>
        </form>`;
    
    commonDrawPopup("draw", content);
    
    //선택한 값 팝업안에 넣어줌
    const hospital = document.querySelector('#hospitalList li.active');
    const office   = document.querySelector('#officeList li.active');
    
	document.getElementById('hospital').value       = hospital.querySelector('span').innerText + ' ' + office.querySelector('span').innerText;  //선택 병원
	document.getElementById("naverKey").value       = nvlStr(office.querySelectorAll('input')[3].value);	//네이버검색키
	document.getElementById("googleKey").value      = nvlStr(office.querySelectorAll('input')[4].value);	//구글검색키
	document.getElementById("kakaoKey").value       = nvlStr(office.querySelectorAll('input')[5].value);	//카카오검색키
	document.getElementById("facebookKey").value    = nvlStr(office.querySelectorAll('input')[6].value);	//페이스북검색키
	document.getElementById("kakaoNativeKey").value = nvlStr(office.querySelectorAll('input')[7].value);    //카카오 네이티브키
}

/*키 저장*/
function saveKey(){
	const params = {
			"hospitalCode"  : document.getElementById("hospitalCode").value,
			"officeCode"    : document.getElementById("officeCode").value,
			"officeSite"    : document.getElementById("officeSite").value,
			"accessKey"     : document.getElementById("accessKey").value,
			"naverKey"      : document.getElementById("naverKey").value,
			"googleKey"     : document.getElementById("googleKey").value,
			"kakaoKey"      : document.getElementById("kakaoKey").value,
			"facebookKey"   : document.getElementById("facebookKey").value,
			"kakaoNativeKey": document.getElementById("kakaoNativeKey").value,
			"maxUsrCount"   : document.querySelector("input[name='count']:checked").value
	}

	commonAjax.call("/sys/updateOffice", "POST", params, function(data){
		if (data.message == "OK") {
			alert('저장되었습니다.');
			
			popupClose();
			reLoad();	
		}
	})
}