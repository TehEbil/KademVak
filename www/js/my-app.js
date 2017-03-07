// Initialize app

var myApp = new Framework7({
    pushState: true,
    swipePanel: 'left',
	//skip_invisible: false,
	
	onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
    // ... other parameters
});

var counter = 0;
var firstVid = ""
var player = null;
var data_o;



var strings = {
	"sahsiyet": "Şahsiyet",
	"edebiyat": "Edebiyat",
	"dünya": "Dünya Fikir",
	"düsünce": "Düşünce ve İfade",
	"yaratilis": "Yaratılış ve Kişilik"
}

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
	
	document.getElementById("toggleBtn").addEventListener('click', toggle, false);
	initialize();
});

function accept()
{
	alert("Accepted");
}

function reject()
{
	alert("Rejection");
}

function maybe()
{
	alert("maybe");
}

function toggle(id)
{
     var cats = document.querySelector("#cats");
     var cards = document.querySelector("#cards");
     if (cats.style.display === 'none') {
       cats.style.display = 'block';
       cards.style.display = 'none';
     } else {
       cats.style.display = 'none';
       cards.style.display = 'block';
     }
}



// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page
	//alert("Test");
    //myPhotoBrowserPopupDark.open();
	myApp.closePanel();

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        //myApp.alert('Here comes About page');
    }
})

function initialize()
{
	cordova.getAppVersion.getVersionNumber().then(function (version) {
		alert(version);
	});
	
	cordova.getAppVersion.getVersionNumber(function (version) {
		alert(version);
	});
	
	//var idx = "dwzt4A7T0Aw:APA91bHElyewD4bzE9AnABAkruB2cCMMhaOwc0mf_1BFP8Vn4L7z0QOUI1aiJvCIzyObW6vS3hPXisiyLAwXQMxO0a41iyBsG6vpfOYCS_YyOe-n7y4b7pfWVzZs7H3p60E-xgk3nHHO";
	console.log(cordova.getAppVersion())
	if(!localStorage.getItem('firstTime'))
	{
		localStorage.setItem('firstTime', true)
		navigator.notification.alert("Selam arkadaslar");
	}
	
	// Fertig Geladen
	if(!checkConnection())
	{
		alert("No Internet.")
		document.addEventListener("online", testtest, true);
	}
	else
	{	
		getVideos2("all");
		//getVideos("Düşünce ve");
		SetupJSAPI();
	}
	SetupFullscreen();
	
	
	
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
	
   myApp.push = PushNotification.init({
		"android": {
			"senderID": "492870102848"
		},
		"ios": {
		  "sound": true,
		  "vibration": true,
		  "badge": true,
		  "categories": {
			"invite": {
				"yes": {
					"callback": "accept", "title": "Accept",
					"foreground": true, "destructive": false
				},
				"no": {
					"callback": "reject", "title": "Reject",
					"foreground": true, "destructive": false
				},
				"maybe": {
					"callback": "maybe", "title": "Maybe",
					"foreground": true, "destructive": false
				}
			},
			"delete": {
				"yes": {
					"callback": "myApp.doDelete", "title": "Delete",
					"foreground": true, "destructive": true
				},
				"no": {
					"callback": "myApp.cancel", "title": "Cancel",
					"foreground": true, "destructive": false
				}
			}
		  }
		},
		"windows": {}
	});

   myApp.push.on('registration', function(data) {
	   console.log("registration event: " + data.registrationId);
	   document.getElementById("regId").innerHTML = data.registrationId;
	   var oldRegId = localStorage.getItem('registrationId');
	   if (oldRegId !== data.registrationId) {
		   // Save new registration ID
		   localStorage.setItem('registrationId', data.registrationId);
		   // Post registrationId to your app server as the value has changed
	   }
	   $$.get( "http://37.59.155.80:3001/api/postId?id=" + data.registrationId);
   });

   myApp.push.on('error', function(e) {
	   console.log("push error = " + e.message);
   });
   myApp.push.on('notification', function(data) {
	 console.log('notification event');
	 if (data.additionalData.url) {
	   if (data.additionalData.foreground) {
		 navigator.notification.confirm(
		  'Do you want to see a cat picture?',
		   function(buttonIndex) {
			 if (buttonIndex === 1) {
			   toggle();
			 }
		   },
		  'Cat Pic',
		  ['Yes','No']
		);
	   } else {
		 toggle();
	   }
	 } else {
	   var cards = document.getElementById("cards");
	   var push = '<div class="row">' +
		 '<div class="col s12 m6">' +
		 '  <div class="card darken-1">' +
		 '    <div class="card-content black-text">' +
		 '      <span class="card-title black-text">' + data.title + '</span>' +
		 '      <p>' + data.message + '</p>' +
		 '      <p>' + data.additionalData.foreground + '</p>' +
		 '    </div>' +
		 '  </div>' +
		 ' </div>' +
		 '</div>';
	   cards.innerHTML += push;
	 }

	  myApp.push.finish(function() {
		  console.log('successPUSH');
	  }, function() {
		  console.log('errorPUSH');
	  });
	});
};

