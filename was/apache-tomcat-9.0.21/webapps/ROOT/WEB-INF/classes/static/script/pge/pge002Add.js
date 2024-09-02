var tabIdx = 0;

function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;
	
	const params = {
			"hospitalCode" : hospitalCode,
			"officeCode"   : officeCode
		};
	commonSetOfficeSite("#homePageUrl", params);
		
	drawPopupType();
		
	commonDatePicker(["startDate" , "endDate"] , '' , setPopEventRightContent);
	
	const seq = document.querySelector("[name=seq]").value;
	
	if (!isNullStr(seq)) {
		getPopupInfo(hospitalCode, officeCode, seq);			
	}			
}

function drawPopupType() {
	const comboObj = {"target" : "popType", "code" : "POP001", "defaultOpt" : "타입 선택"};			
	commonCodeList(comboObj);
}

//탭추가(우측, 하단 타입 사용)
function addTab(type) {
    const addValue = document.querySelector('.new-tab').value;
  
    if (addValue == "") {
    	alert('타이틀을 입력해 주세요.');
    } else {
    	const textNode = document.createTextNode(addValue);
    	const addInput = document.querySelector('.add-input');    	    
        const li = document.createElement("li");
	    	    
	    li.className = 'tab-show';
	    li.appendChild(textNode);
	    li.innerHTML += `<button class ="btn-del-tab" type="button" onclick="deleteTab(this, '${type}'); checkTabCnt('${type}');"></button>`;
	    
	    document.getElementById('tabs').insertBefore(li, addInput);
	    document.querySelector('.new-tab').value = '';
	    
	    checkTabCnt(type);
	    setEventTabClick();
	    addRequired();
    }
}

//탭 추가 버튼 갯수 체크(우측, 하단 타입 사용)
function checkTabCnt(type, edit) {
  const btn = document.querySelector('.btn-add-tab');
  const input = document.querySelector('.add-input');
  const li = document.querySelectorAll('.tab-show');

  	if (edit == 'Y') {// 팝업 수정 페이지 일때
  	   if (type == 'bottom') {
  		    if (li.length == 3) {
  		        btn.style.display = 'none';
  		        input.style.display = 'block';
  		    } else if (li.length <= 2) {
  		        btn.style.display = 'block';
  		        input.style.display = 'block';
  		    } 
  		} else {		
  		    if (li.length == 7) {
  		        btn.style.display = 'none';
  		        input.style.display = 'block';
  		    } else if (li.length <= 6) {
  		        btn.style.display = 'block';
  		        input.style.display = 'block';
  		    } 
  		}
  	} else {
  	   if (type == 'bottom') {
  		    if (li.length >= 3) {
  		        btn.style.display = 'none';
  		    } else if (li.length <= 2) {
  		        btn.style.display = 'block';
  		        input.style.display = 'block';
  		    } 
  		} else {		
  		    if (li.length >= 7) {
  		        btn.style.display = 'none';
  		    } else if (li.length <= 6) {
  		        btn.style.display = 'block';
  		        input.style.display = 'block';
  		    } 
  		}
  	}
}

function setEventTabClick() {
	const addInput = document.querySelector('.new-tab');
	const li = document.querySelectorAll('.tabs > li');
	const inputBox = document.querySelectorAll('.file-upload');
	const img = document.querySelectorAll('.img-input');
	const url = document.querySelectorAll('.tab-url');
	
	url[0].disabled = false;
	for (let i = 0; i < li.length; i++) {
		li[i].addEventListener('click', function() {			
			for (let j = 0; j < li.length; j++) {
				li[j].classList.remove('active');
				inputBox[j].style.display = 'none';
			}
			li[i].classList.add('active');
			inputBox[i].style.display = 'block';
		});	
	}
}

