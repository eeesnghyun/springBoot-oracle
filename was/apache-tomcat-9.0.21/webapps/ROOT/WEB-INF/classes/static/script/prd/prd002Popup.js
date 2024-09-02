//일반시술 중분류 리스트 조회
function getProductList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
	};	
	
	const eventGroupName = document.querySelector('input[name="eventGroupName"]');
	document.querySelector('input[name="eventProductHead"]').value = eventGroupName.value;
	
	commonAjax.call("/prd/getProductList", "POST", params, function(data) {
		const result = data.resultList;				
		
		if (data.message == "OK") {		
			let dataList = new Array();
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].prdCode;
		        data.name = result[idx].prdName;

				dataList.push(data);
			}
			
			const comboObj = {"target" : "product", "data" : dataList, "defaultOpt" : "중분류 선택"};
			commonInitCombo(comboObj);			
		}
	});		
}	

//일반시술 소분류 리스트 조회
function getProductSubList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdCode"      : document.getElementById("product").value
	};	
	
	commonAjax.call("/prd/getProductSubList", "POST", params, function(data) {
		const result = data.resultList;
		
		if (data.message == "OK") {
			let dataList = new Array();
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].prdSubCode;
		        data.name = result[idx].prdSubName;

				dataList.push(data);
			}
						
			const comboObj = {"target" : "productSub", "data" : dataList, "defaultOpt" : "소분류 선택"};
			commonInitCombo(comboObj);
			
			document.querySelector('ul.result-area').innerHTML = "";
		}				
	});		
}

//일반시술 리스트 조회
function getProductItemList() {
	const prdSubCode = document.getElementById("productSub").value;
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdSubCode"   : prdSubCode
	};
	
	commonAjax.call("/prd/getProductItemList", "POST", params, function(data) {
		const result = data.resultList;				
		const resultList = document.querySelector(".result-area");
		resultList.innerHTML = "";
		
		if (data.message == "OK") {				
			for (let i = 0; i < result.length; i++) {
				resultList.innerHTML += 
					`<li data-code="${result[i].prdItemCode}" data-parent=${prdSubCode}>
						<p class="prdtit">${result[i].prdItemName}</p>
						<span class="prdprice">${result[i].price}</span>
					</li>`;
			}
			
			addEventList();
			itemListActive();
		} else {
			alert(data.message);
		}
	});	
}

//검색한 시술 이벤트 목록에 추가
function addEventList(type) {
    const resultList = document.querySelectorAll('ul.result-area li');
    const prdSub = document.getElementById("productSub");

    for (let i = 0; i < resultList.length; i++) {
    	resultList[i].addEventListener('click',function(){
    		if (!this.classList.contains('active')) {
        		//포인트 시술일 경우 중복되는 시술이 들어갈 수 없게 함
        		if (document.querySelector('.tab li.active').dataset.type == 'C') {
        			const item = document.querySelectorAll('.number-item:not(.active)');
        			
    				Loop1 : item.forEach(function(item){
    							//1) 활성화 되지 않은 이벤트 차감 시술 구성만 체크함
    		    				const label = item.querySelector('input.items-list').value; 
    		    				
    		    				if (!isNullStr(label)) {
    		    					const name = JSON.parse(label);
    		    					
    		    					//2) 검색한 내역과 해당 이벤트 시술 구성 이름을 비교함
    		    					Loop2 : for (let j = 0; j < name.length; j++) {
    				    						if (name[j].itemName.trim() == resultList[i].querySelector('p').innerText) {
    				    							alert('중복된 시술이 존재합니다.');
    				    							return Loop1;  
    				    						}	
    				    					}
    		    				}
    		    			});	
        		}
        		
        		resultList[i].classList.add('active');
                const params = {
            		"prdSubCode" : resultList[i].dataset.parent,
            		"itemCode"   : resultList[i].dataset.code,
            		"itemName"   : resultList[i].querySelector('p').innerText,
            		"price"      : resultList[i].querySelector('span').innerText,
                }
                
                if (type == 'search') {
                	params.prdSubName = resultList[i].dataset.name;
                } else {
                	params.prdSubName = prdSub.options[prdSub.selectedIndex].text;
                }
            	
            	drawEventList(params);
    			detailDisplay(params);
    			setItemList();
    		    addPackageDesc();
                
                //전체 금액에 추가 
                const tab = document.querySelector('.tab li.active').dataset.type;
                const price = params.price;
                
                if (tab == 'P') {
                    const tabTotal = document.querySelector('.total_price');
                    const totalPrice = Number(tabTotal.innerText.replace(/,/g,'')) + Number(price.replace(/,/g,''));
                    
                    tabTotal.innerText = totalPrice.toLocaleString('ko-KR');	
                }	
    		}
        })
    }
}

