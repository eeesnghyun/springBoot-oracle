function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	commonDatePicker(["startDate" , "endDate"] , '' , changeDataList);
	
	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;	

	//날짜 별 데이터 타입별 버튼 이벤트
    const btn = document.querySelectorAll('.btn-area button');
    let type = '';
    
    btn.forEach((ele) => {
    	ele.addEventListener('click',function(){
			type = ele.dataset.type;
			
			btn.forEach((item) => item.classList.remove('active'));
			ele.classList.add('active');
			
			getPushStatisticDetail(type , '1');
		});
    })
    
    //이번달 1일 부터 오늘까지 날짜 넣기(기본값)
    let date = new Date();
    let firstDate , todayDate;
    
    firstDate = new Date(date.getYear(), date.getMonth(), 1);    
    firstDate = date.getFullYear() + '년 '
				+ ("0" + (1 + firstDate.getMonth())).slice(-2) + '월 ' 
				+ ("0" + firstDate.getDate()).slice(-2) + '일';
    
    document.getElementById('startDate').value = firstDate;
    
    todayDate = new Date();    
    todayDate = date.getFullYear() + '년 '
				+ ("0" + (1 + todayDate.getMonth())).slice(-2) + '월 ' 
				+ ("0" + todayDate.getDate()).slice(-2) + '일';
    
    document.getElementById('endDate').value = todayDate;
    
    getSendPushList(); //푸시발송 리스트 콤보박스
    
    window.setTimeout(() => {
    	changeDataList(); //데이터 조회
    },100);
}

//데이터 조회
function changeDataList(){
	const type = document.querySelector('.btn-area button.active').dataset.type;
	
	if (!isNullStr(commonGetQueryString())) {
		document.getElementById("sort").value = commonGetQueryString().get("seq");
	}
	
	getTotalPushStatistic();                 //전체 푸쉬 발송 통계 조회
	getPushStatisticDetail(`${type}` , '1'); //푸쉬 날짜/시간별 데이터 조회
}

//푸시 발송 리스트 콤보박스 
function getSendPushList(){
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/psh/getSendPushList", "POST", params, function(data) {
		if (data.message == "OK") {
			const result = data.resultList;
			
			if (result.length > 0) {				
				let dataList = new Array();
				
				for (idx in result) {				
			        let data = new Object();
			         
			        data.code = result[idx].code;
			        data.name = result[idx].name;

					dataList.push(data);
				}
				
				const comboObj = {"target" : "sort", "data" : dataList , "defaultOpt" : "전체 리스트"};				
				
				commonInitCombo(comboObj);	
			}						
		}
	});			
}

//전체 푸쉬 발송 통계 조회
function getTotalPushStatistic() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"start" 	   : document.getElementById("startDate").value.replace(/[^0-9]/gi,""), 	
		"end"	       : document.getElementById("endDate").value.replace(/[^0-9]/gi,""),
		"pushSeq"      : document.getElementById("sort").value
	};
	
	commonAjax.call("/psh/getTotalPushStatistic", "POST", params, function(data) {
    	commonSetOfficeSite(".page-url", params);
    	
		if (data.message == "OK") {
			const result = data.result;
			
			if (isNullStr(result) || data.result.totalCnt == 0) {
				document.querySelector('.round-chart').classList.remove('active');
				document.querySelector('.bar-chart').classList.remove('active');
			} else {
				document.querySelector('.round-chart').classList.add('active');
				document.querySelector('.bar-chart').classList.add('active');
				
				drawRound(data.result); //발송 대상별 점유율 차트 그리기
				drawBar(data.result);   //발송통계 차트 그리기	
			}			
		}
	});		
}

//발송 대상별 점유율 차트 그리기
function drawRound(data){
    var myChart = echarts.init(document.getElementById('round'));

    var option = {
		tooltip: {
			trigger: 'item',
		    formatter: '{b} : {d}%',
	        backgroundColor: '#F6F8FC',
	        borderWidth: 1,
	        borderRadius: 4,
		},
		series: [
			{
			  type: 'pie',
			  radius: ['65%', '95%'],
			  avoidLabelOverlap: false,
			  label: {
			    show: false,
			    position: 'left'
			  },
			  emphasis: {
			    label: {
			      show: true,
			      fontSize: '20',
			      fontWeight: 'bold'
			    }
			  },
			  labelLine: {
			    show: false
			  },
			  data: [
				{ value: data.iosPercent, name: 'ios' },
				{ value: data.androidPercent, name: 'Android' }
		      ]
		    }
		  ]
		};
		    
    myChart.setOption(option);
    
    //라벨 데이터 변경 
    document.getElementById("iosPercent").innerText = data.iosPercent;
    document.getElementById("androidPercent").innerText = data.androidPercent;	
}

//발송통계 차트 그리기
function drawBar(data){
	document.querySelector('.all').style.width    = data.totalCnt + '%';
	document.querySelector('.sucess').style.width = data.successPercent + '%';
	document.querySelector('.check').style.width  = data.clickPercent + '%';
		
    //라벨 데이터 변경 
    document.getElementById("totalCnt").innerText       = data.totalCnt;
    document.getElementById("successPercent").innerText = data.successPercent;
    document.getElementById("clickPercent").innerText   = data.clickPercent;	
}

//푸쉬 날짜/시간별 데이터 조회
function getPushStatisticDetail(view, index) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"start" 	   : document.getElementById("startDate").value.replace(/[^0-9]/gi,""), 	
		"end"	       : document.getElementById("endDate").value.replace(/[^0-9]/gi,""),
		"pushSeq"      : document.getElementById("sort").value,
		"index"		   : index,
		"view"         : view
	};
	
	commonAjax.call("/psh/getPushStatisticDetail", "POST", params, function(data) {
		if (data.message == "OK") {
			if (data.resultList.length > 0) {
				document.querySelector('.col2').classList.add('active');
				
				drawGraph(view , data.resultList); //푸쉬 날짜/시간별 차트 그리기
			    drawTable(data.resultList);        //하단 테이블 
			    
			    drawPage(data.pageList);           //페이지 번호 그리기	
			} else {
				document.querySelector('.col2').classList.remove('active');
		    }
		}
	});
}

