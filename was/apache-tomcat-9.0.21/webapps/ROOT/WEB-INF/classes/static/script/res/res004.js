function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);

	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;
	
	commonDatePicker(["selectDate"] , 'day', changeDateValue);
	
	getToday();
	dateInputActive();
	
	//배경색상 설정
	getColorStatus();
	
	//SSE 초기 연결 및 데이터 조회
	initConnect();
}

//SSE 초기 연결 및 데이터 조회
function initConnect() {	
	if (!isNullStr(eventSource) && (eventSource.readyState === 1 || eventSource.readyState === 0)) {	
		eventSource.close();	//연결 종료
		
		jobArr = [];			//작업 리스트 초기화
	}			
	
	//액세스 토큰값 설정
	commonSetOfficeSite(".page-url", {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	});

	//실시간 서버 연결
	connectServer();
	
	//예약 회원 조회
	getReserveUserList();
}

//실시간 서버 연결
function connectServer() {	
	const token = document.querySelector(".page-url").dataset.token;
	const oCode = document.getElementById("officeCode").value;
	
	eventSource = new EventSource(`${connectURI}/${oCode}?userId=${worksId}&accessToken=${token}`);
	
	eventSource.onopen = (e) => {
	    //console.log(e);
	};	
	eventSource.onerror = (e) => {
	    //console.log(e);
	};	
	eventSource.onmessage = (e) => {		
		notArrivedMember();
		
	  	if (!e.data.includes("connect")) {   
	  		const workData = JSON.parse(e.data);	  		
	  			
	  		//작업자가 없는 경우 작업종료로 간주
	  		if (isNullStr(workData.userName)) {
				const card = document.querySelectorAll("[name='user_info']");			   			
				
				/**
				 * 신규 예약 접수로 예약이 생성된 경우(status 9를 반환)
				 * 기존에 그려져있는 예약카드가 없기 때문에 재조회를 수행한다.
				 */
				if (workData.status === 9) {
					getReserveUserList();			    	
				} else {
					if (card.length > 0) {						
				    	card.forEach(function(item) {
							//해당 예약번호의 작업 상태 초기화 시키기
			    			if (workData.resno == item.dataset.resno) {
			    				//작업 리스트의 예약 번호 제거
			    				jobArr = jobArr.filter((el) => el.resno !== workData.resno);
			    				
			    				item.parentElement.querySelector("span.work").style.display = 'none';
					    		item.parentElement.querySelector("span.work").innerHTML = "";
					    		
				    			getReserveUserList();			    			
					    	}		    					    			
					    });	
				    }
				}				
	  		} else {	  				  				  		
	  			jobArr.push(workData);	  			
	  		}
	  		
			setWorkStatus();
	  	}
	};
}	

//작업 상태 나타내기
function setWorkStatus() {
	const card = document.querySelectorAll("[name='user_info']");		
	
	if (card.length > 0) {		
		card.forEach(function(item) {	    		
			jobArr.forEach(function(job) {
				if (job.resno == item.dataset.resno) {
					item.parentElement.querySelector("span.work").style.display = 'block';
					item.parentElement.querySelector("span.work").style.top = Number(item.parentElement.offsetTop - 40) + 'px';
					item.parentElement.querySelector("span.work").innerHTML =  `<span>${job.userName}</span>님이 해당 예약을<br>확인하고 있습니다.`;	
		    	}	
			});		    	
		});	
	}	  
}

function disConnectServer() {
	const oCode = document.getElementById("officeCode").value;
	const token = document.querySelector(".page-url").dataset.token;	
	
	fetch(`${disconnectURI}/${oCode}?userId=${worksId}&accessToken=${token}`);
}

//배경 변경
function colorChangePopup() {
	commonDrawPopup("load", "/res/res004ColorChange");	
}

//예약 접수 
function newReservation() {
	commonDrawPopup("load","/res/res004FindMember");
}

function changeDateValue(date) {
	const cDate = date.replace(/[^0-9]/g, "");
	
	const url = `/res/res004?date=${cDate}`;	
	history.pushState(null, null, url);	
	
	initConnect();
}

