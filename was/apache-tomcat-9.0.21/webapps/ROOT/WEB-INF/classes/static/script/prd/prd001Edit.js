function init() {
	getProductList();        //중분류 조회	
	getProductSurgicalSub(); //상세페이지 조회
	editordrawType();        //에디터 타입 그리기
	editorTabBtn();          //에디터 탭 이벤트
}

//중분류 조회
function getProductList() {
	const hospitalCode = document.getElementById("hospitalCode").value;
	const officeCode   = document.getElementById("officeCode").value;	
	const prdCode      = document.getElementById("prdCode").value;
	const prdArea      = document.querySelector("ul.prd");	
	const params = {
		"hospitalCode" : hospitalCode,
		"officeCode"   : officeCode
	};
		
	commonAjax.call("/prd/getProductList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;			
			const name = result[0].hospitalName.split(" ");
			
			document.getElementById("hospitalName").value   = name[0];
			document.getElementById("officeLocation").value = name[1];
			
			commonSetOfficeSite(".page-url", params, "/price/detail/" + prdCode + "?item=" + document.getElementById("prdSubCode").value);
			
			prdArea.innerHTML = "";
			
			for (let i = 0 ; i < result.length; i++) {
				prdArea.innerHTML += 
					`<li data-mst="${result[i].prdMstCode}" data-code="${result[i].prdCode}" class="hide">
		                <span class="${result[i].displayYn == 'Y' ? 'use' : ''}">${result[i].prdName}</span>
		            </li>`;
			}
			
			prdArea.querySelector(`li[data-code="${prdCode}"]`).classList.add('active');
		}
	});
	
	const nodes = document.querySelectorAll('li[data-code]');

	for (let i = 0; i < nodes.length; i++) {					
		nodes[i].addEventListener("click", function() {
			location.href = "/prd/prd001?code=" + nodes[i].dataset.code;
		});
	}
}

//상세페이지 조회 
function getProductSurgicalSub() {
	const prdSubCode = document.getElementById("prdSubCode").value;

	if (!isNullStr(prdSubCode)) {
		const params = {
				"hospitalCode"  : document.getElementById("hospitalCode").value,
				"officeCode"    : document.getElementById("officeCode").value,
				"prdSubCode"    : prdSubCode
		};
		
		commonAjax.call("/prd/getProductSurgicalSub", "POST", params, function(data){
			if (data.message == "OK") {	
				const result = data.result; 
				const step   = document.querySelectorAll('.step');
				const prdSubImage = document.getElementById("prdSubImage");
				
				step.forEach((ele) => ele.style.display = 'flex');
				
				document.getElementById("prdSubName").value           = nvlStr(result.prdSubName);
				document.querySelector(".step3 p.con-tit").innerHTML  = nvlStr(result.prdSubName);
				document.getElementById("prdSubContent").value        = nvlStr(result.prdSubContent);
				document.getElementById("prdSubPrice").value          = nvlStr(result.prdSubPrice); 
				prdSubImage.value                                     = nvlStr(result.prdSubImage); 
				document.getElementById("prdSubVideo").value          = nvlStr(result.prdSubVideo); 
				
				if (!isNullStr(result.prdSubType)) {
					const prdSubLink  = document.querySelectorAll('.tab-con li');
					const prdSubLinkBtn = document.querySelector('.step2 button.save-detail');
					
					prdSubLink.forEach((ele) => ele.classList.remove('active'));
					
					document.querySelector(`input[value="${result.prdSubType}"]`).checked = true;
					document.querySelector(`.tab-con li.${result.prdSubType}`).classList.add('active');
					
					if (result.prdSubType == 'video') {
						prdSubLinkBtn.innerHTML = '영상 저장하기';
						checkItem = 1;
					} else {
						prdSubLinkBtn.innerHTML = '이미지 저장하기'
						checkItem = 2;
					}
				}
				
				if (!isNullStr(prdSubImage.value)) {
					const img = document.querySelector('.tab-con li.img');
			
					img.querySelector('i').style.display = 'none';
					img.querySelector('img').src = result.prdSubImage;
					img.querySelector('img').style.display = 'block';
					img.parentElement.querySelector('.img-del').classList.add('show');
				}
				
				document.querySelector('.step1 button.save-detail').setAttribute("onClick" , "updateProductSurgicalSub('step1')")
				
				getProductSubDtInfo(); //타입별 시술 상세 그리기
				getProductItemList();  //일반 시술 그리기
				getEventItemList();    //이벤트 시술 그리기 
			}
		});		
	}
}

//에디터 상세페이지 타입 그리기
function editordrawType() {
	const ul = document.querySelector('.detail-add');
	const parmas = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdSubCode"   : document.getElementById("prdSubCode").value
	};
	
	commonAjax.call("/prd/getProductSubCategory", "POST", parmas, function(data){				
		if (data.message == "OK") {
			const result = data.resultList;

			ul.innerHTML = "";	
			
			for (let i = 0; i < result.length; i++) {
				const classNm = result[i].code == "A" ? "active" : "";			
				ul.innerHTML += `<li class="${classNm}" data-type="${result[i].code}">${result[i].name}</li>`;	
			}			
		}
	});
}

//에디터 탭 이벤트
function editorTabBtn() {	
    const li = document.querySelectorAll('.detail-add li');
    const editor = document.querySelectorAll('.editor');
    const txt = document.querySelector('.tit-area span');    

    li.forEach((ele) => {
    	ele.addEventListener('click',function(){
        	const type = ele.dataset.type;
        	const con  = document.querySelector(`.editor[data-type="${type}"]`);
        	
        	li.forEach((ele) => ele.classList.remove('active'));
        	editor.forEach((ele) => ele.classList.remove('active'));
        	
        	ele.classList.add('active');
        	con.classList.add('active');
        	
        	if (type == 'H') { //맞춤시술일 경우
        		txt.classList.add('no');
        		txt.innerText = ' 함께하면 좋은 시술';
        		document.getElementById("toolbar").classList.add('no');
        	} else {
            	txt.classList.remove('no');
            	document.getElementById("toolbar").classList.remove('no');
            	
            	txt.innerText = type == 'D' ? '시술효과&시술주기' : ele.innerText;
        	
            	editorPaste();	//에디터 복사,붙여넣기
        	}
        	
        	initEditor();   //에디터 초기화
        	
            //에디터 저장 버튼
        	const saveBtn = document.querySelector('.step3 .save-detail');
        	saveBtn.innerText = '내용 추가하기';
        	saveBtn.setAttribute('onClick' , "insertProductSurgicalSubDt()");
    	});
    });
    
    const tab = document.querySelectorAll('.step2 .con input');
    for (let i = 0; i < tab.length; i++) {
    	tab[i].addEventListener('click',function(){
    	    const con = document.querySelectorAll('.step2 li');
    		con.forEach((ele) => ele.classList.remove('active'));
    		
    		document.querySelector(`.step2 li.${tab[i].value}`).classList.add('active');
    	});
    }
    
    document.querySelectorAll('.detail-add li')[0].click(); //에디터 첫번째 값 선택
}

