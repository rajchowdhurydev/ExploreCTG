/*
  Local-only demo authentication. It has no server and is not production
  security: never use a real password. Users and sessions live in localStorage.
*/
const AUTH_KEYS = { users: "exploreCTG_users", session: "exploreCTG_session" };
/* Each supported role has an explicit destination after login or registration. */
const DASHBOARDS = { traveler: "traveler-dashboard.html", guide: "guide-dashboard.html", admin: "traveler-dashboard.html" };
/* Safely gets accounts, recovering cleanly if a browser value was malformed. */
function users() { try { const list = JSON.parse(localStorage.getItem(AUTH_KEYS.users) || "[]"); return Array.isArray(list) ? list : []; } catch { return []; } }
/* Saves the entire local account list after a registration. */
function saveUsers(list) { localStorage.setItem(AUTH_KEYS.users, JSON.stringify(list)); }
/* Shows accessible inline status instead of disruptive browser popups. */
function message(node, text, type = "error") { node.textContent = text; node.className = "form-message" + (text ? " is-" + type : ""); }
/* Normalizing email prevents accidental duplicate accounts with uppercase letters. */
function email(value) { return String(value || "").trim().toLowerCase(); }
/* Session excludes password, leaving only details needed by other static pages. */
function session(user) { localStorage.setItem(AUTH_KEYS.session, JSON.stringify({ id:user.id, name:user.name, email:user.email, role:user.role, loggedInAt:new Date().toISOString() })); }
/* Routes only to known role pages. */
function go(role) { window.location.href = DASHBOARDS[role] || DASHBOARDS.traveler; }
/* Password visibility controls are intentionally buttons, never form submitters. */
function toggles() { document.querySelectorAll("[data-password-toggle]").forEach((button) => button.addEventListener("click", () => { const input = document.getElementById(button.dataset.target); if (!input) return; const show = input.type === "password"; input.type = show ? "text" : "password"; button.textContent = show ? "Hide" : "Show"; })); }
/* Registration validates data, blocks duplicate email addresses, then starts a local session. */
function register() {
 const form=document.getElementById("register-form"); if(!form) return; const note=document.getElementById("register-message");
 form.addEventListener("submit",(event)=>{ event.preventDefault(); const data=new FormData(form), name=String(data.get("name")||"").trim(), mail=email(data.get("email")), password=String(data.get("password")||""), confirm=String(data.get("confirmPassword")||""), role=String(data.get("role")||"");
  if(name.length<2) return message(note,"Please enter your full name.");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return message(note,"Please enter a valid email address.");
  if(password.length<6) return message(note,"Your password must be at least 6 characters.");
  if(password!==confirm) return message(note,"Your passwords do not match.");
  if(!Object.hasOwn(DASHBOARDS,role)) return message(note,"Please choose a valid account role.");
  const list=users(); if(list.some((item)=>item.email===mail)) return message(note,"An account already exists for this email. Please log in.");
  const user={id:"user_"+Date.now()+"_"+Math.random().toString(36).slice(2,8),name,email:mail,password,role,createdAt:new Date().toISOString()};
  list.push(user); saveUsers(list); session(user); message(note,"Account created. Opening your dashboard…","success"); setTimeout(()=>go(role),400);
 });
}
/* Login compares the two entered fields to the browser's local demo records. */
function login() {
 const form=document.getElementById("login-form"); if(!form) return; const note=document.getElementById("login-message");
 form.addEventListener("submit",(event)=>{ event.preventDefault(); const data=new FormData(form), mail=email(data.get("email")), password=String(data.get("password")||"");
  if(!mail||!password) return message(note,"Enter both your email address and password.");
  const user=users().find((item)=>item.email===mail&&item.password===password);
  if(!user) return message(note,"We could not find an account with those details.");
  session(user); message(note,"Welcome back, "+user.name+". Opening your dashboard…","success"); setTimeout(()=>go(user.role),350);
 });
}
/* Account pages redirect active users so a session is not accidentally duplicated. */
function redirectActiveUser() { try { const active=JSON.parse(localStorage.getItem(AUTH_KEYS.session)||"null"); if(active&&active.role) go(active.role); } catch { localStorage.removeItem(AUTH_KEYS.session); } }
/* DOM readiness ensures forms exist before event listeners attach. */
document.addEventListener("DOMContentLoaded",()=>{ if(/(login|register)\.html$/.test(location.pathname)) redirectActiveUser(); toggles(); register(); login(); });
