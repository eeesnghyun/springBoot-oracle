
function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;	
	document.getElementById("officeCode").value = officeCode;	
	
	mainSlide();  //PC메인 슬라이드
	mMainSlide(); //모바일 슬라이드
	
	getHomeMain();
}

var pcSwiper;
var mobileSwiper;
//메인 슬라이드
function mainSlide(){
	pcSwiper = new Swiper(".pcSwiper", {
		touchRatio: 0,
		allowTouchMove: false,
	    pagination: {
	        el: ".swiper-pagination",
	        clickable: true,
	        renderBullet: function (index, className) {
	            return '<span class="' + className + '">' + (index + 1) + "</span>";
	        }
	    },
	});
}

function mMainSlide(){
	mobileSwiper = new Swiper(".mobileSwiper", {
	    slidesPerView: 3.5,
	    spaceBetween: 10,
	    on: {
	    	init: function () {
	    		thisSlide = this;
	    		const inputs = document.querySelectorAll('.mobileSwiper input');
	    		
	    		inputs.forEach((ele) => {
	    			ele.addEventListener('focus', function(){
	    				thisSlide.allowTouchMove = false;
	    			})
	    		});
	    		
	    		inputs.forEach((ele) => {
	    			ele.addEventListener('blur', function(){
	    				thisSlide.allowTouchMove = true;
	    			})
	    		});
	    	}
	    }
	});	
}

function selectMainType(area, target) {
	const parent     = document.querySelector(`.${area}`);
	const type       = parent.querySelector(`input.${target}`);
    const div        = parent.querySelectorAll('.type');       
    
	div.forEach((ele) => ele.classList.remove('active'));
	parent.querySelector(`.type.${target}`).classList.add('active');

    const require = parent.querySelectorAll('.require');
    require.forEach((ele) => ele.required = false);
    parent.querySelector(`.type.${target}`).querySelector('.require').required = true;

}

function calPercent(con) {
    const percent = con.parentNode.parentNode.querySelector('.percent');    
    const origin = con.parentNode.querySelector('.origin').value.replace(/,/g,"");
    const sale = con.parentNode.querySelector('.sale').value.replace(/,/g,"");
    var result = Math.floor(100 - (sale / origin * 100));
    
    if (isNullStr(origin) || isNullStr(sale)) {
    	percent.innerHTML = '00';
    } else {
    	if (result > 0) {
    		percent.innerHTML = result
    	} else {
    		percent.innerHTML = '00';	
    	}
    }
    
    con.value = commonMoneyFormat(con.value);
}

function tabSlider() {
    const tit = document.querySelectorAll('.tab-tit li');
    const con = document.querySelectorAll('.tab-con li');
    
    for (let i = 0; i < tit.length; i++) {
        tit[i].addEventListener('click',function() {
            tit.forEach((ele) => ele.classList.remove('active'));
            con.forEach((ele) => ele.classList.remove('active'));
            
            tit[i].classList.add('active');
            con[i].classList.add('active');
        });
    }
}

function drawPopup() {
    commonDrawPopup("load", "/pge/pge003Popup");
}

function getHomeMain() {   
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
		
	commonAjax.call("/pge/getHomeMain", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.result;
			const type   = result.homeMain.mainType;
			
			commonFormReset("#frm");						//폼 초기화
			commonSetOfficeSite("#homePageUrl", params);	//홈페이지 주소											

			if (!isNullStr(type)) {
				setMainData(result, false);					
			} else {
				setMainDefault();						
			}				
		} else {
			alert(data.message);
		}		
	});				
}

function getHomeMainCallPop() {   
	const params = {
		"hospitalCode" : document.getElementById("popHospitalCode").value,
		"officeCode"   : document.getElementById("popOfficeCode").value
	};
		
	commonAjax.call("/pge/getHomeMain", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.result;
			const type   = result.homeMain.mainType;
				
			commonFormReset("#frm");						    //폼 초기화
			
			if (!isPop) {
				//불러오기 일때는 주소를 바꾸지 않음
				commonSetOfficeSite("#homePageUrl", params);	//홈페이지 주소		
			}									
			
			if (!isNullStr(type)) {
				setMainData(result, true);					
			} else {
				setMainDefault();
			}				
		} else {
			alert(data.message);
		}			
	});
}

