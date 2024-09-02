function getProductListPop() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/prd/getProductList", "POST", params , function(data) {
		const result = data.resultList;		
		
		if (data.message == "OK") {
			if (result.length > 0) {				
				let dataList = new Array();
				let comboObj;
				
				for (idx in result) {				
			        let data = new Object();
			         
			        data.code = result[idx].prdCode;
			        data.name = result[idx].prdName;

					dataList.push(data);
				}
				
				comboObj = {"target" : "popPrdList", "data" : dataList};						
				
				commonInitCombo(comboObj);	
				
				document.querySelector('.popup-inner').classList.remove('np');
				getProductSubListPop(result[0].prdCode);
			}						
		}
	});
}

function getProductSubListPop(value) {
	const originPrdCode = document.getElementById("prdSubCode").value;	
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"prdCode"	   : value
	};
	
	commonAjax.call("/prd/getProductSubList", "POST", params , function(data) {
		const result = data.resultList;		
		
		if (data.message == "OK") {
			if (result.length > 0) {				
				let dataList = new Array();
				let comboObj;

				for (idx in result) {			
					if (originPrdCode != result[idx].prdSubCode) {
				        let data = new Object();
				         
				        data.code = result[idx].prdSubCode;
				        data.name = result[idx].prdSubName;

						dataList.push(data);	
					}
				}
				
				comboObj = {"target" : "popPrdSubList", "data" : dataList , "defaultOpt" : "소분류 선택"};						
				
				commonInitCombo(comboObj);			
			}						
		}
	});
}

//상세페이지 타입 그리기
function getCallProductSubCategory(prdSubCode) {
	const ul = document.querySelector('.detail-add');
	const parmas = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdSubCode"   : prdSubCode
	};
	
	commonAjax.call("/prd/getCallProductSubCategory", "POST", parmas, function(data){				
		if (data.message == "OK") {
			const result = data.resultList;	
			
			let dataList = new Array();
			let comboObj;
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].code;
		        data.name = result[idx].name;

				dataList.push(data);
			}
			
			comboObj = {"target" : "selectType", "data" : dataList , "defaultOpt" : "전체"};						
			
			commonInitCombo(comboObj);			
		}
	});	
}

