function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
		
	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;	
	
	getProductList();
}

//병원, 지점 변경
function reload() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonSetOfficeSite(".page-url", params);
	
	location.href = "/prd/prd001";
}

//대분류 조회
function getProductMtList(type) {
	const hospitalCode = document.getElementById("hospitalCode").value;
	const officeCode   = document.getElementById("officeCode").value;	
	const params = {
		"hospitalCode" : hospitalCode,
		"officeCode"   : officeCode
	};
	
	commonAjax.call("/prd/getProductMtList", "POST", params , function(data) {
		const result = data.resultList;		
		
		if (data.message == "OK") {
			if (result.length > 0) {				
				let dataList = new Array();
				let comboObj;
				
				for (idx in result) {				
			        let data = new Object();
			         
			        data.code = result[idx].prdMstCode;
			        data.name = result[idx].prdMstName;

					dataList.push(data);
				}
				
				if (type == 'add' || type == 'edit') {
					if (type == 'add') {	//중분류 추가시, 대분류 삭제시
						comboObj = {"target" : "prdMstList", "data" : dataList , "defaultOpt" : "대분류 선택"};	
					} else {				//중분류 수정시
						comboObj = {"target" : "prdMstList", "data" : dataList};	
					}
											
					commonInitCombo(comboObj);
				} else {
					const div = document.querySelector('.mst-list');
					div.innerHTML = "";
					
					for (let i = 0; i < result.length; i++) {
						div.innerHTML += 
							`<li data-mst="${result[i].prdMstCode}">
								<div class="sort"></div>
								<input type="text" value="${result[i].prdMstName}">
								<button type="button" class="del-btn" onclick="addMstPop('delete' , this)"></button>
							</li>`;
					}
				}	
			}						
		}
	});
}

//중분류 리스트 조회
function getProductList() {		
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/prd/getProductList", "POST", params, function(data){
		commonSetOfficeSite(".page-url", params, "/price");
		
		if (data.message == "OK") {					
			drawProductList(data, false);
		}
	});
}

//중분류 리스트 그리기
function drawProductList(data, isPop) {
	const result  = data.resultList;
	const edit    = data.edit;		//수정가능여부
	const prdArea = document.querySelector("ul.prd");
	prdArea.innerHTML = "";	

	for (let i = 0 ; i < result.length; i++) {
		prdArea.innerHTML +=
			`<li class="hide" data-mst="${result[i].prdMstCode}" data-code="${result[i].prdCode}">
	            <span onclick="location.href='/prd/prd001?code=${result[i].prdCode}'" class="${result[i].displayYn == 'Y' ? 'use' : ''}">
            		${result[i].prdName}
            	</span>
				<i onclick="floatMenu(this)"></i>
				
				<div class="show-area alert float hide">
	            	<button type="button" class="show-prd" onclick="updateProductDisplay(this , 'code')" value="${result[i].displayYn}">
	            		${result[i].displayYn == 'Y' ? '미노출' : '노출'}
	            	</button>
		        </div>
	        </li>`;
	}
	
	//수정 버튼 활성화
	if (edit == 'Y') {
		for (let i = 0; i < result.length; i++) {
			const showArea = document.querySelectorAll('.show-area');
			
			showArea[i].innerHTML += `<button type="button" class="editY" onclick="drawPopup('edit', this)">수정</button>`;
			showArea[i].classList.add('editY');
		}
		
		prdArea.innerHTML += `<button type="button" class="add-prd" onclick="drawPopup('add')">추가하기</button>`;
	}
	
	//불러오기 조회시
	if (isPop) {
		getProductSubListCallPop(prdArea.children[0]);
	} else {
		const searchParams = commonGetQueryString();
		
		if (isNullStr(searchParams)) {
			getProductSubList(prdArea.children[0]);	//초기값선택
		} else {
			getProductSubList(prdArea.querySelector(`li[data-code=${searchParams.get("code")}]`));
		}							
	}		
}

