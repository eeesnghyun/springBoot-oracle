var gridPsh001 = null;

function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
		
	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;
}

function reset() {
	commonSetOfficeSite(".page-url", {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	});
	
	//푸시 조건 초기화
	document.querySelector("[name='pushType']").click();	
	document.getElementById('specificBox').innerHTML = "";
	document.querySelector('.pre-user-num').innerHTML = '0';
	document.querySelectorAll("[name='targetType']").forEach(function(e){
	    e.checked = false;
	});
}

function setPushType(ele) {
	const area = ele.parentElement.parentElement.querySelector('.select-area'); 
	
	if (ele.value == "0") {	
		area.innerHTML = ``;			
	} else {
		area.innerHTML = 
			`<div class="con date">
	   			<input type="text" class="push-date" id="pushDate" name="pushDate" placeholder="날짜선택" required autocomplete="off">
	        </div>
			<div class="select-box hour">
		    	<select id="pushHour" requried onchange="checkSelectMin();"></select>
				<div class="icon-arrow"></div>	
			</div>
			<span>:</span>
			<div class="select-box min">
		    	<select id="pushMinute" requried>
		    		<option value="00">00</option>
					<option value="30">30</option>
		    	</select>
				<div class="icon-arrow"></div>	
			</div>`;
		
		commonDatePicker(["pushDate"], "", hourOption, true);
	
		//시간 option 동적생성
		hourOption();
	}	
}

//푸시 발송 대상 체크 이벤트
function showSpecificBox(type) {
	const area = document.getElementById('specificBox');
	
	if (document.getElementById('android').checked || document.getElementById('ios').checked) {
		//특정 조건 체크시
		if (document.getElementById('specific').checked) {
			//빈 영역일 때만 새로 그리기
			if (isNullStr(area.innerText)) {
				area.innerHTML = 
					`<div class="tit-bar">푸시 타겟 특정 조건</div>
						<div class="contents">
							<div class="con psh">
								<label class="need">초진/재진</label>
								<div class="radio-box">
									<input type="radio" id="userAll" name="userType" value="0" required checked="checked" onclick="getPushExpectCount();">
					            	<label for="userAll" class="btn-radio">전체</label>				            	
						            <input type="radio" id="userFirst" name="userType" value="1" onclick="getPushExpectCount();">
					            	<label for="userFirst" class="btn-radio">초진</label>				            	
				   		            <input type="radio" id="userVisit" name="userType" value="2" onclick="getPushExpectCount();">
					            	<label for="userVisit" class="btn-radio">재진</label>
								</div>
							</div>
							
							<div class="con psh">
								<label class="need">성별</label>
								<div class="radio-box">
									<input type="radio" id="genderAll" name="userGender" value="0" required checked="checked" onclick="getPushExpectCount();">
					            	<label for="genderAll" class="btn-radio">전체</label>
						            <input type="radio" id="male" name="userGender" value="male" onclick="getPushExpectCount();">
						            <label for="male" class="btn-radio">남성</label>
			   		            	<input type="radio" id="female" name="userGender" value="female" onclick="getPushExpectCount();">
						            <label for="female" class="btn-radio">여성</label>
								</div>
							</div>
								
							<div class="con psh age">
								<label class="need">나이</label>
								<div class="radio-box">
									<input type="radio" id="ageAll" name="userAge" onclick="removeSelectArea(this)" value="0" required checked="checked">
					            	<label for="ageAll" class="btn-radio">전체</label>
						            <input type="radio" id="ageSelect" name="userAge" onclick="showSelectArea(this, 'age')" value="">
						            <label for="ageSelect" class="btn-radio">나이별</label>
								</div>
								
								<div class="select-area age"></div>
							</div>
								 
							<div class="con psh">
								<label class="need">결제</label>
								<div class="radio-box">
									<input type="radio" id="payAll" name="userPay" onclick="removeSelectArea(this)" value="0" required checked="checked">
					            	<label for="payAll" class="btn-radio">선택 안함</label>
						            <input type="radio" id="payInput" name="userPay" onclick="showSelectArea(this, 'pay')">
						            <label for="payInput" class="btn-radio">결제 금액</label>
								</div>
								
								<div class="select-area pay"></div>
							</div>
								
							<div class="con psh">
								<label class="need">의료진 지정</label>
								<div class="radio-box">
									<input type="radio" id="staffAll" name="staffFix" onclick="removeSelectArea(this)" value="0" required checked="checked">
					            	<label for="staffAll" class="btn-radio">선택 안함</label>
						            <input type="radio" id="staffSelect" name="staffFix" onclick="showSelectArea(this, 'staff')" value="1">
						            <label for="staffSelect" class="btn-radio">의료진</label>
								</div>
								
								<div class="select-area"></div>
							</div>
							
							<div class="con psh last">
								<label class="need">등급</label>
								<div class="radio-box">
									<input type="radio" id="gradeAll" name="userGrade" onclick="removeSelectArea(this)" value="0" required checked="checked">
					            	<label for="gradeAll" class="btn-radio">전체</label>
						            <input type="radio" id="gradeSelect" name="userGrade" onclick="showSelectArea(this, 'grade')">
						            <label for="gradeSelect" class="btn-radio">등급</label>
								</div>
								
								<div class="select-area"></div>
							</div>					
						</div>
					<div>`;								
			}
			
			getPushExpectCount();								
		} else {
			area.innerHTML = '';
			getPushExpectCount("device");
		}
	} else {
		//특정 조건 체크시 발송 대상 필수
		if (document.getElementById('specific').checked) {
			if (type == 'Y') {
				alert('발송 대상을 하나 이상 선택해 주세요.');
			}
		}
		document.getElementById('specific').checked = false;
		document.querySelector('.pre-user-num').innerHTML = '0';
		
		area.innerHTML = '';
	}
}

