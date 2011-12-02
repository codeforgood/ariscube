Element.prototype.hasClassName = function (a) {
    return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function (a) {
    if (!this.hasClassName(a)) {
        this.className = [this.className, a].join(" ");
    }
};

Element.prototype.removeClassName = function (b) {
    if (this.hasClassName(b)) {
        var a = this.className;
        this.className = a.replace(new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)", "g"), " ");
    }
};

Element.prototype.toggleClassName = function (a) {
  this[this.hasClassName(a) ? "removeClassName" : "addClassName"](a);
};

function unfollowStudent(code){
	var url=document.URL;
	var userAttribute=url.split("?")[1];
	var user=userAttribute.split("=");
	if(user[0]== "username"){
		username=user[1];
	}
    var Url = "http://localhost:8000/ariscube/student/unfollow?username="+username+"&code="+code;
    xmlHttp = new XMLHttpRequest(); 
    xmlHttp.open( "DELETE", Url, false );
    xmlHttp.send( null );
    var serverResponse = JSON.parse(xmlHttp.responseText);
    if(serverResponse.success==1){
		var oP = document.getElementById(code).parentNode;
		oP.parentNode.removeChild(oP);		
    }
	document.getElementById('studentcode').value= null;
	document.getElementById('follow_cnt').innerHTML= serverResponse.students_follow_cnt;
}

function followStudent(code){
	var url=document.URL;
	var userAttribute=url.split("?")[1];
	var user=userAttribute.split("=");
	if(user[0]== "username"){
		username=user[1];
	}
    var Url = "http://localhost:8000/ariscube/student/follow?username="+username+"&code="+code;
    xmlHttp = new XMLHttpRequest(); 
    xmlHttp.open( "POST", Url, false );
    xmlHttp.send( null );
	var serverResponse = JSON.parse(xmlHttp.responseText);
	if(serverResponse.success==1){
		var followingDiv = document.getElementById("follow_list");
		var divTag = document.createElement("div");
		divTag.className ="student_list";
		divTag.innerHTML =
		  "<a class='sel' id="+code+" onclick=GetStudentInfo(this.id);"
		  + " onmouseover=tooltip.show('Show Cube', 200);"
		  + " onmouseout=tooltip.hide(); >"
		  + " <img src='student.jpg' width='100' height='70' /></a>"
		  + " <div class='desc'>"+code+"</div>"
		  + " <a class='rem' name="+code+" onclick=unfollowStudent(this.name)" 
		  + " onmouseover=tooltip.show('Unfollow',200);"
		  + " onmouseout=tooltip.hide();>"			  
		  + " <img src='unfollow.png' width='10' height='10' /> </a>";
		followingDiv.appendChild(divTag);
		document.getElementById('follow_cnt').innerHTML= serverResponse.students_follow_cnt;
	}
}

var xmlHttp = null;

function GetStudentInfo(code)
{
    date_splits=document.getElementById('user_date').value.split("-");
    var Url = "http://localhost:8000/ariscube/student?code="+code+"&year="+date_splits[0]+"&month="+date_splits[1];    
    xmlHttp = new XMLHttpRequest(); 
    xmlHttp.open( "GET", Url, false );
    xmlHttp.send( null );
    var serverResponse = xmlHttp.responseText;
    var studentFeed = JSON.parse(serverResponse);
	clearFaces();
	clearComments();
    if(studentFeed.updates =="0"){
        setProfileFace(studentFeed.name);
		hideComment();
    }else{
        setAdminFaceFeeds(studentFeed.data);
        setAttendanceFaceFeeds(studentFeed.data);
        setELAFaceFeeds(studentFeed.data);
        setMathFaceFeeds(studentFeed.data);
        setSSTFaceFeeds(studentFeed.data);
        setProfileFace(studentFeed.name);
		LoadComments(studentFeed.comments);
    }
    document.getElementById('show-front').click();
	document.getElementById('studentcode').value=code;
}
function clearFaces(){
    var faces=['front-text','back-text','left-text','right-text','bottom-text','top-text'];
    for (face in faces){
        document.getElementById(faces[face]).innerHTML=         
         "<B>No Updates Found</B>";
    }
}

function hideComment(){
	var commentDiv=document.getElementById('comments');	
	commentDiv.innerHTML="";
}

function clearComments(){
	var commentDiv=document.getElementById('comments');	
	commentDiv.innerHTML="<textarea placeholder= 'What do you think of this Child???' id='input-comment'"
	+"onkeydown='if (event.keyCode == 13) InsertComment();' rows='1' cols='50'></textarea></div>";
}

function LoadComments(comments){
	var commentDiv=document.getElementById('comments');
	
	commentDiv.innerHTML="<textarea placeholder= 'What do you think of this Child???' id='input-comment'"
	+"onkeydown='if (event.keyCode == 13) InsertComment();' rows='1' cols='50'></textarea></div>";
	
	for (comment in comments){
		var divTag = document.createElement("div");
		divTag.className ="commentRow";
		divTag.innerHTML ="<label><b><a href=''>"+comments[comment].author+"</a></b></label>"
		+"&nbsp;&nbsp;<label>"+comments[comment].text+"</label>"+
		"<div class='line-separator-bottom'></div>";
		commentDiv.appendChild(divTag);
	}	
}

function setProfileFace(name){
    document.getElementById('front-text').innerHTML=
    "<img src=student.jpg align=align width=80% height=80%/>";
    document.getElementById('studentname').innerHTML="<B><i>"+name+"</i></B>";
}

function setAdminFaceFeeds(studentFeed){
    var adminFeeds="<ul class=checkmark>";
    for (feed in studentFeed.profile){
        adminFeeds = adminFeeds +"<BR/><BR/><li><B>" 
        +studentFeed.profile[feed] + "</B></li>";
    }
    adminFeeds=adminFeeds+"</ul>";
    document.getElementById('bottom-text').innerHTML=adminFeeds;
}

function setAttendanceFaceFeeds(studentFeed){
    var attendanceFeeds="<ul class=checkmark>";
    for (feed in studentFeed.attendance){
        attendanceFeeds = attendanceFeeds +"<BR/><BR/><li><B>" 
        +studentFeed.attendance[feed] + "</B></li>";
    }
    attendanceFeeds=attendanceFeeds+"</ul>";
    document.getElementById('back-text').innerHTML=attendanceFeeds;
}

function setELAFaceFeeds(studentFeed){
    var ELAFeeds="<ul class=checkmark>";
    for (feed in studentFeed.english){
        ELAFeeds = ELAFeeds +"<BR/><BR/><li><B>" 
        +studentFeed.english[feed] + "</B></li>";
    }
    ELAFeeds=ELAFeeds+"</ul>";
    document.getElementById('right-text').innerHTML=ELAFeeds;
}

function setMathFaceFeeds(studentFeed){
    var MathFeeds="<ul class=checkmark>";
    for (feed in studentFeed.math){
        MathFeeds = MathFeeds +"<BR/><BR/><li><B>" 
        +studentFeed.math[feed] + "</B></li>";
    }
    MathFeeds=MathFeeds+"</ul>";
    document.getElementById('left-text').innerHTML=MathFeeds;
}

function setSSTFaceFeeds(studentFeed){
    var SSTFeeds="<ul class=checkmark>";
    for (feed in studentFeed.sst){
        SSTFeeds = SSTFeeds +"<BR/><BR/><li><B>" 
        +studentFeed.sst[feed] + "</B></li>";
    }
    SSTFeeds=SSTFeeds+"</ul>";
    document.getElementById('top-text').innerHTML=SSTFeeds;
}

function InsertComment(comment){
	
	var code=document.getElementById('studentcode').value;
	if(!code){
		alert("Select a student before commenting");
	}else{
		var comment=document.getElementById('input-comment').value;
		var url=document.URL;
		var userAttribute=url.split("?")[1];
		var user=userAttribute.split("=");
		if(user[0]== "username"){
			username=user[1];
		}
		date_splits=document.getElementById('user_date').value.split("-");
		var Url = "http://localhost:8000/ariscube/student/comment?username="+username+"&comment="+comment+"&year="+date_splits[0]+"&month="+date_splits[1]+"&code="+code;
		xmlHttp = new XMLHttpRequest(); 
		xmlHttp.open("POST", Url, false );
		xmlHttp.send( null );
		var serverResponse = JSON.parse(xmlHttp.responseText);
		if(serverResponse.success==1){
			
			document.getElementById('input-comment').value='';
			document.getElementById('input-comment').placeholder="What do you think of this Child???";
			var commentDiv = document.getElementById("comments");
			var divTag = document.createElement("div");
			divTag.className ="commentRow";
			divTag.innerHTML ="<label><b><a href=''>"+username+"</a></b></label>"
			+"&nbsp;&nbsp;<label>"+comment+"</label>"+
			"<div class='line-separator-bottom'></div>";
			commentDiv.appendChild(divTag);
		}
	}
}

var tooltip=function(){
 var id = 'tt';
 var top = 3;
 var left = 3;
 var maxw = 300;
 var speed = 10;
 var timer = 20;
 var endalpha = 95;
 var alpha = 0;
 var tt,t,c,b,h;
 var ie = document.all ? true : false;
 return{
  show:function(v,w){
   if(tt == null){
    tt = document.createElement('div');
    tt.setAttribute('id',id);
    t = document.createElement('div');
    t.setAttribute('id',id + 'top');
    c = document.createElement('div');
    c.setAttribute('id',id + 'cont');
    b = document.createElement('div');
    b.setAttribute('id',id + 'bot');
    tt.appendChild(t);
    tt.appendChild(c);
    tt.appendChild(b);
    document.body.appendChild(tt);
    tt.style.opacity = 0;
    tt.style.filter = 'alpha(opacity=0)';
    document.onmousemove = this.pos;
   }
   tt.style.display = 'block';
   c.innerHTML = v;
   tt.style.width = w ? w + 'px' : 'auto';
   if(!w && ie){
    t.style.display = 'none';
    b.style.display = 'none';
    tt.style.width = tt.offsetWidth;
    t.style.display = 'block';
    b.style.display = 'block';
   }
  if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
  h = parseInt(tt.offsetHeight) + top;
  clearInterval(tt.timer);
  tt.timer = setInterval(function(){tooltip.fade(1)},timer);
  },
  pos:function(e){
   var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
   var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
   tt.style.top = (u - h) + 'px';
   tt.style.left = (l + left) + 'px';
  },
  fade:function(d){
   var a = alpha;
   if((a != endalpha && d == 1) || (a != 0 && d == -1)){
    var i = speed;
   if(endalpha - a < speed && d == 1){
    i = endalpha - a;
   }else if(alpha < speed && d == -1){
     i = a;
   }
   alpha = a + (i * d);
   tt.style.opacity = alpha * .01;
   tt.style.filter = 'alpha(opacity=' + alpha + ')';
  }else{
    clearInterval(tt.timer);
     if(d == -1){tt.style.display = 'none'}
  }
 },
 hide:function(){
  clearInterval(tt.timer);
   tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
  }
 };
}();
