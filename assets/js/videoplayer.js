var htmlData = '<div id="superplay_container"><div id="superplay" class="superplay" title="Play"><svg class="icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 17.804 17.804" style="enable-background:new 0 0 17.804 17.804;" xml:space="preserve"><g><g id="c98_play"><path d="M2.067,0.043C2.21-0.028,2.372-0.008,2.493,0.085l13.312,8.503c0.094,0.078,0.154,0.191,0.154,0.313c0,0.12-0.061,0.237-0.154,0.314L2.492,17.717c-0.07,0.057-0.162,0.087-0.25,0.087l-0.176-0.04c-0.136-0.065-0.222-0.207-0.222-0.361V0.402C1.844,0.25,1.93,0.107,2.067,0.043z"/></g><g id="Capa_1_78_"></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>'
	+
	'</div>'

	+
	`<div id="video-controls"><div class="progress"><div class="plybtn" id="play"><button class="player-btn toggle-play icon" title="${window.i18n?.togglePlay || 'Toggle Play'}"><svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.583008 2.0055V9.45802C0.583008 9.992 0.826781 10.3983 1.31433 10.6769C1.80188 10.9555 2.27782 10.9323 2.74215 10.6072L8.52308 6.91581C8.9642 6.63721 9.18475 6.24252 9.18475 5.73176C9.18475 5.22099 8.9642 4.82631 8.52308 4.54771L2.74215 0.856276C2.27782 0.531244 1.80188 0.508027 1.31433 0.786626C0.826781 1.06523 0.583008 1.47152 0.583008 2.0055Z" fill="var(--primary-bg)"/></svg></button></div><span class="current-time">00:00</span><span class="slash">/</span><span class="total-time">00:00</span><div class="volume" id="volumeSeek"><div class="icon"><svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 24 24" width="15px" fill="var(--white-color)"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/></svg></div></div>`
	+
	'</div><div class="controls-main"><input class="seek" id="seek" value="0" min="0" type="range" step="1"></div>'
	+

	'</div>'
	+
	'</div></div></div>';

// Function to initialize video players (can be called for new content)
function initializeVideoPlayers(container = document) {
	var videos = container.querySelectorAll('.xdPlayer');
	
	for (let video of videos) {
		if (video && !video.hasAttribute('data-video-initialized')) {
			initializeSingleVideoPlayer(video);
		}
	}
}

function reAssignVaraible(videoParent){
		player = videoParent//videoParent.querySelector('.');
		fullscreenBtn = videoParent.querySelector('.fullscreen');
		seek = videoParent.querySelector('#seek');
		speedbtn = videoParent.querySelector('#speedbtn');
		playButton = videoParent.querySelector('#play');
		playbackIcons = videoParent.querySelectorAll('.playback-icons use');
		togglePlayBtn = videoParent.querySelector('.toggle-play');
		speedBtns = videoParent.querySelectorAll('.speed-item');
		volumeSeek = videoParent.querySelector('#volumeSeek');
		lock = videoParent.querySelector('#lock');
		unlock = videoParent.querySelector('#unlock');
		videocontrols = videoParent.querySelector('#video-controls');
	//   superplay = document.getElementById('superplay');
		superplay = videoParent.querySelector(".superplay");
		rewbtn = videoParent.querySelector('#rew');
		forbtn = videoParent.querySelector('#for');


		textCurrent = videoParent.querySelector('.current-time');
		duration = videoParent.querySelector('.total-time');
		speedlist = videoParent.querySelector('#speed-list');
}

