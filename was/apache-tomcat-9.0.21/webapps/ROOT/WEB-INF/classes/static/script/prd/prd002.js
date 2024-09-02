function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;	
	document.getElementById("officeCode").value = officeCode;	

	getEventGroupList();
}

//병원, 지점 변경
function reload() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonSetOfficeSite(".page-url", params);
	
	location.href = "/prd/prd002";
}

//이벤트 중그룹 리스트 조회
function getEventGroupList() {	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/prd/getEventGroupList", "POST", params, function(data) {
		if (data.message == "OK") {
			const result  = data.resultList;
			const div     = document.querySelector('.prd-area ul');
			div.innerHTML = "";
			
			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					const eventName	= result[i].eventName;
					const eventSeq  = result[i].eventSeq;
					
					div.innerHTML += 
						`<li class="hide" data-seq="${eventSeq}">			                
			                <span onclick="location.href='/prd/prd002?seq=${eventSeq}'">${result[i].eventName}</span>
							<i onclick="floatMenu(this)"></i>
							
							<div class="show-area alert float hide editY">
				            	<button type="button" class="show-prd" value="${result[i].displayYn}" onclick="updateEventGroupDisplay(this)">미노출</button>
		            			<button type="button" class="edit-prd" onclick="eventGroupPopup('update', ${eventSeq})">수정</button>
		            			<button type="button" class="del-prd editY" onclick="showDeleteEventGroupPopup(this, 'G')">삭제</button>
					        </div>
			            </li>`;	
					
					setEventStatus(document.querySelectorAll('button.show-prd')[i]); //이벤트 중그룹 노출,미노출 상태 반영
				}
						
				const searchParams = commonGetQueryString();
				
				if (isNullStr(searchParams)) {
					//초기값 선택
					getEventGroupSubList(div.children[0]);
				} else {
					getEventGroupSubList(div.querySelector(`li[data-seq="${searchParams.get("seq")}"]`));
					
					//해당 이벤트로 포커싱
					const sub  = searchParams.get("sub");
					const code = searchParams.get("code");
					
					if (!isNullStr(sub) && !isNullStr(code)) {
						const option = {behavior: "smooth", block: "start", inline: "nearest"};
						document.querySelector(`.section[data-sub="${sub}"] .step3 li[data-code="${code}"]`).scrollIntoView(option);	
					}					
				}
			} else { //이벤트 중그룹이 없을때
				document.querySelector('.left').innerHTML = '';
				drawEventSubArea(); 	
			}
			
			div.innerHTML += `<button type="button" class="add-prd" onclick="eventGroupPopup('insert')">추가하기</button>`
		} else {
			alert(data.message);
		}
		
		const seq = document.querySelector('.prd li.active').dataset.seq;		
		commonSetOfficeSite(".page-url", params, `/event?seq=${seq}`);
	});			
}

//중분류 시술 화살표 메뉴
function floatMenu(target) {
	const parent = target.parentElement;
	const all    = document.querySelectorAll('.show-area');
	const area   = parent.querySelector('.show-area');
	
	if (area.classList.contains('active')) {
		all.forEach((ele) => ele.classList.remove('active'));
		area.classList.remove('active');
	} else {
		all.forEach((ele) => ele.classList.remove('active'));
		area.classList.add('active');
	}
}

//이벤트 중그룹 노출,미노출 상태 반영
function setEventStatus(target) {
	const parent = target.parentElement.parentElement;
	const span = parent.querySelector('span');
	const area = parent.querySelector('.show-area');
	
	if (target.value == 'Y') {
		span.style.textDecoration = 'none';
		target.innerText = '미노출';		
	} else {
		span.style.textDecoration = 'line-through';
		target.innerText = '노출';
	}
	
	area.classList.remove('display');
}

