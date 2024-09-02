function initReserveChange(){
	const resTime = document.querySelector('input[name="reserve-change"]').dataset.restime.replace(/[^0-9]/g , '');
	const parent  = subPop ? document.querySelector('.sub-pop') : document.querySelector('.popup');
	
	drawOneList();            //선택 현황 그리기
 	getWishTimeList(resTime); //시간 그리기		
 	
 	//팝업 닫기 변경 
 	parent.querySelector('.popup-overlay').removeAttribute('onclick');   			
 	parent.querySelector('.popup-overlay').setAttribute('onclick', 'res002TimePopupClose()');
 	parent.querySelector('.del-btn').removeAttribute('onclick');
 	parent.querySelector('.del-btn').setAttribute('onclick', 'res002TimePopupClose()');
}

//선택 현황 그리기 
function drawOneList(){
	const parent = subPop ? document.querySelector('.sub-pop') : document.querySelector('.popup');
	
	parent.querySelector('.right-inner').innerHTML =
		`<ul class="right-con scroll">
            <li class="prd-mst">
                <div class="count-area"></div>

                <ul class="detail-area"></ul>
            </li>
            
            <li class="prd-sub">
                <div class="count-area"></div>
            </li>
        </ul>`;
	
	parent.querySelector('.pop-right').style.width = '430px';
	parent.querySelector('.popup-inner').classList.remove('all');
	parent.querySelector('.popup-inner > .del-btn').style.right = '30px';
	
	if (!isNullStr(parent.querySelector('.all-sub'))){
		parent.querySelector('.dark-small-btn').innerHTML = '전체 현황 확인';
		parent.querySelector('.dark-small-btn').dataset.type = 'all';
		parent.querySelector('.dark-small-btn').setAttribute('onclick' , 'getAllReserveStatus(); clickTimeData();');
		parent.querySelector('.all-sub').remove();
		
		getWishDateStatus();  //예약일 변경 - 예약현황 조회
	}
}

//예약일 변경 - 예약현황 조회
function getWishDateStatus() {
	const dateStatus = document.querySelector('.pop-right');
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"resNo"	       : document.querySelector('input[name="reserve-change"]').dataset.resno,
		"resDate"	   : document.getElementById("newResDate").value.replace(/[^0-9]/g, ""),
		"resTime"	   : document.querySelector('.pop-left li.active').dataset.time
	};
	
	commonAjax.call("/res/getReserveStatus", "POST", params, function(data){			
		if (data.message == "OK") {
			popDrawReserveStatus(data);  //예약 인원 현황 그리기
		}
	});
}

