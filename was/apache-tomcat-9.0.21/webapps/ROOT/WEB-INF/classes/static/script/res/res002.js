function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	commonDatePicker(["startDate" , "endDate"] , '' , getReserveList);

	document.getElementById("hospitalCode").value = hospitalCode;
	document.getElementById("officeCode").value = officeCode;	
			
	tabBtn();
	setOptionEvent();

	//SSE 초기 연결 및 데이터 조회
	initConnect();
}

//지점 변경 
function initConnect() {
	if (!isNullStr(eventSource) && (eventSource.readyState === 1 || eventSource.readyState === 0)) {	
		eventSource.close();	//연결 종료
		
		listArr = [];			//작업 리스트 초기화
	}					
	
	//액세스 토큰값 설정
	commonSetOfficeSite(".page-url", {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	});

	//실시간 서버 연결
	connectServer();
	
	//예약 리스트 조회
	getReserveList();
}

//실시간 서버 연결 
function connectServer() {
	const oCode = document.getElementById("officeCode").value;
	const token = document.querySelector(".page-url").dataset.token;	
	
	eventSource = new EventSource(`${connectURI}/${oCode}?userId=${worksId}&accessToken=${token}`);
	
	eventSource.onopen = (e) => {
	    //console.log(e);
	};	
	eventSource.onerror = (e) => {
	    //console.log(e);
	};	
	eventSource.onmessage = (e) => {
  	if (!e.data.includes("connect")) {      		    		
  		const workData = JSON.parse(e.data);
  		//console.log(workData);
  		
		//작업자가 없는 경우 작업종료로 간주
  		if (isNullStr(workData.userName)) {    			
  			const list = document.querySelectorAll(".left-con li");
  			
  			if (list.length > 0) {
  				list.forEach(function(item) {
      				if (workData.resno == item.dataset.rno) {
      					if (!isNullStr(item.querySelector('.use-overlay'))) {
      						item.querySelector('.use-overlay').classList.remove('active');
      					}

          				//예약카드 실시간 상태변경
      					if (workData.status == 1) {
      						getReserveList();	
      					}
      				} 
      			});        			
  			}
  			    			   
  			//작업 리스트의 예약 번호 제거  
  			listArr = listArr.filter((el) => el.resno !== workData.resno);
  		} else {
  			listArr.push(workData);
  			
  			setWorkStatus();
  		}		    		   		    	
  	}
	};
}

//작업 상태 나타내기
function setWorkStatus() {
	const list = document.querySelectorAll(".left-con li");
  
	if (list.length > 0) {
		list.forEach(function(item) {	    		
			listArr.forEach(function(job) {    			
				if (job.resno == item.dataset.rno && job.userId != worksId) {    			
					item.querySelector('.use-overlay').classList.add('active');
					item.querySelector('.use-overlay bold').innerHTML = job.userName;	    		
		    	}	
			});		    	
	    });	
	}	  
}

//서버 연결 해제 
function disConnectServer() {
	const oCode = document.getElementById("officeCode").value;
	const token = document.querySelector(".page-url").dataset.token;	
	
	fetch(`${disconnectURI}/${oCode}?userId=${worksId}&accessToken=${token}`);
}

//상단 탭 버튼 클릭 이벤트
function tabBtn() {
    const tab = document.querySelectorAll('.tab-tit li');
    const con = document.querySelectorAll('.tab-con');
    let searchParams = commonGetQueryString();	
    
    const removeActive = function(i) {
		tab.forEach((ele) => ele.classList.remove('active'));
		con.forEach((ele) => ele.classList.remove('active'));
		    	
		tab[i].classList.add('active');
		con[i].classList.add('active');  
    }
    
    for (let i = 0; i < tab.length; i++) {
        tab[i].addEventListener('click',function(){        	
    		const pageType = tab[i].dataset.page;	
    		setParams(1, pageType);  	
        
            removeActive(i);   //tab active           
        	getReserveList();  //예약 리스트 조회
        });	    		    	    	    
        
    	if (isNullStr(searchParams)) {
    		tab[0].classList.add('active');
    		con[0].classList.add('active');
    	} else {    		
    		if (searchParams.get("page") == tab[i].dataset.page) {
                removeActive(i);   //tab active           
    		}
    	}    
    }
}

function getParams() {	
	const state = history.state;
	let index = 1;
	let pageType = "apply";
	
	if (!isNullStr(state)) {
		document.getElementById("startDate").value = state.start.replace(/(\d{4})(\d{2})(\d{2})/, '$1년 $2월 $3일');
		document.getElementById("endDate").value   = state.end.replace(/(\d{4})(\d{2})(\d{2})/, '$1년 $2월 $3일');		
		document.getElementById("sort").value 	   = state.sort;
		document.getElementById("view").value 	   = state.view;
		document.getElementById("field").value 	   = decodeURI(state.field)
		
		index = state.index;
		pageType = state.page;
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"index"	       : index,
		"start" 	   : document.getElementById('startDate').value.replace(/[^0-9]/gi,""),
		"end"   	   : document.getElementById('endDate').value.replace(/[^0-9]/gi,""),	
		"page" 		   : pageType,
		"sort" 		   : document.getElementById('sort').value,
		"view"  	   : document.getElementById('view').value,
		"field"		   : document.getElementById('field').value
	};
	
	return params;
}