function deleteTab(ele, type) {
	 var tab = ele.parentElement;
	 const li = document.querySelectorAll('.tab-show');
	 const wrap = document.getElementById('fileWrap');
	 const input = document.querySelectorAll('.file-upload');
	 var i = -1;
	
	 while((tab = tab.previousSibling) != null ) {		 
		 i++;
	 }
	 ele.parentElement.click();
	 input[li.length].style.display = 'none';
	 ele.parentElement.remove();
	 
	 input[i].remove();
	  
	 if (type == "bottom"){
		 wrap.innerHTML += 
			 `<div class="file-upload" style="display:none;">
				 <input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*" >
			   	 <input type="hidden" id="tabInputImg" name="bottomImage" data-object/>
			   	 <i class="icon"></i>
			   	 <input type="text" class="tab-url" name="bottomUrl" placeholder="연결할 링크를 입력해 주세요.">
			   	 <img src="" alt="이미지" style="display: none;">
			   	 <div class="resolution">이미지해상도 (2000 x 1280)</div>
			 </div>`;
	 } else {
		 wrap.innerHTML += 
			 `<div class="file-upload" style="display:none;">
				 <input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*" >
			   	 <input type="hidden" id="tabInputImg" name="rightImage" data-object/>
			   	 <i class="icon"></i>
			   	 <input type="text" class="tab-url" name="rightUrl" placeholder="연결할 링크를 입력해 주세요.">
			   	 <img src="" alt="이미지" style="display: none;">
			   	 <div class="resolution">이미지해상도 (1400 x 1420)</div>
			 </div>`;
	 }
	  
	li[0].classList.add('active');
	document.querySelectorAll('.file-upload')[0].style.display ="block";
	setEventTabClick();
	addRequired();
}

function inputValueDelete(type) {
	const li = document.querySelectorAll('.tab-show');
	const dataInput = document.querySelectorAll('.file-upload');
	
	dataInput[li.length].innerHTML =  
		`<input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*" >
	   	 <input type="hidden" id="tabInputImg" name="${type}Image" data-object/>
	   	 <i class="icon"></i>
	   	 <input type="text" class="tab-url" name="${type}Url" placeholder="연결할 링크를 입력해 주세요.">
	   	 <img src="" alt="이미지" style="display: none;">
	   	 <div class="resolution">${type == 'bottom' ? "이미지해상도 (2000 x 1280)" : "이미지해상도 (1400 x 1420)"}</div>`;
	
	document.querySelector('.new-tab').value = '';
}

//필수값 추가
function addRequired() {	
	const tabLi = document.querySelectorAll('.tab-show');
	const input = document.querySelectorAll('#tabInputImg');
	
	input.forEach((ele) => ele.required = false);
	
	for (let i = 0; i < tabLi.length; i++){
		input[i].required = true;
	}
}

function colorPicker(pick) {
    var color = pick.value;
    pick.previousElementSibling.value = color;
}

//팝업 타입변경
function typeChange(value) {
	const con = document.querySelector('.basic-con.img');
	const conOrder = document.querySelector('.basic-con.order');
	
	if (value == "basic") {		
		con.style.display = "block";
		conOrder.innerHTML += `<div class="con">
					            <label for="" class="need">순서</label>
					            <input type="radio" id="radio1" name="popOrder" value="1" name="order" checked="checked">
					            <label for="radio1" class="radio-btn">1</label>
					            <input type="radio" id="radio2" name="popOrder" value="2" name="order">
					            <label for="radio2" class="radio-btn">2</label>
					            <input type="radio" id="radio3" name="popOrder" value="3" name="order">
					            <label for="radio3" class="radio-btn">3</label>
					            <input type="radio" id="radio4" name="popOrder" value="4" name="order">
					            <label for="radio4" class="radio-btn">4</label>
				        	</div>`
		
		document.getElementById('selectDiv').innerHTML = '';	
		document.querySelector('#basicImg').required = true;
	} else {
		for (let i =0; i < con.length; i++) {
			con[i].style.display = "none";
		}
		
		if (value == "bottom") {			
			commonGoPage("/pge/pge002AddBottom", "", "selectDiv");
		} else if (value == "top") {		
			commonGoPage("/pge/pge002AddTop", "", "selectDiv");
		} else if (value == "right") {
			commonGoPage("/pge/pge002AddRight", "", "selectDiv");
		} else if (value == "event") {						
			commonGoPage("/pge/pge002AddEvent", "", "selectDiv");			
		} else if (isNullStr(value)) {
			document.getElementById('selectDiv').innerHTML = '';
		}
	
		con.style.display = "none";
		document.querySelector('#basicImg').required = false;
		conOrder.innerHTML = "";
	}	
}