function getProductSubDtInfoPop(value) {
    var tag = "";	
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"prdSubCode"    : value
	};
	
	commonAjax.call("/prd/getProductSubDtInfo", "POST", params, function(data){
		if (data.message == "OK") {
			var result = data.resultList;

			document.querySelector(".popup .get-detail").style.width = '700px'; 
			document.querySelector(".popup .detail-con").style.display = 'block';

			if (result.length > 0) {
				document.querySelector(".popup .detail-con").innerHTML = "";
				document.querySelector(".popup .popup-btn").style.display = 'flex';	
					
				for (let i = 0; i < result.length; i++){
			        var type = result[i].detailType;
			        
			        //시술안내
					if(type == 'A'){ 
						if(!isNullStr(result[i].detailContent)){
					        addTopTit(type , result[i].prdDetailSeq);
					        const div = document.querySelector('.add-pop:last-child');
					        
				            div.innerHTML += `<span class="con-desc">${result[i].detailContent}</span>`;	
						}
					}	
					
					//시술추천/시술과정/효과/주기
			        if (type == 'B' || type == 'C' || type == 'D') {
			        	var parent = result[i].prdDetailSeq;
			   
			            if (type == 'B') {
			                tag = 'point';
			            } else if(type == 'C'){
			                tag = 'step';
			            }
			            
			            if (isNullStr(result[i].detailContent)) {
					        addTopTit(type , result[i].prdDetailSeq);
			            } else {
			            	if (!isNullStr(result[i].detailContent)) {
						        const div = document.querySelector('.add-pop:last-child');
						        
			                    div.innerHTML += 
			                        `<div class="reco">
			                            <p class="eng tag">${tag} 0<span>${result[i].sortOrder}</span>.</p>
			                            <p class="con-desc">${result[i].detailContent}</p>
			                        </div>`;	
			            	}
			            }
			        }
			        
			        //주의사항
			        if (type == 'F') {		            
			            if (isNullStr(result[i].detailContent)) {
					        addTopTit(type , result[i].prdDetailSeq);
					        document.querySelector('.add-pop:last-child').innerHTML += 
					        	`<p class="caution">주의사항을 꼼꼼히 읽은 후, 잘 지켜주세요.</p>`;
			            } else {
			            	if (!isNullStr(result[i].detailContent)) {
						        const div = document.querySelector('.add-pop:last-child');
						        
			                    div.innerHTML +=
			                        `<ul class="caution">
			                            <li><i>-</i><span>${result[i].detailContent}</span></li>
			                        </ul>`;  
			            	}
			            }
			        }
			        
			        //qna
			        if (type == 'E') {
			            if (isNullStr(result[i].detailContent)) {
					        addTopTit(type , result[i].prdDetailSeq);
			            } else {
			            	if (!isNullStr(result[i].detailContent) && !isNullStr(result[i].detailContent2)) {
						        const div = document.querySelector('.add-pop:last-child');
						        
		                        div.innerHTML += 
			                        `<ul class="qna-ul">
			                            <li class="Q">
			                                <div><span>${result[i].detailContent}</span></div>
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
				        addTopTit(type , result[i].prdDetailSeq);
		
			            document.querySelector('.add-pop:last-child').innerHTML +=
			                `<div class="img" data-seq = "${result[i].prdDetailSeq}">
			                    <div class="file-upload">
			                        <img src="${result[i].detailImage}">
			                    </div>
			                </div>`;
			        }
			        
			        //맞춤시술
			        if (type == 'H') {
			        	if (isNullStr(result[i].detailContent)) {
			        		addTopTit(type , result[i].prdDetailSeq);	
					        
			        	    const ul = document.createElement('ul');
			        	    ul.classList.add('together-ul');
			        	    ul.dataset.type = type;
			        	    document.querySelector('.add-pop:last-child').appendChild(ul);
			        	} else {
			        		const content = result[i].detailContent.split('\n');
			        	    const div = document.querySelector('.add-pop:last-child ul');
			        	    
			        	    div.innerHTML +=
				                `<li data-sub="${content[0]}">
									<div class="con">
										<div class="source"></div>
										<div class="txt">
				            				<p class="prd-tit">${content[2]}</p>
											<span class="pro-desc">${content[3]}</span>
											<p class="low-price num">${content[4]}</p>
										</div>
									</div>
								</li>`;	
			        		
							const imgDiv = div.querySelector('li:last-child .source');

							if (content[1] == 'img') {
								imgDiv.innerHTML = `<img src="${result[i].detailImage}" alt="상품이미지">`;
							} else {
								imgDiv.classList.add('embed-container')
								imgDiv.innerHTML = 
									`<iframe src="${result[i].detailImage}" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>
									 </iframe>`;
							}
			        	}
			        }
				}
			} else {
				document.querySelector(".popup .detail-con").innerHTML = '<div id="noSearch"><span>불러올 수 있는 데이터가 없습니다.</span></div>';
				document.querySelector(".popup .popup-btn").style.display = 'none';	
			}
			
			getCallProductSubCategory(value); //항목 타입 불러오기
		}
	});	
}

function addTopTit(type, seq) {
	const prdSubName = document.getElementById('prdSubName').value;
    const sub        = document.querySelector(`.detail-add li[data-type='${type}']`).innerText;
    const detailArea = document.querySelector('.popup .get-detail .content'); 
    
    const content = document.createElement('div');
    content.classList.add('add-list');
    content.classList.add('add-pop');
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
        content.innerHTML += 
            `<div class="tit-area">
         		<p class="con-tit">${prdSubName}</p>
         		<span>${sub}</span>
         	</div>`;
    }
}

function updateCallProductSubDt() {
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"prdSubCode"    : document.getElementById("prdSubCode").value,
		"popPrdSubCode" : document.getElementById("popPrdSubList").value,
		"detailType"    : document.getElementById("selectType").value
	};

	commonAjax.call("/prd/updateCallProductSubDt", "POST", params , function(data) {
		if (data.message == "OK") {
			alert("저장되었습니다.");
			popupClose();
			
			location.reload();
		}
	});
}