function getToday() {
	const dayArr = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)'];		
	const queryParams = commonGetQueryString();
	let today = "";
	
	if (isNullStr(queryParams)) {
		const day = dayArr[new Date().getDay()];		
			
		today = commonGetToday('y년m월d일', '') + ' ' + day;
	} else {
		const resDate = queryParams.get("date");					
		const day = dayArr[new Date(resDate.substr(0,4) + "-" + resDate.substr(4,2) + "-" + resDate.substr(6)).getDay()];
		
		today = resDate.substr(0,4) + "년 " + resDate.substr(4,2) + "월 " + resDate.substr(6) + '일 ' + day;
	}	
	document.getElementById('selectDate').value = today; 
}

//날짜선택영역 active
function dateInputActive() {
	const dateInput = document.getElementById('selectDate');
	
	dateInput.addEventListener('focus', function(){
		document.querySelector('.date-bar').classList.add('active');
	});
	dateInput.addEventListener('blur', function(){
		document.querySelector('.date-bar').classList.remove('active');
	});
}

//예약회원 조회
function getReserveUserList() {	
	const queryParams = commonGetQueryString();
	let resDate = "";
	
	if (isNullStr(queryParams)) {
		resDate = document.getElementById('selectDate').value.replace(/[^0-9]/g, "");
	} else {
		resDate = queryParams.get("date");
	}	
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"resDate"      : resDate
	};
	
	commonAjax.call("/res/getReserveUserList", "POST", params, function(data) {
		if (data.message == "OK") {				
			const result = data.resultList;
			const cnt    = data.countMap;
			const ul0    = document.getElementById('status0');
			const ul1    = document.getElementById('status1');
			const ul2    = document.getElementById('status2');
			const ul3    = document.getElementById('status3');
			
			ul0.innerHTML = '';
			ul1.innerHTML = '';
			ul2.innerHTML = '';
			ul3.innerHTML = '';
			
			if (result.length > 0) {
				document.getElementById('totalCnt').innerText = cnt.totalCnt;
				document.getElementById('firstVisit').innerText = cnt.firstCnt;
				document.getElementById('revisit').innerText = cnt.secondCnt;
				
				for (let i = 0; i < result.length; i++) {		
					const mobile      = result[i].mobile.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
					const time        = result[i].resTime.substr(0,2) + ':' + result[i].resTime.substr(2,2);
					const item        = result[i].itemName;
					const itemArray   = item.split('\n');
					const itemPrice   = result[i].itemPrice;
					const priceArray  = itemPrice.split('\n'); 					
					const content     = `<div class="member-card" id="${result[i].resNo}" style="background-color:${result[i].statusColor}" >
				                            <div class="button-div">
				                                <div class="time"></div>
				                                <div>${result[i].visitType}</div>
				                                <div>${result[i].resType}</div>
				                                <button type="button" class="btn-send" onclick="openSendPopup(this);"></button>
				                                <button type="button" class="btn-prd-view" onclick="goReceipt(this)" onmouseover="hoverPosition(this);" onmouseout="mouseOut(this)">
					                                 <div class="hover-box">
					                                    <div class="item-wrap" data-items="${result[i].resNo}"></div>
					                                    <div style="display:${result[i].resNote == "" ? "none;" : "block"}">[고객 요청사항]</div>
					                                    <div style="display:${result[i].resNote == "" ? "none;" : "block"}">${result[i].resNote}</div>
					                                    <div style="display:${result[i].adviceYn == "Y" ? "block" : "none"};">시술전 자세한 상담을 희망합니다.</div>
					                                    <div style="margin-top:20px"> --------------------- </div>
					                                    <div class="total-price"> 총 <span></span>개의 시술 금액 : <b></b></div>
					                                </div>
				                                </button>
				                               
				                                <button type="button" class="btn-edit-user" onclick="drawPopupUserInfo('${result[i].userId}');"></button>
				                            </div>
				                            <div class="top-wrap">
				                               	<div class="rank" style="display: ${result[i].gradeCode == "G999" ? "none" : "block"};background-color:${result[i].gradeColor};">${result[i].gradeDisplay}</div>
												<div class="no-member" style="display: ${result[i].gradeCode == "G999" ? "block" : "none"}"></div>
				                               	<span class="name"><span>${result[i].name}</span> <span class="user-gen-age">(<span class="gender">${result[i].gender}</span>/${result[i].age})</span></span>
				                               	<div class="mobile">${mobile}</div>
				                            </div>
				                            
				                            <div class="fixed-doctor" style="display:${result[i].fixedDoctorName == "" && result[i].fixedStaffName == ""? "none" : "block"};"><span class="label-doc">지정:&nbsp;</span><span class="${result[i].fixedDoctorName == "" ? "doc-hide" : "doc-show"}">${result[i].fixedDoctorName},</span><span class="${result[i].fixedStaffName == "" ? "doc-hide" : "doc-show"}">&nbsp;${result[i].fixedStaffName},</span></div>
											<div class="fixed-doctor send-cnt" style="display:${result[i].sendCrmCnt != '0' || result[i].sendProductCnt != '0'  || result[i].sendReserveCnt != '0' ? "block" : "none"};">
												<span class="label-doc">전송:</span>
												<span class="${result[i].sendCrmCnt == '0'? "hide" : "show"}">CRM ${result[i].sendCrmCnt} /</span>
												<span class="${result[i].sendProductCnt == '0'? "hide" : "show"}">남은 시술권 ${result[i].sendProductCnt} /</span>
												<span class="${result[i].sendReserveCnt == '0'? "hide" : "show"}">주의사항 ${result[i].sendReserveCnt} /</span>
											</div>
				                            
				                            <div class="bottom-wrap" data-wrap="${result[i].resNo}"></div>
				                            
				                            <input type="hidden" name="user_info" 
							 					  data-id	         = "${result[i].userId}"				
							 					  data-resno	     = "${result[i].resNo}"
							 					  data-status        = "${result[i].resStatus}"
							 					  data-time          = "${result[i].checkinTime}"
												  data-send1         = "${result[i].sendProductCnt}"
												  data-send2         = "${result[i].sendReserveCnt}"
							 					  data-arrived-time  = "${result[i].checkinDate}"
							 					  data-noshow        = "">
					 					    <span class="work"></span>
				                         </div>`;
					
					if (result[i].resStatus == "0") {						
						ul0.innerHTML += content;	
						document.querySelector(`[data-wrap="${result[i].resNo}"]`).innerHTML += `<button class="btn-arrive" onclick="updateCheckIn(this.parentNode.parentNode);">도착</button>`;
					} else if (result[i].resStatus == "1"){
						ul1.innerHTML += content;
						document.querySelector(`[data-wrap="${result[i].resNo}"]`).innerHTML += 
							`<div class="arrival-time">도착시간
                                <span>${result[i].checkinDate}</span>
                            </div>	                                
                            <button type="button" class="btn-wait" onclick="updateResStatus(this.parentNode.parentNode, 'N')">확인필요</button>
                            <button type="button" class="btn-cancel" onclick="updateResStatus(this.parentNode.parentNode, 'Y');">취소</button>`;
					} else if (result[i].resStatus == "2"){
						ul2.innerHTML += content;
						document.querySelector(`[data-wrap="${result[i].resNo}"]`).innerHTML += 
							`<div class="arrival-time">도착시간
                                <span>${result[i].checkinDate}</span>
                            </div>
                            <button type="button" class="btn-start" onclick="goReceipt(this);">확인시작</button>
                            <button type="button" class="btn-cancel" onclick="updateResStatus(this.parentNode.parentNode, 'Y');">취소</button>`;				
					} else if (result[i].resStatus == "3"){
						ul2.innerHTML += content;
						document.querySelector(`[data-wrap="${result[i].resNo}"]`).innerHTML += 
							`<div class="arrival-time">도착시간
                                <span>${result[i].checkinDate}</span>
                            </div>
                            <button type="button" class="btn-end" onclick="goReceipt(this);">확인완료</button>
                            <button type="button" class="btn-cancel" onclick="updateResStatus(this.parentNode.parentNode, 'Y');">취소</button>`;				
					} else if (result[i].resStatus == "4" || result[i].resStatus == "5"){
						ul3.innerHTML += content;
						document.querySelector(`[data-wrap="${result[i].resNo}"]`).innerHTML += 
							`<div class="arrival-time">${result[i].resStatus == "4"? "상담종료" : "확인완료"}
								 <span>${result[i].confirmDate}</span> /&nbsp;
							 </div>
                        	 <div class="arrival-time">도착시간
                            	 <span>${result[i].checkinDate}</span>
                        	 </div>`;	
					}
					
					//체크인 시간 기록
					if (isNullStr(result[i].checkinDate)) {
						document.getElementById(`${result[i].resNo}`).querySelector('.time').innerText = time;
					} else {
						document.getElementById(`${result[i].resNo}`).querySelector('.time').innerText = result[i].checkinTime;
					}
					
					//전송수 카운트
					const sendCnt = document.getElementById(`${result[i].resNo}`).querySelectorAll('.send-cnt > .show');
					
					if (sendCnt.length != 0) {
						sendCnt[sendCnt.length - 1].innerText = sendCnt[sendCnt.length - 1].innerText.replace('/', '');
					}
					
					const docShow = document.getElementById(`${result[i].resNo}`).querySelectorAll('.doc-show');
					
					if (docShow.length != 0) {
						docShow[docShow.length - 1].innerText = docShow[docShow.length - 1].innerText.replace(',', ''); 
					}
					
					//hover-box 예약내용 
					const resNo = document.querySelector(`[data-items="${result[i].resNo}"]`).parentElement; 
					let total = 0;
					resNo.querySelector('.item-wrap').innerHTML = result[i].itemName;
					
					for (let j=0; j < priceArray.length; j++) {
						total += Number(priceArray[j]);
						resNo.querySelector('.total-price > b').innerText = total.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '원';
					}
					resNo.querySelector('.total-price > span').innerText = resNo.querySelectorAll('label').length;

					//미도착 회원 onclick 삭제
					const li = document.querySelectorAll('#status0 .member-card');
					
					for (let i=0; i < li.length; i++) {
						li[i].removeAttribute("onclick");
					}
						
					//상태별 회원수 카운트		
					document.getElementById('cnt0').innerText = document.querySelectorAll('[data-status="0"]').length;				
					document.getElementById('cnt1').innerText = document.querySelectorAll('[data-status="1"]').length;				
					document.getElementById('cnt2').innerText = document.querySelectorAll('[data-status="2"]').length;				
					document.getElementById('cnt3').innerText = document.querySelectorAll('[data-status="3"]').length;				
					document.getElementById('cnt4').innerText = document.querySelectorAll('[data-status="4"]').length + document.querySelectorAll('[data-status="5"]').length;									
				}
			} else {
				document.getElementById('totalCnt').innerText   = '0';
				document.getElementById('firstVisit').innerText = '0';
				document.getElementById('revisit').innerText    = '0';
				document.getElementById('cnt0').innerText       = '0';				
				document.getElementById('cnt1').innerText       = '0';				
				document.getElementById('cnt2').innerText       = '0';				
				document.getElementById('cnt3').innerText       = '0';				
				document.getElementById('cnt4').innerText       = '0';
				document.getElementById('cntNoShow').innerText  = '0';
			}						
		} else {
			alert(data.message); 
		} 
	});
}

