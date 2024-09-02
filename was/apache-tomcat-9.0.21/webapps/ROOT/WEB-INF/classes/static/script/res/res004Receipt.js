//예약 접수 페이지
function newInit(){
	document.getElementById("isNew").value = 'Y';       
	getResNo();                                                   //신규 예약 번호 조회

	//예약경로 그리기
	const comboObj2 = {"target" : "resType", "code" : "RES001", "defaultOpt" : ""};			
	commonCodeList(comboObj2);
	
	//시술권 관리 
	getProductList();                                             //중분류 조회
	getUnusedUserProduct();                                       //남은 시술권 
	searchProduct('productField');                                //시술 검색 조회
	
	//당일 사용 시술 
	getUserInfoProductHistory()                                   //이전 시술권 사용 기록
	
	//예약 접수의 경우 버튼 활성화 (new)
	document.querySelector('.btn-area.confirm').classList.remove('active');
	document.querySelector('.btn-area.new').classList.add('active');
}

//신규 예약 번호 조회
function getResNo() {
	commonAjax.call("/res/getResNo", "POST", '' , function(data) {
		if (data.message == "OK") {	
			document.getElementById("resNo").value  = data.resNo;
		}
	});
}

//예약 확인 페이지
function originInit() {	
	//예약경로 그리기
	const comboObj2 = {"target" : "resType", "code" : "RES001", "defaultOpt" : ""};			
	commonCodeList(comboObj2);                     
	
	//회원 정보 & 시술권 관리 
	getProductList();                                               //중분류 조회
	getUserReserve();                                               //예약 상품 조회
	getUnusedUserProduct();                                         //남은 시술권 
	searchProduct('productField');                                  //시술 검색 조회
	
	//당일 사용 시술 
	getUserInfoProductHistory()                                     //이전 시술권 사용 기록
	
	//예약 확인의 경우 버튼 활성화 (confirm)
	document.querySelector('.btn-area.confirm').classList.add('active');
	document.querySelector('.btn-area.new').classList.remove('active');
}

//중분류 조회
function getProductList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
	};	

	commonAjax.call("/prd/getProductList", "POST", params, function(data) {
		const result = data.resultList;				
		let comboObj;
		
		if (data.message == "OK") {		
			let dataList = new Array();
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].prdCode;
		        data.name = result[idx].prdName;

				dataList.push(data);
			}
			
			if (subPop) {  //서비스 시술 팝업 열렸을 시
				comboObj = {"target" : "popProduct", "data" : dataList, "defaultOpt" : "중분류 선택"};		
			} else {
				comboObj = {"target" : "product", "data" : dataList, "defaultOpt" : "중분류 선택"};		
			}

			commonInitCombo(comboObj);		
		}
	});		
}	

//소분류 조회 
function getProductSubList() {
	let prdCode = document.getElementById('product').value;
	
	//서비스 시술에서 사용
	if (subPop) {
		prdCode = document.getElementById('popProduct').value;
	}

	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdCode"      : prdCode
	};	
	
	commonAjax.call("/prd/getProductSubList", "POST", params, function(data) {
		const result = data.resultList;
		let comboObj;
		
		if (data.message == "OK") {		
			let dataList = new Array();
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].prdSubCode;
		        data.name = result[idx].prdSubName;

				dataList.push(data);
			}
			
			if (subPop) {  //서비스 시술 팝업 열렸을 시
				comboObj = {"target" : "popProductSub", "data" : dataList, "defaultOpt" : "소분류 선택"};	
			} else {		
				comboObj = {"target" : "productSub", "data" : dataList, "defaultOpt" : "소분류 선택"};		
			}
			
			commonInitCombo(comboObj);
		}				
	});		
}

//남은 금액 조회 팝업 열기
function popUserPayment(){
	const parent = document.querySelector('.popup');	
	const div    = parent.querySelector('.amount-wrap');
	
	if (div.classList.contains('active')) {
		div.classList.remove('active');
	} else {
		div.classList.add('active');
		getUserPayment();
	}
}

//남은 금액 조회
function getUserPayment() {
	const parent = document.querySelector('.popup');	
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"userId"       : document.getElementById('userId').value
	};
	
	commonAjax.call("/res/getUserPayment", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			const div    = parent.querySelector('.amount-wrap ul');
			div.innerHTML = '';
			
			if (result.length > 0) {
				div.classList.add('active');
	
				for(let i = 0; i < result.length; i++){
					div.innerHTML += 
						`<li data-seq="${result[i].paySeq}">
							<div class="amount-list-top">
								<p>${result[i].createDate} - ${result[i].createUser}</p>
								
								<div class="amount-btn">
									<span onclick="getUpdateUserPayment(this)" data-type="${result[i].payType}">수정</span>
									<span onclick="deleteUserPayment(this)">삭제</span>
								</div>
							</div>
							
							<div class="amount-content">
								<span class="use-money">${Number(result[i].payAmount).toLocaleString('en')}</span> ${result[i].payType} - 남은 금액 : 
								<span class="remain-money">${Number(result[i].remainAmount).toLocaleString('en')}</span>
							</div>
						</li>`;		
				}
				document.getElementById('remainAmount').value = div.querySelector('li:last-child .remain-money').innerText;
			} else {
				div.classList.remove('active');
				document.getElementById('remainAmount').value = 0;
			}
		}
	});
}

//남은 금액 결제,차감
function insertUserPayment(payType) {
	let payAmount;
	if (payType == 1) {
		payAmount = document.querySelector('.addPayAmount');	
	} else {
		payAmount = document.querySelector('.delPayAmount');	
	}
	
	if (payType == -1) {
		if (document.querySelectorAll('.amount-list li').length == 0) {
			alert('결제된 금액이 없습니다. 결제 금액을 입력해 주세요.')
			return
		}
	}
	
	if (isNullStr(payAmount.value)) {
		alert('금액을 입력해주세요.');
		return;
	}
	
	if (payType == -1) {
		const remain = document.getElementById('remainAmount').value.replaceAll(',' , '');
		const pay    = payAmount.value.replaceAll(',' , '');
		
		if (Number(remain) < Number(pay)) {
			alert('사용된 금액이 결제된 금액보다 많습니다.');
			return;
		}
	}
	
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"userId"       : document.getElementById('userId').value,
		"payAmount"    : payAmount.value,
		"payType"      : payType
	};

	commonAjax.call("/res/insertUserPayment", "POST", params, function(data){
		if (data.message == "OK") {
			payAmount.value = null;
			getUserPayment();
		}
	});
}

//남은 금액 삭제
function deleteUserPayment(target){
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"userId"       : document.getElementById('userId').value,
		"paySeq"       : target.closest('li').dataset.seq
	};

	commonAjax.call("/res/deleteUserPayment", "POST", params, function(data){
		if (data.message == "OK") {
			getUserPayment();
		}
	});
}

//기존에 남은 금액 수정
function getUpdateUserPayment(target) {
	const useMoney = target.closest('li').querySelector('.use-money').innerText;
	const payType  = target.dataset.type;
	const paySeq   = target.closest('li').dataset.seq;
	
	if (payType == '사용') {
		document.querySelector('.delPayAmount').value = useMoney;	
		document.getElementById('delPayment').setAttribute('onClick',`updateUserPayment(${paySeq} , -1)`);
	} else {
		document.querySelector('.addPayAmount').value = useMoney;
		document.getElementById('addPayment').setAttribute('onClick',`updateUserPayment(${paySeq} , 1)`);
	}
}

//남은 금액 수정
function updateUserPayment(paySeq, payType) {
	let payAmount;
	if (payType == '-1') {
		payAmount = document.querySelector('.delPayAmount');
	} else {
		payAmount = document.querySelector('.addPayAmount');
	}
	
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"userId"       : document.getElementById('userId').value,
		"paySeq"       : paySeq,
		"payAmount"    : payAmount.value,
		"payType"      : payType
	};

	commonAjax.call("/res/updateUserPayment", "POST", params, function(data){
		if (data.message == "OK") {
			getUserPayment();
			
			if (payType == '-1') {
				document.getElementById('delPayment').setAttribute('onClick','insertUserPayment(-1)');	
				document.querySelector('.delPayAmount').value = null;
			} else {
				document.getElementById('addPayment').setAttribute('onClick','insertUserPayment(1)');	
				document.querySelector('.addPayAmount').value = null;
			}
		}
	});
}

//회원 예약 리스트 팝업
function popUserReserveHistory(){
	const content = 
        `<div class="popup-tit">
            <p>예약 내역 리스트 <span class="num reserve-history-count color">(0)</span></p>
        </div>
       
        <div class="popup-con reserve-history-wrap" style="width:890px">
			<ul class="reserve-history-list scroll"></ul>	
		</div>`;
	
	commonDrawPopup("draw", content);
	getUserReserveHistory();           //회원 예약 리스트 조회
}

//회원 예약 리스트 조회
function getUserReserveHistory(){
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"userId"       : document.getElementById('userId').value
	};

	commonAjax.call('/res/getUserReserveHistory', "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			const div    = document.querySelector('.reserve-history-list');
			
			if (result.length > 0) {
				document.querySelector('.reserve-history-count').innerText = '(' + result.length + ')';
				div.innerHTML = '';
				
				result.forEach((item) => {
					//예약 처리 상태 
					let type, typeName;
					
					if (item.visitStatus == 'N') {
						type = '';
						
						if (item.useStatus == 'N') {
							typeName = '예약 취소';
						} else {
							typeName = '예약 대기';	
						}												
					} else if (item.visitStatus == 'Y') {
						type     = 'confirm';
						typeName = '예약 확정';
					} else {
						type     = 'fin';
						typeName = '예약 마감(미발송)';
					}
					
					div.innerHTML +=
						`<li class="reserve-history-con ${type}">							
							<div class="reserve-left-con">
								<div class="reserve-history-btn">
									<span>${item.resType}</span>
									<span>${item.visitType}</span>
								</div>
								
								<div class="reserve-history-user">
									<p>${item.name}</p>
									<span>(${item.gender}/${item.age})</span>
									<small>${item.mobile.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, '$1-$2-$3')}</small>
								</div>
							
								<div class="reserve-history-date">
									<span>예약 신청일 : ${item.createDate}</span>
									<span>희망 예약일 : ${item.resDate}</span>
								</div>
								
								<ul class="reserve-history-product"></ul>
								
								<div class="reserve-history-bottom">
									<div class="check">
							            <input type="checkbox" class="round-check" ${item.adviceYn == 'Y' ? 'checked' : ''} disabled>
							            <label></label>
							            <label>시술 전 자세한 상담을 희망합니다.</label>
							        </div>
							        
							        <p>총 금액<bold>${item.totalPrice}원</bold></p>
								</div>
							</div>
							
							<div class="reserve-right-con">
								<div class="reserve-history-status">${typeName}</div>
							</div>
						</li>`
					
					const parent = document.querySelector('.reserve-history-con:last-child');
					
					//회원 등급 
					if (!isNullStr(item.gradeDisplay)) {
						if (item.gradeDisplay != '일반') {
							const grade = `<span class="grade" style="background-color:${item.gradeColor}; background-image:none">${item.gradeDisplay}</span>`;
							parent.querySelector('.reserve-history-btn').insertAdjacentHTML('afterbegin' , grade);
						}
					}
					
					//의료진 지정
					if (!isNullStr(item.fixedDoctorName) || !isNullStr(item.fixedStaffName)) {
						if (!isNullStr(item.fixedDoctorName) && !isNullStr(item.fixedStaffName)) {
							parent.querySelector('.reserve-history-btn').innerHTML += 
								`<span>의료진 지정 (${item.fixedDoctorName}, ${item.fixedStaffName})</span>`;
						} else{
							parent.querySelector('.reserve-history-btn').innerHTML += 
								`<span>의료진 지정 
									(${!isNullStr(item.fixedDoctorName) ? item.fixedDoctorName : ''}${!isNullStr(item.fixedStaffName) ? item.fixedStaffName : ''})
								 </span>`;
						}	
					}

					//병원 메모
					if (!isNullStr(item.hospitalNote)) {
						parent.querySelector('.reserve-right-con').innerHTML +=
							`<div class="reserve-history-memo">
								<span>병원 메모)</span>
								<p>${item.hospitalNote}</p>
							</div>`
					};
					
					//고객 요청 사항
					if (!isNullStr(item.resNote)) {
						parent.querySelector('.reserve-right-con').innerHTML +=
							`<div class="reserve-history-memo">
								<span>고객 요청사항)</span>
								<p>${item.resNote}</p>
							</div>`
					};
					
					//예약 상품 리스트
					const itemArr      = item.itemName.split("</p>");
					const itemPriceArr = item.itemPrice.split("\n");
					const child        = parent.querySelector('.reserve-history-product');
					
					for (let j = 0; j < itemArr.length ; j++) {
						if (!isNullStr(itemArr[j])) {
							if (nvlStr(itemPriceArr[j]) == "" || itemPriceArr[j] == 0) {	//남은 시술권
								child.innerHTML += `<li>${itemArr[j]}</p></li>`;	
							} else {
								child.innerHTML += `<li>${itemArr[j]}</p><span>${itemPriceArr[j]}원</span></li>`;
							}  	
						}  
					}
				});		
			} else {
				div.innerHTML = '<li id="noSearch">회원 예약 리스트가 없습니다.</li>';
			}
		}
	});
}

//삭제 시술권 확인 팝업
function popDeleteProductHistory() {
	const content = 
        `<div class="popup-tit">
        	<div class="text">
				<p>삭제된 남은 시술권 리스트 <span class="num reserve-delete-count color">(0)</span></p>
        		<span>삭제된 남은 시술권은 3개월이 지나면 자동으로 삭제됩니다.</span>	
        	</div>
        </div>
       
        <div class="popup-con product-delete-wrap" style="width:500px">
			<ul class="product-delete-list scroll"></ul>	
		</div>`;
	

	commonDrawPopup("draw", content);
	getDeleteProductHistory();        //삭제된 시술권 조회
}

