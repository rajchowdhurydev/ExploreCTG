/*
  Shared browser-only session helpers. This file reads exactly the session key
  written by auth.js and exposes a small common API for remaining site pages.
*/
const ExploreCTG = (() => {
  const SESSION_KEY = "exploreCTG_session";
  /* Returns a valid session object, or clears malformed browser data. */
  function getSession() { try { const value=JSON.parse(localStorage.getItem(SESSION_KEY)||"null"); return value&&value.role ? value : null; } catch { localStorage.removeItem(SESSION_KEY); return null; } }
  /* Ends only the local session; saved trips and budgets intentionally remain. */
  function logout() { localStorage.removeItem(SESSION_KEY); location.href="index.html"; }
  /* Guards a page and optionally enforces the role requested by that page. */
  function requireRole(role) { const user=getSession(); if(!user) { location.href="login.html"; return null; } if(role&&user.role!==role) return null; return user; }
  /* Changes common login links into a compact dashboard/logout experience. */
  function updateNavigation() { const user=getSession(); document.querySelectorAll("[data-user-name]").forEach((node)=>node.textContent=user?user.name:"Guest"); document.querySelectorAll("[data-auth-link]").forEach((link)=>{ if(user){link.textContent="Dashboard";link.href=user.role==="guide"?"guide-dashboard.html":"traveler-dashboard.html";} }); document.querySelectorAll("[data-logout]").forEach((button)=>button.addEventListener("click",logout)); }
  /* Supports the existing mobile-navigation data attributes without affecting desktop navigation. */
  function mobileMenu() { const toggle=document.querySelector("[data-menu-toggle]"),nav=document.querySelector("[data-main-nav]"); if(toggle&&nav) toggle.addEventListener("click",()=>{const open=nav.classList.toggle("is-open");toggle.setAttribute("aria-expanded",String(open));}); }
  document.addEventListener("DOMContentLoaded",()=>{updateNavigation();mobileMenu();});
  return { getSession, logout, requireRole, updateNavigation };
})();
