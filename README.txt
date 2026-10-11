YUNIOM — SITE VITRINE ET APERÇU MOBILE

Fichiers : index.html, style.css, script.js.

Pour lancer : extrayez le ZIP puis ouvrez index.html dans un navigateur. Pour modifier le projet, ouvrez le dossier dans Visual Studio Code.

L’aperçu du téléphone reprend l’interface mobile de votre capture : thème noir, accent orange, bannière Yuniom, story, message « Aucune publication pour le moment » et navigation du bas. Le site principal conserve un thème clair, avec les couleurs de Yuniom.

Les formulaires et boutons sont des démonstrations front-end. Aucune base de données, authentification ou fonctionnalité de paiement n’est connectée.

AJOUTER DES VIDÉOS LOCALES

1. Copiez le fichier vidéo dans videos/ et une image de vignette JPG dans videos/posters/.
2. Dans script.js, ajoutez un objet dans videoData :
	{ src: 'videos/ma-video.mp4', poster: 'videos/posters/ma-video.jpg', title: 'Mon titre', category: 'Formation' }
3. Enregistrez puis rechargez index.html. La vignette montre l’image choisie; un clic lance la vidéo dans le lecteur du site et le bouton Télécharger récupère le fichier.

Les deux vidéos actuellement fournies sont en MP4 H.264/AAC. Pour les prochains fichiers, ce format offre une bonne compatibilité sur ordinateur et mobile. Le site statique ne peut pas détecter automatiquement les nouveaux fichiers ajoutés au dossier : chaque vidéo et son image de vignette doivent être déclarées dans videoData.
