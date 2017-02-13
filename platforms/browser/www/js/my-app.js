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
//	var re = /quick\s(brown).+?(jumps)/ig;
//	var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
	
    var str = "Edebiyat Dersi-05-2_20150103: İslam Tarihi"; 
	var re = /\d+(-\d)*_\d+/g;
	re.exec(str);

	console.log(re);
	console.log(re[0]);
	console.log(re[1]);
	
	// Fertig Geladen
	if(!checkConnection())
	{
		alert("internet yok kardes");
		document.addEventListener("online", testtest, true);
	}
	else
	{
		getVideos("ahsiyet");
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
	console.log(document)
}

function testtest()
{
	SetupJSAPI();
	setTimeout(sibsib, 5000)
}

function sibsib()
{
	alert("Starting");
	getVideos("ahsiyet");
}

function onPause() {
    player.pauseVideo();
}

function onResume() {
    // Handle the resume event
}

function onMenuKeyDown() {
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
		
	markup_o = ""
	var firstVid = ""
	var i = 0;
	var tlist = [];
	var nextPageToken = "";
/*	$$.getJSON('https://www.googleapis.com/youtube/v3/search?key=AIzaSyCojx3Q0iOXImM6EGs9J078x909ar1J_4A&channelId=UC7oSNT3soKfhI2jsFHinXSA&part=snippet,id&order=date&maxResults=50', function( data )
	{
		for(var key_s in data["items"])
		{
			var string = data["items"][key_s]["snippet"]["title"];
			if(string.indexOf("Dünya Fikir") != -1){
				console.log(1);
				i++;
			}
		}
	});*/
	
	
	$$.getJSON('https://www.googleapis.com/youtube/v3/search?key=AIzaSyCojx3Q0iOXImM6EGs9J078x909ar1J_4A&channelId=UC7oSNT3soKfhI2jsFHinXSA&part=snippet,id&order=date&maxResults=50', function( data )
	{
	  for(var key_s in data["items"])
	  {
		nextPageToken = data['nextPageToken'];
		maxVids = data['pageInfo']['totalResults'];
		var string = data["items"][key_s]["snippet"]["title"];
		if(string.indexOf(pVideoTitle) === -1)
			continue;
		
		
		try	{	
			if (data["items"][key_s]["id"]["playlistId"] != undefined)
				continue;
		} catch(err) {
				console.log(err);
		}
		
		i++;
		tlist.push(data["items"][key_s])
	  }
	$$.ajaxSetup({
		async: false
	});
	  for(var j = 0; j < maxVids-50; j+=50)
	  {
		$$.getJSON('https://www.googleapis.com/youtube/v3/search?key=AIzaSyCojx3Q0iOXImM6EGs9J078x909ar1J_4A&channelId=UC7oSNT3soKfhI2jsFHinXSA&part=snippet&order=date&maxResults=50&pageToken=' + nextPageToken, function( data )
		{
			for(var key_s in data["items"])
			{
				console.log(j);
				nextPageToken = data['nextPageToken'];
				//maxVids = data['pageInfo']['totalResults'];
				var string = data["items"][key_s]["snippet"]["title"];
				if(string.indexOf(pVideoTitle) === -1)
					continue;
				
				
				try	{	
					if (data["items"][key_s]["id"]["playlistId"] != undefined)
						continue;
				} catch(err) {
						console.log(err);
				}
				
				i++;
				tlist.push(data["items"][key_s])
			}
		});
	  
	  }
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
		var string2 = /\d/g;
		var result = string.match(string2);
	
		var year = result[0] + result[1] + result[2] + result[3];
		var month = result[4] + result [5];
		var day = result[6] + result[7];
		
		var date = day + "." + month + "." + year;
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
			
		markup_o += '<div class="clVideos"> <a id="onChangeVideoClick" onclick="ChangeVideo(\''+ vidId + '\');"><img border="0" class="linksb" alt="111" src="' + url + '" width="160" height="90"></a><p id="idVideoText">' + videoTitle + '</p><p id="idVideoDate">' + date + '</p></div>\n';
		//console.log(markup_o);
		
	  }
	  $$("#idTest").html(markup_o);
	 
	  
	  
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
	  
	});
}




 // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
		event.target.setPlaybackQuality('hd720');
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  var done = false;
  function onPlayerStateChange(event) {
	 if (event.data == YT.PlayerState.BUFFERING) {
		event.target.setPlaybackQuality('hd720');
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
	console.log(player);
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