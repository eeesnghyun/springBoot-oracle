var logPage = 0;

function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;
		
	btnAddActive();
	commonDatePicker(["startDate" , "endDate"], '', setParams);
	
	const params = getParams();
	getUserOpinionList(params);
}

function getParams() {
	let params = "";
	const searchParams = commonGetQueryString();
	const regex = /[^0-9]/gi;
	
	if (isNullStr(searchParams)) {
		params = "index=1&start=" + document.getElementById('startDate').value.replace(regex,"") 
							   + "&end=" + document.getElementById('endDate').value.replace(regex,"");								
	} else {		
		document.getElementById("startDate").value = searchParams.get("start").replace(/(\d{4})(\d{2})(\d{2})/, '$1년 $2월 $3일');
		document.getElementById("endDate").value   = searchParams.get("end").replace(/(\d{4})(\d{2})(\d{2})/, '$1년 $2월 $3일');
		
		params = searchParams.toLocaleString();
	}		
	
	return params;
}

function setParams() {
	const regex = /[^0-9]/gi;
	const params = "index=1&start=" + document.getElementById('startDate').value.replace(regex,"")
								 + "&end=" + document.getElementById('endDate').value.replace(regex,"");	
	
	getUserOpinionList(params);
}

function getUserOpinionList(params) {
	params += "&hospitalCode=" + document.getElementById("hospitalCode").value
			+ "&officeCode=" + document.getElementById("officeCode").value;

	commonAjax.call("/mbr/getUserOpinionList", "GET", params , function(data) {
		commonSetOfficeSite(".page-url", {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value
		});
		
		if (data.message == "OK") {
			const result = data.resultList;
			const page   = data.pageList;
			const ul = document.getElementById("opinion");
			const pagewrap = document.querySelector('.page-wrap');
			
			ul.innerHTML = '';
			if (result.length > 0){
				for (let i = 0; i < result.length; i++) {
					const mobile = result[i].mobile.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
					
					if (result[i].dataType == "Q") {
						ul.innerHTML += 
						`<div class="voc-row" onclick="vocClick(this)">
							<div class="num">
						        <div>${result[i].pagenum}</div>
						    </div>
						    <div class="type-box">
						        <div>
						            <span class="type ${result[i].type == "불만" ? "bad" : ""}">${result[i].type}</span>
						            <span class="state ${result[i].status == "답변완료" ? "active" : ""}">${result[i].status}</span>
						        </div>
						    </div>
						    <div id="rseq" data-rseq="${result[i].registSeq}">
						        <div class="qna-box">
						            <div class="qna-con">
						                <div class="wrap">
						                    <span class="name cus"><span>${result[i].name}</span>(${result[i].gender}/${result[i].birthdate})</span>
						                    <span class="qna-phone">${mobile}</span>
						                    <div class="btn-area">
						                        <button type="button" class="btn-voc sms" onclick="answerBtnClick('sms', this)">문자발송</button>
						                        <button type="button" class="btn-voc tell" onclick="answerBtnClick('tell', this)">전화응대</button>
						                    </div>
						                    <span class="qna-date">등록일 : ${result[i].createDate}</span>
						                </div>
						                <div class="qna-text">${result[i].content}
						                <span class="member-yn" style="display:none">${result[i].memberYn}</span>
						                </div>
						            </div>
						        </div>
						   </div>
						</div>`;
					} else {
						const div = document.createElement("div");
						
						div.className = "qna-box  replay-con";
						div.innerHTML = 
							`<div class="qna-con">
				                <div class="wrap">
				                    <div class="ans-label">답변</div>
				                    <span class="name sys">${result[i].name}</span>
				                    <span class="ans-type">[${result[i].type == "sms" ? "문자응대" : "전화응대"}]</span>
				                    <span class="qna-date">답변일 : ${result[i].createDate}</span>
				                </div>
				                <div class="qna-text"> ${result[i].content}</div>
				             </div>`;
						document.querySelector(`[data-rseq="${result[i].registSeq}"]`).append(div);
					}
				}
				drawPage(page);
			} else {
				ul.innerHTML = '';
				ul.innerHTML = `<div class="no-data"><span>해당 데이터가 없습니다.</span></div>`;
				pagewrap.innerHTML = '';
				pagewrap.innerHTML = `<div class="page-num active"><a href="#">1</a></div>`;
			}
		} else {
			alert(data.message);
		}
	});
}