//이벤트 중그룹 팝업
function eventGroupPopup(type, seq) {  
    const content = 
		`<form id="frm" onsubmit="return false">
	         <div class="popup-tit"><p>이벤트 그룹 추가</p></div>        
	         <div class="popup-con" style="width:360px">
	        	<div class="show-area">
	                <label for="name" class="need">노출/미노출</label>
					<div class="select-box">
				    	<select id="displayYn">
				    		<option value="Y">노출</option>
				    		<option value="N">미노출</option>
				    	</select>
						<div class="icon-arrow"></div>	
					</div>
	        	</div>
				
				<div class="name-area">
	                <label for="eventName" class="need">그룹명</label>
					<input type="text" id="eventName" placeholder="그룹명을 입력해 주세요." required>
				</div>
				
				<div class="date-area">
	            	<label for="startDate">특정 예약 가능 날짜</label>
	            	<div class="area">
				        <div class="con date">
			       			<input type="text" class="start-date" id="startDate" name="startDate" placeholder="시작일" autocomplete="off">
				        </div>
				      
			       		<span class="wave">~</span>
			       		
			        	<div class="con date">
			       			<input type="text" class="end-date" id="endDate" name="endDate" placeholder="종료일" autocomplete="off">
				        </div>
	            	</div>
				</div>
				
				<div class="day-area">
					<label for="day" class="need">예약 가능 요일</label>
	    			<div class="area">
	    				<button type="button" value="1">월</button>
	    				<button type="button" value="2">화</button>
	    				<button type="button" value="3">수</button>
	    				<button type="button" value="4">목</button>
	    				<button type="button" value="5">금</button>
	    				<button type="button" value="6">토</button>
	    				<button type="button" value="0">일</button>
	    			</div>
				</div>    			
				
				<div class="time-area">
					<label for="name" class="need">예약 가능 시간</label>	
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
				</div>
			</div>

	        <div class="popup-btn">
	            <button type="button" class="save-btn blue-btn">저장하기</button>
	        </div>
        </form>`;	
	
    commonDrawPopup("draw", content);  
    
    hourOption('10', '21'); //예약 가능 시간 셀렉트 박스 그리기
    activeDayBtn();         //예약 가능 요일 버튼 이벤트
    commonDatePicker(["startDate" , "endDate"]);
    
    if (type == 'update') { 
		setEventGroupContent(seq);
		
		document.querySelector('.popup-btn button').setAttribute('onclick',`updateEventGroup("${seq}")`);
	} else {
		document.querySelector('.popup-btn button').setAttribute('onclick','insertEventGroup()');
	}
}

//예약 가능 시간 셀렉트 박스 그리기
function hourOption(start, end) {
	const startHours = document.querySelector('#startTime');    
	const endHours   = document.querySelector('#endTime');    
	
	startHours.innerHTML = "";
	endHours.innerHTML   = "";
	
	for (let i = Number(start); i <= Number(end); i++) {
		startHours.innerHTML += `<option value="${i}">${i}</option>`;		
		endHours.innerHTML += `<option value="${i}">${i}</option>`;
		
		if (i == Number(end)) {
			endHours.querySelector('option:last-child').selected = true;
		}
	}
}

//예약 가능 요일 버튼 이벤트
function activeDayBtn() { 
	const btn = document.querySelectorAll('.day-area button');    
	
	btn.forEach((item) => {
		item.addEventListener('click',function(){
			item.classList.toggle('active');		
		});
	});
}

//이벤트 중그룹 내용 조회
function setEventGroupContent(seq) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"eventSeq"     : seq
	};
	
	commonAjax.call("/prd/getEventGroupList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList[0];				
			const startTime  = result.startTime;
			const endTime    = result.endTime;
			const reserveDay = result.reserveDay.split(',');
			
		    document.querySelector('.popup-tit p').innerText = '이벤트 그룹 수정';
		    document.getElementById('eventName').value = result.eventName;
		    document.querySelector(`#displayYn option[value="${result.displayYn}"]`).selected = true;
		    document.querySelector(`#startTime option[value="${startTime.substr(0,2)}"]`).selected = true;
		    document.querySelector(`#startMin option[value="${startTime.substr(2,4)}"]`).selected = true;
		    document.querySelector(`#endTime option[value="${endTime.substr(0,2)}"]`).selected = true;
		    document.querySelector(`#endMin option[value="${endTime.substr(2,4)}"]`).selected = true;
		    document.getElementById('startDate').value = nvlStr(result.startDate);
		    document.getElementById('endDate').value = nvlStr(result.endDate);
		    
		    for (let i = 0; i < reserveDay.length; i++) {
		    	document.querySelector(`.day-area button[value="${reserveDay[i]}"]`).classList.add('active');
		    }		    
		}
	});
}

//이벤트 중그룹 데이터 체크
function checkEventGroupData() {
	const btn = document.querySelectorAll('.day-area button.active'); //예약 가능 요일 선택 여부
	
	if (btn.length <= 0) {
		alert('예약 가능 요일을 선택해주세요.');
		return;
	}

	if (commonCheckRequired("#frm")) {
		let reserveDay = [];
		
		btn.forEach(function(ele){
			reserveDay.push(ele.value);
		})
		
		const startTime = document.getElementById("startTime").value + document.getElementById("startMin").value;
		const endTime   = document.getElementById("endTime").value + document.getElementById("endMin").value;			
		const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"reserveDay"   : String(reserveDay),
			"eventName"    : document.getElementById("eventName").value,
			"startDate"    : document.getElementById("startDate").value.replace(/[^0-9]/gi, ""),
			"endDate"      : document.getElementById("endDate").value.replace(/[^0-9]/gi, ""),
			"startTime"    : startTime,
			"endTime"      : endTime,
			"displayYn"    : document.querySelector(".popup #displayYn").value,
		};
		
		const input = document.getElementById("eventGroup");
		input.value = JSON.stringify(params);
		
		return true;
	}
}

