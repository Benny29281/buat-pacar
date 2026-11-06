'use strict';

const letter = document.querySelector('#letter-dialog');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let openingLetter = false;
document.querySelectorAll('.open-letter').forEach(button => button.addEventListener('click', () => {
  if (openingLetter || letter.open) return;
  openingLetter = true;
  document.querySelector('.envelope').classList.add('is-opening');
  playEffect('open');
  burstAt(button);
  window.setTimeout(() => {
    letter.showModal();
    letter.scrollTop = 0;
    document.body.classList.add('modal-open');
    openingLetter = false;
  }, reducedMotion.matches ? 0 : 650);
}));
function closeLetter() { playEffect('tap'); letter.close(); }
document.querySelector('.close-dialog').addEventListener('click', closeLetter);
document.querySelector('.close-letter').addEventListener('click', closeLetter);
letter.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  document.querySelector('.envelope').classList.remove('is-opening');
});
letter.addEventListener('click', event => {
  if (event.target !== letter) return;
  const rect = letter.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeLetter();
});

document.querySelectorAll('.reason').forEach(card => {
  card.addEventListener('click', () => {
    const expanded = card.getAttribute('aria-expanded') !== 'true';
    card.setAttribute('aria-expanded', String(expanded));
    card.querySelector('.reason-teaser').hidden = expanded;
    card.querySelector('.reason-reveal').hidden = !expanded;
    card.querySelector('.reason-action').innerHTML = expanded ? 'simpan di hati <span>♡</span>' : 'buka pesan <span>↗</span>';
    playEffect(expanded ? 'sparkle' : 'tap');
    if (expanded) { animateElement(card.querySelector('.reason-reveal'), 'message-in'); burstAt(card); }
  });
});

const messages = [
  'Apa pun harimu hari ini, semoga kamu ingat: ada seseorang yang bahagia karena kamu ada.',
  'Nggak apa-apa kalau hari ini cuma sanggup berjalan pelan. Kamu tetap berharga, di setiap langkahnya.',
  'Kalau dunia terasa terlalu ramai, semoga pesan ini jadi tempat kecil untuk kamu menarik napas.',
  'Aku ingin mendengar ceritamu. Bahkan hal kecil yang menurutmu nggak penting sekalipun.',
  'Jangan lupa baik sama diri sendiri, ya. Kamu juga pantas menerima sayang yang kamu berikan ke orang lain.',
  'Ada banyak hal indah di dunia. Buatku, salah satunya adalah mengenal kamu.',
  'Semoga hari esok membawa kabar baik, tidur yang cukup, dan alasan baru untuk tersenyum.',
  'Kalau kamu butuh pengingat hari ini: kamu disayang. Sesederhana itu, sebesar itu.'
];
let messageIndex = 0;
document.querySelector('#next-message').addEventListener('click', () => {
  messageIndex = (messageIndex + 1) % messages.length;
  document.querySelector('#pocket-message').textContent = messages[messageIndex];
  document.querySelector('#message-counter').textContent = `${String(messageIndex + 1).padStart(2, '0')} / 08`;
  animateElement(document.querySelector('#pocket-message'), 'message-in');
  playEffect('sparkle');
});

let hugs = 0;
const loveButton = document.querySelector('#send-love');
loveButton.addEventListener('click', () => {
  hugs++;
  playEffect('love');
  animateElement(loveButton, 'heart-pop');
  loveButton.textContent = '♥';
  document.querySelector('#hug-caption').textContent = hugs === 1 ? 'Satu peluk hangat untuk Rizky. Kamu disayang! ♡' : `${hugs} peluk untukmu. Sayangnya masih banyak lagi. ♡`;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = document.querySelector('#celebration');
  if (container.childElementCount > 50) return;
  for (let i = 0; i < 16; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = i % 2 ? '♡' : '♥';
    heart.style.cssText = `left:${Math.random() * 100}%;font-size:${16 + Math.random() * 23}px;animation-delay:${Math.random() * .5}s;--drift:${Math.random() * 160 - 80}px;--spin:${Math.random() * 70 - 35}deg`;
    container.append(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }
});

// A quiet, original music-box melody; generated locally, without audio downloads.
let audioContext;
let audioStarting = false;
let musicTimer;
let musicOn = false;
let activeNotes = new Set();
const melody = [523.25,659.25,783.99,659.25,587.33,698.46,880,698.46,659.25,783.99,1046.5,987.77,880,783.99,659.25,587.33];
const soundButton = document.querySelector('.sound-toggle');
function createTone(frequency, delay = 0, duration = .6, volume = .04) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const start = audioContext.currentTime + delay;
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + .02);
  gain.gain.exponentialRampToValueAtTime(.001, start + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  activeNotes.add(oscillator);
  oscillator.onended = () => { activeNotes.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
  oscillator.start(start);
  oscillator.stop(start + duration + .05);
}
function playEffect(kind) {
  if (!musicOn || !audioContext || audioContext.state !== 'running') return;
  const notes = { tap: [659.25], sparkle: [783.99, 1046.5], open: [523.25, 659.25, 783.99, 1046.5], love: [659.25, 783.99, 987.77] };
  (notes[kind] || notes.tap).forEach((note, index) => createTone(note, index * .09, .55, .045));
}
function playMelody() {
  melody.forEach((frequency, index) => {
    createTone(frequency, index * .6, 1.6, .03);
    if (index % 4 === 0) createTone(frequency / 2, index * .6, 2.3, .022);
  });
}
function stopMusic() {
  clearInterval(musicTimer);
  activeNotes.forEach(note => { try { note.stop(); } catch {} });
  activeNotes.clear();
  musicOn = false;
  soundButton.setAttribute('aria-pressed', 'false');
  soundButton.setAttribute('aria-label', 'Nyalakan musik dan efek suara');
  document.querySelector('.sound-label').textContent = 'Suara off';
}
async function startMusic() {
  if (musicOn || audioStarting) return;
  audioStarting = true;
  try {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) throw new Error('Audio unavailable');
    audioContext ??= new AudioEngine();
    await audioContext.resume();
    if (document.hidden) { stopMusic(); return; }
    musicOn = true;
    playMelody();
    musicTimer = setInterval(playMelody, 10400);
    soundButton.setAttribute('aria-pressed', 'true');
    soundButton.setAttribute('aria-label', 'Matikan musik dan efek suara');
    document.querySelector('.sound-label').textContent = 'Suara on';
  } catch {
    stopMusic();
    document.querySelector('.sound-label').textContent = 'Musik tidak tersedia';
  } finally { audioStarting = false; }
}
soundButton.addEventListener('click', () => {
  if (musicOn) stopMusic(); else startMusic();
});
document.addEventListener('visibilitychange', () => { if (document.hidden && musicOn) stopMusic(); });
window.addEventListener('pagehide', stopMusic);

