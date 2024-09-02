//년월일 Selectbox 생성
function initDateCombo() {	
	const yearRange = 100;	//년도 범위
	
	//현재 년월일 지정, 년월일 select 지정
	const nowDate  = new Date();
	const nowYear  = nowDate.getFullYear();
	const nowMonth = nowDate.getMonth() + 1;
	const nowDay = nowDate.getDay();
	
	var _wrap = document.querySelectorAll('.div-date'),
		_year = document.querySelectorAll('.div-date select[data-form=year]'),
		_month = document.querySelectorAll('.div-date select[data-form=month]'),
		_day = document.querySelectorAll('.div-date select[data-form=day]');
		
	//초기 년도 설정
	for (let i = 0; i < _wrap.length; i++) {
		var startYear,
			endYear,
			sortOrder = _wrap[i].getAttribute("data-desc"),
			num = 0;
			
		_year[i].options[0] = new Option(_year[i].getAttribute("data-default"), "");
				
		//년도 option 설정(sortOrder : 출력순서)
		if (sortOrder == "asc") {	//미래~현재
			startYear = nowYear + yearRange;
			endYear = nowYear;
		} else if (sortOrder == "desc" || sortOrder == "" || sortOrder == null) {	//현재~과거
			startYear = nowYear;
			endYear = nowYear - yearRange;
		}
		
		for (var j = startYear; j >= endYear; j--) {
			num++;
			_year[i].options[num] = new Option(j, j);
		}
	}
		
	//월 설정
	for (let i = 0; i < _wrap.length; i++) {
		_month[i].options[0] = new Option(_month[i].getAttribute("data-default"), "");
		
		for (let j = 1; j <= 12; j++) {
			let txt = j < 10 ? "0" + j : j;
			_month[i].options[j] = new Option(j, txt);
		}
	}
	
	//일 설정
	for (let i = 0; i < _wrap.length; i++) {
		_day[i].options[0] = new Option(_day[i].getAttribute("data-default"), "");
		
		for (let j = 1; j <= 31; j++) {
			let txt = j < 10 ? "0" + j : j;
			_day[i].options[j] = new Option(j, txt);
		}
	}
	
	//년 선택 시, 일 설정 함수 실행
	for (let i = 0; i < _wrap.length; i++) {
		_year[i].addEventListener('change', selectSetDay, false);
	}
	
	//월 선택 시, 일 설정 함수 실행
	for (let i = 0; i < _wrap.length; i++) {
		_month[i].addEventListener('change', selectSetDay, false);
	}
	
	//일 설정 함수(윤달, 말일 체크)
	function selectSetDay() {
		const arrDay = [31,28,31,30,31,30,31,31,30,31,30,31];		//평년 각 달의 말일 

		var lastDay,
			wrap = this.parentNode.parentNode,
			yearVal = wrap.querySelector('[data-form="year"]').value,
			monthVal = wrap.querySelector('[data-form="month"]').value,
			selectedDay = wrap.querySelector('[data-form="day"]'),
			dayVal = selectedDay.value,
			defaultTxt = selectedDay.getAttribute('data-default');

		//윤달체크(true : 2월 마지막날 29일)
		if (yearVal % 4 == 0 && yearVal % 100 != 0 || yearVal % 400 == 0) arrDay[1] = 29;

		//선택한 달의 일수 설정
		lastDay = arrDay[monthVal-1];
		
		//일 재설정
		selectedDay.options.length = 0;	// option 목록 초기화
		selectedDay.options[0] = new Option(defaultTxt, "");
		
		for (let i = 1; i <= lastDay; i++) {
			let txt = i < 10 ? "0" + i : i;
			selectedDay.options[i] = new Option(i, txt);
		}
				
		//선택한 날이 그 달의 마지막 날보다 크면 마지막 날짜로 셋팅
		selectedDay.value = dayVal > lastDay ? lastDay : dayVal;
	}
}