//삭제된 시술권 조회
function getDeleteProductHistory() {     
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"userId"       : document.getElementById('userId').value
	};
	
	commonAjax.call("/res/getDeleteProductHistory", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			const div    = document.querySelector('.product-delete-list');
			
			if (result.length > 0) {
				div.innerHTML = '';

				result.forEach((item) => {	
					const itemTitleArr   = item.itemTitle.split('\n');
					const itemConfirmArr = item.confirmStatus.split('\n');
					const updateUserArr  = item.updateUser.split('\n');
					
					div.innerHTML +=
						`<li class="product-delete-con" data-code="${item.resGroupCode}" data-seq="${item.resGroupSeq}">
		    		        <div class="product-delete-history">
				        		<p class="product-delete-title"><span class="type">[${formatType(item.itemType)}]</span> ${item.productTitle}</p>	
				        		
				        		<div class="product-delete-user">	
				        			<div class="del-status">삭제</div>
				        			<label>${item.deleteUser}</label>
				        		</div>
		
								<ul class="product-delete-use"></ul>
		    		        </div>
		    		        
		    		        <div class="product-delete-btn">
		    		        	<button type='button' onclick="updateDeleteUserProduct(this)">완전 삭제</button>
		    		        	<button type='button' onclick="updateRestoreUserProduct(this)">메모 복구</button>
		    		        </div>
						</li>`;	
					
					for(let i = 0; i < itemTitleArr.length; i++) {
						div.querySelector('li:last-child .product-delete-use').innerHTML +=
							`<li>
								<div class="use-status">${itemConfirmArr[i] == 'Y' ? '사용' : '환불'}</div>
								<span>${itemTitleArr[i]} <br/> <label>${updateUserArr[i]}<label></span>
							</li>`;	
					}
				});
			} else {
				div.innerHTML = '<li id="noSearch">삭제된 남은 시술권이 없습니다.</li>';
			}
			
			//삭제된 시술권 리스트 갯수
			document.querySelector('.reserve-delete-count').innerText = '(' + document.querySelectorAll('.product-delete-con').length + ')';
		}
	});
}

//삭제된 시술권 완전 삭제
function updateDeleteUserProduct(target){	
	const parent  = target.closest('li');
	const itemSeq = parent.querySelectorAll('.product-delete-use li');
	let itemList  = new Array();

	itemSeq.forEach((ele) => itemList.push(ele.dataset.seq))
	
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : document.getElementById('resNo').value,
		"resGroupCode" : parent.dataset.code,
		"resGroupSeq"  : parent.dataset.seq,
		"itemList"     : JSON.stringify(itemList),
	};
	
	if (confirm('완전 삭제 하시겠습니까?')) {
		commonAjax.call("/res/updateDeleteUserProduct", "POST", params, function(data){
			if (data.message == "OK") {
				getDeleteProductHistory(); //삭제된 시술권 재조회
				getUnusedUserProduct();    //남은 시술권 재조회 	
			}
		});	
	}
}

//삭제된 시술권 복구 
function updateRestoreUserProduct(target){
	const parent = target.closest('li');
	let itemList = new Array();
	
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : document.getElementById('resNo').value,
		"resGroupCode" : parent.dataset.code,
		"resGroupSeq"  : parent.dataset.seq,
	};

	if (confirm('복구하시겠습니까?')) {
		commonAjax.call("/res/updateRestoreUserProduct", "POST", params, function(data){
			if (data.message == "OK") {
				getDeleteProductHistory(); //삭제된 시술권 재조회
				getUnusedUserProduct();    //남은 시술권 재조회 	
			}
		});	
	}
}

//시술 검색
function getProductItem() {
	let div        = document.querySelector('.reserve-search-result');
	let list       = document.querySelector('.reserve-insert-result');
	let prdCode    = document.getElementById('product').value;
	let prdSubCode = document.getElementById('productSub').value;
	let field      = document.getElementById('productField').value;
	let url        = 'getProductItem';
	let click      = 'insertUserReserveItem';
		
	if (subPop) {  //서비스 영역 검색
		div        = document.querySelector('.service-search-result');
		list       = document.querySelector('.service-insert-result');
		prdCode    = document.getElementById('popProduct').value;
		prdSubCode = document.getElementById('popProductSub').value;
		field      = document.getElementById('popProductField').value;
		url        = 'getServiceProductItem';
		click      = 'addUserServiceItem';
	}

	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"field"        : field,
		"prdCode"      : prdCode,
		"prdSubCode"   : prdSubCode
	};

	commonAjax.call(`/res/${url}`, "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			
			if (result.length > 0) {
				div.innerHTML  = "";
				
				for (let i = 0; i < result.length; i++) {
					div.innerHTML += 
						`<li data-code="${result[i].itemCode}" onclick="${click}(this)" class="${checkProductItem(result[i].itemCode , list)}">
							<p>${result[i].itemName}</p>
							<span>${result[i].itemPrice}원</span>
						</li>`;
				};
			} else {
				div.innerHTML = '<div class="no-pro">검색된 결과가 없습니다.</div>';
			}
		}
	});
}

//시술 검색 시 담은 시술은 활성화
function checkProductItem(code , area){
	const list = area.childNodes ;
	
	for (let i = 0; i < list.length; i++) {
		if (code == list[i].dataset.code) {
			return 'active';
		}
	};
	
	return '';
}

//시술 선택시 삽입
function insertUserReserveItem(target){
	if (!target.classList.contains('active')) {
		target.classList.add('active');
		
		const params = {
			"hospitalCode" : document.getElementById('hospitalCode').value,
			"officeCode"   : document.getElementById('officeCode').value,
			"resNo"        : document.getElementById('resNo').value,
			"resGroupCode" : target.dataset.code,
			"isNew"	  	   : document.getElementById('isNew').value,
		};

		commonAjax.call('/res/insertUserReserveItem', "POST", params, function(data){
			if (data.message == "OK") {
				getUserReserveItem();
			}
		});		
	}
}

//예약 상품 조회
function getUserReserveItem(){
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : document.getElementById('resNo').value,
		"isNew"	  	   : document.getElementById('isNew').value,
 	};

	commonAjax.call('/res/getUserReserveItem', "POST", params, function(data){
		if (data.message == "OK") {
			const itemList = data.resultList;
			drawUserReserve(itemList);
		}
	});
}

//예약 상품 초기 조회
function getUserReserve() {
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : document.getElementById('resNo').value		
	};
	
	commonAjax.call("/res/getUserReserve", "POST", params, function(data){
		if (data.message == "OK") {
			const infoList = data.result.info;
			const itemList = data.result.item;
			
			//회원 정보
			document.getElementById("userId").value = nvlStr(infoList.userId);
			document.getElementById("name").value   = nvlStr(infoList.name);
			document.getElementById("mobile").value = nvlStr(infoList.mobile).replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
			document.getElementById("remainAmount").value = nvlStr(infoList.remainAmount);
			document.getElementById("reserveDate").value  = nvlStr(infoList.resDate);
			document.getElementById("reserveTime").value  = nvlStr(infoList.resTime.substr(0,2)) + ':' + nvlStr(infoList.resTime.substr(2,4));
			document.getElementById("resNote").value      = nvlStr(infoList.resNote);
			document.getElementById("adviceYn").checked   = infoList.adviceYn == "Y" ? true : false;
			document.getElementById("hospitalNote").value = nvlStr(infoList.hospitalNote);
			
			//예약 상품 조회
			drawUserReserve(itemList);
		}
	}); 
}

//예약 상품 그리기
function drawUserReserve(itemList){
	const div   = document.querySelector('.reserve-insert-result');
	const resNo = document.getElementById('resNo').value;	
	const isNew = document.getElementById("isNew").value;

	let i     = -1;
	let maxId = getSeqMax('id');
	
	//같은 시술이 들어가 있으면 배열에서 제거 
	div.querySelectorAll('li.pro-con').forEach((ele) => {
		i++;
		itemList = itemList.filter((item) => item.resGroupCode !== ele.dataset.code);
	});
	
	itemList.forEach((item) => {
		let temp;
		const itemTitleArr  = item.prdItemName.split('\n');
		const itemCodeArr   = item.prdItemCode.split('\n');
		const itemSeqArr    = item.itemSeq.split('\n');
		const itemPrice     = item.itemPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
		const itemPriceArr  = item.prdItemPrice.split('\n');
		const serviceArr    = item.serviceYn.split('\n');
		const itemType      = formatType(item.itemType);
		const crmSendCntArr = item.crmSendCnt.split('\n');
		const crmSendYnArr  = item.crmSendYn.split('\n');
		
		if (item.groupTitle == 'Y') {
			temp = document.createElement('li');
			temp.classList.add('pro-con');
			temp.dataset.resno = resNo;
			temp.dataset.code  = item.resGroupCode;
			temp.dataset.type  = item.itemType;
			temp.dataset.seq   = item.resGroupSeq;
			temp.innerHTML =
				`<div class="reserve-result-top">                                                        
					<div class="reserve-left-area">
						<div class="type-status">${itemType}</div>
						<p class="pro-tit">${item.productTitle}</p>							
					</div>
					<div class="option-btn-area">
						<button type='button' class="service-btn" onclick="popServicePro(this)">서비스</button>
						<button type='button' class="delete-btn" onclick="deleteUserReserveItem(this)"></button>
					</div>
				</div>
					
				<ul class="reserve-result-select"></ul>
				<ul class="reserve-child-select"></ul>     
				
				<span class="reserve-price">금액 : <b>${itemPrice}</b>원</span>`;
			
			//초기 조회가 아닐경우 상단 추가
			if (itemList.length == 1) {
				div.prepend(temp);
				i = 0;
			} else {
				div.append(temp);
				i++;
			}
			
			if (item.itemType == 'C') {
				document.querySelectorAll('.reserve-child-select')[i].style.display = 'block';
				div.querySelectorAll('p.pro-tit')[i].insertAdjacentHTML(
						'beforeend' , `<span>(포인트: <bold>0</bold>/<bold>${item.maxCnt}</bold>)</span>`
				);		
			}	
		}
	
		if (item.itemType == 'N' || item.itemType == 'E') {
			const content = div.querySelectorAll('.reserve-result-select')[i];
			
			//서비스 시술의 seq를 제외한 seq 생성
			let seq = [];
			for (let j = 0; j < serviceArr.length; j++){
				serviceArr[j] == 'N' ? seq.push(itemSeqArr[j]) : '';
			}
			
			for (let j = 0; j < serviceArr.length; j++){
				maxId++;
				
				let eventSeq = serviceArr[j] == 'N' ? item.itemSeq.replaceAll('\n' , ',') : itemSeqArr[j];	
				
				if (j == '0' || serviceArr[j] == 'Y') {
					temp = document.createElement('li');
					temp.innerHTML = 
						`<div class="check">
				            <input type="checkbox" id="reserve-${maxId}" class="rec-check items" data-seq="${seq.toString()}" data-yn="${crmSendYnArr[j]}">
				            <label for="reserve-${maxId}"></label>
				            <label for="reserve-${maxId}"><p>${j == 0 ? item.itemTitle : itemTitleArr[j]}</p></label>
				        </div>`;		
					content.append(temp);
				
					if (serviceArr[j] == 'Y') {
						content.querySelector('li:last-child').classList.add('service');
						content.querySelector('li:last-child').querySelector('input').dataset.seq = itemSeqArr[j];
						
						const service = content.querySelector('li:last-child').querySelector('label:last-child');
						service.insertAdjacentHTML('afterbegin' , '<div class="service-status">서비스</div>');
						service.innerHTML += `<span class="change-amount">(${itemPriceArr[j]} → 0)</span>`;	
					}
				} 
			}
		}
		
		if (item.itemType == 'P') {
    		maxId++;
			const content = div.querySelectorAll('.reserve-result-select')[i];
			content.classList.add('package');
			
			const checkCrmChild  = crmSendYnArr.filter(element => 'Y' === element).length;  //사용한 자식시술의 총합(crm 전송)
		
			temp = document.createElement('li');
			temp.innerHTML =
				`<div class="check">
		            <input type="checkbox" class="rec-check" id="reserve-pack-${maxId}"
						   ${isNew == 'Y' && itemTitleArr.length == checkCrmChild ? 'checked = "true"' : ''}>
		            <label for="reserve-pack-${maxId}"></label>
		            <label for="reserve-pack-${maxId}" class="package-label">${item.itemTitle}</label>
		        </div>
		        
		        <ul class="pro-result-con package"></ul>`;
			content.append(temp);
				
			for (let j =0; j < itemTitleArr.length; j++) {
				const child = content.querySelector('li:last-child > ul');
				maxId++;
				
				temp = document.createElement('li');
				temp.classList.add('con');
				temp.innerHTML = 
	        		`<div class="check">
			            <input type="checkbox" class="rec-check items" id="reserve-${maxId}" data-seq="${itemSeqArr[j]}" data-yn="${crmSendYnArr[j]}">
			            <label for="reserve-${maxId}"></label>
			            <label for="reserve-${maxId}"><p>${itemTitleArr[j]}</p></label>
			        </div>`;	
				child.append(temp);
				
				if (serviceArr[j] == 'Y') {
					child.querySelector('li:last-child').classList.add('service');
					
					const service = child.querySelector('li:last-child').querySelector('label:last-child');
					service.insertAdjacentHTML('afterbegin' , '<div class="service-status">서비스</div>');
					service.innerHTML += `<span class="change-amount">(${itemPriceArr[j]} → 0)</span>`;
				}
			}
		}
			
		if (item.itemType == 'C') {			
			const content = div.querySelectorAll('.reserve-result-select')[i];
			content.classList.add('count');
			
			temp = document.createElement('li');
			temp.innerHTML += 
				`${item.itemTitle}
				<ul class="pro-result-con count" data-cnt="${item.deductCnt}"></ul>`;		
			content.append(temp);
			
        	for (let j = 0; j < itemTitleArr.length; j++){
				if (serviceArr[j] == 'N') {
					content.querySelector('li:last-child > .pro-result-con').innerHTML += 
						`<span class="items" data-seq="${itemSeqArr[j]}" data-yn="${crmSendYnArr[j]}" data-cnt="${crmSendCntArr[j]}">
							${itemTitleArr[j]}
						</span>`;		
				} else {
	        		maxId++;
					document.querySelectorAll('.reserve-child-select')[i].style.display = 'block';
					
					temp = document.createElement('li');
					temp.innerHTML =
						`<li class="service">
						    <div class="check">
						        <input type="checkbox" class="rec-check items" id="reserve-${maxId}" data-seq="${itemSeqArr[j]}" data-yn="${crmSendYnArr[j]}">
						        <label for="reserve-${maxId}"></label>
						        <label for="reserve-${maxId}">
        							<div class="service-status">서비스</div>
						        	<p>${itemTitleArr[j]}</p>
						        	<span class="change-amount">(${itemPriceArr[j]} → 0)</span>
					        	</label>
						    </div>
						</li>`;
					document.querySelectorAll('.reserve-child-select')[i].append(temp);
				}
        	}
		}
	});
	
	addCountPro('pro-result-con' , 'reserve-child-select');          //차감 시술 추가하기
	allCheck('reserve-result-select')                                //패키지 전체 시술 체크
	
	//총 시술 갯수와 가격 
	const total = calTotalPrice('.reserve-price > b');
	document.getElementById('totalCount').innerHTML = `${document.querySelectorAll('.reserve-price').length}`;
	document.getElementById('totalPrice').innerHTML = `${total}원`;
}

