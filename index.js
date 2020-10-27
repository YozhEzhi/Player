let audio;
const player = document.querySelector('#player');
const artist = player.querySelector('.artist');
const cover = player.querySelector('#cover');
const duration = player.querySelector('#duration');
const nextBtn = player.querySelector('#next');
const pauseBtn = player.querySelector('#pause');
const playBtn = player.querySelector('#play');
const playlist = player.querySelector('#playlist');
const playlistItems = player.querySelectorAll('li');
const prevBtn = player.querySelector('#prev');
const progressBar = player.querySelector('#progress');
const stopBtn = player.querySelector('#stop');
const title = player.querySelector('.title');
const volumeRange = player.querySelector('#volume');

function initAudio(element) {
  const song = element.getAttribute('song');
  const artistName = song.split(' - ')[0];

  // Create Audio Object:
  audio = new Audio(`media/${song}.mp3`);
  changeVolumeAndOpacity();

  duration.textContent = '00:00';
  title.textContent = song.split(' - ')[1];
  artist.textContent = artistName;
  cover.setAttribute('src', `images/${artistName}.jpg`);

  playlistItems.forEach(item => item.classList.remove('active'));
  element.classList.add('active');
}

function changeVolumeAndOpacity() {
  const volumeRatio = parseFloat(volumeRange.value / 100);
  audio.volume = volumeRatio;
  cover.style.opacity = volumeRatio;
}

function showDuration() {
  audio.addEventListener('timeupdate', () => {
    // Get hours & minutes:
    let s = parseInt(audio.currentTime % 60, 10);
    let m = parseInt((audio.currentTime / 60) % 60, 10);

    // Add 0 if less than 10:
    if (s < 10) s = `0${s}`;
    if (m < 10) m = `0${m}`;

    duration.textContent = `${m}:${s}`;

    let value = 0;

    if (audio.currentTime > 0) {
      value = ((100 / audio.duration) * audio.currentTime).toFixed(2);
    }

    progressBar.style.width = `${value}%`;
  });
}

function toggleBtnClasses() {
  pauseBtn.classList.toggle('active');
  playBtn.classList.toggle('hidden');
}

function play() {
  toggleBtnClasses();
  audio.play();
  showDuration();
}

function pause() {
  toggleBtnClasses();
  audio.pause();
}

function stop() {
  audio.pause();
  audio.currentTime = 0;
  pauseBtn.classList.add('hidden');
  pauseBtn.classList.remove('active');

  playBtn.classList.add('active');
  playBtn.classList.remove('hidden');
}

function skipTrack(next) {
  let selector = next ? 'li:first-child' : 'li:last-child';
  let sibling = next ? 'nextElementSibling' : 'previousElementSibling';

  audio.pause();
  let target = playlist.querySelector('li.active')[sibling];
  if (!target) target = playlist.querySelector(selector);

  initAudio(target);
  audio.play();
  showDuration();

  pauseBtn.classList.add('active');
  playBtn.classList.add('hidden');
}

function playSelected(event) {
  audio.pause();
  initAudio(event.target);
  audio.play();
  showDuration();
}

// Initialize first Audio:
initAudio(playlist.querySelector('li:first-child'));

nextBtn.addEventListener('click', ()=> skipTrack(true));
pauseBtn.addEventListener('click', pause);
playlist.addEventListener('click', playSelected);
playBtn.addEventListener('click', play);
prevBtn.addEventListener('click', () => skipTrack(false));
stopBtn.addEventListener('click', stop);
volumeRange.addEventListener('input', changeVolumeAndOpacity);