//시술 상세 페이지 내용 유효성 체크
function isCheckNull() {
	const activeEditor = document.querySelector(".editor.active");
	const type         = activeEditor.dataset.type;
	let detailContent , detailContent2;
	let isNull = true; 
	
	if (type == 'H') {		  //맞춤시술
		const select = document.querySelectorAll(".select-prdSub");
		
		if (select.length > 0) {
			isNull = false;
			
			select.forEach(function(item){
				if (isNullStr(item.value)) {
					isNull = true;
				}
			});	
		}
	} else if (type == 'G') { //이미지 	
		 detailContent = document.getElementById("detailImg").value;
		 
		 if (!isNullStr(detailContent)) isNull = false;
	} else {
		detailContent = activeEditor.querySelectorAll(".con-content")[0].innerText.replace(/\n|\r|\s*/g, ""); //개행문자 제거
		
		if (type == 'E') {    //QnA (Q와 A모두 값이 있어야 통과)
			detailContent2 = activeEditor.querySelectorAll(".con-content")[1].innerText.replace(/\n|\r|\s*/g, "");
			
			if (!isNullStr(detailContent) && !isNullStr(detailContent2)) {
				 isNull = false;
			}	
		} else {
			if (!isNullStr(detailContent)) {
				 isNull = false;
			}	
		}
	}
	
	if (isNull) return true;
}

//시술 상세 페이지 내용 추가
function insertProductSurgicalSubDt() {	
	if (isCheckNull()) {
		alert('내용을 입력해주세요.');
		return;
	}
	
	const detailType = document.querySelector(".editor.active").dataset.type;
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"prdSubCode"    : document.getElementById("prdSubCode").value,
		"detailType"    : detailType,
		"detailImage"   : document.getElementById("detailImg").value,
	};	
	
	if (detailType == 'A' || detailType == 'G') {
		const detailContent = document.querySelector(".editor.active .con-content").innerHTML;
		
		params.detailContent = detailContent;
	} else {
		checkData(detailType); //자식이 있는 내용
		
		params.detailList = document.getElementById("detailList").value;
	}

	commonAjax.call("/prd/insertProductSurgicalSubDt", "POST", params, function(data){
		if (data.message == "OK") {				
			getProductSubDtInfo();
			initEditor();
		}
	});	
}

function checkData(type) {
	const parent = document.querySelector(".editor.active");
	let detailList = [];
	let div;
	
	if (type == 'E') {        //QnA
		div = parent.querySelectorAll(".qna-ul");
		
		for (let i = 0; i < div.length; i++) {
			let datailJson = new Object();
			let qTxt = div[i].querySelector('.q-desc').innerHTML;
			let aTxt = div[i].querySelector('.a-desc').innerHTML;
			
			if(!isNullStr(qTxt) && !isNullStr(aTxt)){
				datailJson.content = qTxt;
				datailJson.content2 = aTxt;
				detailList.push(datailJson);	
			}
		}		
	} else if (type == 'H') { //맞춤시술
		div = parent.querySelectorAll(".together-ul .select-prdSub");
		
		div.forEach(function(item){
			let datailJson = new Object();
			datailJson.content = item.value;
			
			detailList.push(datailJson);
		});
    } else {
    	div = parent.querySelectorAll(".con-content");
    	
		for (let i = 0; i < div.length; i++) {
			let datailJson = new Object();
			let content = div[i].innerHTML;
			
			if (!isNullStr(content)) {
				datailJson.content = content;
				detailList.push(datailJson);	
			}
		}
	}	
	
	document.getElementById("detailList").value = JSON.stringify(detailList);
}

var checkItem; //체크박스 체크 해제

//이미지, 비디오 선택 토글
function checkToggle(num) {   
	const btn = document.querySelector('.step2 button.save-detail');
	
	if (checkItem == num) { //체크 된 값을 클릭 했을 경우 (체크 해제)
		document.querySelector(`.chk[data-state="${num}"]`).checked = false;
		btn.innerText = '저장하기'
		checkItem = null;
	} else {
		btn.innerText = num == '1' ? '영상 저장하기' : '이미지 저장하기';
		checkItem = num;
	}
}

//상세페이지 상단 정보 저장
function insertProductSurgicalSub(){		
	const params = {
			"hospitalCode"  : document.getElementById("hospitalCode").value,
			"officeCode"    : document.getElementById("officeCode").value,
			"prdSubName"    : document.getElementById("prdSubName").value,
			"prdSubContent" : document.getElementById("prdSubContent").value,
			"prdSubPrice"   : document.getElementById("prdSubPrice").value,
			"prdCode"       : document.getElementById("prdCode").value
	};
	
	if (commonCheckRequired('#frm1')) {
		commonAjax.call("/prd/insertProductSurgicalSub", "POST", params, function(data){
			if (data.message == "OK") {
				document.querySelector(".step2").style.display = 'flex'; //영상+이미지 저장 부분 활성화
				document.querySelector(".step3").style.display = 'flex'; //에디터 부분 활성화
				document.getElementById("prdSubCode").value = data.prdSubCode;
				
				alert('저장되었습니다.');
			} else {
				alert(data.message);
			}
		});		
	}
}

//상세페이지 상단 정보 수정
function updateProductSurgicalSub(type) {
	const subType    = document.querySelector("input[name='check']:checked");
	const prdSubName = document.getElementById("prdSubName").value;
	const prdSubImage = document.getElementById("upload").files[0];
	const prdSubVideo = document.getElementById("prdSubVideo");
	const formData = new FormData();
	
	formData.append("hospitalCode"  , document.getElementById("hospitalCode").value);
	formData.append("officeCode"    , document.getElementById("officeCode").value);
	formData.append("prdSubCode"    , document.getElementById("prdSubCode").value);
	formData.append("prdSubName"    , prdSubName);
	formData.append("prdSubContent" , document.getElementById("prdSubContent").value);
	formData.append("prdSubPrice"   , document.getElementById("prdSubPrice").value);
	formData.append("prdSubVideo"   , prdSubVideo.value);
	formData.append("imageFile"     , document.getElementById("upload").files[0]);
	
	if (isNullStr(subType)) {
		formData.append("prdSubType" , '');
	} else {
		formData.append("prdSubType" , subType.value);
	
		if (type != 'step1') {
			if (subType.value == 'img') {
				if (isNullStr(document.getElementById("prdSubImage").value)) {
					alert('이미지를 추가해 주세요.');
					return;
				}
			} else {
				if (isNullStr(prdSubVideo.value)) {
					alert('영상 링크를 입력해 주세요.');
					return;
				}
			}
		}
	}
	
	if (commonCheckRequired('#frm1')) {
		commonAjax.fileUpload("/prd/updateProductSurgicalSub", formData, function(data){
			if (data.message == "OK") {
				alert('저장되었습니다.');
				
				getProductSubDtInfo(); //타입별 시술 상세 그리기
				document.querySelector("p.con-tit").innerHTML = prdSubName;				
			} else {
				alert(data.message);
			}
		});			
	}	
}

