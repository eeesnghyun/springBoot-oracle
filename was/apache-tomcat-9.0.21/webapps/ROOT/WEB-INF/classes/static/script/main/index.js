/**시간가져오기*/
function getDate() {
    const date = new Date();
    const dateBox = document.querySelector('.date');//날짜 표시영역
    const week = new Array('[월]','[화]','[수]','[목]','[금]','[토]');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    const dayname = week[date.getDay()];

    //오늘날짜 표시하기
    dateBox.innerText = `${year}년 ${month < 10 ? `0${month}`:month}월 ${day < 10 ? `0${day}`:day}일 ${dayname}`;
}
	
/**시간가져오기*/
function getTime() {
    const date = new Date();
    const timeBox = document.querySelector('.time');//시간표시영역
   
    if (isNullStr(timeBox)) {
    	clearInterval(getTime);
    	return;
    }
    
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    //시간표시하기
    timeBox.innerText = `${h < 10 ? `0${h}`:h }:${m < 10 ? `0${m}`:m}:${s < 10 ? `0${s}`:s}`
}
 
/** 라인그래프 버튼선택*/
    
    function handleClick(event) {
	const btn = document.getElementsByClassName("btn-box");

      if (btn.classList[1] === "clicked") {
        btn.classList.remove("clicked");
      } else {
        for (var i = 0; i < btn.length; i++) {
        	btn[i].classList.remove("clicked");
        }

        btn.classList.add("clicked");
      }
    }
	