//특정 조건 select영역 show
function showSelectArea(ele, type) {
	const area = ele.parentElement.parentElement.querySelector('.select-area'); 
	
	if (ele.checked) {
		if (type == 'age') {
			area.innerHTML =
				`<div class="age-select hide alert" onclick="ageSelectClick();">
			        <div class="selected">
			            <div class="selected-val">나이선택</div>
			            <div class="icon-arrow"></div>
			        </div>
			
			        <ul class="option-list hide alert">
			            <li>
			                <input type="checkbox" id="age15" value="15" onclick="ageSelectedValue()">
			                <label for="age15">15 ~ 19세</label>
			            </li>
			            <li>
			                <input type="checkbox" id="age20" value="20" onclick="ageSelectedValue()">
			                <label for="age20">20 ~ 24세</label>
			            </li>
			            <li>
			                <input type="checkbox" id="age25" value="25" onclick="ageSelectedValue()">
			                <label for="age25">25 ~ 29세</label>
			            </li>
			            <li>
			                <input type="checkbox" id="age30" value="30" onclick="ageSelectedValue()">
			                <label for="age30">30 ~ 34세</label>
			            </li>
			            <li>
			                <input type="checkbox" id="age35" value="35" onclick="ageSelectedValue()">
			                <label for="age35">35 ~ 39세</label>
			            </li>
			            <li>
			                <input type="checkbox" id="age40" value="40" onclick="ageSelectedValue()">
			                <label for="age40">40 ~ 44세</label>
			            </li>
			            <li>
			                <input type="checkbox" id="age45" value="45" onclick="ageSelectedValue()">
			                <label for="age45">45 ~ 49세</label>
			            </li>
			            <li>
			                <input type="checkbox" id="age50" value="50" onclick="ageSelectedValue()">
			                <label for="age50">50 ~ 54세</label>
			            </li>
			            <li>
			                <input type="checkbox" id="age55" value="55" onclick="ageSelectedValue()">
			                <label for="age55">55 ~ 59세</label>
			            </li>
			            <li>
			                <input type="checkbox" id="age60" value="60" onclick="ageSelectedValue()">
			                <label for="age60">60 ~ 64세</label>
			            </li>
			            <li>
			                <input type="checkbox" id="age65" value="65" onclick="ageSelectedValue()">
			                <label for="age65">65세 이상</label>
			            </li>			
			        </ul>
			    </div>
			
			    <div class="age-preview"></div>`;
		} else if (type == "pay") {
			area.innerHTML =
				`<input class="total-pay" type="text" placeholder="0" required onkeyup="inputPayValue(this.value, this);"><span>원 이상</span>`;
		} else if (type == "staff") {
			area.innerHTML = 
				`<div class="select-box">
					<select id="doctor" name="fixedStaffSelect" onchange="getPushExpectCount();"></select>
					<div class="icon-arrow"></div>
				</div>
					
				<div class="select-box">
					<select id="staff" name="fixedStaffSelect" onchange="getPushExpectCount();"></select>
					<div class="icon-arrow"></div>
				</div>`;
			getMedicalTeam();
		} else if (type == "grade") {
			area.innerHTML =
				`<div class="select-box">
					<select id="grade" onchange="getPushExpectCount();"></select>
					<div class="icon-arrow"></div>
				</div>`;
			getGradeList();			
		}
	} 
	
	getPushExpectCount();
}

