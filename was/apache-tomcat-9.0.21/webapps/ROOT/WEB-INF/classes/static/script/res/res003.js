function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;	
	document.getElementById("officeCode").value = officeCode;	

	getOfficeReserve();
}

//지점별 데이터 조회
function getOfficeReserve() {
	getProductMtList();			//대분류 조회	
	getAutoReserveTimeList();	//시간 조회	
	getAutoExceptProduct();		//예외 소분류 조회
	getAutoExceptGrade();		//예외 등급 조회
}

//자동승인 시간대 확인
function isAutoTime() {
	let result = false;
	let timeArray = [];

	const date = new Date();
	const day  = date.getDay();		//0:일 ~ 6:토	  
	let time   = date.getHours();	//시+분 계산
	
	if (date.getMinutes() < 10) {
		time = time + "0" + date.getMinutes();
	} else {
		time = time + ""  + date.getMinutes();
	}
	
	const area = document.getElementById("dateTimeArea").querySelectorAll(`li[data-seq='${day}'] .time-table .txt span`);	
	area.forEach(function(el) {
		if (el.parentElement.parentElement.parentElement.style.opacity == "1") {
			timeArray.push(Number(el.innerHTML.replace(":","")));
		}
	});
	
	const maxValue = Math.max(...timeArray);
	const minValue = Math.min(...timeArray);
	
	//Min ~ Max에 현재 시간이 포함되어 있다면 true 리턴
	if (minValue <= Number(time) && Number(time) < maxValue) {
		result = true;
	}
	
	return result;
}

//자동승인 설정
function updateOfficeSetting() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"useYn"		   : document.getElementById("autoCheck").checked == true ? "Y" : "N"
	};
	
	commonAjax.call("/res/updateOfficeSetting", "POST", params , function(data) {
		if (data.message == "OK") {
			if (document.getElementById("autoCheck").checked) {
				setButtonDisign("on");
			} else {
				setButtonDisign("off");
			}
		}
	});	
}

//자동승인 버튼 디자인 셋팅
function setButtonDisign(type) {
	const chkBox = document.getElementById("autoCheck");	
	const span = document.querySelector('.auto-area > div > p');
	const btn  = document.querySelector('button.btn-auto');		
	
	if (type == "on") {		//승인 진행 중(on)
		if (isAutoTime()) {
			span.innerHTML = 'ON';		
			chkBox.value   = "Y";
			btn.classList.remove('not');
			btn.classList.remove('end');
			btn.classList.add('ing');
			btn.innerHTML = '현재 자동 승인 진행 중';
		} else {
			span.innerHTML = 'ON';
			chkBox.value   = "Y";
			btn.classList.remove('ing');
			btn.classList.remove('end');
			btn.classList.add('not');
			btn.innerHTML = '현재 자동 승인 시간대가 아님';
		}
	} else {				//승인 중지(off)
		span.innerHTML = 'OFF';
		chkBox.value   = "N";
		btn.classList.remove('not');
		btn.classList.remove('ing');
		btn.classList.add('end');
		btn.innerHTML = '자동 승인 중지';
	}
}

//대분류 그리기
function getProductMtList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
	};
	
	commonAjax.call("/prd/getProductMtList", "POST", params , function(data) {
		const result = data.resultList;		
		
		if (data.message == "OK") {
			if (result.length > 0) {				
				let dataList = new Array();

				for (idx in result) {			
			        let data = new Object();
			         
			        data.code = result[idx].prdMstCode;
			        data.name = result[idx].prdMstName;

					dataList.push(data);	
				}
				
				const comboObj = {"target" : "prdMtList", "data" : dataList};							
				commonInitCombo(comboObj);	
			
				getProductMtSubList(result[0].prdMstCode);
			}						
		}
	});
}

//소분류 코드 그리기
function getProductMtSubList(prdMstCode) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdMstCode"   : prdMstCode
	};

	commonAjax.call("/prd/getProductMtSubList", "POST", params , function(data) {
		const result = data.resultList;		

		if (data.message == "OK") {
			if (result.length > 0) {
				let dataList = new Array();

				for (idx in result) {			
			        let data = new Object();
			         
			        data.code = result[idx].prdSubCode;
			        data.name = result[idx].prdSubName;

					dataList.push(data);	
				}
				
				const comboObj = {"target" : "prdSubList", "data" : dataList};							
				commonInitCombo(comboObj);
				
				setDisabledItem();
			} else {
				document.getElementById("prdSubList").innerHTML = "<option value=''>소분류 없음</option>";
			}			
		}
	});
}