//팝업 그리기(type - add:추가, edit:수정)
function drawPopup(type, target) {
    const popup = document.querySelector('#popupInner');    
    let content;
    
    if (type == 'add') {      
    	content = 
            `<div class="popup-tit"><p>중분류 추가</p></div>
            
            <div class="popup-con" style="width:360px">
            	<div>
	                <label class="need">대분류</label>
					<div class="select-box">
				    	<select id="prdMstList"></select>
						<div class="icon-arrow"></div>	
					</div>
            	</div>
				
				<div>
					<label class="need">중분류</label>
            		<input type="text" id="prdName" placeholder="중분류를 입력해 주세요.">
				</div>
			</div>

            <div class="popup-btn">
                <button type="button" class="save-btn blue-btn" onclick="insertProduct()">저장하기</button>
            </div>`;
    	
        commonDrawPopup("draw", content);
        getProductMtList('add');
        
    } else if (type == 'edit') { 
		const parent = target.closest('li');
     	const prdMtsCode = parent.dataset.mst;
		const prdCode = parent.dataset.code;
		const prdName = parent.querySelector('span').innerText;
		
    	content = 
            `<div class="popup-tit"><p>중분류 수정</p></div>
            
            <div class="popup-con" style="width:360px">
            	<div>
	                <label class="need">대분류</label>
					<div class="select-box">
				    	<select id="prdMstList"></select>
						<div class="icon-arrow"></div>	
					</div>
            	</div>
				
				<div>
					<label class="need">중분류</label>
            		<input type="text" placeholder="중분류를 입력해 주세요." id="prdName" value="${prdName}">
				</div>
			</div>

            <div class="popup-btn">
                <button type="button" class="save-btn blue-btn" onclick="updateProduct('${prdCode}')">수정하기</button>
            </div>`;
    	
        commonDrawPopup("draw", content);
        getProductMtList('edit');
        document.getElementById('prdMstList').value = prdMtsCode;
    } else {                      //일반시술 불러오기
        commonDrawPopup("load", "/prd/prd001Get");
    }
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

//중분류 추가
function insertProduct() {	
	const prdName 	 = document.getElementById("prdName").value;
	const prdMstCode = document.getElementById("prdMstList").value;	
	
	if (isNullStr(prdMstCode)) {
		alert('대분류를 선택해주세요.'); 
		return;	
	} 
	
	if (isNullStr(prdName)) {
		alert('중분류를 입력해주세요.');
		return;	
	}
	
	//중분류 이름 중복 체크
	const ulPrd = document.querySelectorAll(".prd li span");
	for (let i = 0; i < ulPrd.length; i++) {
		if (prdName == ulPrd[i].innerText) {
			alert("중복되는 중분류가 존재합니다.");
			return;
		}	
	}
	
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"prdName"      : prdName,
			"prdMstCode"   : prdMstCode
	};		
	
	commonAjax.call("/prd/insertProduct", "POST", params, function(data){
		if (data.message == "OK") {
			alert('저장되었습니다.');
			
			getProductList(); //중분류 리스트 조회
			popupClose();
		} else {
			alert(data.message);
		}
	});	
}

//소분류 리스트 그리기
function drawProductSubList(data) {
	const prdSubArea = document.querySelector('ul.prd-sub');
	const result = data.resultList;
	
	prdSubArea.innerHTML = "";
	
	for (let i = 0 ; i < result.length; i++) {
		prdSubArea.innerHTML += 
			`<li data-sub="${result[i].prdSubCode}" data-code="${result[i].prdCode}">
	            <button type="button" class="displayYn ${result[i].displayYn == 'Y' ? 'no-show' : 'show'}" 
	            		value="${result[i].displayYn}" onclick="updateProductDisplay(this, 'sub')">
	            	${result[i].displayYn == 'Y' ? '노출' : '미노출'}
            	</button>
	
	            <div class="con">
	                <div class="overlay">
	                    <button class="prd-edit write">수정하기</button>
	                </div>
	
					<div class="area ${result[i].displayYn == 'Y' ? 'no-show' : 'show'}">
		                <div class="source"></div>
		                <div class="txt">
		                    <p class="pro-name clamp-2">${result[i].prdSubName}</p>
		                    <span class="pro-desc clamp-2">${result[i].prdSubContent}</span>			                
		                    <p class="low-price num">${result[i].prdSubPrice}</p>
		                </div>
					</div>
	            </div>
	        </li>`;	
		
		const source = document.querySelectorAll('.source')[i];
		
		if (isNullStr(result[i].prdSubType)) {
			source.innerHTML = `<img src="/resources/images/main/Img_basic.svg" alt="기본이미지">`;
		} else {
			if (result[i].prdSubType == 'img') {
				source.innerHTML = `<img src="${result[i].prdSubImage}" alt="상품이미지">`;
			} else {
				source.classList.add('embed-container')
				source.innerHTML = `<iframe src="${result[i].prdSubVideo}" width="100%" height="160px" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`;
			}					
		}
	}			
	
	if (data.edit == 'Y') {
		const activeCode = document.querySelector('ul.prd li.active').dataset.code;
		prdSubArea.innerHTML += `<li class="add-prd-sub" data-code="${activeCode}" data-sub=""><button type="button" class="write"></button></li>`;	
	}
}

