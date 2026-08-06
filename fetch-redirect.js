const orig = globalThis.fetch;
const MIRRORS = ["https://gh-proxy.com/", "https://ghfast.top/"];

globalThis.fetch = async function (...args) {
  const rawUrl = typeof args[0] === "string" ? args[0] : args[0] && args[0].url;
  const s = String(rawUrl);
  if (s.startsWith("https://github.com/")) {
    for (const m of MIRRORS) {
      try {
        console.error("[fetch-redirect] " + s + "  ->  " + m + s);
        const resp = await orig(m + s, args[1]);
        console.error("[fetch-redirect] got status " + resp.status + " via " + m);
        return resp;
      } catch (e) {
        console.error("[fetch-redirect] mirror " + m + " failed: " + (e.cause || e.message));
      }
    }
    console.error("[fetch-redirect] all mirrors failed, falling back to direct");
    return orig.apply(this, args);
  }
  return orig.apply(this, args);
};