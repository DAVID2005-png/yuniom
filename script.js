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
const isLocalVideoPreview = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
const videoData = [
  {
    uid: '',
    src: 'videos/JAGUAMAN_-__CONGO_KINSHASA___clip_officiel_(1080p).mp4',
    poster: 'videos/posters/jaguaman.jpg',
    title: 'Jaguaman - Congo Kinshasa',
    category: 'Clip musical'
  },
  {
    uid: '',
    src: 'videos/POP_CHINOIS_feat_DINHO_LA_MAGIE___JOJO_FLEX_-_TANZU_DRILL___Officiel_vidéo__4K(1080p).mp4',
    poster: 'videos/posters/pop-chinois.jpg',
    title: 'Pop Chinois feat. Dinho La Magie - Jojo Flex',
    category: 'Clip musical'
  }
];

function getConfiguredVideos() {
  return videoData
    .filter(video => video.uid || video.poster || (isLocalVideoPreview && video.src))
    .map(video => {
      if (!video.uid) return video;
      return {
        ...video,
        playbackUrl: `https://iframe.videodelivery.net/${video.uid}`,
        poster: video.poster || `https://videodelivery.net/${video.uid}/thumbnails/thumbnail.jpg`,
        downloadUrl: video.downloadable ? `https://videodelivery.net/${video.uid}/downloads/default.mp4` : ''
      };
    });
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
  } else if (isLocalVideoPreview && video.src) {
    const player = document.createElement('video');
    player.className = 'local-video-player';
    player.controls = true;
    player.autoplay = true;
    player.playsInline = true;
    player.preload = 'metadata';
    player.src = video.src;
    player.setAttribute('aria-label', video.title);
    player.addEventListener('error', () => {
      $('#video-error-message').textContent = 'Le fichier vidéo local est introuvable ou son format ne peut pas être lu. Vérifie son chemin dans videoData.';
      $('#video-error-message').hidden = false;
    }, { once: true });
    videoPlayer.replaceChildren(player);
  } else {
    videoPlayer.replaceChildren();
    $('#video-error-message').textContent = 'La vignette est publiée, mais la vidéo doit être hébergée sur Cloudflare Stream. Ajoute son UID dans videoData pour activer la lecture en ligne.';
    $('#video-error-message').hidden = false;
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
    image.loading = 'eager';
    poster.append(image);
  } else if (video.src) {
    const preview = document.createElement('video');
    preview.className = 'video-preview';
    preview.src = video.src;
    preview.muted = true;
    preview.playsInline = true;
    preview.preload = 'metadata';
    preview.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(preview.duration) && preview.duration > 0) preview.currentTime = Math.min(2, preview.duration / 2);
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

const configuredVideos = getConfiguredVideos();
configuredVideos.forEach(renderVideo);
if (!configuredVideos.length) {
  videoLibraryMessage.textContent = 'Ajoute une vidéo dans le tableau videoData pour la faire apparaître ici.';
}

$('#close-video').addEventListener('click', closeVideoModal);
videoModal.addEventListener('click', event => {
  if (event.target === videoModal) closeVideoModal();
});
$('#videos-prev').addEventListener('click', () => videoList.scrollBy({ left: -videoList.clientWidth * .8, behavior: 'smooth' }));
$('#videos-next').addEventListener('click', () => videoList.scrollBy({ left: videoList.clientWidth * .8, behavior: 'smooth' }));