//이벤트 추가
function addEvent() {
	const liCnt = document.querySelectorAll(".new-event").length + 1;    
    const input = document.querySelector('.input-con');
    const newDiv = document.createElement("li"); 
    const addEvent = document.querySelector('.btn-add-event'); 
    
    newDiv.className ='new-event';
    newDiv.innerHTML += 
        `<div class="btns">
                <label class="best"><input type="radio" name="eventType${liCnt}" value="BEST" checked ="checked"><span>BEST</span></label>
                <label class="new"><input type="radio" name="eventType${liCnt}" value="NEW"><span>NEW</span></label>
                <label class="hot"><input type="radio" name="eventType${liCnt}" value="HOT"><span>HOT</span></label>
        </div>
        <div class="input-con">
	    	<textarea type="text" class= "event-tit" name="eventContent1" placeholder="이벤트 제목을 입력해 주세요." required></textarea>
	        <textarea class="event-desc" name="eventContent2"placeholder="이벤트 설명을 입력해 주세요." required></textarea>
	        <input class="event-price" name="eventPrice" type="text" placeholder="가격을 입력해 주세요." onkeyup="setNumValue(this)" required>
	        <input class="event-url" name ="eventUrl" type="text" placeholder="연결할 링크를 입력해 주세요." required>
        </div>        
        <div class="btn-del-event" onclick="removeEvent(this);"></div>`;

    document.getElementById('newEvent').insertBefore(newDiv, addEvent);
    
    checkEventCnt();   
}

//이벤트 제거
function removeEvent(target) {
	target.parentElement.remove();
	
	const count = document.querySelectorAll(".new-event");	
	
	for (let i = 0; i < count.length; i++) {
		const input = count[i].querySelectorAll('.btns input');
		
		input.forEach((ele) => ele.setAttribute('name' , `eventType${i + 1}`));
	}
	checkEventCnt();
}

//이벤트 갯수 체크
function checkEventCnt() {
    const btn = document.querySelector('.btn-add-event');
    const li = document.querySelectorAll('.new-event');

    if (li.length == 16) {
        btn.style.display = 'none';
    } else if (li.length <= 15) {
        btn.style.display = 'block';
    }
}

//이벤트, 우측 팝업 제목,게시일 자동 입력
function setPopEventRightContent() {
	const type = document.querySelector('[name="popType"]').value;
	const tit   = document.getElementById('popTitle').value;		
	const start = document.getElementById('startDate').value;
	const end   = document.getElementById('endDate').value;
	
	if (type == "event" || type == "right") {
		if (tit) {
			document.getElementById('preTit').textContent = tit;
		} else {
			document.getElementById('preTit').textContent = '제목을 입력해 주세요.';
		}
		if (start && end) {
			document.getElementById('preDate').textContent = start + ' ~ ' +  end;
		}
	}
}

//일반, 상단팝업 이미지 업로드 
function popupFileReader(ele) {
    const reader = new FileReader();
    const file = ele.files[0];

	const imageTypes = [
		'tiff', 'pjp'  , 'jfif', 'bmp' , 'gif',
		'png'  , 'xbm' , 'dib' , 'jxl', 'avif',
		'jpeg', 'svgz' , 'jpg' , 'webp', 'ico',
		'tif' , 'pjpeg' 
	];    	    
	const image = file.name.split('.').pop().toLowerCase();    	

	//이미지 확장자 체크
	if (imageTypes.indexOf(image) === -1) {
		alert("파일 확장자를 확인해 주세요.");
		return;
	}
	
	//이미지 용량 1MB 제한
	if (file.size > 1024 * 1024) {
        alert("이미지 용량이 너무 큽니다.");
        return;
    }    	    	
	
	reader.onload = function() {
		ele.nextElementSibling.value = reader.result;
		ele.parentNode.querySelector('img').style.display = 'block';
		ele.parentNode.querySelector('img').style.margin = '75px 0 13px 12px';
		ele.parentNode.querySelector('img').src = reader.result;
	}
    reader.readAsDataURL(file);
}