function setMainData(result, isDown) {
	//메인공통		
	commonToggle(document.querySelector('input[name="showPost"]'), result.homeMain.showPost);
	commonToggle(document.querySelector('input[name="showSearch"]'), result.homeMain.showSearch);
	commonToggle(document.querySelector('input[name="showTab"]'), result.homeMain.showTab);
	
	document.querySelector('input[name="title1Post"]').value  = nvlStr(result.homeMain.title1Post);
	document.querySelector('input[name="title2Post"]').value  = nvlStr(result.homeMain.title2Post);
	document.querySelector('input[name="title1Tab"]').value   = nvlStr(result.homeMain.title1Tab);
	document.querySelector('input[name="title2Tab"]').value   = nvlStr(result.homeMain.title2Tab);				
	document.querySelector('input[name="orderPost"]').value   = nvlStr(result.homeMain.orderPost);
	document.querySelector('input[name="orderSearch"]').value = nvlStr(result.homeMain.orderSearch);
	document.querySelector('input[name="orderTab"]').value    = nvlStr(result.homeMain.orderTab);					
	document.getElementById('post').style.order   = nvlStr(result.homeMain.orderPost);
	document.getElementById('search').style.order = nvlStr(result.homeMain.orderSearch);
	document.getElementById('tab').style.order    = nvlStr(result.homeMain.orderTab);											
	
	//메인영역
	const main    = result.areaMain;
	const mainDiv = document.querySelector('.col1');
	
	document.querySelector(`input.${result.homeMain.mainType}`).checked = true;
	selectMainType('col1' , result.homeMain.mainType);
	
	for(let i = 0; i < main.length; i++) {
		if (main[i].mainType == 'slide') {
			mainDiv.querySelectorAll('.slide input[name="content2"]')[i].value = nvlStr(main[i].mainContent2);
			mainDiv.querySelectorAll('.slide input[name="content1"]')[i].value = nvlStr(main[i].mainContent1);
			
			mainDiv.querySelectorAll('.slide .url')[i].value = nvlStr(main[i].mainUrl);
			mainDiv.querySelectorAll('input[name="mainImage"]')[i].value = nvlStr(main[i].mainImage);	
		} else {
			mainDiv.querySelector('.video input[name="content2"]').value = nvlStr(main[i].mainContent2);
			mainDiv.querySelector('.video input[name="content1"]').value = nvlStr(main[i].mainContent1);	
			
			if (!isNullStr(main[i].mainVideo)) {
				if (isDown) {
					window.open("/api/download/" + main[i].mainVideo);	
				}
				
				mainDiv.querySelector('input[name="mainVideo"]').value = main[i].mainVideo;
				
				const video = mainDiv.querySelector('.video video');
				video.src = "https://beautyall.app/files/" + main[i].mainVideo;	
			}	
		}
	}	
	
	getImg(main , 'main');	
	
	//모바일 메인 영역
	const mobileMain = result.areaMainMobile;
	const mobileDiv  = document.querySelector('.col5');
	
	mobileDiv.querySelector(`input.${result.homeMain.mobileMainType}`).checked = true;
	selectMainType('col5' , result.homeMain.mobileMainType);
	
	for (let i = 0; i < mobileMain.length; i++) {
		if (mobileMain[i].mainType == 'slide') {
			mobileDiv.querySelectorAll('.slide input[name="content2"]')[i].value = nvlStr(mobileMain[i].mmainContent2);
			mobileDiv.querySelectorAll('.slide input[name="content1"]')[i].value = nvlStr(mobileMain[i].mmainContent1);
			
			mobileDiv.querySelectorAll('.slide .url')[i].value = nvlStr(mobileMain[i].mmainUrl);
			mobileDiv.querySelectorAll('.slide input[name="mainImage"]')[i].value = nvlStr(mobileMain[i].mmainImage);		
		} else {
			mobileDiv.querySelector('.video input[name="content2"]').value = nvlStr(mobileMain[i].mmainContent2);
			mobileDiv.querySelector('.video input[name="content1"]').value = nvlStr(mobileMain[i].mmainContent1);	
			
			if (!isNullStr(mobileMain[i].mmainVideo)) {
				if (isDown) { 
					window.open("/api/download/" + mobileMain[i].mmainVideo);	
				}
				
				mobileDiv.querySelector('input[name="mMainVideo"]').value = mobileMain[i].mmainVideo;

				const video = mobileDiv.querySelector('.video video');
				video.src = "https://beautyall.app/files/" + mobileMain[i].mmainVideo;	
			}	
			
			if (!isNullStr(mobileMain[i].mvideoPoster)) {
				const posterArea = document.querySelector('li.poster-area');
				posterArea.querySelector('input[name="mVideoPoster"]').value = mobileMain[i].mvideoPoster;
				posterArea.style.backgroundImage = `url(${mobileMain[i].mvideoPoster})`;
			}
		}
	}
	
	getImg(mobileMain , 'mMain');	
	
	//포스트영역
	const percent = document.querySelectorAll('.percent');
	
	for (let i = 0; i < result.areaPost.length; i++) {
		document.querySelectorAll('input[name="postImage"]')[i].value      = nvlStr(result.areaPost[i].postImage);
		document.querySelectorAll('input[name="postTag"]')[i].value        = nvlStr(result.areaPost[i].postTag);
		document.querySelectorAll('input[name="postTitle"]')[i].value      = nvlStr(result.areaPost[i].postTitle);
		document.querySelectorAll('textarea[name="postContent"]')[i].value = nvlStr(result.areaPost[i].postContent);
		document.querySelectorAll('input[name="postUrl"]')[i].value        = nvlStr(result.areaPost[i].postUrl);
		document.querySelectorAll('input[name="postPrice1"]')[i].value     = nvlStr(result.areaPost[i].postPrice1);
		document.querySelectorAll('input[name="postPrice2"]')[i].value     = nvlStr(result.areaPost[i].postPrice2);
		document.querySelectorAll('input[name="postUrl"]')[i].value        = nvlStr(result.areaPost[i].postUrl);
		
		const sale = result.areaPost[i].postPrice1.replace(',','');
		const origin = result.areaPost[i].postPrice2.replace(',','');
		
	    if (isNullStr(result.areaPost[i].postPrice1) || isNullStr(result.areaPost[i].postPrice2)) {
	    	percent[i].innerHTML = '00';
	    }
	    
		percent[i].innerHTML = Math.floor(100 - (origin / sale * 100));
	}	
	
	getImg(result.areaPost, "post");	
						
	//검색영역
	document.querySelector('input[name="searchContent1"]').value = nvlStr(result.areaSearch.searchContent1);
	document.querySelector('input[name="searchContent2"]').value = nvlStr(result.areaSearch.searchContent2);

	//탭영역
	for (let i = 0; i < result.areaTab.length; i++) {
		document.querySelectorAll('input[name="tabType"]')[i].value       = nvlStr(result.areaTab[i].tabType);
		document.querySelectorAll('input[name="tabTitle"]')[i].value      = nvlStr(result.areaTab[i].tabTitle);
		document.querySelectorAll('textarea[name="tabContent"]')[i].value = nvlStr(result.areaTab[i].tabContent);
		document.querySelectorAll('input[name="tabUrlTitle"]')[i].value   = nvlStr(result.areaTab[i].tabUrlTitle);
		document.querySelectorAll('input[name="tabPrice1"]')[i].value     = nvlStr(result.areaTab[i].tabPrice1);
		document.querySelectorAll('input[name="tabPrice2"]')[i].value     = nvlStr(result.areaTab[i].tabPrice2);
		document.querySelectorAll('input[name="tabUrl"]')[i].value        = nvlStr(result.areaTab[i].tabUrl);
		document.querySelectorAll('input[name="tabImage"]')[i].value      = nvlStr(result.areaTab[i].tabImage);
	}
		
	getImg(result.areaTab, "tab");
}