//예약 상품 삭제
function deleteUserReserveItem(target){
	const parent    = target.closest('li.pro-con');
	const todayList = document.querySelectorAll('.today-use-con li');
	
	//검색된 리스트의 값 삭제
	const selectProduct = document.querySelector(`.reserve-search-result li[data-code='${parent.dataset.code}']`);
	if (!isNullStr(selectProduct)) {
		selectProduct.classList.remove('active');
	}
	
	//당일 사용할 시술권에 있는 상품 삭제
	for(let i = 0; i < todayList.length; i++) {
		if (parent.dataset.code == todayList[i].dataset.code) {
			todayList[i].remove();
			break;
		}
	}
	
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : document.getElementById('resNo').value,
		"resGroupCode" : parent.dataset.code,
		"isNew"	  	   : document.getElementById('isNew').value,
	};

	commonAjax.call('/res/deleteUserReserveItem', "POST", params, function(data){
		if (data.message == "OK") {
			parent.remove();       //해당 시술 삭제
			checkEmptyTodayList(); //당일 사용할 시술권이 없을때
			
			//총 시술 갯수와 가격 
			const total = calTotalPrice('.reserve-price > b');
			document.getElementById('totalCount').innerHTML = `${document.querySelectorAll('.reserve-price').length}`;
			document.getElementById('totalPrice').innerHTML = `${total}원`;
		}
	});
}

//시술 총 가격 계산
function calTotalPrice(target){
	const price = document.querySelectorAll(`${target}`);
	let total   = 0;

	price.forEach((item) => {		
		total = total + Number(item.innerText.replaceAll(',','').replaceAll('원',''))
	});
	
	return commonMoneyFormat(total);
}

//사용한 예약 시술권의 금액 계산
function calProductPrice(){
	const usedPrice = document.querySelectorAll('.reserve-price.used');
	let usedTotal   = 0;
	
	usedPrice.forEach((item) => {
		usedTotal = Number(usedTotal) + Number(item.querySelector('b').innerText.replaceAll(',' , ''));
	});
	
	return usedTotal;
}

//시술 가격 할인 버튼 선택
function calServicePrice(target) {	
	if (target.classList.contains('active')) {
		target.classList.remove('active');	
	} else {
		document.querySelectorAll('.discount-btn button').forEach((ele) => {
			ele.classList.remove('active');
		});
		
		target.classList.add('active');
	}
}

//남은 시술권 그리기
function getUnusedUserProduct() {
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"userId"       : document.getElementById('userId').value,
		"resNo"		   : document.getElementById('resNo').value	
	};
	
	commonAjax.call("/res/getUnusedUserProduct", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			const div    = document.querySelector('.product-insert-result');
			
			if (result.length > 0) {
				let i     = -1;
				let maxId = getSeqMax('id');
				
				div.innerHTML = `<div class="note-div"></div><div class="msg-div"></div>`;
				
				result.forEach((item) => {
					const itemTitleArr  = item.prdItemName.split('\n');
					const itemPriceArr  = item.prdItemPrice.split('\n');
					const itemSeqArr    = item.itemSeq.split('\n');
					const refundArr     = item.refundAmount.split('\n');
					const serviceArr    = item.serviceYn.split('\n');
					const itemType      = formatType(item.itemType);
					const confirmArr    = item.confirmStatus.split('\n');
					const crmSendCntArr = item.crmSendCnt.split('\n');
					const crmSendYnArr  = item.crmSendYn.split('\n');
			        
			        if (item.groupTitle == 'Y') {
						div.innerHTML += 
							`<li class="pro-con" 
								data-resno="${item.resNo}" data-code="${item.resGroupCode}" 
								data-type="${item.itemType}" data-seq="${item.resGroupSeq}">
								<div class="product-result-top">                      
									<div class="product-left-area">                                                     
										<div class="home-option-btn">
											<button type='button' class='note-btn hide ${item.noteYn == 'Y' ? 'active' : ''}' onclick="popUserProductNote(this)"></button>
											<button type='button' class='memo-btn hide ${item.messageYn == 'Y' ? 'active' : ''}' onclick="popUserProductMessage(this)"></button>
										</div>
									
										<div class="type-status">${itemType}</div>
										<p class="pro-tit">${item.productTitle}</p>							
									</div>
										
									<div class="option-btn-area">
										<button type='button' class="refund-btn" onclick="popRefundPro(this)">환불</button>
										<button type='button' class="service-btn" onclick="popServicePro(this)">서비스</button>
										<button type='button' class="delete-btn" onclick="updateUserProductDelete(this)"></button>
									</div>
								</div>
								
								<span class="product-price">금액 : <b>${item.productPrice}</b>원</span>
								
								<ul class="product-result-select"></ul>    
								<ul class="product-child-select"></ul> 
							</li>`;	
						
						i++;
						if (item.itemType == 'C') {
							div.querySelectorAll('p.pro-tit')[i].insertAdjacentHTML(
									'beforeend' , `<span>(포인트: <bold>${Number(item.totalDeductCnt) + Number(item.refundCnt)}</bold>/<bold>${item.maxCnt}</bold>)</span>`
							);	
							
							if (item.refundCnt > 0) {
								document.querySelectorAll('.product-child-select')[i].style.display = 'block';
								document.querySelectorAll('.product-child-select')[i].innerHTML +=
									`<li>
									    <div class="check">
			    					    	<input type="checkbox" id="refund-0" class="rec-check items">
									    	<label for="refund-0" class="hide-label"></label>
									    	<label for="refund-0">
    											<div class="refund-status">환불</div>
									    		<p>${item.refundAmount}</p>
									    	</label>
									    </div>
									</li>`;	
							}
						}
			        }
			        
			        const content = document.querySelectorAll('.product-result-select')[i];
					if (item.itemType == 'N' || item.itemType == 'E') {
						for (let j = 0; j < serviceArr.length; j++){
							maxId++;
							
							//서비스 시술의 seq를 제외한 seq 생성
							let seq = [];
							serviceArr[j] == 'N' ? seq.push(itemSeqArr[j]) : '';

							if (j == '0' || serviceArr[j] == 'Y') {
								content.innerHTML += 
									`<li>
										<div class="check">
								            <input type="checkbox" id="reserve-${maxId}" class="rec-check items" 
								               data-seq="${seq.toString()}" data-yn="${crmSendYnArr[j]}" ${confirmArr[j] == 'Y' ? 'checked="true"' : ''}>
								            <label for="reserve-${maxId}"></label>
								            <label for="reserve-${maxId}"><p>${j == 0 ? item.itemTitle : itemTitleArr[j]}</p></label>
								        </div>
									</li>`;		
							
								if (serviceArr[j] == 'Y') {
									content.querySelector('li:last-child').classList.add('service');
									content.querySelector('li:last-child').querySelector('input').dataset.seq = itemSeqArr[j];
									
									const service = content.querySelector('li:last-child').querySelector('label:last-child');
									service.insertAdjacentHTML('afterbegin' , '<div class="service-status">서비스</div>');
									service.innerHTML += `<span class="change-amount">(${itemPriceArr[j]} → 0)</span>`;	
								}
							} 
						}
					};
			        
			        if (item.itemType == 'P') {
		        		maxId++;
						content.classList.add('package');
						
						const checkUseChild  = confirmArr.filter(element => 'Y' === element).length;    //사용한 자식시술의 총합
						const checkCrmChild  = crmSendYnArr.filter(element => 'Y' === element).length;  //사용한 자식시술의 총합(crm 전송)
						
			        	content.innerHTML += 
			        		`<li data-seq="${item.groupSeq}">
			        			<button type='button' class='memo-btn hide ${item.messageYn == 'Y' ? 'active' : ''}' onclick="popUserProductMessage(this)"></button>
				        		<div class="check">
						            <input type="checkbox" class="rec-check" id="product-pack-${maxId}" 
						            	   ${itemTitleArr.length == checkUseChild ? 'checked = "true"' : ''}
						            	   ${isNew == 'Y' && itemTitleArr.length == checkCrmChild ? 'checked = "true"' : ''} >
						            <label for="product-pack-${maxId}"></label>
						            <label for="product-pack-${maxId}" class="package-label">${item.itemTitle}</label>
						        </div>
						        
						        <ul class="last-child-con package"></ul>
					        </li>`;
			        	
						for (let j = 0; j < itemTitleArr.length; j++) {
							maxId++;
							const child    = content.querySelector('li:last-child > ul');
							const labelFor = refundArr[j] != '0' ? 'refund-0' : `product-${maxId}`;
							
							child.innerHTML += 
				        		`<li class="con">
							        <div class="check">
							            <input type="checkbox" class="rec-check items" id="${labelFor}" 
							                   data-seq="${itemSeqArr[j]}" data-yn="${crmSendYnArr[j]}" ${confirmArr[j] == 'Y' ? 'checked="true"' : ''}>
							            <label for="${labelFor}"></label>
							            <label for="${labelFor}"><p>${itemTitleArr[j]}</p></label>
							        </div>
								</li>`;	
							
							if (serviceArr[j] == 'Y') {
								child.querySelector('li:last-child').classList.add('service');
								
								const service = child.querySelector('li:last-child').querySelector('label:last-child');
								service.insertAdjacentHTML('afterbegin' , '<div class="service-status">서비스</div>');
								service.innerHTML += `<span class="change-amount">(${itemPriceArr[j]} → 0)</span>`;
							}
							
							if (refundArr[j] != '0') {
								const refund = child.querySelector('li:last-child').querySelectorAll('label');
								refund[1].insertAdjacentHTML('afterbegin' , '<div class="refund-status">환불</div>');
								refund[1].innerHTML += `<span class="change-amount">(-${refundArr[j]})</span>`;
								refund[0].classList.add('hide-label');
							}
						}
			        }
			        
			        if (item.itemType == 'C') {
						content.classList.add('count');
			        	content.innerHTML += 
			        		`<li>
								${item.itemTitle}
								<ul class="last-child-con count" data-cnt="${item.deductCnt}"></ul>
							</li>`;
			        	
			        	for (let j = 0; j < itemTitleArr.length; j++){
			        		maxId++;
							const HTML = 
								`<li>
								    <div class="check">
								        <input type="checkbox" class="rec-check items" id="product-${maxId}" 
								               data-seq="${itemSeqArr[j]}" data-yn="${crmSendYnArr[j]}" ${confirmArr[j] == 'Y' ? 'checked="true"' : ''}>
								        <label for="product-${maxId}"></label>
								        <label for="product-${maxId}">
								        	<p>${itemTitleArr[j]}</p>
							        	</label>
								    </div>
								</li>`;

							if (serviceArr[j] ==  'N') {                                                //차감 상품 리스트
								content.querySelector('li:last-child > .last-child-con').innerHTML += 
									`<span class="items" data-seq="${itemSeqArr[j]}" data-yn="${crmSendYnArr[j]}" data-cnt="${crmSendCntArr[j]}">
											${itemTitleArr[j]}
									</span>`;		
							}
							
							if (confirmArr[j] == 'Y' || serviceArr[j] ==  'Y') {                        //사용된 남은 시술권
								const usedList = document.querySelectorAll('.product-child-select')[i];
								
								usedList.style.display = 'block';
								usedList.innerHTML += HTML;
								
								if (serviceArr[j] ==  'Y') {                                            //서비스 시술 추가
									usedList.querySelector('li:last-child').classList.add('service');
									
									const service = usedList.querySelector('li:last-child').querySelector('label:last-child');
									service.insertAdjacentHTML('afterbegin' , '<div class="service-status">서비스</div>');
									service.innerHTML += `<span class="change-amount">(${itemPriceArr[j]} → 0)</span>`;
								} else {                                                                //사용한 시술 리스트에서 체크 및 계산
									const active   = content.querySelector(`li:last-child span[data-seq="${itemSeqArr[j]}"]`);
									const totalCnt = div.querySelectorAll('p.pro-tit')[i].querySelectorAll('bold')[0];
										
									active.classList.add('active');
									totalCnt.innerText = Number(totalCnt.innerText) + Number(active.closest('ul').dataset.cnt);
								} 
							}
			        	}
			        }
				});
			} else {
				div.innerHTML = '<li id="noSearch">남은 시술권이 없습니다.</li>';
			}

        	addCountPro('last-child-con' , 'product-child-select');            //차감 시술 추가하기 
        	allCheck('product-result-select');                                 //패키지 전체 시술 체크
        	
        	if (document.getElementById("isNew").value == 'N') {               //신규 예약이 아닐 경우에만 CRM 저장 건 시술권 추가	
				checkSendYn();
        	}
		}
	});
}