//일반시술 소분류 불러오기
function getProductSubListCallPop(target) {
	const prdList    = document.querySelectorAll('ul.prd li');
	const params = {
		"hospitalCode" : document.getElementById("popHospitalCode").value,
		"officeCode"   : document.getElementById("popOfficeCode").value,
		"prdCode"	   : target.dataset.code
	};
		
	prdList.forEach((ele) => ele.classList.remove('active'));
	target.classList.add('active');
	
	commonAjax.call("/prd/getProductSubList", "POST", params, function(data){
		if (data.message == "OK") {			
			drawProductSubList(data); //일반시술 소분류 그리기
		}
	});
}

//일반시술 소분류 검색
document.querySelector('#prdItemName').addEventListener('keyup', (e)=>{
	if (e.keyCode === 13) {
		getProductSubList();
	}  
});

//일반시술 소분류 리스트 조회
function getProductSubList(target) {
	const prdList      = document.querySelectorAll('ul.prd li');
	const prdItemName  = document.getElementById("prdItemName");
	const hospitalCode = document.getElementById("hospitalCode").value;
	const officeCode   = document.getElementById("officeCode").value;	
	const params = {
		"hospitalCode" : hospitalCode,
		"officeCode"   : officeCode
	};

	//시술 검색시
	if (isNullStr(prdItemName.value)) {
		prdList.forEach((ele) => ele.classList.remove('active'));
		target.classList.add('active');
		
		params.prdCode = target.dataset.code;		
	} else {
		params.prdItemName = prdItemName.value;
	}
	
	commonAjax.call("/prd/getProductSubList", "POST", params, function(data){
		if (data.message == "OK") {
			prdItemName.value = null;
			drawProductSubList(data); //일반시술 소분류 그리기
		}
	});
	
	const nodes = document.querySelectorAll('.prd-sub li');

	for (let i = 0; i < nodes.length; i++) {
		nodes[i].querySelector('button.write').addEventListener("click", function() {
			location.href = "/prd/prd001Edit?code=" + nodes[i].dataset.code + "&sub=" + nodes[i].dataset.sub; 
		});
	}
}

//일반시술 노출/미노출 변경(type - code:중분류, sub:소분류)
function updateProductDisplay(target, type) {	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};	
	
	params.displayYn = target.value == 'Y' ? 'N' : 'Y';

	if (type == 'code') {         
		params.prdCode = target.closest('li').dataset.code;		
	} else {                       
		params.prdSubCode = target.parentElement.dataset.sub;
	}
	
	commonAjax.call("/prd/updateProductDisplay", "POST", params, function(data){
		if (data.message == "OK") {						
			if (type == "code") {
				getProductList(); //중분류 리스트 조회
			} else {						
				getProductSubList(document.querySelector("ul.prd .active")); //소분류 리스트 조회
			}									
		} else {
			alert(data.message);
		}
	});
}

//중분류 저장
function updateProduct(prdCode) {	
	const prdName = document.getElementById("prdName").value;
	
	if (isNullStr(prdName)) {
		alert('중분류를 입력해주세요.');
		return;
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdName"      : prdName,
		"prdMstCode"   : document.getElementById("prdMstList").value,
		"prdCode"      : prdCode
	};
	
	commonAjax.call("/prd/updateProduct", "POST", params, function(data){
		if (data.message == "OK") {
			alert('저장되었습니다.');
			
			popupClose();
			getProductList();
			getProductSubList(document.querySelector(`.prd li[data-code=${prdCode}]`));
		}
	});	
}