//이벤트 중그룹 추가
function insertEventGroup() {
	const eventGroup = document.getElementById('eventGroup');

	if (checkEventGroupData()) {
		const params       = JSON.parse(eventGroup.value);

		commonAjax.call("/prd/insertEventGroup", "POST", params, function(data) {
			if (data.message == "OK") {
				alert('저장되었습니다.');				
				popupClose();
				
				eventGroup.value = "";				
			    
				getEventGroupList(); //이벤트 중그룹 리스트 조회
			
				const li = document.querySelector('.prd-area ul li:last-of-type');
				getEventGroupSubList(li);		
			} else {
				alert(data.message);
			}
		});		
	}
}

//이벤트 중그룹 수정
function updateEventGroup(seq) {
	const eventGroup = document.getElementById('eventGroup');
	
	if (checkEventGroupData()) {
		const params = JSON.parse(eventGroup.value);
		params.eventSeq = seq;
		
		commonAjax.call("/prd/updateEventGroup", "POST", params, function(data) {
			if (data.message == "OK") {
				alert('저장되었습니다.');
				popupClose();
				
				eventGroup.value = "";
			    
				getEventGroupList();
			} else {
				alert(data.message);
			}
		});		
	}
}

//이벤트 중그룹,소그룹 삭제 팝업조회
function showDeleteEventGroupPopup(target, type) {
	let name, seq, popTitle, content;
	
	if (type == "G") {		//중그룹
		const parent  = target.closest('li');
		name  = parent.querySelector('span').innerText;
		seq   = parent.dataset.seq;
		popTitle = "그룹";
	} else {				//소그룹
		const li = document.querySelector("ul.prd li.active");
		name     = target.parentElement.nextElementSibling.value;
		seq      = li.dataset.seq;
		sub      = target.closest('.section').dataset.sub;
		popTitle = "소그룹";
	}
	
    content = 
        `<div class="popup-tit">
        	<div class="text">
                <p>이벤트 ${popTitle} 삭제</p>
                <span>
	        		삭제된 그룹은 복구되지 않습니다.<br/>
	                ${popTitle}에 속한 이벤트 상품도 같이 삭제됩니다.
                </span>
        	</div>
        </div>
        
        <div class="popup-con" style="width:360px">
            <label for="name" class="need">이벤트 ${popTitle}명</label>
			<input id="name" value="${name}" disabled>
		</div>`;
    
    if (type == "G") {
    	content +=	
        `<div class="popup-btn">
            <button type="button" class="save-btn blue-btn" data-seq="${seq}" onclick="deleteEventGroup(this)">삭제하기</button>
        </div>`;	
    } else {
    	content +=	
        `<div class="popup-btn">
            <button type="button" class="save-btn blue-btn" type="button" data-seq="${seq}" data-sub="${sub}" onclick="deleteEventGroupSub(this)">삭제하기</button>
        </div>`;
    }
    	     
    commonDrawPopup("draw", content);     
}

//이벤트 중그룹 삭제
function deleteEventGroup(target) {
	const div    = document.querySelector('.prd-area ul');
	const params = {
		"hospitalCode"   : document.getElementById("hospitalCode").value,
		"officeCode"     : document.getElementById("officeCode").value,
		"eventSeq"       : target.dataset.seq
	};
	
	commonAjax.call("/prd/deleteEventGroup", "POST", params, function(data) {
		if (data.message == "OK") {
			alert('삭제되었습니다.');
			popupClose();

			getEventGroupList();
		    getEventGroupSubList(div.children[div.children.length - 2]);	
		} else {
			alert(data.message);
		}
	});	
}

//이벤트 중그룹 노출 변경
function updateEventGroupDisplay(target) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"eventSeq"     : target.closest('li').dataset.seq,
		"displayYn"	   : target.value == 'Y' ? 'N' : 'Y'
	};
	
	commonAjax.call("/prd/updateEventGroupDisplay", "POST", params, function(data) {
		if (data.message == "OK") {
			getEventGroupList();
		} else {
			alert(data.message);
		}
	});	
}

