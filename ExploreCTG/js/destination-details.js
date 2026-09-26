/*
  Destination details read a requested id from the URL, find that record in the
  local JSON file, and build route, price, stay, food, vlog and review sections.
*/
const DETAIL_DATA_URL = "data/destinations.json";
/* Escaping keeps JSON values safe when inserted into the static page template. */
function safe(value) { const box=document.createElement("div"); box.textContent=String(value); return box.innerHTML; }
/* Produces a concise repeated list for hotels, restaurants, safety tips and reviews. */
function list(items, renderer) { return items.map(renderer).join(""); }
/* Builds the full accessible detail layout from a single destination record. */
function renderDetail(item) {
 const root=document.getElementById("destination-detail");
 const transport=list(item.routeMap.transportOptions,(option)=>'<li><strong>'+safe(option.mode)+'</strong><span>'+safe(option.price)+'</span></li>');
 const hotels=list(item.hotels,(hotel)=>'<li><strong>'+safe(hotel.name)+'</strong><span>'+safe(hotel.area)+" · "+safe(hotel.priceRange)+'</span></li>');
 const food=list(item.restaurants,(place)=>'<li><strong>'+safe(place.name)+'</strong><span>'+safe(place.area)+" · "+safe(place.specialty)+'</span></li>');
 const reviews=list(item.reviews,(review)=>'<blockquote><div>'+("★".repeat(review.rating))+'</div><p>“'+safe(review.comment)+'”</p><cite>— '+safe(review.author)+'</cite></blockquote>');
 const videos=list(item.vlogs,(vlog)=>'<a class="video-link" target="_blank" rel="noopener" href="'+safe(vlog.url)+'">▶ '+safe(vlog.title)+' <span>Open YouTube search ↗</span></a>');
 root.innerHTML='<section class="detail-hero" style="background-image:linear-gradient(90deg,rgba(2,35,48,.86),rgba(2,35,48,.27)),url(&quot;'+safe(item.image)+'&quot;)"><div class="container"><a class="back-link" href="destinations.html">← All destinations</a><p class="eyebrow light-eyebrow">'+safe(item.category)+" · "+safe(item.district)+'</p><h1>'+safe(item.name)+'</h1><p>'+safe(item.shortDescription)+'</p><div class="detail-pills"><span>Best time: '+safe(item.bestTime)+'</span><span>Recommended: '+safe(item.recommendedDuration)+'</span></div></div></section><section class="section"><div class="container detail-layout"><article class="detail-story"><h2>Why visit?</h2><p>'+safe(item.description)+'</p><h2>How to get there</h2><p>'+safe(item.howToGo)+'</p><div class="detail-callout"><strong>From Chattogram</strong><p>'+safe(item.routeMap.fromChattogram)+'</p><div><span>Distance: '+safe(item.routeMap.distance)+'</span><span>Travel time: '+safe(item.routeMap.travelTime)+'</span></div></div><h2>Vlogs & traveler reviews</h2><div class="video-links">'+videos+'</div><div class="review-grid">'+reviews+'</div></article><aside class="detail-side"><section class="info-panel"><h2>Route map & prices</h2><ul class="info-list">'+transport+'</ul></section><section class="info-panel"><h2>Available hotels</h2><ul class="info-list">'+hotels+'</ul></section><section class="info-panel"><h2>Restaurants nearby</h2><ul class="info-list">'+food+'</ul></section><section class="safety-panel"><h2>Travel safely</h2><ul>'+list(item.safetyTips,(tip)=>'<li>'+safe(tip)+'</li>')+'</ul></section><a class="button button-primary detail-action" href="itinerary.html">Add this trip to itinerary →</a></aside></div></section>';
 document.title=item.name+" | Explore Chattogram";
}
/* Shows a clear fallback instead of a broken blank page for a missing destination id. */
function renderMissing() { document.getElementById("destination-detail").innerHTML='<section class="section"><div class="container empty-state"><h1>Destination not found</h1><p>Please return to the destination list and choose a place to explore.</p><a class="button button-primary" href="destinations.html">Browse destinations</a></div></section>'; }
/* Loads local JSON and selects the record named by ?id= in the browser address. */
async function loadDetail() {
 try { const response=await fetch(DETAIL_DATA_URL); if(!response.ok) throw new Error("Data file unavailable"); const items=await response.json(); const id=new URLSearchParams(location.search).get("id"); const item=items.find((entry)=>entry.id===id); item?renderDetail(item):renderMissing(); }
 catch(error) { document.getElementById("destination-detail").innerHTML='<section class="section"><div class="container empty-state"><h1>We could not load this destination.</h1><p>Please serve the project from a local web server and try again.</p></div></section>'; }
}
/* Waiting for document parsing ensures the dynamic root element is present. */
document.addEventListener("DOMContentLoaded",loadDetail);
