/*
  Destination browser behavior uses a local JSON file only. It supplies search
  and broad category filtering without any third-party API or backend.
*/
const DESTINATIONS_URL = "data/destinations.json";
let allDestinations = [];
let activeFilter = "all";
/* Escapes text before it enters an HTML template, protecting locally rendered content. */
function escapeHtml(value) { const box=document.createElement("div"); box.textContent=String(value); return box.innerHTML; }
/* Maps broad UI filter terms onto the more descriptive categories in the JSON data. */
function matchesFilter(item) { if(activeFilter==="all") return true; if(activeFilter==="Hill") return /Hill|Cloud|Nature|Adventure/.test(item.category); if(activeFilter==="Heritage") return /Heritage|Museum|Culture|Faith/.test(item.category); return item.category.includes(activeFilter); }
/* Renders only records matching both the selected category and entered search terms. */
function renderDestinations() {
 const grid=document.getElementById("destination-grid"), status=document.getElementById("destination-status"), search=document.getElementById("destination-search").value.trim().toLowerCase();
 const visible=allDestinations.filter((item)=>matchesFilter(item)&&[item.name,item.district,item.category,item.shortDescription].join(" ").toLowerCase().includes(search));
 status.textContent=visible.length+" destination"+(visible.length===1?"":"s")+" found.";
 grid.innerHTML=visible.length?visible.map((item)=>'<article class="destination-card"><img src="'+escapeHtml(item.image)+'" alt="'+escapeHtml(item.name)+' scenery"><div class="destination-card-body"><p class="card-label">'+escapeHtml(item.category)+" · "+escapeHtml(item.district)+'</p><h2>'+escapeHtml(item.name)+'</h2><p>'+escapeHtml(item.shortDescription)+'</p><div class="card-meta"><span>◷ '+escapeHtml(item.recommendedDuration)+'</span><a class="text-link" href="destination-details.html?id='+encodeURIComponent(item.id)+'">Explore →</a></div></div></article>').join(""):'<p class="empty-state">No destination matches that search. Try another word or category.</p>';
}
/* Adds lightweight event listeners once data has loaded so all controls use the same rendering function. */
function initializeControls() {
 document.getElementById("destination-search").addEventListener("input",renderDestinations);
 document.querySelectorAll("[data-filter]").forEach((button)=>button.addEventListener("click",()=>{activeFilter=button.dataset.filter;document.querySelectorAll("[data-filter]").forEach((item)=>item.classList.toggle("is-selected",item===button));renderDestinations();}));
}
/* Fetches the bundled data and presents an understandable error if the site was opened without a static server. */
async function loadDestinations() {
 const status=document.getElementById("destination-status");
 try { const response=await fetch(DESTINATIONS_URL); if(!response.ok) throw new Error("Data file unavailable"); allDestinations=await response.json(); initializeControls(); renderDestinations(); }
 catch(error) { status.textContent="Destinations could not be loaded. Please open the project through a local web server."; }
}
/* DOM readiness guarantees the browser controls exist before the module queries them. */
document.addEventListener("DOMContentLoaded",loadDestinations);