//이벤트 소그룹 리스트 조회
function getEventGroupSubList(target) {
	const li = document.querySelectorAll('.prd-area li');
	li.forEach((ele) => ele.classList.remove('active'));
	
	if (!isNullStr(target)) {
		target.classList.add('active');

		const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"eventSeq"     : target.dataset.seq
		};
			
		commonAjax.call("/prd/getEventGroupSubList", "POST", params, function(data){
			if (data.message == "OK") {
				const result = data.resultList;
				const div = document.querySelector('.left');
				
				div.innerHTML = "";
				
				if (result.length > 0) {
					for (let i = 0; i < result.length; i++) {		
						drawEventSubArea(); 	//이벤트 소그룹 입력폼 그리기
						
						document.querySelectorAll('.step1 .btn-area')[i].style.display = 'flex';
						
						document.querySelectorAll('.section')[i].dataset.sub       = result[i].eventSubSeq;
						document.querySelectorAll('button.event-display')[i].value = result[i].displayYn;
						document.querySelectorAll('.eventWord')[i].value           = result[i].eventWord;
						document.querySelectorAll('.eventTitle')[i].value          = result[i].eventTitle;
						document.querySelectorAll('.eventContent')[i].value        = result[i].eventContent;
						
						setDisplayStatus(document.querySelectorAll('button.event-display')[i]);
						
						drawEventSubMediaArea();				//이벤트 소그룹 미디어 영역 그리기					
						drawProductList(result[i].productList); //이벤트 시술 그리기
						
						document.querySelectorAll('.eventVideo')[i].value = result[i].eventVideo;
						document.querySelectorAll('.eventImage')[i].value = result[i].eventImage;	
						
						if (!isNullStr(result[i].eventImage)) {
							const img = document.querySelectorAll('.img')[i];
					
							img.querySelector('i').style.display = 'none';
							img.querySelector('img').src = result[i].eventImage;
							img.querySelector('img').style.display = 'block';
							img.parentElement.querySelector('.img-del').classList.add('show');
						}
						
						if (!isNullStr(result[i].eventType)) {
							const parent = document.querySelectorAll('.step2')[i];							
							parent.querySelectorAll('.tab-con li').forEach((ele) => ele.classList.remove('active'));							
							parent.querySelector(`.chk[value="${result[i].eventType}"]`).checked = true;
							parent.querySelector(`.tab-con li.${result[i].eventType}`).classList.add('active');	
							
							const btn = document.querySelectorAll('.step2 button.save-detail')[i];
							const checkItem = document.querySelectorAll('input.checkItem')[i];
							
							if (result[i].eventType == 'video') {
								btn.innerText = '영상 저장하기';
								checkItem.value = 1;
							} else if (result[i].eventType == 'img'){
								btn.innerText = '이미지 저장하기'
								checkItem.value = 0;
							}
						}
					}	
					
					drawEventSubArea(); //마지막 하단에 추가
				} else {
					drawEventSubArea(); //이벤트 소그룹이 없을때
				}
			} else {
				alert(data.message);
			}
		});	
	}
}

//노출, 미노출 상태 반영
function setDisplayStatus(target) {
	if (target.value == 'Y') {
		target.innerText = '노출';	
		target.classList.add('no-show');
		target.classList.remove('show');
	} else {
		target.innerText = '노출';
		target.classList.remove('no-show');
		target.classList.add('show');
	}
}

//이벤트 소그룹 입력폼 그리기
function drawEventSubArea() {
	const section = document.createElement("div");
	section.classList.add('section');
	document.querySelector('.left').appendChild(section);
	
	const content = document.createElement("form");
	content.id  = "frm1";
	content.innerHTML = 
		`<div class="step step1">
        	<div class="btn-area" style="display:none;">
	            <button type="button" class="event-display no-show" id="displayYn" onclick="updateEventGroupSubDisplay(this)">노출</button>	            
				<button type="button" class="del" onclick="showDeleteEventGroupPopup(this, 'S')">삭제</button>
	        </div>
        	<input type="text" class="eventWord" placeholder="강조 문구를 입력해 주세요." required>
            <input type="text" placeholder="소그룹 제목을 입력해 주세요." class="eventTitle" required>
            <input type="text" placeholder="소그룹 설명을 입력해 주세요." class="eventContent" required>

            <button type="button" class="save-detail border-btn" onclick="insertEventGroupSub(this)">소그룹 저장하기</button>
        </div>`;
	
	document.querySelector('.section:last-child').appendChild(content);
}

//이벤트 소그룹 미디어 영역 그리기(영상, 이미지)
function drawEventSubMediaArea() {
	const content = document.createElement("form");
	content.id    = "frm2";
	content.innerHTML = 
		`<div class="step step2" style="display:flex">
             <div class="type">
                 <div class="con"> 
                 	 <input type="hidden" class="checkItem">
                 	 
                     <input class="chk" data-state='1' value="video" type="radio" name="check"/>
                     <label onclick="checkMediaType(this , '1')" id="video"></label>
                     <label class="check">영상</label>

                     <input class="chk" data-state='0' type="radio" name="check" value="img"/>
                     <label onclick="checkMediaType(this , '0')" id="img"></label>
                     <label class="check">이미지</label>
                 </div>
	                 
                 <ul class="tab-con">
                 	<li class="video active">
                 		<input type="text" placeholder="영상 링크를 입력해 주세요." class="eventVideo">		                 	
                 	</li>
                 	
                 	<li class="img">
                        <div class="file-upload">
                        <input type="file" class="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" data-object/> 
                            <input type="hidden" class="eventImage" data-object/>
                            <i class="icon"></i>

                            <img src="" alt="이미지" style="display:none;" data-object>
                            
            				<div class="resolution">이미지해상도 (1400 x 800)</div>			
                        </div>

                        <div class="img-del">
                            <button type="button" class="img-del-btn" onclick="delImage(this)">이미지 삭제</button>
                        </div>
                 	</li>
                 </ul>
             </div>
	
             <button type="button" class="save-detail border-btn" onclick="updateEventGroupSub(this)">저장하기</button>
     	</div>`;
	
	document.querySelector('.section:last-child').appendChild(content);
}