//예약 인원 현황 그리기
function popDrawReserveStatus(data){
	const prdMst = data.result.prdMst;
	const prdSub = data.result.prdSub;
	let parent , totalCount;
	 
	if (!isPop) {
		parent = document.querySelector('.tab-con.active');
		parent.querySelector('.right-area .date-txt').innerHTML = `*${prdMst[0].resDate}`; 	
	} else {
		parent = subPop ? document.querySelector('.sub-pop') : document.querySelector('.popup');
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
	
	popDrawSubList(prdSub)  //요일별 소분류 리스트 그리기
}

//요일별 소분류 리스트 그리기
function popDrawSubList(prdSub){
	let parent;
	
	if (subPop) {
		parent = document.querySelector('.sub-pop');        //예약 접수, 확인 페이지 예약일 변경
	} else if (isPop) { 
		parent = document.querySelector('.popup');          //예약 대기 예약일 변경
	} else {
		parent = document.querySelector('.tab-con.active');	//예약 대기 소분류 인원 표시
	}
	
	if (parent.classList.contains('all')) {
		parent.querySelector('.popup-inner > .del-btn').style.right = '480px';
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
		
		const subUl  = parent.querySelector('.prd-sub ul.detail-area');	 
		const active = parent.querySelectorAll('ul.time-table li');
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

//시간 그리기
function getWishTimeList(resTime) {	
	const div   = document.querySelector('.pop-left .time');
	let resDate = document.getElementById("newResDate");
	
	//예약 접수일 경우 날짜가 빈값 = 오늘 날짜를 넣어줌
	if (isNullStr(resDate.value)) {
		const date  = new Date();
	    const year  = date.getFullYear();
	    const month = (1 + date.getMonth());
	    const day   = date.getDate();
	    
	    resDate.value = year + '년 ' + ("00" + Number(month)).slice(-2) + '월 ' + ("00" + Number(day)).slice(-2) + '일'
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"resDate"      : resDate.value.replace(/[^0-9]/g,'')
	};

	commonAjax.call("/res/getWishTimeList", "POST", params, function(data){			
		if (data.message == "OK") {
			let now          = new Date();
			const todayDate  = now.getFullYear() + ("00" + (1 + now.getMonth())).slice(-2) + ("00" + now.getDate()).slice(-2);
			const result     = data.resultList;
			div.innerHTML = '';

			for (let i = 0; i < result.length; i++) {
				div.innerHTML += 
					`<li data-time="${result[i].hhmm.replace(':','')}">
						<p>${result[i].hhmm}</p>
						<p>예약 <bold>${result[i].totalResCnt}</bold>/${result[i].maxCnt}</p>
					</li>`;	
			};
			
			if (params.resDate == todayDate) {
				//현재 시간 구하기
				let hour  = now.getHours();
				let min   = now.getMinutes();
				
				if (min > 30) {
					hour = hour + 1;
					min = '00';
				} else {
					min = '30';
				}
				
				const value = ('00' + hour).slice(-2) + ('00' + min).slice(-2);
				
				//현재 시간보다 이전의 시간 지우기
				div.querySelectorAll('li').forEach((item) => {
					if (value > item.dataset.time) {
						item.remove();
					}
				});	
				
				//남아 있는 시간이 없을 경우 
				if (div.querySelectorAll('li').length == 0) {
					div.innerHTML = `<li id="noSearch">예약 가능한 시간이 없습니다.</li>`;
				}
			}
		}
	});	
	
	clickTimeData();  //희망 예약시간 선택 시 예약 현황 조회
		
	if (resTime.length == 4) {
		const selectedTime = document.querySelector(`.pop-left ul.time li[data-time="${resTime}"]`);
		
		if (!isNullStr(selectedTime)) {
			selectedTime.click();
		}
	} else {
		document.querySelectorAll('.pop-left ul.time li')[0].click();
	}
}

//희망 예약시간 선택 시 예약 현황 조회
function clickTimeData(){	
	const li  = document.querySelectorAll(".pop-left ul.time li");
	const btn = document.querySelector('.dark-small-btn');
	
	for (let i = 0; i < li.length; i++) {
		li[i].addEventListener('click',function(){
			li.forEach((ele) => ele.classList.remove('active'));
			li[i].classList.add('active');
			
			if (document.querySelector('.dark-small-btn').dataset.type == 'one') {
				getAllReserveStatus();  //전체 예약 현황 조회			
			} else {
				getWishDateStatus();    //예약일 변경 - 예약현황 조회
			}
		});
	}
	
	//남은 시술권 등록으로 인해 이전 날짜 임시로 해제 해둠
	commonDatePicker(["newResDate"] , '' , getWishTimeList);
	//commonDatePicker(["newResDate"] , '' , getWishTimeList , true);
}

//전체 예약 현황 조회
function getAllReserveStatus(){
	const resDate = document.getElementById("newResDate").value;
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"resNo"        : document.querySelector('input[name="reserve-change"]').dataset.resno,
		"resDate" 	   : resDate.replace(/[^0-9]/g, ""),
		"resTime"	   : document.querySelector('.pop-left li.active').dataset.time
	};
	
	commonAjax.call("/res/getAllReserveStatus", "POST", params, function(data){			
		if (data.message == "OK") {			
			const prdMst = data.result.prdMst;
			
			if (prdMst.length > 0) {
				const mtList  = prdMst[0].prdMstName.split('\n');
				
				document.querySelector('.dark-small-btn').innerHTML    = '선택 현황 확인';
				document.querySelector('.dark-small-btn').dataset.type = 'one';
				document.querySelector('.dark-small-btn').setAttribute('onclick' , 'drawOneList()');
				
				const table = document.querySelector('.pop-right .right-inner');
				table.innerHTML = '';
				table.classList.add('all');
				table.classList.add('scroll');
				table.parentElement.style.width = '600px';
				
				const timeTable = document.createElement('ul');	//시간
				timeTable.classList.add('time-table');
				table.appendChild(timeTable);
				timeTable.innerHTML = '<label class="tit-table">시간</label>';
				
				prdMst.forEach(function(time){
					timeTable.innerHTML += `<li value="${time.resTime}">${time.hhmm}</li>`;
				});
				
				const mtTable = document.createElement('div'); //대분류
				mtTable.classList.add('num-area');
				table.appendChild(mtTable);
				mtTable.classList.add('scroll-x');
				
				const mstList = prdMst[0].prdMstName.split('\n');
				for(let i = 0; i < mstList.length; i++) {
					mtTable.innerHTML += 
						`<ul class="data-table">
			                <label class="tit-table">${mstList[i]}</label>
			            </ul>`;
					
					for (let j = 0; j < prdMst.length; j++) {
						const resCnt = prdMst[j].resCnt.split('\n');
						const prdResCnt = prdMst[j].prdResCnt.split('\n');
						let content;
						
						if (resCnt[i] == '999') {
							content = `<li><i class="unlimit"></li>`;		
						} else {
							content = `<li><bold>${prdResCnt[i]}</bold>/<span>${resCnt[i]}</span></li>`;	
						}
						
						table.querySelectorAll('.data-table')[i].innerHTML += content;
					}
				}
				
				const personTable = document.createElement('ul'); //인원
				personTable.classList.add('person-table');
				table.appendChild(personTable);
				
				personTable.innerHTML = 
					`<label class="tit-table need">인원</label>`;
				
				for(let i = 0; i < prdMst.length; i++){
					table.querySelector('.person-table').innerHTML += 
						`<li><span>${prdMst[i].totalResCnt}</span>/<span>${prdMst[i].maxCnt}</span></li>`
				}
			
				tableActive(data);
			}
			
			document.getElementById("newResDate").value = resDate;
		}
	});
}

function tableActive(data){	
	const prdSub     = data.result.prdSub;
	const prdMst     = data.result.prdMst;
	const activeTime = document.querySelector('.pop-left li.active').dataset.time;
	const mstList    = prdMst[0].prdMstName.split('\n');
	let seq;
	
	for (let i = 0; i < prdMst.length; i++) {
		if (activeTime == document.querySelectorAll('.time-table li')[i].value) {
			 document.querySelectorAll('.time-table li')[i].classList.add('active');
			 seq = i;
		}
	}
	
	const activeMst = prdMst[seq].isActive.split('\n');
	
	for(let i = 0 ; i < mstList.length; i++) {
		if (activeMst[i] == '1') {
			document.querySelectorAll('.data-table')[i].querySelectorAll('li')[seq].classList.add('active');	
		} else {
			document.querySelectorAll('.data-table')[i].querySelectorAll('li')[seq].classList.add('disable');	
		}
	}
	
	document.querySelectorAll('.person-table li')[seq].classList.add('active');
	
	//전체인원현황 소분류 그리기
	const parent = subPop ? document.querySelector('.sub-pop') : document.querySelector('.popup');
	const popup  = parent.querySelector('.popup-inner');
	
	if (!popup.classList.contains('all')) {
		popup.classList.add('all');
	
		popup.innerHTML +=
			`<div class="popup-con all-sub prd-sub" style="display:none;">
				<label class="need">특정 소분류 설정</label>
				<ul class="all-sub scroll right-con">
					<li class="prd-sub">
						<div class="count-area"></div>
					</li>
				</ul/>
			</div>`;			
	}
	
	popDrawSubList(prdSub)  //요일별 소분류 리스트 그리기
}

//예약일 변경하기
function updateReserveDate() {
	const resDate = document.getElementById("newResDate").value
	const params  = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"userId"	   : document.querySelector('input[name="reserve-change"]').dataset.userid,
		"resNo"        : document.querySelector('input[name="reserve-change"]').dataset.resno,
		"resDate" 	   : resDate.replace(/[^0-9]/g, ""),
		"resTime"	   : document.querySelector('.pop-left li.active').dataset.time,
	};
	
	if (subPop) {
		subPopupClose();
		
		document.getElementById('reserveDate').value = resDate;
		document.getElementById('reserveTime').value = params.resTime.substr(0,2) + ':' + params.resTime.substr(2,4);
	} else {
		params.resType = document.querySelector('input[name="reserve-change"]').dataset.restype;
		
		commonAjax.call("/res/updateReserveDate", "POST", params, function(data){			
			if (data.message == "OK") {
				popupClose();
				
				getReserveList();  //예약 리스트 조회(res002.js)		
			}
		});
	}
}

function res002TimePopupClose() {
	const parent = subPop ? document.querySelector('.sub-pop') : document.querySelector('.popup');
	
	parent.querySelector('.popup-inner').classList.remove('all');	
	parent.querySelector('.popup-inner').innerHTML = 
		`<div class="del-btn" onclick="subPopupClose()" style="right: 30px;"></div>
		 <div id="popupInner"></div>`; 
	
	parent.classList.remove('active');
}