function initializeSingleVideoPlayer(video) {
	var videoParent = video.parentElement;
	const previousVideo = videoParent.querySelector('#superplay_container');

	if (previousVideo) {
		previousVideo.remove(); // Remove the previous video element
	}
	video.insertAdjacentHTML("afterend", htmlData);
	
	//ELEMENT SELECTORS
	var player = videoParent//videoParent.querySelector('.xdContainer');
	var fullscreenBtn = videoParent.querySelector('.fullscreen');
	var seek = videoParent.querySelector('#seek');
	var speedbtn = videoParent.querySelector('#speedbtn');
	var playButton = videoParent.querySelector('#play');
	var playbackIcons = videoParent.querySelectorAll('.playback-icons use');
	var togglePlayBtn = videoParent.querySelector('.toggle-play');
	var speedBtns = videoParent.querySelectorAll('.speed-item');
	var volumeSeek = videoParent.querySelector('#volumeSeek');
	var lock = videoParent.querySelector('#lock');
	var unlock = videoParent.querySelector('#unlock');
	var videocontrols = videoParent.querySelector('#video-controls');
	// var superplay = document.getElementById('superplay');
	var superplay = videoParent.querySelector(".superplay");
	var rewbtn = videoParent.querySelector('#rew');
	var forbtn = videoParent.querySelector('#for');


	var textCurrent = videoParent.querySelector('.current-time');
	var duration = videoParent.querySelector('.total-time');
	var speedlist = videoParent.querySelector('#speed-list');


	//GLOBAL VARS
	let lastVolume = 1;
	let isMouseDown = false;
	let isSpeedSheet = false;
	let isMax = false;

	//PLAYER FUNCTIONS

	// Play/Pause Function
	function togglePlay()
	{

		// For Firest Play Btn
		if (superplay.style.display != 'none')
		{
			superplay.style.display = 'none';
		}

		if (video.paused || video.ended)
		{
			video.play();
		}
		else
		{
			video.pause();
		}

	}

	// Function For Time Making
	function neatTime(time)
	{
		let minutes = Math.floor((time % 3600) / 60);
		let seconds = Math.floor(time % 60);
		seconds = seconds > 9 ? seconds : `0${seconds}`;
		return `${minutes}:${seconds}`;
	}

	// Function For Makeing Seconds Into Minutes formet
	function formatTime(timeInSeconds)
	{
		if (!timeInSeconds || timeInSeconds == NaN) return;
		var result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

		return {
			minutes: result.substr(3, 2),
			seconds: result.substr(6, 2),
		};
	};

	// Play Button Image Update
	function updatePlayButton()
	{

		if (video.paused)
		{
			togglePlayBtn.innerHTML = `<svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.583008 2.0055V9.45802C0.583008 9.992 0.826781 10.3983 1.31433 10.6769C1.80188 10.9555 2.27782 10.9323 2.74215 10.6072L8.52308 6.91581C8.9642 6.63721 9.18475 6.24252 9.18475 5.73176C9.18475 5.22099 8.9642 4.82631 8.52308 4.54771L2.74215 0.856276C2.27782 0.531244 1.80188 0.508027 1.31433 0.786626C0.826781 1.06523 0.583008 1.47152 0.583008 2.0055Z" fill="var(--primary-bg)"/></svg>
   `;
		} else
		{
			togglePlayBtn.innerHTML = `<svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
		<line x1="1.99805" y1="7.76367" x2="1.99805" y2="1.69888" stroke="var(--primary-bg)" stroke-width="2" stroke-linecap="round"/>
		<line x1="8.26953" y1="1.69922" x2="8.26953" y2="7.76401" stroke="var(--primary-bg)" stroke-width="2" stroke-linecap="round"/>
		</svg>
		
   `;
		}

	}


	// Updateing Seekbar
	function updateProgress()
	{
		if (!video.currentTime || video.currentTime === NaN) return;
		seek.value = Math.floor(video.currentTime);
		textCurrent.innerHTML = `${neatTime(video.currentTime)}`;
		// isMax Is For Set Max For Seekbar Only 1 Time
		if (isMax)
		{

		}
		else
		{
			var time = formatTime(Math.floor(video.duration))
			duration.innerHTML = `${time.minutes}:${time.seconds}`;
			seek.setAttribute('max', Math.floor(video.duration));
			isMax = true;
		}
	}

	// Function For Skip Video By Seekbar
	function skipAhead(event)
	{
		var skipTo = event.target.dataset.seek
			? event.target.dataset.seek
			: event.target.value;
		video.currentTime = skipTo;
		seek.value = skipTo;
	}


	// function For Playback Speed
	function setSpeed(e)
	{
		console.log(parseFloat(this.dataset.speed));
		video.playbackRate = this.dataset.speed;
		speedBtns.forEach(speedBtn => speedBtn.classList.remove('active'));
		this.classList.add('active');
	}

	function showSpeedSheet()
	{	
		if(!speedlist) return;
		if (isSpeedSheet)
		{
			speedlist.style.display = 'none';
			isSpeedSheet = false;
		}
		else
		{
			speedlist.style.display = 'block';
			isSpeedSheet = true;
		}
	}

	volumeSeek?.addEventListener("click", function ()
	{

		let muteElm = `<div class="icon"><svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 24 24" width="15px" fill="var(--white-color)"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/></svg></div>`;
		let unMuteElm = `<div class="icon"><svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_101_2" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="15" height="16">
<path d="M15 0.774414H0V15.7744H15V0.774414Z" fill="white"/>
</mask>
<g mask="url(#mask0_101_2)">
<path d="M1.875 6.39941V10.1494H4.375L7.5 13.2744V3.27441L4.375 6.39941H1.875ZM6.25 6.29316V10.2557L4.89375 8.89941H3.125V7.64941H4.89375L6.25 6.29316Z" fill="white"/>
<path d="M9.04942 6.2496L10.2645 7.46356L11.4797 6.24902L12.2903 7.05852L11.074 8.27478L12.2892 9.48989L11.4791 10.3L10.2645 9.08485L9.04942 10.3L8.23877 9.48989L9.45503 8.27478L8.23992 7.0591L9.04942 6.2496Z" fill="white"/>
</g>
</svg>

</div>`
		let volume = video.volume;
		if (volume == 0)
		{
			volumeSeek.innerHTML = muteElm;
			video.volume = 1
		} else
		{
			volumeSeek.innerHTML = unMuteElm;
			video.volume = 0
		}

	})

	// Keyboard Controll
	function handleKeypress(e)
	{
		switch (e.key)
		{
			case 'p':
				togglePlay();
				break;
			case 'm':
				volumeSeek.value = 0;
				video.volume = volumeSeek.value;
				break;
			case 'f':
				toggleFullscreen();
				break;
			case 's':
				showSpeedSheet();
				break;
			case 'p':
				togglePip();
				break;
		}
	}

	// Functions For Lock & UnLock
	function lockControls()
	{
		unlock.style.display = 'block';
		videocontrols.style.opacity = '0';
	}
	function unLockControls()
	{
		unlock.style.display = 'none';
		videocontrols.style.opacity = '.9';
	}


	//EVENT LISTENERS
	playButton.addEventListener('click', togglePlay);
	video.addEventListener('click', togglePlay);
	video.addEventListener('play', updatePlayButton);
	video.addEventListener('pause', updatePlayButton);
	video.addEventListener('timeupdate', updateProgress);
	video.addEventListener('canplay', updateProgress);
	superplay.addEventListener('click', function ()
	{
		superplay.style.display = 'none';
		togglePlay();
	})

	seek.addEventListener('input', skipAhead);
	lock?.addEventListener('click', lockControls);
	unlock?.addEventListener('click', unLockControls);
	rewbtn?.addEventListener('click', function ()
	{
		let skip = video.currentTime - 10;
		video.currentTime = skip;
		seek.value = skip;
	});
	forbtn?.addEventListener('click', function ()
	{
		let skip = video.currentTime + 10;
		video.currentTime = skip;
		seek.value = skip;
	});


	window.addEventListener('mousedown', () => isMouseDown = true)
	window.addEventListener('mouseup', () => isMouseDown = false)

	fullscreenBtn?.addEventListener('click', toggleFullscreen);
	speedbtn?.addEventListener('click', showSpeedSheet);

	speedBtns.forEach(speedBtn =>
	{
		speedBtn.addEventListener('click', setSpeed);
	});
	// commented for sloving unnecessary video play error in the console and also for preventing video media play in background in chat
	// window.addEventListener('keyup', handleKeypress);

	// Mark this video as initialized to prevent re-initialization
	video.setAttribute('data-video-initialized', 'true');
}