function getImg(result, target) {
	if (!isNullStr(result)) {
		if (target == 'main') {         //PC 메인영역 
			const slide = document.querySelectorAll('.pcSwiper .swiper-slide');
			
			for (let i = 0; i < result.length; i++) {
				if (result[i].mainType == 'slide') {
					slide[i].style.backgroundImage = `url(${result[i].mainImage})`;		
				}
			}
		} else if(target == 'mMain') {  //모바일 메인영역 
			const slide = document.querySelectorAll('.mobileSwiper .swiper-slide');
			
			for (let i = 0; i < result.length; i++) {
				if (result[i].mainType == 'slide') {
					slide[i].style.backgroundImage = `url(${result[i].mmainImage})`;		
				}
			}
		} else {
			const area = document.querySelector(`#${target}`);
			
			for (let i = 0; i < result.length; i++) {
				const imgSource = document.querySelectorAll(`input[name="${target}Image"]`)[i].value;
				
				if (!isNullStr(imgSource[i])) {
					area.querySelectorAll('i')[i].style.display = 'none';
					area.querySelectorAll('img')[i].src = imgSource
					area.querySelectorAll('img')[i].style.display = 'block';		
				} else {
					area.querySelectorAll('i')[i].style.display = 'block';
					area.querySelectorAll('img')[i].src = "";
					area.querySelectorAll('img')[i].style.display = 'none';	
				}
			}
		}	
	}
}