function SetupJSAPI()
{
	var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
}


function RegExTit(str)
{
	obj = {}

	var re = /.*?(201\d)(\d{2})(\d{2})/
	var result = re.exec(str);
	if(result != null)
		if(result[1] && result[2] && result[3])
		{
			obj.date = result[3]  + "." + result[2] + "." + result[1];
			obj.year = result[1];
			obj.month = result[2];
			obj.day = result[3];
		}


	if(str.indexOf("ahsiyet") != -1)
		obj.title = "Şahsiyet Düşünce Ve İfade Üzerine";
	else if(str.indexOf("ünce ve") != -1)
		obj.title = "Düşünce ve İfade";
	else if(str.indexOf("Yaratılış") != -1)
		obj.title = "Yaratılış ve Kişilik Dersi";
		
	if(obj.title != null)
		return obj;

	relist = [/.*?201\d\d{2}\d{2}:? ?:?_? ?(.*)/, /.*?201\d\d{2}\d{2}_(.*)/, /.*_([^0-9]*)/]


	for( var key_s in relist)
		if((obj.title = getTitle(str,relist[key_s])) != "")
			return obj;

	obj.title = "";
	return obj;
}

function getTitle (str, re)
{
	var result = re.exec(str);
	if(result != null)
		if(result[1])
			return result[1];
	return "";
}


function testtest()
{
	getVideos2("all");
	SetupJSAPI();
}

function onPause() {
	if(player != null)
		player.pauseVideo();
}

function onResume() {
    // Handle the resume event
}

function onMenuKeyDown() {
	if(player != null)
		player.pauseVideo();
}



function SetupFullscreen()
{
	/*
	$$('video#player').bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    var event = state ? 'FullscreenOn' : 'FullscreenOff';

    // Now do something interesting
    alert('Event: ' + event);    
	});
*/	
    document.addEventListener("webkitfullscreenchange", function(e) {
		if (IsFullscreen()) {
			//StatusBar.hide();
			alert("Fullscreen")
		} else {
			StatusBar.show();
			console.log("NotFullScreen")
		}
	});
}


function IsFullscreen() {
	return document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen
}



function Titles()
{
	kob = "";
	for(var key_s in data_o)
	{
		for(var key2_s in data_o[key_s])
		{
			title = data_o[key_s][key2_s]['snippet']['title']
			kob += '	"' + title + '",\n'
			
		}
	}
	console.log(kob);
}

function getVideos(pVideoTitle, init=false)
{
	//pVideoTitle = pVideoTitle.toLowerCase();
	markup_o = ""
	var tlist = [];

	markup_o = '<div id="idImg"';
	
	
	var size = data_o[pVideoTitle].length;
	
	for(var key_s in data_o[pVideoTitle])
	{
		dat = data_o[pVideoTitle][key_s];
		console.log(dat);
		vidId = dat['videoId'];
		
		if(firstVid == "")
			firstVid = vidId;
		
		var url = dat["img"];
		
		
		
		videoTitle = "Ders ";
		//tmpObj = RegExTit(dat['snippet']['title']);
		//date = RegExDate(dat['snippet']['title']).date
		//tmpTitle = tmpObj.title;
		date = dat.date;
		if(dat.title != "")
			videoTitle = size-- + ". " + dat.title;
		else
			videoTitle = "UNDEFINED";
		//date = "undef";
		//date = ""
		
		
		//markup_o += '<div class="clVideos"> <a id="onChangeVideoClick" onclick="ChangeVideo(\''+ vidId + '\');"><img border="0" class="linksb" alt="111" src="' + url + '" width="160" height="90"></a><p id="idVideoText">' + videoTitle + '</p><p id="idVideoDate">' + date + '</p></div>\n';
		markup_o += '<div class="clVideos"> <a id="onChangeVideoClick" onclick="ChangeVideo(\''+ vidId + '\');"><img border="0" class="lazy lazy-fadein" alt="111" src="' + url + '" width="100%" ></a><p>' + videoTitle + '</p><p>' + date + '</p></div>\n';
		//markup_o += '<div class="clVideos"> <a id="onChangeVideoClick" onclick="ChangeVideo(\''+ vidId + '\');"><img border="0" class="linksb lazy lazy-fadeIn" alt="111" src="' + url + '" width="160" height="90" ></a><p>' + videoTitle + '</p></div>\n';
	}
	markup_o += '</div>';
	//alert("IDSJKFISDJ");
	if(!init)
	{
		ChangeVideo(firstVid, true);
		firstVid = "";
	}
	//ChangeVideo(firstVid);
	$$("#idTest").html(markup_o);
	
	/*var pageWithLazyImages = $$('#idImg');
	myApp.initImagesLazyLoad(pageWithLazyImages);*/
	
	return;
}