//대분류 추가 팝업 그리기(type - add:추가, delete:삭제)
function addMstPop(type, target) {
	if (type == "add") {
		const content = 
	        `<div class="popup-tit"><p>대분류 추가</p></div>
	        
	        <div class="popup-con" style="width:310px">
	        	<div>
	                <label class="need">대분류</label>
					<div class="add-mst">
						<input type="text" placeholder="대분류를 입력해 주세요.">
						<button type="button" class="add-prd-list dark-btn" onclick="addProductMst()">추가하기</button>
					</div>
	        	</div>
				
				<ul class="mst-list" id="listOrder"></ul>
			</div>

	        <div class="popup-btn">
	            <button type="button" class="save-btn blue-btn" onclick="saveProductMst()">저장하기</button>
	        </div>`;
		
	    commonDrawPopup("draw", content);	    
		commonSetDragDrop('#listOrder', ".sort", ""); //순서변경
		getProductMtList('popup');                   
	} else {
		if (isNullStr(target.parentElement.dataset.mst)) {
			//새로 추가된 대분류는 해당 요소만 지워준다. 
			target.parentElement.remove();
		} else {
			const mstCode = target.parentElement.dataset.mst;
			const mstName = target.parentElement.querySelector('input').value;			
			const content = 
		        `<div class="popup-tit"><p>대분류 삭제</p></div>
		        
		        <div class="popup-con mst-div" style="width:465px">
		        	<div class="del-mst">
		                <label class="need">대분류</label>
						<input type="text" class="mst-name" value="${mstName}" disabled>
						<input type="hidden" class="mst-code" value="${mstCode}">
		        	</div>
		        	
		        	<div class="select-del">
		        		<div>
		        			<input id="delEach" name="del_check" type="radio" class="rec-check" value="move" checked>
		        			<label for="delEach"></label>
		        			<div>
		        				${mstName}에서
								<div class="select-box">
							    	<select id="prdMstList"></select>
									<div class="icon-arrow"></div>	
								</div> 로 <bold>연결된 데이터를 옮긴 후 삭제</bold>								
		        			</div>
		        		</div>
		        		
		        		<div>
		        			<input id="delAll" name="del_check" type="radio" class="rec-check" value="delete">
		        			<label for="delAll"></label>
		        			<div><bold>바로삭제</bold> (<i>*</i> 연결된 데이터도 같이 삭제됩니다.)</div>
		        		</div>
		        	</div>
				</div>

		        <div class="popup-btn">
		            <button type="button" class="save-btn blue-btn" onclick="deleteProductMst()">삭제하기</button>
		        </div>`;
			
		    commonDrawPopup("draw", content);
			getProductMtList('add'); //대분류 가져오기
		}		
	}
}

//대분류 추가
function addProductMst() {
	const newMst  = document.querySelector(".add-mst input").value;
	const mstList = document.getElementById("listOrder");
	const li = mstList.lastChild.cloneNode(true);	

	mstList.appendChild(li);	
		
	mstList.lastChild.dataset.mst = "";
	mstList.lastChild.querySelector("input").value = newMst;
	document.querySelector(".add-mst input").value = "";
}

//대분류 저장
function saveProductMst() {	
	let dataList = new Array();
	
	document.querySelectorAll("#listOrder li").forEach(function(item) {
		let data = new Object();
		
		data.prdMstCode = item.dataset.mst;
		data.prdMstName = item.querySelector("input").value;
		
		dataList.push(data);
	});
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,	
		"officeCode"   : document.getElementById("officeCode").value,
		"productList"  : JSON.stringify(dataList)
	};
	
	commonAjax.call("/prd/updateProductMt", "POST", params, function(data){
		if (data.message == "OK") {
			alert("저장되었습니다.");
			
			popupClose();
		} else {
			alert(data.message);
		}		
	});	
}

//대분류 삭제
function deleteProductMst() {
	if (document.querySelector("[name='del_check']:checked").value == "move") {
		if (isNullStr(document.getElementById("prdMstList").value)) {
			alert("대분류를 선택해주세요.");
			return;
		}
	}	
		
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdMstCode"   : document.querySelector(".mst-code").value,
		"mPrdMstCode"  : document.getElementById("prdMstList").value,
		"deleteType"   : document.querySelector("[name='del_check']:checked").value
	};
	
	commonAjax.call("/prd/deleteProductMt", "POST", params, function(data){
		if (data.message == "OK") {
			alert("삭제되었습니다.");
			
			subPopupClose();
			getProductMtList('popup');
		} else {
			alert(data.message);
		}		
	});
}