//업로드된 파일을 삭제
function delUploadFile(target){
	const parent = target.closest('li');
	const inputs = parent.querySelectorAll('input');
	
	inputs.forEach((item) => {item.value = '';});
	parent.style.backgroundImage = '';
}

function setMainDefault() {
	document.querySelector('div.slide').classList.remove('active');
	document.querySelector('div.video').classList.add('active');					
	document.getElementById('post').style.order   = '1';
	document.getElementById('search').style.order = '2';
	document.getElementById('tab').style.order    = '3';
	document.querySelector('input[name="orderPost"]').value   = '1';
	document.querySelector('input[name="orderSearch"]').value = '2';
	document.querySelector('input[name="orderTab"]').value    = '3';
		
	document.querySelectorAll('.percent').forEach((ele) => ele.innerHTML = '00');
}

function listOrder() {	
	const div = document.querySelectorAll('.list');
	
	for (let i = 0; i < div.length; i++) {
		div[i].style.display = 'none';
		div[i].previousElementSibling.classList.add('sort');
		div[i].previousElementSibling.querySelector('.toggle').style.display = 'none';
	}
	
	//메인영역(PC)	
	pcSwiper.slideTo(0);
	pcSwiper = new Swiper('.pcSwiper', {
		slidesPerView: 5,
        spaceBetween: 10,
		allowTouchMove: false,
	});

	pcSwiper.update();
	document.querySelector('.col1').classList.add('list');
	
	//메인영역(모바일)
	//1) 기존 사진 이미지 저장 
	const mList = document.querySelectorAll('.mobileSwiper li');
	var imgArr  = [];
	
	mList.forEach((ele) => {
		imgArr.push(getComputedStyle(ele).backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1'));
	});
	
	//2) 기존 모바일 슬라이드 제거 
	mobileSwiper.destroy();
	mobileSwiper = undefined;
	
    jQuery('.mobileSwiper .swiper-wrapper').removeAttr('style');
    jQuery('.mobileSwiper .swiper-slide').removeAttr('style');	
    
    //3) 새로운 슬라이드 적용
	mobileSwiper = new Swiper('.mobileSwiper', {
		slidesPerView: 5,
        spaceBetween: 10,
		allowTouchMove: false,
	});

	document.querySelector('.col5').classList.add('list');
	
	//4)이미지 다시 넣기
	for (let i = 0; i < mList.length; i++) {
		mList[i].style.backgroundImage = `url(${imgArr[i]})`;
	}
	
	imgArr = [];
	
	document.querySelectorAll('.list-input').forEach((ele) => ele.style.display = 'none');	
	document.querySelector('button.list-btn').style.display = 'none';

	commonSetDragDrop('#listOrder'  , "", callSetDragEvent);
	commonSetDragDrop('#pcOrder'    , "", callOrderReset);
	commonSetDragDrop('#mobileOrder', "", callOrderReset);
}

function callSetDragEvent(obj) {  
	document.getElementById('post').style.order = '';
	document.getElementById('search').style.order = '';
	document.getElementById('tab').style.order = '';
	
    const ulItem = document.getElementById('listOrder').children;
    
    for (let i = 0; i < ulItem.length; i++) {
        ulItem[i].dataset.seq = i + 1;
    }

	document.querySelector('input[name="orderPost"]').value   = document.getElementById('post').dataset.seq;
	document.querySelector('input[name="orderSearch"]').value = document.getElementById('search').dataset.seq;
	document.querySelector('input[name="orderTab"]').value    = document.getElementById('tab').dataset.seq;
}

//순서 텍스트 재정렬
function callOrderReset() {	
	let pcIdx = 1;
	let mIdx  = 1;

	document.querySelectorAll("#pcOrder i").forEach(function(el){
	    el.innerText = pcIdx;
	    pcIdx++;
	});
	
	document.querySelectorAll("#mobileOrder i").forEach(function(el){
	    el.innerText = mIdx;
	    mIdx++;
	});
}

function checkSave() {	
	if (commonCheckRequired("#frm")) {
		const content =  
		       `<div class="popup-con" style="width:480px">
					<div class="popup-tit">
			        	<div class="text">
				        	<p>화면 미리보기</p>
				        	<span>
					        	현재 페이지에서 변경한 내용으로 미리보기를 할 수 있습니다.<br/>
								미리보기가 필요 없으면 저장하기를 눌러주세요.
							</span>
						</div>
					</div>
			
					<div class="popup-btn">
						<button type="button" class="preview-btn dark-btn" onclick="homePreview()">미리보기</button>
						<button type="button" class="save-btn blue-btn" onclick="homeSave()">저장하기</button>
					</div>
				</div>`;
	
		commonDrawPopup("draw", content);	
	}
}

function homePreview() {		
	checkData();
	
	const params = commonArrayToJson($("#frm").serializeArray());
	
	commonAjax.call("/pge/insertHomeMainPreview", "POST", params, function(data){
		if (data.message == "OK") {				
			const page = document.querySelector(".page-url").innerHTML;

			window.open(page + "/preview/main", "_blank");
		}
	});		
}

function homeSave() {
	checkData();
	document.getElementById("frm").submit();		
}

function checkData() {
	//PC 메인영역 데이터 가공
	checkMain();
	//모바일 메인영역 데이터 가공
	checkMobileMain();
	//포스트영역 데이터 가공
	checkPost();
	//탭영역 데이터 가공
	checkTab();
}

function checkMain() {
	const main = document.querySelector('.col1');
	const type = document.querySelector('input[name="mainType"]:checked').value;
	const content1  = main.querySelectorAll(`.${type} input[name="content1"]`);
	const content2  = main.querySelectorAll(`.${type} input[name="content2"]`);
	const url       = main.querySelectorAll(`.${type} .url`);
	const mainImage = main.querySelectorAll('input[name="mainImage"]');
	
	if (type == 'slide') {
		let dataList = new Array();
			    
		for (let i = 0; i < 5; i++) {		
			if (!isNullStr(mainImage[i].value)) {
			    let data = new Object();
			    
				data.mainContent1 = content1[i].value;
				data.mainContent2 = content2[i].value;
				data.mainUrl      = url[i].value;
				data.mainImage    = mainImage[i].value;
				
				dataList.push(data);	
			}
		}
		
		const input = document.createElement("input");
		input.type  = "hidden";
		input.name  = "mainList";
		input.value = JSON.stringify(dataList);
		
		if (!isNullStr(document.querySelector('input[name="mainList"]'))) {
			document.querySelector('input[name="mainList"]').remove();
		}
		document.getElementById("frm").appendChild(input);
	} else {
		const mainContent1 = document.createElement("input");
		mainContent1.type  = "hidden";
		mainContent1.name  = "mainContent1";
		mainContent1.value = content1[0].value;
		const mainContent2 = document.createElement("input");
		mainContent2.type  = "hidden";
		mainContent2.name  = "mainContent2";
		mainContent2.value = content2[0].value;
		
		if (!isNullStr(document.querySelector('input[name="mainContent1"]'))) {
			document.querySelector('input[name="mainContent1"]').remove();
		}
		if (!isNullStr(document.querySelector('input[name="mainContent2"]'))) {
			document.querySelector('input[name="mainContent2"]').remove();
		}
		
		document.getElementById("frm").append(mainContent1, mainContent2);		
	}
}

function checkMobileMain(){
	const mMain = document.querySelector('.col5');
	const type  = document.querySelector('input[name="mobileMainType"]:checked').value;
	const content1  = mMain.querySelectorAll(`.${type} input[name="content1"]`);
	const content2  = mMain.querySelectorAll(`.${type} input[name="content2"]`);
	const url       = mMain.querySelectorAll(`.${type} .url`);
	const mainImage = mMain.querySelectorAll('input[name="mainImage"]');
    
	if (type == 'slide') {
		let dataList = new Array();
		
		for (let i = 0; i < 5; i++) {		
			if (!isNullStr(mainImage[i].value)) {
			    let data = new Object();
			    
				data.mMainContent1 = content1[i].value;
				data.mMainContent2 = content2[i].value;
				data.mMainUrl      = url[i].value;
				data.mMainImage    = mainImage[i].value;
				
				dataList.push(data);	
			}
		}	
		
		const input = document.createElement("input");
		input.type  = "hidden";
		input.name  = "mobileMainList";
		input.value = JSON.stringify(dataList);
		
		if (!isNullStr(document.querySelector('input[name="mobileMainList"]'))) {
			document.querySelector('input[name="mobileMainList"]').remove();
		}
		document.getElementById("frm").appendChild(input);
	} else {
		const mMainContent1 = document.createElement("input");
		mMainContent1.type  = "hidden";
		mMainContent1.name  = "mMainContent1";
		mMainContent1.value = content1[0].value;
		const mMainContent2 = document.createElement("input");
		mMainContent2.type  = "hidden";
		mMainContent2.name  = "mMainContent2";
		mMainContent2.value = content2[0].value;
		
		if (!isNullStr(document.querySelector('input[name="mMainContent1"]'))) {
			document.querySelector('input[name="mMainContent1"]').remove();
		}
		if (!isNullStr(document.querySelector('input[name="mMainContent2"]'))) {
			document.querySelector('input[name="mMainContent2"]').remove();
		}
		
		document.getElementById("frm").append(mMainContent1, mMainContent2);		
	}
}

function checkPost() {
	let dataList = new Array();
	
	const postImage   = document.querySelectorAll('input[name="postImage"]');
	const postTag     = document.querySelectorAll('input[name="postTag"]');
	const postTitle   = document.querySelectorAll('input[name="postTitle"]');
	const postContent = document.querySelectorAll('textarea[name="postContent"]');
	const postPrice1  = document.querySelectorAll('input[name="postPrice1"]');
	const postPrice2  = document.querySelectorAll('input[name="postPrice2"]');
	const postRate    = document.querySelectorAll(".percent");
	const postUrl  	  = document.querySelectorAll('input[name="postUrl"]');
	
	for (let i = 0; i < 5; i++) {				
        let data = new Object();

		data.postImage   = postImage[i].value; 
		data.postTag     = postTag[i].value;
		data.postTitle   = postTitle[i].value;
		data.postContent = postContent[i].value;
		data.postPrice1  = postPrice1[i].value;
		data.postPrice2  = postPrice2[i].value;
		data.postRate    = postRate[i].innerHTML;
		data.postUrl     = postUrl[i].value;
		
		dataList.push(data);
	}
	
	const input = document.createElement("input");
	input.type  = "hidden";
	input.name  = "postList";
	input.value = JSON.stringify(dataList);
	
	if (!isNullStr(document.querySelector('input[name="postList"]'))) {
		document.querySelector('input[name="postList"]').remove();
	}
	document.getElementById("frm").appendChild(input);
}

function checkTab() {
	let dataList = new Array();
	
	const tabImage    = document.querySelectorAll('input[name="tabImage"]');
	const tabType     = document.querySelectorAll('input[name="tabType"]');
	const tabTitle    = document.querySelectorAll('input[name="tabTitle"]');
	const tabContent  = document.querySelectorAll('textarea[name="tabContent"]');
	const tabPrice1   = document.querySelectorAll('input[name="tabPrice1"]');
	const tabPrice2   = document.querySelectorAll('input[name="tabPrice2"]');
	const tabUrlTitle = document.querySelectorAll('input[name="tabUrlTitle"]');
	const tabUrl      = document.querySelectorAll('input[name="tabUrl"]');
	
	for (let i = 0; i < 4; i++) {				
        let data = new Object();
         
		data.tabImage    = tabImage[i].value;
		data.tabType     = tabType[i].value;
		data.tabTitle    = tabTitle[i].value;
		data.tabContent  = tabContent[i].value;
		data.tabPrice1   = tabPrice1[i].value;
		data.tabPrice2   = tabPrice2[i].value;
		data.tabUrlTitle = tabUrlTitle[i].value;
		data.tabUrl      = tabUrl[i].value;
		
		dataList.push(data);
	}
	
	const input = document.createElement("input");
	input.type  = "hidden";
	input.name  = "tabList";
	input.value = JSON.stringify(dataList);
	
	if (!isNullStr(document.querySelector('input[name="tabList"]'))) {
		document.querySelector('input[name="tabList"]').remove();
	}
	document.getElementById("frm").appendChild(input);
}