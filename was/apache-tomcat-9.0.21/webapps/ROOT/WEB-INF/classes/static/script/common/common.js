/************************************************************************

	파일명 : script.js
	설  명 : 시스템 내부에서 공통으로 사용되는 함수를 정의한다.
	작성일 : 2022.01.25
	작성자 : LSH

	수정일      수정자   수정내용
	----------- ------- ----------------------------
	2021.12.03  이승현   최초 작성

************************************************************************/

let subPop = false;
let isPop = false;		 //팝업 호출 여부
let isClick = true;
let eventSource  = null; //SSE 연결 객체(회원관리, 예약리스트)

const csrfToken  = $("meta[name='_csrf']").attr("content");
const csrfHeader = $("meta[name='_csrf_header']").attr("content");

/**
 * 서버 응답값에 따라 메세지 호출
 * 403 : 세션 만료
 * 401 : 중복 로그인
 */
function commonExpiredProc(code) {
	if (code == 403) {
		alert("로그인 유효 시간이 만료 되었습니다.\n다시 로그인 시도해 주시기 바랍니다.");
		location.replace("/login");
	} else if (code == 401) {
		alert("동일한 아이디로 중복 로그인이 되어 자동으로 로그아웃됩니다.");
		location.replace("/login");
	}
}

//ajax 호출 공통 함수
const commonAjax = {    		
    /**
     * 비동기 방식으로 사용하며 전송 데이터는 json 형태로 지정(contentType)
     * 서버로부터 받은 데이터는 json(dataType) 
     * @param {String} url
     * @param {String} type
     * @param {*} data
     * @param {*} callBack
     */    
    call: function(url, type, data, callBack) {    
    		let params = "";

    		if (type.toLowerCase() == "post") {
    			params = JSON.stringify(data);	
    		} else {
    			params = data;
    		}    	
    	
    		$.ajax({
                url         : url, 
                type        : type,
                dataType    : "json",                 
                data 	    : params,                					           
                contentType : 'application/json;charset=UTF-8',                             
                cache       : false,
                async		: false,
                beforeSend  : function(xhr) {
                	//loading show            	
                	//$('#loadingWrap').css('display','block');
                	
                    xhr.setRequestHeader(csrfHeader, csrfToken);
                }
            })
            .done(function(data) {
                callBack(data);
            })
            .fail(function(data, status, error) {        
            	if (data.status == 403 || data.status == 401) {
            		commonExpiredProc(data.status);            		
            	} else {
            		callBack(data.responseJSON);	
            	}            	            	
            })
            .always(function() {
            	//loading hide        	
            	//setTimeout(function() {
                //	$('#loadingWrap').css('display','none');
        		//}, 3000);
            });  	    	
    },
    fileUpload: function(url, data, callBack) {    
    	$.ajax({
            url         : url, 
            type        : "POST",
            dataType    : "json",                 
            data 	    : data,                					           
            contentType : false,       
            processData : false,
            beforeSend  : function(xhr) {            
                xhr.setRequestHeader(csrfHeader, csrfToken);
            }
        })
        .done(function(data) {
            callBack(data);
        })
        .fail(function(data, status, error) {
        	commonExpiredProc(data.status);        	
        });    	
    }
};

/**
 * 빈 값을 체크하는 함수
 * @param {*} value 
 * @returns true or false
 */
function isNullStr(value) {
    if (value == "" || value == null || value == undefined || value == "undefined" || typeof value == "undefined") {
        return true;
    } else {
        return false;
    }
}

/**
 * 빈 값 체크 후 공백 리턴
 * @param {String} value 
 * @returns true or false
 */
function nvlStr(value) {
    if (value == "" || value == null || value == undefined || value == "undefined" || typeof value == "undefined") {
        return "";
    } else {
        return value;
    }
}

/**
 * 스크립트 로드 여부 체크하는 함수
 * @param js - load script url
 * @returns true or false
 */
function isScriptLoaded(js) {	
	const src = "/resources/script" + js;
	
    return document.querySelector('script[src="' + src + '"]') ? true : false;
}