//자동승인 예외 등급 조회
function getAutoExceptGrade() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};

	commonAjax.call("/res/getAutoExceptGrade", "POST", params , function(data) {
		const result = data.resultList;		

		if (data.message == "OK") {
			const area = document.querySelector(".check-area");
			area.innerHTML = "";
			
			for (let i = 0; i < result.length; i++) {
				if (i == 0) {
					area.innerHTML += 
						`<div>
				            <input type="checkbox" class="cm-toggle" data-code="${result[i].gradeCode}" onclick="updateAutoExceptGrade(this)" ${result[i].useYn == "Y" ? "checked" : ""}>
				            <p><b>${result[i].gradeName}</b>이 있는 경우</p>
				        </div>`;	
					
					//자동승인 설정버튼 체크
					if (result[i].autoReserve == "Y") {
						document.getElementById("autoCheck").checked = true;	
						
						setButtonDisign("on");
					} else {
						setButtonDisign("off");
					}									
				} else {
					area.innerHTML += 
						`<div>
				            <input type="checkbox" class="cm-toggle" data-code="${result[i].gradeCode}" onclick="updateAutoExceptGrade(this)" ${result[i].useYn == "Y" ? "checked" : ""}>
				            <p><b>${result[i].gradeName}</b> 등급 자동승인 예외</p>
				        </div>`;
				}				
			}
		}
	});
}

//자동승인 예외 등급 저장
function updateAutoExceptGrade(obj) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"gradeCode"	   : obj.dataset.code,		
		"useYn"		   : obj.checked == true ? "Y" : "N"
	};

	commonAjax.call("/res/updateAutoExceptGrade", "POST", params , function(data) {
		if (data.message == "OK") {	
			
		}
	});
}

//자동승인 예외 소분류 조회
function getAutoExceptProduct() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};

	commonAjax.call("/res/getAutoExceptProduct", "POST", params , function(data) {
		if (data.message == "OK") {			
			const result = data.resultList;
			const area = document.querySelector('ul.add-list');
			area.innerHTML = "";
			
			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					area.innerHTML +=
						`<li data-sub="${result[i].prdSubCode}">
							${result[i].prdSubName}
							<button type="button" class="del-btn" onclick="deleteProductSub(this)"></button>
						</li>`;										
				}			
			}				
			
			setDisabledItem();
		}		
	});	
}

//예외 소분류를 포함한 콤보박스 옵션 비활성화
function setDisabledItem() {
	const exceptProduct = [];	
	//예외 소분류 리스트
	document.querySelectorAll(".add-list li").forEach(el => exceptProduct.push(el.dataset.sub));

	const productSub = document.getElementById("prdSubList").options;
	
	for (let i = 0; i < productSub.length; i++) {
		if (exceptProduct.includes(productSub[i].value)) {
			productSub[i].disabled = true;
		} else {
			productSub[i].disabled = false;
		}
	}
}

//자동승인 예외 소분류 추가
function addProductSub() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdSubCode"   : document.getElementById("prdSubList").value
	};

	commonAjax.call("/res/insertAutoExceptProduct", "POST", params , function(data) {
		if (data.message == "OK") {			
			const productSub = document.getElementById("prdSubList");
			const value = productSub.value;
			const txt   = productSub.options[productSub.selectedIndex].text;			

			productSub.options[productSub.selectedIndex].disabled = true;
			
			document.querySelector('ul.add-list').innerHTML += 
				`<li data-sub="${value}">
					${txt}
					<button type="button" class="del-btn" onclick="deleteProductSub(this)">
				</li>`;				
		} else {
			if (data.message == "Duplicate data") {
				alert("중복 데이터가 존재합니다.");	
			}			
		}		
	});	
}

//자동승인 예외 소분류 삭제
function deleteProductSub(target) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdSubCode"   : target.parentElement.dataset.sub
	};

	commonAjax.call("/res/deleteAutoExceptProduct", "POST", params , function(data) {
		if (data.message == "OK") {			
			getAutoExceptProduct();
		}		
	});	
}

//자동승인 시간 클릭 이벤트
function setTimeHover() {
	const div = document.querySelectorAll('div.txt');
	
	for (let i = 0; i < div.length; i++) {
		div[i].addEventListener('click' , function(e){
			if (e.target.parentElement == e.currentTarget){
				const area = document.querySelectorAll('.hover-area');
				
				if (div[i].classList.contains('show')) {
					div[i].classList.remove('show');
					area[0].remove()
				} else {					
					if (area.length > 0) {
						area[0].remove();
						div.forEach((ele) => ele.classList.remove('show'))
					}
			
					div[i].innerHTML += 
						`<div class='hover-area'>
		                	<ul class="start scroll"></ul>

			                <ul class="end scroll"></ul>

			                <button class="button" onclick="s">적용하기</button>
			            </div>`;
					
					drawTime(0, 24);	
					updateTime();
					div[i].classList.add('show');	
				}	
			}
		});
	}
}