function getPopupInfo(hospitalCode, officeCode, seq) {
	const params = {
		"hospitalCode" : hospitalCode,
		"officeCode"   : officeCode,
		"seq"		   : seq
	};

	commonAjax.call("/pge/getPopupInfo", "POST", params, function(data) {
		const result = data.resultList;      
	   	
	   	if (data.message == "OK") {	   			   		
	   		commonSetOfficeSite("#homePageUrl", params);
	   		   			   			   	
	   		document.getElementById("popTitle").value = result[0].popTitle;
	   		document.getElementById("popType").value  = result[0].popType;
	   		document.querySelector('[name="displayYn"]').value = result[0].displayYn;
	   		document.getElementById("startDate").value = result[0].startDate;
	   		document.getElementById("endDate").value   = result[0].endDate;		   						   		
   			
	   		setPopupContent(result[0].popType, result);
	   	}
	});
}

//팝업 수정
function setPopupContent(popType, result) {
	document.querySelector('#basicImg').required = false;
	document.getElementById('popType').style.pointerEvents = "none";
	document.getElementById('popType').style.backgroundColor = "#f1f4f8";
	
	if (popType == "event") {		
		$("#selectDiv").load("/menu/pge/pge002AddEvent", "", function() {
			document.getElementById('preTit').textContent  = result[0].popTitle;
			document.getElementById('preDate').textContent = result[0].startDate + ' ~ ' +  result[0].endDate;
		
			for (let i = 0; i < result.length - 4; i++) {
   				addEvent();
   			}

			let liCnt = 1;
   			for (let i = 0; i < result.length; i++) {
   				
   				document.querySelectorAll(`input[name="eventType${liCnt}"]`).forEach(function(e) {
	   				if (e.value == result[i].eventType) {
	   					e.checked = true;
	   				}
	   			});
   				
	   			document.querySelectorAll('textarea[name="eventContent1"]')[i].value = result[i].eventContent1;		   					   					   		
	   			document.querySelectorAll('textarea[name="eventContent2"]')[i].value = result[i].eventContent2;		   					   					   		
	   			document.querySelectorAll('input[name="eventPrice"]')[i].value = result[i].eventPrice;		   					   					   		
	   			document.querySelectorAll('input[name="eventUrl"]')[i].value   = result[i].eventUrl;
	   			
	   			liCnt++;
   			}
		});		
	} else if (popType == "bottom") {		
		$("#selectDiv").load("/menu/pge/pge002AddBottom", "", function() {
			
   			for (let i = 0; i < result.length; i++) {   		
   			    const addValue = document.querySelector('.new-tab').value;
   			    const textNode = document.createTextNode(addValue);
   			    const addInput = document.querySelector('.add-input');
   				const li = document.createElement("li");
   				
   				li.className = 'tab-show';
   			    li.appendChild(textNode);
   			    
   			    document.getElementById('tabs').insertBefore(li,addInput);	   			
	   			document.querySelectorAll('.tab-show')[i].innerHTML = result[i].bottomTabname + `<button class ="btn-del-tab" type="button" onclick="deleteTab(this); checkTabCnt('bottom', 'Y');"></button>`;
	   			document.querySelectorAll('i')[i].style.display = 'none';
	   			document.querySelectorAll('.file-upload')[i].querySelector('img').src = result[i].bottomImage;
	   			document.querySelectorAll('.file-upload')[i].querySelector('img').style.display = 'block';
	   			document.querySelectorAll('input[name="bottomImage"]')[i].value = result[i].bottomImage;	   					   					   			   					   					   		
	   			document.querySelectorAll('input[name="bottomUrl"]')[i].value   = result[i].bottomUrl;	
	   			   			    
   			 	checkTabCnt('bottom');
   			 	addRequired();
   			}
   			
   			if (result.length == 4) {
   				document.querySelector('.add-input').style.display = 'none';
   			}
   			
            document.querySelectorAll('.tab-show')[0].classList.add('active');
   			setEventTabClick();
		});		
	} else if (popType == "right") {		
		$("#selectDiv").load("/menu/pge/pge002AddRight", "", function() {
			document.getElementById('preTit').textContent  = result[0].popTitle;
			document.getElementById('preDate').textContent = result[0].startDate + ' ~ ' +  result[0].endDate;
			
			for (let i = 0; i < result.length; i++) {
				const addValue = document.querySelector('.new-tab').value;
				const textNode = document.createTextNode(addValue);
				const addInput = document.querySelector('.add-input');		
				const li = document.createElement("li");
	   			
   			    li.className = 'tab-show';
   			    li.appendChild(textNode);
   			    
   			    document.getElementById('tabs').insertBefore(li,addInput);
	   			document.querySelectorAll('.tab-show')[i].innerHTML = result[i].rightTabname + `<button class ="btn-del-tab" type="button" onclick="deleteTab(this); checkTabCnt('right','Y');"></button>`;// 탭제목
	   			document.querySelectorAll('i')[i].style.display = 'none';
	   			document.querySelectorAll('.file-upload')[i].querySelector('img').src = result[i].rightImage;
	   			document.querySelectorAll('.file-upload')[i].querySelector('img').style.display = 'block';
	   			document.querySelectorAll('input[name="rightImage"]')[i].value = result[i].rightImage;	   					   					   			   					   					   		
	   			document.querySelectorAll('input[name="rightUrl"]')[i].value   = result[i].rightUrl;	   			
	   			   			    
   			 	checkTabCnt('right');
   			 	addRequired();
   			}
			
   			if (result.length == 8) {
   				document.querySelector('.add-input').style.display = 'none';
   			}
			
   			document.querySelectorAll('.tab-show')[0].classList.add('active');
   			setEventTabClick();
		});		
	} else if (popType == "top") {		
		$("#selectDiv").load("/menu/pge/pge002AddTop", "", function() {   			
   			document.getElementById("popupImgP").style.display = 'block';
   			document.getElementById("popupImgP").style.margin  = '75px 0px 13px 12px';
   			document.getElementById("popupImgP").src = result[0].topPcImage;
   			document.querySelector('input[name="topPcImage"]').value = result[0].topPcImage;		   					   					   		
   			document.querySelector('input[name="topPcColor"]').value = result[0].topPcColor;		   					   					   		
   			document.querySelector('input[name="topPcUrl"]').value   = result[0].topPcUrl;   			
   			document.getElementById("popupImgM").style.display = 'block';
   			document.getElementById("popupImgM").style.margin  = '75px 0px 13px 12px';
   			document.getElementById("popupImgM").src = result[0].topMobileImage;
   			document.querySelector('input[name="topMobileImage"]').value = result[0].topMobileImage;		   					   					   		
   			document.querySelector('input[name="topMobileColor"]').value = result[0].topMobileColor;		   					   					   		
   			document.querySelector('input[name="topMobileUrl"]').value   = result[0].topMobileUrl;
   			
   			if (result[0].topPcLinkYn == 'Y') {
   				document.getElementById('appLink1').click();
   			}
   			if (result[0].topMobileLinkYn == 'Y') {
   				document.getElementById('appLink2').click();
   			}
		});		
	} else {
	 	typeChange(popType);
	 		   					   
		document.querySelectorAll('input[name="popOrder"]').forEach(function(item){ 
		    if (item.value == result[0].popOrder) {
		        document.getElementById(item.id).checked = true;
		    }					
		});   			   			
		document.getElementById("popupImg").style.display = 'block';
		document.getElementById("popupImg").style.margin  = '75px 0px 13px 12px';
		document.getElementById("popupImg").src = result[0].popImage;
		document.querySelector('input[name="popImage"]').value = result[0].popImage;		   					   					   		
		document.querySelector('input[name="popUrl"]').value   = result[0].popUrl;
		
		if (result[0].linkYn == 'Y') {
			document.getElementById('appLink').click();
		}
	}
}