//예약 리스트 조회
function getReserveList() {		
	const params = getParams();	
		
	commonAjax.call("/res/getReserveList", "POST", params, function(data){						
		if (data.message == "OK") {
			const div    = document.querySelector('.tab-con.active ul.left-con');
			const result = data.resultList;	
			const page   = data.pageList;	
			const total  = data.totalCount; 		
			
			div.innerHTML = "";
		
			//예약 총계 출력
			const tab = document.querySelectorAll('.tab-tit li');
			
			tab.forEach(function(item) {
				if (item.dataset.page == "apply") {
					item.querySelector(".reserve-count").innerHTML = '(' + total.applyCheckCnt + ')';
				} else {
					item.querySelector(".reserve-count").innerHTML = '(' + total.changeCheckCnt + ')';
				}
			});
			
			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					const phone  = result[i].mobile.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
					const advice = result[i].adviceYn == 'Y' ? "checked='checked'" : '';

					div.innerHTML += 
						`<li class="reserve-list-con" data-rno="${result[i].resNo}"onclick="clickCard(this)">							
							<input type='hidden' name="reserve_info"
								   data-id="${result[i].userId}"
								   data-resDate="${result[i].resDate}"
								   data-rno="${result[i].resNo}"
								   data-name="${result[i].name}"
								   data-mobile="${phone}"
								   data-time="${result[i].PTime}"
								   data-date="${result[i].PDate}"
								   data-crmCnt="${result[i].sendCrmCnt}"
								   data-proCnt="${result[i].sendProductCnt}"
								   data-resCnt="${result[i].sendReserveCnt}"
								   data-total="${result[i].totalPrice}"
								   data-resType="${result[i].resTypeCode}"
							/>
							
							<div class="use-overlay">
								<p><bold></bold>님이 현재 예약을 확인하고 있습니다.</p>
								<button type="button" onclick="hideCard(this)">강제 확인하기</button>
							</div>
							
		                    <div class="reserve-left-list">
		                        <div class="state reserve-list-btn">
		                            <span>${result[i].resType}</span>
		                            <span>${result[i].visitType == '1' ? '초진' : '재진'}</span>
		                        </div>
		
		                        <div class="reserve-list-user">
		                            <p>${result[i].name}</p>
		                            <span>(${result[i].gender}/${result[i].age})</span>
		                            <small>${phone}</small>
		                            <button type='button' class="reserve-send-btn" onclick="openReserveSendPopup(this)"></button>
		                        </div>
		
		                        <div class="reserve-list-date">
		                            <span>예약 신청일 : ${result[i].createDate}</span>
		                            <div class="reserve-date-change">
		                                <span>희망 예약일 : ${result[i].resDate}</span>	                         		                                	                               
		                            </div>
		                        </div>
		
		                        <ul class="reserve-list-product"></ul>
		
								<div class="reserve-list-bottom">
		                        	<div class="check">
			                            <input type="checkbox" class="round-check" id="${result[i].resNo}" ${result[i].adviceYn == 'Y' ? 'checked' : ''} disabled>
			                            <label for="${result[i].resNo}"></label>	                        
			                            <label>시술전 자세한 상담을 희망합니다.</label>	
			                        </div>
			                        <p>총 금액 <bold>${isNullStr(result[i].totalPrice) ? '0' : result[i].totalPrice}원</bold></p>
								</div>
		                    </div> 
		
		                    <div class="reserve-right-con">
		                    	<div class="reserve-list-status"></div>           
		                    </div>
		                </li>`;
					
					const parent  = document.querySelector('.tab-con.active');
					const content = parent.querySelector('li.reserve-list-con:last-child');
					
					//최종 예약 확인건과 마감된 예약건을 제외한 경우에만 예약일 변경 가능
					if (result[i].confirmYn == "N" && result[i].visitStatus != "C") {
						const date = content.querySelector('.reserve-date-change');
						date.innerHTML += 
							`<button type="button" class="border-btn">희망 예약일 변경</button>
		                     <div class="btn-hover reserve-date-con"></div>`;
						
						//예약일 변경 히스토리가 있는 경우
						if (!isNullStr(result[i].resDateAfter)) {
							const btnArea = date.querySelector('.btn-hover');		
							const dateAfter  = result[i].resDateAfter.split("\n");
							const dateBefore = result[i].resDateBefore.split("\n");
							const dateUpdate = result[i].updateUser.split("\n");
							
							for (let i = 0; i < dateAfter.length; i++) {
								btnArea.innerHTML += 	
									`<small>[${dateUpdate[i]}]</small>
			                         <p>${dateBefore[i]} → <bold>${dateAfter[i]} 변경</bold></p>`;	
							}
						}
					}
					
					//회원 등급 
					if (!isNullStr(result[i].gradeDisplay)) {
						content.querySelector('.reserve-list-btn').insertAdjacentHTML(
							'afterbegin' , `<span class="grade" style="background-color:${result[i].gradeColor}; background-image:none">${result[i].gradeDisplay}</span>`
						)
					}

					//의료진 지정
					if (!isNullStr(result[i].fixedDoctorName) || !isNullStr(result[i].fixedStaffName)) {
						if (!isNullStr(result[i].fixedDoctorName) && !isNullStr(result[i].fixedStaffName)) {
							content.querySelector('.reserve-list-btn').innerHTML += 
								`<span>의료진 지정 (${result[i].fixedDoctorName}, ${result[i].fixedStaffName})</span>`;
						} else{
							content.querySelector('.reserve-list-btn').innerHTML += 
								`<span>의료진 지정 
									(${!isNullStr(result[i].fixedDoctorName) ? result[i].fixedDoctorName : ''}${!isNullStr(result[i].fixedStaffName) ? result[i].fixedStaffName : ''})
								 </span>`;
						}	
					}
					
					//예약 상품 리스트
					const item  = result[i].itemName.split("</p>");
					const price = result[i].itemPrice.split("\n");
					const child = content.querySelector('.reserve-list-product');
					
					for (let j = 0; j < item.length ; j++) {
						if (!isNullStr(item[j])) {
							if (nvlStr(price[j]) == "" || price[j] == 0) {	//남은 시술권
								child.innerHTML += `<li>${item[j]}</p></li>`;	
							} else {
								child.innerHTML += `<li>${item[j]}</p><span>${price[j]}원</span></li>`;
							}  	
						}  
					}
					
					//고객 요청 사항
					if (!isNullStr(result[i].resNote)) {
						content.querySelector('.reserve-right-con').innerHTML +=
							`<div class="reserve-list-memo">
								<span>고객 요청사항)</span>
								<p class="resNote">${result[i].resNote}</p>
							</div>`
					};
					
					//예약 처리상태
					if (result[i].visitStatus == "N") {			//신청상태
						const page = document.querySelector('.tab-tit ul li.active').dataset.page;
						
						content.querySelector(".reserve-list-status").innerHTML += 						
							`<button type="button" class="color" onclick="confirmReserve('${result[i].resNo}', '${page}')">확정(발송)</button>
							 <button type="button" class="basic" onclick="closeReserve('${result[i].resNo}','Y')">마감(발송)</button>     
							 <button type="button" class="basic" onclick="closeReserve('${result[i].resNo}','N')">마감(미발송)</button>`;
						
						content.querySelector('.reserve-right-con').innerHTML += 
							`<div class="reserve-list-memo">
								<span>병원 메모)</span>
								 <textarea type="text" class="hospitalNote scroll" onkeyup="checkTextarea(this)" placeholder="특이사항을 입력해 주세요.\n병원 메모는 고객에게 보여지지 않습니다.">${result[i].hospitalNote}</textarea>
							 	 <button type='button' class="${!isNullStr(result[i].hospitalNote) ? 'active' : ''}"onclick="updateHospitalNote(this)">저장</button>
							 </div>`;
							
					} else if (result[i].visitStatus == "Y") {	//확정
						if (result[i].saveYn == "Y") {			//시술권 저장 완료
							content.querySelector(".reserve-list-status").innerHTML += 
								`<button type="button" class="confirm">확인완료</button>`;	
						} else {
							content.querySelector(".reserve-list-status").innerHTML += 
								`<button type="button" class="confirm">예약 확정</button>
								 <button type="button" class="basic" onclick="cancelReserve('${result[i].resNo}')">예약 취소</button>`;
						}												
						
						if (!isNullStr(result[i].hospitalNote)) {
							content.querySelector('.reserve-right-con').innerHTML += 
								`<div class="reserve-list-memo">
									 <span>병원 메모)</span>
									 <p>${result[i].hospitalNote}</p>
								 </div>`;	
						}

						content.classList.add('confirm');
					} else {	                           		//마감
						let text = "";
						
						if (result[i].useStatus == "D") {
							text = "예약 취소" 
						} else {
							text = result[i].alarmYn == "Y" ? "예약 마감(발송)" : "예약 마감(미발송)"; 																				
						}						

						content.querySelector(".reserve-list-status").innerHTML += `<button type="button" class="cancle">${text}</button>`; 	
						
						if (!isNullStr(result[i].hospitalNote)) {
							content.querySelector('.reserve-right-con').innerHTML += 
								`<div class="reserve-list-memo">
									 <span>병원 메모)</span>
									 <p>${result[i].hospitalNote}</p>
								 </div>`;	
						}
						
						content.classList.add('cancle');
					}	
				}				
			} else {
				div.innerHTML = `<div class="no-data"><span>신청된 예약이 없습니다.</span></div>`;
			}	
			
			drawPage(page);
		}
				
		scroll();
		reserveHover();
		reservePopup();
		setReserveStatusEvent();
	});	
}

