// Initialize app

var myApp = new Framework7({
    pushState: true,
    swipePanel: 'left', 
	
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


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
	
	initialize();
});





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
	// Fertig Geladen
	if(!checkConnection())
	{
		alert("No Internet.")
		document.addEventListener("online", testtest, true);
	}
	else
	{	
		getVideos("ve");
		//getVideos("Düşünce ve");
		SetupJSAPI();
	}
	SetupFullscreen();
	
	
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
	
}

function SetupJSAPI()
{
	var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
}




function RegExTitle(str)
{
	obj = {}
	//var re = new RegExp( ".*?([0-9][0-9])-*([0-9][0-9]?)?_([0-9]{4})([0-9]{2})([0-9]{2})", "g" );
	//var re = /.*?(\d+)-*(\d\d?)?_(\d{4})(\d{2})(\d{2})/

	var re = /.*?(201\d)(\d{2})(\d{2})/
	//(\d+)-*(\d\d?)?_
	var result = re.exec(str);
	if(result)
	{
		if(result[1] && result[2] && result[3])
		{
			obj.date = result[3]  + "." + result[2] + "." + result[1];
			obj.year = result[1];
			obj.month = result[2];
			obj.day = result[3];
		}
	}
	 else
		obj.date = "Not available"
			
		 re = /.*?-(\d{1,2})-*(\d\d?)?(_|:|.)?/ 
		 
		 //-*(\d\d?)?_
         result = re.exec(str);
		 if(result)
		 {
			if(str.indexOf("ahsiyet") != -1)
			{
			 var re = /.*_(\d{1,3})/
			 //(\d+)-*(\d\d?)?_
			 var result = re.exec(str);
			 if(result)
				if(result[1] != 201)
					obj.ders = result[1];	
			}
			else
			{
				if(result[1])
					if(result[1] != 201)
						obj.ders = result[1];
				if(result[2])
					if(result[2] != 20)
						obj.part = result[2];
			}
	     }
		 if(!obj.ders)
	{
		var re = /.*_(\d{1,3})/
		var result = re.exec(str);
		
		if(result)
			obj.ders = result[1];
	}
	
	return obj;
}

function testtest()
{
	SetupJSAPI();
	getVideos("ahsiyet");
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

function getVideos(pVideoTitle)
{
	pVideoTitle = pVideoTitle.toLowerCase();
	
	markup_o = ""
	var i = 0;
	var tlist = [];

	$$.getJSON('http://localhost:3001/api/ytlink/' + pVideoTitle, function( data )
	{
		console.log(data);
	}
	return;
	  //console.log(tlist);
	  
	  for(var key_s in tlist)
	  {
		key_s = tlist[key_s]
		var string = key_s["snippet"]["title"];
		var pic = key_s["snippet"]["thumbnails"]["medium"];
		var url = pic["url"];
		
		var vidId = key_s["id"]["videoId"]
		
		if(firstVid == "")
			firstVid = vidId;
		/*
	*/
		//var realTitle = string.replace(/-?\d{8,}_*\d*/g,"");
		/*var lesson = (string.match(/_\d\d/g).toString()).replace(/_/g,"");
		realTitle += lesson;
		
		*/
		/*
		var string2 = /\d/g;
		var result = string.match(string2);
	
		var year = result[0] + result[1] + result[2] + result[3];
		var month = result[4] + result [5];
		var day = result[6] + result[7];
		
		var date = day + "." + month + "." + year;
		
		*/
		
		
		
		
		try {
			var lesson = (string.match(/_\d\d/g).toString()).replace(/_/g,"");
		}
		catch(err)
		{
			//console.log(err);
		}
		//if(lesson == null)
			videoTitle = "Ders " + i;
		//else:
		//	videoTitle = "Ders -"
		
		lesson = i--;
		try {
			
		data = "test" //RegExTitle(string)
		
		//console.log(data);
		videoTitle = "Ders " + data.ders;
		if (data.part)
			videoTitle += " part " + data.part;  
		/*if(data.day && data.month && data.year)
			var date = data.day + "." + data.month + "." + data.year;
		else
			var date = "Fehler";*/
		
		date = data.date;
		
		} catch(err)
		{
			console.log(err);
		}
		videoTitle = string;
		date = ""
		markup_o += '<div class="clVideos"> <a id="onChangeVideoClick" onclick="ChangeVideo(\''+ vidId + '\');"><img border="0" class="linksb" alt="111" src="' + url + '" width="160" height="90"></a><p id="idVideoText">' + videoTitle + '</p><p id="idVideoDate">' + date + '</p></div>\n';
		//console.log(markup_o);
		
	  }
	  $$("#idTest").html(markup_o);
	 
	  
	  

	  
	});
}
function onYouTubeIframeAPIReady() {
	console.log(firstVid);
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


function ChangeVideo(vidId)
{
	//console.log(player);
	player.loadVideoById(vidId);

//	player.videoId = vidId;
//	player.playVideo();
	
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