//타입별 시술 상세 그리기
function getProductSubDtInfo() {
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"prdSubCode"    : document.getElementById("prdSubCode").value
	};
	
	commonAjax.call("/prd/getProductSubDtInfo", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			
			if (result.length > 0) {
				document.querySelector('.step4').innerHTML = "";	
				
				for (let i = 0; i < result.length; i++) {
					const type = result[i].detailType; //그려지는 타입
			        let num    = result[i].sortOrder;  //타입별 순서 
			        
			        num = num.toString().length == '1' ? num = '0' + num : num;
			        
			        //시술안내
					if(type == 'A'){ 
						if(!isNullStr(result[i].detailContent)){
					        drawTopTit(type , result[i].prdDetailSeq);
					        const div = document.querySelector('.add-list:last-child');
					        
				            div.innerHTML += `<span class="con-desc">${result[i].detailContent}</span>`;	
						}
					}	
					
					//시술추천/시술과정/효과와 주기
			        if (type == 'B' || type == 'C' || type == 'D') {
					    var tag = ""; 
					    
			        	switch (type) {
			        		case 'B' : tag = 'point';
			        		break;
			        		
			        		case 'C' : tag = 'step';
			        		break;
			        	}
			            
			            if (isNullStr(result[i].detailContent)) {
			            	drawTopTit(type , result[i].prdDetailSeq);
			            } else {
					        const div = document.querySelector('.add-list:last-child');
					        
		                    div.innerHTML += 
		                        `<div class="reco">
		                            <p class="eng tag">${tag} <span>${num}</span>.</p>
		                            <p class="con-desc">${result[i].detailContent}</p>
		                        </div>`;	
			            }
			        }
			        
			        //주의사항
			        if (type == 'F') {		            
			            if (isNullStr(result[i].detailContent)) {
			            	drawTopTit(type , result[i].prdDetailSeq);
					        document.querySelector('.add-list:last-child').innerHTML += 
					        	`<p class="caution">주의사항을 꼼꼼히 읽은 후, 잘 지켜주세요.</p>`;
			            } else {
					        const div = document.querySelector('.add-list:last-child');
		                    div.innerHTML +=
		                        `<ul class="caution">
		                            <li><i>-</i><span class="con-desc">${result[i].detailContent}</span></li>
		                        </ul>`;  
			            }
			        }
			        
			        //QnA
			        if (type == 'E') {
			            if (isNullStr(result[i].detailContent)) {
			            	drawTopTit(type , result[i].prdDetailSeq);
			            } else {
			            	if (!isNullStr(result[i].detailContent) && !isNullStr(result[i].detailContent2)) {
						        const div = document.querySelector('.add-list:last-child');
						        
		                        div.innerHTML += 
			                        `<ul class="qna-ul">
			                            <li class="Q">
			                                <div><i>Q.</i><span>${result[i].detailContent}</span></div>
			                            </li>

			                            <li class="A">
			                                <div><span>${result[i].detailContent2}</span></div>
			                            </li>
			                        </div>`;
			            	}
			            }
			        }
			        
			        //이미지
			        if (type == 'G') {
			        	drawTopTit(type , result[i].prdDetailSeq);	
			            document.querySelector('.add-list:last-child').innerHTML +=
			                `<div class="img" data-seq = "${result[i].prdDetailSeq}">
			                    <div class="file-upload">
			                        <img src="${result[i].detailImage}">
			                    </div>

			                    <div class="img-del">
			                        <button class="img-del-btn" onclick="deleteProductSurgicalSubDt(this)">이미지 삭제</button>
			                    </div>
			                </div>`;
			        }
			        
			        //맞춤시술
			        if (type == 'H') {
			        	if (isNullStr(result[i].detailContent)) {
			        		drawTopTit(type , result[i].prdDetailSeq);	
					        
			        		document.querySelector('.add-list:last-child').innerHTML += 
			        			`<ul class="together-ul" data-type="${type}"></ul>`;
			        	} else {
			        		//중분류 코드, 소스타입, 타이틀, 설명, 가격
			        		const content = result[i].detailContent.split('\n');
			        	    const div = document.querySelector('.add-list:last-child ul');
	
			        	    div.innerHTML +=
				                `<li data-sub="${content[0]}">
									<div class="con">
										<div class="source"></div>
										<div class="txt">
				            				<p class="prd-tit clamp-2">${content[2]}</p>
											<span class="pro-desc clamp-2">${content[3]}</span>
											<p class="low-price num">${content[4]}</p>
										</div>
									</div>
								</li>`;	
			        		
							const source = div.querySelector('li:last-child .source');

							if (content[1] == 'none' || content[1] == '') { //기본이미지
								source.innerHTML = `<img src="/resources/images/main/Img_basic.svg" alt="기본이미지">`;
							} else if (content[1] == 'img') {
								source.innerHTML = `<img src="${result[i].detailImage}" alt="상품이미지">`;	
							} else {
								source.classList.add('embed-container');
								source.innerHTML = 
									`<iframe src="${result[i].detailContent2}" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>
									 </iframe>`;
							}
			        	}
			        }	
				}
			};
		}
	});	
}

//상세내용 상단 타이틀 그리기(type - type:시술별 타입코드, seq:상세내용 seq)
function drawTopTit(type, seq) {
    const detailArea = document.querySelector('.step4'); 
	const prdSubName = document.getElementById('prdSubName').value;
    const content = document.createElement('div');
    
    content.classList.add('add-list');
    content.dataset.seq  = seq;
    content.dataset.type = type;
    detailArea.appendChild(content);

    if (type == 'H') {
        content.innerHTML += 
            `<div class="tit-area">
         		<p class="con-tit">${prdSubName}</p>
         		<span class="no">함께하면 좋은 시술</span>
         	</div>`;
    } else {
    	const remark = setListRemark(type);
    
        content.innerHTML += 
            `<div class="tit-area">	
         		<p class="con-tit">${prdSubName}</p>
         		<span>${remark[0]}</span>
         	</div>`;
    }
    
    if (type != 'G') {
    	content.innerHTML += 
    		`<div class="btn-area">
	            <button type="button" class="edit" onclick="updateSubDt(this)">수정</button>
	            <button type="button" class="del" onclick="deleteProductSurgicalSubDt(this)">삭제</button>
	        </div>`;
    }
}

//타입별 주석
function setListRemark(type) {
    let placeholder , tag;

    switch (type) {
	    case 'A': placeholder = '시술안내';
	    		  break;	
	    case 'B': tag = "point";
	    		  placeholder = '시술추천';
	    		  break;
	    case 'C': tag = "step";
	    		  placeholder = '시술과정';
	    		  break;
	    case 'D': tag = "";
	    		  placeholder = '시술효과&시술주기';
	    		  break;
	    case 'E': placeholder = 'Q&A';
				  break;
	    case 'F': placeholder = '주의사항';
				  break;
	    case 'G': placeholder = '이미지';
				  break;
	    case 'H': placeholder = '맞춤시술';
				  break;
	}
    
    return [placeholder , tag];
}