//상세 이미지 삭제
function delImage(target) {
    const delBtn = target.parentElement;
    const parent = target.closest('.img');    
    const img    = parent.querySelector('img');
    const input  = parent.querySelector('input[type="hidden"]');
    const file   = parent.querySelector('input[type="file"]');
    const icon   = parent.querySelector('i');

	img.src = "";
    img.style.display = 'none';	
	input.value = ""; 
    file.style.display = 'block';
    icon.style.display = 'block';
    delBtn.classList.remove('show');
}

//영상, 이미지 타입 체크(type - 0:이미지, 1:영상)
function checkMediaType(target, type) {
	const parent = target.closest('.type');
    const tab = parent.querySelectorAll('.step2 .con input');
    const con = parent.querySelectorAll('.step2 li');
    const btn = parent.parentElement.querySelector('.step2 button.save-detail');
    const checkItem = parent.parentElement.querySelector('input.checkItem');
    
	con.forEach((ele) => ele.classList.remove('active'));

	parent.querySelector(`.step2 li.${target.id}`).classList.add('active');
	
	//체크박스 체크 해제(빈 값으로 저장할 때)
    if (checkItem.value == type) {
    	parent.querySelector(`.chk[data-state="${type}"]`).checked = false;
    	checkItem.value = null;
	    btn.innerText = '저장하기';
    } else {
    	parent.querySelector(`.chk[data-state="${type}"]`).checked = true;
    	checkItem.value = type;    	
    	btn.innerText = type == '1' ? '영상 저장하기' : '이미지 저장하기';    	
    }
}

//이벤트 소그룹 저장
function insertEventGroupSub(target) {
	const parent = target.closest('.section');
	const li	 = document.querySelector("ul.prd li.active");	
	
	if (isNullStr(li)) {
		alert('이벤트 그룹을 추가 또는 선택해 주세요.');
		return
	}
	
	if (isNullStr(document.querySelector('.eventTitle').value)) {
		alert('소그룹 제목을 입력해 주세요.');
		return
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"eventSeq"     : li.dataset.seq,
		"eventSubSeq"  : parent.dataset.sub,
		"eventWord"    : parent.querySelector(".eventWord").value, 
		"eventTitle"   : parent.querySelector(".eventTitle").value, 
		"eventContent" : parent.querySelector(".eventContent").value
	};
	
	commonAjax.call("/prd/insertEventGroupSub", "POST", params, function(data){
		if (data.message == "OK") {
			alert('저장되었습니다.');
			
			getEventGroupSubList(li);
		} else {
			alert(data.message);
		}
	});	
}

//이벤트 소그룹 미디어 영역 저장
function updateEventGroupSub(target) {
	const parent  = target.closest('.section');
	const li      = document.querySelector("ul.prd li.active");
	let eventType = '';
	
	if (!isNullStr(parent.querySelector(".chk:checked"))) {
		eventType = parent.querySelector(".chk:checked").value;
	} 
	
	const params = {
		"hospitalCode"   : document.getElementById("hospitalCode").value,
		"officeCode"     : document.getElementById("officeCode").value,
		"eventSeq"       : li.dataset.seq,
		"eventSubSeq"    : parent.dataset.sub,			
		"eventType"      : eventType,
		"eventImage"     : parent.querySelector(".eventImage").value,
		"eventVideo"     : parent.querySelector(".eventVideo").value			
	};
	
	if (eventType == 'img') {
		if (isNullStr(params.eventImage)) {
			alert('이미지를 추가해 주세요.');
			return 
		}
	} else {
		if (isNullStr(params.eventVideo)) {
			alert('영상 링크를 입력해 주세요.');
			return 
		}
	}

	commonAjax.call("/prd/updateEventGroupSub", "POST", params, function(data){
		if (data.message == "OK") {
			alert('저장되었습니다.');
			
			getEventGroupSubList(li);
		} else {
			alert(data.message);
		}
	});	
}

//이벤트 소그룹 노출 변경
function updateEventGroupSubDisplay(target) {
	const parent = target.parentElement.parentElement.parentElement.parentElement;
	const li 	 = document.querySelector("ul.prd li.active");
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"eventSeq"     : li.dataset.seq,
		"eventSubSeq"  : parent.dataset.sub,
		"displayYn"	   : target.value == 'Y' ? 'N' : 'Y'
	};	
	
	commonAjax.call("/prd/updateEventGroupSubDisplay", "POST", params, function(data){
		if (data.message == "OK") {			
			getEventGroupSubList(li);
		} else {
			alert(data.message);
		} 
	});	
}

