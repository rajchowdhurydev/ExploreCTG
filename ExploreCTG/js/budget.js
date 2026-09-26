/* Budget calculation stores clear estimate objects under one localStorage key. */
const BUDGET_KEY="exploreCTG_budgets";let latestBudget=null;
/* Converts non-negative input to a number, avoiding NaN in totals. */
function amount(value){const number=Number(value);return Number.isFinite(number)&&number>=0?number:0;}
/* Formats local estimates consistently in Bangladeshi Taka. */
function taka(value){return "৳"+Math.round(value).toLocaleString("en-US");}
/* Displays the current breakdown without persisting it prematurely. */
function renderBudget(budget){document.getElementById("budget-result").innerHTML="<p>Transportation: <strong>"+taka(budget.transport)+"</strong></p><p>Accommodation: <strong>"+taka(budget.hotel)+"</strong></p><p>Food: <strong>"+taka(budget.food)+"</strong></p><p>Guide: <strong>"+taka(budget.guide)+"</strong></p><p>Other: <strong>"+taka(budget.other)+"</strong></p><hr><h3>Total: "+taka(budget.total)+"</h3>";}
/* Builds totals from the form: hotel is per night and food is per traveler per day. */
function calculate(event){event.preventDefault();const form=new FormData(event.currentTarget),note=document.getElementById("budget-message"),travelers=amount(form.get("travelers")),days=amount(form.get("days")),destination=String(form.get("destination")||"").trim();if(!destination||travelers<1||days<1){note.textContent="Enter a destination and at least one traveler and day.";return;}const budget={id:"budget_"+Date.now(),destination,travelers,days,transport:amount(form.get("transport")),hotel:amount(form.get("hotel"))*days,food:amount(form.get("food"))*travelers*days,guide:amount(form.get("guide")),other:amount(form.get("other")),createdAt:new Date().toISOString()};budget.total=budget.transport+budget.hotel+budget.food+budget.guide+budget.other;latestBudget=budget;renderBudget(budget);note.textContent="Estimate calculated. You can now save it locally.";note.className="form-message is-success";document.getElementById("budget-save").disabled=false;}
/* Appends a computed estimate only when one exists. */
function saveBudget(){if(!latestBudget)return;let values;try{values=JSON.parse(localStorage.getItem(BUDGET_KEY)||"[]")}catch{values=[]}values.push(latestBudget);localStorage.setItem(BUDGET_KEY,JSON.stringify(values));document.getElementById("budget-message").textContent="Budget estimate saved in this browser.";document.getElementById("budget-save").disabled=true;}
/* Resets both inputs and the visible calculation state. */
function resetBudget(){document.getElementById("budget-form").reset();latestBudget=null;document.getElementById("budget-result").textContent="Enter your trip values and select Calculate Budget.";document.getElementById("budget-save").disabled=true;document.getElementById("budget-message").textContent="";}
/* Attach events only after form controls have parsed. */
document.addEventListener("DOMContentLoaded",()=>{document.getElementById("budget-form").addEventListener("submit",calculate);document.getElementById("budget-save").addEventListener("click",saveBudget);document.getElementById("budget-reset").addEventListener("click",resetBudget);});