//병원 메모 내용 체크
function checkTextarea(target){
	if (!isNullStr(target.value)) {
		target.nextElementSibling.classList.add('active');
	} else {
		target.nextElementSibling.classList.remove('active');
	}
}

//병원 메모 개별 저장 
function updateHospitalNote(target){
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : target.closest('li.reserve-list-con').dataset.rno,
		"hospitalNote" : target.previousElementSibling.value
	};

	commonAjax.call("/res/updateHospitalNote", "POST", params, function(data){
		if (data.message == "OK") {
			alert('병원 메모가 저장되었습니다.');
		}
	});	
}

//회원 리스트 전송 버튼
function openReserveSendPopup(ele) {
	event.stopPropagation();
	
	const parent = ele.closest('li');
	const params = {
		"userId"   : parent.querySelector('input[name="reserve_info"]').dataset.id,
		"userName" : parent.querySelector('input[name="reserve_info"]').dataset.name,
		"mobile"   : parent.querySelector('input[name="reserve_info"]').dataset.mobile.replaceAll('-',''),
		"resNo"    : parent.querySelector('input[name="reserve_info"]').dataset.rno,
		"send1"    : parent.querySelector('input[name="reserve_info"]').dataset.procnt,
		"send2"    : parent.querySelector('input[name="reserve_info"]').dataset.rescnt
	}

	commonDrawPopup("load", "/res/res004sendPopup", params);	
}