/**
 * object X축 리사이즈 함수
 * @param {*} id - 적용 object id 
 * @param {int} min - 리사이즈 최소값 설정(없을시 100px)
 */
 function commonResizeX(id, min) {
    const area = document.getElementById(id);
    const newDiv = document.createElement("div");

    let xSize = 0;            
    let width = 0;
    
    newDiv.setAttribute("class", "resizer resizer-x");
    area.append(newDiv);

    const mouseDownHandler = function(e) {
        xSize = e.clientX; 
        
        const styles = window.getComputedStyle(area);

        width = (styles.width, 10);

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
    };
    
    if (isNullStr(min)) {
        min = 100;
    }

    const mouseMoveHandler = function(e) {
        const dx = e.clientX - xSize;                                        

        if ((width+dx) < min) return;

        area.style.width = `${width + dx}px`; 
    };

    const mouseUpHandler = function() {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
    };

    const resizers = area.querySelectorAll(".resizer");
    resizers[0].addEventListener("mousedown", mouseDownHandler);
}
 
/** 
 * ul - li 태그들의 Drag&Drop 함수 SortableJS 플러그인 사용
 * 참조 : https://github.com/SortableJS/Sortable
 * @param {Object} obj - 이벤트를 적용할 ul object(String 형태로 입력시 인식하지 못함)
 * @param {String} handlerClass - 이벤트 핸들러 클래스 지정
 * @param {Object} callback - 콜백함수(후 처리용)
 */
 function commonSetDragDrop(obj, handlerClass, callback) {
    var sortable = Sortable.create(obj, {        
        animation: 150,            	//animation speed
        ghostClass: 'drag-active' 	//drag object color
    });

    if (!isNullStr(handlerClass)) {
        sortable.option("handle", handlerClass);
    }    
    
    if (!isNullStr(callback)) {
    	sortable.option("onChange", function(evt) {
    		callback(obj);	
    	});
	}
}

/**
 * 페이지 호출(Tiles 사용) - 어드민 메인에서만 사용
 * @param {String} page - 페이지 URL
 * @param {Object} params - 전송 파라미터
 * @param {String} area - 페이지 호출 영역(id)
 */
function commonGoPage(page, params, area) {
	const url = "/menu" + page;

	if (!isNullStr(params)) {
		Object.defineProperty(params, "_csrf", {value : csrfToken, writable : true, enumerable : true});	
	}

	if (isNullStr(area)) {	
		/*
		 * 메뉴 호출시 내부 영역에 페이지가 로드되는 구조로 이루어져있기 때문에
		 * 페이지 뒤로가기 구현을 위해 주소 히스토리를 쌓는다.
		 */ 				 
		history.pushState(null, null, page);	
				
		//Loading bar Show       
		$('#loadingWrap').css('display','block');
		$('#main').css('display','none');	
		
		//어드민 메인에서만 사용
		$("#main").children().remove();
		$("#main").load(url, params, function(responseTxt, statusTxt, xhr) {			
			if (xhr.status == 403 || xhr.status == 401) {
				commonExpiredProc(xhr.status);				
			} else {				
				//Loading bar Hide
            	setTimeout(function() {
                	$('#loadingWrap').css('display','none');
            		$('#main').css('display','block');
            		
            		window.scrollTo(0, 0);
        		}, 1000);	
			}
		});					
	} else {			
		//특정 영역 내부에 페이지 호출
		$("#" + area).load(url, params, function(responseTxt, statusTxt, xhr) {			
			commonExpiredProc(xhr.status);					
		});				
	}
	
	document.querySelector('#popupInner').innerHTML = "";
	
	/**
	 * 2022.06.21 LSH
	 * 회원관리, 예약 리스트는 실시간 통신을 위해 SSE가 적용되었다.
	 * SSE는 페이지를 떠나도 서버단에서 체크하지 못하기 때문에 페이지 이동시 연결을 종료시켜준다.
	 */
	if (!isNullStr(eventSource) && (eventSource.readyState === 1 || eventSource.readyState === 0)) {	
		const url = eventSource.url.replace("connect", "disconnect");
		
		fetch(url);
		eventSource.close();
	}
} 
 
