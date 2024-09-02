function init(){
	//주의사항 탬플릿
	getCautionTemplateList();
	
	//주의사항 상세 템플릿
	getTemplateDetail();
	
	//주의사항 이력
	getUserReserveReply();
}

//주의사항 탬플릿 그리기 
function getCautionTemplateList(){
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	}
				
	commonAjax.call("/res/getTemplateList", "POST", params, function(data){			
		if (data.message == "OK") {
			const result = data.resultList;
			const div    = document.getElementById('cautionTemp');
			
			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					div.innerHTML += `<option value="${result[i].templateSeq}">${result[i].title}</option>`;
				}	
			}
		}
	});
}

//상세 주의사항 템플릿 그리기
function getTemplateDetail(){
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	}
				
	commonAjax.call("/res/getTemplateDetail", "POST", params, function(data){			
		if (data.message == "OK") {
			const result = data.resultList;
			const div    = document.getElementById('cautionDetail');
			
			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					div.innerHTML += `<option value="${result[i].prdSubCode}">${result[i].prdSubName}</option>`;
				}	
			}
		}
	});
}

//탬플릿 내용 불러오기
function getTemplateContent(target){
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"templateSeq"  : target.value
	}
				
	commonAjax.call("/res/getTemplateList", "POST", params, function(data){			
		if (data.message == "OK") {
			document.getElementById("replyContent").value = data.resultList[0].content;
		}
	});
}

//상세 주의사항 내용 불러오기
function getTemplateDetailContent(target){
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdSubCode"   : target.value,
		"userId"       : document.getElementById("userId").value
	}
				
	commonAjax.call("/res/getTemplateDetailContent", "POST", params, function(data){			
		if (data.message == "OK") {
			const result = data.resultList.product;
			const info   = data.resultList.basic;
			const option = document.getElementById("cautionDetail");
			let html = '';

			html += '안녕하세요.#{이름}님\n';
			html += info.officeName + '입니다.\n';
			html += option.options[target.selectedIndex].text + ' 주의사항입니다.\n\n';
			
			result.forEach((ele) => {
				html += '-' + ele.detailContent + '\n\n';
			});
			
			html += '대표번호: ' + info.officePhone + '\n';
			html += '카카오톡: ' + info.officeName  + '\n';
			html += '홈페이지: ' + info.officeSite  + '\n';
			
			document.getElementById("replyContent").value = html;
		}
	});
}

//문자 전송하기
function sendSms(){
	const replyContent = document.getElementById("replyContent");
	
	if (isNullStr(replyContent.value)) {
		alert('내용을 입력해 주세요.');
		replyContent.focus();
		replyContent.style.border = '1px solid red';
		return;
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"mobile"       : document.getElementById("userMobile").value,
		"userId"       : document.getElementById("userId").value,
		"name"         : document.getElementById("userName").value,
		"replyContent" : replyContent.value,
		"resNo"        : document.getElementById("resNo").value
	};

	commonAjax.call("/res/sendSms", "POST", params, function(data){			
		if (data.message == "OK") {
			alert("주의사항이 정상적으로 전송되었습니다.");
			getUserReserveReply();               //주의사항 전송 기록 확인
			replyContent.value = '';
			
			//회원 현황 페이지 일경우 예약 회원 재조회
			if (window.location.href.indexOf('res004') != -1 ) {
				getReserveUserList();
			}
		}
	});
}

//주의사항 전송 기록 확인
function getUserReserveReply(){
	const parent = document.querySelector('.left-con li.active');
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"userId"       : document.getElementById("userId").value 
	};
	
	commonAjax.call("/res/getUserReserveReply", "POST", params, function(data){			
		if (data.message == "OK") {
			const result  = data.resultList;
			const div     = document.querySelector('.caution-send-list');
			div.innerHTML = '';
				
			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					div.innerHTML += 
						`<div>
							<div class="send-user">${result[i].replyDate} - ${result[i].replyUser}</div>
							<div class="send-content">${result[i].replyContent}</div>
						</div>`;	
				}	
			} else {
				div.innerHTML = '<div id="noSearch">전송된 주의사항이 없습니다.</div>';
			}
		}
	});
	
	cautionMenu();  //주의사항 전송 기록 애니메이션
}