//시술 상세 페이지 내용 수정
function updateSubDt(target) {	
	//스크롤 이벤트
    const location = document.querySelector(".step3").offsetTop - 100;
    window.scrollTo({top: location, behavior: 'smooth'});
    
	document.querySelectorAll('.detail-add li').forEach((ele) => ele.classList.remove('active'));
	document.querySelectorAll('.editor').forEach((ele) => ele.classList.remove('active'));
	
    let content;
    const parent = target.closest('.add-list');
	const seq    = parent.dataset.seq;
	const type   = parent.dataset.type;
	const txt    = document.querySelector('.tit-area span');
	const activeDiv = document.querySelector(`.editor[data-type="${type}"]`);
	const activeLi  = document.querySelector(`.detail-add li[data-type="${type}"]`);
	
	// 1) 해당 타입 에디터 활성화
	activeLi.classList.add('active');    
    activeDiv.classList.add('active');
    activeDiv.innerHTML = "";
	txt.innerHTML = activeLi.innerHTML;
	
	//리스트 버튼이 없는
	if (type == 'H') {
		content = parent.querySelectorAll('.step4 .together-ul li');
		
		txt.classList.add('no');
    	txt.innerText = ' 함께하면 좋은 시술';
    	document.getElementById("toolbar").classList.add('no');
    	
    	activeDiv.innerHTML += 
    		`<ul class="together-ul" id="listOrderH" data-type=${type}>
	    		<li class="add-together-pro">
					<button type="button" class="write" onclick="addTogetherList()"></button>
				</li>
    		</ul>`;

		addDetailList(activeDiv.querySelector('ul') , content);	
	} else {
		content = parent.querySelectorAll('.con-desc');	
		
		if (type == 'E') {
			const qTxt = parent.querySelectorAll('.step4 .Q span');
			const aTxt = parent.querySelectorAll('.step4 .A span');
			
			//2) 해당 컨텐츠 내용 에디터에 그리기 
			addDetailList(activeDiv , qTxt , aTxt);	
		} else {			
			addDetailList(activeDiv , content);	
		}
		
		// 3) 개별 인풋 버튼 이벤트 변경
		for (let i = 0; i < activeDiv.childElementCount - 1; i++) {
			const btn = activeDiv.querySelectorAll("button")[i];
			
			btn.innerHTML = '-';
			btn.classList.add('del-history');
			btn.classList.remove('add-history');
			btn.setAttribute("onClick" , "delList(this)");
		}	
	} 

	//수정하기 버튼 이벤트 변경
    document.querySelector('.step3 .save-detail').innerHTML = '내용 수정하기'
	document.querySelector('.step3 button.save-detail').setAttribute('onClick' , `updateProductSurgicalSubDt('${type}' , ${seq})`);

	editorPaste();
}

//상세 리스트 그리기
function addDetailList(parent , content , content2){
	const type = parent.dataset.type;
	
	// list 추가시
	if (isNullStr(content)) {
		content = '1'; 
		content2 = '1'; 
	}
    
    //시술안내
    if (type == 'A') {
    	parent.innerHTML += 
            `<div class="con-content subject" contentEditable="true" placeholder="시술안내를 입력해주세요.">${nvlStr(content[0].innerHTML)}</div>`;
    }
    
    //시술추천/시술과정/ 효과/주기
    if (type == 'B' || type == 'C' || type == 'D') {        
    	const remark = setListRemark(type);
    	
    	const originNum = parent.querySelectorAll('.tag');
    	let num = !isNullStr(originNum) ? originNum.length : 0;

    	for (let i = 0; i < content.length; i++) {
    		num++;
    		num = num.toString().length < 2 ? '0' + num : num;
    		
            parent.innerHTML += 
                `<div class="reco subject">
                    <p class="eng tag">${remark[1]} <span>${num}</span>.</p>
                    <div class="con-content" contentEditable="true" placeholder="${remark[0]}을 입력해주세요.">${nvlStr(content[i].innerHTML)}</div>
                    <button class="add-history" onclick="addList(this)">+</button>
                </div>`;	
    	}
        
    	commonSetDragDrop(`#${parent.id}`, "", changeListReset);  
    }
    
    //주의사항
    if(type == 'F'){
    	for(let i  = 0; i < content.length; i++) {
        	parent.innerHTML += 
                `<div class="caution subject">
                    <span>-</span>
                    <div class="con-content" contentEditable="true" placeholder="주의사항을 입력해주세요.">${nvlStr(content[i].innerHTML)}</div>
                    <button class="add-history" onclick="addList(this)">+</button>
                </div>`
    	}
    		
    	commonSetDragDrop('#listOrderF', "", changeListReset);  
    }
    
    // QnA
    if(type == 'E'){
    	for (let i = 0; i < content.length; i++) {
        	parent.innerHTML += 
                `<div class="qna-ul subject">
                    <div class="q-area">
                        <label>Q :</label>
                        <div class="q-desc con-content" contentEditable="true" placeholder="질문을 입력해주세요.">${nvlStr(content[i].innerHTML)}</div>
                    </div>

                    <div class="a-area">
                        <label>A :</label>
                        <div class="a-desc con-content" contentEditable="true" placeholder="답변을 입력해주세요.">${nvlStr(content2[i].innerHTML)}</div>
                    </div>
                    
                    <button class="add-history" onclick="addList(this)">+</button>
                </div>`;	
    	}
    	
    	commonSetDragDrop('#listOrderE', "", changeListReset);  
    }
   
    //맞춤시술
    if (type == 'H') {
    	const together = document.querySelector('.editor .together-ul');
    	
    	for (let i = 0; i < content.length; i++) {
        	const div = 
    			`<li>
    				<button type="button" class="del" onclick="this.parentElement.remove()">삭제</button>
    				<div class="con">
    					<div class="source">
    					</div>
    					<div class="txt">
    						<div class="select-box">
    				   			<select class="select-prdSub" onchange="getProductSubContent(this)"></select>
    				   			<div class="icon-arrow"></div>
    				   		</div>
    						<span class="pro-desc">${content[i].querySelector('.pro-desc').innerText}</span>
    						<p class="low-price num">${content[i].querySelector('.low-price').innerText}</p>
    					</div>
    				</div>
    			</li>`;	
        	
        	$('.add-together-pro').before(div);
        	getProductSubList(); //셀렉트 소분류 가져오기
        	document.querySelector('.step3 .together-ul li:nth-last-of-type(2) select').value = content[i].dataset.sub;
        	
        	//해당 시술 이미지, 비디오 넣기
			const source = together.querySelectorAll('.source')[i];

			if (content[i].querySelector('.source').classList.contains('embed-container')) { //비디오일 경우
				source.classList.add('embed-container');
				source.innerHTML = 
					`<iframe src="${content[i].querySelector('iframe').src}" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>
					 </iframe>`;
			} else {
				source.innerHTML = `<img src="${content[i].querySelector('img').src}" alt="상품이미지">`;
			}
    	}
    	
    	commonSetDragDrop('#listOrderH', "", changeListReset);  
    }
}

//상세 내용 순서 변경 텍스트 재정렬
function changeListReset(target) {	
	const type = target.dataset.type;
	let index = 1;

	//번호 재정렬
	if (type == 'B' || type == 'C' || type == 'D') {
		target.querySelectorAll(".reco").forEach(function(el){
		    el.querySelector("span").innerText = index;
		    index++;

			const btn = target.querySelectorAll("button");
			const lastBtn = target.querySelector(".subject:last-child button");
			
			btn.forEach(function(el){
			    el.classList.remove('add-history');
			    el.removeAttribute('onclick','delList(this)');
			    el.classList.add('del-history');
			    el.setAttribute('onclick','addList(this)');
			    el.innerText = '-';
			});
			
			lastBtn.classList.add('add-history');
			lastBtn.classList.remove('del-history');
			lastBtn.removeAttribute('onclick','delList(this)');
			lastBtn.setAttribute('onclick','addList(this)');
			lastBtn.innerText = '+';
		});
	} 	
}