function addPackageDesc(){
	const itemList = document.querySelectorAll('.items-list');
	document.querySelector('textarea[name="packageContent"]').value = '';
		
	for (let i = 0; i < itemList.length; i++) {
		const value = itemList[i].value;
		
		if (!isNullStr(value)) {
			const content = JSON.parse(value);
			let itemName = '';
			
			content.forEach((ele) => {
				itemName =  itemName + ' + ' + ele.itemName;
			});
			
			itemName =  itemName.replace(' + ', '');
			document.querySelector('textarea[name="packageContent"]').value += `${i+1}회) ${itemName} \n`	
		}
	}
}

function detailDisplay(result) {
	let newJson = new Object();	
	newJson.displayYn  = 'N';
	newJson.prdSubCode = result.prdSubCode;	
	newJson.prdSubName = result.prdSubName;
	
	let originJson = new Object();
	originJson.prdSubCode = result.prdSubCode;	
	originJson.prdSubName = result.prdSubName;
	
	pageArr.push(newJson);
	itemArr.push(originJson);
	
	//중복제거 
	pageArr = pageArr.filter((item, i) => {
		return (pageArr.findIndex((item2, j) => {
					return item.prdSubCode === item2.prdSubCode;}) === i
				);
	});
	
	drawDisplayArr(pageArr);
}

//검색창에 선택된 시술 표시
function itemListActive() {
	const eventList = document.querySelectorAll('ul.select-area li');
	const resultList = document.querySelectorAll('ul.result-area li');
	
	let arr1 = [];
	let arr2 = [];
	
	eventList.forEach((ele) => arr1.push(ele.dataset.code));
	resultList.forEach((ele) => arr2.push(ele.dataset.code));
	
	const intersection = arr1.filter(x => arr2.includes(x)); //두 배열의 교집합
	
	if (!isNullStr(intersection)) {
		for (let i = 0; i < resultList.length; i++) {
			for (let j = 0; j < intersection.length; j++) {
				if (resultList[i].dataset.code == intersection[j]) {
					resultList[i].classList.add('active');
				}	
			}
		}	
	}
}

//이벤트 목록 그리기
function drawEventList(result) {
    const eventList = document.querySelector('ul.select-area');
    
    eventList.innerHTML += 
        `<li data-code="${result.itemCode}" data-parent="${result.prdSubCode}">
        	<input type="hidden" class="prdSubName" value="${result.prdSubName}">
	        <div class="txt">
	            <p class="prdtit">${result.itemName}</p>
	            <span class="prdprice">${commonMoneyFormat(result.price)}</span>
	        </div>
	        <button class="del-item" type="button" onclick="delEventList(this)"></button>
    	</li>`;
    
    countEventList();
	commonSetDragDrop('#selectArea', "", setItemList);    //선택한 시술 순서변경
}

//이벤트 목록 갯수 , 가격 계산
function countEventList(){
    const eventList = document.querySelectorAll('ul.select-area li');
    const price = document.querySelectorAll('ul.select-area li .prdprice');

    let total = 0;
    
    price.forEach((ele) => {total = total + Number(ele.innerHTML.replace(/[^0123456789-]/g, ''))})

    document.querySelector('.total .count').innerHTML = eventList.length;
    document.querySelector('.total .price').innerHTML = total.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");;
}