//CRM 저장 건 당일 사용할 시술권 추가
function checkSendYn() {
	const li  = document.querySelectorAll('li.pro-con');
	let count = 0; 
	
	li.forEach((item) => {
		const type   = item.dataset.type;
		let product , service;
		
		if (type != 'C') {
			product = item.querySelectorAll('input[data-yn="Y"]');
			product.forEach((ele) => {
				ele.checked = true;
				count++;
			});
		} else {
			product      = item.querySelectorAll('span[data-yn="Y"]');
			service      = item.querySelectorAll('input[data-yn="Y"]');
			const useCnt = item.querySelectorAll('.pro-tit bold')[0];
				
			product.forEach((ele) => {
				for(let i = 0; i < ele.dataset.cnt; i++) {
					//1) 남은 시술권일 경우 해당 차감 포인트 삭제
					if (item.closest('ul').className == 'product-insert-result') {
						useCnt.innerText = Number(useCnt.innerText) - ele.closest('ul').dataset.cnt; 
					}
					
					//2) 임시저장된 값 클릭
					ele.click();
					count++;
				}
			});
			
			service.forEach((ele) => {
				ele.click();
				count++;
			})
		}
	});

	//당일 사용할 시술권에 추가
	if (count > 0) {
		drawTodayUsePro();
		document.querySelector('button.save-crm').dataset.status = true;  //당일 사용할 시술권의 상태가 변경   
	}
}

//남은 시술권 삭제
function updateUserProductDelete(target) {
	const parent    = target.closest('li.pro-con');
	const todayList = document.querySelectorAll('.today-use-con li');
	let itemList    = new Array();
	let child;
	
	if (parent.dataset.type == 'C') {
		child = parent.querySelectorAll('.product-result-select span');
		child.forEach((item) => {
			itemList.push(item.dataset.seq);
		});	
	} else {
		child = parent.querySelectorAll('input');
		child.forEach((item) => {
			if (!item.id.includes('pack')){
				itemList.push(item.dataset.seq);
			}
		});	
	}
	
	if (confirm('삭제하시겠습니까?')) {
		//당일 사용할 시술권에 있는 상품 삭제
		for(let i = 0; i < todayList.length; i++) {
			if (parent.dataset.code == todayList[i].dataset.code) {
				todayList[i].remove();
				break;
			}
		}
		
		const params = {
			"hospitalCode" : document.getElementById('hospitalCode').value,
			"officeCode"   : document.getElementById('officeCode').value,
			"userId"       : document.getElementById("userId").value,
			"itemList"     : itemList.toString()
		};

		commonAjax.call("/res/updateUserProductDelete", "POST", params, function(data){
			if (data.message == "OK") {
				getUnusedUserProduct();  //남은 시술권 재조회
				checkEmptyTodayList();   //당일 사용할 시술권이 없을때
			}
		});	
	}
}

//남은 시술권 메모 팝업
function popUserProductNote(target){
	const parent  = target.closest('li.pro-con');
	const listDiv = document.querySelector('.product-insert-result');
	const content = document.querySelector('.note-div');

	content.innerHTML = 
		`<input type='hidden' id="resGroupCode" value="${parent.dataset.code}"/>
		 <input type='hidden' id="resGroupSeq" value="${parent.dataset.seq}"/>
		 <input type='hidden' id="memoResno" value="${parent.dataset.resno}"/>
		 <div class="note-wrap active hide alert">
  			<ul class="note-list scroll"></ul>
  			
   			<div class="note-write">
   				<textarea placeholder="남은시술권 메모를 입력해 주세요." id="noteContent"></textarea>
   				
   				<div class="note-write-btn">
   					<button type="button" class="blue-btn" id="noteSave" onclick="updateUserProductNote()">저장</button>
   					<button type="button" class="white-btn" onclick="closeOptionPop(this)">닫기</button>
   				</div>
   			</div>
   		 </div>`;
	
	//메모 팝업 위치 설정
	const top  = parent.offsetTop + 35;
	const left = parent.offsetLeft + 10;

	document.querySelector('.note-wrap').style.top  = top  + 'px';
	document.querySelector('.note-wrap').style.left = left + 'px';
	
	getUserProductNote(); //남은 시술권 메모 조회
}

//남은 시술권 메모 저장
function updateUserProductNote(noteSeq) {
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : document.getElementById('memoResno').value,
		"resGroupCode" : document.getElementById('resGroupCode').value,
		"resGroupSeq"  : document.getElementById('resGroupSeq').value,
		"content"      : document.getElementById('noteContent').value,
		"noteSeq"      : noteSeq
	};

	commonAjax.call("/res/updateUserProductNote", "POST", params, function(data){
		if (data.message == "OK") {
			getUserProductNote();  //남은 시술권 메모 재조회
			document.getElementById('noteContent').value = null;
			document.getElementById('noteSave').setAttribute('onClick',`updateUserProductNote()`);
		}
	});
}

//남은 시술권 메모 조회
function getUserProductNote(){
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : document.getElementById('memoResno').value,
		"resGroupCode" : document.getElementById('resGroupCode').value,
		"resGroupSeq"  : document.getElementById('resGroupSeq').value,
	};
	
	commonAjax.call("/res/getUserProductNote", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			const parent = document.querySelector(`.product-insert-result li[data-code="${params.resGroupCode}"]`);
			const div    = document.querySelector('.note-list');
			
			if (result.length > 0) {
				parent.querySelector('.note-btn').classList.add('active');
				div.classList.add('active');
				div.innerHTML = '';
				
				for (let i = 0; i < result.length; i++) {
					div.innerHTML +=
						`<li data-seq="${result[i].noteSeq}">
							<div class="note-list-top">
								<p>${result[i].createDate} - ${result[i].createUser}</p>
								
								<div class="note-btn">
									<span onclick="editUserProductMessage(this)">수정</span>
									<span onclick="deleteUserProductNote(this)">삭제</span>
								</div>
							</div>
							
							<div class="note-content">${result[i].content}</div>
						</li>`;
				};
			} else {
				parent.querySelector('.note-btn').classList.remove('active');
				div.classList.remove('active');
			}
		}
	});
}

//남은 시술권 메모 삭제 
function deleteUserProductNote(target){
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : document.getElementById('memoResno').value,
		"resGroupCode" : document.getElementById('resGroupCode').value,
		"resGroupSeq"  : document.getElementById('resGroupSeq').value,
		"noteSeq"      : target.closest('li').dataset.seq
	};

	commonAjax.call("/res/deleteUserProductNote", "POST", params, function(data){
		if (data.message == "OK") {
			getUserProductNote();  //남은 시술권 메모 재조회
		}
	});
}

//남은 시술권 메모 수정
function editUserProductMessage(target){
	const parent  = target.closest('li');
	const noteSeq = parent.dataset.seq;
	
	document.getElementById('noteContent').value = parent.querySelector('.note-content').innerText;
	document.getElementById('noteSave').setAttribute('onClick',`updateUserProductNote(${noteSeq})`);
}

//홈페이지 메세지 팝업
function popUserProductMessage(target) {
	const parent  = target.closest('li.pro-con');
	const type    = parent.dataset.type;
	const listDiv = document.querySelector('.product-insert-result');
	const content = document.querySelector('.msg-div');
	const seq     = type != 'P' ? groupSeq = '1' : groupSeq = target.closest('li').dataset.seq;
	
	target.classList.add('memo-show');
	
	content.innerHTML = 
		`<input type='hidden' id="resGroupCode" value="${parent.dataset.code}"/>
		 <input type='hidden' id="msgResno" value="${parent.dataset.resno}"/>
		 <input type='hidden' id="resGroupSeq" value="${parent.dataset.seq}"/>
		 <div class="msg-wrap active hide alert">
        	<textarea type="text" id="msgContent" placeholder="홈페이지와 연동시킬 메모를 입력해 주세요."></textarea>
        	
			<div class="msg-write-btn">
				<button type="button" class="blue-btn" onclick="updateUserProductMessage('${seq}')">저장</button>
				<button type="button" class="white-btn" onclick="closeOptionPop(this)">닫기</button>
			</div>
		 </div>`;
	
	//메세지 팝업 위치 설정
	const top  = target.offsetTop + target.closest('li.pro-con').offsetTop + 25;
	const left = target.offsetLeft;
	
	document.querySelector('.msg-wrap').style.top  = top  + 'px';
	document.querySelector('.msg-wrap').style.left = left + 'px';
	
	getUserProductMessage(`${seq}`); //홈페이지 메세지 조회
}

//홈페이지 메세지 조회
function getUserProductMessage(groupSeq){
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : document.getElementById('msgResno').value,
		"resGroupCode" : document.getElementById('resGroupCode').value,
		"resGroupSeq"  : document.getElementById('resGroupSeq').value,
		"groupSeq"     : groupSeq
	};

	commonAjax.call("/res/getUserProductMessage", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			
			if (result.length > 0) {
				document.getElementById('msgContent').value = result[0].content;
			}
		}
	});
}

//홈페이지 메세지 저장
function updateUserProductMessage(groupSeq){
	const msgContent = document.getElementById('msgContent').value;
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : document.getElementById('msgResno').value,
		"resGroupCode" : document.getElementById('resGroupCode').value,
		"resGroupSeq"  : document.getElementById('resGroupSeq').value,
		"content"      : msgContent,
		"groupSeq"     : groupSeq
	};
	
	commonAjax.call("/res/updateUserProductMessage", "POST", params, function(data){
		if (data.message == "OK") {
			const button = document.querySelector('button.memo-btn.memo-show');
			
			if (!isNullStr(msgContent)) {
				button.classList.add('active');
			} else {
				button.classList.remove('active');
			}
			
			button.classList.remove('memo-show');                          //버튼 상태값 초기화
			document.querySelectorAll('.msg-write-btn button')[1].click(); //저장 후 닫기 
		}
	});
}

//메모 팝업 닫기 
function closeOptionPop(target){
	target.closest('.active').remove();
	target.parentElement.parentElement.innerHTML = '';
	
	const button = document.querySelectorAll('button.memo-btn');
	button.forEach((ele) => ele.classList.remove('memo-show'));
}

/**
 * 당일 시술권 사용 데이터 체크
 * @param {String} target - 타겟이 있는 영역 
 */
function checkTodayData(target){
	const list    = document.querySelector(`.${target}`);
	let listArr   = new Array();
	let groupCode = 0;
	let inputs    = list.querySelectorAll('input[type="checkbox"]:checked');
	
	inputs.forEach((ele) => {
		const parent       = ele.closest('li.pro-con');
		const itemType     = parent.dataset.type;
		const itemTitleSub = ele.closest('ul').previousElementSibling.querySelector('.package-label');

		if (!ele.id.includes('pack')) {
	        let data = new Object();
	        data.groupCode    = parent.dataset.code;
	        data.itemType     = itemType;
	        data.itemTitle    = parent.querySelector('.pro-tit').innerHTML;
	        data.itemTitleSub = isNullStr(itemTitleSub) ? '' : itemTitleSub.innerHTML;
	       
			const content     = ele.closest('ul');
			const childInputs = content.querySelectorAll('input:checked');
			
			let itemTitleArr = new Array();
			let itemSeqArr   = new Array();
			let itemCntArr   = new Array();
	        
			childInputs.forEach((child) => {
				itemSeqArr.push(child.dataset.seq);
				itemTitleArr.push((child.nextElementSibling.nextElementSibling.innerHTML));
				
				itemType == 'C' ? itemCntArr.push(child.closest('li').dataset.cnt) : '';
			});

			data.groupTitle = groupCode == parent.dataset.code ? 'N' : 'Y';
	        data.item       = itemTitleArr;
	        data.itemSeq    = itemSeqArr;
	        data.itemCnt    = itemCntArr;

			groupCode = parent.dataset.code;
	        listArr.push(data);
		}
		
		if (target == 'reserve-insert-result') {     //예약한 시술일 경우
			ele.closest('li').classList.add('hide');	
			parent.querySelector('.reserve-price').classList.add('used');
		} else {                                     //남은 시술권일 경우
			const label = ele.closest('li').querySelectorAll('label');
			label[0].style.display = 'none';
			
			if (!ele.id.includes('pack')) {
				if (itemType == 'C' && !ele.closest('li').classList.contains('service')) {
					ele.closest('li').classList.add('hide');
				} else {
					label[1].classList.add('used');
				}
			}
		}	
	});
    
    //배열 중복 제거
    listArr = listArr.filter((item, i) => {
		return (
			listArr.findIndex((item2, j) => {
				if (item.itemType == 'P') {
					return item.itemTitleSub === item2.itemTitleSub;
				} else {
					return item.groupCode === item2.groupCode;	
				}
			}) === i
		);
	});
    
    const li = list.querySelectorAll('li.pro-con');
    li.forEach((item) => {
    	if (item.dataset.type == 'C') {
    		item.querySelectorAll('span.active').forEach((ele) => {ele.classList.remove('active')});
    	} else {
    	    //예약한 시술일 경우 사용처리 된 시술 감추기 
    		if (target == 'reserve-insert-result') {
            	const input        = item.querySelectorAll('input');
            	const checkedInput = item.querySelectorAll('input:checked');
            	
            	input.length == checkedInput.length ? item.classList.add('hide') : '';	
    		}
    	}
    });

	return listArr;
}