//예약 확인 페이지 이동
function goReceipt(ele) {
	event.stopPropagation();
	const parent = ele.parentElement.parentElement;
	
	if (parent.querySelector('[name="user_info"]').dataset.status == '0') {
		if (confirm('도착한 회원으로 변경 후 확인이 가능합니다.\n도착한 회원으로 변경하시겠습니까?')) {
			updateCheckIn(ele.parentNode.parentNode);
		} else {
			return;
		}
	}

	const oCode  = document.getElementById("officeCode").value;
	const resNo  = parent.querySelector('[name="user_info"]').dataset.resno;	
	const token  = document.querySelector(".page-url").dataset.token;	
	const params = {
		"userId"   : parent.querySelector('[name="user_info"]').dataset.id,
		"resNo"    : resNo,
	}
	      
	commonDrawPopup("load", "/res/res004Receipt", params);	
	
	fetch(`${actionURI}/${oCode}?resno=${resNo}&userId=${worksId}&accessToken=${token}`)
		.catch(function(){
			parent.classList.add('active');  //fetch 통신 끊겼을 경우
		});	
}

//hover box 위치 
function hoverPosition(ele) {
	const scroll = ele.parentElement.parentElement.scrollTop;
	const top = ele.offsetTop + 40 - scroll;
	
	ele.querySelector('.hover-box').style.top = `${top}px`;
	ele.querySelector('.hover-box').style.display = 'block';
	
	ele.parentElement.parentElement.parentElement.addEventListener('scroll', function(){
		const box = document.querySelectorAll('.hover-box');
		
		for (let i=0; i < box.length; i++) {
			box[i].style.display = 'none';
		}
	});
}