//주의사항 전송 기록 애니메이션
function cautionMenu() {
    var user    = document.querySelectorAll('.send-user');
    var content = document.querySelectorAll('.send-content');

    for (let i = 0; i < user.length; i++) {
    	user[i].addEventListener("click", function() {
            var inner = this.nextElementSibling;
            
            if (this.classList.contains('active')) {		  		
                this.classList.remove('active');
                inner.style.maxHeight = null;
            } else {
                for (let j = 0; j < user.length; j++) {
                	user[j].classList.remove('active');
                    content[j].style.maxHeight = null;
                }
                
                this.classList.add("active");
                inner.style.maxHeight = inner.scrollHeight + "px";	
            }
        });
    }
}

//예약 내용 확인
function checkReserveList(){
	const div    = document.querySelector('.caution-reserve-div');
	
	if (div.classList.contains('active')) {
		div.classList.remove('active');
		div.innerHTML = '';
		return;
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"resNo"        : document.getElementById("resNo").value 
	}
	
	commonAjax.call("/res/getReserveInfo", "POST", params, function(data){			
		if (data.message == "OK") {
			const result = data.resultList;
			let totalPrice = 0;
			
			if (result.length > 0) {
				div.classList.add('active');
				
				//시술권 정보
				result.forEach((item) => {
					div.innerHTML += item.itemName + '</br>';	
					totalPrice = Number(totalPrice) + Number(item.itemPrice);
				});
				
				div.innerHTML += '</br></br>'
				
				//고객메모
				if (result[0].resNote) {
					div.innerHTML += '[고객 요청사항]</br>';	
					div.innerHTML += `${result[0].resNote}</br>`;
				}
				
				//총 가격 및 갯수
				div.innerHTML += '---------------------</br>';
				div.innerHTML += `총 ${result.length}개의 시술 금액 : ${totalPrice.toLocaleString('ko-KR')}원`
				
			}
		}
	});
}

//주의사항 템플릿 관리 팝업
function goTemplate(){
	const content = 
		`<div class="popup-tit">
			<p>주의사항 템플릿 관리</p>
		</div>
		
		<div>	
			<div class="popup-con">
				<div class="tem-box">
			        <label class="need">현재 추가된 템플릿</label>
			        <div class="tem-wrap popup-tem"></div>
			    </div>
			
				<div class="inputs tem">
					<div class="wrap tem">
						<label class="need">템플릿 이름</label>
						<button type="button" onclick="deleteReplyTemplate()">템플릿 삭제</button>
			    	</div>
			        <input type="text" id="temTitle" placeholder="주의사항 템플릿 이름을 입력해 주세요.">
			        
			        <textarea id="temContent" class="scroll" placeholder="주의사항 템플릿 내용을 입력해 주세요."></textarea>
			
				</div>
			</div>
			<div class="sms-exp">내용에 <span>#&#123;이름&#125;</span>으로 입력할 경우<br>주의사항 전송 시에 자동으로 고객 이름으로 변경됩니다.</div>
		</div>
		
		<div class="popup-btn">
			<button class="save-btn blue-btn" onclick="insertReplyTemplate()">저장하기</button>
		</div>`;
		
    commonDrawPopup("draw", content);
    getTemplateList();
	
   	//append 닫기 이벤트로 변경 
    document.querySelector('.sub-pop').classList.add('caution-tem');
	document.querySelector('.sub-pop .popup-overlay').setAttribute('onclick', 'temPopupClose()');
	document.querySelector('.sub-pop .del-btn').setAttribute('onclick', 'temPopupClose()');
}