function commonGetQueryString() {
	const queryString  = window.location.search;
	const searchParams = new URLSearchParams(queryString);
	
	return searchParams;	
}

/**
 * 새창열기(Tiles 미사용)
 * @param {String} page - 페이지 URL
 * @param {String} title - 페이지 타이틀
 */
function commonOpenPopup(page, title, target) {
	const form = document.createElement("form");    
	const data = {
		"page"  : page,
		"title" : title
	};
	
    form.method = "POST";
    form.action = "/browse";
    form.style.display = "none";
    
    if (isNullStr(target)) {
    	form.target = "_self";
    } else {
    	form.target = target;	
    }    

    for (let key in data) {
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
}

/**
 * 공통 리스트 조회
 * @param obj - 
 * "target" : 콤보박스 아이디
 * "code"   : 코드번호
 * "defaultOpt" : "기본 옵션 텍스트"
 */
function commonCodeList(obj) {
	const objTarget = document.getElementById(obj.target);
	const defaultOpt = obj.defaultOpt;	//기본 옵션 설정

	commonAjax.call("/com/getCodeList", "POST", {"code" : obj.code}, function(data){
		if (data.message == "OK") {
			const dataList = data.resultList;

			if (!isNullStr(defaultOpt)) {			
				dataList.splice(0, 0, {"code" : "", "name" : defaultOpt});
			}
			
			//데이터 셋팅
			for (let i = 0; i < dataList.length; i++) {
				const option = document.createElement("option");
				option.value = dataList[i].code;
				option.innerText = dataList[i].name;
				
				objTarget.appendChild(option);				
			}	
		}
	});
}

/**
 * 콤보박스 셋업
 * @param obj - 
 * "target" : 콤보박스 아이디
 * "data"   : 콤보박스에 출력할 데이터
 * "defaultOpt" : "기본 옵션 텍스트"
 */
function commonInitCombo(obj) {
	const objTarget = document.getElementById(obj.target);
	const defaultOpt = obj.defaultOpt;	//기본 옵션 설정
	const dataList = obj.data;
	
	//초기화
	objTarget.innerHTML = "";
	
	//데이터가 없는 경우
	if (isNullStr(dataList)) {
		if (!isNullStr(defaultOpt)) {			
			const option = document.createElement("option");
			option.value = "";
			option.innerText = defaultOpt;
			
			objTarget.appendChild(option);	
		}		
	} else {
		if (!isNullStr(defaultOpt)) {			
			dataList.splice(0, 0, {"code" : "", "name" : defaultOpt});
		}
		
		//데이터 셋팅
		for (let i = 0; i < dataList.length; i++) {
			const option = document.createElement("option");
			option.value = dataList[i].code;
			option.innerText = dataList[i].name;
			
			objTarget.appendChild(option);				
		}	
	}		
}

/**
 * 오늘날짜(또는 요청 날짜를) 요청 타입에 따라 가져오기
 * @param {String} type - 날짜타입
 * @param {String} date - 요청날짜
 * @returns 오늘날짜
 */
function commonGetToday(type, date) {
	let today = "";
	let year, month, day;
	const now = new Date();
	
	//요청 날짜가 없는 경우 오늘날짜
	if (isNullStr(date)) {
		year  = now.getFullYear();
		month = (now.getMonth()+1 < 10 ? "0" + (now.getMonth()+1) : now.getMonth()+1);   
		day   = (now.getDate() < 10 ? "0" + now.getDate() : now.getDate());   					
	} else {
		year  = date.substr(0,4);
		month = date.substr(4,2);   
		day   = date.substr(6);	
	}
	
	if (type == "ymd") {
		today = year + month + day;	
	} else if (type == "y년m월d일") {
		today = year + "년 " + month + "월 " + day + "일";
	} else if (type == "y-m-d") {
		today = year + "-" + month + "-" + day;
	} else if (type == "y.m.d") {
		today = year + ". " + month + ". " + day;
	} else {
		today = year + month + day;
	}		
	
	return today;
}

/**
 * 요청일만큼 날짜 계산하기
 * @param {String} str - 요청일(ex. 20220426)
 * @param {String} days - 계산일
 * @returns
 */
function commonDateCalculate(str, days) {
	const year  = str.substr(0,4);
	const month = str.substr(4,2);
	const day   = str.substr(6);
	
	const date  = new Date(year, month-1, day);
	const clone = new Date(date);
	clone.setDate(date.getDate() + days);
	
	const newYear  = clone.getFullYear();
	const newMonth = (clone.getMonth()+1 < 10 ? "0" + (clone.getMonth()+1) : clone.getMonth()+1);
	const newDay   = (clone.getDate() < 10 ? "0" + clone.getDate() : clone.getDate());
	
	return newYear + "" + newMonth + "" + newDay;
}

/**
 * 특정 날짜를 받아 요일 구하기
 * @param {String} day - 날짜(ex. 2022-09-27) 
 * @returns
 */
function commonGetDayOfWeek(day) {
	const week = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = week[new Date(day).getDay()];

    return dayOfWeek;
}

/**
 * 병원리스트 가져오기
 * @param {String} hopsitalCode - 병원코드
 * @param {String} callBack - 함수 실행 후 콜백함수
 * @param {boolean} isAll - 리스트 전체 옵션여부
 * @returns
 */
function commonGetHospital(hospitalCode, callBack, isAll) {
	commonAjax.call("/com/getHospital", "POST", "", function(data) {
		const result = data.resultList;				
		
		if (data.message == "OK") {
			if (result.length > 0) {				
				let dataList = new Array();
				let comboObj;
				
				for (idx in result) {				
			        let data = new Object();
			         
			        data.code = result[idx].hospitalCode;
			        data.name = result[idx].hospitalName;

					dataList.push(data);
				}
				
				//팝업에서 조회하는 경우
				if (isPop) {
					comboObj = {"target" : "popHospitalCode", "data" : dataList};
				} else {
					if (isAll) {
						comboObj = {"target" : "hospitalCode", "data" : dataList , "defaultOpt" : "병원명 전체"};
					} else {
						comboObj = {"target" : "hospitalCode", "data" : dataList};	
					}							
				}				
				
				commonInitCombo(comboObj);	
				
				if (isNullStr(hospitalCode)) {
					hospitalCode = result[0].hospitalCode
				}
				
				commonGetOffice(hospitalCode, callBack, isAll);
			}						
		}
	});
}

/**
 * 지점리스트 가져오기
 * @param {String} value - 병원코드
 * @param {String} callBack  - 함수 실행 후 콜백함수
 * @param {boolean} isAll - 리스트 전체 옵션여부
 * @returns
 */
function commonGetOffice(value, callBack, isAll) {	
	commonAjax.call("/com/getOffice", "POST", {"hospitalCode" : value}, function(data) {
		const result = data.resultList;				
		
		if (data.message == "OK") {
			let dataList = new Array();
			let comboObj;
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].officeCode;
		        data.name = result[idx].officeLocation;

				dataList.push(data);
			}			

			if (isPop) {
				comboObj = {"target" : "popOfficeCode", "data" : dataList};				
			} else {
				if (isAll) {
					comboObj = {"target" : "officeCode", "data" : dataList , "defaultOpt" : "병원위치 전체"};
				} else {
					comboObj = {"target" : "officeCode", "data" : dataList};	
				}			
			}	
			
			commonInitCombo(comboObj);
				
			//콜백함수 호출
			if (!isNullStr(callBack)) {
				window[callBack]();	
			}		
		}			
	});
}