//순서 변경 팝업
function popListOrder(){
	let content = 
        `<div class="popup-tit">
        	<div class="text">
            	<p>중분류 정렬</p>
            	<span>자유롭게 드래그 앤드 드롭으로 정렬할 수 있습니다.</span>
        	</div>
         </div>
         
         <div class="popup-con list" style="width:760px">
        	<div class="list-left">
        		<div class="list-tit">
        			<p>중분류 정렬</p>
    			</div>
    			
        		<div class="list-con">
        			<ul id="prdList" class="scroll list-style"></ul>
        		</div>
        	</div>
        	
        	<div class="list-right">
        		<div class="list-tit">
        			<p>소분류 정렬</p>
        			
        			<div class="btn-area">
        				<button type="button" onclick="sortList(this , 'name')">이름순</button>
        				<button type="button" onclick="sortList(this , 'price')">가격순</button>
        			</div>
        		</div>
        		
        		<div class="list-con">
        			<ul id="prdSubList" class="scroll list-style"></ul>
        		</div>
        	</div>
		</div>

        <div class="popup-btn">
            <button type="button" class="save-btn blue-btn" onclick="updateProductSortOrder()">저장하기</button>
        </div>`;
	
    commonDrawPopup("draw", content);
    
    //중분류 그리기
    const prdList = document.getElementById('prdList');
    document.querySelectorAll('ul.prd li').forEach((item) => {
    	prdList.innerHTML += `<li data-code="${item.dataset.code}" onclick="drawSortSubList('${item.dataset.code}')">${item.innerText}</li>`;
    		
    	if (item.classList.contains('active')) {
    		prdList.querySelector('li:last-child').classList.add('active');
    	}
    });
    
    drawSortSubList(prdList.querySelector('li.active').dataset.code);
    
	commonSetDragDrop('#prdList', "", '');    //중분류 순서변경
	commonSetDragDrop('#prdSubList', "", ''); //소분류 순서변경
}

//소분류 그리기
function drawSortSubList(prdCode){
	const prdList = document.querySelectorAll('#prdList li');
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdCode"      : prdCode
	};
	
	prdList.forEach(function(ele){
		ele.classList.remove('active');
		
		if (ele.dataset.code == prdCode) {
			ele.classList.add('active');	
		}
	});

	commonAjax.call("/prd/getProductSubList", "POST", params, function(data){
		if (data.message == "OK") {
		    const prdSubList = document.getElementById('prdSubList');
		    const result = data.resultList;

		    prdSubList.innerHTML = '';
		    
		    if (result.length > 0) {
			    for (let i = 0; i < result.length; i++) {
			    	prdSubList.innerHTML += 
			    		`<li data-sub="${result[i].prdSubCode}">
			    			<p>${result[i].prdSubName}</p>
							<span class="prd-price">${result[i].prdSubPrice}원</span>
						</li>`
			    }	
		    } else {
		    	prdSubList.innerHTML = '<div id="noSearch"><span>소분류가 없습니다.</span></div>';
		    }
		}
	});
}

//이름순 / 가격순 정렬
function sortList(target, sort) {
	const parent = target.closest('.list-tit').nextElementSibling.querySelector('ul');
	const li = parent.querySelectorAll('li');
	let arr = [];
	
	parent.innerHTML = '';
	
	li.forEach((ele) => {
		var beforeArr = new Object(); 
		
		beforeArr.name = ele.querySelector('p').innerText;
		beforeArr.price = ele.querySelector('span').innerText;
		beforeArr.sub = ele.dataset.sub;
		
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
			`<li data-sub="${item.sub}">
				<p>${item.name}</p>
				<span class="prd-price">${item.price}</span>
			</li>`;
	});
}

//순서변경 저장
function updateProductSortOrder(){
	const prdLi = document.querySelectorAll('#prdList li');
	var prdList = [];
	
	prdLi.forEach((ele) => {
		var prdArr = new Object(); 
		
		prdArr.prdCode = ele.dataset.code;

		prdList.push(prdArr);
	});
	
	const prdSubLi = document.querySelectorAll('#prdSubList li');
	var prdSubList = [];
	
	prdSubLi.forEach((ele) => {
		var prdSubArr = new Object(); 

		prdSubArr.prdSubCode = ele.dataset.sub;
		
		prdSubList.push(prdSubArr);
	});
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdList"     : JSON.stringify(prdList),
		"prdSubList"  : JSON.stringify(prdSubList)
	};

	commonAjax.call("/prd/updateProductSortOrder", "POST", params, function(data){
		if (data.message == "OK") {
			alert('저장되었습니다.');
			
			document.querySelector(".del-btn").click();

			getProductList();
		}
	});
}