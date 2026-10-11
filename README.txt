YUNIOM — SITE VITRINE ET APERÇU MOBILE

Fichiers : index.html, style.css, script.js.

Pour lancer : extrayez le ZIP puis ouvrez index.html dans un navigateur. Pour modifier le projet, ouvrez le dossier dans Visual Studio Code.

L’aperçu du téléphone reprend l’interface mobile de votre capture : thème noir, accent orange, bannière Yuniom, story, message « Aucune publication pour le moment » et navigation du bas. Le site principal conserve un thème clair, avec les couleurs de Yuniom.

Les formulaires et boutons sont des démonstrations front-end. Aucune base de données, authentification ou fonctionnalité de paiement n’est connectée.

VIDÉOS : AJOUT PAR LE CODE

Il n’y a aucun formulaire d’ajout de vidéo sur le site. La liste publiée est le tableau videoData dans script.js. Pour publier un nouvel épisode :

1. Dépose la vidéo dans Cloudflare Stream depuis son tableau de bord. Cloudflare accepte de nombreux formats et prépare la lecture en streaming.
2. Copie l’UID de la vidéo depuis le tableau de bord Cloudflare.
3. Ajoute une entrée à videoData dans script.js :
	{ uid: 'UID_CLOUDFLARE', title: 'Titre de la vidéo', category: 'Formation' }
4. Enregistre et pousse le code sur GitHub; Vercel redéploiera la liste.

Tu peux utiliser poster: 'URL_IMAGE' pour fournir une vignette personnalisée. Pour offrir le téléchargement MP4, active cette option dans Cloudflare puis ajoute downloadable: true à l’entrée.

Les vidéos ayant seulement src: 'videos/mon-film.mp4' sont visibles dans l’aperçu local uniquement. Les fichiers MP4 sont exclus de GitHub par .gitignore; un fichier qui reste sur ton ordinateur ne peut pas être lu par les visiteurs du site en ligne. Cloudflare Stream accepte jusqu’à 10 heures par vidéo et le stockage/diffusion est payant. Les formats courants sont pris en charge, mais tout format imaginable n’est pas garanti.