//회원 검색 후 전송 버튼
function openSendPopup(ele) {
	event.stopPropagation();
	
	const parent = ele.parentElement.parentElement;
	const params = {
		"userId"   : parent.querySelector('input[name="user_info"]').dataset.id,
		"userName" : parent.querySelector('input[name="user_info"]').dataset.name,
		"mobile"   : parent.querySelector('.mobile').innerText.replaceAll('-' , '')
	}

	commonDrawPopup("load", "/res/res004sendPopup", params);	
}

function pageBtnClick(type) {
	const wrap     = document.querySelector('.page-wrap');
	const active   = document.querySelector('.page-num.active');
	const pageType = getTabPage();
	let index;
	
	if (type == 'next') {
		if (Number(active.innerText) % 10 != 0) {
			if (isNullStr(active.nextElementSibling)) return;
		}
		
		index = Number(active.innerText) + 1;	
	} else {
		if (Number(active.innerText) == 1) return;		
		
		index = Number(active.innerText) - 1;	
	}
		
	setParams(index, pageType);
	
	getReserveList();
}

//페이지 그리기
function drawPage(page) {
	const type = getTabPage();
	const tab  = document.querySelector(".tab-con.active");
	const pageWrap = tab.querySelector('.page-wrap');
	
	tab.querySelector('.btn-prev-page').style.opacity = '1';
	tab.querySelector('.btn-next-page').style.opacity = '1';
	
	if (page.length > 0) {
		tab.querySelector(".page-wrap").innerHTML = '';
		
		const pageLength = page.length < 10 ? page.length : 10;
		
		for (let i = 0; i < pageLength; i++) {
			const className = page[i].isActive == true ? "page-num active" : "page-num";		
			const index = className.includes("active") == true ? "#" : page[i].index;

			pageWrap.innerHTML += `<div class="${className}"><a href="javascript:void(0);" onclick="goPage(this)" data-index="${index}">${page[i].index}</a></div>`;
		}
		
		const active = tab.querySelector('.page-num.active');
		
		if (active.innerText == '1') {
			tab.querySelector('.btn-prev-page').style.opacity = '0.5';
		}
		
		if (isNullStr(active.nextElementSibling)) {
			if (page.length <= 10) {
				tab.querySelector('.btn-next-page').style.opacity = '0.5';	
			}
		}
	} else {
		tab.querySelector(".page-wrap").innerHTML = 
			`<div class="page-num active">
				<a href="#">1</a>
			</div>`;
		
		tab.querySelector('.btn-prev-page').style.opacity = '0.5';
		tab.querySelector('.btn-next-page').style.opacity = '0.5';
	}
}

//페이지 이동
function goPage(obj) {
	if (obj.dataset.index != "#") {
		const index = obj.dataset.index;
		const pateType = getTabPage();		
	
		setParams(index, pateType);
		
		getReserveList();	
		
		setWorkStatus();
	}	
}

