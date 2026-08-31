export const FENGMAP_DECODER_URL = "/static/fengmap/";
export const FENGMAP_MAP_URL = "/data/";
export const FENGMAP_THEME_URL = "/data/theme/";

function ensureTrailingSlash(url) {
  if (!url) {
    return "/";
  }
  return url.endsWith("/") ? url : url + "/";
}

export function getFengmapMapURL() {
  const fromEnv = process.env.VUE_APP_FENGMAP_MAP_URL;
  if (fromEnv && String(fromEnv).trim()) {
    return ensureTrailingSlash(String(fromEnv).trim());
  }
  return FENGMAP_MAP_URL;
}

export function getFengmapThemeURL() {
  const fromEnv = process.env.VUE_APP_FENGMAP_THEME_URL;
  if (fromEnv && String(fromEnv).trim()) {
    return ensureTrailingSlash(String(fromEnv).trim());
  }
  return FENGMAP_THEME_URL;
}

export function applyFengmapLocalLoad(options) {
  return {
    ...options,
    decoderURL: FENGMAP_DECODER_URL,
    mapURL: getFengmapMapURL(),
    themeURL: getFengmapThemeURL(),
  };
}