function drawPage(page) {
	const regex = /[^0-9]/gi;
	const pageWrap = document.querySelector('.page-wrap');
	
	document.querySelector('.btn-prev-page').style.opacity = '1';
	document.querySelector('.btn-next-page').style.opacity = '1';
	
	pageWrap.innerHTML = '';
		
	if (page.length > 0) {
		if (page.length < 10) {
			for (let i = 0; i < page.length; i++) {
				const className = page[i].isActive == true ? "page-num active" : "page-num";				
				const uri = className.includes("active") == true ? "#" : "/mbr/mbr003?index=" + page[i].index	
																		+ "&start=" + document.getElementById('startDate').value.replace(regex,"")
																		+ "&end="   + document.getElementById('endDate').value.replace(regex,"");
				
				pageWrap.innerHTML += `<div class="${className}"><a href="${uri}">${page[i].index}</a></div>`;
			}
		} else {
			for (let i = 0; i < 10; i++) {
				const className = page[i].isActive == true ? "page-num active" : "page-num";				
				const uri = className.includes("active") == true ? "#" : "/mbr/mbr003?index=" + page[i].index	
																		+ "&start=" + document.getElementById('startDate').value.replace(regex,"")
																		+ "&end="   + document.getElementById('endDate').value.replace(regex,"");
				
				pageWrap.innerHTML += `<div class="${className}"><a href="${uri}">${page[i].index}</a></div>`;
			}
		}
		
		const active = document.querySelector('.page-num.active');
		
		if (active.innerText == '1') {
			document.querySelector('.btn-prev-page').style.opacity = '0.5';
		}
		
		if (isNullStr(active.nextElementSibling)) {
			if (page.length <= 1) {
				document.querySelector('.btn-next-page').style.opacity = '0.5';	
			}
		}
	} else {
		const ul = document.getElementById("opinion");
		ul.innerHTML = '';
		ul.innerHTML = `<div class="no-data"><span>해당 데이터가 없습니다.</span></div>`;
						
		pageWrap.innerHTML = `<div class="page-num active"><a href="#">1</a></div>`;
		
		document.querySelector('.btn-prev-page').style.opacity = '0.5';
		document.querySelector('.btn-next-page').style.opacity = '0.5';
	}
}

function pageBtnClick(type) {
	const regex = /[^0-9]/gi;
	const wrap = document.querySelector('.page-wrap');
	const active = document.querySelector('.page-num.active');
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
	
	location.href = "/mbr/mbr003?index=" + index
					+ "&start=" + document.getElementById('startDate').value.replace(regex,"")
					+ "&end="   + document.getElementById('endDate').value.replace(regex,"");
}

function pageClick() {
	const pageNum = document.querySelectorAll('.page-num');
	
	if (pageNum){
	   pageNum[0].classList.add('active');
	   
	   for (let i=0; i < pageNum.length; i++) {
		   pageNum[i].addEventListener('click' , function(){
			   
	           for (let j=0; j < pageNum.length; j++) {
	        	   pageNum[j].classList.remove('active');
	           }
	           pageNum[i].classList.add('active');
	       });
	   }
	}
}

