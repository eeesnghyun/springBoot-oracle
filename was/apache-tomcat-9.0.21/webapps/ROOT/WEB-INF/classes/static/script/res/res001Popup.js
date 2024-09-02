//특정일 설정 달력 이벤트
function datePickerEvent(date){
	const list = document.querySelectorAll('.popup .left ul li');
	
	for (let i = 0; i < list.length; i++) {
		if (list[i].dataset.res == date.replace(/[^0-9]/g,'')) {
			alert('다른 날짜를 입력해주세요.');
			document.getElementById('specDate').value = null;	
			return 
		}
	}
	
	//특정일 임시 등록
	drawSpecDate(date); 
	document.getElementById('specDate').value = null;	
	
	//소분류 인원설정 추가  활성화
	document.querySelector('.popup .right button').style.opacity = '1';
}

//특정일 임시 등록
function drawSpecDate(date){
	const div   = document.querySelector('.popup .left ul');
	const value = date.replace(/[^0-9]/g,'');

	if (!isNullStr(date)) {
		div.innerHTML += 
			`<li onclick="getReserveDayListPop(this)" data-res="${value}">
	        	${date}
	        	<button type="button" class="del-btn" onclick="deleteResDate(this)"></button>
	        </li>`;	
	}
}

//특정일 그리기
function getResDateList(){
	commonDatePicker(["specDate"] , '' , datePickerEvent , true);
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};

	commonAjax.call("/res/getResDateList", "POST", params, function(data){
		if (data.message == "OK"){
			const result = data.resultList;
			const div    = document.querySelector('.popup .left ul');
			
			document.getElementById('specDate').value = null;
			div.innerHTML = "";

			if (isNullStr(result)) {
				//소분류 인원설정 추가  비활성화
				document.querySelector('.popup .right button').style.opacity = '0.6';
				
				//소분류 인원설정 초기화
				document.querySelector('.popup .right ul').innerHTML = '';
				
				//테이블 초기화 
				drawInitTable();
			} else {				
				for (let i = 0; i < result.length; i++) {
					div.innerHTML += 
						`<li onclick="getReserveDayListPop(this)" data-res="${result[i].resDate}">
				        	${result[i].resName}
				        	<button class="del-btn" type="button" onclick="deleteResDate(this)"></button>
				        </li>`;	
				}
				
				document.querySelectorAll('.popup .left li')[0].click();
			}
		}
	});
}

//테이블 초기화
function drawInitTable(){	
	const day    = document.querySelectorAll('.tab li');
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"dataDay"      : '1',
			"resDate"      : '00000000'
	};

	commonAjax.call("/res/getReserveDayList", "POST", params, function(data){
		if (data.message == "OK") {
			const mtList = data.resultList.mtList;    //대분류
			
			drawTable(mtList , '' , 'popup .table');  //대분류 테이블 그리기(res001.js)
		} else {
			alert(data.message);
		}
	});			
}

//예약 시간,인원 설정 조회
function getReserveDayListPop(target){
	const div = document.querySelectorAll('.popup .left ul li');
	
	div.forEach((ele) => ele.classList.remove('active'));
	target.classList.add('active');
	document.querySelector('.popup .table').innerHTML = "";
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"dataDay"      : '0',
		"resDate"      : target.dataset.res
	};
		
	commonAjax.call("/res/getReserveDayList", "POST", params, function(data){
		if (data.message == "OK") {
			const dayList = data.resultList.dayList;  //예약시간 및 인원설정
			const mtList  = data.resultList.mtList;   //대분류
			const subList = data.resultList.subList;  //소분류 인원설정
			
			drawTable(mtList , '' , 'popup .table');  //대분류 테이블 그리기(res001.js)
			fillTable(dayList , '.popup');            //테이블 날짜 그리기(res001.js)

			drawSubList(subList , '.popup .right ul' , 'popup');  //소분류 인원설정 그리기(res001.js)
			
			allInputFill('popup');  //인원 설정 채우기(res001.js)
		} else {
			alert(data.message);
		}
	});
}

