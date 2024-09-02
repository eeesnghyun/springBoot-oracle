var WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
	
function initSelect(hospitalCode, officeCode) {	
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;	
	document.getElementById("officeCode").value = officeCode;	
	
	getReserveMtInfo();
	tabBtn();
}

function getReserveMtInfo() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/res/getReserveMtInfo", "POST", params, function(data){
		if (data.message == "OK") {
			commonSetOfficeSite(".page-url", params);
			
			const mtInfo = data.resultInfo.mtInfo;
			const holidayList = data.resultInfo.holidayList;
			
			drawHoliday(holidayList);
			
			if (!isNullStr(mtInfo)) {
				//기타 예약 설정
				const checkArea = document.querySelector(".check-area");				
				checkArea.innerHTML = "";
				
				for (let i = 0; i < mtInfo.length; i++) {
					checkArea.innerHTML += 	
						`<div>
			                <input type="checkbox" name="rGrade" class="cm-toggle" data-code="${mtInfo[i].gradeCode}" onclick="updateEtc(this)" ${mtInfo[i].isChecked == "Y" ? "checked" : ""}>
			                <p><b>${mtInfo[i].gradeName}</b>일 경우 인원 설정 무시</p>
			            </div>`;	
				}					
			}
			
			getReserveDayList(document.querySelectorAll('.tab li')[0].dataset.num);
			document.querySelector('.spec-date').dataset.date = '1';	
		} else {
			alert(data.message);
		}
	});		
}

function updateEtc(obj) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"gradeCode"	   : obj.dataset.code,		
		"useYn"		   : obj.checked == true ? "Y" : "N"
	};

	commonAjax.call("/res/updateReserveGrade", "POST", params , function(data) {
		if (data.message == "OK") {	
			
		}
	});
}

//예약 휴무일 팝업
function popHoliday(type , target){
    const popup = document.querySelector('#popupInner');    
	const content = 
        `<div class="popup-tit">
            <p>휴무일 추가</p>
        </div>
        
        <div class="popup-con" style="width:360px">
			<div>
				<label class="need">휴무일 메모</label>
        		<input type="text" id="holidayName" placeholder="메모를 입력해 주세요." required>
			</div>
			
			<div class="date-area">
            	<label for="holidayDate" class="need">휴무일</label>
            	<div class="area">
			        <div class="con date">
		       			<input type="text" class="start-date" id="holidayDate" name="holidayDate" placeholder="휴무일 입력" autocomplete="off" required>
			        </div>
            	</div>
			</div>
		</div>

        <div class="popup-btn">
            <button class="save-btn blue-btn" type="button" onclick="insertReserveHoliday(this)">저장하기</button>
        </div>`;
	
    commonDrawPopup("draw", content);
	commonDatePicker(["holidayDate"], '', '' , true);
	
	if (type == 'edit'){
		document.querySelector('.popup-tit p').innerHTML = '휴무일 수정';
		document.getElementById("holidayName").value = target.querySelector('p.name').innerHTML;
		document.querySelector(".popup button").dataset.seq = target.dataset.seq;
		
		const date = target.querySelector('.date-txt').innerHTML.replace(/[^0-9]/g, '');
		document.getElementById("holidayDate").value = `${date.substr(0,4)}년 ${date.substr(4,2)}월 ${date.substr(6,2)}일 `
	}
}

//예약 휴무일 그리기
function drawHoliday(result){
	const div = document.querySelector('.left-area ul.list');
	
	div.innerHTML = "";
	
	for (let i = 0; i < result.length; i++) {
		const year = result[i].holidayDate.substr(0,4);
		const month = result[i].holidayDate.substr(4,2);
		const day = result[i].holidayDate.substr(6,2);
		
		div.innerHTML += 
			`<li onclick="popHoliday('edit' , this)" data-seq="${result[i].holidaySeq}">
	           <p class="name">${result[i].holidayName}</p>
	           <p class="date-txt">${year}년 ${month}월 ${day}일</p>
	           <button type="button" class="del-btn" value="${result[i].holidayDate}" onclick="deleteReserveHoliday(this)"></button>
             </li>`
	}
}