//금액 포맷 
function inputPayValue(str, target) {
	commonMoneyFormat(str, target);
	
	getPushExpectCount();
}

function removeSelectArea(ele) {		
	const area = ele.parentElement.parentElement.querySelector('.select-area');	
	area.innerHTML = ``;
	
	getPushExpectCount();	
}

function hourOption() {
	const hour = document.getElementById('pushHour');
	const time = checkSelectTime();
	hour.innerHTML = '';
	
	if (!isNullStr(time)) {
		for (let i = time; i < 25; i++) {
			hour.innerHTML += `<option value="${i < 10 ? '0' + i : i}">${i < 10 ? '0' + i : i}</option>`;
		}

		checkSelectMin();
	} else {
		for (let i = 0; i < 25; i++) {
			hour.innerHTML += `<option value="${i < 10 ? '0' + i : i}">${i < 10 ? '0' + i : i}</option>`;
		}
	}
	
}

//오늘 날짜일때 현재시각 이후로 보여주기
function checkSelectTime() {
	const pushDate = document.getElementById('pushDate').value.replace( /[^0-9]/g, "");
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    const today = year + month + day;
	
    if (pushDate == today) {
    	const now = new Date().getHours();
    	const nowMin = new Date().getMinutes();

    	if (nowMin < 30) {
    		return now;	
    	} else {
    		return now + 1;
    	}
    }
}

//오늘 날짜의 현재 시각일때 정시 시각 option 제거
function checkSelectMin() {
	const pushDate = document.getElementById('pushDate').value.replace( /[^0-9]/g, "");
	const select = document.getElementById('pushMinute'); 
	const time = document.getElementById('pushHour').value;
	const nowMin = new Date().getHours();
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    const today = year + month + day;
	
    if (pushDate == today) {
    	if (time == nowMin) {
    		select.innerHTML = 
    			`<option value="30">30</option>`;	
    	}
    } else {
    	select.innerHTML = 
			`<option value="00">00</option>
			 <option value="30">30</option>`;
    }	
}  

//의료진 selectbox
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
			
			dataList1.push({
				"code" : "1",
				"name" : "의사 제외"
			});
			dataList2.push({
				"code" : "1",
				"name" : "의료진 제외"
			});
			
			comboObj1 = {"target" : "doctor", "data" : dataList1 , "defaultOpt" : "의사 전체"};
			comboObj2 = {"target" : "staff", "data" : dataList2 , "defaultOpt" : "의료진 전체"};
			commonInitCombo(comboObj1);
			commonInitCombo(comboObj2);
		}
	});
}

//등급리스트 select
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