//시술권 사용 그리기
function drawTodayUsePro(){
	const reserve = checkTodayData('reserve-insert-result');
	const product = checkTodayData('product-insert-result');
	const div     = document.querySelector('.today-use-con');
	
	const drawToday = function(result , type){
		let i = div.childElementCount > 0 ? div.childElementCount - 1 : -1;
		
		if (result.length > 0) {
			for (idx in result) {
				const item     = result[idx].item;
				const itemSeq  = result[idx].itemSeq;
				const itemType = formatType(result[idx].itemType);
				
				if (result[idx].groupTitle == 'Y') {
					div.innerHTML +=
						`<li class="pro-con ${type}" 
							 data-code="${result[idx].groupCode}" data-type="${result[idx].itemType}">
							<div class="today-use-top">
								<div class="type-status">${itemType}</div>
								<p class="pro-tit">${result[idx].itemTitle}</p>
							</div>
							
							<ul class="today-use-list"></ul>
						</li>`;	
					i++;
				}

		        const content = div.querySelectorAll('.today-use-list')[i];
				if (result[idx].itemType == 'E' || result[idx].itemType == 'N') {
					for (let j = 0; j < item.length; j++) {
						content.innerHTML +=
							`<li data-seq="${itemSeq[j]}">
								<button type='button' onclick="delTodayUsePro(this)"></button>
								${item[j]}
							</li>`;		
					}
				};
				
				if (result[idx].itemType == 'P') {
					content.innerHTML += 
						`<li class="package">
							<label class="package-label">${result[idx].itemTitleSub}</label>
							<ul class="today-result-con"></ul>
						</li>`;
					
					const child = content.querySelector('li:last-child > ul');
					if (item.length > 0) {
						for (let j = 0; j < item.length; j++) {
							child.innerHTML +=
								`<li data-seq="${result[idx].itemSeq[j]}">
									<button type='button' onclick="delTodayUsePro(this)"></button>
									${result[idx].item[j]}
								</li>`;	
						}	
					}			
				};
				
				if (result[idx].itemType == 'C') {
					if (item.length > 0) {
						for (let j = 0; j < item.length; j++) {
							content.innerHTML +=
								`<li data-seq="${result[idx].itemSeq[j]}" data-cnt="${nvlStr(result[idx].itemCnt[j])}">
									<button type='button' onclick="delTodayUsePro(this)"></button>
									${result[idx].item[j]}
								</li>`;	
				
							if (!isNullStr(result[idx].itemCnt[j])) {  //서비스 시술이 아닐 경우에만 차감 횟수 추가
								content.querySelector('li:last-child').innerHTML += `(-${result[idx].itemCnt[j]} Point 차감)`;
							}
						}	
					}
				};
			}	
		}
	}

	//체크된 시술이 하나도 없을 경우
	if (!isNullStr(reserve) || !isNullStr(product)) {
		div.innerHTML = '';
		document.querySelector('button.save-crm').dataset.status = false;
		
		drawToday(reserve , 'reserve');
		drawToday(product , 'product');	
	} else {
		alert('사용할 시술권을 체크해주세요.');
	}
}

//당일 사용할 시술권 삭제
function delTodayUsePro(target){	
	const parent   = target.closest('li.pro-con');
	const itemSeq  = target.parentElement.dataset.seq;
	const itemType = parent.dataset.type;
	
	let input;
	if (parent.classList.contains('reserve')) {
		input = document.querySelectorAll('.reserve-insert-result input');
	} else {
		input = document.querySelectorAll('.product-insert-result input');
	}
			
	for (let i = 0; i < input.length; i++) {
		if (itemSeq == input[i].dataset.seq) {
			//예약된 리스트(추가)
			const label      = input[i].closest('li').querySelectorAll('label');
			input[i].checked = false;
			
			if (itemType == 'C') {				
				if (!isNullStr(input[i].closest('li').dataset.cnt)) { //서비스 시술이 아닐때
					const totalCnt = input[i].closest('li.pro-con').querySelectorAll('.pro-tit bold')[0];
					totalCnt.innerText = Number(totalCnt.innerText) - Number(input[i].closest('li').dataset.cnt);
					input[i].closest('li').remove();                 
				} else {
					if (parent.classList.contains('reserve')) {
						input[i].closest('li').classList.remove('hide');
					} else {
						label[0].style.display = 'block';
						label[1].classList.remove('used');
					}
				}
			} else {
				if (parent.classList.contains('reserve')) {           //예약한 시술일 경우
					input[i].closest('li').classList.remove('hide');
				} else {                                              //남은 시술권일 경우
					label[0].style.display = 'block';
					label[1].classList.remove('used');
				}

				const titleParent = itemType == 'P' ? input[i].closest('li.pro-con > ul > li') : input[i].closest('li.pro-con');
				const titleChild  = titleParent.querySelectorAll('li');
				
				for (let j = 0; j < titleChild.length; j++) {
				
					if (!titleChild[j].classList.contains('hide')) {
						if (parent.classList.contains('reserve')) {   //예약한 시술일 경우
							titleParent.querySelector('.check input').checked = false;
							titleParent.classList.remove('hide');	
						} else {                                      //남은 시술권일 경우
							titleParent.querySelectorAll('.check label')[0].style.display = 'block';
							titleParent.querySelector('.check input').checked = false;
						}
						
						if (itemType == 'P') {
							input[i].closest('li.pro-con').classList.remove('hide')
						}
						
						break;
					}
				}
			}
			
			//당일 사용할 시술권(삭제)		
			const useList = target.parentElement.closest('ul.today-use-list');
			
			if (itemType == 'C' && !isNullStr(input[i].closest('li').dataset.cnt)) {
				const totalCnt = parent.querySelectorAll('.pro-tit bold')[0];
				totalCnt.innerText = Number(totalCnt.innerText) - Number(input[i].closest('li').dataset.cnt);	
			}
			
			if (itemType == 'P') {
				const packageList = target.parentElement.closest('ul.today-result-con');
				if (packageList.childElementCount == 1) {     //패키지 시술 소제목 삭제
					packageList.parentElement.remove();	
				}
			}
		
			target.parentElement.remove(); 
			
			if (useList.childElementCount == 0) {    
				useList.parentElement.remove();
			}

			break;
		}
	};

	document.querySelector('button.save-crm').dataset.status = false;
	checkEmptyTodayList();                                             //당일 사용할 시술권이 없을때
}

//당일 사용할 시술권이 없을때 
function checkEmptyTodayList(){
	//당일 사용할 시술권이 없을시
	if (document.querySelector('.today-use-con').childElementCount == 0) {
		document.querySelector('.today-use-con').innerHTML +=
			`<li id="noSearch">
				당일 사용 할 시술을 선택 후<br/>
				하단 &quot;<bold>시술권 사용</bold>&quot; 버튼을 <br/>
				선택해 주세요.
			</li>`;
	}
}

//사용기록 검색 
function popOneProductHistory(){
	const content = 
        `<div class="popup-tit">
            <p>이전 메모 검색</p>
        </div>
       
        <div class="popup-con used-wrap" style="width:385px">
			<div class="input-wrap">
				<label>검색 메모</label>
				<input type="text" id="usedField" placeholder="검색어를 입력해 주세요.">
			</div>
			
			<div class="input-wrap">
	    		<label>사용 날짜</label>
	        	<div class="used-date">
			        <div class="con date">
		       			<input type="text" class="start-date" id="usedStartDate" name="startDate" placeholder="시작일" autocomplete="off">
			        </div>
			      
		       		<i class="wave">~</i>
		       		
		        	<div class="con date">
		       			<input type="text" class="end-date" id="usedEndDate" name="endDate" placeholder="종료일" autocomplete="off">
			        </div>
	        	</div>
			</div>
		</div>
		
		<div class="popup-btn">
			<button type="button" class="save-btn blue-btn" onclick="searchUserProductHistory()">검색하기</button>
		</div>`;
	
	
	commonDrawPopup("draw", content);
	commonDatePicker(["usedStartDate" , "usedEndDate"]);
}

//사용 기록 검색 조회 
function searchUserProductHistory(){
	const start  = document.getElementById('usedStartDate').value;
	const end    = document.getElementById('usedEndDate').value;
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"userId"       : document.getElementById('userId').value,
		"field"        : document.getElementById('usedField').value,
		"start"        : start.replace(/[^0-9]/g,''),
		"end"          : end.replace(/[^0-9]/g,''),
		"itemStatus"   : 'Y'
	};
	
	commonAjax.call("/res/getUserProductHistory", "POST", params, function(data){
		if (data.message == "OK") { 
			const content = 
		        `<div class="popup-tit">
		            <p>이전 메모 검색</p>
		        </div>
		       
		        <div class="popup-con used-wrap" style="width:490px">
		        	<div class="used-search-info">
		        		<div>
		        			<label class="need">검색 메모 : </label>
		        			<span>${isNullStr(params.field) ? '-' : params.field}</span>
		        		</div>
		        		
		        		<div>
		        			<label class="need">사용 날짜 : </label>
		        			<span>
		        				${isNullStr(params.start) ? '-' : start + '~' + end}
		        			</span>
		        			<button type='button' onclick="popOneProductHistory()">검색 초기화</button>
		        		</div>
		        	</div>

		        	<div class="used-use-list scroll"></div>
				</div>`;
			
		   	//사용기록 닫기 이벤트로 변경 
			document.querySelector('.sub-pop .popup-overlay').setAttribute('onclick', 'historyPopupClose()');
			document.querySelector('.sub-pop .del-btn').setAttribute('onclick', 'historyPopupClose()');

			commonDrawPopup("draw", content);
			drawProductHistory(data.resultList , 'used-use-list'); //사용기록 검색 내역 그리기
		}
	});
}

//사용기록 검색 팝업의 경우 닫기 함수를 따로 적용
function historyPopupClose(){
	const parent = document.querySelector('.sub-pop');		    	
    parent.classList.remove('active');
    parent.querySelector('#popupInner').setAttribute("class", "");
    parent.querySelector('#popupInner').innerHTML = "";

   	subPop = false;
   	isClick = true;
   	
	getUserInfoProductHistory(); //이전 시술권 사용 기록(최근 3개) 재조회

   	//기존 서브팝업 닫기 이벤트로 변경 
	parent.querySelector('.popup-overlay').setAttribute('onclick', 'subPopupClose()');
	parent.querySelector('.del-btn').setAttribute('onclick', 'subPopupClose()');
}

//사용기록 검색 내역 그리기
function drawProductHistory(result , content){
	const div = document.querySelector(`.${content}`);
	let i = -1;
	let j = -1;
	let type , area , child , date;
	
	if (content == 'previous-use-con') { //이전 시술권 사용 기록
		area  = 'previous-use-area';
		child = 'previous-use-child';
		type  = 'previous'
	} else {
		area  = 'used-use-area';
		child = 'used-use-child';
		type  = 'used'
	}
	
	if (result.length > 0) {
		date = '';                        //기준이 되는 날짜 
		div.innerHTML = '';
		
		result.forEach((item) => {			
			if (date != item.updateDate) {
				div.innerHTML +=
					`<div>
						<div class="${type}-use-date">${item.updateDate}</div>
						<ul class="${type}-use-area"></ul>
					</div>`;	

				date = item.updateDate;
				i++;
			} 

			const parent = document.querySelectorAll(`.${area}`)[i];
			if (item.groupTitle == 'Y') {
				parent.innerHTML +=
					`<li>
						<div class="previos-title-area">
							<p class="${type}-use-title"><span class="type">[${formatType(item.itemType)}]</span> ${item.itemTitle}</p>
							<button type="button" class="delete-btn" onclick="updateProductHistoryDisplay('each' , this)"></button>
						</div>
						<ul class="${type}-use-child"></ul>
						<span class="product-price">금액 : <span>${item.productPrice}</span>원</span>
					</li>`;
				j++;
			}
			
			const children = document.querySelectorAll(`.${child}`)[j];
			children.innerHTML +=
				`<li data-seq="${item.historySeq}">
					<div class="${item.confirmStatus == 'Y' ? 'use-status' : 'del-status'}">
						${item.confirmStatus == 'Y' ? '사용' : '삭제'}
					</div>
					<span>${item.prdItemName} <br/> <label>${item.updateUser}<label></span>
				</li>`;
		});
		
		//이전 시술권 사용 기록이 1개 이상일때 첫번째 아코디언 오픈
		setTimeout(() => {
			if (content == 'previous-use-con') {
			    const title   = document.querySelectorAll('.previous-use-date')[0];
			    const content = document.querySelectorAll('.previous-use-area')[0];
			    
			    title.classList.add("active");
			    content.style.maxHeight = content.scrollHeight + 'px';			
			}
		}, 1);
	} else {
		div.innerHTML = '<li id="noSearch">검색된 이전 메모가 없습니다.</li>';
	}
}

/**
 * 사용 기록  삭제(display)
 * @param {String} type - all(전체 삭제), each(개별 삭제) 
 */
