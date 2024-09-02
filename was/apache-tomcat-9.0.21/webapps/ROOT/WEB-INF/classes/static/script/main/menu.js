function menuToggle() {
    const side = document.querySelector('#sideMenu');
    const btn = document.querySelectorAll('.accordion');
    const panel = document.querySelectorAll('.panel');
    const main = document.querySelector('.main');
    const top = document.querySelector('#topMenu');
    
    side.classList.toggle('active');

    if(side.classList.contains('active')){
        for(let i =0; i<btn.length; i++){
            btn[i].classList.remove('active');
            panel[i].style.maxHeight = '0px';
        }
    }
    
    top.classList.toggle('active');
    main.classList.toggle('active');
}

function arcodienMenu() {
    var acc = document.querySelectorAll('.accordion');
    var panel = document.querySelectorAll('.panel');

    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {

            var inner = this.parentNode.nextElementSibling;
            
            if (this.classList.contains('active')) {		  		
                this.classList.remove('active');
                inner.style.maxHeight = null;
            } else {
                for (let j = 0; j < acc.length; j++) {
                    acc[j].classList.remove('active');
                    panel[j].style.maxHeight = null;
                }
                
                this.classList.add("active");
                var inner = this.parentNode.nextElementSibling;
                inner.style.maxHeight = inner.scrollHeight + "px";	
            }
        });
    }
}

function logout() {
	if (confirm("로그아웃 하시겠습니까?")) {		
		document.getElementById("frm").submit();
	} else {
		return;
	}
}

function loadPage(pageInfo) {
	const page = pageInfo.getAttribute("data-url");	
	
	document.querySelectorAll(".menu > div a").forEach(function(el){
		el.parentElement.classList.remove('active');
		
		if (el.dataset.url === page) {
			el.parentElement.classList.add('active');
		}
	});		
	
	commonGoPage(page);				
}	

function menuList() {
	commonAjax.call("/menu/getMenuList", "POST", "", function(data){
		const result = data.menuList;
		const menu = document.querySelector(".menu");

		let html = "";
		
		for (let i = 0; i < result.length; i++) {
			
			//주소가 없는 경우(부모 메뉴)
			if (result[i].menuUrl == "R") {
				html += "<div>";
				html += "<div onclick=showMenu(this)><img src='/resources/images/main"+ result[i].menuImg +"'><button class='accordion'>"+ result[i].menuName +"</button></div>";
			} else {
				//주소가 없는 경우 대부분 부모 메뉴이지만 대시보드같은 메뉴는 예외
				if (result[i].parentMenu == "ROOT" && result[i].menuUrl != "R") {
					html += "<div>";
					html += "<div class='no-child' onclick=showMenu(this)>";
					html += "<img src='/resources/images/main"+ result[i].menuImg +"'><button onclick=loadPage(this); data-url='"+ result[i].menuUrl +"'>" + result[i].menuName + "</button>";
					html += "</div>";
					html += "</div>";
				} else {
					html += "<p><a href='javascript:void(0)' onclick=loadPage(this); data-url='"+ result[i].menuUrl +"'>" + result[i].menuName + "</a></p>";
				}
			}
			
			if (isNullStr(result[i+1])) {	//다음 메뉴가 없을 때
				html += "</div>";
			} else {
				const nextMenuParent = result[i+1].parentMenu;
				
				if (result[i].parentMenu != nextMenuParent) {
					if (nextMenuParent == "ROOT") {
						html += "</div></div>";
					} else {
						if (result[i].menuCode == nextMenuParent) {
							html += "<div class='panel'>";
						} else if (nextMenuParent != "ROOT" && result[i].parentMenu != nextMenuParent) {
							html += "</div>"
						}	
					}
				}	
			}
		}	
		
		menu.innerHTML = html;

		arcodienMenu();
	});
}

//왼쪽 메뉴
function panelMenu(){
	const side = document.querySelector('#sideMenu');
	const btn = document.querySelectorAll('.menu > div > div:first-child');
	const panel = document.querySelectorAll(".panel p");
	
	if(side.classList.contains('active')){
		for(let i=0; i<btn.length; i++){
			btn[i].addEventListener('click',function(){
				for(let j = 0; j<btn.length; j++){
					btn[j].classList.remove('active');
				}
				
				btn[i].classList.add('active');	
			});
		}
		
	}else{
		for(let i=0; i<panel.length; i++){
			panel[i].addEventListener('click',function(){
				for(let j = 0; j<panel.length; j++){
					panel[j].classList.remove('active');
				}
				
				panel[i].classList.add('active');	
			})	
		}
	}
} 

function showMenu(div) {
	const side = document.querySelector('#sideMenu');
    const main = document.querySelector('.main');
    const top = document.querySelector('#topMenu');
	
	if (side.classList.contains('active')) {
		side.classList.toggle('active');
		main.classList.toggle('active');
		top.classList.toggle('active');
	}
}

