'use strict';

const letter = document.querySelector('#letter-dialog');
document.querySelectorAll('.open-letter').forEach(button => button.addEventListener('click', () => {
  letter.showModal();
  document.body.classList.add('modal-open');
}));
function closeLetter() { letter.close(); }
document.querySelector('.close-dialog').addEventListener('click', closeLetter);
document.querySelector('.close-letter').addEventListener('click', closeLetter);
letter.addEventListener('close', () => document.body.classList.remove('modal-open'));
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
});

let hugs = 0;
const loveButton = document.querySelector('#send-love');
loveButton.addEventListener('click', () => {
  hugs++;
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
let musicTimer;
let musicOn = false;
let activeNotes = new Set();
const melody = [523.25,659.25,783.99,659.25,587.33,698.46,880,698.46,659.25,783.99,1046.5,987.77,880,783.99,659.25,587.33];
const soundButton = document.querySelector('.sound-toggle');
function playMelody() {
  melody.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime + index * .6;
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(.055, start + .02);
    gain.gain.exponentialRampToValueAtTime(.001, start + 1.6);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    activeNotes.add(oscillator);
    oscillator.onended = () => { activeNotes.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
    oscillator.start(start);
    oscillator.stop(start + 1.7);
  });
}
function stopMusic() {
  clearInterval(musicTimer);
  activeNotes.forEach(note => { try { note.stop(); } catch {} });
  activeNotes.clear();
  musicOn = false;
  soundButton.setAttribute('aria-pressed', 'false');
  soundButton.setAttribute('aria-label', 'Nyalakan musik lembut');
  document.querySelector('.sound-label').textContent = 'Musik off';
}
soundButton.addEventListener('click', async () => {
  if (musicOn) { stopMusic(); return; }
  try {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) throw new Error('Audio unavailable');
    audioContext ??= new AudioEngine();
    await audioContext.resume();
    musicOn = true;
    playMelody();
    musicTimer = setInterval(playMelody, 10400);
    soundButton.setAttribute('aria-pressed', 'true');
    soundButton.setAttribute('aria-label', 'Matikan musik lembut');
    document.querySelector('.sound-label').textContent = 'Musik on';
  } catch {
    stopMusic();
    document.querySelector('.sound-label').textContent = 'Musik tidak tersedia';
  }
});
document.addEventListener('visibilitychange', () => { if (document.hidden && musicOn) stopMusic(); });
