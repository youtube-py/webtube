const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const name = (s) => {
	if (s.length >= 25){
	return s.slice(0,25)+"...";
	}
	return s;
}

const videoCheck = (url) => {
	var p = "^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+";
	return (url.match(p)) ? true : false;
}

// Song titles
var songs;

// Keep track of song
let songIndex = 0;

// Initially load song details into DOM
// loadSong(songs[songIndex]);


// Update song details
function loadSong(song) {
	title.innerText = name(song.title);
	audio.src = song.url;
	cover.src = song.thumbnail;
}

// Play song
function playSong() {
	musicContainer.classList.add('play');
	playBtn.querySelector('i.fas').classList.remove('fa-play');
	playBtn.querySelector('i.fas').classList.add('fa-pause');

	audio.play();
}

// Pause song
function pauseSong() {
	musicContainer.classList.remove('play');
	playBtn.querySelector('i.fas').classList.add('fa-play');
	playBtn.querySelector('i.fas').classList.remove('fa-pause');

	audio.pause();
}

// Previous song
function prevSong() {
	songIndex--;

	if (songIndex < 0) {
	songIndex = songs.length - 1;
	}

	loadSong(songs[songIndex]);

	playSong();
}

// Next song
function nextSong() {
	songIndex++;

	if (songIndex > songs.length - 1) {
	songIndex = 0;
	}

	loadSong(songs[songIndex]);

	playSong();
}

// Update progress bar
function updateProgress(e) {
	const { duration, currentTime } = e.srcElement;
	const progressPercent = (currentTime / duration) * 100;
	progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
	const width = this.clientWidth;
	const clickX = e.offsetX;
	const duration = audio.duration;

	audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playBtn.addEventListener('click', () => {
	const isPlaying = musicContainer.classList.contains('play');

	if (isPlaying) {
	pauseSong();
	} else {
	playSong();
	}
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);

// Ask box for youtube video link
let ask;
(ask = (CanClose) => {
	Swal.fire({
	title: 'Enter Youtube URL',
	input: 'text',
	inputAttributes: {
		autocapitalize: 'off'
	},
	showCancelButton: CanClose,
	allowOutsideClick: CanClose,
	heightAuto: false,
	confirmButtonText: 'Play',
	showLoaderOnConfirm: true,
	inputValidator: (vlink) => {
		if (!videoCheck(vlink)){
			return "Invalid Youtube Link";
		}
	},
	preConfirm: (vlink) => {
		return fetch('/video', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
				},
			body: JSON.stringify({video: vlink})
			})

			.then(response => {
				if (!response.ok){
					throw new Error(response.statusText)
				}
				return response.json()
			})
			.then(json => {
				songs = [json];
				loadSong(songs[0]);
				playSong();
			})
			.catch(error => {
				Swal.showValidationMessage(`Request failed: ${error}`)
			})
		},
	})
	
})()