//예약 휴무일 저장
function insertReserveHoliday(target){
	const list = document.querySelectorAll('.left-area .list li button');    
	const holidayName = document.getElementById("holidayName").value;
	const holidayDate = document.getElementById("holidayDate").value;

	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"holidayDate"  : holidayDate.replace(/[^0-9]/g,''),
		"holidayName"  : holidayName,
		"holidaySeq"   : target.dataset.seq
	}
	
	if (isNullStr(holidayDate)) {
		alert('날짜를 입력해주세요.');	
		return;
	} else {
		for (let i = 0; i < list.length; i++) {
			if (list[i].value == holidayDate.replace(/[^0-9]/g,'')){
				alert('다른 날짜를 입력해주세요');	
				return;
			}
		}
	}
	
	if (isNullStr(holidayName)) {
		alert('메모를 입력해주세요.');
		return;
	}
	
	commonAjax.call("/res/insertReserveHoliday", "POST", params, function(data){
		if (data.message == "OK") {	
			getReserveMtInfo();
			
			document.querySelector(".popup .del-btn").click();
		} else {
			alert(data.message);
		}
	});		
}

//예약 휴무일 삭제
function deleteReserveHoliday(target){
    event.stopPropagation();
    
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"holidayDate"  : target.value
	}
	
	if (confirm('삭제하시겠습니까?')) {
		commonAjax.call("/res/deleteReserveHoliday", "POST", params, function(data){
			if (data.message == "OK") {
				alert('삭제되었습니다.');			
				getReserveMtInfo();
				
				document.querySelector(".popup .del-btn").click();
			} else {
				alert(data.message);
			}
		});	
	}
}

function getReserveDayList(dataDay){	
	const day = document.querySelectorAll('.tab li');
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"dataDay"      : dataDay,
			"resDate"      : '00000000'
	};

	commonAjax.call("/res/getReserveDayList", "POST", params, function(data){
		if (data.message == "OK") {
			const dayList = data.resultList.dayList;	 //예약시간 및 인원설정
			const mtList = data.resultList.mtList;      //대분류
			const subList = data.resultList.subList;	 //소분류 인원설정
			
		    document.querySelector('.table').innerHTML = "";

			drawTable(mtList , dayList , 'table');
			
			fillTable(dayList , '.col1');
			drawSubList(subList , '.right-area ul');
			
			allInputFill();
		} else {
			alert(data.message);
		}
	});			
}

function popSubList(){
    const popup = document.querySelector('#popupInner');    
	const secDate = document.querySelector('.spec-date');    
	
	const content = 
        `<div class="popup-tit">
            <p>특정 소분류 인원 추가</p>
         </div>
        
         <div class="popup-con person" style="width:310px">
			<div>
				<label class="need">요일</label>
        		<input type="text" id="dataDay" data-date="${secDate.dataset.date}"  value="${secDate.innerHTML}" disabled>
			</div>
			
        	<div>
                <label class="need">대분류</label>
                <div class="select">
					<div class="select-box">
				    	<select id="prdMtList" onchange="getProductMtSubList(this.value)"></select>
						<div class="icon-arrow"></div>	
					</div>
					
					<div class="select-box">
				    	<select id="prdSubList" class="small"></select>
						<div class="icon-arrow"></div>	
					</div>
                </div>
        	</div>
			
			<div>
				<label class="need">인원 설정</label>
        		<input type="text" id="resCnt" placeholder="0" onkeyup="commonMoneyFormat(this.value , this)">
			</div>
			
			<div>
				<label class="need">시간 설정</label>
				<div class="select-box">
			    	<select id="resTime">
			    		<option value="30">30분</option>
			    		<option value="60">60분</option>
			    		<option value="90">90분</option>
			    		<option value="120">120분</option>
			    	</select>
					<div class="icon-arrow"></div>	
				</div>
			</div>
		</div>

        <div class="popup-btn">
            <button class="save-btn blue-btn" type="button" onclick="insertReserveSub()">저장하기</button>
        </div>`;
	
    commonDrawPopup("draw", content);
    getProductMtList();
}