//이벤트 시술 삭제
function delEventList(target) {
	const resultList = document.querySelectorAll('ul.result-area li');
	const eventList = document.querySelectorAll('ul.select-area li');
	
	const parent = target.parentElement;
	const code = parent.dataset.code;
	
	//이벤트 목록에 지우려는 코드와 검색영역 li.active 코드가 같을때
	for (let i = 0; i < resultList.length; i++){
	    if (code == resultList[i].dataset.code) {
	    	document.querySelector(`ul.result-area li[data-code=${code}]`).classList.remove('active');
	    }	
	}
	
	for (let i = itemArr.length - 1; i >= 0; i--) {
		if (parent.dataset.parent == itemArr[i].prdSubCode) {
			itemArr.splice(i,1);
	
			break;
		}
	}
	
	parent.remove();
	countEventList();
	setItemList();
	
	const tempItemArr = [...new Set(itemArr.map(JSON.stringify))].map(JSON.parse);	
	let tempPageArr = [];	
		
	//중복제거    
	for (let i = 0; i < pageArr.length; i++) {
		for (let k = 0; k < tempItemArr.length; k++) {
			if (pageArr[i].prdSubCode == tempItemArr[k].prdSubCode) {
				tempPageArr.push(pageArr[i]);
			}
		}
	}
	
	pageArr = tempPageArr;
	drawDisplayArr(pageArr);

    //전체 금액에 빼기
    const tab = document.querySelector('.tab li.active').dataset.type;
    const price = parent.querySelector('.prdprice');
    
    if (tab == 'P') {
        const tabTotal = document.querySelector('.total_price');
        const totalPrice = Number(tabTotal.innerText.replace(/,/g,'')) - Number(price.innerText.replace(/,/g,''));
        
        tabTotal.innerText = totalPrice.toLocaleString('ko-KR');	
    }
}

var itemArr = [];      //그냥 들어가는 배열 (전체 담겨 있는 시술을 넣어줌)
var pageArr = [];      //중복이 없는 배열   (노출 부분만 담아줌)

//이벤트 시술 조회
function getEventGroupSubInfo(){
	const li   = document.querySelectorAll('ul.tab li');
	const area = document.querySelector('ul.select-area');
	const prd  = document.querySelector('.prd-type .con');	
	const params = {
		"hospitalCode"     : document.getElementById("hospitalCode").value,
		"officeCode"       : document.getElementById("officeCode").value,
		"eventSeq"     	   : document.getElementById("eventSeq").value,
		"eventSubSeq"      : document.getElementById("eventSubSeq").value,
		"eventProductCode" : document.getElementById("eventProductCode").value
	};
	
	commonAjax.call("/prd/getEventGroupSubInfo", "POST", params, function(data) {
		const list = data.result;			
		const item = data.resultList;	
		const page = data.pageList;
		
		if (data.message == "OK") {
			tabBtn(list.eventProductType);
			
			document.querySelector('input[name="eventProductWord"]').value    = nvlStr(list.eventProductWord);
			document.querySelector('input[name="eventProductTitle"]').value   = list.eventProductTitle;
			document.querySelector('textarea[name="eventProductContent"]').value = nvlStr(list.eventProductContent);
			document.querySelector('input[name="eventSale"]').value  = commonMoneyFormat(list.eventSale);
			document.querySelector('input[name="eventPrice"]').value = commonMoneyFormat(list.eventPrice);
			
			if (list.eventProductType == 'E') {		//이벤트
				for (let i = 0; i < item[0].itemList.length; i++) {
					let itemJson = new Object();
					
					itemJson.prdSubCode = item[0].itemList[i].prdSubCode;
					itemJson.prdSubName = item[0].itemList[i].prdSubName;
					
					itemArr.push(itemJson);
					
					drawEventList(item[0].itemList[i]);	
				}				
			} else {								//패키지 + 횟수차감
				let total = 0;
				document.querySelector('input[name="eventCnt"]').value = list.eventCnt;
				
				if (list.eventProductType == 'P') {
					addPackageCount();
					document.querySelector('textarea[name="packageContent"]').value = nvlStr(list.packageContent);

					const  packageDisplayYn = document.querySelector('input[name="packageDisplayYn"]');
					list.packageDisplayYn == 'Y' ? packageDisplayYn.checked = true : packageDisplayYn.checked = '';
				} else {
					for (let i = 0; i < item.length; i++) { addNumberList(item[i]) }
				}
				
				//개별 item-list 넣기
				for (let i = 0; i < item.length; i++) {
					let itemList = [];
					
					for (let j = 0; j < item[i].itemList.length; j++) {
						const con = item[i].itemList[j];
						let itemJson = new Object();
						
						itemJson.prdSubCode = con.prdSubCode;	
						itemJson.prdSubName = con.prdSubName;	
						itemJson.itemCode = con.itemCode;
						itemJson.itemName = con.itemName;
						itemJson.price = con.price;
						
						total += Number(con.price);
						
						let pageJson = new Object();
					
						pageJson.prdSubCode = con.prdSubCode;	
						pageJson.prdSubName = con.prdSubName;
						
						itemList.push(itemJson);
						itemArr.push(pageJson);
					}
					
					document.querySelectorAll('.items-list')[i].value = JSON.stringify(itemList);
					setItemTit(document.querySelectorAll('.pro')[i]);
				}
				
				//패키지 시술일때만 총 합계 계산해서 넣어줌
				if (list.eventProductType == 'P') {
	                const tabTotal = document.querySelector('.total_price');
	                const totalPrice = Number(tabTotal.innerText.replace(/,/g,'')) + total;
	                
	                tabTotal.innerText = totalPrice.toLocaleString('ko-KR');	
				}
				
				document.querySelectorAll(`ul.${list.eventProductType} .pro`)[0].click();	//openCommon()
			}		
			
			//상세페이지 노출 설정
			if (!isNullStr(page)) {
				pageArr = page;
				drawDisplayArr(page);
			}
		}
	});	
} 