function updateProductHistoryDisplay(type , target){
	let historyList = new Array();
	
	if (type == 'each') {
		const list = target.closest('li').querySelectorAll('li');
		
		list.forEach((ele) => {
			historyList.push(ele.dataset.seq);
		})
	}
	
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"userId"       : document.getElementById('userId').value,
		"itemList"     : historyList.toString()
	};
	
	commonAjax.call("/res/updateUserProductHistoryDisplay", "POST", params, function(data){
		if (data.message == "OK") {
			if (type == 'each') {
				const parent  = target.closest('ul');
				const content = target.closest('.scroll');
				
				target.closest('li').remove(); //해당 내역 삭제
				
				//해당 날짜에 내역이 없으면 날짜 div도 삭제
				if (parent.childElementCount == 0) {
					parent.parentElement.remove();
				}
				
				//내역이 하나도 없으면 예외처리 
				if (content.childElementCount == 0) {
					content.innerHTML = `<li id="noSearch">검색된 이전 메모가 없습니다.</li>`;
				}	
			} else {
				document.querySelector('.previous-use-con').innerHTML = 
					`<li id="noSearch">검색된 이전 메모가 없습니다.</li>`;
			}
		}
	});
}

//이전 시술권 사용 기록(최근 3개)
function getUserInfoProductHistory(){
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"userId"       : document.getElementById('userId').value
	};
	
	commonAjax.call("/res/getUserProductHistory", "POST", params, function(data){
		if (data.message == "OK") {
			drawProductHistory(data.resultList , 'previous-use-con');  //사용기록 검색 내역 그리기
			openPreviousHistory();                                     //이전 시술권 사용 기록 애니메이션
		}
	});
}

//이전 시술권 사용 기록 애니메이션
function openPreviousHistory() {
    var title   = document.querySelectorAll('.previous-use-date');
    var content = document.querySelectorAll('.previous-use-area');

    title.forEach((list) => {
    	list.addEventListener("click", function() {
            let inner = this.nextElementSibling;
            
            if (this.classList.contains('active')) {		  		
                this.classList.remove('active');
                inner.style.maxHeight = null;
            } else {
                for (let i = 0; i < title.length; i++) {
                	title[i].classList.remove('active');
                	content[i].style.maxHeight = null;
                };
                
                this.classList.add("active");
                inner.style.maxHeight = inner.scrollHeight + "px";	
            }
    	});
    });
}

//CRM전송 팝업 내용 
function setCrmContent(){
	const todayList = document.querySelectorAll('.today-use-con > li:not(#noSearch)');
	let html = '';
	let i    = 0;
	
	if (document.getElementById("isNew").value == 'Y') {
		//상품 리스트
		todayList.forEach((list) => {
			const proTitle  = list.querySelector('.pro-tit').innerText;
			const childList = list.querySelectorAll('.today-use-list > li');
			let text = '';
			
			if (list.classList.contains('reserve')) { 
				html += proTitle + '\n';       
				
				childList.forEach((item) => {
					if (list.dataset.type == 'P') {
						const child  = item.querySelectorAll('li');

						child.forEach((ele) => {
							if (!isNullStr(ele.querySelector('.service-status'))) {
								text += '[서비스] ' + ele.querySelector('p').innerText + '\n';	
							}
						});	
					} else {
						if (!isNullStr(item.querySelector('.service-status'))) {
							text += '[서비스] ' + item.querySelector('p').innerText + '\n';	
						}
					}
				});	
			} else {
				html += '[남은 시술권]' + proTitle + '\n';       
			
				childList.forEach((item) => {
					if (list.dataset.type == 'P') {
						const child  = item.querySelectorAll('li');
						text += item.querySelector('.package-label').innerText.replace('\n',' ') + '\n'; 	
						
						child.forEach((ele) => {
							if (!isNullStr(ele.querySelector('.service-status'))) {
								text += '[서비스] ' + ele.querySelector('p').innerText + '\n';	
							}
						});	
					} else {
						if (!isNullStr(item.querySelector('.service-status'))) {
							text += '[서비스] ' + item.querySelector('p').innerText + '\n';	
						}
					}
				});			
			}

			html += text;
			i++;
		});
	} else {
		//상품 리스트
		todayList.forEach((list) => {
			const proTitle  = list.querySelector('.pro-tit').innerText;
			const childList = list.querySelectorAll('.today-use-list > li');
			let text = '';
			
			if (list.classList.contains('reserve')) { 
				const proPrice  = document.querySelectorAll('.reserve-price.used > b')[i].innerText;  //예약 가격
				html += proTitle + ' - ' + proPrice + '원\n';       
			} else {
				html += '[남은 시술권]' + proTitle + '\n';       
			}

			childList.forEach((item) => {
				if (list.dataset.type == 'P') {
					const child  = item.querySelectorAll('li');
					text += item.querySelector('.package-label').innerText.replace('\n',' ') + '\n'; 	
					
					child.forEach((ele) => {
						const serviceYn = !isNullStr(ele.querySelector('.service-status')) ? '[서비스] ' : '';
						text += '&check;' + serviceYn + ele.querySelector('p').innerText + '\n';	
					});	
				} else {
					const serviceYn = !isNullStr(item.querySelector('.service-status')) ? '[서비스] ' : '';
					const cntPoint  = !isNullStr(item.dataset.cnt) ? `(-${item.dataset.cnt}p)` : '';
					text += '&check;' + serviceYn + item.querySelector('p').innerText + cntPoint +'\n';	
				}
			});

			html += text + '\n';
			i++;
		});
		
		//고객메모
		if (!isNullStr(document.getElementById('resNote').value)) {
			html += '[고객 요청사항]\n' + document.getElementById('resNote').value + '\n\n';	
		}
		
		//병원메모
		if (!isNullStr(document.getElementById('hospitalNote').value)) {
			html += '[병원 메모]\n' + document.getElementById('hospitalNote').value + '\n\n';
		}

		html += '---------------------\n';
		
		//상품 총 가격
		const reserveItems  = document.querySelectorAll('.today-use-con > li').length;
		const totalPrice    = calProductPrice();
		const discountType  = document.querySelector('.discount-btn button.active');
		let discountPrice   = document.getElementById('discount').value.replaceAll(',' , '');
		let discountText    = '';
		let finalPrice      = '';
		
		if (!isNullStr(discountPrice)) {
			if (!isNullStr(discountType)) {
				const type     = discountType.value == '1' ? '추가 ' : '할인 ';
				
				discountPrice = Number(discountPrice) * Number(discountType.value);
				discountText  = '(' + type + document.getElementById('discount').value + '원)';
				finalPrice    = ' = ' + (Number(totalPrice) + Number(discountPrice)).toLocaleString('ko-KR') + '원';
			} else {
				alert('할인 유형을 클릭해주세요.');
				return;
			}
		}
		
		html += '총 ' + reserveItems + '개의 시술 금액 : ' + totalPrice.toLocaleString('ko-KR') + '원 ' + discountText + finalPrice + '\n';
		
		//부가세 계산
		isNullStr(finalPrice) ? finalPrice = totalPrice : finalPrice = (Number(totalPrice + discountPrice));
		const vatPrice = finalPrice / 10;
		
		html += '※부가세 포함 ' + finalPrice.toLocaleString('ko-KR') + ' + ' + vatPrice.toLocaleString('ko-KR') + ' = ' + (finalPrice + vatPrice).toLocaleString('ko-KR') + '원';
	}

	return html;
}

//CRM전송 팝업
function popSendCRM(){
	const data = document.querySelectorAll('.today-use-con li.pro-con');
	
	if (data.length > 0) {
		const crmContent = setCrmContent();
		const content = 
	        `<div class="popup-tit">
	            <p>CRM 사용 시술 전송</p>
	        </div>
	       
	        <div class="popup-con send-crm-wrap" style="width:380px">
	        	<div class="send-crm-con">
					<label class="need">전송 내용</label>
					<textarea id="hisContent" class="scroll">${crmContent}</textarea>
	        	</div>
	        	
	        	<button type='button' class="save-btn blue-btn" onclick="insertCrmData()">전송하기</button>
			</div>`;

		commonDrawPopup("draw", content);	
	} else {
		alert('당일 사용할 시술권을 추가해 주세요.\n사용할 시술을 선택 후 하단 시술권 사용 버튼을 선택해 주세요.');
	}
}

//상품 데이터 체크
function checkData(){
	const reserve  = document.querySelectorAll('li.reserve');
	const product  = document.querySelectorAll('li.product');
	let itemList   = new Array();
	let reserveSeq = new Array();
	let productSeq = new Array();
	
	const pushArr = function(data , dataArr , name) {
		data.forEach((item) => {
			const list = item.dataset.type == 'P' ? item.querySelectorAll('.today-result-con li') : item.querySelectorAll('.today-use-list li');
			
			for (let i = 0; i < list.length; i++) {
				dataArr.push(list[i].dataset.seq);
			}
		});
		
		itemList.push({
			"name" : name,
			"itemList" : dataArr.join(',')
		});
	}
	
	pushArr(reserve , reserveSeq , 'reserve');
	pushArr(product , productSeq , 'product');
	
	return itemList;
}

//CRM전송 
function insertCrmData(){
	if (isNullStr(document.getElementById("reserveDate").value)) {  //예약 날짜
		alert('예약 날짜를 선택해 주세요.');
		return;
	}
	
	//예약 상품 혹은 남은 시술권 체크가 있을 경우 해당 알림을 띄움
	if (document.getElementById("isNew").value == 'Y') {
		const reservedPro = document.querySelectorAll(".reserve-insert-result input:checked");
		const remainedPro = document.querySelectorAll(".product-insert-result input:checked");
		let cnt = 0;
		
		reservedPro.forEach((ele) => {
			const parent = ele.closest('li');
			
			if (!parent.classList.contains('hide')) {
				cnt++;
			}
		});
		
		remainedPro.forEach((ele) => {
			const parent = ele.closest('div');
			
			if (ele.id.indexOf('pack') < 0) {
				if (!parent.querySelector('label:last-child').classList.contains('used')) {
					cnt++;
				}	
			}
		});	
		
		if (cnt > 0) {
			if (!confirm('생성된 메모 시술권만 예약 접수가 진행됩니다.\n계속 진행하시겠습니까?')) {
				return;
			}
		}
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"resNo"        : document.getElementById("resNo").value,
		"userId"       : document.getElementById("userId").value,
		"resDate"      : document.getElementById("reserveDate").value.replace(/[^0-9]/g , ''),
		"resTime"      : document.getElementById("reserveTime").value.replace(/[^0-9]/g , ''),
		"itemList"     : JSON.stringify(checkData()),
 	};	
	
	//할인 금액 계산
	const discountBtn   = document.querySelector('.discount-btn > button.active');
	const discountPrice = document.getElementById("discount").value.replaceAll(',','');
	const resSale       = !isNullStr(discountBtn) ? Number(discountPrice) * discountBtn.value : Number(discountPrice) * 0;
	
	if (document.getElementById("isNew").value == 'Y') {   //예약 접수일 경우
		//예약한 시술 내역 베가스 전송
		const crmContent = setCrmContent();
		
		if (!isNullStr(crmContent)) {
			params.hisContent = crmContent;
		}	
		
		//resGroupCode
		const reserve    = document.querySelectorAll('li.reserve');
		let resGroupCode = new Array();
		
		reserve.forEach((item) => {
			resGroupCode.push(item.dataset.code);
		});
				
		params.resType      = document.getElementById("resType").value;
		params.hospitalNote = document.getElementById("hospitalNote").value;
		params.resNote      = document.getElementById("resNote").value;
		params.adviceYn     = document.getElementById("adviceYn").checked ? 'Y' : 'N';
		params.resSale      = resSale;
		params.isNew        = document.getElementById("isNew").value;
		params.resGroupCode = resGroupCode.join(',');
		
	} else {                                               //예약 확인일 경우
		if (!isNullStr(document.getElementById("crmContent"))) {
			params.hisContent = document.getElementById("hisContent").value;
		}		
	}
	
	commonAjax.call("/res/insertCrmData", "POST", params, function(data){
		if (data.message == "OK") {			
			//fetch 예외처리
			const activeCard = document.querySelector('.member-card.active');
			if (!isNullStr(activeCard)) {
				getReserveUserList();  //res002.js 예약현황 재조회
				activeCard.remove('active');
			}
			
			subPopupClose();
			res004PopupClose();
		}
	});
}

//시술권 최종 저장
function saveData(){
	if (isNullStr(document.getElementById("reserveDate").value)) {   //예약 날짜
		alert('예약 날짜를 선택해 주세요.');
		return;
	}
	
	if (document.querySelector('button.save-crm').dataset.status == 'false') { //crm 전송 상태
		alert('CRM 전송 후 확인완료를 진행할 수 있습니다.');
		return;
	}
	
	//resGroupCode
	const reserve    = document.querySelectorAll('li.reserve');
	let resGroupCode = new Array();
	
	reserve.forEach((item) => {
		resGroupCode.push(item.dataset.code);
	});
	
	//할인 금액 계산
	const discountBtn   = document.querySelector('.discount-btn > button.active');
	const discountPrice = document.getElementById("discount").value.replaceAll(',','');
	const resSale       = !isNullStr(discountBtn) ? Number(discountPrice) * discountBtn.value : Number(discountPrice) * 0;

	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"userId"       : document.getElementById("userId").value,
		"resNo"        : document.getElementById('resNo').value,
		"resDate"      : document.getElementById("reserveDate").value.replace(/[^0-9]/g , ''),
		"resTime"      : document.getElementById("reserveTime").value.replace(/[^0-9]/g , ''),
		"resType"      : document.getElementById("resType").value,
		"resNote"      : document.getElementById("resNote").value,
		"hospitalNote" : document.getElementById("hospitalNote").value,
		"adviceYn"     : document.getElementById("adviceYn").checked ? 'Y' : 'N',
		"totalPrice"   : calProductPrice(),
		"resSale"      : resSale,
		"itemList"     : JSON.stringify(checkData()),
		"resGroupCode" : resGroupCode.join(','),
		"isNew"		   : document.getElementById("isNew").value
	};	
	
	commonAjax.call("/res/insertUserReserve", "POST", params, function(data){
		if (data.message == "OK") {
			//fetch 예외처리
			const activeCard = document.querySelector('.member-card.active');
			if (!isNullStr(activeCard)) {
				getReserveUserList();  //res002.js 예약현황 재조회
				activeCard.remove('active');
			}
			
			alert('확인이 완료되었습니다.');				
			res004PopupClose();
		}
	});
}