function checkSave() {
	const li     = document.querySelectorAll('.tabs > li');
	const img    = document.querySelectorAll('.file-upload > input[type="hidden"]');
	const n      = li.length - 1;
	const type = document.getElementById('popType').value;

	if (commonCheckRequired("#frm") == false) {
		if (type =="right" || type == "bottom") {
			for (let i=0; i < n ; i++) {// 이미지가 없는게 있을때				
				if (isNullStr(img[i].value)) {
				 li[i].click();
				 break;
				}
			}
		}
		return;
	}
	
	if (type =="right" || type == "bottom") {
		if (li.length == 1) {
			if (isNullStr(document.querySelector('.new-tab').value) || isNullStr(img[0].value)) {
				if (isNullStr(img[0].value)) {
					img[0].parentElement.style.border = '1px solid red';
				} 
				document.querySelector('.new-tab').focus();
				alert('1개의 이미지와 타이틀은 필수 입력입니다.');
				
				return;
			}
		}
		
		//input value 있을때 이미지 체크
		if (!isNullStr(document.querySelector('.new-tab').value)) {
			if (isNullStr(img[n].value)) {
				img[n].parentElement.style.border = '1px solid red';				
				alert('필수입력값을 입력해 주세요.');
				li[n].click();

				return;
			}
		}
	}	
	
	const content =  
       `<div class="popup-tit">
        	<div class="text">
	        	<p>화면 미리보기</p>
	        	<span>
		        	현재 페이지에서 변경한 내용으로 미리보기를 할 수 있습니다.<br/>
					미리보기가 필요 없으면 저장하기를 눌러주세요.
				</span>
			</div>
		</div>

		<div class="popup-btn">
			<button type="button" class="preview-btn dark-btn" onclick="popupPreview()">미리보기</button>
			<button type="button" class="save-btn blue-btn" onclick="checkData()">저장하기</button>
		</div>`;

	commonDrawPopup("draw", content);
}