//페이지 주소 전환 및 파라미터 전달
function setParams(index, pageType) {
	const url = "/res/res002?index=" + index
			  + "&start=" + document.getElementById('startDate').value.replace(/[^0-9]/gi,"")
			  + "&end="   + document.getElementById('endDate').value.replace(/[^0-9]/gi,"")
			  + "&page="  + pageType
			  + "&sort="  + document.getElementById('sort').value
			  + "&view="  + document.getElementById('view').value
			  + "&field=" + encodeURI(document.getElementById('field').value);
	
	const state = {
		"index" : index,
		"start" : document.getElementById('startDate').value.replace(/[^0-9]/gi,""),
		"end"   : document.getElementById('endDate').value.replace(/[^0-9]/gi,""),
		"page"  : pageType,															  
		"sort"  : document.getElementById('sort').value,
		"view"  : document.getElementById('view').value,
		"field" : encodeURI(document.getElementById('field').value)			
	};
	
	history.pushState(state, null, url);		
}

//Tab(예약신청/변경) 데이터셋 가져오기
function getTabPage() {
	const tab = document.querySelectorAll('.tab-tit li');
	let page  = "";
	
	//예약신청:apply, 예약변경/취소:change
	tab.forEach(function(item) {
		if (item.classList.contains("active")) {
			page = item.dataset.page;
		}
	});
	
	return page;
}

//확정/마감(발송)/마감(미발송) 상태 변경
function stateBtn() {
    const btn = document.querySelectorAll('.reserve-list-status > button');
    
    for (let i = 0; i <btn.length; i++) {
        btn[i].addEventListener('click',function(){
            const parent = btn[i].parentElement.querySelectorAll('button');

            parent.forEach((el) => el.classList.remove('active'));
            btn[i].classList.add('active');
        });
    }
}

//예약 확정 처리
function confirmReserve(rno, page) {
	const card = document.querySelector(`.tab-con.active li[data-rno="${rno}"]`);
	
	//베가스 전송 메모
	let html = '';
	let resList = new Array();
	card.querySelectorAll('.reserve-list-product p').forEach((ele) => {		
		html += ele.innerText + '\n\n';
	});	
	
	//고객메모
	if (!isNullStr(card.querySelector('.resNote'))) {
		html += '\n[고객 요청사항]\n' + card.querySelector('.resNote').innerText;	
	}
	
	//시술 전 상담
	if (card.querySelector('.round-check').checked) {
		html += '\n시술전 자세한 상담을 희망합니다.';	
	}
	
	html += '\n\n';
	html += '---------------------\n';
	
	//시술 총 가격
	const toatlPrice   = card.querySelector("input[name='reserve_info']").dataset.total;
	const reserveItems = card.querySelectorAll('.reserve-list-product p').length;
	
	html += '총 ' + reserveItems + '개의 시술 금액 : ' + toatlPrice.toLocaleString('ko-KR') + '원 ';
	
	const hCode = document.getElementById("hospitalCode").value;
	const oCode = document.getElementById("officeCode").value;
	const token = document.querySelector(".page-url").dataset.token;
	const params = {
		"hospitalCode" : hCode,
		"officeCode"   : oCode,
		"userId"	   : card.querySelector("input[name='reserve_info']").dataset.id,
		"resNo"		   : rno,
		"hospitalNote" : card.querySelector(".hospitalNote").value,
		"resDate" 	   : card.querySelector("input[name='reserve_info']").dataset.date,
		"resTime"	   : card.querySelector("input[name='reserve_info']").dataset.time,
		"resType"	   : card.querySelector("input[name='reserve_info']").dataset.restype,
		"page"   	   : page,
		"resMemo"      : html
	};
	
	commonAjax.call("/res/updateReserveConfirm", "POST", params, function(data){			
		if (data.message == "OK") {
			document.querySelector('.tab-con.active .right-area').style.display = 'none';
			
			fetch(`${updateURI}/${oCode}?resno=${rno}&status=1&accessToken=${token}`)
				.then((response) => {			
					if (response.ok) {
						getReserveList();
					}
				});					
		}
	});
}

//예약 마감 처리
function closeReserve(rno, alarm) {	
	const card = document.querySelector(`.tab-con.active li[data-rno="${rno}"]`);
	
	const hCode = document.getElementById("hospitalCode").value;
	const oCode = document.getElementById("officeCode").value;
	const token = document.querySelector(".page-url").dataset.token;
	const params = {
		"hospitalCode" : hCode,
		"officeCode"   : oCode,
		"userId"	   : card.querySelector('input[name="reserve_info"]').dataset.id,
		"resNo"		   : rno,
		"hospitalNote" : card.querySelector(".hospitalNote").value,
		"resDate" 	   : card.querySelector('input[name="reserve_info"]').dataset.date,
		"resTime"	   : card.querySelector('input[name="reserve_info"]').dataset.time,
		"resType"	   : card.querySelector("input[name='reserve_info']").dataset.restype,
		"alarmYn"	   : alarm,
		"page"         : document.querySelector('.tab-tit ul li.active').dataset.page
	};
	
	commonAjax.call("/res/updateReserveClose", "POST", params, function(data){			
		if (data.message == "OK") {
			fetch(`${updateURI}/${oCode}?resno=${rno}&status=1&accessToken=${token}`)
				.then((response) => {			
					if (response.ok) {
						getReserveList();			
						
						document.querySelectorAll(".tab-con.active .left-con li").forEach(function(item) {
							if (item.dataset.rno == rno) {
								item.classList.add('active');
							} 
						});
					}
				});	
		}
	});
}

