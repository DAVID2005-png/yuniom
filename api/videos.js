const { timingSafeEqual } = require('node:crypto');

const CLOUDFLARE_API = 'https://api.cloudflare.com/client/v4';
const MAX_DURATION_SECONDS = 10 * 60 * 60;

function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function isAuthorized(req) {
  const expected = process.env.VIDEO_ADMIN_PASSWORD || '';
  const authorization = req.headers.authorization || '';
  const supplied = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!expected || !supplied) return false;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

function encodeMetadata(name, value) {
  return `${name} ${Buffer.from(value, 'utf8').toString('base64')}`;
}

function cloudflareConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_STREAM_TOKEN;
  if (!accountId || !apiToken) throw new Error('Configuration Cloudflare manquante.');
  return { accountId, apiToken };
}

function cloudflareError(data) {
  return data?.errors?.map(error => error.message).filter(Boolean).join(' ') || 'Erreur Cloudflare Stream.';
}

async function listVideos() {
  const { accountId, apiToken } = cloudflareConfig();
  const response = await fetch(`${CLOUDFLARE_API}/accounts/${accountId}/stream?limit=1000&asc=false`, {
    headers: { Authorization: `Bearer ${apiToken}` }
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(cloudflareError(data));

  const videos = (data.result || [])
    .filter(video => video.uid && video.readyToStream)
    .map(video => ({
      uid: video.uid,
      title: video.meta?.name || 'Vidéo Yuniom',
      category: 'Yuniom',
      duration: video.duration || 0,
      poster: video.thumbnail || `https://videodelivery.net/${video.uid}/thumbnails/thumbnail.jpg`,
      playbackUrl: `https://iframe.videodelivery.net/${video.uid}`,
      downloadUrl: video.downloadable ? `https://videodelivery.net/${video.uid}/downloads/default.mp4` : null
    }));

  return videos;
}

async function createTusUpload(req, res) {
  if (!isAuthorized(req)) return sendJson(res, 401, { error: 'Code administrateur incorrect.' });

  const title = String(req.body?.title || '').trim();
  const fileSize = Number(req.body?.fileSize);
  const contentType = String(req.body?.contentType || 'application/octet-stream').slice(0, 120);
  const durationSeconds = Math.ceil(Number(req.body?.maxDurationSeconds));
  if (!title || title.length > 120) return sendJson(res, 400, { error: 'Le titre doit contenir entre 1 et 120 caractères.' });
  if (!Number.isSafeInteger(fileSize) || fileSize <= 0) return sendJson(res, 400, { error: 'Taille de fichier invalide.' });
  if (!Number.isInteger(durationSeconds) || durationSeconds < 1 || durationSeconds > MAX_DURATION_SECONDS) {
    return sendJson(res, 400, { error: 'La durée maximale doit être comprise entre 1 seconde et 10 heures.' });
  }

  const { accountId, apiToken } = cloudflareConfig();
  const metadata = [
    encodeMetadata('name', title),
    encodeMetadata('filetype', contentType),
    encodeMetadata('maxDurationSeconds', String(durationSeconds))
  ].join(',');
  const response = await fetch(`${CLOUDFLARE_API}/accounts/${accountId}/stream?direct_user=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Tus-Resumable': '1.0.0',
      'Upload-Length': String(fileSize),
      'Upload-Metadata': metadata
    }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    return sendJson(res, response.status, { error: cloudflareError(data) });
  }

  const uploadLocation = response.headers.get('Location');
  const videoUid = response.headers.get('stream-media-id');
  if (!uploadLocation || !videoUid) return sendJson(res, 502, { error: 'Cloudflare n’a pas retourné l’URL TUS attendue.' });

  return sendJson(res, 201, { uploadUrl: uploadLocation, uid: videoUid });
}

module.exports = async function videosApi(req, res) {
  try {
    if (req.method === 'GET') {
      const videos = await listVideos();
      return sendJson(res, 200, { videos });
    }
    if (req.method === 'POST') return await createTusUpload(req, res);
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'Méthode non autorisée.' });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'Erreur du service vidéo.' });
  }
};