//대분류 코드 그리기
function getProductMtList(){
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
		} else {
			alert(data.message);
		}
	});
}

//소분류 코드 그리기
function getProductMtSubList(prdMstCode){
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"prdMstCode"   : prdMstCode,
			"resDate"      : '00000000',
			"dataDay"      : document.querySelector(".spec-date").dataset.date
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
			}						
		} else {
			alert(data.message);
		}
	});
}

function insertReserveSub(){
	const resTime = document.getElementById("resTime");
	const prdSubList = document.getElementById("prdSubList");
	const dataDay = document.getElementById("dataDay").dataset.date;
	const resCnt = document.getElementById("resCnt").value;
	
	if (isNullStr(resCnt)) {
		alert('인원 설정을 입력해주세요.');
		return
	}
	
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"dataDay"      : dataDay,
			"prdSubCode"   : prdSubList.options[prdSubList.selectedIndex].value,
			"resCnt"       : resCnt,
			"resTime"      : resTime.options[resTime.selectedIndex].value,
			"resDate"      : '00000000'
	};
	
	commonAjax.call("/res/insertReserveSub", "POST", params , function(data) {
		if (data.message == "OK") {
			alert('저장되었습니다.');
			document.querySelector(".popup .del-btn").click();
			
			getReserveDayList(dataDay);
		} else {
			alert(data.message);
		}
	});
}

//예약 소분류 삭제
function deleteReserveSub(target){
    event.stopPropagation();
    
	const resTime = document.getElementById("resTime");
	const dataDay = document.querySelector(".spec-date").dataset.date;
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"resDate"      : '00000000',
		"dataDay"      : dataDay,
		"prdSubCode"   : target.dataset.sub
	};
	
	if ((confirm('삭제하시겠습니까?'))) {
		commonAjax.call("/res/deleteReserveSub", "POST", params , function(data) {			
			if (data.message == "OK") {
				alert('삭제되었습니다.');
				
				getReserveDayList(dataDay);
			} else {
				alert(data.message);
			}
		});	
	}
}

//예약 소분류 그리기
function drawSubList(result , target , type){
	const div =  document.querySelector(`${target}`);

	div.innerHTML = "";
	for (let i = 0; i < result.length; i++) {
		div.innerHTML += 
			`<li data-mst="${result[i].prdMstCode}" data-code="${result[i].prdSubCode}">
               <p class="name">[${result[i].prdMstName}] ${result[i].prdSubName}</p>
               <p class="count">${result[i].resCnt}</p>
               <p class="time">${result[i].resTime}분</p>
               <button type="button" class="del-btn" data-sub="${result[i].prdSubCode}" onclick="deleteReserveSub(this)"></button>
            </li>`
		
		if (type == 'popup') {
			div.querySelectorAll('button')[i].setAttribute('onclick' , 'deleteReserveSubPop(this)');
		}
	}
}

//예약시간, 인원설정 저장
function updateReserve(){    
	const mask = document.querySelector('.center-area .con-area');
	const time = document.querySelectorAll('ul.time-table li');
	const person  = document.querySelectorAll('ul.person-table li:not(.copy-table) input');
	const dataDay = document.querySelector('ul.tab li.active').dataset.num;
	const mtList = document.querySelectorAll('.num-area ul');
	var saveList = []; 
	
	for (let i = 0; i < time.length; i++) {
		let saveJson = new Object();
		saveJson.hhmm   = time[i].value;
		saveJson.maxCnt = person[i].value;
		
		var dataList = [];
		
		for (let j = 0; j < mtList.length; j++) {
			let dataJson = new Object();
			
			dataJson.prdMstCode = mtList[j].dataset.code;
			dataJson.resCnt = mtList[j].querySelectorAll('li:not(.copy-table) input')[i].value;
			
			dataList.push(dataJson);
		}
	
		saveJson.dataList = dataList;
		saveList.push(saveJson);
	}	
		
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,   
		"resDate"      : '00000000',
		"dataDay"      : dataDay,	
		"saveList"     : JSON.stringify(saveList)
	};

	mask.classList.add('active');

	setTimeout(function(){
		commonAjax.call("/res/updateReserve", "POST", params , function(data) {
			if (data.message == "OK") {		
				mask.classList.remove('active');
			} else {
				alert(data.message);
			}
		});	
	}, 0);
}