//이벤트 시술 타입 탭 버튼
function tabBtn(target) {
    const li = document.querySelectorAll('.tab li');
    const change = document.querySelectorAll('.change');
    const common = document.querySelector('.common');
    const inputArea = document.querySelector('.input-area');

	change.forEach((ele) => ele.style.display = 'none');
	li.forEach((ele) => ele.classList.remove('active'));

	document.querySelector(`ul.tab li[data-type="${target}"]`).classList.add('active');	
	
	document.querySelector('.package-items').innerHTML = '';
	document.querySelector('.number-items').innerHTML = '';
	document.querySelector('p.total').style.display = 'none';
	
	if (target == 'P' || target == 'C') {
		document.querySelectorAll('.popup-tit .text span').forEach((ele) => ele.style.display = 'block');
		document.querySelector('input[name="eventProductTitle"]').setAttribute('onkeyup','addPackageTit(this)');		
	    common.style.display = 'none';
	    inputArea.classList.add('inputs');
	    document.querySelector('input[name="eventCnt"]').setAttribute('required', 'required');
	    document.querySelector('input[name="eventCnt"]').value = '';
	    
	    if (target == 'P') {
	    	document.querySelector('span.round').innerText = '회';	
	    	document.querySelector('input[name="eventCnt"]').setAttribute("onkeyup","addPackageCount(); commonMoneyFormat(this.value , this)");
	    	document.querySelector('.package-des-wrap').style.display = 'none';
	    } else {
	    	document.querySelector('span.round').innerText = 'P';	
	    	document.querySelector('input[name="eventCnt"]').setAttribute("onkeyup","");
	    }
	} else {
		document.querySelector('input[name="eventProductTitle"]').setAttribute('onkeyup','');
	    common.style.display = 'block';
	    inputArea.classList.remove('inputs');
	    document.querySelector('input[name="eventCnt"]').removeAttribute('required');
	}
	
	const div = document.querySelectorAll(`.${target}`);
	
	div.forEach((ele) => ele.style.display = 'block');
	document.querySelector('input[name="eventProductType"]').value = target;
	
	initCommonPopup();
}

//기본 내용 초기화
function initPopup() {
	document.querySelector('input[name="eventProductWord"]').value = null;
	document.querySelector('textarea[name="eventProductContent"]').value = null;

	document.querySelector('#frm .left').querySelectorAll("[required]").forEach((ele)=>{
		ele.value = null;
		ele.style.border = '1px solid #ccc';
 	})
	
	initCommonPopup();
}

