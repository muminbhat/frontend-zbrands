export function getHostname(u) {
  try {
    const url = new URL(u);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
}

export function getFavicon(u) {
  try {
    const url = new URL(u);
    return `${url.protocol}//${url.hostname}/favicon.ico`;
  } catch {
    return "/favicon.ico";
  }
}