//상세내용 삭제
function deleteProductSurgicalSubDt(target) {
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"prdSubCode"    : document.getElementById("prdSubCode").value,
		"prdDetailSeq"  : target.closest('.add-list').dataset.seq
	};
	
	commonAjax.call("/prd/deleteProductSurgicalSubDt", "POST", params, function(data){
		if (data.message == "OK") {
			alert('삭제되었습니다.');
			
			target.closest('.add-list').remove();
		}
	});
}

//에디터 복사 붙여넣기
function editorPaste() {
	const editor = document.querySelector('.editor.active');
	const ele    = editor.querySelectorAll('div.con-content');

	for (let i = 0; i < ele.length; i++) {
		ele[i].addEventListener('paste', function(e) {
	        e.preventDefault();
	        
	        const pastedData = e.clipboardData;
	        const textData = pastedData.getData('Text');
	        
	        window.document.execCommand('insertHTML', false,  textData);
	    });  	
		
		ele[i].addEventListener('keydown' , function(e){
		    if (e.keyCode === 13) {
		        e.preventDefault();
		        document.execCommand('insertHTML', false, '\n</br>');
		        return false;
		    }
		})
	}  
}

//시술 상세 페이지 내용 수정(type - type:시술별 타입코드, seq:상세내용 seq)
function updateProductSurgicalSubDt(type , seq) {			
	if (isCheckNull()) {	
		alert('내용을 입력해주세요.');
		return;
	}
	
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"prdSubCode"    : document.getElementById("prdSubCode").value,
		"prdDetailSeq"  : seq,
		"detailImage"   : document.getElementById("detailImg").value,
		"detailType"    : type
	};
	
	if (type == 'A' || type == 'G') {
		const detailContent = document.querySelector(".editor.active .con-content").innerHTML;
		
		params.detailContent = detailContent;		
	} else { //자식이 있는 내용
		checkData(type);
		params.detailList = document.getElementById("detailList").value;
	}
		
	commonAjax.call("/prd/updateProductSurgicalSubDt", "POST", params, function(data){
		if (data.message == "OK") {
			alert('저장되었습니다.');
			
			//저장하기 버튼 이벤트 변경
		    document.querySelector('.step3 .save-detail').innerHTML = '내용 저장하기'
			document.querySelector('.step3 button.save-detail').setAttribute('onClick' , "insertProductSurgicalSubDt()");
		    
			initEditor();
			getProductSubDtInfo();
		} else {
			alert(data.message);
		}
	});
}

//에디터 초기화
function initEditor() {
	const editor = document.querySelector('.editor.active');
	const type = editor.dataset.type;
    let div;
	
    if (type == 'G') {        //이미지일때
    	div = editor.querySelector('.subject');
    	
    	div.querySelector('#detailImg').value  = "";
    	div.querySelector('img').style.display = 'none';
    	div.querySelector('img').src           = '';
    	div.querySelector('i').style.display   = 'block';
    } else if (type == 'H') {  //맞춤시술 일때
    	div = document.querySelectorAll('.step3 .together-ul li');
    	
    	for(let i = 0; i < div.length - 1; i++) {
    		div[i].remove();
    	}
    } else {
    	editor.innerHTML = '';
	    addDetailList(editor);
    }
}

//상세 내용 추가 (버튼)
function addList(target){ 
	//리스트 버튼 - 로 수정
	target.innerHTML = '-';
	target.classList.add('del-history');
	target.classList.remove('add-history');
	target.setAttribute("onClick" , "delList(this)");
	
    addDetailList(target.closest('.editor'));
    editorPaste();
}

//상세 리스트 삭제 (버튼)
function delList(target) {
    const editor = document.querySelector('.editor.active');
    
    target.parentElement.remove();
    setListNumber(); //리스트 번호 재정렬
}

//번호 재정렬
function setListNumber() {
	const editor = document.querySelector('.editor.active');
	const type = editor.dataset.type;
    const text = editor.querySelectorAll('p.tag span');
    let num = 0;
    
    if (type == 'B' || type == 'C' || type == 'D') {
    	text.forEach(function(ele){
        	num++;
        	ele.innerText = num.toString().length < 2 ? '0' + num : num;
        });
    }
}

//맞춤시술 - 컨텐츠 추가하기
function addTogetherList(){
	const content =
		`<li>
			<button type="button" class="del" onclick="this.parentElement.remove()">삭제</button>
			<div class="con">
				<div class="source">
					<img src="/resources/images/main/Img_basic.svg" alt="기본이미지">
				</div>
				<div class="txt">
					<div class="select-box">
			   			<select class="select-prdSub" onchange="getProductSubContent(this)"></select>
			   			<div class="icon-arrow"></div>
			   		</div>
					<span class="pro-desc">소분류 상세설명</span>
					<p class="low-price num">0</p>
				</div>
			</div>
		</li>`;
	
	$('.add-together-pro').before(content);
	getProductSubList();
	
	commonSetDragDrop('#listOrderH', "", changeListReset);  
}

//맞춤시술 - 소분류 리스트 조회
function getProductSubList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"sort"	       : "name"
	};
	
	commonAjax.call("/prd/getProductSubList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			const select = document.querySelector('.together-ul li:nth-last-of-type(2) select');
			
			select.innerHTML = '<option value="">소분류 선택하기</option>';
			
			result.forEach((item) => {
				select.innerHTML += `<option value="${item.prdSubCode}">${item.prdSubName}</option>`
			});
		}
	});
}

//맞춤시술 - 소분류 시술 넣기
function getProductSubContent(target) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdSubCode"   : target.value
	};
	
	commonAjax.call("/prd/getProductSubList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList[0];
			const parent = target.closest('li');			
			const source = parent.querySelector('.source');
			
			if (isNullStr(result)) {
				source.innerHTML = `<img src="/resources/images/main/Img_basic.svg" alt="기본이미지">`;
				
				parent.querySelector('.pro-desc').innerText  = "소분류 상세설명";
				parent.querySelector('.low-price').innerText = "0";				
			} else {
				parent.querySelector('.pro-desc').innerText  = result.prdSubContent;
				parent.querySelector('.low-price').innerText = result.prdSubPrice;
				
				if (isNullStr(result.prdSubType)) {
					source.innerHTML = `<img src="/resources/images/main/Img_basic.svg" alt="기본이미지">`;	
				} else if (result.prdSubType == 'img') {
					source.innerHTML = `<img src="${result.prdSubImage}" alt="상품이미지">`;
				} else {
					source.classList.add('embed-container');
					source.innerHTML = 
						`<iframe src="${result.prdSubVideo}" 
							width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>
						 </iframe>`;
				}	
			}						
		}
	});
}

