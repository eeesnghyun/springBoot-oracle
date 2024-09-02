
function typeActive(type) {
	const tab = document.querySelectorAll('.tab');
	const tit = document.querySelector('.title');		
	
	tab.forEach((el) => el.classList.remove('active'));
	tab.forEach(function(el) {
		if (type == el.dataset.type) {
			el.classList.add("active");
			tit.innerText = el.innerText;
		}
	});
}

function getParams() {
	const state = history.state;
	let index = 1;
	let noticeType = "";
	
	if (!isNullStr(state)) {
		document.getElementById("view").value  = state.view;
		document.getElementById("field").value = decodeURI(state.field)
		
		index = state.index;
		noticeType = state.noticeType;				
	}
	
	typeActive(noticeType);
	
	const params = {
		"index"	     : index,
		"noticeType" : noticeType,
		"view"   	 : document.getElementById('view').value,	
		"field" 	 : encodeURI(document.getElementById('field').value)
	};
	
	return params;
}

//공지사항 리스트 조회
function getNoticeList() {
	const params = getParams();
	
	commonAjax.call("/menu/getNoticeList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			const page   = data.pageList;
			const ul = document.getElementById('accWrap');

			ul.innerHTML = "";
			
			if (result.length > 0) {
					for (let i = 0; i < result.length; i++) {
						ul.innerHTML += 
							`<div class="acc-con">
							    <div class="acc-tit">
							        <span class="acc-type"> ${result[i].noticeType}
							        	<span>&nbsp;&nbsp;&nbsp;${result[i].createDate}</span>
							        	<button class="btn-edit" type="button" onclick="setNoticeContent(${result[i].noticeSeq})">수정</button>
										<button class="btn-delete" type="button" onclick="deleteNotice(${result[i].noticeSeq})">삭제</button>
							        </span>
							        <span>${result[i].noticeTitle}</span>
							        
							        <div class="acc-btn"></div>
							    </div>
							    
							    <div class="acc-text">
							        <div>${result[i].noticeContent}</div>
							    </div>
							    
							    <input type="hidden" id="noticeSeq" value="${result[i].noticeSeq}">
								<input type="hidden" id="noticeType" value="${result[i].noticeType}">
							</div>`;
				} 
			} else {
				ul.innerHTML = `<div class="no-data"><span>해당 데이터가 없습니다.</span></div>`;
			}
			
			drawPage(page);
			
			accordionClick();			
		} else {
			alert(data.message);
		}
	}); 	
}

//공지사항 수정
function setNoticeContent(seq) {
	event.stopPropagation();	
	
	location.href='/noticeSave?seq=' + seq;
}

//공지사항 삭제
function deleteNotice(seq) {
	event.stopPropagation();

	if (confirm("공지사항을 삭제하시겠습니까?")) {
		commonAjax.call("/menu/deleteNotice", "POST", {"noticeSeq" : seq}, function(data){
			if (data.message == "OK") {
				getNoticeList();	
			} else {
				alert(data.message);
			}		
		});	
	}		
}

//페이지네이션 
function drawPage(page) {
	const pageWrap = document.querySelector('.page-wrap');
	pageWrap.innerHTML = '';
		
	if (page.length > 0) {
		const pageLength = page.length < 10 ? page.length : 10;
		
		for (let i = 0; i < pageLength; i++) {
			const className = page[i].isActive == true ? "page-num active" : "page-num";		
			const index = className.includes("active") == true ? "#" : page[i].index;

			pageWrap.innerHTML += `<div class="${className}"><a href="javascript:void(0);" data-index="${index}" onclick="goPage(this)">${page[i].index}</a></div>`;
		}		
	} else {
		pageWrap.innerHTML = `<div class="page-num active"><a href="#">1</a></div>`;
	}
}

//페이지 이동
function goPage(obj) {
	if (obj.dataset.index != "#") {
		const index = obj.dataset.index;
		const noticeType = nvlStr(obj.dataset.type);				
		typeActive(noticeType);
		
		setParams(index);
		
		getNoticeList();	
	}	
}

//페이지 주소 전환 및 파라미터 전달
function setParams(index) {
	const noticeType = document.querySelector('.tab.active').dataset.type;	
	const url = "/notice?index=" + index 
			  + "&noticeType=" + noticeType
			  + "&view="  + document.getElementById('view').value
			  + "&field=" + encodeURI(document.getElementById('field').value);
	
	const state = {
		"index"	     : index,
		"noticeType" : noticeType,
		"view"   	 : document.getElementById('view').value,	
		"field" 	 : encodeURI(document.getElementById('field').value)			
	};
	
	history.pushState(state, null, url);		
}

function pageBtnClick(type) {	
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
		
	setParams(index);
	
	getNoticeList();
}

function accordionClick() {
    const li = document.querySelectorAll('.acc-tit');
    const con = document.querySelectorAll('.acc-text');
    
    for (let i = 0; i < li.length; i++) {
        li[i].addEventListener('click', function(){
            const inner = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                inner.style.maxHeight = null;		  		
                this.classList.remove('active');
            } else {
                for (let j = 0; j < li.length; j++) {
                    con[j].style.maxHeight = null;
                    li[j].classList.remove('active');
                }
                const inner = this.nextElementSibling;

                inner.style.maxHeight = inner.scrollHeight + "px";	
                this.classList.add("active");
            }
        });
    }
}

//enter 검색
function enterKey() {
	if (window.event.keyCode == 13) {
		setParams(1);
		
		getNoticeList();
	}	
}