// Original functionality - keep this intact
var videos = document.querySelectorAll('.xdPlayer');

for (let video of videos)
{

	if (video)
	{
		var videoParent = video.parentElement;
		const previousVideo = videoParent.querySelector('#superplay_container');

		if (previousVideo)
		{
			previousVideo.remove(); // Remove the previous video element
		}
		video.insertAdjacentHTML("afterend", htmlData);
		
		//ELEMENT SELECTORS
		var player = videoParent//videoParent.querySelector('.xdContainer');
		var fullscreenBtn = videoParent.querySelector('.fullscreen');
		var seek = videoParent.querySelector('#seek');
		var speedbtn = videoParent.querySelector('#speedbtn');
		var playButton = videoParent.querySelector('#play');
		var playbackIcons = videoParent.querySelectorAll('.playback-icons use');
		var togglePlayBtn = videoParent.querySelector('.toggle-play');
		var speedBtns = videoParent.querySelectorAll('.speed-item');
		var volumeSeek = videoParent.querySelector('#volumeSeek');
		var lock = videoParent.querySelector('#lock');
		var unlock = videoParent.querySelector('#unlock');
		var videocontrols = videoParent.querySelector('#video-controls');
		// var superplay = document.getElementById('superplay');
		var superplay = videoParent.querySelector(".superplay");
		var rewbtn = videoParent.querySelector('#rew');
		var forbtn = videoParent.querySelector('#for');


		var textCurrent = videoParent.querySelector('.current-time');
		var duration = videoParent.querySelector('.total-time');
		var speedlist = videoParent.querySelector('#speed-list');


		//GLOBAL VARS
		let lastVolume = 1;
		let isMouseDown = false;
		let isSpeedSheet = false;
		let isMax = false;

		//PLAYER FUNCTIONS

		// Play/Pause Function
		function togglePlay()
		{

			// For Firest Play Btn
			if (superplay.style.display != 'none')
			{
				superplay.style.display = 'none';
			}

			if (video.paused || video.ended)
			{
				video.play();
			}
			else
			{
				video.pause();
			}

		}

		// Function For Time Making
		function neatTime(time)
		{
			let minutes = Math.floor((time % 3600) / 60);
			let seconds = Math.floor(time % 60);
			seconds = seconds > 9 ? seconds : `0${seconds}`;
			return `${minutes}:${seconds}`;
		}

		// Function For Makeing Seconds Into Minutes formet
		function formatTime(timeInSeconds)
		{
			if (!timeInSeconds || timeInSeconds == NaN) return;
			var result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

			return {
				minutes: result.substr(3, 2),
				seconds: result.substr(6, 2),
			};
		};

		// Play Button Image Update
		function updatePlayButton()
		{

			if (video.paused)
			{
				togglePlayBtn.innerHTML = `<svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.583008 2.0055V9.45802C0.583008 9.992 0.826781 10.3983 1.31433 10.6769C1.80188 10.9555 2.27782 10.9323 2.74215 10.6072L8.52308 6.91581C8.9642 6.63721 9.18475 6.24252 9.18475 5.73176C9.18475 5.22099 8.9642 4.82631 8.52308 4.54771L2.74215 0.856276C2.27782 0.531244 1.80188 0.508027 1.31433 0.786626C0.826781 1.06523 0.583008 1.47152 0.583008 2.0055Z" fill="var(--primary-bg)"/></svg>
   `;
			} else
			{
				togglePlayBtn.innerHTML = `<svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
		<line x1="1.99805" y1="7.76367" x2="1.99805" y2="1.69888" stroke="var(--primary-bg)" stroke-width="2" stroke-linecap="round"/>
		<line x1="8.26953" y1="1.69922" x2="8.26953" y2="7.76401" stroke="var(--primary-bg)" stroke-width="2" stroke-linecap="round"/>
		</svg>
		
   `;
			}

		}


		// Updateing Seekbar
		function updateProgress()
		{
			if (!video.currentTime || video.currentTime === NaN) return;
			seek.value = Math.floor(video.currentTime);
			textCurrent.innerHTML = `${neatTime(video.currentTime)}`;
			// isMax Is For Set Max For Seekbar Only 1 Time
			if (isMax)
			{

			}
			else
			{
				var time = formatTime(Math.floor(video.duration))
				duration.innerHTML = `${time.minutes}:${time.seconds}`;
				seek.setAttribute('max', Math.floor(video.duration));
				isMax = true;
			}
		}

		// Function For Skip Video By Seekbar
		function skipAhead(event)
		{
			var skipTo = event.target.dataset.seek
				? event.target.dataset.seek
				: event.target.value;
			video.currentTime = skipTo;
			seek.value = skipTo;
		}


		// function For Playback Speed
		function setSpeed(e)
		{
			console.log(parseFloat(this.dataset.speed));
			video.playbackRate = this.dataset.speed;
			speedBtns.forEach(speedBtn => speedBtn.classList.remove('active'));
			this.classList.add('active');
		}

		function showSpeedSheet()
		{	
			if(!speedlist) return;
			if (isSpeedSheet)
			{
				speedlist.style.display = 'none';
				isSpeedSheet = false;
			}
			else
			{
				speedlist.style.display = 'block';
				isSpeedSheet = true;
			}
		}

		volumeSeek?.addEventListener("click", function ()
		{

			let muteElm = `<div class="icon"><svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 24 24" width="15px" fill="var(--white-color)"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/></svg></div>`;
			let unMuteElm = `<div class="icon"><svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_101_2" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="15" height="16">
<path d="M15 0.774414H0V15.7744H15V0.774414Z" fill="white"/>
</mask>
<g mask="url(#mask0_101_2)">
<path d="M1.875 6.39941V10.1494H4.375L7.5 13.2744V3.27441L4.375 6.39941H1.875ZM6.25 6.29316V10.2557L4.89375 8.89941H3.125V7.64941H4.89375L6.25 6.29316Z" fill="white"/>
<path d="M9.04942 6.2496L10.2645 7.46356L11.4797 6.24902L12.2903 7.05852L11.074 8.27478L12.2892 9.48989L11.4791 10.3L10.2645 9.08485L9.04942 10.3L8.23877 9.48989L9.45503 8.27478L8.23992 7.0591L9.04942 6.2496Z" fill="white"/>
</g>
</svg>

</div>`
			let volume = video.volume;
			if (volume == 0)
			{
				volumeSeek.innerHTML = muteElm;
				video.volume = 1
			} else
			{
				volumeSeek.innerHTML = unMuteElm;
				video.volume = 0
			}

		})

		// Keyboard Controll
		function handleKeypress(e)
		{
			switch (e.key)
			{
				case 'p':
					togglePlay();
					break;
				case 'm':
					volumeSeek.value = 0;
					video.volume = volumeSeek.value;
					break;
				case 'f':
					toggleFullscreen();
					break;
				case 's':
					showSpeedSheet();
					break;
				case 'p':
					togglePip();
					break;
			}
		}

		// Functions For Lock & UnLock
		function lockControls()
		{
			unlock.style.display = 'block';
			videocontrols.style.opacity = '0';
		}
		function unLockControls()
		{
			unlock.style.display = 'none';
			videocontrols.style.opacity = '.9';
		}


		//EVENT LISTENERS
		playButton.addEventListener('click', togglePlay);
		video.addEventListener('click', togglePlay);
		video.addEventListener('play', updatePlayButton);
		video.addEventListener('pause', updatePlayButton);
		video.addEventListener('timeupdate', updateProgress);
		video.addEventListener('canplay', updateProgress);
		superplay.addEventListener('click', function ()
		{
			superplay.style.display = 'none';
			togglePlay();
		})

		seek.addEventListener('input', skipAhead);
		lock?.addEventListener('click', lockControls);
		unlock?.addEventListener('click', unLockControls);
		rewbtn?.addEventListener('click', function ()
		{
			let skip = video.currentTime - 10;
			video.currentTime = skip;
			seek.value = skip;
		});
		forbtn?.addEventListener('click', function ()
		{
			let skip = video.currentTime + 10;
			video.currentTime = skip;
			seek.value = skip;
		});


		window.addEventListener('mousedown', () => isMouseDown = true)
		window.addEventListener('mouseup', () => isMouseDown = false)

		fullscreenBtn?.addEventListener('click', toggleFullscreen);
		speedbtn?.addEventListener('click', showSpeedSheet);

		speedBtns.forEach(speedBtn =>
		{
			speedBtn.addEventListener('click', setSpeed);
		});
		// commented for sloving unnecessary video play error in the console and also for preventing video media play in background in chat
		// window.addEventListener('keyup', handleKeypress);

		// Mark this video as initialized to prevent re-initialization
		video.setAttribute('data-video-initialized', 'true');
	}
}

// Make the function globally available so it can be called from other scripts
window.initializeVideoPlayers = initializeVideoPlayers;