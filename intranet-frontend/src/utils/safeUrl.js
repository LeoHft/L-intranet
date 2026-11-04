// N'autorise que les liens web : une ancienne valeur en base du type "javascript:..." ne doit jamais s'exécuter.
export default function safeUrl(url) {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol) ? url : null;
  } catch {
    return null;
  }
}
