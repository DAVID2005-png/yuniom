const $ = (selector, root=document) => root.querySelector(selector);
const menuButton = $('.menu-toggle');
const nav = $('#nav-links');
const themeToggle = $('#theme-toggle');
const applicationModal = $('#recruitment-modal');
const applicationForm = $('#application-form');
const trainingFields = $('#training-fields');
const recruitmentFields = $('#recruitment-fields');
const applicationMessage = $('#recruitment-message');
let activeIntent = 'recrutement';

const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  if (themeToggle) {
    themeToggle.innerHTML = isDark
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"/></svg>';
    themeToggle.setAttribute('aria-label', isDark ? 'Activer le thème clair' : 'Activer le thème sombre');
  }
  localStorage.setItem('yuniom-theme', theme);
};

const savedTheme = localStorage.getItem('yuniom-theme') || 'light';
applyTheme(savedTheme);

if (menuButton) {
  menuButton.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.textContent = opened ? '✕' : '☰';
  });
}

if (nav) {
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    }
  }));
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

const newsletterForm = $('#newsletter-form');
if (newsletterForm) newsletterForm.addEventListener('submit', event => {
  event.preventDefault();
  $('#newsletter-message').textContent = 'Merci ! Votre inscription de démonstration est confirmée.';
  event.target.reset();
});
const reviewSets = [
  [
    ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85', 'PROGRAMMATION', 'Construire ses premières pages web', 'Apprenez les bases du code en avançant par exercices pratiques.'],
    ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=85', 'CRÉATION VIDÉO', 'Donner vie à vos idées', 'Préparez des vidéos claires pour présenter vos services et vos projets.']
  ],
  [
    ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=85', 'BUREAUTIQUE', 'Travailler avec méthode', 'Maîtrisez les outils utiles pour vos documents, tableaux et présentations.'],
    ['https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=85', 'MAINTENANCE', 'Entretenir son matériel', 'Apprenez les gestes de diagnostic et les bonnes pratiques de maintenance.']
  ]
];
let reviewIndex=0;
function renderReviews(){const reviews=$('#reviews');reviews.innerHTML=reviewSets[reviewIndex].map(item=>`<article class="review"><img class="review-photo" src="${item[0]}" alt="" loading="lazy"><div><small>${item[1]}</small><b>${item[2]}</b><p>${item[3]}</p></div></article>`).join('');document.querySelectorAll('.dots i').forEach((dot,index)=>dot.classList.toggle('active',index===reviewIndex));}
$('.prev').addEventListener('click',()=>{reviewIndex=(reviewIndex+reviewSets.length-1)%reviewSets.length;renderReviews();});
$('.next').addEventListener('click',()=>{reviewIndex=(reviewIndex+1)%reviewSets.length;renderReviews();});
document.querySelectorAll('.dots i').forEach((dot,index)=>dot.addEventListener('click',()=>{reviewIndex=index%reviewSets.length;renderReviews();}));
function openLinkedFooterInfo() {
  const target = document.querySelector('.footer-disclosure:target');
  if (target) target.open = true;
}
document.querySelectorAll('a[href="#faq"], a[href="#conditions"], a[href="#confidentialite"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = $(link.getAttribute('href'));
    if (target) target.open = true;
  });
});
window.addEventListener('hashchange', openLinkedFooterInfo);
openLinkedFooterInfo();
function openApplicationModal(intent = 'recrutement', course = '') {
  activeIntent = intent;
  const isTraining = intent === 'formation';
  applicationForm.reset();
  trainingFields.hidden = !isTraining;
  recruitmentFields.hidden = isTraining;
  $('#modal-title').textContent = isTraining ? 'Inscription à une formation' : 'Candidature agent Yuniom';
  $('.modal-subtitle').textContent = isTraining
    ? 'Indiquez vos coordonnées et la formation qui vous intéresse.'
    : 'Présentez votre profil pour rejoindre l’équipe Yuniom.';
  const draft = JSON.parse(localStorage.getItem(`yuniom-${intent}-draft`) || '{}');
  Object.entries(draft).forEach(([name, value]) => {
    const field = applicationForm.elements.namedItem(name);
    const fieldGroup = field?.closest('.intent-fields');
    const belongsToActiveFlow = !fieldGroup || fieldGroup.id === (isTraining ? 'training-fields' : 'recruitment-fields');
    if (field && belongsToActiveFlow && name !== 'course') field.value = value;
  });
  $('#course').value = course || draft.course || 'Programmation';
  applicationMessage.textContent = '';
  applicationModal.classList.add('active');
  applicationModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  applicationModal.querySelector('input[name="name"]').focus();
}