//미리보기
function popupPreview() {
	const type = document.getElementById('popType').value;
	
	//타입에 따라 함수 실행
	if (type == 'event') {
		checkEvent();				
	} else if(type == 'bottom') {
		checkBottom();		
	} else if (type == 'right') {
		checkRight();
	}
		
	const params = commonArrayToJson($("#frm").serializeArray());
	
	commonAjax.call("/pge/insertHomePopupPreview", "POST", params, function(data){
		if (data.message == "OK") {
			if (!isNullStr(data.seq)) {
				document.querySelector('input[name="seq"').value = data.seq;	
			}					
			const page = document.querySelector("#homePageUrl").innerHTML;
			const seq  = document.querySelector('input[name="seq"').value;
			
			window.open(page + "/preview/popup/" + seq, "_blank");
		}
	});
	document.getElementById('hospitalCode').style.pointerEvents = "none";
	document.getElementById('hospitalCode').style.backgroundColor = "#f1f4f8";
	document.getElementById('officeCode').style.pointerEvents = "none";
	document.getElementById('officeCode').style.backgroundColor = "#f1f4f8";
	document.getElementById('popType').style.pointerEvents = "none";
	document.getElementById('popType').style.backgroundColor = "#f1f4f8";
}

//저장하기
function checkData() {
	const type = document.getElementById('popType').value;
	
	//타입에 따라 함수 실행
	if (type == 'event') {
		checkEvent();				
	} else if(type == 'bottom') {
		checkBottom();		
	} else if (type == 'right') {
		checkRight();
	}
	
	const csrf = document.createElement("input");
	csrf.type  = "hidden";
	csrf.name  = "_csrf";
	csrf.value = csrfToken;
	
	document.getElementById("frm").append(csrf);
	document.getElementById("frm").submit();
}