//이벤트 소그룹 삭제
function deleteEventGroupSub(target) {	
	const li     = document.querySelector("ul.prd li.active");	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"eventSeq"     : target.dataset.seq,
		"eventSubSeq"  : target.dataset.sub
	};
	
	commonAjax.call("/prd/deleteEventGroupSub", "POST", params, function(data){
		if (data.message == "OK") {
			alert('삭제되었습니다.');
			popupClose();
			
			getEventGroupSubList(li);
		} else {
			alert(data.message);
		}
	});
}

//이벤트 시술 그리기
function drawProductList(result) {
	const content = document.createElement('ul');
	let type;
	content.classList.add('step3');
	document.querySelector('.section:last-child').appendChild(content);

	for (let i = 0; i < result.length; i++) {		
		switch (result[i].eventProductType) {
			case 'E': type = '1회 체험';
					  break;
			case 'P': type = '패키지';
		 			  break;
			case 'C': type = '포인트';
			 		  break;
		}
		
		content.innerHTML += 
			`<li data-type="${result[i].eventProductType}" data-code="${result[i].eventProductCode}">
	        	<div class="btn-area">
	        		<div class="type-area">
		        		<span class="prd">${result[i].prdMstName}</span>
		        		<span class="type">${type}</span>
	        		</div>
	        		
		            <button type="button" class="${result[i].displayYn == 'Y' ? 'no-show' : 'show'} display" 
		            	onclick="updateEventProductSurgicalDisplay(this)" value="${result[i].displayYn}">노출</button>
		            <button type="button" class="del" onclick="deleteEventProductSurgical(this)">삭제</button>
		        </div>
	     		
	     		<div class="txt-area" style="${result[i].displayYn == 'N' ? 'opacity:0.5' : 'opacity : 1'}">
	     			<div class="con">
		     			<div class="txt">	     				
		     				${!isNullStr(result[i].eventProductWord) ? '<span class="event-word"></span>' : ''}
		     				<p class="event-tit">[EVENT] ${result[i].eventProductTitle}</p>
		     			</div>
		     			
		                <div class="price">
		                	<span class="origin num">${result[i].eventPrice}</span>
		                    <span class="sale num">${result[i].eventSale}</span>
		            	</div>
		     		</div>
		     		
		     		<div class="btm-btn">
			            <button type="button" class="event-detail" onclick="location.href='/prd/prd001Edit?code=${result[i].prdCode}&sub=${result[i].prdSubCode}'">시술 자세히</button>
			            <button type="button" class="event-edit" onclick="drawEventProductPopup(this, 'edit')">시술 수정</button>
		     		</div>
	     		</div>
	     	</li>`;
				
		const div = document.querySelector(`.step3 li:last-child .txt`);
		
		if (!isNullStr(result[i].eventProductWord)) {
			const span = div.querySelector('.event-word');
			const arr  = result[i].eventProductWord.split(",");
			
			for (let j = 0; j <arr.length; j++) {
				span.innerHTML += `<i>${arr[j]}</i>`;
			}
		}		
		
		if (!isNullStr(result[i].eventProductContent)) {
			div.innerHTML += `<span class="event-desc">${result[i].eventProductContent}</span>`;
		}
		
		if (!isNullStr(result[i].prdItemName)) {
			const arr = result[i].prdItemName.split("\n");
			
			for (let j = 0; j < arr.length; j++) {
				div.innerHTML += `<span class="event-desc">${arr[j].replace(/,/gi, ", ")}</span>`;	
			}
		}
	}
	
	content.innerHTML += `<button type="button" class="add-prd-list dark-btn" onclick="drawEventProductPopup(this)">이벤트 시술 추가</button>`
}

//이벤트 시술 노출 변경
function updateEventProductSurgicalDisplay(target) {
	const parent = target.closest('li');
	const li 	 = document.querySelector("ul.prd li.active");
	const params = {
		"hospitalCode"     : document.getElementById("hospitalCode").value,
		"officeCode"       : document.getElementById("officeCode").value,
		"eventSeq"         : li.dataset.seq,
		"eventSubSeq"      : parent.closest('.section').dataset.sub,
		"eventProductCode" : parent.dataset.code,
		"displayYn"		   : target.value == 'Y' ? 'N' : 'Y' 
	};

	commonAjax.call("/prd/updateEventProductSurgicalDisplay", "POST", params, function(data){
		if (data.message == "OK") {
			getEventGroupSubList(li);
		} else {
			alert(data.message);
		}
	});	
}