//일반 시술 조회
function getProductItemList() {
	const itemList = document.querySelector('ul.normal');
	const params = {
			"hospitalCode"  : document.getElementById("hospitalCode").value,
			"officeCode"    : document.getElementById("officeCode").value,
			"prdSubCode"    : document.getElementById("prdSubCode").value
	};
	
	commonAjax.call("/prd/getProductItemList", "POST", params, function(data){
		if (data.message == "OK") {
			let paramArr = [];
			var result = data.resultList;
			
			if (!isNullStr(result)) {
				itemList.innerHTML = '<small>일반 시술</small>';
				
				for (let i = 0; i < result.length; i++ ) {
					paramArr.push({
						"prdItemCode" : result[i].prdItemCode, 
						"displayYn"	  : result[i].displayYn
					});
					
					itemList.innerHTML += 
						`<li>
							<input type="hidden" id="prdItemCode" value="${result[i].prdItemCode}">
		                    <div class="btn-area">
		                        <button type="button" class="display ${result[i].displayYn == 'Y' ? 'no-show' : 'show'}">노출</button>
		                        <button type="button" class="edit" onclick="updateProductItem(this)">수정</button>
		                        <button type="button" class="del" onclick="deleteProductSurgicalItem(this)">삭제</button>
		                    </div>
		                    <div class="con-area ${result[i].displayYn == 'Y' ? 'no-show' : 'show'}">
		                        <p>${result[i].prdItemName}</p>
		                        <div class="price">
		                            <span class="sale num">${result[i].price}</span>
		                        </div>
		                    </div>
		                </li>`;
				}
				
				//일반 시술 노출변경 이벤트 리스너
				const btn = document.querySelectorAll('ul.normal button.display');

				for (let i = 0; i < btn.length; i++) {
					btn[i].addEventListener("click", function() {
						updateProductSurgicalItemDisplay({
							"prdItemCode" : paramArr[i].prdItemCode, 
							"displayYn"	  : paramArr[i].displayYn
						});
					});
				}	
			} else {
				itemList.innerHTML = '<div id="noSearch"><span>시술이 없습니다.</span></div>';
			}
		}
	});
}

//일반 시술 노출 변경
function updateProductSurgicalItemDisplay(obj) {
	const params = {
			"hospitalCode"  : document.getElementById("hospitalCode").value,
			"officeCode"    : document.getElementById("officeCode").value,
			"prdItemCode"  	: obj.prdItemCode,
			"displayYn"		: obj.displayYn == "Y" ? "N" : "Y"
	}
	
	commonAjax.call("/prd/updateProductSurgicalItemDisplay", "POST", params, function(data){
		if (data.message == "OK") {
			getProductItemList();
		}
	});
}

//일반 시술 삭제
function deleteProductSurgicalItem(target) {
	const parent = target.closest('li');
	const prdItemName = parent.querySelector('p').innerText;
	const msg = `${prdItemName} 시술을 삭제하시겠습니까?`;
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"prdItemCode"  : parent.querySelector("#prdItemCode").value			
	};
	
	if (confirm(msg)) {
		commonAjax.call("/prd/deleteProductSurgicalItem", "POST", params, function(data){
			if (data.message == "OK") {
				getProductItemList();
			}
		});	
	}
}

//일반 시술 수정
function updateProductItem(target) {
	const parent = target.closest('li');
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdItemCode"  : parent.querySelector("#prdItemCode").value
	};
	
	commonAjax.call("/prd/getProductItemInfo", "POST", params, function(data) {
		if (data.message == "OK") {
			drawPopup(data.result);			
		}
	});
}

//일반 시술 추가 팝업 (type - data:수정일 경우 일반시술 데이터)
function drawPopup(data) {
	const prd 	  = document.querySelector('ul.prd li.active span').innerText;
	const prdSub  = document.getElementById('prdSubName').value;	
	const content =  
		 	`<form id="popfrm" onsubmit="return false">
		 		 <input type="hidden" id="prdItemCode">
			 	 <div class="left">
	                <div class="popup-tit">
	                    <p>일반 시술 추가</p>
	                </div>
	
	                <div class="popup-con">
	                    <div>
	                        <label for="class" class='need'>시술 분류(중/소분류)</label>
	                        <input type="text" id="class" value="[${prd}] ${prdSub}" disabled>
	                    </div>
	    
	                    <label for="prdItemName" class='need'>일반 시술</label>
	                    <div class="inputs">
	                        <input type="text" id="prdItemName" placeholder="일반 시술을 입력해 주세요." required>
	                        <input type="text" id="capacity" class="capa" placeholder="용량">
	                    </div>
	    
	                    <label for="price" class='need'>일반 시술 정상가</label>
	                    <input type="text" id="price" placeholder="0" onkeyup="commonMoneyFormat(this.value , this)" required>
	    
	                    <div class="popup-btn">
	                        <button type="button" class="add-btn blue-btn" onclick="insertProductSurgicalItem()">추가하기</button>
	                    </div>
	                </div>
	            </div>
	
	            <div class="right">
	                <div class="popup-tit">
	                    <p>기타 추가사항</p>
	                </div>
	
	                <div class="popup-con">
	                    <div class="select-area">
	                        <div>
	                            <label for="anesYn">마취여부</label>
	            		   		<div class="select-box">
						   			<select id="anesYn" name="anesYn">
		                                <option value="">선택</option>
		                            	<option value="Y">필요</option>
		                            	<option value="N">불필요</option>
						   			</select>
						   			<div class="icon-arrow"></div>
						   		</div>
	                        </div>
	                        
	                        <div class="surgical-time">
		                        <div>
		                            <label for="hour">시술시간</label>
		            		   		<div class="select-box">
							   			<select id="hour" name="hour"></select>
							   			<div class="icon-arrow"></div>
							   		</div>
		                        </div>
		                        
		                        <span class="icon">:</span>
		                        
		        		   		<div class="select-box">
						   			<select id="min" name="min"></select>
						   			<div class="icon-arrow"></div>
						   		</div>
	                        </div>					   		
	                    </div>
	
	                    <label for="date">시술 주기</label>
	                    <div class="inputs">
	                        <input type="text" id="surgicalCycle" placeholder="0" pattern="[0-9]+">
	                        
	        		   		<div class="select-box">
					   			<select id="surgicalCycleUnit" name="date">
					   				<option value="">선택</option>
					   				<option value="D">일</option>
	                        		<option value="W">주</option>
	                        		<option value="M">개월</option>
					   			</select>
					   			<div class="icon-arrow"></div>
					   		</div>
	                    </div>
	    
	                    <label for="part">시술 부위</label>
	                    <input type="text" id="surgicalPart" placeholder="부위">
	                </div>
	            </div>
	         </form>`;
	
	commonDrawPopup("draw", content);
	document.querySelector('.popup-inner').classList.add('np');
	drawSelectTime(); //셀렉트 박스 시간 그리기
	
	//수정모드
	if (!isNullStr(data)) {
		document.getElementById("prdItemCode").value   = data.prdItemCode;		
		document.getElementById("prdItemName").value   = data.prdItemName;
		document.getElementById("capacity").value      = data.capacity;
		document.getElementById("price").value         = data.price;		
		document.getElementById("surgicalCycle").value = data.surgicalCycle;
		document.getElementById("surgicalPart").value  = data.surgicalPart;
		
		if (!isNullStr(data.surgicalTime)) {
			const hour = data.surgicalTime.substr(0, 2);
			const min  = data.surgicalTime.substr(2, 4);			
			document.getElementById('hour').value = hour;
			document.getElementById('min').value  = min;
		}
		
		document.getElementById('anesYn').value = data.anesYn;
		document.getElementById('surgicalCycleUnit').value = data.surgicalCycleUnit;	
		
		document.querySelector('.popup-btn button.add-btn').innerText = "수정하기";
		document.querySelector('.popup-btn button.add-btn').setAttribute("onClick" , "updateProductSurgicalItem();");
	} else {
		//일반 시술 추가시 기본값 셋팅
		const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"prdSubCode"   : document.getElementById("prdSubCode").value
		};
		
		commonAjax.call("/prd/getMaxProductItemDefault", "POST", params, function(data){
			if (data.message == "OK") {
				const result = data.result;
				
				if (!isNullStr(result)) {
					if (!isNullStr(result.surgicalTime)) {
						const hour = result.surgicalTime.substr(0, 2);
						const min  = result.surgicalTime.substr(2, 4);			
						document.getElementById('hour').value = hour;
						document.getElementById('min').value  = min;
					}
					
					document.getElementById("surgicalCycle").value = result.surgicalCycle;
					document.getElementById("surgicalPart").value  = result.surgicalPart;
					document.getElementById('surgicalCycleUnit').value = result.surgicalCycleUnit;	
				}
			}
		});	

		document.querySelector('.popup-btn button.add-btn').setAttribute("onClick" , "insertProductSurgicalItem();");
	}
}