//이벤트 팝업 체크
function checkEvent() {
	const eventInput = document.querySelectorAll('.new-event');
	const eventTitle = document.querySelectorAll('.event-tit');
	const eventDesc = document.querySelectorAll('.event-desc');
	const eventPrice = document.querySelectorAll('.event-price');
	const eventUrl = document.querySelectorAll('.event-url');
	
	let eventList = new Array();
	
	for (let i = 0; i < eventInput.length; i++) {				
        let data = new Object();
    	let eventType = 'eventType' + (i + 1);    	    	
    	
    	data.eventType     = document.querySelectorAll('input[name="'+ eventType +'"]:checked')[0].value;
		data.eventContent1 = eventTitle[i].value;
		data.eventContent2 = eventDesc[i].value;
		data.eventPrice    = eventPrice[i].value;
		data.eventUrl      = eventUrl[i].value;
		
		eventList.push(data);
	}
	const input = document.createElement("input");
	input.type  = "hidden";
	input.name  = "eventList";
	input.value = JSON.stringify(eventList);		
	
	if (document.querySelector('input[name="eventList"]') != null) {
		document.querySelector('input[name="eventList"]').remove();
	}
	document.getElementById("frm").appendChild(input);
}

//하단 탭 팝업 체크
function checkBottom() {
	const bottomLi = document.querySelectorAll('.tab-show');
	const bottomImg = document.querySelectorAll('input[name="bottomImage"]');
	const bottomURL = document.querySelectorAll('input[name="bottomUrl"]');
	const con = document.querySelectorAll('.tabs li');
	let bottomList = new Array();
	
	for (let i = 0; i < con.length; i++) {
		//탭일때true input일때 false
		let status = true;
		
		if (i == con.length - 1) {
			if (isNullStr(con[i].querySelector('.new-tab').value)) {
				status = false;
			}	
		} 
		
		if (status) {
	        let data = new Object();

	        if (i == con.length - 1) {
				data.bottomTabname   = con[i].querySelector('.new-tab').value;	        	
	        } else {
				data.bottomTabname   = bottomLi[i].innerText;
	        }

			data.bottomImage     = bottomImg[i].value;
			data.bottomUrl       = bottomURL[i].value;
			
			bottomList.push(data);	
		}
	} 
	
	const input = document.createElement("input");
	input.type  = "hidden";
	input.name  = "bottomList";
	input.value = JSON.stringify(bottomList);		
	
	if (document.querySelector('input[name="bottomList"]') != null) {
		document.querySelector('input[name="bottomList"]').remove();
	}
	document.getElementById("frm").appendChild(input);
}

//우측 탭 팝업 체크
function checkRight() {
	const rightLi = document.querySelectorAll('.tab-show');
	const rightImg = document.querySelectorAll('input[name="rightImage"]');
	const rightURL = document.querySelectorAll('input[name="rightUrl"]');
	const con = document.querySelectorAll('.tabs li');
	let rightList = new Array();
	
	for (let i = 0; i < con.length; i++) {
		
		//탭일때true input일때 false
		let status = true;
		
		if (i == con.length - 1) {
			if (isNullStr(con[i].querySelector('.new-tab').value)) {
				status = false;
			}	
		} 
		
		if (status) {
	        let data = new Object();

	        if (i == con.length - 1) {
				data.rightTabname   = con[i].querySelector('.new-tab').value;	        	
	        } else {
				data.rightTabname   = rightLi[i].innerText;
	        }

			data.rightImage     = rightImg[i].value;
			data.rightUrl       = rightURL[i].value;
			
			rightList.push(data);
		}
	} 
	
	const input = document.createElement("input");
	input.type  = "hidden";
	input.name  = "rightList";
	input.value = JSON.stringify(rightList);
	
	if (document.querySelector('input[name="rightList"]') != null) {
		document.querySelector('input[name="rightList"]').remove();
	}
	document.getElementById("frm").appendChild(input);
}

function setNumValue(num) {
	num.value = commonMoneyFormat(num.value);
}

function getOfficeSite() {
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value
		};
	commonSetOfficeSite("#homePageUrl", params);
}

//뷰티올 다운로드 연결링크 checkbox
function checkAppLink(ele) {
	const input = ele.parentElement.parentElement.querySelector('.url-input');
	
	if (ele.checked) {
		ele.value = 'Y';
		input.disabled = true;
		input.value = '';
		input.placeholder = "자동으로 뷰티올 다운로드로 연결됩니다.";
	} else {
		ele.value = 'N'
		input.disabled = false;
		input.placeholder = "연결한 링크를 입력해 주세요.";
	}
}