//팝업 닫기
function res004PopupClose() {
	let status = 5;
	
	//페이지 재조회
	if (window.location.pathname == "/res/res002") {
		getReserveList();          //예약 리스트 조회 (res002)
	} else {	
		//신규예약일 경우 status 9 반환
		if (document.getElementById("isNew").value == 'Y') {			
			status = 9;
		}
		
		//SSE 작업 종료
		const oCode = document.getElementById("officeCode").value;
		const resNo = document.getElementById('resNo').value;
		const token = document.querySelector(".page-url").dataset.token;	

		//작업상태 해제
		fetch(`${confirmURI}/${oCode}?resno=${resNo}&accessToken=${token}&status=${status}`);	
	}

	document.querySelector('.popup').classList.remove('active');    
   	document.querySelector('#popupInner').innerHTML = "";
   	isPop = false;
   	
   	document.querySelector('body').classList.remove('no-scroll');

   	//기존 팝업 닫기함수 등록
   	document.querySelector('.popup-overlay').removeAttribute('onclick');   			
	document.querySelector('.popup-overlay').setAttribute('onclick', 'popupClose()');
	document.querySelector('.popup .del-btn').removeAttribute('onclick');
	document.querySelector('.popup .del-btn').setAttribute('onclick', 'popupClose()');
}

/**
 * 패키지 전체 시술 체크
 * @param {String} area - 타겟이 있는 영역 
 */
function allCheck(area){
	const inputs = document.querySelectorAll(`.${area}.package label`);
	
	for(let i = 0; i < inputs.length; i++) {
		inputs[i].onclick = function() {
			const parent = inputs[i].closest('.check').nextElementSibling;
			
			if (!isNullStr(parent)) {  //전체 클릭인 경우
				const child = parent.querySelectorAll('input');
				child.forEach((item) => {
					const all = inputs[i].closest('div').querySelector('input');
					
					all.checked ? item.checked = false : item.checked = true;	
				});
			} else {	
				const content = inputs[i].closest('ul');
				const input   = inputs[i].closest('.check').querySelector('input');
				const all     = content.closest('li').querySelector('.check input');
				let count     = content.querySelectorAll('input:checked').length;
				const total   = content.querySelectorAll('li').length;
				
				count = input.checked ? count - 1 : count + 1;
				total == count ? all.checked = true : all.checked = false;
			}			
		}
	}
}

/**
 * 차감 시술 추가하기
 * @param {String} target - 타겟이 있는 부모 영역 
 * @param {String} area   - 그려질 영역
 */
function addCountPro(target , area){
	const nodes  = document.querySelectorAll(`.${target} span`);

	for (let i = 0; i < nodes.length; i++) {		  
		nodes[i].onclick = function() {
			const parent   = nodes[i].closest('li.pro-con'); 
			const totalCnt = parent.querySelectorAll('.pro-tit bold')[0];
			const maxCnt   = parent.querySelectorAll('.pro-tit bold')[1];
			const list  = parent.querySelector(`.${area}`);
			const resNo = parent.dataset.code;
			const cnt   = nodes[i].parentElement.dataset.cnt;
			
			const type  = area.split('-')[0];
			const maxId = getSeqMax('id') + 1;

			if (Number(totalCnt.innerText) + Number(cnt) <= maxCnt.innerText) {					
				nodes[i].classList.add('active');
				list.style.display = 'block';
				const content = 
					`<li data-cnt="${cnt}">
					    <div class="check">
					        <input type="checkbox" class="rec-check" id="${type}-${maxId}" data-seq="${nodes[i].dataset.seq}" onchange="delCountPro(this)" checked>
					        <label for="${type}-${maxId}"></label>
					        <label for="${type}-${maxId}"><p>${nodes[i].innerText}</p></label>
					    </div>
					</li>`;	
				list.insertAdjacentHTML('afterbegin' , content);
				
				totalCnt.innerText = Number(totalCnt.innerText) + Number(cnt);  //차감 시술 횟수 +	
			} else {
				alert('사용 가능한 차감시술 포인트를 초과하였습니다.');
			}
		};
	}
}

//차감 시술 빼기
function delCountPro(target){
	const parent      = target.closest('li.pro-con'); 
	const childParent = target.closest('li');
	const cnt         = childParent.dataset.cnt;
	const itemSeq     = target.dataset.seq;
	const totalCnt    = parent.querySelectorAll('.pro-tit bold')[0];
	
	//선택한 대상이 선택한 대상안에 없을 경우 차감 시술 활성화 제거
	const num = childParent.parentNode.querySelectorAll(`input[data-seq='${itemSeq}']`);
	
	if (num.length - 1 == 0) {
		parent.querySelector(`span[data-seq='${itemSeq}']`).classList.remove('active');
	}
	
	//선택한 대상 삭제 후 차감 포인트 계산
	childParent.remove();
	totalCnt.innerText = Number(totalCnt.innerText) - Number(cnt);  //차감 시술 횟수 -
}

//시술 타입 포맷
function formatType(result){
	let type;
	
    switch (result) {
        case 'C': type = "포인트";
                  break;
        case 'P': type = "패키지";
                  break;
        case 'E': type = "체험";
              	  break;	
        default : type = "일반";
                  break;
    }
    
    return type;
}

//시술 검색 영역 이벤트
function searchProduct(target){
	document.getElementById(`${target}`).addEventListener("keyup", (e)=>{
		if (event.keyCode === 13) {
			getProductItem();
		}  
	});
}

//서비스 시술 팝업
function popServicePro(target){
	const parent   = target.closest('li.pro-con');
	const view     = parent.parentElement.classList.contains('reserve-insert-result') ? 'reserve' : 'product';
	const proTitle = parent.querySelector('p.pro-tit').innerText;
	
	parent.classList.add('show');
	
	const content  = 
        `<input type="hidden" id="resGroupCode" value="${parent.dataset.code}">
         <input type="hidden" id="resGroupSeq" value="${parent.dataset.seq}">
         <input type="hidden" id="serviceResno" value="${parent.dataset.resno}">
         
         <div class="popup-tit">
        	 <div class="text">
	             <p>서비스 시술 추가</p>
        		 <span>서비스 시술 추가는 일반 시술만 추가할 수 있습니다.<br/>서비스 시술 금액은 0원으로 계산됩니다.</span>	
        	 </div>
         </div>
       
        <div class="popup-con service-wrap" style="width:660px">
        	<div class="service-package">
        		<label class="need">남은 시술권</label> 
        						
				<div class="service-package-info">
					<input type="text" value="${proTitle}" disabled>
					<div class="select-box">
			    		<select id="groupSeq"></select>
						<div class="icon-arrow"></div>	
					</div>
				</div>
        	</div>
        	
			<div class="input-wrap">
				<label class="need">시술 검색</label>
				
				<div class="input">
					<div class="select-box">
				    	<select id="popProduct" onchange="getProductSubList()"></select>
						<div class="icon-arrow"></div>	
					</div>
					
					<div class="select-box">
				    	<select id="popProductSub" class="small" onchange="getProductItem()">
				    		<option value=''>소분류 선택</option>
				    	</select>
						<div class="icon-arrow"></div>	
					</div>
				</div>
			</div>
        	
			<div class="service-add-area">
				<div class="service-search-area">
					<div class="service-search-top">
						<input type='text' id="popProductField" placeholder="일반 시술을 검색해 주세요."/>
						<button onclick="getProductItem()"></button>
					</div>
					
					<ul class="service-search-result scroll"></ul>
				</div>
				
				<span></span>
				
				<div class="service-insert-area">
					<ul class="service-insert-result scroll"></ul>
					
					<div class="service-insert-bottom">
						<p>
							<span>총 <label id="serviceCount">0</label>개의 서비스 금액 : </span>
							<span>합계 <label id="servicePrice">0</label>원 → 0원</span>
						</p>
					</div>
				</div>
			</div>
        	
        	<div class="btn-area">
	        	<button type='button' class="save-btn blue-btn" onclick="insertServiceProduct('${view}')">저장하기</button>
        	</div>
		</div>`;
	
	commonDrawPopup("draw", content);
	getProductList();                 //중분류 조회
	searchProduct('popProductField'); //시술 검색 조회

	if (parent.dataset.type == 'P') {                   	
		getEventPackageList(parent);                                          //패키지일 경우 회차 조회 
	} else {
		document.querySelector('.service-package-info .select-box').remove(); //패키지가 아닐 경우 회차 셀렉트 삭제
	}
	
   	//append 닫기 이벤트로 변경 
	document.querySelector('.sub-pop .popup-overlay').setAttribute('onclick', 'appendPopupClose()');
	document.querySelector('.sub-pop .del-btn').setAttribute('onclick', 'appendPopupClose()');
}

//패키지 회차 조회
function getEventPackageList(parent){
	const list     = parent.querySelectorAll('.package > li:not(.con):not(.hide)');
	const dataList = new Array();
	
	for (let i = 0; i < list.length; i++) {
		const label = list[i].querySelector('.package-label > bold').innerText.replace(/[^0-9]/g, "");
        let data    = new Object();
        
        data.code = label
        data.name = label + '회';
        
        dataList.push(data);	
	}
	
	const comboObj = {"target" : "groupSeq", "data" : dataList};
	commonInitCombo(comboObj);	
}

//서비스 시술 삽입
function addUserServiceItem(target){
	const serviceList = document.querySelectorAll('.service-search-result li');
	const resultList  = document.querySelector('.service-insert-result');
	
	if (!target.classList.contains('active')) {
		resultList.innerHTML += 
			`<li data-code="${target.dataset.code}">
                <div class="service-txt">
                    <p>${target.querySelector('p').innerText}</p>
                    <span><label class="service-price">${target.querySelector('span').innerText}</label> → 0원</span>
                </div>
                <button class="service-del" onclick="delUserServiceItem(this)"></button>
            </li>`;	
		
		//총 시술 갯수와 가격 
		const total = calTotalPrice('.service-price');
		document.getElementById('serviceCount').innerHTML = `${document.querySelectorAll('.service-price').length}`;
		document.getElementById('servicePrice').innerHTML = `${total}`;
		
		target.classList.add('active');	
	}
}

//서비스 시술 삭제
function delUserServiceItem(target){
	const parent = target.closest('li');
	const search = document.querySelector(`.service-search-result li[data-code="${parent.dataset.code}"]`);
	
	//검색 된 시술 내역에 해당 시술이 있을 경우 
	if (!isNullStr(search)) {
		search.classList.remove('active');	
	}
	
	parent.remove();
	
	//총 시술 갯수와 가격 
	const total = calTotalPrice('.service-price');
	document.getElementById('serviceCount').innerHTML = `${document.querySelectorAll('.service-price').length}`;
	document.getElementById('servicePrice').innerHTML = `${total}`;
}

//서비스 시술 저장
function insertServiceProduct(view){
	const parent     = document.querySelector('li.pro-con.show');
	const selectList = document.querySelectorAll('.service-insert-result li');
	const groupSeq   = document.getElementById('groupSeq');
	let itemList = new Array();
	
	if (selectList.length == 0) {
		alert('서비스 시술을 추가해주세요.');
		return;
	}
	
	selectList.forEach((item) => {
		itemList.push(item.dataset.code);
	});
	
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"userId"       : document.getElementById("userId").value,
		"resNo"        : document.getElementById("serviceResno").value,
		"resGroupCode" : document.getElementById("resGroupCode").value,
		"resGroupSeq"  : document.getElementById("resGroupSeq").value, 
		"groupSeq"     : !isNullStr(groupSeq) ? groupSeq.value : '1',
		"itemList"     : itemList.toString(),
		"view"         : view,
		"isNew"        : document.getElementById("isNew").value
	};
	
	commonAjax.call("/res/insertServiceProduct", "POST", params, function(data){
		if (data.message == "OK") {
			alert('서비스 시술이 추가되었습니다.');
			appendPopupClose();                       //팝업 닫기
			addServicePro(parent , data.resultList);  //서비스 시술 추가
		}
	}); 
}

//서비스, 환불 등 (추가)하는 상품들을 닫기 함수를 따로 적용
function appendPopupClose(){
	const parent = document.querySelector('.sub-pop');		    	
    parent.classList.remove('active');
    parent.querySelector('#popupInner').setAttribute("class", "");
    parent.querySelector('#popupInner').innerHTML = "";

   	subPop = false;
   	isClick = true;
   	
   	document.querySelector('li.pro-con.show').classList.remove('show');
   	
   	//기존 서브팝업 닫기 이벤트로 변경 
	parent.querySelector('.popup-overlay').setAttribute('onclick', 'subPopupClose()');
	parent.querySelector('.del-btn').setAttribute('onclick', 'subPopupClose()');
}

/**
 * 상품 고유 번호 최대값
 * @param {String} type - (type : seq , type : id)
 */
