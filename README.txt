YUNIOM — SITE VITRINE ET APERÇU MOBILE

Fichiers : index.html, style.css, script.js.

Pour lancer : extrayez le ZIP puis ouvrez index.html dans un navigateur. Pour modifier le projet, ouvrez le dossier dans Visual Studio Code.

L’aperçu du téléphone reprend l’interface mobile de votre capture : thème noir, accent orange, bannière Yuniom, story, message « Aucune publication pour le moment » et navigation du bas. Le site principal conserve un thème clair, avec les couleurs de Yuniom.

Les formulaires et boutons sont des démonstrations front-end. Aucune base de données, authentification ou fonctionnalité de paiement n’est connectée.

VIDÉOS LONGUES ET IMPORTS

La galerie publique lit les vidéos depuis Cloudflare Stream. Pour activer les imports sur Vercel :

1. Activez Cloudflare Stream et créez un jeton API ayant les permissions Stream Read et Stream Write.
2. Dans les paramètres Vercel du projet, ajoutez CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_STREAM_TOKEN et VIDEO_ADMIN_PASSWORD. Gardez le jeton et le mot de passe secrets; ne les mettez jamais dans le code.
3. Redéployez le projet. Ouvrez la section Vidéos, cliquez sur Gérer les vidéos, entrez le code administrateur, choisissez un titre, une durée maximale et un fichier, puis lancez l’import.

Le navigateur envoie le fichier par blocs TUS directement à Cloudflare, avec progression et reprise après interruption. Cloudflare transcode les entrées vidéo compatibles vers ses formats de streaming et génère la vignette. La bibliothèque ajoute les vidéos après la fin de leur traitement.

Limites importantes : Cloudflare Stream limite la durée maximale configurée à 10 heures par vidéo; le service et le trafic vidéo sont payants selon le tarif Cloudflare. « Tous les formats » n’est pas garanti : les formats vidéo courants sont pris en charge, mais un fichier rejeté par Stream devra être converti. Les téléchargements MP4 nécessitent que l’option de téléchargement soit activée sur Cloudflare Stream.

Les MP4 déposés dans videos/ restent des fichiers de développement locaux et sont exclus de GitHub. Ils ne sont pas nécessaires aux nouveaux imports Cloudflare.