/**
 * 병원 사이트 주소 넣기
 * @param {String} target - 표시될 위치
 * @param {*} params - 병원,지점 코드
 * @param {String} text - 추가 내용
 * @returns 지점 주소
 */
function commonSetOfficeSite(target, params, text) {
	commonAjax.call("/com/getOfficeSite", "POST", params, function(data){
		if (data.message == "OK") {
			const officeSite  = data.officeSite;
			const accessToken = data.accessToken;
			
			document.querySelector(target).innerHTML = "";
			document.querySelector(target).innerHTML = officeSite;
			
			document.querySelector(target).setAttribute("href"  , officeSite);
			document.querySelector(target).setAttribute("target", '_blank');
			/**
			 * 2022.11.11 LSH
			 * REST 서버 호출시 사용될 액세스 토큰
			 */
			document.querySelector(target).dataset.token = accessToken;
			
			if (!isNullStr(text)) {
				document.querySelector(target).innerHTML += text;
				
				document.querySelector(target).setAttribute("href"  , officeSite + text);
				document.querySelector(target).setAttribute("target", '_blank');
			}
		}
	});	
}

/**
 * 직렬화된 배열을 키와 값으로 변환하여 리턴하는 함수
 * @param formArray(serializeArray)
 * @returns 키:값 데이터
 */