function getSeqMax(type){
	let inputs;
	const maxArray = new Array();

	if (type == 'seq') {
		inputs = document.querySelectorAll('.items');
		inputs.forEach((ele) => {
			const type = ele.closest('li.pro-con').dataset.type;
			if (type == 'E') {                                //상품이 여러개 있는 이벤트 시술의 경우 
				const eventSeq = ele.dataset.seq.split(',');
				eventSeq.forEach((ele) => {
					maxArray.push(Number(ele));
				});
			} else {
				maxArray.push(Number(ele.dataset.seq));	
			} 
		});	
	} else {
		inputs = document.querySelectorAll('input.rec-check:not(#adviceYn)');
		inputs.forEach((ele) => {
			if (!isNullStr(!ele.id.includes('pack'))) {
				maxArray.push(Number(ele.getAttribute('id').split('-')[1]));
			}
		});
	}
	
	if (maxArray.length > 0) {
		return Math.max(...maxArray);		
	} else {
		return 0;
	}
}

/**
 * 서비스 시술 추가하기
 * @param {String} area   - 그려질 영역
 * @param {String} params - 서비스 시술 내용 
 */
function addServicePro(area , params){
	const parent      = area.closest('div').className;
	const parentType  = parent.includes('reserve') ? 'reserve' : 'product';
	const type        = area.dataset.type;
	const temp        = document.createElement('li');
	
	let maxId  = getSeqMax('id');
	
	params.forEach((item) => {
		maxId++;
		
		const temp   = document.createElement('li');	
		temp.classList.add('service');
		temp.innerHTML = 
			`<div class="check">
	            <input type="checkbox" class="rec-check items" id="${parentType}-${maxId}" data-seq="${item.itemSeq}">
	            <label for="${parentType}-${maxId}"></label>
	            <label for="${parentType}-${maxId}">
	            	<div class="service-status">서비스</div>
	            	<p>${item.itemName}</p>
	            	<span class="change-amount">(${item.itemPrice} → 0)</span>
            	</label>
	        </div>`;
		
		let subParent;  //child-select
		if (type == 'E' || type == 'N') {
			subParent = area.querySelectorAll('ul')[0];
			subParent.append(temp);
		}
		
		if (type == 'P') {
			temp.classList.add('con');
			subParent = area.querySelectorAll('ul')[0].querySelectorAll('li:not(.con)')[item.groupSeq - 1];
			subParent.querySelector('ul').append(temp);
		}
		
		if (type == 'C') {
			if (parentType == 'reserve') {
				subParent = area.children[2]
			} else {
				subParent = area.children[3]; 
				subParent.style.display = 'block';
			}
			
			subParent.append(temp);
		}
	});
	
	allCheck(`${parentType}-result-select`); //패키지 시술 전체체크 재실행
	area.classList.remove('show');
}

//환불 시술 팝업
function popRefundPro(target){
	const parent = target.closest('li.pro-con');
	const type   = parent.dataset.type;
	
	parent.classList.add('show');
	
	const content = 
        `<input type="hidden" id="resGroupCode" value="${parent.dataset.code}">
         <input type="hidden" id="resGroupSeq" value="${parent.dataset.seq}">
         <input type="hidden" id="refundResno" value="${parent.dataset.resno}">
        
         <div class="popup-tit">
        	<div class="text">
	            <p>환불 요청</p>
        		<span>환불된 시술은 다시 사용할 수 없습니다.</span>	
        	</div>
         </div>
       
        <div class="popup-con refund-wrap" style="width:460px;">
			<div class="refund-item-con">
				<div class="input-wrap">
					<label class="need refund-title">남은 시술권</label>
					<input type="text" class="refund-title" disabled>
				</div>
				
				<div class="input-wrap">
					<label class="need">결제금액</label>
					<input type="text" class="origin-price" disabled>
				</div>
			</div>
			
			<div class="refund-child-con scroll"></div>
        	
        	<div class="btn-area">
	        	<button type='button' class="save-btn blue-btn" onclick="updateRefundProduct('${type}')">환불하기</button>
        	</div>
		</div>`;
	
	commonDrawPopup("draw", content);
	
	if (type == 'E' || type == 'N') {
 		document.querySelector('.refund-wrap').style.width = '590px';
 		document.querySelector('.refund-item-con').innerHTML +=
			`<div class="input-wrap">
				<label class="need">환불 금액</label>
				<input type="text" class="refund-price" onkeyup="commonMoneyFormat(this.value , this)">
			</div>`;
	} 
	
	if (type == 'P') {
		document.querySelector('.refund-wrap').style.width = '460px';
		document.querySelector('.refund-child-con').style.display = 'flex';
	}
	
	if (type == 'C') {
		const cnt       = parent.querySelector('.pro-tit').querySelectorAll('bold');
		const remainCnt = Number(cnt[1].innerText) - Number(cnt[0].innerText);
		
		document.querySelector('.refund-wrap').style.width = '720px';
		document.querySelector('label.refund-title').innerHTML += `<bold>(남은 포인트 ${remainCnt}P)</bold>`;
		document.querySelector('.refund-item-con').innerHTML +=
			`<div class="input-wrap">
				<label class="need">환불포인트</label>
				<input type="text" class="refund-point">
			</div>
			
			<div class="input-wrap">
				<label class="need">환불금액</label>
				<input type="text" class="refund-price" onkeyup="commonMoneyFormat(this.value , this)">
			</div>`;
	}
	
	getRefundProductList(type); //환불 시술 조회
	
   	//append 닫기 이벤트로 변경 
	document.querySelector('.sub-pop .popup-overlay').setAttribute('onclick', 'appendPopupClose()');
	document.querySelector('.sub-pop .del-btn').setAttribute('onclick', 'appendPopupClose()');
}

//환불 시술 조회
function getRefundProductList(type){
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resGroupCode" : document.getElementById('resGroupCode').value,
		"resGroupSeq"  : document.getElementById('resGroupSeq').value,
		"resNo"        : document.getElementById('refundResno').value,
	};
	
	commonAjax.call("/res/getRefundProductList", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.resultList;
			
			if (result.length > 0) {
				result.forEach((item) => {
					if (type == 'E' || type == 'N') {
						document.querySelector('.refund-item-con').dataset.seq = item.itemSeq;
						document.querySelector('.refund-item-con input.refund-title').value = item.itemTitle;
						document.querySelector('.refund-item-con input.origin-price').value = item.itemPrice;
						document.querySelector('.refund-item-con input.refund-price').value = item.refundAmount;
					}
					
					if (type == 'P') {
						if (item.groupSeq == '0') {
							document.querySelector('.refund-item-con input.refund-title').value = item.itemTitle;
							document.querySelector('.refund-item-con input.origin-price').value = item.itemPrice;
						} else {
							document.querySelector('.refund-child-con').innerHTML += 
								`<div class="refund-child-area" data-seq="${item.itemSeq}">
									<div class="input-wrap">
										<label class="need">환불 회차 시술</label>
										<input type="text" class="refund-title" value='${item.itemTitle}' disabled>
									</div>
									
									<div class="input-wrap">
										<label class="need">결제금액</label>	
										<input type="text" value='${item.refundAmount}' class="refund-price" placeholder="0" onkeyup="commonMoneyFormat(this.value , this)">
									</div>
								</div>`;
						}
					}
					
					if (type == 'C') {
						document.querySelector('.refund-item-con').dataset.seq = item.itemSeq;
						document.querySelector('.refund-item-con input.refund-title').value = item.itemTitle;
						document.querySelector('.refund-item-con input.origin-price').value = item.itemPrice;
						document.querySelector('.refund-item-con input.refund-point').value = item.refundCnt;
						document.querySelector('.refund-item-con input.refund-price').value = item.refundAmount;
					}
				});	
			} else{
				document.querySelector('.refund-item-con').innerHTML = `<li id="noSearch">환불 가능한 시술이 없습니다.</li>`
			}
		}
	});
}

//환불 시술 저장 
function updateRefundProduct(type){
	const parent   = document.querySelector('li.pro-con.show');
	let refundList = new Array();
	let status     = true;
	
	if (type == 'P') {
		const refundItem = document.querySelectorAll('.refund-child-area');
		
		refundItem.forEach((item) => {
			const refundAmount = item.querySelector('.refund-price');
			let refundJson     = new Object();
			
			refundJson.itemSeq      = item.dataset.seq;
			refundJson.refundAmount = isNullStr(refundAmount.value) ? '' : refundAmount.value;
			
			refundList.push(refundJson);
		})
	} else {
		const refundAmount = document.querySelector('.refund-price');
		let refundJson     = new Object();
		
		refundJson.itemSeq      = document.querySelector('.refund-item-con').dataset.seq;
		refundJson.refundAmount = isNullStr(refundAmount.value) ? '' : refundAmount.value;
		
		if (type == 'C') {
			const maxCnt    = document.querySelector('label.refund-title > bold').innerText.replace(/[^0-9]/g,'');
			const refundCnt = document.querySelector('.refund-point').value;
			
			if (Number(refundCnt) > Number(maxCnt)) {
				alert("환불 포인트는 남은 포인트보다 클 수 없습니다.");
				return 
			}
			
			refundJson.refundCnt = document.querySelector('.refund-point').value;
		}
		
		refundList.push(refundJson);
	}
	
	const params = {
		"hospitalCode" : document.getElementById('hospitalCode').value,
		"officeCode"   : document.getElementById('officeCode').value,
		"resNo"        : document.getElementById('refundResno').value,
		"resGroupCode" : document.getElementById('resGroupCode').value,
		"resGroupSeq"  : document.getElementById('resGroupSeq').value,
		"itemList"     : JSON.stringify(refundList)
	};

	commonAjax.call("/res/updateRefundProduct", "POST", params, function(data){
		if (data.message == "OK") {
			alert('저장되었습니다.');
			appendPopupClose();                //팝업 닫기
			addRefundPro(parent , refundList); //환불 시술 추가
		}
	});	
}

/**
 * 환불 추가하기
 * @param {String} area  - 그려질 영역
 */
function addRefundPro(area , params){
	const inputs = area.querySelectorAll('input');
	const type   = area.dataset.type;
	let refundItem , label;
	
	params.forEach((item) => {
		if (type != 'C') {
			refundItem     = area.querySelector(`input[data-seq="${item.itemSeq}"]`);
			label          = refundItem.parentElement.querySelectorAll('label');
			const itemName = label[1].querySelector('p').innerText;
		
			if (item.refundAmount != 0) {
				refundItem.setAttribute('id', 'refund-0');
				label[0].setAttribute('id', 'refund-0');
				label[1].setAttribute('id', 'refund-0');

				label[0].classList.add('hide-label');
				label[1].innerHTML =
					`<div class="refund-status">환불</div>
					 <p>${itemName}</p>
					 <span class="change-amount">(-${item.refundAmount})</span>`;
			}	
			
			//상품이 모두 환불 되었으면 전체 부모를 삭제해줌.
			const hideLabel = refundItem.closest('ul').querySelectorAll('.hide-label');
			const showLabel = refundItem.closest('ul').querySelectorAll('li');
			
			if (hideLabel.length == showLabel.length) {
				refundItem.closest('ul').closest('li').remove();
			}
		} else {
			refundItem = area.querySelector('.product-child-select');
			label      = refundItem.querySelector('.refund-status');
			
			if (isNullStr(label)) {                                    //환불 받은 기록이 없는 경우
				refundItem.style.display = 'block';
				refundItem.innerHTML +=
					`<li>
					    <div class="check">
					    	<input type="checkbox" id="refund-0" class="rec-check">
					    	<label for="refund-0" class="hide-label"></label>
					    	<label for="refund-0">
								<div class="refund-status">환불</div>
					    		<p>남은 횟수 1 Point 차감 (-5,000원)</p>
					    	</label>
					    </div>
					</li>`;
			} else {                                                   //이미 환불 받은 기록이 있는 경우
				label.parentElement.innerHTML =
					`<div class="refund-status">환불</div>
		    		 <p>남은 횟수  ${item.refundCnt} Point 차감 (-${item.refundAmount}원)</p>`;
			}
		}
 	})
	
 	area.classList.remove('show');
}

//예약접수 , 예약 확인 - 예약일 변경 팝업
function receiptReservePopup() {
	const params = {
		"userId"     : document.getElementById('userId').value,
		"userName"   : document.getElementById('name').value,
		"userMobile" : document.getElementById('mobile').value,
		"resNo"      : document.getElementById('resNo').value,
		"resDate"    : document.getElementById('reserveDate').value,
		"resTime"    : document.getElementById('reserveTime').value
	}
	
    const content = 
        `<input type="hidden" name="reserve-change"
        	data-userId     = "${params.resNo}"
        	data-userMobile = "${params.userMobile}"
        	data-resNo   = "${params.resNo}"
        	data-resDate = "${params.resDate}"
        	data-resTime = "${params.resTime}"
        	data-resType = "${params.resType}"/>
        	
         <div class="popup-tit">
         	<div class="text">	
                 <p>예약일 변경 - <span>${params.userName}</span> / ${params.userMobile}</p>
         	</div>
         </div>
         
         <div class="popup-con">		
         	<div class="pop-left">
         		<label for="date" class="need">희망 예약일</label>
				<div class="con date">
					<input type="text" class="start-date" id="newResDate" value="${params.resDate}" name="resDate" placeholder="희망 예약일" autocomplete="off">
				</div>
				
				<label for="time" class="need">희망 예약시간</label>
				<ul class="con time scroll border-style"></ul>
         	</div>
         	
 			<div class="pop-right">
    			<div>
					<label for="reserve" class="need">예약 현황</label>
					<button type="button" class="dark-small-btn" data-type="all" onclick="getAllReserveStatus(); clickTimeData();">전체 현황 확인</button> 
				</div>
				
				<div class="right-inner"></div>
 			</div>
 		</div>
 		
 		<div class="popup-btn">
            <button class="save-btn blue-btn" type="button" onclick="updateReserveDate()">변경하기</button>
        </div>`;
     
    commonDrawPopup("draw", content);
    initReserveChange(); //예약일 변경 초기함수 (res002Time.js)
}