function mouseOut(ele){
	ele.querySelector('.hover-box').style.display = 'none';
}

//scroll시 예약 시술 hover-box 안보이게 
document.addEventListener('scroll', function(){
	const box = document.querySelectorAll('.hover-box');
	
	for (let i = 0; i < box.length; i++) {
		box[i].style.display = 'none';
	}
});

//날짜 선택 prev, next button
function dateButton(type) {
	const dayArr = ['일', '월', '화', '수', '목', '금', '토'];
	let nextDate;
		
	const queryString  = window.location.search;
	const searchParams = new URLSearchParams(queryString);
	let currentDate;
	
	if (isNullStr(searchParams)) {
		currentDate = new Date();
	} else {
		const resDate = searchParams.get("date");
		
		currentDate = new Date(resDate.substr(0,4) + "-" + resDate.substr(4,2) + "-" + resDate.substr(6));
	}
	
	if (type == 'prev') {			
		nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
	} else {		
		nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);	
	}
	
	const month = ("0" + (nextDate.getMonth() + 1)).slice(-2);
	const day   = ("0" + nextDate.getDate()).slice(-2);
	const sDate = `${nextDate.getFullYear()}년 ${month}월 ${day}일 (${dayArr[nextDate.getDay()]})`;
	
	document.getElementById('selectDate').value = sDate 	
	
	changeDateValue(sDate);
}