function commonArrayToJson(formArray) {	
	let rtnObj = {};
	
	for (var i = 0; i < formArray.length; i++) { 
		rtnObj[formArray[i]['name']] = formArray[i]['value']; 
	}
	
	return rtnObj; 
}

/**
 * 특정 폼안의 requried 옵션이 붙은 요소에 대해 필수값을 체크하는 함수
 * @param frm - form 태그 구분값(id or class or name)
 * @returns true or false
 */
function commonCheckRequired(frm) {
	const form = document.querySelector(frm);
	
	for (let i = 0; i < form.elements.length; i++) {
	    if (form.elements[i].value === "" && form.elements[i].hasAttribute("required")) {	    	
	    	const parent = form.elements[i].parentElement;
	    	
	    	if (parent.classList.contains('file-upload') || parent.classList.contains('img-wrap')) {
	    		parent.style.border = '1px solid red';
	    	}

	    	form.elements[i].focus();
	    	form.elements[i].style.border = '1px solid red';
	    	alert("필수 입력값을 확인해 주세요.");
	    	
	    	return false;
	    }
	}
	
	return true;
}

/**
 * 특정 폼안의 data-object 속성이 있는 요소를 초기화하는 함수
 * @param frm - form 태그 구분값(id or classr or name)
 * @returns
 */
function commonFormReset(frm) {
    const form = document.querySelector(frm);

    $.each(form, function(index, element) {
    	if ($(element).is("[data-object]")) {
            if ($(element).is("select") === true) {                        
                $(element).find('option:first').prop("selected", "selected");
            }
            
            if ($(element).is("textarea") === true) {
            	$(element).val("");
            }
            
            if ($(element).is("input") === true) {
            	if ($(element).prop("type") === "text" || $(element).prop("type") === "hidden") {
            		$(element).val("");	
            	}
            	
            	if ($(element).prop("type") === "checkbox") {
                    $(element).prop("checked", true);            		
            	}
            	
            	if ($(element).prop("type") === "radio") {
            		$("input:radio[name="+ $(element).prop("name") +"]").eq(0).prop("checked", true);	
            	}
            	
            	if ($(element).prop("type") === "file") {
            		$(element).replaceWith($(element).clone(true));
                    $(element).val("");
            	}
            }            
        }
    });
        
    $.each($("img"), function(index, element) {
        if ($(element).is("[data-object]")) {
            $(element).prev().show();
        	$(element).hide();
            $(element).prop("src", "");
        }                
    });
    
    $.each($("video"), function(index, element) {
        if ($(element).is("[data-object]")) {        	
            $(element).prop("src", "");
        }                
    }); 
    
    $.each($(".swiper-slide"), function(index, element) {        
    	if ($(element).is("[data-object]")) {
    		$(element).css({"background-image":"url()"}); 		
        }                
    });
}