function drawTable(mtList, dayList , target){
	let timeCount = 0;
	const table   = document.querySelector(`.${target}`);
	table.innerHTML = '';
	
	const timeTable = document.createElement('ul');	//시간
	timeTable.classList.add('time-table');
	table.appendChild(timeTable);
	timeTable.innerHTML = '<label class="tit-table">시간</label><label></label>';
	
	if (isNullStr(dayList)) {
		//초기값 설정				
		timeCount = 22;
		var hour = 10;
		
		for (let i = 0; i < timeCount; i++){
			timeTable.innerHTML += '<li></li>';
			
			const time = document.querySelectorAll(`.${target} .time-table li`)[i];
			                           
				if (i == 0) {
					time.value = `${hour}00${hour}30`;
					time.innerHTML += `${hour}:00 ~ ${hour}:30`;
				} else if (i%2 == 1){ //홀수
					time.value = `${hour}30${hour+1}00`;
					time.innerHTML += `${hour}:30 ~ ${hour + 1}:00`;
					hour++;
				} else {              //짝수
					time.value = `${hour}00${hour}30`;
					time.innerHTML += `${hour}:00 ~ ${hour}:30`;
				}	
		}		
	} else {
		timeCount = dayList.length;
		
		for (let i = 0; i < dayList.length; i++) {
			const sHour = dayList[i].hhmm.substr(0,2);
			const sMin  = dayList[i].hhmm.substr(2,2);
			const eHour = dayList[i].hhmm.substr(4,2);
			const eMin  = dayList[i].hhmm.substr(6,2);

			timeTable.innerHTML += 
				`<li value="${dayList[i].hhmm}">${sHour}:${sMin}~${eHour}:${eMin}</li>`;
		}				
	}	
	
	//분류
	const mtTable = document.createElement('div');
	mtTable.classList.add('num-area');
	table.appendChild(mtTable);
	mtTable.classList.add('scroll-x');
	
	for (let i = 0; i < mtList.length; i++) {
		mtTable.innerHTML += 
			`<ul class="data-table" data-code="${mtList[i].prdMstCode}">
                <label class="tit-table">${mtList[i].prdMstName}</label>
                <li class="copy-table"><input type="text"></li>
            </ul>`;
		
		for (let j = 0; j < timeCount; j++) {
			table.querySelectorAll('.data-table')[i].innerHTML += '<li><input type="text" value="0"></li>';
		}
	}
	
	//인원
	const personTable = document.createElement('ul');
	personTable.classList.add('person-table');
	table.appendChild(personTable);
	
	personTable.innerHTML = 
		`<label class="tit-table">인원</label>
         <li class="copy-table"><input type="text"></li>`;
	
	for (let i = 0; i < timeCount; i++) {
		table.querySelector('.person-table').innerHTML += `<li><input type="text" value="0"></li>`
	}
	
	addUnLimit();
	checkNumInput();
}

//데이터 채우기
function fillTable(result, target){
	var cnt= 1;
	
	for (let i = 0; i < result.length; i++) {
		const prdMstArr = result[i].prdMstCode.split('|');
		const resCntArr = result[i].resCnt.split('|');
		
		document.querySelectorAll(`${target} .person-table li:not(.copy-table) input`)[i].value = result[i].maxCnt; //인원설정
		
		for (let j = 0; j < resCntArr.length; j++) {
			const ul = document.querySelectorAll(`${target} .num-area ul`)[j].querySelectorAll('input')[cnt];
			
			if (ul.parentElement.classList.contains('unlimit')) {
				ul.parentElement.classList.remove('unlimit');
            	ul.value = '0';
				ul.setAttribute("type", "");
				ul.parentElement.querySelector('i').remove();
			}
			
			if (resCntArr[j] == '999') {
				ul.value = resCntArr[j];				
				ul.value = null;
				ul.value = '999';
				ul.setAttribute("type", "hidden");
				ul.parentElement.classList.add('unlimit');
				ul.parentElement.innerHTML += '<i class="unlimit"></i>';
			} else {
				ul.value = resCntArr[j];	
			}
		}
		cnt++;
	}
}

