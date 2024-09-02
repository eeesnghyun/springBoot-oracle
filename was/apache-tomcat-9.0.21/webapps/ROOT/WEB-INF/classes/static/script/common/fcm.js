function initWebPush() {
	pushWebMessage();  //웹 푸시 
}

//웹 푸시
function pushWebMessage() {
	//firebase-messaging-sw.js 서비스 워커 등록
	navigator.serviceWorker.register('/firebase-messaging-sw.js');
	
	const config = {
		apiKey: "AIzaSyBlnhLBBkw2r27VwPCCVmQQjdwUZzE23no",
	    authDomain: "winwinlab-624a6.firebaseapp.com",
	    projectId: "winwinlab-624a6",
	    storageBucket: "winwinlab-624a6.appspot.com",
	    messagingSenderId: "682222336099",
	    appId: "1:682222336099:web:dc08943cdf6f7857bd6056",
	    measurementId: "G-CWZVXP8V0E"
    };
    
    firebase.initializeApp(config);
    
    const messaging = firebase.messaging();

    /**
     * 웹 토큰 가져오기
     * firebase-cloud-messaging-push-scope가 재등록되는 경우(또는 다른 브라우저) 토큰값이 바뀜
     */
	Notification.requestPermission().then((permission) => {
		if (permission === 'granted') {
			messaging.getToken().then((currentToken) => {
				if (currentToken && location.pathname === "/") {
					updateWebToken(currentToken);  //토큰값 저장
				}
			});
		}
	});

	/**
	 * 브라우저가 포어그라운드 상태일 때 알림
	 * 최소화되지 않은 모든 상태를 포어그라운드로 본다.
	 */
	messaging.onMessage((payload) => {
		//서비스 워커가 등록된 경우
		navigator.serviceWorker.ready.then(function (registration) {		
			if (payload.data.pushYn === "Y") {
				registration.showNotification(
					payload.data.title, 
					{
						body: payload.data.content,
						icon: '/favicon.ico',
						data: {url: `https://autocodi.co.kr/res/res002`}					
					}
				);	
			}			
		});
	});
}

//토큰값 저장
function updateWebToken(currentToken){		
	commonAjax.call("/usr/updateWebToken", "POST", {"webToken" : currentToken}, function(data) {    	
    	if (data.message != "OK") {
    		alert(data.message);
    	}
    });
}

//푸시 알림 허용/미허용 여부 업데이트
function updateWebPushYn(target) {
	commonAjax.call("/usr/updateWebPushYn", "POST", {"webPushYn" : target.checked ? 'N' : 'Y'}, function(data) {
		const icon = document.querySelector("a.push-alarm");
		target.checked ? icon.classList.remove('active') : icon.classList.add('active');
		
		if (data.message != "OK") {
			alert(data.message);
    	}       	
    });
}