//개별시간 그리기 
function drawTime(start, end, type) {
	let hh = start;

	if (type == 'popup') {
		const sDiv = document.querySelector('.popup #startTime'); 
		const eDiv = document.querySelector('.popup #endTime');
		
		for (let i = 0; i < (end - start +1); i++) {
			sDiv.innerHTML += `<option>${String(hh).padStart(2,'0')}</option>`;
			eDiv.innerHTML += `<option>${String(hh).padStart(2,'0')}</option>`;	
			
			hh++;
		}	
		
		eDiv.value = 24;
	} else {
		const sDiv = document.querySelector('.hover-area ul.start');
		const eDiv = document.querySelector('.hover-area ul.end');
		
		for (let i = 0; i < ((end - start) * 2) + 1; i++) {
			if (i == 0) {
				sDiv.innerHTML += `<li>${String(hh).padStart(2,'0')}:00</li>`;
				eDiv.innerHTML += `<li>${String(hh).padStart(2,'0')}:00</li>`;	
			} else {
				if (i % 2 === 0) {
					hh++;
					sDiv.innerHTML += `<li>${String(hh).padStart(2,'0')}:00</li>`;
					eDiv.innerHTML += `<li>${String(hh).padStart(2,'0')}:00</li>`;	
				} else {
					sDiv.innerHTML += `<li>${String(hh).padStart(2,'0')}:30</li>`;
					eDiv.innerHTML += `<li>${String(hh).padStart(2,'0')}:30</li>`;	
				}
			}
		}	
	}
}

//개별시간 적용하기
function updateTime() {	
	const btn = document.querySelector('.hover-area button');
	const start = document.querySelectorAll('.hover-area ul.start li');
	const end   = document.querySelectorAll('.hover-area ul.end li');
	
	for (let i = 0; i < start.length; i++) {
		start[i].addEventListener('click' , function(){
			start.forEach((el) => el.classList.remove('active'));
			start[i].classList.add('active');
		});
		
		end[i].addEventListener('click' , function(){
			end.forEach((el) => el.classList.remove('active'));
			end[i].classList.add('active');
		});	
	}
	
	btn.addEventListener('click',function(e){	//적용하기
		const parent = document.querySelector('.hover-area').parentElement.parentElement;
		const start  = document.querySelector('.hover-area ul.start li.active').innerHTML;
		const end    = document.querySelector('.hover-area ul.end li.active').innerHTML;	
		
		if (Number(start.replace(':','')) > Number(end.replace(':',''))) {
			alert("시작시간이 종료시간보다 클 수 없습니다.");
			return;
		}
			
		parent.querySelectorAll('ul.con-date span')[0].innerHTML = start;
		parent.querySelectorAll('ul.con-date span')[1].innerHTML = end;
		
		document.querySelector('.hover-area').remove();
		document.querySelector('div.txt.show').classList.remove('show');
		
		const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,		
			"officeCode"   : document.getElementById("officeCode").value,
			"dataDay"      : parent.parentElement.querySelector(".rec-check").dataset.day,
			"timeSeq"      : parent.parentElement.querySelector(".rec-check").dataset.seq,
			"startTime"    : start.replace(':',''),
			"endTime"      : end.replace(':',''),		
			"useYn"		   : parent.parentElement.querySelector(".rec-check").checked == true ? "Y" : "N"
		};
		
		saveAutoReserveTime(params);
	});
}

//시간클릭 이벤트(사용,미사용)
function disabledTime() {
	const li = document.querySelectorAll('.con-date li input');
	
	for (let i = 0; i < li.length; i++) {
		li[i].addEventListener('click',function(){
			if (li[i].checked) {				
				li[i].parentElement.parentElement.style.opacity = '1';
			} else {
				li[i].parentElement.parentElement.style.opacity = '0.5';
			}
			
			updateAutoReserveTime(li[i]);
		});
	}
}

//자동승인 시간 수정
function updateAutoReserveTime(obj) {	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"dataDay"      : obj.dataset.day,
		"timeSeq"	   : obj.dataset.seq,
		"useYn"		   : obj.checked == true ? "Y" : "N"
	};

	saveAutoReserveTime(params);
}

