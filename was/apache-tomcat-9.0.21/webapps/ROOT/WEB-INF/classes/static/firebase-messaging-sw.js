importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
	apiKey: "AIzaSyBlnhLBBkw2r27VwPCCVmQQjdwUZzE23no",
  	authDomain: "winwinlab-624a6.firebaseapp.com",
  	projectId: "winwinlab-624a6",
  	storageBucket: "winwinlab-624a6.appspot.com",
  	messagingSenderId: "682222336099",
  	appId: "1:682222336099:web:dc08943cdf6f7857bd6056",
  	measurementId: "G-CWZVXP8V0E"
});

var messaging = firebase.messaging();

//브라우저가 백그라운드 상태일 때 알림(최소화 된 상태)
messaging.onBackgroundMessage((payload) => {
	//웹푸시 알림 백그라운드에서 업데이트 문구 방지. 서버에서 보내주는 알림에 대해서만 출력
	if (payload.data.pushYn === "Y") {
		//웹 푸쉬 출력
		self.registration.showNotification(
			payload.data.title, 
			{
				body: payload.data.content,
				icon: '/favicon.ico',
				data: {url: `https://autocodi.co.kr/res/res002`}					
			}
		);	
	}	
});

self.addEventListener('notificationclick', (e) => {
	e.notification.close();

	e.waitUntil(clients.matchAll({ type: 'window' }).then((clientsArr) => {
		const hadWindowToFocus = clientsArr.some((windowClient) => windowClient.url === e.notification.data.url ? (windowClient.focus(), true) : false);
    
		if (!hadWindowToFocus) clients.openWindow(e.notification.data.url).then((windowClient) => windowClient ? windowClient.focus() : null);
	}));
});
