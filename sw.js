const CACHE="para-takip-v3";
const DOSYALAR=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(DOSYALAR)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin)return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{
    const guncel=fetch(e.request).then(res=>{if(res&&res.ok){const k=res.clone();caches.open(CACHE).then(c=>c.put(e.request,k))}return res}).catch(()=>null);
    if(r){e.waitUntil(guncel);return r}
    return guncel.then(res=>res||caches.match("index.html"));
  }));
});