//이벤트 시술 삭제
function deleteEventProductSurgical(target) {
	if (confirm("시술을 삭제하시겠습니까?")) {
		const parent = target.closest('li');
		const li 	 = document.querySelector("ul.prd li.active");	
		const params = {
			"hospitalCode"     : document.getElementById("hospitalCode").value,
			"officeCode"       : document.getElementById("officeCode").value,
			"eventSeq"         : li.dataset.seq,
			"eventSubSeq"      : parent.closest('.section').dataset.sub,
			"eventProductCode" : parent.dataset.code         
		};
		
		commonAjax.call("/prd/deleteEventProductSurgical", "POST", params, function(data){
			if (data.message == "OK") {
				alert('삭제되었습니다.');
				
				getEventGroupSubList(li);
			} else {
				alert(data.message);
			}
		});		
	}
}

//이벤트 시술 조회
function drawEventProductPopup(target, type) {
	const parent   = target.closest('.section');		
	const eventPrd = document.querySelector('ul.prd li.active span').innerText;
	const eventTit = parent.querySelector('.eventTitle').value;

	document.getElementById('eventGroupName').value = `[${eventPrd}] ${eventTit}`;
	
	const params = {
		"type" 			   : type,
		"eventSeq" 		   : document.querySelector('ul.prd li.active').dataset.seq,
		"eventSubSeq" 	   : parent.dataset.sub
	};
	
	if (type == 'edit') {
		params.eventProductCode = target.closest('li').dataset.code;
	}
	
	if (commonDoubleClick()) {
	    commonDrawPopup("load", "/prd/prd002Popup", params);	
	}
}

//순서 변경 팝업
function popListOrder() {
	const content = 
        `<div class="popup-tit">
        	<div class="text">
            	<p>이벤트 그룹/ 이벤트 시술 정렬</p>
            	<span>자유롭게 드래그 앤드 드롭으로 정렬할 수 있습니다.</span>
        	</div>
         </div>
         
         <div class="popup-con list" style="width:1220px">
        	<div class="list-left">
        		<div class="list-tit">
        			<p>이벤트 그룹 정렬</p>
    			</div>
    			
        		<div class="list-con">
        			<ul id="eventSortGroup" class="scroll list-style"></ul>
        		</div>
        	</div>
        	
        	<div class="list-center">
        		<div class="list-tit">
        			<p>이벤트 소그룹 선택/정렬</p>
        		</div>
        		
        		<div class="list-con">
        			<ul id="eventSortSub" class="scroll list-style"></ul>
        		</div>
        	</div>
        	
        	<div class="list-right">
        		<div class="list-tit">
        			<p>이벤트 시술 정렬</p>
        			
        			<div class="btn-area">
        				<button type="button" onclick="sortList(this, 'name')">이름순</button>
        				<button type="button" onclick="sortList(this, 'price')">가격순</button>
        			</div>
        		</div>
        		
        		<div class="list-con">
        			<ul id="eventSortNormal" class="scroll list-style"></ul>
        		</div>
        	</div>
		</div>

        <div class="popup-btn">
            <button type="button" class="save-btn blue-btn" onclick="updateEventSortOrder()">저장하기</button>
        </div>`;
	
    commonDrawPopup("draw", content);
	document.querySelector('.popup-inner').classList.remove('np');
    
    //이벤트 그룹
    const eventGroup = document.querySelectorAll('ul.prd li');
    
    for (let i = 0; i < eventGroup.length; i++) {
    	document.getElementById('eventSortGroup').innerHTML += 
			`<li data-seq="${eventGroup[i].dataset.seq}" onclick="getEventSubList('${eventGroup[i].dataset.seq}')">
				<p>${eventGroup[i].querySelector('span').innerText}</p>
			</li>`;
    }
    
    getEventSubList(document.querySelector('ul.prd li.active').dataset.seq);
    
	commonSetDragDrop('#eventSortGroup', "", '');    //이벤트 그룹 순서변경
	commonSetDragDrop('#eventSortSub', "", '');      //이벤트 소그룹 순서변경
	commonSetDragDrop('#eventSortNormal', "", '');   //이벤트 일반 시술 순서변경
}

//순서 정렬 팝업 - 이벤트 소분류 조회
function getEventSubList(eventSeq) {
	const eventGroup = document.querySelectorAll('#eventSortGroup li');	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"eventSeq"     : eventSeq
	};
	
	eventGroup.forEach(function(ele){
		ele.classList.remove('active');
		
		if (ele.dataset.seq == eventSeq) {
			ele.classList.add('active');	
		}
	});
		
	commonAjax.call("/prd/getEventGroupSubList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			const eventSub = document.getElementById('eventSortSub');
					
			if (result.length > 0) {
				eventSub.innerHTML = '';
				
				for (let i = 0; i < result.length ; i++) {
					eventSub.innerHTML += 
						`<li 
							data-seq="${result[i].eventSubSeq}" 
							data-sub="${eventSeq}"
							onclick="getEventProductList('${result[i].eventSubSeq}')">
							<p>${result[i].eventTitle}</p>
						</li>`;	
				}

				eventSub.querySelectorAll('li')[0].click();
			} else {
				eventSub.innerHTML = '<div id="noSearch"><span>이벤트 소그룹이 없습니다.</span></div>';				
				document.getElementById('eventSortNormal').innerHTML = '<div id="noSearch"><span>이벤트 시술이 없습니다.</span></div>';
			}
		}
	});	
}