//공통 부분 초기화
function initCommonPopup(){
	const type = document.querySelector('.tab li.active').dataset.type;
	
	if (type != 'E') {
		document.querySelector('.right.common').style.display = 'none';	
		document.querySelector(`.${type} .text span`).style.display = 'block';
		document.querySelector('.package-des-wrap').style.display = 'none';
	} 
	
	itemArr = [];    
	pageArr = [];   
	
	document.querySelector('.search-area input').value = null;
	document.querySelector('ul.result-area').innerHTML = "";
	
	document.querySelector('.package-items').innerHTML = "";
	document.querySelector('.number-items').innerHTML = "";
	document.querySelector('.select-area').innerHTML = "";
	document.querySelector('.prd-type .con').innerHTML = '<label class="need">이벤트 시술 구성을 먼저 진행해 주세요.</label>';
	document.getElementById("product").value = '';
	document.getElementById("productSub").value = '';
	
	document.querySelector('p.total').style.display = 'none';
	document.querySelectorAll('p.total span').innerText = '0';
	document.querySelector('.total_price').innerText = '0';
    
    document.querySelector('div.total span.count').innerText = '0';
    document.querySelector('div.total span.price').innerText = '0';
    
    document.querySelector('textarea[name="packageContent"]').value = '';
}

//패키지 설정 추가
function addPackageCount() {
    const tit = document.querySelector('.inputs input.name').value;
    const count = document.querySelector('.package input.count').value;
    const div = document.querySelector('.package-items');    
    const child = div.childElementCount;
    
    if (count > 0) {
    	document.querySelector('.package-area .text span').style.display = 'none';
    	document.querySelector('.package-des-wrap').style.display = 'block';
    } else {
    	document.querySelector('.package-area .text span').style.display = 'block';
    	document.querySelector('.package-des-wrap').style.display = 'none';
    	initCommonPopup();
    }
    
    if (count > 0) {
    	if (div.childElementCount == 0) {      //패키지 시술 구성이 없을때
            for (let i = 0; i < count; i++) {
            	drawPackageCount(i);
            }	
    	} else if (count > child) {            //자식보다 횟수가 많을때
        	for (let i = child; i < count; i++) {
            	drawPackageCount(i);	
        	}
    	} else if (count < child) {            //횟수보다 자식이 많을때
        	for (let i = child - 1; i >= count; i--) {
        		document.querySelectorAll('.package-items li')[i].remove();
        	}
    	} 
    	
    	document.querySelectorAll('.package-items li')[0].click();
    } else {
    	document.querySelector('.package-items').innerHTML = '';
    }
}

//패키지 이벤트 타이틀 추가
function addPackageTit(target) {
    const tit = document.querySelectorAll('.package-item p');
    const li  = document.querySelectorAll('.package-items li');
    
    for (let i = 0; i < li.length; i++) {
    	tit[i].innerHTML = `${i + 1}회) ${target.value}`;
    }
}

//횟수 차감 설정 추가
function addNumberList(result) {
	const content = document.createElement("li");
	content.classList.add('item');
	
	document.querySelector('.number-area .text span').style.display = 'none';

	content.innerHTML = 
      `<div>
          <input type="text" placeholder="0" class="number-count remark" value="${nvlStr(result.remark)}">
          <span>Point 차감</span>

          <div class="number-item pro" onclick="openCommon(this)" data-seq="${nvlStr(result.detailSeq)}">
              <p>이벤트 시술 구성</p>
              <button class="arrow"></button>
              <input type="hidden" class="items-list">
          </div>

          <button class='del-btn' type='button' onclick="delNumberList(this)"></button>
      </div>

      <label class="need">구성된 시술이 없습니다.</label>`;	
  
	document.querySelector('.number-items').appendChild(content);    
}