function btnAddActive() {
	 const btn = document.querySelectorAll('.voc-row, .voc-row .btn-area button');

	 for (let i=0; i < btn.length; i++ ) {
	       btn[i].addEventListener('click', function() {
		       for (let j=0; j < btn.length; j++) {
		           btn[j].classList.remove('active');
		       }
	           btn[i].classList.add('active');
	       });
	 }
}
//문자응대, 전화응대 button click
function answerBtnClick(type, ele) {
   event.stopPropagation();
   
   const rightBox = document.querySelector('.right-box');
   const btn = document.querySelectorAll('.voc-row .btn-area button');
   const row = document.querySelectorAll('.voc-row');
   const clickRow = ele.closest('.voc-row');
   const seq = clickRow.querySelector('#rseq').dataset.rseq;

   rightBox.style.display = "block";
   if (type == "sms") {       
       rightBox.innerHTML = 
       		`<div class="top-info">
	            <div>${clickRow.querySelector('.member-yn').innerText}</div>
	            <div>재진</div>
	            <div class="name">${clickRow.querySelector('.name.cus').innerText}</div>
	            <div class="qna-phone">${clickRow.querySelector('.qna-phone').innerText}</div>
	        </div>
	            
	        <div class="answer sms">    
       			<div class="box-tit">답변하기</div>
               <div class="box">
                   <div class="type">${clickRow.querySelector('.type').innerText}</div>
                   <div class="qna-date">${clickRow.querySelector('.qna-date').innerText}</div>
                   <div class="qna-text">${clickRow.querySelector('.qna-text').innerText}</div>
               </div>

               <div class="box">
                   <div class="wrap-hor">
                       <div class="ans-label">답변</div>
                       <span class="name sys">${document.querySelector('.user.hide').innerText}</span>
                       <span class="ans-type">[문자응대]</span>
                   </div>
                   <div class="qna-date reply">답변일 : 2022년 04월 29일 오후 01:30</div>
                   <textarea id="smsContent" placeholder="문자 내용을 입력해 주세요. 또는 문자 템플릿을 선택해 주세요."></textarea>
                   <button type="button" class="btn-send" onclick="sendSms('${seq}')">전송하기</button>
               </div>

               <div class="tem-box">
                   <span>문자 템플릿</span>
                   <button type="button" onclick="drawPopup();">템플릿 관리</button>
                   <div class="tem-wrap">
                   		
                   </div>
               </div>
           </div>`;
       getTemplateList();      
   } else {
       rightBox.innerHTML = 
    	   `<div class="top-info">
	            <div>${clickRow.querySelector('.member-yn').innerText}</div>
	            <div>재진</div>
	            <div class="name">${clickRow.querySelector('.name.cus').innerText}</div>
	            <div class="qna-phone">${clickRow.querySelector('.qna-phone').innerText}</div>
	        </div>
	            
	        <div class="answer sms">    
       			<div class="box-tit">답변하기</div>
               <div class="box">
                   <div class="type">${clickRow.querySelector('.type').innerText}</div>
                   <div class="qna-date">${clickRow.querySelector('.qna-date').innerText}</div>
                   <div class="qna-text">${clickRow.querySelector('.qna-text').innerText}</div>
               </div>
	
                <div class="box">
                    <div class="wrap-hor">
                        <div class="ans-label">답변</div>
                        <span class="name">${document.querySelector('.user.hide').innerText}</span>
                        <span class="ans-type">[전화응대]</span>
                    </div>
                    <div class="qna-date reply">답변일 : 2022년 04월 29일 오후 01:30</div>
                    <textarea id="tellContent" placeholder="전화 내용을 입력해 주세요."></textarea>
                    <button type="button" class="btn-save-memo" onclick="replyTel('${seq}');">저장하기</button>
                </div>
            </div>`;
   }
   replyTime();
}
function vocClick(ele) {
    const row = document.querySelectorAll('.voc-row');
    const rightBox = document.querySelector('.right-box');
    const history = document.querySelector('.history');
    const smsBox = document.querySelector('.answer.sms');
    const tellBox = document.querySelector('.answer.tell');
    const btn = document.querySelectorAll('.voc-row .btn-area button');
    const seq = ele.querySelector('#rseq').dataset.rseq;
    
    logPage = 0;

    for (let i=0; i < row.length; i++){
    	row[i].classList.remove('active');
    }
    ele.classList.add('active');
    for (let i=0; i < btn.length; i++) {
        btn[i].classList.remove('active');
    }
    rightBox.style.display = "block";
    rightBox.innerHTML = 
    	`<div class="top-info">
            <div>${ele.querySelector('.member-yn').innerText}</div>
            <div>재진</div>
            <div class="name">${ele.querySelector('.name.cus').innerText}</div>
            <div class="qna-phone">${ele.querySelector('.qna-phone').innerText}</div>
        </div>
            
        <div class="history">
        	<div class="box-tit">이전 내역보기</div>
        	<div class="box-wrap scroll">
        		<span class="no-history">이전 내역이 없습니다.</span>
        	</div>	
        </div>`;
   
    getOpinionHistory(seq);
    scrollEvent(seq);
}