//예약 취소 처리
function cancelReserve(rno) {	
	const card = document.querySelector(`.tab-con.active li[data-rno="${rno}"]`);
	
	if (confirm("예약을 취소하시겠습니까?")) {
		const hCode = document.getElementById("hospitalCode").value;
		const oCode = document.getElementById("officeCode").value;
		const token = document.querySelector(".page-url").dataset.token;
		const params = {
			"hospitalCode" : hCode,
			"officeCode"   : oCode,
			"userId"	   : card.querySelector('input[name="reserve_info"]').dataset.id,
			"resNo"		   : rno
		};
		
		commonAjax.call("/res/updateReserveCancel", "POST", params, function(data){			
			if (data.message == "OK") {
				alert("취소 처리되었습니다.");								
			} else {
				alert(data.message);
			}
			
			fetch(`${updateURI}/${oCode}?resno=${rno}&status=1&accessToken=${token}`)
			.then((response) => {			
				if (response.ok) {
					getReserveList();			
				}
			});	
		});	
	} else {		
		card.querySelector(".reserve-list-status").childNodes[2].classList.remove("active");
	}
}

//예약 리스트 검색
function search() {		
	const pateType = getTabPage();	
	setParams(1, pateType);
	
	getReserveList();
}

//검색 조건 이벤트 리스너
function setOptionEvent() {
	document.getElementById('view').addEventListener('change',function(){
		search();	
	});
	
	document.getElementById('sort').addEventListener('change',function(){
		search();
	});

	document.getElementById("field").addEventListener("keyup", (e)=>{
	    if (e.keyCode === 13) {
	    	search();
	    }  
	});
}

//예약 인원 현황 스크롤 이벤트
function scroll() {
    const con   = document.querySelector('.tab-con.active');
    const right = con.querySelector('.right-area');

    document.addEventListener('scroll',function(){
        if (con.getBoundingClientRect().top < 0) {
            right.classList.add('active');
            right.style.top = ( window.scrollY - 260 ) + 'px'
        } else if (con.getBoundingClientRect().top > 0) {
            right.classList.remove('active');
        }
    })
}

//예약 인원 현황 조회 이벤트
function setReserveStatusEvent() {
    const list = document.querySelectorAll('.tab-con.active ul.left-con > li');
	
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener('click',function(){
        	if (!list[i].classList.contains('active')) {
            	list.forEach((ele) => ele.classList.remove('active'));
                list[i].classList.add('active');
                
                document.querySelector('.tab-con.active .right-area').style.display = 'block';
                
            	const params = {
        			"hospitalCode" : document.getElementById("hospitalCode").value,
        			"officeCode"   : document.getElementById("officeCode").value,
        			"resNo"		   : list[i].querySelector('input[name="reserve_info"]').dataset.rno,
        			"resTime"      : list[i].querySelector('input[name="reserve_info"]').dataset.time,
        			"resDate"      : list[i].querySelector('input[name="reserve_info"]').dataset.date
            	};

            	commonAjax.call("/res/getReserveStatus", "POST", params, function(data){			
            		if (data.message == "OK") {
            			drawReserveStatus(data);  //예약 인원 현황 그리기
            		}
            	});	
        	}
        });
    }
}

//예약 인원 현황 그리기
function drawReserveStatus(data){
	const prdMst = data.result.prdMst;
	const prdSub = data.result.prdSub;
	let parent , totalCount;
	 
	if (!isPop) {
		parent = document.querySelector('.tab-con.active');
		parent.querySelector('.right-area .date-txt').innerHTML = `*${prdMst[0].resDate}`; 	
	} else {
		parent = document.querySelector('.popup');
	}
	
	totalCount = parent.querySelector('.prd-mst .count-area');
	totalCount.innerHTML = 
		`<p>예약</p>
		<div class="count">
			<bold>${prdMst[0].totalResCnt}</bold>/${prdMst[0].maxCnt}
		</div>`;
	
	const mstDiv = parent.querySelector('.prd-mst ul');
	mstDiv.innerHTML = "";
	
	for (let i = 0; i < prdMst.length; i++) {
		mstDiv.innerHTML +=
			`<li data-mst="${prdMst[i].prdMstCode}">
                <span>${prdMst[i].prdMstName}</span>
                <span>
                	<bold>${prdMst[i].prdResCnt}</bold>/<i>${prdMst[i].resCnt}</i>
        	    </span>
            </li>`;
		
		//무한대일 경우
		if (prdMst[i].resCnt == '999') {
			const icon = mstDiv.querySelectorAll('li i')[i];
			icon.innerHTML = '';
			icon.classList.add('unlimit');
		}
		
		if (prdMst[i].resCnt == prdMst[i].prdResCnt) {
			parent.querySelector('.prd-mst li:last-child bold').classList.add('end');
		}
		
		if (prdMst[i].isActive == 1) {
			parent.querySelectorAll('.prd-mst li')[i].classList.add('active');
		}
	}
	
	drawSubList(prdSub)
}