function animateElement(element, name) {
  if (reducedMotion.matches || !element.animate) return;
  const frames = name === 'heart-pop'
    ? [{ transform: 'scale(1)' }, { transform: 'scale(1.25)', offset: .4 }, { transform: 'scale(1)' }]
    : [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }];
  element.animate(frames, { duration: 450, easing: 'ease-out' });
}
function burstAt(element) {
  if (reducedMotion.matches) return;
  const container = document.querySelector('#celebration');
  if (container.childElementCount > 45) return;
  const rect = element.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('span');
    particle.className = 'tap-particle';
    particle.textContent = i % 2 ? '♡' : '✧';
    const angle = Math.PI * 2 * i / 8;
    particle.style.cssText = `left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;--x:${Math.cos(angle) * 90}px;--y:${Math.sin(angle) * 75 - 30}px;`;
    container.append(particle);
    particle.addEventListener('animationend', () => particle.remove(), { once: true });
  }
}

// The welcome button is the user gesture that unlocks audio on mobile browsers.
const welcome = document.querySelector('#welcome-dialog');
welcome.showModal();
document.body.classList.add('modal-open');
welcome.addEventListener('close', () => document.body.classList.remove('modal-open'));
document.querySelector('#start-surprise').addEventListener('click', () => {
  startMusic();
  welcome.close();
  document.body.classList.add('experience-started');
  burstAt(document.querySelector('.dedication'));
});

// The album uses the same optional chimes as the rest of the page.
const photoDialog = document.querySelector('#photo-dialog');
const photoCards = [...document.querySelectorAll('.photo-card')];
let currentPhoto = 0;
function showPhoto(index) {
  currentPhoto = (index + photoCards.length) % photoCards.length;
  const card = photoCards[currentPhoto];
  const source = card.querySelector('img');
  const fullPhoto = document.querySelector('#full-photo');
  fullPhoto.src = source.getAttribute('src');
  fullPhoto.alt = source.alt;
  document.querySelector('#full-photo-caption').textContent = card.querySelector('.photo-caption').textContent;
  document.querySelector('#photo-count').textContent = `${currentPhoto + 1} / ${photoCards.length}`;
  animateElement(fullPhoto, 'message-in');
}
photoCards.forEach((card, index) => card.addEventListener('click', () => {
  showPhoto(index);
  photoDialog.showModal();
  document.body.classList.add('modal-open');
  playEffect('open');
}));
document.querySelector('.photo-close').addEventListener('click', () => photoDialog.close());
photoDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
function changePhoto(step) { showPhoto(currentPhoto + step); playEffect('sparkle'); }
document.querySelector('#previous-photo').addEventListener('click', () => changePhoto(-1));
document.querySelector('#next-photo').addEventListener('click', () => changePhoto(1));
photoDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
let photoTouchStart = null;
photoDialog.addEventListener('touchstart', event => {
  photoTouchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
photoDialog.addEventListener('touchend', event => {
  if (!photoTouchStart || event.touches.length || !event.changedTouches.length) { photoTouchStart = null; return; }
  const dx = event.changedTouches[0].clientX - photoTouchStart.x;
  const dy = event.changedTouches[0].clientY - photoTouchStart.y;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) changePhoto(dx < 0 ? 1 : -1);
  photoTouchStart = null;
}, { passive: true });
photoDialog.addEventListener('touchcancel', () => { photoTouchStart = null; }, { passive: true });

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .1 });
  document.querySelectorAll('.section').forEach(section => { section.classList.add('scroll-reveal'); observer.observe(section); });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) { observer.disconnect(); document.querySelectorAll('.scroll-reveal').forEach(section => section.classList.add('is-visible')); }
  });
}