function getOpinionHistory(seq, logPage) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"registSeq"    : seq, 
		"index"        : logPage
	};
    
	commonAjax.call("/mbr/getOpinionHistory", "POST", params , function(data) {
		const result = data.resultList;	
		
		if (data.message == "OK") {
			const ul = document.querySelector(".box-wrap");

			if (result.length > 0) {
				ul.innerHTML = '';
				for (let i = 0; i < result.length; i++) {
					
					ul.innerHTML += 
					`<div class="box">
						<div class="type ${result[i].type == "불만" ? "bad" : ""}">${result[i].type}</div>
						<div class="qna-date">등록일 : ${result[i].createDate}</div>
						<div class="qna-text">${result[i].content}</div>
					</div>`;
					
					if (result[i].replyType) {
						let sysName = result[i].sysName.split('|');
						let replyType = result[i].replyType.split('|');
						let replyDate = result[i].replyDate.split('|');
						let replyContent = result[i].replyContent.split('|');
						
						for (let i=0; i < sysName.length; i++){
							let div = document.createElement("div");
	
							div.className = "box reply";
							div.innerHTML = 
								`<div class="wrap-hor">
				                    <div class="ans-label">답변</div>
				                    <span class="name sys">${sysName[i]}</span>
				                    <span class="ans-type">[${replyType[i] == "sms" ? "문자응대" : "전화응대"}]</span>
				                </div>
				                <div class="qna-date">답변일 : ${replyDate[i]}</span>
				                <div class="qna-text"> ${replyContent[i]}</div>
					            `;
							ul.append(div);
						}
						
					}
					if (result.length > 1) {
						ul.lastChild.classList.add('last');
					}
				}
			} 
		} else {
			alert(data.message);
		}
	});	
	
	const arr = document.querySelectorAll('.last');
	if (arr.length > 0) {
		arr[arr.length - 1].classList.remove('last');
	}
	window.addEventListener('scroll', () => { 
		const rightBox = document.querySelector('.right-box')

		if (!isNullStr(rightBox)) {
		    if (window.scrollY > 200) {
		        rightBox.classList.add('fixed');	        
		    } else if (window.scrollY < 200) {
		    	rightBox.classList.remove('fixed');
		    }
		}
	});
}

function scrollEvent(seq) {
    const div = document.querySelector('.box-wrap');

    div.addEventListener('scroll', function() {
        if (div.scrollHeight - div.scrollTop == div.clientHeight) {
        	logPage +=10;
            getOpinionHistory(seq, logPage);
        }
    });
 }

//문자발송
function sendSms(seq) {
	let replyContent = document.getElementById("smsContent");
	const phone = document.querySelector('.right-box .qna-phone').innerText;
	
	if (isNullStr(replyContent.value)) {
		alert('내용을 입력해 주세요.');
		replyContent.focus();
		replyContent.style.border = '1px solid red';
		return;
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"name"		   : document.querySelector(`[data-rseq="${seq}"] .name.cus > span`).innerText,
		"registSeq"	   : seq,		
		"mobile"	   : phone.replace(/-/g, ""),		
		"replyContent" : replyContent.value
	};

	commonAjax.call("/mbr/sendSms", "POST", params , function(data) {	
		
		if (data.message == "OK") {
			alert("문자 전송이 완료되었습니다.");
			location.reload();
		} else {
			alert(data.message);
		}
	});	
}
//전화응대
function replyTel(seq) {
	let replyContent = document.getElementById("tellContent");
	
	if (isNullStr(replyContent.value)) {
		alert('내용을 입력해 주세요.');
		replyContent.focus();
		replyContent.style.border = '1px solid red';
		return;
	}

	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"registSeq"	   : seq,
		"replyContent" : replyContent.value
	};
	
	commonAjax.call("/mbr/replyTel", "POST", params , function(data) {	
		
		if (data.message == "OK") {
			alert('전화응대 메모가 저장되었습니다.');
			location.reload();
		} else {
			alert(data.message);
		}
	});	
}

function checkTemplateData() {
	const act = document.querySelector('.sms-tem.active');

	if (!act || document.querySelector('.sms-tem.add-tem.active')) {
		insertTemplate();
	} else {
		const seq = act.parentNode.getAttribute('id').replace('template','');
		updateTemplate(seq);
	}
}

//문자템플릿 저장
function insertTemplate() {
	const tit = document.getElementById('temTitle');
	const con = document.getElementById('temContent');
	const btns = document.querySelector('.tem-wrap').querySelectorAll('.sms-tem');
	
	if (isNullStr(tit.value)) {
		alert('제목을 입력해 주세요.');
		tit.focus();
		tit.style.border = '1px solid red';
		return;
	}
	
	if (isNullStr(con.value)) {
		alert('내용을 입력해 주세요.');
		con.focus();
		con.style.border = '1px solid red';
		return;
	}
	
	if (btns.length >= 16) {
		alert('문자 템플릿은 최대 16개까지 만들 수 있습니다.');
		return;
	}

	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"title"        : tit.value,
		"content"      : con.value,
		"createUser"   : document.querySelector('.user.hide').innerText
	};
	
	commonAjax.call("/mbr/insertReplyTemplate", "POST", params , function(data) {
		if (data.message == "OK") {
			alert('문자 템플릿이 저장되었습니다.');
			getTemplateList();
			getTemplateList('popup');
			
			if (btns.length >= 15) {
				document.querySelector('.sms-tem.add-tem').remove();
			}
		} else { 
			alert(data.message);
		}
	});		
}

