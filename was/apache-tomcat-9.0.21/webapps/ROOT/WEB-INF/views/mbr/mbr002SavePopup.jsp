<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<div class="popup-tit">
	<p>회원 등급(<span></span>) 세부설정</p>
</div>

<div class="grade-changes"></div>

<div class="popup-btn">
	<button class="save-btn blue-btn" onclick="updateGrade('Y');">회원 전체반영</button>
	<button class="save-btn blue-btn" onclick="updateGrade('N');">설정만 반영</button>
</div>

<script>	
	getGradeChangeInfo();		
</script>	