function closeApplicationModal() {
  applicationModal.classList.remove('active');
  applicationModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('[data-open-modal]').forEach(button => {
  button.addEventListener('click', () => openApplicationModal(button.dataset.intent, button.dataset.course));
});
$('#close-recruitment').addEventListener('click', closeApplicationModal);
$('#cancel-modal').addEventListener('click', closeApplicationModal);
applicationModal.addEventListener('click', event => {
  if (event.target === applicationModal) closeApplicationModal();
});
applicationForm.addEventListener('input', () => {
  const draft = {};
  Array.from(applicationForm.elements).forEach(field => {
    const fieldGroup = field.closest('.intent-fields');
    const belongsToActiveFlow = !fieldGroup || fieldGroup.id === (activeIntent === 'formation' ? 'training-fields' : 'recruitment-fields');
    if (field.name && field.type !== 'file' && belongsToActiveFlow) draft[field.name] = field.value;
  });
  localStorage.setItem(`yuniom-${activeIntent}-draft`, JSON.stringify(draft));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeApplicationModal();
    closeVideoModal();
  }
});

applicationForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!applicationForm.reportValidity()) return;
  const values = new FormData(applicationForm);
  const name = values.get('name');
  const phone = values.get('phone');
  const email = values.get('email');
  const details = activeIntent === 'formation'
    ? [`Formation: ${values.get('course')}`, `Ville/Pays: ${values.get('training-location') || 'Non renseigné'}`, `Objectif: ${values.get('training-message') || 'Non précisé'}`]
    : [`Ville/Pays: ${values.get('location') || 'Non renseigné'}`, `Poste souhaité: ${values.get('role')}`, `Expérience et motivation: ${values.get('recruitment-message') || 'Non précisé'}`];
  const whatsappMessage = [
    'Bonjour Yuniom,',
    activeIntent === 'formation' ? 'Je souhaite m’inscrire à une formation.' : 'Je souhaite postuler comme agent.',
    `Nom: ${name}`,
    `Téléphone: ${phone}`,
    `E-mail: ${email}`,
    ...details
  ].join('\n');
  window.open(`https://wa.me/243965341806?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener');
  applicationMessage.textContent = 'Votre message est prêt dans WhatsApp. Vérifiez-le puis envoyez-le.';
});

const videoList = $('#video-list');
const videoModal = $('#video-modal');
const videoPlayer = $('#video-player');
const videoLibraryMessage = $('#video-library-message');
const localVideoFallback = [
  { src: 'videos/JAGUAMAN_-__CONGO_KINSHASA___clip_officiel_(1080p).mp4', poster: 'videos/posters/jaguaman.jpg', title: 'Jaguaman - Congo Kinshasa', category: 'Clip musical' },
  { src: 'videos/POP_CHINOIS_feat_DINHO_LA_MAGIE___JOJO_FLEX_-_TANZU_DRILL___Officiel_vidéo__4K(1080p).mp4', poster: 'videos/posters/pop-chinois.jpg', title: 'Pop Chinois feat. Dinho La Magie - Jojo Flex', category: 'Clip musical' }
];
const videoManager = $('#video-manager');
const videoUploadForm = $('#video-upload-form');
const videoUploadStatus = $('#video-upload-status');
const videoUploadProgress = $('#video-upload-progress');
const uploadVideoButton = $('#upload-video-button');
let activeUploadPassword = '';

function setVideoStatus(message) {
  videoUploadStatus.textContent = message;
}

function openVideoModal(video) {
  $('#video-modal-title').textContent = video.title;
  $('#video-error-message').hidden = true;
  if (video.playbackUrl) {
    const player = document.createElement('iframe');
    player.src = `${video.playbackUrl}?autoplay=true&preload=true`;
    player.title = video.title;
    player.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    videoPlayer.replaceChildren(player);
  } else {
    const player = document.createElement('video');
    player.className = 'local-video-player';
    player.controls = true;
    player.autoplay = true;
    player.playsInline = true;
    player.preload = 'metadata';
    player.src = video.src;
    player.setAttribute('aria-label', video.title);
    videoPlayer.replaceChildren(player);
  }
  const downloadLink = $('#download-video');
  downloadLink.href = video.downloadUrl || video.src || '#';
  downloadLink.download = video.src ? video.src.split('/').pop() : '';
  downloadLink.hidden = !video.downloadUrl && !video.src;
  downloadLink.setAttribute('aria-label', `Télécharger ${video.title}`);
  videoModal.classList.add('active');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  $('#close-video').focus();
}

function closeVideoModal() {
  if (!videoModal.classList.contains('active')) return;
  videoModal.classList.remove('active');
  videoModal.setAttribute('aria-hidden', 'true');
  videoPlayer.replaceChildren();
  $('#download-video').hidden = true;
  $('#video-error-message').hidden = true;
  document.body.classList.remove('modal-open');
}

function renderVideo(video) {
  const card = document.createElement('article');
  card.className = 'video-card';
  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.className = 'video-thumb';
  playButton.setAttribute('aria-label', `Lire ${video.title}`);
  const poster = document.createElement('span');
  poster.className = 'video-poster';
  poster.textContent = video.category;
  if (video.poster) {
    const image = document.createElement('img');
    image.className = 'video-poster-image';
    image.src = video.poster;
    image.alt = '';
    image.loading = 'lazy';
    poster.append(image);
  } else if (video.src) {
    const preview = document.createElement('video');
    preview.className = 'video-preview';
    preview.src = video.src;
    preview.muted = true;
    preview.playsInline = true;
    preview.preload = 'metadata';
    preview.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(preview.duration) && preview.duration > 0) {
        preview.currentTime = Math.min(2, preview.duration / 2);
      }
    }, { once: true });
    preview.addEventListener('error', () => preview.remove(), { once: true });
    poster.append(preview);
  }
  const playIcon = document.createElement('span');
  playIcon.className = 'play-icon';
  playIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7V5Z"/></svg>';
  playButton.append(poster, playIcon);
  playButton.addEventListener('click', () => openVideoModal(video));
  const meta = document.createElement('div');
  meta.className = 'video-meta';
  const category = document.createElement('span');
  category.className = 'video-category';
  category.textContent = video.category;
  const title = document.createElement('h3');
  title.textContent = video.title;
  meta.append(category, title);
  card.append(playButton, meta);
  videoList.append(card);
}

async function loadStreamVideos() {
  videoList.replaceChildren();
  videoLibraryMessage.textContent = '';
  try {
    const response = await fetch('/api/videos');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Le service vidéo est indisponible.');
    data.videos.forEach(renderVideo);
    if (!data.videos.length) videoLibraryMessage.textContent = 'Aucune vidéo publiée pour le moment.';
  } catch (error) {
    if (location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname)) {
      localVideoFallback.forEach(renderVideo);
      videoLibraryMessage.textContent = 'Aperçu local : les vidéos locales ne seront pas publiées sur Vercel. Configure Cloudflare Stream pour les mises en ligne.';
      return;
    }
    videoLibraryMessage.textContent = error.message || 'La bibliothèque vidéo est momentanément indisponible.';
  }
}

function encodeTusValue(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

async function getTusOffset(uploadUrl) {
  const response = await fetch(uploadUrl, { method: 'HEAD', headers: { 'Tus-Resumable': '1.0.0' } });
  if (!response.ok) throw new Error('Impossible de reprendre l’envoi. Recommence l’import.');
  return Number(response.headers.get('Upload-Offset') || 0);
}

async function uploadTusFile(file, uploadUrl, key) {
  const chunkSize = 50 * 1024 * 1024;
  let offset = await getTusOffset(uploadUrl);
  let retryCount = 0;
  while (offset < file.size) {
    const end = Math.min(offset + chunkSize, file.size);
    try {
      const response = await fetch(uploadUrl, {
        method: 'PATCH',
        headers: {
          'Tus-Resumable': '1.0.0',
          'Upload-Offset': String(offset),
          'Content-Type': 'application/offset+octet-stream'
        },
        body: file.slice(offset, end)
      });
      if (!response.ok) throw new Error(`Échec du bloc vidéo (${response.status}).`);
      offset = Number(response.headers.get('Upload-Offset') || end);
      retryCount = 0;
      sessionStorage.setItem(key, uploadUrl);
      const progress = Math.min(100, Math.floor((offset / file.size) * 100));
      videoUploadProgress.value = progress;
      setVideoStatus(`Envoi en cours : ${progress} %`);
    } catch (error) {
      retryCount += 1;
      if (retryCount > 5) throw new Error('Connexion interrompue. Tu peux sélectionner de nouveau ce fichier pour reprendre l’envoi.');
      await new Promise(resolve => setTimeout(resolve, Math.min(retryCount * 1500, 8000)));
      offset = await getTusOffset(uploadUrl);
    }
  }
  sessionStorage.removeItem(key);
}

$('#toggle-video-manager').addEventListener('click', () => {
  const isOpening = videoManager.hidden;
  videoManager.hidden = !isOpening;
  $('#toggle-video-manager').setAttribute('aria-expanded', String(isOpening));
});

videoUploadForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!videoUploadForm.reportValidity()) return;
  const file = $('#video-file').files[0];
  const title = $('#video-title').value.trim();
  const durationSeconds = Math.ceil(Number($('#video-duration-hours').value) * 3600);
  const adminPassword = $('#video-admin-password').value;
  const uploadKey = `yuniom-tus:${file.name}:${file.size}:${file.lastModified}`;
  uploadVideoButton.disabled = true;
  videoUploadProgress.hidden = false;
  videoUploadProgress.value = 0;

  try {
    let uploadUrl = sessionStorage.getItem(uploadKey);
    if (uploadUrl) {
      try {
        const offset = await getTusOffset(uploadUrl);
        setVideoStatus(`Reprise de l’envoi à ${Math.floor((offset / file.size) * 100)} %…`);
      } catch {
        sessionStorage.removeItem(uploadKey);
        uploadUrl = null;
      }
    }

    if (!uploadUrl) {
      setVideoStatus('Préparation de l’envoi sécurisé…');
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminPassword}` },
        body: JSON.stringify({ title, fileSize: file.size, contentType: file.type || 'application/octet-stream', maxDurationSeconds: durationSeconds })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Impossible de préparer l’import.');
      uploadUrl = data.uploadUrl;
      sessionStorage.setItem(uploadKey, uploadUrl);
    }

    await uploadTusFile(file, uploadUrl, uploadKey);
    videoUploadProgress.value = 100;
    setVideoStatus('Envoi terminé. Cloudflare prépare la lecture; la vidéo apparaîtra dans la bibliothèque après encodage.');
    videoUploadForm.reset();
    $('#video-duration-hours').value = '2';
    await loadStreamVideos();
  } catch (error) {
    setVideoStatus(error.message || 'Échec de l’import.');
  } finally {
    uploadVideoButton.disabled = false;
  }
});

loadStreamVideos();

$('#close-video').addEventListener('click', closeVideoModal);
videoModal.addEventListener('click', event => {
  if (event.target === videoModal) closeVideoModal();
});
$('#videos-prev').addEventListener('click', () => videoList.scrollBy({ left: -videoList.clientWidth * .8, behavior: 'smooth' }));
$('#videos-next').addEventListener('click', () => videoList.scrollBy({ left: videoList.clientWidth * .8, behavior: 'smooth' }));