//요일별 소분류 리스트 그리기
function drawSubList(prdSub){
	const parent = isPop == true ? document.querySelector('.popup') : document.querySelector('.tab-con.active');	
	
	if (document.querySelector('.popup').classList.contains('all')) {
		document.querySelector('.popup-inner > .del-btn').style.right = '480px';
	}

	if (prdSub.length > 0) {
		parent.querySelector('.prd-sub').style.display = 'flex';	
		
		let mstInner;		
		const subDiv = parent.querySelector('.prd-sub .count-area');	            			
		subDiv.innerHTML = "";
		
		subDiv.innerHTML = 
			`<div class="prd-sub-inner" data-mst="${prdSub[0].prdMstCode}">
				<div>
	        	    <p>${prdSub[0].prdMstName}</p>
	           		<div class="count"></div>
	        	</div>
	        
	        	<ul class="detail-area">
	        		<li data-code="${prdSub[0].prdSubCode}">
						<span>${prdSub[0].prdSubName}</span>
	                	<span><bold>${prdSub[0].prdSubCnt}</bold>/<i>${prdSub[0].resCnt}</i></span>
	                </li>
	        	</ul>
	        </div>`;
		
		const subUl = parent.querySelector('.prd-sub ul.detail-area');	 
		const active = document.querySelectorAll('ul.time-table li');
		let seq; 
		
		for (let i = 0; i < active.length; i++) {
			if (active[i].classList.contains('active')) {
				seq = i
			}
		};
		
		for (let i = 0; i < prdSub.length; i++) {
			if (i > 0) {
				if (prdSub[i].prdMstCode != prdSub[i-1].prdMstCode) { 
					subDiv.innerHTML +=
						`<div class="prd-sub-inner" data-mst="${prdSub[i].prdMstCode}">
							<div>
			            	    <p>${prdSub[i].prdMstName}</p>
			               		<div class="count"></div>
			            	</div>
		                
		                	<ul class="detail-area">
		                		<li data-code="${prdSub[i].prdSubCode}">
				                    <span>${prdSub[i].prdSubName}</span>
			                    	<span><bold>${prdSub[i].prdSubCnt}</bold>/<i>${prdSub[i].resCnt}</i></span>
				                </li>
		                	</ul>
		                </div>`;	
				} else {				
					subUl.innerHTML += 
						`<li data-code="${prdSub[i].prdSubCode}">
		                    <span>${prdSub[i].prdSubName}</span>
		                	<span><bold>${prdSub[i].prdSubCnt}</bold>/<i>${prdSub[i].resCnt}</i></span>
		                </li>`;				
				}
			}else {
				subUl.innerHTML = 
					`<li data-code="${prdSub[i].prdSubCode}">
	                    <span>${prdSub[i].prdSubName}</span>
	                	<span><bold>${prdSub[i].prdSubCnt}</bold>/<i>${prdSub[i].resCnt}</i></span>
	                </li>`;
			}
			
			//무한대일 경우
			if (prdSub[i].resCnt == '999') {
				const icon = subDiv.querySelectorAll('li i')[i];
				icon.innerHTML = '';
				icon.classList.add('unlimit');
			}
			
			if (prdSub[i].isActive == 1) {
				subDiv.querySelectorAll('.detail-area li')[i].classList.add('active');
			}
			
			if (prdSub[i].resCnt == prdSub[i].prdSubCnt) {
				parent.querySelector('.prd-sub li:last-child bold').classList.add('end');
			}
			
			const subInner = parent.querySelectorAll('.prd-sub-inner');
			
			if (isPop && document.querySelector('.dark-small-btn').dataset.type == 'one') {
				mstInner = parent.querySelectorAll('.num-area ul');
				
				mstInner.forEach(function(mstItem) {	    		
					subInner.forEach(function(subItem) {
		    			if (mstItem.querySelector('label').innerText == subItem.querySelector('p').innerText) {
		    				subItem.querySelector('.count').innerHTML = mstItem.querySelectorAll('li')[seq].innerHTML;
				    	}	
		    		});		    	
			    });	
			} else {
				mstInner = parent.querySelectorAll('.prd-mst li');
				
				mstInner.forEach(function(mstItem) {	    		
					subInner.forEach(function(subItem) {
		    			if (mstItem.dataset.mst == subItem.dataset.mst) {
		    				subItem.querySelector('.count').innerHTML = mstItem.querySelectorAll('span')[1].innerHTML;
				    	}	
		    		});		    	
			    });	
			}
		}
	} else {
		parent.querySelector('.prd-sub').style.display = 'none';	
	}
}