function updateTemplate(seq) {
	const tit = document.getElementById('temTitle');
	const con = document.getElementById('temContent');
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"templateSeq"  : seq,
		"title"        : document.getElementById('temTitle').value,
		"content"      : document.getElementById('temContent').value,
		"createUser"   : document.querySelector('.user.hide').innerText
	};
	
	commonAjax.call("/mbr/insertReplyTemplate", "POST", params , function(data) {
		if (data.message == "OK") {
			alert('수정되었습니다.');
			getTemplateList();
			getTemplateList('popup');
		} else {
			alert(data.message);
		}
	});	
}

//문자템플릿 삭제
function deleteTemplate() {
	 const act = document.querySelector('.sms-tem.active');
	 
	 if (isNullStr(act)) {
		 alert('삭제할 템플릿을 선택해 주세요.');
		 return;
	 }
	const seq = act.parentNode.getAttribute('id').replace('template','');
    const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"templateSeq"  : seq
	};
	
	commonAjax.call("/mbr/deleteReplyTemplate", "POST", params , function(data) {	
		
		if (data.message == "OK") {
			alert('템플릿이 삭제되었습니다.');
			getTemplateList();
			getTemplateList('popup');
		} else {
			alert(data.message);
		}
	});	
}
 
 function getTemplateContent(type) {
    const act = document.querySelector('.sms-tem.active').parentNode.getAttribute('id');
    const seq = act.replace('template','');
    
    const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"templateSeq"  : seq
	};
	
	commonAjax.call("/mbr/getTemplateList", "POST", params , function(data) {
		const result = data.resultList;		
		
		if (data.message == "OK") {
			if (type == "popup") {
				const tit = document.getElementById('temTitle');
				const con = document.getElementById('temContent');
				
				tit.value = `${result[0].title}`;
				con.value = `${result[0].content}`;
				
			} else {
				const con = document.getElementById('smsContent');
			
				con.value = `${result[0].content}`;
			}

		} else {
			alert(data.message);
		}
	});	
 }
 
 //답변일 출력
 function replyTime() {
	 let time = document.querySelector('.qna-date.reply');
	 const now = new Date();
	 const year = now.getFullYear();
	 const month = String(now.getMonth() + 1).padStart(2, "0");
	 const date = String(now.getDate()).padStart(2, "0");
	 const hour = String(now.getHours()).padStart(2, "0");
	 let h = hour < 12 ? "오전 " : "오후 ";
	 const minutes = String(now.getMinutes()).padStart(2,"0");
	 
	 time.innerText = `답변일 : ${year}년 ${month}월 ${date}일 ${h}${hour%12 || 12}:${minutes}`;	 
 }
 
 function getTemplateList(type) {
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value
		};
		
		commonAjax.call("/mbr/getTemplateList", "POST", params , function(data) {
			const result = data.resultList;		

			if (data.message == "OK") {
				let ul = "";
				
				if (type == "popup") {
					ul = document.querySelector('.tem-wrap.popup-tem');
					temAddClick();
				} else {
					ul = document.querySelector('.tem-wrap');
				}
				ul.innerHTML = '';
				if(result.length > 0){
					for (let i=0; i < result.length; i++) {
						ul.innerHTML +=
							`<div id="template${result[i].templateSeq}" onclick ="${type == "popup" ? "getTemplateContent('popup');" : "getTemplateContent();"}">
								<div class="sms-tem">${result[i].title}</div>
								${result[i].title.length > 6 ? `<p class='arrow-box'>${result[i].title}</p>` : ``}
							</div>
							`;
					}
				} else {
					document.querySelector('.tem-wrap').innerHTML = `<div class="no-tem">템플릿 관리에서 템플릿을 추가 후 사용할 수 있습니다.</div>`;
				}
				if (type == "popup" && result.length < 16) {
					ul.innerHTML += `<div class="sms-tem add-tem" onclick="temAddClick();"></div> `;
				}
			} else {
				alert(data.message);
			}
		});
		temClick();	
}
 
function temClick() {
    const tem = document.querySelectorAll('.sms-tem');

    for (let i=0; i < tem.length; i++) {
        tem[i].addEventListener('click', function() {
            for(let j=0; j < tem.length; j++) {
                tem[j].classList.remove('active');
            }
            tem[i].classList.add('active');
        });
    }
 }

 function temAddClick() {		
	 document.getElementById('temTitle').value ='';
	 document.getElementById('temContent').value = '';
 }
 
 function drawPopup() {
	 commonDrawPopup("load", "/mbr/mbr003Popup");	
 } 