//횟수차감 리스트 삭제
function delNumberList(target) {
	const parent = target.parentElement.parentElement;
	const list = target.parentElement.querySelector('.items-list').value;
	
	if (!isNullStr(list)) {
		const itemList = JSON.parse(list);
		
		Loop1 :
			for (let k = 0; k < itemList.length; k++) {
				Loop2 : 
				for (let i = itemArr.length - 1; i >= 0; i--) {
					if (itemList[k].prdSubCode == itemArr[i].prdSubCode) {
						itemArr.splice(i,1);
				
						break Loop2;
					}	
				}
			}
		
			const tempItemArr = [...new Set(itemArr.map(JSON.stringify))].map(JSON.parse);	
			let tempPageArr = [];
			
			//중복제거    
			for (let i = 0; i < pageArr.length; i++) {
				for (let k = 0; k < tempItemArr.length; k++) {
					if (pageArr[i].prdSubCode == tempItemArr[k].prdSubCode) {
						tempPageArr.push(pageArr[i]);
					}
				}
			}
				
			pageArr = tempPageArr;
			drawDisplayArr(pageArr);	
	}

	parent.remove();
	
	if (document.querySelectorAll('.number-items li').length > 0) {
		document.querySelector('.number-items li:first-child .number-item').click();
	} else {
		document.querySelector('.select-area').innerHTML = "";
		document.querySelector('.result-area').innerHTML = "";
		document.querySelector('.total .count').innerText = "0";
		document.querySelector('.total .price').innerText = "0";
		document.getElementById("product").value = '';
		document.getElementById("productSub").value = '';
		document.querySelector('.number-area .text span').style.display = 'block';
	}
}

//패키지 갯수 그리기
function drawPackageCount(i) {
    const tit = document.querySelector('.inputs input.name').value;
    const div = document.querySelector('.package-items');
    
    div.innerHTML += 
        `<li onclick="openCommon(this)" class="item pro" data-seq="${i + 1}">
            <div class="package-item">
                <p>${i + 1}회) ${tit}</p>
                <button class="arrow"></button>
            </div>
            <label class="need">구성된 시술이 없습니다.</label>
            <input type="hidden" class="items-list">
        </li>`;
}

//추가한 시술로 이벤트명 추가 --- 이벤트
function addListTit(){
	const eventTit = document.querySelector('input[name="eventProductTitle"]');
    const totalTit = document.querySelectorAll('.select-area li .prdtit');

    var tit = "";
    
    if (eventTit.value != ""){
    	tit = `[${eventTit.value}] `
    } 
    
    for(let i = 0; i < totalTit.length; i++){
        if (i == totalTit.length - 1) {
        	tit += `${totalTit[i].innerHTML}`;
        } else {
        	tit += `${totalTit[i].innerHTML} + `;
        }
    }
    
    eventTit.value = tit;
}

//추가한 시술로 이벤트명 추가 --- 패키지 / 횟수차감
function setItemTit(target){
	const type = document.querySelector('.tab li.active').dataset.type;
	var li = document.querySelectorAll('.items li');
	var itemName = ""; 
    var con;
	
    !isNullStr(target) ? con = target : con = document.querySelector('.pro.active');
    
	var items = con.querySelector('.items-list').value;
	var list = JSON.parse(items);
	
	if (list.length > 0) {
		if (type == 'P') {
	    	for (let j = 0; j < list.length; j++) {
	    		j == list.length - 1 ? itemName += list[j].itemName : itemName += list[j].itemName + '+';	
	    	}		
		} else if (type == 'C'){
	    	for (let j = 0; j < list.length; j++) {
	    		j == list.length - 1 ? itemName += list[j].itemName : itemName += list[j].itemName + ', ';	
	    	}		
		}
	} else if (list.length == 0) {
		itemName = '구성된 시술이 없습니다.'
	}
     	
	if (type == 'P') {
		con.querySelector('label').innerHTML = itemName;	
	} else if (type == 'C'){
		con.parentElement.parentElement.querySelector('label').innerHTML = itemName;
	}
}

//공통 영역 그리기(이벤트 시술 구성)
function openCommon(target) {
	const li = document.querySelectorAll('.items .pro');
	const itemsList = target.querySelector('.items-list').value;
	const type = document.querySelector('.tab li.active').dataset.type;
	
    li.forEach((ele) => ele.classList.remove('active'));
    target.classList.add('active');
    document.querySelector('.common').style.display = 'block';
    document.querySelector('ul.select-area').innerHTML = "";
    document.querySelectorAll('ul.result-area li').forEach((ele) => ele.classList.remove('active'));
    
    if (type == 'P') {
        document.querySelector('p.total').style.display = 'flex';  
    } else {
        document.querySelector('p.total').style.display = 'none';  
    }
    
    if (!isNullStr(itemsList)) {
    	const list = JSON.parse(itemsList); 	
    	
        for (let i = 0; i < list.length; i++) {
    		drawEventList(list[i]);	
        }	
    }
    
    itemListActive();
}