//순서 정렬 팝업 - 이벤트 시술 조회
function getEventProductList(eventSubSeq) {
	const eventGroup = document.querySelectorAll('#eventSortSub li');	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"eventSeq"     : document.querySelector('#eventSortGroup li.active').dataset.seq,
		"eventSubSeq"  : eventSubSeq
	};
	
	eventGroup.forEach(function(ele){
		ele.classList.remove('active');
		
		if (ele.dataset.seq == eventSubSeq) {
			ele.classList.add('active');	
		}
	});
	
	commonAjax.call("/prd/getEventProductList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			const eventNormal = document.getElementById('eventSortNormal');
			
			if (result.length > 0) {				
				eventNormal.innerHTML = '';
				
				for (let i = 0; i < result.length ; i++) {
					eventNormal.innerHTML += 
						`<li 
							data-seq="${result[i].eventSeq}" 
							data-sub="${result[i].eventSubSeq}" 
							data-code="${result[i].eventProductCode}">
							<p>${result[i].eventProductTitle}</p>
							<span>${result[i].eventSale}원</span>
						</li>`;	
				}
			} else {
				eventNormal.innerHTML = '<div id="noSearch"><span>이벤트 시술이 없습니다.</span></div>';
			}
		}
	});
}

//이름순 / 가격순 정렬
function sortList(target , sort) {
	const parent = target.closest('.list-tit').nextElementSibling.querySelector('ul');
	const li = parent.querySelectorAll('li');
	let arr = [];
	let x , y;
	
	parent.innerHTML = '';
	
	li.forEach((ele) => {
		var beforeArr = new Object(); 
		
		beforeArr.name = ele.querySelector('p').innerText;
		beforeArr.price = ele.querySelector('span').innerText;
		beforeArr.seq = ele.dataset.seq;
		beforeArr.sub = ele.dataset.sub;
		beforeArr.code = ele.dataset.code;
		
		arr.push(beforeArr);
	});
	
	arr.sort(function(a , b){
		if (sort == 'name') {
			x = a.name.toLowerCase();
			y = b.name.toLowerCase();
		} else {
			x = parseInt(a.price.replace(/[^0-9]/g,''));
			y = parseInt(b.price.replace(/[^0-9]/g,''));
		}
		
		if(x < y) return -1;
		
		if(x > y) return 1;
		
		return 0;
	});

    arr.forEach((item) => {
    	parent.innerHTML += 
			`<li data-seq="${item.seq}" data-sub="${item.sub}" data-code="${item.code}">
				<p>${item.name}</p>
				<span class="prd-price">${item.price}</span>
			</li>`;
	});
}

//순서정렬 저장
function updateEventSortOrder() {
	const eventLi = document.querySelectorAll('#eventSortGroup li');
	let eventList = [];
	
	eventLi.forEach((ele) => {
		let eventArr = new Object(); 
		
		eventArr.eventSeq = ele.dataset.seq;

		eventList.push(eventArr);
	});
	
	const eventSubLi = document.querySelectorAll('#eventSortSub li');
	let eventSubList = [];
	
	eventSubLi.forEach((ele) => {
		let eventSubArr = new Object(); 

		eventSubArr.eventSeq = ele.dataset.sub;
		eventSubArr.eventSubSeq = ele.dataset.seq;
		
		eventSubList.push(eventSubArr);
	});
	
	const eventProductLi = document.querySelectorAll('#eventSortNormal li');
	let eventProductList = [];
	
	eventProductLi.forEach((ele) => {
		let eventProductArr = new Object(); 

		eventProductArr.eventSeq = ele.dataset.seq;
		eventProductArr.eventSubSeq = ele.dataset.sub;
		eventProductArr.eventProductCode = ele.dataset.code;
		
		eventProductList.push(eventProductArr);
	});
	
	const params = {
		"hospitalCode"     : document.getElementById("hospitalCode").value,
		"officeCode"       : document.getElementById("officeCode").value,
		"eventList"        : JSON.stringify(eventList),
		"eventSubList"     : JSON.stringify(eventSubList),
		"eventProductList" : JSON.stringify(eventProductList)
	};

	commonAjax.call("/prd/updateEventSortOrder", "POST", params, function(data){
		if (data.message == "OK") {
			alert('저장되었습니다.');
			
			popupClose();
			getEventGroupList();
		}
	});
}