//인원설정 채우기(상단)
function allInputFill(type){
    const popup = document.querySelector('.popup');
    var tr;
    
    if (type == 'popup') {
    	tr = document.querySelectorAll('.popup .copy-table input');
    } else {
    	tr = document.querySelectorAll('.col1 .copy-table input');
    }

    for (let i = 0; i < tr.length; i++) {
        tr[i].addEventListener('keyup' , function(e){
            if (e.keyCode == 13) {
                const td = tr[i].parentElement.parentElement.querySelectorAll('input');

                td.forEach((ele) => {
                    const parent = ele.parentElement;
                    if (parent.classList.contains('unlimit')) {
                        parent.classList.remove('unlimit');
                        parent.querySelector('i').remove();
                    }
                    ele.value = tr[i].value;
                });
            }
        })
    }
}

function tabBtn(){
    const li = document.querySelectorAll('ul.tab li');
    
    for (let i = 0; i < li.length; i++) {
        li[i].addEventListener('click',function(){    
            updateReserve(); //이전요일 저장하기
            
            li.forEach((ele) => ele.classList.remove('active'));
            
            li[i].classList.add('active');
            removeInput();
            
            getReserveDayList(li[i].dataset.num);
            document.querySelector('.spec-date').innerHTML = li[i].innerHTML;
            document.querySelector('.spec-date').dataset.date = li[i].dataset.num;
            document.querySelector('.center-area button.basic').innerHTML = `${li[i].innerHTML} 저장`;
        });
    }
}

//테이블 input 초기화(무제한 설정도 같이)
function removeInput(){
    const input = document.querySelectorAll('.col .table input');

    for (let i = 0; i < input.length; i++) {
        const parent = input[i].parentElement;
        if (parent.classList.contains('unlimit')) {
            parent.classList.remove('unlimit');
            parent.querySelector('i').remove();
        }

        input[i].value = null;
    }
}

//인원설정 무제한 활성화
function addUnLimit(){
    const input = document.querySelectorAll('.data-table li:not(.copy-table)');

    for (let i = 0; i < input.length; i++) {
        input[i].addEventListener('mousedown', function(e) {
            if (e.which == '3' && !input[i].classList.contains('unlimit')) {
                input[i].classList.add('unlimit');
            	input[i].querySelector('input').value = null;
            	input[i].querySelector('input').value = '999';
            	input[i].querySelector('input').setAttribute("type", "hidden");
                input[i].innerHTML += '<i class="unlimit"></i>';
            }
        });

        input[i].addEventListener('click', function() {
            if (input[i].classList.contains('unlimit')) {
                input[i].classList.remove('unlimit');
            	input[i].querySelector('input').value = '0';
            	input[i].querySelector('input').setAttribute("type", "");
                input[i].querySelector('i').remove();
            }
        });
    }
}

//예약 시간,인원 설정 복사 팝업
function popCopy() {
    const popup = document.querySelector('#popupInner');    
    
	const content = 
            `<div class="popup-tit">
                <p>인원 설정 복사</p>
            </div>
           
            <div class="popup-con person copy" style="width:490px">
            	<div>
					<div class="select-box">
				    	<select id="popDataDay">
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
					
					<span>설정을</span>
					
					<div class="select-box">
				    	<select id="popCopyDay" class="small">
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
					
					<span>설정으로 복사합니다.</span>
            	</div>
			</div>

            <div class="popup-btn">
                <button class="save-btn blue-btn" type="button" onclick="insertReserveCopy()">복사하기</button>
            </div>`;
    	
    commonDrawPopup("draw", content);
}