//상세페이지 노출 설정 그리기
function drawDisplayArr(result) {
	const prd = document.querySelector('.prd-type .con');
    prd.innerHTML = "";
    
    if (result.length > 0) {
    	for (let i = 0; i < result.length; i++){
    		prd.innerHTML +=
    			  `<div>
    			  	<input id="${result[i].prdSubCode}" class="chk" value="${result[i].displayYn}" type="checkbox" onclick="checkToggle(this)"/>
    		       	<label for="${result[i].prdSubCode}"></label>
    			   	<label for="${result[i].prdSubCode}" class="check">${result[i].prdSubName}</label>
    			  </div>`;	
    		
    		if (result[i].displayYn == 'Y') {
    			document.querySelectorAll('.prd-type input.chk')[i].setAttribute('checked', true);
    		}
    	}	
    	
    	commonSetDragDrop('#selectType'); //상세페이지 노출 순서 변경
    } else {
    	prd.innerHTML = '<label class="need">이벤트 시술 구성을 진행해 주세요.</label>';
    }
}

//상세페이지 노출 설정 체크박스 값 변경
function checkToggle(target) {
	for (let i = 0; i < pageArr.length; i++) {
		if (target.id == pageArr[i].prdSubCode) {
			target.value == 'Y' ? pageArr[i].displayYn = 'N' : pageArr[i].displayYn = 'Y';
		}
	}
}

//이벤트 시술 저장	
function checkData() {
	if (commonCheckRequired("#frm")) { //폼 필수값
    	let detailList = [];
    	let pageList   = [];    	
    	
    	const display = document.querySelectorAll('.prd-type .con input:checked');
    	const eventProductType = document.querySelector('ul.tab li.active').dataset.type;
        
    	if (display.length == 0) {	//상세페이지 노출 설정 필수값
    		alert('상세페이지 노출 설정을 확인해주세요.');
    		return;
    	}
    	    	
        if (eventProductType == 'E') { 
        	//일반 시술
        	const list = document.querySelectorAll('ul.select-area li');
        	let detailJson = new Object();
        	let itemList = [];    
        	            
        	list.forEach((ele) => { itemList.push(ele.dataset.code); });

            detailJson.detailSeq = '1';
        	detailJson.itemList  = itemList;
        	detailList.push(detailJson);         
        } else {
        	//일반 시술
            const list = document.querySelectorAll(`.${eventProductType} input.items-list`);            
            
        	for (let i = 0; i < list.length; i++) {
        		if (!isNullStr(list[i].value)) {
        			let detailJson = new Object();                	                    
        			let itemList = [];        			
        			
        			const items = JSON.parse(list[i].value);                			
                    items.forEach((ele) => itemList.push(ele.itemCode));
                    
                    detailJson.detailSeq = i + 1;
                	detailJson.itemList  = itemList;                	 
                	detailJson.remark    = eventProductType == 'C' ? document.querySelectorAll('input.remark')[i].value : null;
                	detailList.push(detailJson);	
        		}    		
        	}
        }
            
    	const detail = document.createElement("input");
    	detail.type  = "hidden";
    	detail.name  = "detailList";
    	detail.value = JSON.stringify(detailList);
    	
    	document.getElementById("frm").appendChild(detail);
        
    	//상세페이지
    	const type = document.querySelectorAll('.prd-type .con input');
        
    	for (let i = 0; i < type.length; i++) {
        	let pageJson = new Object();	
        	
        	pageJson.displayYn  = type[i].checked ? 'Y' : 'N';
        	pageJson.prdSubCode = type[i].id;
        	
        	pageList.push(pageJson);
    	}
    	
    	const page = document.createElement("input");
    	page.type  = "hidden";
    	page.name  = "pageList";
    	page.value = JSON.stringify(pageList);
    	
    	const hInput = document.createElement("input");
    	hInput.type = "hidden";
    	hInput.name = "hospitalCode";
    	hInput.value = document.getElementById("hospitalCode").value; 
    	
    	const oInput = document.createElement("input");
    	oInput.type = "hidden";
    	oInput.name = "officeCode";
    	oInput.value = document.getElementById("officeCode").value;
    	
    	document.getElementById("frm").append(hInput, oInput);
    	document.getElementById("frm").appendChild(page);
    	
    	const params = commonArrayToJson($("#frm").serializeArray());
    	
    	commonAjax.call("/prd/insertEventProductSurgical", "POST", params, function(data){
    		if (data.message == "OK") {				
    			alert('저장되었습니다.');
    			
    			if (document.querySelector('.popup-btn button').value == 'edit') {
    				popupClose(); 	   //수정했을때는 팝업 닫기
    				getEventGroupSubList(document.querySelector("ul.prd li.active"));
    			} else {
        			initPopup();	        
        			initCommonPopup(); //추가했을때는 팝업 유지
    			}
    		}
    	});
    }
}	