//미도착 회원 카드 색상변경
function notArrivedMember() {
	const resDate = document.getElementById('selectDate').value.substr(0,12).replace(/[^0-9]/g,'').replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
	const now = new Date();
	const today = now.getFullYear() + '-' +  String(now.getMonth() + 1).padStart(2, "0") + '-' + String(now.getDate()).padStart(2, "0");
	
	if (resDate != today) { 
		return;		
	}
	
	const resTimeDiv = document.querySelectorAll('#status0 .time');
	
	for (let i = 0; i < resTimeDiv.length; i++) {
		const resTime = resTimeDiv[i].innerText.replace(/[^0-9]/g,'');
		const nowTime = String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2,"0");
		
		//예약 시간 + 30분이 지난 경우 미도착 처리
		if (Number(resTime) + 30 <= Number(nowTime)) {
			resTimeDiv[i].parentElement.parentElement.style.backgroundColor = '#e3e3e3';
			resTimeDiv[i].parentElement.parentElement.querySelector('[name="user_info"]').dataset.noshow = 'Y';
		}
	}
	
	document.getElementById('cntNoShow').innerText = document.querySelectorAll('[data-noshow="Y"]').length;
}

//배경색상 조회하기
function getReserveStatusList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/res/getReserveStatusList", "POST", params, function(data) {
		if (data.message == "OK") {
			const result = data.result;
			
			document.querySelector('.status-color1').value = result.code1Color;
			document.querySelector('.status-color2').value = result.code2Color;
			document.querySelector('.status-color3').value = result.code3Color;
			document.querySelector('.status-color4').value = result.code4Color;			
		} else {
			alert(data.message);
		}
	});
}