//셀렉트 박스 시간 그리기
function drawSelectTime() {
    const hour = document.getElementById('hour');
    const min  = document.getElementById('min');
    
    // 시간
    for (let i = 0; i <= 10; i++) {
    	let hours = `${i}`.padStart(2,'0');
    	hour.innerHTML += `<option value="${hours}">${hours}</option>`;
    }

    // 분
    min.innerHTML += '<option value="00">00</option>'
    for (let i = 1; i <= 11; i++) { 
    	let minute = `${i * 5}`.padStart(2,'0');
        min.innerHTML += `<option value="${minute}">${minute}</option>`
    }
}

//일반 시술 추가
function insertProductSurgicalItem() {
	const params = {
			"hospitalCode"  : document.getElementById("hospitalCode").value,
			"officeCode"    : document.getElementById("officeCode").value,
			"prdSubCode"    : document.getElementById("prdSubCode").value,
			"prdItemName"   : document.getElementById("prdItemName").value.replace(/\s*$/, ""),
			"capacity"      : document.getElementById("capacity").value,
			"price"         : document.getElementById("price").value, 
			"anesYn"        : document.getElementById("anesYn").value, 
			"surgicalTime"      : document.getElementById('hour').value + document.getElementById('min').value,
			"surgicalCycle"     : document.getElementById("surgicalCycle").value, 
			"surgicalCycleUnit" : document.getElementById("surgicalCycleUnit").value, 
			"surgicalPart"      : document.getElementById("surgicalPart").value			
	};
	
	if (commonCheckRequired('#popfrm')) {
		commonAjax.call("/prd/insertProductSurgicalItem", "POST", params, function(data){
			if (data.message == "OK") {
				popupClose(); //기본 값 셋팅 필요
				drawPopup();
				
				getProductItemList();
			} else {
				alert(data.message);
			}
		});	
	}
}

//일반 시술  수정
function updateProductSurgicalItem() {
	const params = {
			"hospitalCode"  : document.getElementById("hospitalCode").value,
			"officeCode"    : document.getElementById("officeCode").value,
			"prdItemCode"   : document.getElementById("prdItemCode").value,			
			"prdItemName"   : document.getElementById("prdItemName").value,
			"price"         : document.getElementById("price").value, 
			"capacity"      : document.getElementById("capacity").value,
			"anesYn"        : document.getElementById("anesYn").value, 
			"surgicalTime"       : document.getElementById('hour').value + document.getElementById('min').value,
			"surgicalCycle"      : document.getElementById("surgicalCycle").value, 
			"surgicalCycleUnit"  : document.getElementById("surgicalCycleUnit").value, 
			"surgicalPart"       : document.getElementById("surgicalPart").value, 
	};
	
	if (commonCheckRequired('#popfrm')) {
		commonAjax.call("/prd/updateProductSurgicalItem", "POST", params, function(data){
			if (data.message == "OK") {
				popupClose(); 
				getProductItemList();
			} else {
				alert(data.message);
			}
		});
	}
}

//이벤트 시술 조회
function getEventItemList() {	
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"prdSubCode"    : document.getElementById("prdSubCode").value
	};
	
	commonAjax.call("/prd/getEventItemList", "POST", params, function(data){
		if (data.message == "OK") {			
			const result = data.resultList;
			const eventList = document.querySelector('ul.event');			

			if (!isNullStr(result)) {
				eventList.innerHTML = '<small>이벤트 시술</small>';
				
				for (let i = 0; i < result.length; i++ ) {
					eventList.innerHTML +=
						`<li>
				            <div>
				                <div class="txt-area">
				                    <p>
				                    	<a href="/prd/prd002?seq=${result[i].eventSeq}&sub=${result[i].eventSubSeq}&code=${result[i].eventProductCode}">
				                    	[EVENT] ${result[i].eventProductTitle}
				                    	</a>
				                    </p>  
				                    <span>${result[i].eventProductContent}</span>                  
				                </div>
				                <div class="price">
				                    <span class="origin num">${result[i].eventPrice}</span>
				                    <span class="sale num">${result[i].eventSale}</span>
				                </div>
				            </div>
				        </li>`;	
					
					if (result[i].eventProductType != 'E') {
						const div = document.querySelector(".event li:last-child .txt-area");
						const arr = result[i].prdItemName.split("\n");
					
						for (let i = 0; i < arr.length; i++) {
							div.innerHTML += `<span>${arr[i].replace(/,/gi, ", ")}</span>`;	
						}
					}
				}   
			}
		}
	});
}

//상세노출 순서 팝업
function popDetailList() {
	const parmas = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdSubCode"   : document.getElementById("prdSubCode").value
	};
	
	commonAjax.call("/prd/getProductSubCategory", "POST", parmas, function(data){				
		if (data.message == "OK") {
			const result  = data.resultList;			
			const content = 
		        `<div class="popup-tit">
		        	<div class="text">
		            	<p>상세 내용 노출 순서</p>
		            	<span>상세페이지에서 고정으로 노출할 순서를 자유롭게 변경할 수 있습니다.</span>
		        	</div>
		         </div>
		         
		         <div class="popup-con list" style="width:360px">
		        	<div class="list-detail">
		        		<div class="list-con">
		        			<ul id="arrayList" class="scroll list-style"></ul>
		        		</div>
		        	</div>
				</div>

		        <div class="popup-btn">
		            <button type="button" class="save-btn blue-btn" onclick="popDetailSave()">저장하기</button>
		        </div>`;
			
		    commonDrawPopup("draw", content);			
			
		    const ul = document.getElementById("arrayList");
		    
			for (let i = 0; i < result.length; i++) {		
				ul.innerHTML += 
					`<li data-code="${result[i].code}">
						<span>${result[i].sortOrder}</span>. ${result[i].name}
					</li>`;				
			}
			
			//상세 노출 드래그&드롭 이벤트 추가
			commonSetDragDrop("#arrayList", "", callOrderReset);
		}
	});		
}