//푸쉬 날짜/시간별 차트 그리기
function drawGraph(type , data){
    data = data.sort((a,b) => (a.pushDate - b.pushDate));  //그래프는 오름차순 정렬
    
    var myChart = echarts.init(document.getElementById('graph'));
    
    let category   = [];
    let totalCnt   = []; //발송 데이터
    let failedCnt  = []; //발송실패 데이터
    let successCnt = []; //수신 데이터
    let clickCnt   = []; //수신확인 데이터
    
    if (type == 'date') {    	
    	data.forEach((item) => {
    		category.push(item.pushDate.substr(2).replace(/(\d)(?=(?:\d{2})+(?!\d))/g, '$1.'));
    	})
    } else {
    	data.forEach((item) => {
    		category.push(item.pushDate.replace(/(\d)(?=(?:\d{2})+(?!\d))/g, '$1:'));
    	})
    }
    
    data.forEach((item) => {
    	totalCnt.push(item.totalCnt);
    	failedCnt.push(item.failedCnt);
    	successCnt.push(item.successCnt);
    	clickCnt.push(item.clickCnt);
    });
    
	var option = {
			tooltip: {
				trigger: 'axis'
			},
			grid: {
				  left: '3%',
				  right: '4%',
				  bottom: '3%',
				  containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				//오늘로 부터 일주일 시간 그려줌
				data: category
			},
			yAxis: {
				show: false,
			    type: 'value'
			},
			series: [
			  {
			    name: '발송',
			    type: 'line',
			    stack: 'Total',
			    data: totalCnt
			  },
			  {
			    name: '발송실패',
			    type: 'line',
			    stack: 'Total',
			    data: failedCnt
			  },
			  {
			    name: '수신',
			    type: 'line',
			    stack: 'Total',
			    data: successCnt
			  },
			  {
			    name: '수신 확인',
			    type: 'line',
			    stack: 'Total',
			    data: clickCnt
			  }
		  ]
		};
    
    myChart.setOption(option);
}

//테이블 그리기
function drawTable(data){
    data = data.sort((a,b) => (b.pushDate - a.pushDate));    //표는 내림차순 정렬
    
	const dateTable = document.querySelector('.date-table');
	const sendTable = document.querySelector('.send-table');
	const failTable = document.querySelector('.fail-table');
	const acceptTable = document.querySelector('.accept-table');
	const acceptFailTable = document.querySelector('.accept-fail-table');
	const type = document.querySelector('.btn-area button.active').dataset.type;
	
	dateTable.innerHTML       = '<li class="table-tit">일시</li>';
	sendTable.innerHTML       = '<li class="table-tit">발송</li>';
	failTable.innerHTML       = '<li class="table-tit">발송 실패</li>';
	acceptTable.innerHTML     = '<li class="table-tit">수신</li>';
	acceptFailTable.innerHTML = '<li class="table-tit">수신 확인</li>';
	
	data.forEach((item) => {	
		let pushDate = item.pushDate;

		if (type == 'date') {
			pushDate = pushDate.substr(0,4) + '-' + pushDate.substr(4,2) + '-' + pushDate.substr(6,2);
		} else {
			pushDate = pushDate.substr(0,2) + ':' + pushDate.substr(2,2);
		}
		
		dateTable.innerHTML        += `<li>${pushDate}</li>`;
		sendTable.innerHTML        += `<li>${item.totalCnt}</li>`;
		failTable.innerHTML        += `<li>${item.failedCnt}</li>`;
		acceptTable.innerHTML      += `<li>${item.successCnt}</li>`;
		acceptFailTable.innerHTML  += `<li>${item.clickCnt}</li>`;
	});
}

function drawPage(page) {
	const pageWrap = document.querySelector('.page-wrap');
	const tab      = document.querySelector(".btn-area button.active");
	
	document.querySelector('.btn-prev-page').style.opacity = '1';
	document.querySelector('.btn-next-page').style.opacity = '1';
	
	pageWrap.innerHTML = '';
	
	if (page.length > 0) {
		for (let i = 0; i < page.length; i ++) {
			const className = page[i].isActive == true ? "page-num active" : "page-num";	
			pageWrap.innerHTML += `<div class="${className}"><a onclick="getPushStatisticDetail('${tab.dataset.type}' , '${i + 1}')">${i + 1}</a></div>`;
		}
		
		const active = document.querySelector('.page-num.active');
		
		if (active.innerText == '1') {
			document.querySelector('.btn-prev-page').style.opacity = '0.5';
		}
		
		if (isNullStr(active.nextElementSibling)) {
			if (page.length <= 10) {
				document.querySelector('.btn-next-page').style.opacity = '0.5';	
			}
		}	
	} else {
		document.querySelector(".page-wrap").innerHTML = 
			`<div class="page-num active">
				<a href="#">1</a>
			</div>`;
		
		document.querySelector('.btn-prev-page').style.opacity = '0.5';
		document.querySelector('.btn-next-page').style.opacity = '0.5';
	}
}

function pageBtnClick(type) {
	const wrap   = document.querySelector('.page-wrap');
	const active = document.querySelector('.page-num.active');
	const tab    = document.querySelector(".btn-area button.active").dataset.type;
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

	getPushStatisticDetail(`${tab}` , `${index}`);
}