//나이선택 options
function ageSelectClick() {
    document.querySelector('.option-list').classList.toggle('active');
}

//나이선택 value, 미리보기
function ageSelectedValue() {
    const cnt = document.querySelectorAll('.age-select input[type="checkbox"]:checked');
    const age = document.getElementById('ageSelect');
    const preview = document.querySelector('.age-preview');
    preview.style.display = 'inline-block';
    preview.textContent = '';
   
    age.value = '';

    if (cnt.length == 0) {
        preview.style.display = 'none';
    } else {
    	for (let i = 0; i < cnt.length; i++) {
            preview.textContent += cnt[i].nextElementSibling.innerText + ', ';
            
            age.value += cnt[i].value + ','; 
        }
        
        preview.textContent = preview.textContent.slice(0, -2);
        
        age.value = age.value.slice(0, -1);       
    }
    
    getPushExpectCount();
}

//테스트발송 팝업open 
function openTestPushPopup() {
	if (document.querySelectorAll("input[name='targetType']:checked").length == 0) {
		alert('발송 대상을 선택해 주세요.');
		return;
	}
	
	if (commonCheckRequired("#pushForm") == false) {
		return;
	}
	
	const age = document.getElementById('ageSelect'); 
	if (document.getElementById('specific').checked == true && age.checked == true && isNullStr(age.value)) {
		alert('나이를 선택해 주세요.');
		document.querySelector('.age-select').style.border = '1px solid red';
		return;
	}
	
	const popup     = document.querySelector('#popupInner');
	const preOffice = document.getElementById('hospitalCode').options[document.getElementById('hospitalCode').selectedIndex].text 
					+ ' ' + document.getElementById('officeCode').options[document.getElementById('officeCode').selectedIndex].text;
    
	const content =
		   `<input type="hidden" id="testType">
		 	<div class="popup-tit">
		        <p>푸시 발송하기</p>
		        <p class="tit-text">테스트 발송 후 푸시 발송이 가능합니다</br>테스트 발송 시에는 해당 병원 직원에게 발송됩니다.</br>푸시 발송 팝업을 닫을 경우 다시 테스트 발송을 진행합니다.</p>
		    </div>
		    
		    <div class="popup-con">
    			<div class="pre-div">
    				<div class="pre-office">
    					<span>${preOffice}</span>
    					<span class="push-time">2분전</span>
					</div>
    				<div class="pre-content">
    					<span class="pre-tit">${document.querySelector('.push-tit').value}</span>
    					<pre>${document.querySelector('.push-content').value}</pre>
    				</div>
    			</div>
			</div>	
		
		    <div class="popup-btn" id="btnArea">
				<div class="select-box push">
					<select id="testUser"></select>
					<div class="icon-arrow"></div>
				</div>
				<div id="spinner" style="display:none;">
					<div class="spinner-border" role="status">
					  <span class="visually-hidden">Loading...</span>
					</div>
				</div>
				
		        <button class="save-btn blue-btn" type="button" onclick="pushDataSave()">테스트 발송</button>
		   </div>`;
	
	commonDrawPopup("draw", content);	
	getTestUser();
}