function ChangeVideoSite(pVideoTitle)
{
	getVideos(pVideoTitle);
	
}

function getVideos2(pVideoTitle)
{
	//pVideoTitle = pVideoTitle.toLowerCase();
	console.log(pVideoTitle);
	markup_o = ""
	var i = 0;
	var tlist = [];

	markup_o = "";
	
	$$.getJSON('http://37.59.155.80:3001/api/ytlink/' + pVideoTitle, function( data )
	{
		data_o = data;
		for(var key_s in data)
		{
			
			markup_o += '<p><a id="onUrlClick" class="close-panel" onclick="ChangeVideoSite(\''+ key_s + '\');">' + strings[key_s] + '</a></p>';
		} 
		$$("#idSidebar").html(markup_o);
		//SetTimeout(getVideos, 1000, "sahsiyet");
		getVideos("sahsiyet", true);
		//Titles();
		console.log(data);
	});
	return;
}

function onYouTubeIframeAPIReady() {
	if(counter <= 40 && (firstVid == null || firstVid == ""))
	{
		setTimeout(onYouTubeIframeAPIReady, 250)
		counter++;
		return;
	}
	
	  player = new YT.Player('player', {
	  height: '250',
	  width: '100%',
	  color: 'white',
	  playerVars: { fs:1 },
	  videoId: firstVid,
	  events: {
		'onReady': onPlayerReady,
		'onStateChange': onPlayerStateChange
	  }
	});
	firstVid = ""; 
	
	//mainView.router.loadContent($$('#myPage').html());
}
//player.loadVideoById(vidId);


 // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  var done = false;
  function onPlayerStateChange(event) {
	 if (event.data == YT.PlayerState.BUFFERING) {
		//event.target.setPlaybackQuality('hd720');
	}
	if (event.data == YT.PlayerState.PLAYING && !done) {
		//setTimeout(function(){ $('idOnFullScreenPic').css("display: none;"); alert("Test"); }, 3000);
		//setTimeout(function(){ $('#idOnFullScreenPic').css("display: none;") }, 3000);
		
	  //setFull();
	  done = true;
	}
  }
  function stopVideo() {
	//player.stopVideo();
  }


function ChangeVideo(vidId, pause=false)
{
	//console.log($$('body').scrollTop(0, 1));
	$$('.page-content').scrollTop(0, 600);
	player.loadVideoById(vidId);
	if(pause)
		player.stopVideo();
	
	return false;
}

function checkConnection()
{
	/*
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
	*/ 
	
	if(navigator.connection.type == Connection.NONE)
		return false;
	else
		return true;
	
    //alert('Connection type: ' + states[networkState]);
}

 
/*=== With Video ===*/
var myPhotoBrowserPopupDark = myApp.photoBrowser({
	photos : [
        '<iframe src="https://www.youtube.com/embed/2HSSwu9IVqI?list=PLFr2AXO-26dMtaNuh5-Q8vu0kbhgmggKk" frameborder="0" allowfullscreen></iframe>',
        'http://lorempixel.com/1024/1024/sports/2/',
        'http://lorempixel.com/1024/1024/sports/3/',
    ],
	/*
    photos : [
	
        {
            html: '<iframe src="https://www.youtube.com/embed/2HSSwu9IVqI?list=PLFr2AXO-26dMtaNuh5-Q8vu0kbhgmggKk" frameborder="0" allowfullscreen></iframe>',
            caption: 'Aktuell'
        },
        {
            html: '<iframe src="https://www.youtube.com/embed/n6rB1_JG5JI?list=PLFr2AXO-26dMtaNuh5-Q8vu0kbhgmggKk" frameborder="0" allowfullscreen></iframe>',
            caption: 'Lektion 3'
        },
        {
            html: '<iframe src="https://www.youtube.com/embed/WwtvnWkATO4?list=PLFr2AXO-26dMtaNuh5-Q8vu0kbhgmggKk" frameborder="0" allowfullscreen></iframe>',
            caption: 'Lek 2'
        },
        {
            html: '<iframe src="https://www.youtube.com/embed/gU7lIfZIIAk?list=PLFr2AXO-26dMtaNuh5-Q8vu0kbhgmggKk" frameborder="0" allowfullscreen></iframe>',
            caption: 'Lek 1'
        },
        {
            html: '<iframe src="https://www.youtube.com/embed/FYX5vQf9bUs?list=PLFr2AXO-26dMtaNuh5-Q8vu0kbhgmggKk" frameborder="0" allowfullscreen></iframe>',
            caption: 'Begrüßung'
        },
    ],*/
    theme: 'dark',
    type: 'standalone',
	expositionHideCaptions: 'true',
	navbar: 'false',
	toolbar: 'false',
	backLinkText: 'Helloooo'
});
$$('.pb-popup-dark').on('click', function () {
    myPhotoBrowserPopupDark.open();
	//myPhotoBrowserPopupDark.disableExposition();
});