//예약 시간,인원 설정 저장
function updateReservePop(){    
	const resDate = document.querySelector('.popup .left ul li.active');
	const person  = document.querySelectorAll('.popup ul.person-table li:not(.copy-table) input');
	const time    = document.querySelectorAll('.popup ul.time-table li');
	const mtList  = document.querySelectorAll('.popup .num-area ul');
	var saveList  = []; 
	
	for (let i = 0; i < time.length; i++) {
		let saveJson    = new Object();
		saveJson.hhmm   = time[i].value;
		saveJson.maxCnt = person[i].value;
		
		var dataList = []
		for (let j = 0; j < mtList.length; j++) {
			let dataJson = new Object();
			
			dataJson.prdMstCode = mtList[j].dataset.code;
			dataJson.resCnt     = mtList[j].querySelectorAll('li:not(.copy-table) input')[i].value;
			
			dataList.push(dataJson);
		}
	
		saveJson.dataList = dataList;
		saveList.push(saveJson);
	}
	
	if (isNullStr(resDate)) {
		alert('특정일을 선택해주세요.');
		return
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,   
		"resDate"      : resDate.dataset.res,
		"dataDay"      : '0',
		"saveList"     : JSON.stringify(saveList)
	}

	document.querySelector('.popup .center .table-pop').classList.add('active');
	
	setTimeout(function(){
		commonAjax.call("/res/updateReserve", "POST", params , function(data) {
			if (data.message == "OK") {		
				alert('저장되었습니다.');
				
				document.querySelector('.popup .center .table-pop').classList.remove('active');
				getReserveDayListPop(resDate);  //예약 시간,인원 설정 조회
			} else {
				alert(data.message);
			}
		});	
	}, 0);
}

//특정일 삭제
function deleteResDate(target){
   event.stopPropagation();
   
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,   
			"resDate"      : target.parentElement.dataset.res,
	}
	
	commonAjax.call("/res/deleteResDate", "POST", params , function(data) {
		if (data.message == "OK") {		
			alert('삭제되었습니다.');
			target.parentElement.remove();
		} else {
			alert(data.message);
		}
	});
}

//설정불러오기 
function getReserveDaySelect(){
	const resDate    = document.querySelector('.popup .left ul li.active');
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,   
		"resDate"      : '00000000',
		"dataDay"      : document.getElementById("dateDayPop").value
	}

	commonAjax.call("/res/getReserveDayList", "POST", params , function(data) {
		if (data.message == "OK") {			
			const dayList = data.resultList.dayList;	
			
			fillTable(dayList , '.popup'); //테이블 날짜 그리기(res001.js)
		} else {
			alert(data.message);
		}
	});	
}

//특정일 소분류 추가 팝업
function popSpecSubList(){ 
	if (isNullStr(document.querySelector(".popup .left ul li.active"))) {
		alert('특정일을 추가 및 선택해 주세요.');
		return
	}
	
	const content = 
        `<div class="popup-tit">
            <p>특정 소분류 인원 추가</p>
         </div>
	        
         <div class="popup-con person" style="width:310px">
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
            <button class="save-btn blue-btn" type="button" onclick="insertReserveSubPop()">저장하기</button>
        </div>
    </div>`;

    commonDrawPopup("draw", content);
    getProductMtList();  //대분류 가져오기
}

//특정일 예약 소분류 추가
function insertReserveSubPop(){
	const resCnt     = document.getElementById("resCnt").value;
	const resDate    = document.querySelector(".popup .left ul li.active");
	const prdSubCode = document.getElementById("prdSubList").value;
	const prdSubList = document.querySelectorAll(".popup .right ul li");
	
	if (isNullStr(resCnt)) {
		alert('인원 설정을 입력해주세요.');
		return
	}
	
	for (let i = 0; i < prdSubList.length; i++) {
		if (prdSubList[i].dataset.code == prdSubCode) {
			alert('해당 소분류 인원 설정이 이미 존재합니다.');
			return
		}
	}

	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"dataDay"      : '0',
			"prdSubCode"   : prdSubCode,
			"resCnt"       : resCnt,
			"resTime"      : document.getElementById("resTime").value,
			"resDate"      : resDate.dataset.res
	};
	
	commonAjax.call("/res/insertReserveSub", "POST", params , function(data) {
		if (data.message == "OK") {
			alert('저장되었습니다.');			
			subPopupClose();
			
			getReserveDayListPop(resDate);  //예약 시간,인원 설정 조회
			//updateReservePop(); //예약 시간 및 인원 설정 저장
		} else {
			alert(data.message);
		}
	});
}

//특정일 소분류 삭제
function deleteReserveSubPop(target){
    event.stopPropagation();
    
	const resTime = document.getElementById("resTime");
	const resDate = document.querySelector(".popup .left ul li.active");
	
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"resDate"      : resDate.dataset.res,
			"dataDay"      : '0',
			"prdSubCode"   : target.dataset.sub
	};

	if ((confirm('삭제하시겠습니까?'))) {
		commonAjax.call("/res/deleteReserveSub", "POST", params , function(data) {			
			if (data.message == "OK") {
				alert('삭제되었습니다.');
				
				getReserveDayListPop(resDate);  //예약 시간,인원 설정 조회
			} else {
				alert(data.message);
			}
		});	
	}
}