//자동승인 시간 조회
function getAutoReserveTimeList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/res/getAutoReserveTimeList", "POST", params , function(data) {
		const result = data.resultList;		
		const area   = document.getElementById("dateTimeArea");
		
		if (data.message == "OK") {
			commonSetOfficeSite(".page-url", params);
			
			area.querySelectorAll(".con-date").forEach(function(el) {
				el.innerHTML = "";
			});
			
			if (result.length > 0) {												
				for (let i = 0; i < result.length; i++) {
					const id = "day" + result[i].dataDay + "_"+ result[i].timeSeq;
					
					area.querySelector(`li[data-seq='${result[i].dataDay}'] .con-date`).innerHTML +=
						`<li style="opacity: ${result[i].useYn == "Y" ? "1" : "0.5"}">
	                        <div>
	                        	<input id="${id}" class="rec-check" type="checkbox" data-day="${result[i].dataDay}"
																					data-seq="${result[i].timeSeq}" ${result[i].useYn == "Y" ? "checked" : ""}>
	                        	<label for="${id}"></label>
	                        </div>
	                        
	                        <div class="time-table">
	                        	<div class="txt">
             		                <span>${result[i].startTime}</span>
		                            <i>~</i>
		                            <span>${result[i].endTime}</span>
	                        	</div>
	                        </div>
	
	                        <button type="button" class="del-btn" onclick="deleteAutoReserveTime(this)"></button>
	                    </li>`;					
				}
				
				disabledTime();
				setTimeHover();
			}
		}
	});
}

//자동승인 시간 삭제
function deleteAutoReserveTime(obj) {	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"dataDay"      : obj.parentElement.querySelector(".rec-check").dataset.day,
		"timeSeq"	   : obj.parentElement.querySelector(".rec-check").dataset.seq
	};

	if (confirm("삭제하시겠습니까?")) {
		commonAjax.call("/res/deleteAutoReserveTime", "POST", params , function(data) {
			if (data.message == "OK") {
				obj.parentElement.remove();
				
				getAutoExceptGrade();
			}
		});	
	}	
}

//시간 추가 팝업 그리기 
function addTimePopup() {
	const content = 
        `<div class="popup-tit">
            <p>시간 추가</p>
        </div>
       
        <div class="popup-con" style="width:355px">
        	<div>
        		<label class="need">요일</label>
				<div class="select-box">
			    	<select id="popDataDay">
		                <option value="all">전체 요일</option>
		                <option value="1">월요일</option>
		                <option value="2">화요일</option>
		                <option value="3">수요일</option>
		                <option value="4">목요일</option>
		                <option value="5">금요일</option>
		                <option value="6">토요일</option>
		                <option value="0">일요일</option>
			    	</select>
					<div class="icon-arrow"></div>	
				</div>
        	</div>
        	
			<div class="time-area">
				<label class="need">자동 시간</label>	
				<div class="area">
					<div class="start">
						<div class="select-box">
					    	<select id="startTime" requried></select>
							<div class="icon-arrow"></div>	
						</div>
						
						<i>:</i>
						
						<div class="select-box">
					    	<select id="startMin">
    							<option value="00">00</option>
					    		<option value="30">30</option>
					    	</select>
							<div class="icon-arrow"></div>	
						</div>
					</div>
					
					<i>~</i>
					
					<div class="end">
						<div class="select-box">
					    	<select id="endTime" requried></select>
							<div class="icon-arrow"></div>	
						</div>
						
						<i>:</i>
						
						<div class="select-box">
					    	<select id="endMin">
    							<option value="00">00</option>
					    		<option value="30">30</option>
					    	</select>
							<div class="icon-arrow"></div>	
						</div>
					</div>
				</div>
				
				<div class="label">
                	<input id="active" class="rec-check" type="checkbox">
                	<label for="active"></label>
                	<label for="active">시간 활성화</label>
				</div>
			</div>
		</div>

        <div class="popup-btn">
            <button class="save-btn blue-btn" type="button" onclick="insertAutoReserveTime()">저장하기</button>
        </div>`;
	
		commonDrawPopup("draw", content);
		drawTime(0, 24 , 'popup');
}

//자동승인 시간 저장
function insertAutoReserveTime() {
	const startTime = document.getElementById("startTime").value + document.getElementById("startMin").value;
	const endTime   = document.getElementById("endTime").value + document.getElementById("endMin").value;
	
	if ((startTime + endTime) == "00000000") {
		alert("시간을 입력해주세요.");
		return;
	}
	
	if (startTime > endTime) {
		alert("시간시간이 종료시간보다 클 수 없습니다.");
		return;
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"dataDay"      : document.getElementById("popDataDay").value,
		"startTime"    : startTime,
		"endTime"      : endTime,		
		"useYn"		   : document.getElementById("active").checked == true ? "Y" : "N"
	};
	
	saveAutoReserveTime(params);
}

function saveAutoReserveTime(params) {
	commonAjax.call("/res/updateAutoReserveTime", "POST", params , function(data) {
		if (data.message == "OK") {						
			if (isPop) {
				alert("저장되었습니다.");
								
				popupClose();	
			}
			
			getAutoReserveTimeList();
			getAutoExceptGrade();
		}
	});
}