//푸시 정보 저장
function pushDataSave() {
	const formData = new FormData();
	const src = document.getElementById('pushImg').src;
	const seq = document.getElementById('pushSeq');
	
	formData.append("hospitalCode"  , document.getElementById("hospitalCode").value);
	formData.append("officeCode"    , document.getElementById("officeCode").value);
	formData.append("pushType"      , document.querySelector("input[name='pushType']:checked").value);
	formData.append("pushStatus"    , "W");
	formData.append("pushTime"      , document.querySelector('#radio2:checked') ? (document.querySelector('#pushDate').value + document.getElementById('pushHour').value + document.getElementById('pushMinute').value).replace(/[^0-9]/g, '') : "");
	formData.append("pushTargetAdr" , document.querySelector('#android:checked') ? "Y" : "N");	
	formData.append("pushTargetIos" , document.querySelector('#ios:checked') ? "Y" : "N");	
	formData.append("pushTargetEtc" , document.querySelector('#specific:checked') ? "Y" : "N");	
	formData.append("messageTitle"  , document.getElementById("messageTitle").value);
	formData.append("messageContent", document.getElementById("messageContent").value);
	formData.append("pushLink" 	    , document.getElementById("pushLink").value);			
	formData.append("expectCount"	, Number(document.querySelector('.pre-user-num').innerText));
	formData.append("testTarget"	, isNullStr(document.getElementById("testUser").value) ? "0" : document.getElementById("testUser").value);
	
	if (!isNullStr(document.getElementById('pushImg').src)) {
		formData.append("imageFile"	    , document.getElementById("upload").files[0]);
		formData.append("messageImage"	, src.substring(src.indexOf('/push/', 0), src.indexEnd));
	}
	
	if (!isNullStr(seq.value)) {
		formData.append("pushSeq", seq.value);
	}

	if (document.querySelector('#specific:checked')) {
		formData.append("pushCond", JSON.stringify(getPushCondData()));
	}
	
	/**
	 * 푸시 타입 명시 
	 * 푸시 실제 발송시 해당 푸시 타입을 체크해 분기처리함(sendClientSend)
	 */
	document.getElementById("testType").value = document.querySelector("input[name='pushType']:checked").value;
	
	commonAjax.fileUpload("/psh/insertPushInfo", formData, function(data) {
		if (data.message == "OK") {
			const pushSeq = data.result;
			
			if (isNullStr(seq)) {
				seq.value = pushSeq; //hidden 태그에 seq 값넣기
			}
			
			sendTestPush(pushSeq);
		}
	});
}

//특정 조건 데이터 가공
function getPushCondData() {
	const dataArr = new Array();
	
	//초진,재진
	const data1 = new Object();  
	data1.condKey   = 'A';
	data1.condValue = document.querySelector("input[name='userType']:checked").value;
	
	//성별
	const data2 = new Object();  
	data2.condKey   = 'B';
	data2.condValue = document.querySelector("input[name='userGender']:checked").value;
	
	//나이
	const ageVal = document.querySelector("input[name='userAge']:checked").value.split(',');
	
	for (let i = 0; i < ageVal.length; i++) {
		const ageData = new Object();  
		ageData.condKey   = 'C';
		ageData.condValue = ageVal[i];
		
		dataArr.push(ageData);
	}
	
	//결제
	const data3 = new Object();  
	data3.condKey   = 'D';
	data3.condValue = document.querySelector('#payAll:checked') ?  "0" : document.querySelector('.total-pay').value.replace( /[^0-9]/g, '');

	//의료진 선택
	if (document.getElementById('staffAll').checked) {
		dataArr.push({
			"condKey"   : "E",
			"condValue" : "0"
		});		
	} else {
		const doctor = document.getElementById('doctor').value;
		const staff  = document.getElementById('staff').value;		
		const doctorData = new Object();
		const staffData  = new Object();
		
		doctorData.condKey   = "E";
		doctorData.condValue = isNullStr(doctor) == true ? "0" : doctor;						
		staffData.condKey    = 'E';
		staffData.condValue  = isNullStr(staff) == true ? "0" : staff;
		
		dataArr.push(doctorData);
		dataArr.push(staffData);
	}
	
	//등급
	const data4 = new Object();  
	data4.condKey   = 'F';
	data4.condValue = document.querySelector('#gradeAll:checked') ?  "0" : document.getElementById('grade').value;
	
	dataArr.push(data1);
	dataArr.push(data2);
	dataArr.push(data3);
	dataArr.push(data4);
	
	return dataArr;
}