//배경색상 변경하기
function updateReserveStatus() {
	if (commonCheckRequired('.color-form') == false) {
		return;
	}
	
	const statusColor = document.querySelector('.status-color1').value + ',' +
						document.querySelector('.status-color2').value + ',' + 
						document.querySelector('.status-color3').value + ',' +  
						document.querySelector('.status-color4').value + ',' + 
						document.querySelector('.status-color4').value; 

	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"statusColor"  : statusColor
	};
	
	commonAjax.call("/res/updateReserveStatus", "POST", params, function(data){
		if (data.message == "OK") {
			alert('저장되었습니다.');
			getReserveUserList();
			getColorStatus();
			
			popupClose();
		} else {
			alert(data.message);
		}
	});
}

function colorPicker(pick) {
    var color = pick.value;
    pick.previousElementSibling.value = color;
    changeValueColor5();
}

function changeValueColor5() {
	document.querySelector('.status-color5').value = document.querySelector('.status-color4').value;
}

//회원도착
function updateCheckIn(ele) {
	event.stopPropagation();
	
	ele.querySelector('[name="user_info"]').dataset.noshow = '';

	const oCode  = document.getElementById("officeCode").value;
	const resNo  = ele.querySelector('[name="user_info"]').dataset.resno;
	const token  = document.querySelector(".page-url").dataset.token;	
	const params = {
		"officeCode"   : oCode,
		"resNo"        : resNo
	};

	commonAjax.call("/res/updateCheckIn", "POST", params, function(data){
		if (data.message == "OK") {
			fetch(`${updateURI}/${oCode}?resno=${resNo}&userId=${worksId}&accessToken=${token}&status=1`)
				.catch(function(){
					getReserveUserList();
				});
		} else {
			alert(data.message);
		}
	});
}

//도착한 회원 상태변경
function updateResStatus(ele, type) {
	event.stopPropagation();

	const oCode  = document.getElementById("officeCode").value;
	const resNo  = ele.querySelector('[name="user_info"]').dataset.resno;
	const token  = document.querySelector(".page-url").dataset.token;
	const statusCode = ele.querySelector('[name="user_info"]').dataset.status;
	
	const params = {
		"officeCode"   : oCode,
		"resNo"        : resNo,
		"statusCode"   : statusCode,
		"isCancel"     : type
	};
	
	commonAjax.call("/res/updateResStatus", "POST", params, function(data){
		if (data.message == "OK") {
			fetch(`${updateURI}/${oCode}?resno=${resNo}&userId=${worksId}&accessToken=${token}&status=${statusCode}`)
				.catch(function(){
					getReserveUserList();
				})
		} else {
			alert(data.message);
		}
	});
}

//배경색상 미리보기
function getColorStatus() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/res/getReserveStatusList", "POST", params, function(data) {
		if (data.message == "OK") {
			const result = data.result;
			
			document.getElementById('color1').style.backgroundColor = result.code1Color;
			document.getElementById('color2').style.backgroundColor = result.code2Color;
			document.getElementById('color3').style.backgroundColor = result.code3Color;	
			document.getElementById('color4').style.backgroundColor = result.code4Color;	
		} else {
			alert(data.message);
		}
	});
}

//회원 카드 전송팝업 open버튼
function openSendPopup(ele) {
	event.stopPropagation();
	
	const parent = ele.parentElement.parentElement;
	const params = {
		"userId"   : parent.querySelector('[name="user_info"]').dataset.id,
		"userName" : parent.querySelector('.name span:first-child').innerText,
		"mobile"   : parent.querySelector('.mobile').innerText.replaceAll('-' , ''),
		"resNo"    : parent.querySelector('[name="user_info"]').dataset.resno,
		"send1"    : parent.querySelector('[name="user_info"]').dataset.send1,
		"send2"    : parent.querySelector('[name="user_info"]').dataset.send2
	};

	commonDrawPopup("load", "/res/res004sendPopup", params);	
}