function temPopupClose(){
	const parent = document.querySelector('.sub-pop');		    	
    parent.classList.remove('active');
    parent.querySelector('#popupInner').setAttribute("class", "");
    parent.querySelector('#popupInner').innerHTML = "";

   	subPop = false;
   	isClick = true;
   	
   	//기존 서브팝업 닫기 이벤트로 변경 
	parent.querySelector('.popup-overlay').setAttribute('onclick', 'subPopupClose()');
	parent.querySelector('.del-btn').setAttribute('onclick', 'subPopupClose()');
	
	//주의사항 탬플릿 재조회
	getCautionTemplateList();
}

//탬플릿 초기화
function temInit(){
	document.getElementById("temTitle").value = '';
	document.getElementById("temContent").value = '';
	
	document.querySelector('.wrap.tem button').style.opacity = '0.5';
}

//탬플릿 추가
function insertReplyTemplate(){
	const parent = document.querySelector('.popup-tem > div.active');
	const temTitle = document.getElementById("temTitle");
	const smsTem = document.querySelectorAll('.sms-tem');
	let templateSeq;
	
	isNullStr(parent) ? templateSeq = null : templateSeq = parent.dataset.seq;

	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"title"        : temTitle.value,
		"content"      : document.getElementById("temContent").value,
		"templateSeq"  : templateSeq
	}
	
	if (isNullStr(temTitle.value)) {
		alert('제목을 입력해 주세요.');
		temTitle.focus();
		temTitle.style.border = '1px solid red';
		return;
	}
	
	if (smsTem.length >= 16) {
		alert('문자 템플릿은 최대 16개까지 만들 수 있습니다.');
		return;
	}
	
	commonAjax.call("/res/insertReplyTemplate", "POST", params, function(data){			
		if (data.message == "OK") {
			getTemplateList();
			
			document.querySelector('.sms-tem:last-child').classList.add('active');
			temInit();
		}
	});
}

//탬플릿 조회 
function getTemplateList(){
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	}
	
	commonAjax.call("/res/getTemplateList", "POST", params, function(data){			
		if (data.message == "OK") {
			const result = data.resultList;
			const div = document.querySelector('.popup-tem');
			div.innerHTML = '';
			
			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					div.innerHTML += 
						`<div class="sms-tem" data-seq="${result[i].templateSeq}">${result[i].title}</div>`
				}
			} 
			
			div.innerHTML += '<div class="sms-tem add-tem">+</div>';
			
			getTemplateContentTemp();  //탬플릿 내용조회
		}
	});
}

//탬플릿 내용조회
function getTemplateContentTemp(){
	const temList = document.querySelectorAll('.popup-tem > div');
	const delBtn = document.querySelector('.wrap.tem button');
	
	for (let i = 0; i < temList.length; i++) {
		temList[i].addEventListener('click',function(){
			temInit();
			
			temList.forEach((ele) => ele.classList.remove('active'));
			temList[i].classList.add('active');
			delBtn.style.opacity = '0.5';
			
			if (!isNullStr(temList[i].dataset.seq)) {
				const params = {
					"hospitalCode" : document.getElementById("hospitalCode").value,
					"officeCode"   : document.getElementById("officeCode").value,
					"templateSeq"  : temList[i].dataset.seq
				}
						
				commonAjax.call("/res/getTemplateList", "POST", params, function(data){			
					if (data.message == "OK") {
						const result = data.resultList[0];
						
						document.getElementById("temTitle").value = nvlStr(result.title);
						document.getElementById("temContent").value = nvlStr(result.content);
						
						delBtn.style.opacity = '1';
					}
				});	
			}
		});
	}		
}

//탬플릿 삭제
function deleteReplyTemplate(){
	if (isNullStr(document.querySelector('.sms-tem.active'))) {
		alert('삭제할 템플릿을 선택해 주세요.');
		return;
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"templateSeq"  : document.querySelector('.sms-tem.active').dataset.seq
	}
				
	commonAjax.call("/res/deleteReplyTemplate", "POST", params, function(data){			
		if (data.message == "OK") {
			temInit();
			getTemplateList();
		}
	});	
}