//이미지 썸네일 미리보기
function viewThumnail(ele) {
	const reader = new FileReader();
    const file = ele.files[0];

	const imageTypes = [
		'tiff', 'pjp'  , 'jfif', 'bmp' , 'gif',
		 'png'  , 'xbm' , 'dib' , 'jxl', 'avif', 
		'jpeg', 'svgz' , 'jpg' , 'webp', 'ico',
		'tif' , 'pjpeg'
	];    	    
	const image = file.name.split('.').pop().toLowerCase();    	

	// 이미지 확장자 체크
	if (imageTypes.indexOf(image) === -1) {
		alert("파일 확장자를 확인해 주세요.");
		return;
	}
	
	// 이미지 용량 300KB 제한
	if (file.size > 1024 * 290) {
        alert("300KB 이하의 이미지만 업로드할 수 있습니다. ");
        return;
    }
	
	reader.onload = function() {
		ele.parentNode.querySelector('img').style.display = 'block';
		ele.parentNode.querySelector('img').style.margin = '74px 0 7px 12px';
		ele.parentNode.querySelector('img').src = reader.result;
	}
    reader.readAsDataURL(file);
    
    // 이미지 삭제 버튼 보이게
    const btn = document.querySelector('.img-del');
    !isNullStr(btn) ? btn.classList.add('show') : null;
}

// 이미지 삭제
function pushDelImage(target) {
    const delBtn = target.parentElement;
    const parent = target.parentElement.parentElement;
    const img = parent.querySelector('img');

	img.src = "";
	img.style.display = 'none';
    delBtn.classList.remove('show');
}

//총 예상 발송 대상 카운트
function getPushExpectCount(type) {
	let params = {};
	
	if (type == "device") {
		params = {
				"hospitalCode"  : document.getElementById("hospitalCode").value,
				"officeCode"    : document.getElementById("officeCode").value,
				"pushTargetAdr" : document.getElementById("android").checked == true ? "Y" : "N",
				"pushTargetIos" : document.getElementById("ios").checked == true ? "Y" : "N",
				"pushCond1"     : "0",
				"pushCond2"     : "0",
				"pushCond3"     : "0",
				"pushCond4"     : "0",
				"pushCond5"     : "0",
				"fixedDoctor"   : "0",
				"fixedStaff"    : "0",
				"pushCond6"     : "0"
			};
		
		if (document.getElementById('specific').checked) {
			document.getElementById('staffAll').click();
			document.getElementById('gradeAll').click();
		}
	} else {		
		params = {
			"hospitalCode"  : document.getElementById("hospitalCode").value,
			"officeCode"    : document.getElementById("officeCode").value,
			"pushTargetAdr" : document.getElementById("android").checked == true ? "Y" : "N",
			"pushTargetIos" : document.getElementById("ios").checked == true ? "Y" : "N",
			"pushCond1"     : document.querySelector("input[name='userType']:checked").value,
			"pushCond2"     : document.querySelector("input[name='userGender']:checked").value,
			"pushCond3"     : document.querySelector("input[name='userAge']:checked").value == "0" ? "0" : document.getElementById("ageSelect").value,
			"pushCond4"     : document.querySelector("input[name='userPay']:checked").value == "0" ? "0" : document.querySelector('.total-pay').value,
			"pushCond5"     : document.querySelector("input[name='staffFix']:checked").value,			
			"pushCond6"     : document.querySelector("input[name='userGrade']:checked").value == "0" ? "0" : document.getElementById("grade").value
		};
		
		if (document.querySelector("input[name='staffFix']:checked").value != "0") {
			/**
			 * 의사 전체:0 / 제외:1
			 * 의료진 전체:0 / 제외:1
			 */
			const doctor = isNullStr(document.getElementById("doctor").value) ? "0" : document.getElementById("doctor").value;
			const staff  = isNullStr(document.getElementById("staff").value) ? "0" : document.getElementById("staff").value;
				
			params.fixedDoctor = doctor;
			params.fixedStaff  = staff;
		}
	}
	
	commonAjax.call("/psh/getPushExpectCount", "POST", params, function(data) {		
		if (data.message == "OK") {
			document.querySelector('.pre-user-num').innerText = data.result;
		}
	});
}