//예약일 변경 hover
function reserveHover() {
    const btn = document.querySelectorAll('.reserve-date-change > button');

    for (let i = 0; i <  btn.length; i++) {
    	if (!isNullStr(btn[i].nextElementSibling.innerHTML)) {
            btn[i].addEventListener('mouseenter',function(){
                btn[i].nextElementSibling.style.display = 'block';
            });

            btn[i].addEventListener('mouseleave',function(){
                btn[i].nextElementSibling.style.display = 'none';
            });
    	}
    }
}

//예약일 변경 팝업
function reservePopup() {
    const btn = document.querySelectorAll('.reserve-date-change > button');
    let content;

    for (let i = 0; i <  btn.length; i++) {
        btn[i].addEventListener('click',function(){
        	event.stopPropagation();
        	const parent = btn[i].closest('.left-con li');
        	const params = {
    			"userId"     : parent.querySelector('input[name="reserve_info"]').dataset.id,
    			"userName"   : parent.querySelector('input[name="reserve_info"]').dataset.name,
    			"userMobile" : parent.querySelector('input[name="reserve_info"]').dataset.mobile,
    			"resNo"      : parent.dataset.rno,
    			"resDate"    : parent.querySelector('input[name="reserve_info"]').dataset.resdate.split('(')[0],
    			"resTime"    : parent.querySelector('input[name="reserve_info"]').dataset.time,
    			"resType"    : parent.querySelector('input[name="reserve_info"]').dataset.restype
        	}
        	
            const content = 
                `<input type="hidden" name="reserve-change"
                	data-userId     = "${params.userId}"
                	data-userMobile = "${params.userMobile}"
                	data-resNo   = "${params.resNo}"
                	data-resDate = "${params.resDate}"
                	data-resTime = "${params.resTime}"
                	data-resType = "${params.resType}"/>
                	
                 <div class="popup-tit">
                 	<div class="text">	
                         <p>예약일 변경 - <span>${params.userName}</span> / ${params.userMobile}</p>
                 	</div>
                 </div>
                 
                 <div class="popup-con">		
                 	<div class="pop-left">
                 		<label for="date" class="need">희망 예약일</label>
 						<div class="con date">
 							<input type="text" class="start-date" id="newResDate" value="${params.resDate}" name="resDate" placeholder="희망 예약일" autocomplete="off">
 						</div>
 						
 						<label for="time" class="need">희망 예약시간</label>
 						<ul class="con time scroll border-style"></ul>
                 	</div>
                 	
         			<div class="pop-right">
 	        			<div>
 							<label for="reserve" class="need">예약 현황</label>
 							<button type="button" class="dark-small-btn" data-type="all" onclick="getAllReserveStatus(); clickTimeData();">전체 현황 확인</button> 
 						</div>
 						
 						<div class="right-inner"></div>
         			</div>
         		</div>
         		
         		<div class="popup-btn">
 		            <button class="save-btn blue-btn" type="button" onclick="updateReserveDate()">변경하기</button>
 		        </div>`;
             
        	parent.click();
            commonDrawPopup("draw", content);
            
            initReserveChange(); //예약일 변경 초기함수 (res002Time.js)
        });
    }
}

//예약 카드 클릭시(작업시작)
function clickCard(target) {
	event.stopPropagation();		
	const oCode = document.getElementById("officeCode").value;	
	const resno = target.dataset.rno;
	const token = document.querySelector(".page-url").dataset.token;	
	
	//기존 작업 종료
	listArr.forEach(function(el) { 		
		if (el.userId === worksId) {						
			fetch(`${confirmURI}/${oCode}?resno=${el.resno}&accessToken=${token}`);
		}		
	});		
	
	fetch(`${actionURI}/${oCode}?resno=${resno}&userId=${worksId}&accessToken=${token}`);
}

//예약 강제 확인(작업종료)
function hideCard(target) {
	event.stopPropagation();
	const parent = target.closest('.left-con li');	
	const oCode  = document.getElementById("officeCode").value;
	const resno  = parent.dataset.rno;	
	const token  = document.querySelector(".page-url").dataset.token;	

	fetch(`${confirmURI}/${oCode}?resno=${resno}&accessToken=${token}`)
		.then((response) => {			
			if (response.ok) {
				parent.querySelector('.use-overlay').classList.remove('active');
			}
		});		
}