/** 
 * ul - li 태그들의 Drag&Drop 함수 SortableJS 플러그인 사용
 * 참조 : https://github.com/SortableJS/Sortable
 * @param {Object} obj - 이벤트를 적용할 ul object
 * @param {String} handlerClass - 이벤트 핸들러 클래스 지정
 * @param {Object} callback - 콜백함수(후 처리용)
 */
 function commonSetDragDrop(ul, handlerClass, callback) {
	const obj = document.querySelector(ul);
	
    var sortable = new Sortable(obj, {
    	animation: 150,            	//animation speed
        ghostClass: 'drag-active' 	//drag object color
	});
	    
    if (!isNullStr(handlerClass)) {
        sortable.option("handle", handlerClass);
    }    
    
    if (!isNullStr(callback)) {
    	sortable.option("onChange", function(evt) {
    		callback(obj);	
    	});
	}
}
 
 /** 
  * 체크박스를 제어하는 함수
  * @param {Object} obj - 체크박스(this)
  * @param {String} state - 상태 
  */
 function commonToggle(obj, state) {
    const content = obj.parentNode.parentNode.nextElementSibling;
    const input = content.querySelectorAll('input');
    const file = content.querySelectorAll('input[type="file"]');
    const textArea = content.querySelectorAll('textarea');
    
    if (!isNullStr(state)) {
     	state == 'Y' ? obj.checked = true : obj.checked = false;	
    }
	  
    if (obj.checked == true) {    	
    	content.style.opacity="1";
    	
    	input.forEach((ele) => ele.readOnly = false);
    	file.forEach((ele) => ele.disabled = false);
    	textArea.forEach((ele) => ele.readOnly = false);
    } else {    	
  	    content.style.opacity="0.5";
  	     
  	    input.forEach((ele) => ele.readOnly = true);
  	    file.forEach((ele) => ele.disabled = true);
  	    textArea.forEach((ele) => ele.readOnly = true);
    }
}

/**
 * 템플릿에 있는 팝업 호출 
 * @param {String} type - load:페이지로드/draw:HTML
 * @param {String} content
 * - (type)load : load 페이지 URL
 * - (type)draw : 팝업 내부에 들어갈 HTML 소스
 * @param {Object} params - 다른 페이지로 넘길 파라미터
 * @returns
 */
function commonDrawPopup(type, content, params) {	
	let popup = document.querySelector('.popup');
	
	if (type === "load") {
		if (!isNullStr(params)) {
			Object.defineProperty(params, "_csrf", {value : csrfToken, writable : true, enumerable : true});	
		}

	    $("#popupInner").load("/menu" + content, params, function(responseTxt, statusTxt, xhr) {			
			commonExpiredProc(xhr.status);

			setTimeout(function(){
				popup.classList.add('active');
			}, 0);
		});	
	} else {	
		if (isPop) {
			popup =  document.querySelector('.sub-pop');
		}
		
		popup.querySelector('#popupInner').innerHTML = content;
		popup.classList.add('active');
		
		isPop ? subPop = true : isPop = true;
	}
	
	isPop = true;

	document.querySelector('body').classList.add('no-scroll');
}

/**
 * 파일을 읽은 후 파일 타입에 따라 처리하는 함수
 * @param ele - 파일
 * @param type - 파일 타입(img:이미지,video:비디오)
 * @returns
 */
function commonfileReader(ele, type) {
    const reader = new FileReader();
    const file = ele.files[0];

    if (type === "img") {
    	const imageTypes = [
    		'tiff', 'pjp'  , 'jfif', 'bmp' , 'gif',
    		'svg' , 'png'  , 'xbm' , 'dib' , 'jxl',
    		'jpeg', 'svgz' , 'jpg' , 'webp', 'ico',
    		'tif' , 'pjpeg', 'avif' 
    	];    	    
    	const image = file.name.split('.').pop().toLowerCase();    	

    	//이미지 확장자 체크
    	if (imageTypes.indexOf(image) === -1) {
    		alert("파일 확장자를 확인해주세요.");
    		return;
    	}
    	
    	//이미지 용량 1MB 제한
    	if (file.size > 1024 * 1024) {
            alert("1MB 이하의 이미지만 업로드할 수 있습니다.");
            return;
        }
    	
    	reader.onload = function() {
    		const obj = ele.parentNode.querySelector(type);    		
    		//파일 태그 다음에는 항상 히든 태그가 존재해야함
    		ele.nextElementSibling.value = reader.result;

			/*
			 * 이미지가 없는 경우
			 * 파일 태그 부모-부모 태그 배경에 그리도록 지정
			 */
			if (isNullStr(obj)) {
				ele.parentNode.parentNode.parentNode.style.backgroundImage = `url(${reader.result})`;	        
			} else {
				obj.style.display = 'block';
		        obj.src = reader.result;
		        
		        ele.parentNode.querySelector('i').style.display = 'none';
		        
		        const nextElement = ele.parentNode.nextElementSibling;
		        !isNullStr(nextElement) ? nextElement.classList.add('show') : null;
			}    
    	}
    	
        reader.readAsDataURL(file);
    } else if (type === "video") {
    	const videoTypes = [
    		'ogm', 'wmv' , 'mpg', 'webm', 'ogv', 'mov',
    		'asx', 'mpeg', 'mp4', 'm4v' , 'avi'    		
    	];    	    
    	const video = file.name.split('.').pop().toLowerCase();    	

    	//비디오 확장자 체크
    	if (videoTypes.indexOf(video) === -1) {
    		alert("파일 확장자를 확인해주세요.");
    		return;
    	}
    	
    	//비디오 용량 25MB 제한
    	if (file.size > 1024 * 1024 * 25) {
            alert("파일 용량이 너무 큽니다.");
            return;
        }
    	
    	const mainVideo = ele.parentNode.parentNode.parentNode.querySelector('video');    	
    	
    	mainVideo.nextElementSibling.value = URL.createObjectURL(file);
    	mainVideo.src = URL.createObjectURL(file);
    	mainVideo.play();
    }
}