//불러오기 팝업 
function loadPushList() { 
	const content = 
		 `<div class="popup-tit">
		        <p>푸시 불러오기</p>
		        <p class="tit-text">기존에 작업하던 내용은 저장되지 않습니다.</p>
		    </div>
		    
		    <div class="load-push-grid">
			    <div id="divGrid">
				</div>
			</div>`;
	
	commonDrawPopup("draw", content);
	loadPushGrid();
}

//불러오기 목록 그리드
function loadPushGrid() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
    commonAjax.call("/psh/getPushList", "POST", params, function(data) {
    	const result = data.resultList;
    	
    	commonSetOfficeSite(".page-url", params);
    	
    	if (data.message == "OK") { 
    		gridPsh001 = new Tabulator("#divGrid", {    				    				
			    layout: "fitColumns",
			    pagination: "local",
				paginationSize: 15,
				paginationButtonCount : 9,    	
				placeholder: "해당 데이터가 없습니다.",
				maxHeight: "100%",
			    columns: [    			    	
			    	{title: "순번"        , field: "pushSeq"       , width: 80, headerHozAlign: "center", hozAlign: "center", resizable: false},
			    	{title: "대상"	      , field: "pushTarget"    , width: 220, headerSort: false, resizable: false, hozAlign: "center",
			    		formatter:function(cell){    			    	
    			    		const pushTargetAdr = cell._cell.row.data.pushTargetAdr;
    			    		const pushTargetIos = cell._cell.row.data.pushTargetIos;
    			    		const pushTargetEtc = cell._cell.row.data.pushTargetEtc;
    			    		let text = "";
    			    		
    			    		if (pushTargetAdr === "Y") text += "<span class='grid-badge'>Android</span>";    			    			    			    		    			    		
    			    		if (pushTargetIos === "Y") text += "<span class='grid-badge'>iOS</span>";     			    		
    			    		if (pushTargetEtc === "Y") text += "<span class='grid-badge'>특정 조건</span>"; 
    			    			
    			    		return text;
			    		}
			    	},
			    	{title: "Android"     , field: "pushTargetAdr" , visible: false},
			    	{title: "IOS"	      , field: "pushTargetIos" , visible: false},
			    	{title: "특정대상"	  , field: "pushTargetEtc" , visible: false},
			    	{title: "메시지 제목" , field: "messageTitle"  , width: 170, hozAlign: "center"  , headerSort: false, resizable: false},
			    	{title: "메시지 내용" , field: "messageContent", width: 300, hozAlign: "center"  , headerSort: false, resizable: false},
			    	{title: "발송"   	  , field: "expectCount"   , width: 120, hozAlign: "center", headerSort: false, resizable: false,
			    		formatter:function(cell){
			    			return "<span class='push-success-cnt'>" + cell._cell.row.data.successCnt + "</span><span class='push-total-cnt'>/" + cell.getValue() + "</span>";
			    		}
				    },
				    {title: "상태"   	  , field: "pushStatus"    , width: 180, hozAlign: "center", headerSort: false, resizable: false,
				    	formatter:function(cell){
				    		const pushTime = cell._cell.row.data.pushTime;
			        		
				    		if (cell.getValue() === "S") {
				    			return "<p style='line-height: 1.5'><span style='color:#555'>발송 완료</span><br><span class='push-time'>(" + pushTime + ")</span></p>";
				    			
				    		} else if (cell.getValue() === "C") {
				    			return "<p style='line-height: 1.5'><span style='color:#555'>발송 취소</span><br><span class='push-time'>(" + pushTime + ")</span></p>";
				    		} else {
				    			cell._cell.row.getElement().style.backgroundColor = "#f3f3f3";
				    			
				    			return "<p style='line-height: 1.5'><span style='color:#4a4d9f'>발송 예정</span><br><span class='push-time'>(" + pushTime + ")</span></p>";
				    		}    				    		
			    		}
				    },
				    {title: "발송날짜" 	  , field: "pushTime"  , visible: false},    				    
				    {cellClick: function(e, cell){ getHistoryData(e, cell); }, title:"불러오기", width: 150, headerSort: false, resizable:false,
				    	formatter:function(e, cell) {
				    			return "<button type='button' class='btn-push-load'>선택</button>";	
				    	}
				    }
			    ]			  
			});

    		//Data set
    		gridPsh001.on("tableBuilt", function(){				
    			gridPsh001.setData(result);			    				
    		});
    	}
    });		    
}