/**
 * fetch 통신 예외처리
 * @param {String} seq    -- 이동 시킬 컬럼 (예약회원 : 0 / 도착한 회원 : 1 / 확인필요,CRM전송 : 2 / 확인완료 : 3)
 * @param {*} target      -- 이동 시킬 카드 
 * @param {String} status -- CRM 전송 상태 (전송완료 : 'Y') 
 */
function exceptionFetch(seq , target , status) {
	const card        = target.closest('.member-card');
	const resNo       = card.id;
	const div         = document.getElementById(`status${seq}`);
	let now           = new Date();
	let hour          = now.getHours();
	let min           = now.getMinutes();
	const reserveTime = card.querySelector('.time').innerText.substr(0, 5);
	let arrivedTime   = card.querySelector('input[name="user_info"]').dataset.arrivedTime;
	let nowTime       = ('00' + hour).slice(-2) + ':' + ('00' + min).slice(-2);
	
	//배경색 변경
	if (seq == '0') {
		card.style.backgroundColor = '#fff';
	} else {
		card.style.backgroundColor = document.getElementById(`color${seq}`).style.backgroundColor;
		
		if (seq == '2' && status == 'Y') {  //CRM 전송이 완료되었을 때
			card.style.backgroundColor = document.getElementById('color3').style.backgroundColor;
		}
		
		if (seq == '3') {
			card.style.backgroundColor = document.getElementById('color4').style.backgroundColor;
		}
	}
	
	//도착한 시간 변경
	if (isNullStr(arrivedTime)) {
		arrivedTime = nowTime;
		card.querySelector('input[name="user_info"]').dataset.arrivedTime = arrivedTime;
	
		//30분 단위로 계산해서 표시
		if (min > 30) {
			hour = hour + 1;
			min = '00';
		} else {
			min = '30';
		}

		let calTime = ('00' + hour).slice(-2) + ':' + ('00' + min).slice(-2);
		card.querySelector('.time').innerText = reserveTime + ' → ' + calTime;	
	}
	
	if (seq == '0') {
		//도착한 시간 변경
		card.querySelector('.time').innerText = card.querySelector('input[name="user_info"]').dataset.time;
		
		//카드 하단 버튼 수정
		card.querySelector(`[data-wrap="${resNo}"]`).innerHTML = 
			`<button class="btn-arrive" onclick="updateCheckIn(this.parentNode.parentNode);">도착</button>`;
		
		card.querySelector('input[name="user_info"]').dataset.arrivedTime = '';
	} else if (seq == '1') {   
		card.querySelector(`[data-wrap="${resNo}"]`).innerHTML = 
			`<div class="arrival-time">도착시간
                <span>${arrivedTime}</span>
            </div>	                                
            <button type="button" class="btn-wait" onclick="updateResStatus(this.parentNode.parentNode, 'N')">확인필요</button>
            <button type="button" class="btn-cancel" onclick="updateResStatus(this.parentNode.parentNode, 'Y');">취소</button>`;
		
	} else if (seq == '2') {
		card.querySelector(`[data-wrap="${resNo}"]`).innerHTML = 
			`<div class="arrival-time">도착시간
                <span>${arrivedTime}</span>
            </div>
            <button type="button" class="btn-end" onclick="goReceipt(this);">확인완료</button>
            <button type="button" class="btn-cancel" onclick="updateResStatus(this.parentNode.parentNode, 'Y');">취소</button>`;	
		
	} else if (seq == '3') {
		card.querySelector(`[data-wrap="${resNo}"]`).innerHTML = 
			`<div class="arrival-time">${seq == "4"? "상담종료" : "확인완료"}
				 <span>${nowTime}</span> /&nbsp;
			 </div>
        	 <div class="arrival-time">도착시간
            	 <span>${arrivedTime}</span>
        	 </div>`;	
	}
 	
	//카드 이동
	card.querySelector('input[name="user_info"]').dataset.status = seq;
	div.insertAdjacentHTML('beforeend', card.outerHTML);
	card.remove();
}