//패키지 + 횟수차감 선택 리스트
function setItemList(){
	var itemList = [];
	const type   = document.querySelector('ul.tab li.active').dataset.type;
	const con    = document.querySelector('.pro.active');
	const items  = document.querySelectorAll('.select-area li');

	//기존에 있는 배열 + 추가된 배열을 합침
	if (type != 'E') {
		for (let i = 0; i < items.length; i++) {
			let itemJson = new Object();
			
			itemJson.itemCode   = items[i].dataset.code;
			itemJson.itemName   = items[i].querySelector('.prdtit').innerHTML;
			itemJson.prdSubCode = items[i].dataset.parent;   
			itemJson.prdSubName = items[i].querySelector('.prdSubName').value;
			itemJson.price      = items[i].querySelector('.prdprice').innerHTML.replace("," , "");
			
			itemList.push(itemJson);
		}
		
		con.querySelector('.items-list').value = JSON.stringify(itemList);		
		setItemTit();	
		
		if (type == 'P') {
			addPackageDesc();	
		}
	}
}

//시술 검색
function searchItem() {
	const ul = document.querySelector("ul.result-area");
	const item = document.querySelector(".search-area input").value;
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,			
		"prdCode"      : document.getElementById("product").value,
		"prdSubCode"   : document.getElementById("productSub").value,
		"prdItemName"  : item
	};					
	
	commonAjax.call("/prd/getUpdateProductItemList", "POST", params, function(data) {
    	const result = data.resultList;      
    	
    	if (data.message == "OK") {
    		ul.innerHTML = ""; 
   		
    		if (result.length > 0) {
    			for (let i = 0; i < result.length; i++) {
    				const price = result[i].price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    				
    				ul.innerHTML += 
    				`<li data-code="${result[i].prdItemCode}" data-parent="${result[i].prdSubCode}" data-name="${result[i].prdSubName}">
    					<p class="prdtit">${result[i].prdItemName}</p>
    					<span class="prdprice">${price}</span>
    				</li>`;
    			}
        			
    			addEventList('search');
    			itemListActive();
    		} else {
    			ul.innerHTML += `<li style="height: 100%;">검색된 결과가 없습니다.</li>`;
    		}    					
    	}
	});
}

//시술 검색 이벤트 리스너
document.querySelector(".search-area input").addEventListener('keydown', (e)=>{
	if (e.keyCode === 13) {
		searchItem();
	}  
});

//시술 검색시 submit 방지
document.addEventListener('keydown', (e)=>{
	if (e.keyCode === 13) {
		event.preventDefault();
	}  
});

//팝업 닫기 이벤트
document.querySelector(".popup .del-btn").addEventListener('click',function(){
	getEventGroupSubList(document.querySelector("ul.prd li.active"));
});
document.querySelector(".popup .popup-overlay").addEventListener('click',function(){
	getEventGroupSubList(document.querySelector("ul.prd li.active"));
});

//이벤트 상품 설명 개행 처리
document.querySelector('textarea[name="eventProductContent"]').addEventListener('keydown', (e)=>{
	if (e.keyCode === 13) {
		e.currentTarget.value = e.currentTarget.value + "\n";
	}
});

document.querySelector('textarea[name="packageContent"]').addEventListener('keydown', (e)=>{
	if (e.keyCode === 13) {
		e.currentTarget.value = e.currentTarget.value + "\n";
	}
});