/**
 * 금액 포맷 함수(숫자 3자리마다 콤마)
 * @param str - 문자
 * @param target - 금액 출력 영역
 */
function commonMoneyFormat(str, target) {	
	const num =  str.toString()
				.replace(/[^\d]+/g, '')
				.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	
	!isNullStr(target) ? target.value = num : null;
	
	return num;
}

/**
 * @param arr - id 값을 담고 있는 배열
 * @param type - 날짜 포맷 형식 (요일이 있으면 day)
 * @param event - 날짜 select 후 실행 될 함수
 * @param today - 오늘 이후 날짜만 표시 
 */
function commonDatePicker(arr , type , event , today){
	var date = new Date();
	var dp;
	var format;   //날짜 포맷 형식
	var position; //달력 위치값
	var min_date; //오늘 날짜 이후 표시 옵션
	
	if (arr.length > 1) {		
		for (let i = 0; i < arr.length; i++) {
			dp = $(`#${arr[i]}`).datepicker({
				language: 'en',
				dateFormat : 'yyyy-mm-dd',
				autoClose : true,
				clearBtn : true,
				onSelect: function (date) {
					var date = date;
					
					if (i == 0) {
						$(`#${arr[1]}`).datepicker({minDate: new Date(date)});	
					} else {
						$(`#${arr[0]}`).datepicker({maxDate: new Date(date)});	
					}
					
					for (let j = 0; j < arr.length; j++) {
						const div = document.getElementById(`${arr[j]}`);
						if (!isNullStr(div.value)) {
							const array = div.value.split('-');
							div.value = `${array[0]}년 ${array[1]}월 ${array[2]}일`;		
						}
					}
					
					!isNullStr(event) ? event() : null;
				}
			});	
		}	
	} else {		
		if (type == 'day') {
			format = 'yyyy 년 mm 월 dd 일 D'; 
			position = 'bottom center';
		} else {
			format = 'yyyy 년 mm 월 dd 일';
		}
		
		today ? min_date = date : '';
		
		dp = $(`#${arr[0]}`).datepicker({
			language: 'en',
			dateFormat : format,
			autoClose : true,
			clearBtn : true,
			minDate : min_date,
			position: position,
			onSelect : function(date){
				const selectDate = date.replace(' 년', '년').replace(' 월', '월').replace(' 일', '일');
				document.getElementById(`${arr[0]}`).value = selectDate;
				
				if(!isNullStr(event)){
					event(selectDate)	
				}
			}
		});
		
		const originDate = document.getElementById(`${arr[0]}`);
		if (!isNullStr(originDate.value)) {
			originDate.value = originDate.value.replace(' 년', '년').replace(' 월', '월').replace(' 일', '일');
		}
	}
}

//팝업 중복 클릭 방지 함수
function commonDoubleClick() {
	if (isClick) {
		isClick = false;
        return true;
	} else {
		return false;
	}
}