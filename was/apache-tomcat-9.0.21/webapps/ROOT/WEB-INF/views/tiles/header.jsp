<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<section id="topMenu">
	<div class="top-menu">
    	<div class="container">
           <div class="right-menu">
               <div class="h-menu-b" onclick="menuToggle()"></div>
               <div class="help">도움말</div>
           </div>
           
           <div class="left-menu">
               <div class="alarm hide" onclick="showAlert('alarm' , this)">알림
              		 <c:if test = "${alarmCnt > 0}">
              		  	<span class="alarm-icon"></span>
              		 </c:if>
              		 
        		   <%-- 알림창 --%>
	               <div class="alarm-area alert hide">
	               		<div class="alarm-tit">
	               			<p class="eng">Now</p>
	               		</div>
	               		<ul class="scroll">
	           				<c:forEach items="${alarmList}" var="resultList">
								<li>								
									<p> 
										<span class="name">
											<c:out value="${resultList.hospitalName}" />
											<c:out value="${resultList.sysName}" />님이
										</span>
										<c:out value="${resultList.menuName}" />을(를)
										<c:out value="${resultList.workType}" />하였습니다.
									</p>
									<span class="u-date"><c:out value="${resultList.updateDate}" /></span>								
								</li>
							</c:forEach>
							<c:if test = "${alarmCnt == 0}">
								<div class="no-alert">
									<span>새로운 알림내역이 없습니다.</span>	
								</div>
							</c:if>
	               		</ul>
	               </div>
               </div>
               
               <div class="notice" onclick="loadPage(this)" data-url="/notice">공지사항</div>
               
               <div class="user hide" onclick="showAlert('' , this)">
               		<c:out value="${sessionScope.sysName}" />
               		<input type="hidden" id="loginUserId" value="<c:out value="${sessionScope.sysUserId}" />">
               		
           		   <%--로그아웃--%>
	               <div class="user-area alert hide">
	                   <sec:authorize access="isAuthenticated()">
						<a href="/logout">로그아웃</a>
					</sec:authorize>    
	               </div>  
               </div> 
           </div>
       </div>
   </div>
</section>

<script>
	function showAlert(type , target){
		const alert = document.querySelectorAll('.alert');
		const div = target.querySelector('.alert');
		
		if(div.classList.contains('active')){
			div.classList.remove('active');	
		}else{
			alert.forEach((ele) => ele.classList.remove('active'))
			div.classList.add('active');	
		}
		
		if ("<c:out value='${alarmCnt}'/>" > 0 && type == 'alarm'){
			hideAlarm();
		}
	}

	function hideAlert(){		
		document.addEventListener('click', function(e){
			const area = document.querySelectorAll('.alert');

			for(let i = 0; i < area.length; i++){
				if(area[i].classList.contains('active') && e.target.closest('.hide') == null){
					area[i].classList.remove('active');
				}
			}
		});
	}
	
	function hideAlarm(){
 		commonAjax.call("/com/updateLogSysData", "POST", "", function(data){
			if (data.message == "OK") {
				document.querySelector('.alarm span').classList.add('active');
			}
		});
	}
	
	hideAlert();
</script>