//순서 텍스트 재정렬
function callOrderReset() {	
	let index = 1;

	document.querySelectorAll("#arrayList li").forEach(function(el){
	    el.querySelector("span").innerText = index;
	    index++;
	});
}

//상세노출 순서 저장
function popDetailSave() {	
	let codeList = "";
	
	document.querySelectorAll("#arrayList li").forEach(function(e) {
		codeList += e.dataset.code + ",";
	});
	
	const parmas = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdSubCode"   : document.getElementById("prdSubCode").value,
		"categoryCode" : codeList.slice(0, -1)
	};
	
	commonAjax.call("/prd/updateProductSubCategory", "POST", parmas, function(data){			
		if (data.message == "OK") {
			alert("저장되었습니다.");
			popupClose();
			
			init();			
		}
	});	
}

//순서 변경 팝업
function popListOrder(){
	const content = 
        `<div class="popup-tit">
        	<div class="text">
            	<p>상세 이벤트 &일반 시술 정렬</p>
            	<span>자유롭게 드래그 앤드 드롭으로 정렬할 수 있습니다.</span>
        	</div>
         </div>
         
         <div class="popup-con list" style="width:1220px">
        	<div class="list-left">
        		<div class="list-tit">
        			<p>상세 페이지</p>
    			</div>
    			
        		<div class="list-con">
        			<ul id="prdSubList" class="scroll list-style"></ul>
        		</div>
        	</div>
        	
        	<div class="list-center">
        		<div class="list-tit">
        			<p>이벤트 시술 정렬</p>
        			
        			<div class="btn-area">
        				<button type="button" onclick="sortList(this , 'name')">이름순</button>
        				<button type="button" onclick="sortList(this , 'price')">가격순</button>
        			</div>
        		</div>
        		
        		<div class="list-con">
        			<ul id="eventList" class="scroll list-style"></ul>
        		</div>
        	</div>
        	
        	<div class="list-right">
        		<div class="list-tit">
        			<p>일반 시술 정렬</p>
        			
        			<div class="btn-area">
        				<button type="button" onclick="sortList(this , 'name')">이름순</button>
        				<button type="button" onclick="sortList(this , 'price')">가격순</button>
        			</div>
        		</div>
        		
        		<div class="list-con">
        			<ul id="normalList" class="scroll list-style"></ul>
        		</div>
        	</div>
		</div>

        <div class="popup-btn">
            <button type="button" class="save-btn blue-btn" onclick="updateProductSortOrder()">저장하기</button>
        </div>`;
	
    commonDrawPopup("draw", content);
	document.querySelector('.popup-inner').classList.remove('np');
    
    //소분류 그리기
    const prdSubList = document.getElementById('prdSubList');
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdCode"      : document.getElementById("prdCode").value
	};
		
	commonAjax.call("/prd/getProductSubList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;

			for (let i = 0; i < result.length; i++) {
				prdSubList.innerHTML += 
					`<li data-code="${result[i].prdSubCode}" onclick="drawSortList('${result[i].prdSubCode}')">
						<p>${result[i].prdSubName}</p>
					</li>`;
			};
		}
	});

	drawSortList(document.getElementById("prdSubCode").value);
}

//정렬 이벤트시술 + 일반 시술 그리기
function drawSortList(prdSubCode){
	const subList = document.querySelectorAll('#prdSubList li');
	const params = {
			"hospitalCode"  : document.getElementById("hospitalCode").value,
			"officeCode"    : document.getElementById("officeCode").value,
			"prdSubCode"    : prdSubCode
	};
	
	subList.forEach(function(ele){
		ele.classList.remove('active');
		
		if (ele.dataset.code == prdSubCode) {
			ele.classList.add('active');	
		}
	});

    //일반 시술 그리기
	commonAjax.call("/prd/getProductItemList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
		    const normalList = document.getElementById('normalList');
		    		    
		    if (result.length > 0) {
			    normalList.innerHTML = '';
			    
			    for(let i = 0; i < result.length; i++) {
			    	normalList.innerHTML += 
			    		`<li data-code="${result[i].prdItemCode}">
			    			<p>${result[i].prdItemName}</p>
							<span class="prd-price">${result[i].price}원</span>
						</li>`;	
			    }	
			    
				commonSetDragDrop('#normalList', "", '');     //일반 시술 순서변경
		    } else {
		    	normalList.innerHTML = '<div id="noSearch"><span>일반 시술이 없습니다.</span></div>'
		    }
		}
	});
	
    //이벤트 시술 그리기
	commonAjax.call("/prd/getEventItemList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
		    const eventList = document.getElementById('eventList');
		    
		    if (result.length > 0) {
			    eventList.innerHTML = '';
			    
			    for (let i = 0; i < result.length; i++) {
			    	eventList.innerHTML += 
			    		`<li 
			    			data-seq="${result[i].eventSeq}" data-subseq="${result[i].eventSubSeq}"
							data-code="${result[i].eventProductCode}" data-sub="${result[i].prdSubCode}">
			    			<p>${result[i].eventProductTitle}</p>
							<span class="prd-price">${result[i].eventSale}원</span>
						</li>`;
			    }
			    
				commonSetDragDrop('#eventList', "", '');    //이벤트 시술 순서변경
		    } else {
		    	eventList.innerHTML = '<div id="noSearch"><span>이벤트 시술이 없습니다.</span></div>'
		    }
		}
	});
}

//이름순 / 가격순 정렬
function sortList(target , sort){
	const parent = target.closest('.list-tit').nextElementSibling.querySelector('ul');
	const li = parent.querySelectorAll('li');
	let arr = [];
	
	parent.innerHTML = '';
	
	li.forEach((ele) => {
		let beforeArr = new Object(); 
		
		beforeArr.name = ele.querySelector('p').innerText;
		beforeArr.price = ele.querySelector('span').innerText;
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
			`<li data-code="${item.code}">
				<p>${item.name}</p>
				<span class="prd-price">${item.price}</span>
			</li>`;
	});
}

//순서정렬 저장
function updateProductSortOrder(){
	const eventLi = document.querySelectorAll('#eventList li');
	let eventList = [];
	
	eventLi.forEach((ele) => {
		let eventArr = new Object(); 
		
		eventArr.eventSeq         = ele.dataset.seq;
		eventArr.eventSubSeq      = ele.dataset.subseq;
		eventArr.eventProductCode = ele.dataset.code;
		eventArr.prdSubCode       = ele.dataset.sub;
		
		eventList.push(eventArr);
	});
	
	const normalLi = document.querySelectorAll('#normalList li');
	let normalList = [];
	
	normalLi.forEach((ele) => {
		let normalArr = new Object(); 

		normalArr.prdItemCode = ele.dataset.code;
		
		normalList.push(normalArr);
	});
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"eventList"    : JSON.stringify(eventList),
		"prdItemList"  : JSON.stringify(normalList)
	};

	commonAjax.call("/prd/updateProductSubSortOrder", "POST", params, function(data){
		if (data.message == "OK") {
			alert('저장되었습니다.');		
			popupClose();
			
			getProductItemList();
			getEventItemList();
		}
	});
}

function delImage(target){
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