//데이터 불러오기
function getHistoryData(e, cell) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"pushSeq"      : cell._cell.row.data.pushSeq
	};
	
	commonAjax.call("/psh/getPushInfo", "POST", params, function(data) {
		if (data.message == "OK") {
			popupClose();
			const targetChk = document.querySelectorAll('input[name="targetType"]');
			
			for (let i=0; i < targetChk.length; i++) {
				targetChk[i].checked = false;
			}
			
			const result = data.result;
			 
			if (result.pushType == "1"){
				const time = result.pushTime;
				
				document.getElementById('radio2').click();
				document.getElementById('pushDate').value = time.substring(0, 13);
				document.getElementById('pushMinute').value = time.slice(-2, time.indexEnd);
				
				if (time.substring(14,16) == '오전') {
					document.getElementById('pushHour').value = time.substring(17,19);
				} else {
					document.getElementById('pushHour').value = Number(time.substring(17,19)) + 12;
				}
				
			} else {
				document.getElementById('radio1').click();
			}
			
			if (result.pushTargetAdr == "Y"){
				document.getElementById('android').checked = true;
			}
			if (result.pushTargetIos == "Y"){
				document.getElementById('ios').checked = true;
			}
			if (result.pushTargetEtc == "Y"){
				document.getElementById('specific').checked = true;
				showSpecificBox();
				
				//특정 조건 checked
				if (result.pushCond1 == "0") {
					document.getElementById('userAll').checked = true;
				} else if (result.pushCond1 == "1") {
					document.getElementById('userFirst').checked = true;
				} else {
					document.getElementById('userVisit').checked = true;
				}
				
				if (result.pushCond2 == "0") {
					document.getElementById('genderAll').checked = true;
				} else if (result.pushCond2 == "1") {
					document.getElementById('male').checked = true;
				} else {
					document.getElementById('female').checked = true;
				}
				
				if (result.pushCond3 != "0") {
					document.getElementById('ageSelect').click();
					ageSelectClick();
					
					const ageArr = result.pushCond3.replace(/\"/gi, "").split(',');
					
					for (let i=0; i < ageArr.length; i++) {
						document.querySelector('#age' + ageArr[i]).click();
					}
				}
				
				if (result.pushCond4 != "0") {
					document.getElementById('payInput').click();
					document.querySelector('.total-pay').value = result.pushCond4;
				}
				
				if (result.pushCond5 != "0") {
					document.getElementById('staffSelect').click();
					document.getElementById('doctor').value = result.fixedDoctorCode;
					document.getElementById('staff').value = result.fixedStaffCode;
				}
				
				if (result.pushCond6 != "0") {
					document.getElementById('gradeSelect').click();
					const grade = document.getElementById('grade'); 
					
					for (let i=0; i < grade.options.length; i++) {
						
						if (grade.options[i].innerText == result.pushCond6 ) {
							grade.options[i].selected = true;
						}
					} 
				}
			}
			
			document.getElementById('messageTitle').value = result.messageTitle;
			document.getElementById('messageContent').value = result.messageContent;
			document.getElementById('pushLink').value = result.pushLink;

		    if (result.messageImage) {
				document.getElementById('pushImg').style.display = 'block';
				document.getElementById('pushImg').src = '';
				document.getElementById('pushImg').src = result.messageImage;
				document.getElementById('pushImg').style.margin = '75px 0 13px 12px';
			    document.querySelector('.img-del').classList.add('show');
		    }
		}
	});
} 