//예약 시간,인원 설정 복사 저장
function insertReserveCopy(){
	const dataDay = document.getElementById("popDataDay");
	const copyDay = document.getElementById("popCopyDay");
	
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,   
			"resDate"      : '00000000',
			"dataDay"      : dataDay.options[dataDay.selectedIndex].value,
			"copyDay"      : copyDay.options[copyDay.selectedIndex].value
	};
	
	commonAjax.call("/res/insertReserveCopy", "POST", params , function(data) {
		if (data.message == "OK") {		
			alert('저장되었습니다.');
			popupClose();
			
			getReserveDayList(dataDay.options[dataDay.selectedIndex].value);
		} else {
			alert(data.message);
		}
	});	
}

//예약 마감 확인 팝업
function checkReservePop() {
	const today = commonGetToday();
    const popup = document.querySelector('#popupInner');        
	const content = 
            `<div class="popup-tit">
                <p>예약 마감 확인</p>
            </div>
           
            <div class="popup-con check" style="width:490px">
            	<div class="date-area">
            		<button class="prev" type="button" onclick="dateButton('prev')"></button>
        			<input type="text" id="checkDate" name="checkDate" autocomplete="off">
            		<button class="next" type="button" onclick="dateButton('next')"></button>
            	</div>
			
				<ul class="check-reserve"></ul>
			</div>`;
    	
	
    commonDrawPopup("draw", content);
 
	const d = WEEKDAY[new Date().getDay()];	
	document.getElementById('checkDate').value = commonGetToday('y년m월d일', '') + ' ' + '(' + d + ')';
    
    commonDatePicker(["checkDate"] , 'day' , getReserveCloseList);
    
    getReserveCloseList();
}

//예약 마감 리스트 조회 
function getReserveCloseList() {
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,   
			"resDate"      : document.getElementById('checkDate').value.replace(/[^0-9]/g , '')
	};
	
	commonAjax.call("/res/getReserveCloseList", "POST", params , function(data) {
		if (data.message == "OK") {		
			const result = data.resultList;
			const div = document.querySelector('.check-reserve');
			
			div.innerHTML = "";
			
			if (result.length > 0) {
				for (let i =0; i < result.length; i++) {
					div.innerHTML +=
						`<li>
							<span class="nowTime">${result[i].createDate}</span>
							<span class="finTime">${result[i].hhmm}</span>
							<span class="prdMst"><bold>${result[i].prdMstName}</bold> ${result[i].content}</span>
						</li>`;
				}	
			} else {
				div.innerHTML += '<div class="no-data"><span>예약 마감된 시간이 없습니다.</span></div>';
			}
		}
	});
}

//예약 마감 확인 팝업 달력 제어
function dateButton(type) {		
	const today = document.getElementById('checkDate').value.replace(/[^0-9]/gi, "");	
	let nextDate = new Date(today.substr(0,4), today.substr(4,2)-1, today.substr(6));
	
	if (type == 'prev') {			
		nextDate.setDate(nextDate.getDate() - 1);
	} else {
		nextDate.setDate(nextDate.getDate() + 1);
	}	

	const day = ("0" + nextDate.getDate()).slice(-2);
	const month = ("0" + (nextDate.getMonth() + 1)).slice(-2);
	
	document.getElementById('checkDate').value = `${nextDate.getFullYear()}년 ${month}월 ${day}일 (${WEEKDAY[nextDate.getDay()]})`;	
	$('#checkDate').datepicker().data('datepicker').selectDate(new Date(nextDate.getFullYear(), month - 1, day));
}

//예약시간 인원 설정 숫자만 입력
function checkNumInput(){
	const input = document.querySelectorAll('.table input');   
	
	for (let i = 0; i < input.length; i++) {
		input[i].addEventListener("keyup", function(){
			input[i].value = input[i].value.toString().replace(/[^\d]+/g, '');
		});
	}
}
