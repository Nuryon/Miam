const recipes=[{name:"Pâtes crémeuses aux champignons",emoji:"🍝",time:"25 min",match:87,cat:"Plats"},{name:"Poulet curry coco",emoji:"🍛",time:"35 min",match:100,cat:"Cuisine du monde"},{name:"Bowl quinoa avocat",emoji:"🥗",time:"20 min",match:92,cat:"Healthy"},{name:"Lasagnes maison",emoji:"🍲",time:"1 h",match:60,cat:"Plats"},{name:"Tacos maison",emoji:"🌮",time:"30 min",match:80,cat:"Cuisine du monde"},{name:"Fondant chocolat",emoji:"🍰",time:"40 min",match:70,cat:"Desserts"}];
const defaults={favorites:[],liked:[],fridge:["🍗 Poulet","🍅 Tomates","🥚 Œufs","🧀 Parmesan","🍄 Champignons"],menu:[["Lun","🥗 Salade César","🍛 Poulet curry"],["Mar","🌯 Wrap poulet","🍝 Pâtes pesto"],["Mer","🍲 Bowl quinoa","🍕 Pizza maison"],["Jeu","🥣 Soupe légumes","🍲 Ratatouille"],["Ven","🥗 Salade composée","🌮 Tacos maison"],["Sam","🍔 Burger maison","🍝 Pâtes crémeuses"],["Dim","🥞 Brunch","🍲 Gratin dauphinois"]],dark:false,privateRecipes:[]};
let state=Object.assign({},defaults,JSON.parse(localStorage.getItem("miamState")||"{}")); state.page="home";state.favorites=new Set(state.favorites);state.liked=new Set(state.liked);state.chat=[];
const app=document.querySelector("#app"),title=document.querySelector("#pageTitle"),subtitle=document.querySelector("#subtitle");
const nav={home:["Bonjour 👋","Une idée pour aujourd'hui ?"],discover:["Découvrir","Trouve ton prochain coup de cœur"],fridge:["Mon frigo 🧊","Tes ingrédients disponibles"],menu:["Mon menu 📅","Organise tes repas simplement"],profile:["Ma bibliothèque 👤","Tout ton univers cuisine"],assistant:["Assistant Miam ✨","Ton copilote en cuisine"]};
function save(){localStorage.setItem("miamState",JSON.stringify({...state,favorites:[...state.favorites],liked:[...state.liked],page:"home",chat:[]}));}
function toast(t){let e=document.querySelector("#toast");e.textContent=t;e.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>e.classList.remove("show"),2200)}
function setPage(p){state.page=p;[title.textContent,subtitle.textContent]=nav[p];document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===p));render()}
function card(r){return `<article class="recipe-card" onclick="openRecipe('${r.name}')"><div class="recipe-img">${r.emoji}</div><div class="pad"><h3>${r.name}</h3><div class="small">⏱ ${r.time} · 🧊 ${r.match}%</div></div></article>`}
function home(){return `<input class="search" placeholder="🔎 Rechercher une recette..." oninput="search(this.value)"><section class="hero"><h2>Jamais goûté ? 🎲</h2><p>Découvre une recette qui pourrait devenir ton nouveau coup de cœur.</p><button class="secondary pressable" style="margin-top:13px" onclick="surprise()">Surprends-moi</button><div class="emoji">🎲</div></section><section class="section"><div class="section-head"><h2>✨ Pour toi</h2><button class="link" data-page="discover">Voir tout</button></div><div class="cards">${recipes.slice(0,5).map(card).join("")}</div></section><section class="section"><div class="row-card" data-page="fridge"><div class="food-icon">🧊</div><div class="grow"><h3>Avec ton frigo</h3><p>Tu peux préparer 12 recettes.</p></div><span>›</span></div><div class="row-card" data-page="menu"><div class="food-icon">📅</div><div class="grow"><h3>Ce soir</h3><p>🍛 Poulet curry coco</p></div><span>›</span></div></section>`}
function discover(){let c=[["🥗","Entrées"],["🍝","Plats"],["🍰","Desserts"],["🌱","Healthy"],["🌍","Cuisine du monde"],["⚡","Rapide"],["💰","Petit budget"],["🥦","Végétarien"]];return `<input class="search" placeholder="🔎 Pizza, poulet, pâtes..." oninput="search(this.value)"><div class="grid">${c.map(x=>`<div class="category" onclick="filterCat('${x[1]}')"><div class="cat-icon">${x[0]}</div>${x[1]}</div>`).join("")}</div><section class="section"><h2>🔥 Tendances</h2><div class="grid">${recipes.map(card).join("")}</div></section>`}
function fridge(){return `<div class="tabs"><button class="tab active">Mes aliments</button><button class="tab" onclick="showSuggestions()">Que cuisiner ?</button></div><input class="search" placeholder="🔎 Ajouter un aliment puis Entrée" onkeydown="if(event.key==='Enter')addFood(this.value)"><button class="primary pressable" onclick="let x=prompt('Quel aliment veux-tu ajouter ?');if(x)addFood(x)">＋ Ajouter un aliment</button><section class="section"><h2>⚠️ À consommer rapidement</h2><div class="row-card"><div class="food-icon">🍗</div><div class="grow"><h3>Poulet</h3><p>À consommer dans 1 jour</p></div><span class="badge danger">Urgent</span></div><div class="row-card"><div class="food-icon">🍅</div><div class="grow"><h3>Tomates</h3><p>À consommer dans 2 jours</p></div><span class="badge warning">Bientôt</span></div></section><section class="section"><h2>Mon inventaire (${state.fridge.length})</h2>${state.fridge.map((x,i)=>`<div class="row-card"><div class="grow">${x}</div><button class="link" onclick="removeFood(${i})">Retirer</button></div>`).join("")}</section>`}
function sugg(){return `<div class="tabs"><button class="tab" data-page="fridge">Mes aliments</button><button class="tab active">Que cuisiner ?</button></div><h2>Que puis-je cuisiner ? 🥬</h2><p>Basé sur les ingrédients présents dans ton frigo.</p><section class="section">${recipes.map(r=>`<div class="row-card" onclick="openRecipe('${r.name}')"><div class="food-icon">${r.emoji}</div><div class="grow"><h3>${r.name}</h3><p>${r.match===100?"Tous les ingrédients disponibles":"Il manque quelques ingrédients"}</p><div class="progress"><i style="width:${r.match}%"></i></div></div><span class="badge">${r.match}%</span></div>`).join("")}</section>`}
function menu(){return `<button class="primary pressable" onclick="generateMenu()">✨ Générer mon menu</button><section class="section"><div class="week">${state.menu.map((d,i)=>`<div class="day"><b>${d[0]}</b><div class="meal" onclick="editMeal(${i},1)">☀️ ${d[1]}</div><div class="meal" onclick="editMeal(${i},2)">🌙 ${d[2]}</div></div>`).join("")}</div></section><button class="secondary pressable" style="width:100%" onclick="shopping()">🛒 Générer la liste de courses</button>`}
function profile(){return `<section class="hero"><h2>Ma cuisine ❤️</h2><p>${state.favorites.size} favoris · ${state.liked.size} recettes aimées</p><div class="emoji">👨‍🍳</div></section><section class="section"><div class="row-card"><div class="food-icon">❤️</div><div class="grow"><h3>Mes favoris</h3><p>${state.favorites.size} recette(s)</p></div></div><div class="row-card"><div class="food-icon">👍</div><div class="grow"><h3>J'ai aimé</h3><p>${state.liked.size} recette(s)</p></div></div><div class="row-card" onclick="privateRecipes()"><div class="food-icon">📚</div><div class="grow"><h3>Mes recettes privées</h3><p>📷 Scanner et sauvegarder tes recettes</p></div><span>›</span></div></section>`}
function assistant(){let m=state.chat.length?state.chat:`<div class="chat-bubble">Bonjour ! 👋 Je peux t'aider à choisir un repas, utiliser ton frigo ou trouver une idée rapide.</div>`;return `<div class="chat">${m}</div><section class="section"><div class="suggestions"><button class="suggest" onclick="ask('Que puis-je cuisiner avec mon frigo ?')">🧊 Avec mon frigo</button><button class="suggest" onclick="ask('Une recette rapide')">⚡ Rapide</button><button class="suggest" onclick="ask('Un repas pas cher')">💰 Petit budget</button><button class="suggest" onclick="ask('Surprends-moi')">🎲 Surprise</button></div></section><form class="chat-form" onsubmit="sendChat(event)"><input id="chatInput" placeholder="Écris ton message..."><button class="primary pressable" style="width:auto;padding:10px 15px">➤</button></form>`}
function render(){let f={home,discover,fridge,menu,profile,assistant};app.innerHTML=f[state.page]();bind()}
function bind(){document.querySelectorAll("[data-page]").forEach(e=>e.addEventListener("click",()=>setPage(e.dataset.page)))}
function openRecipe(n){let r=recipes.find(x=>x.name===n);title.textContent=r.name;subtitle.textContent="Une recette simple et gourmande";app.innerHTML=`<button class="link" onclick="setPage('discover')">← Retour</button><div class="recipe-hero">${r.emoji}</div><section class="section"><h2>${r.name}</h2><p>⭐ 4.8 · ⏱ ${r.time} · 👨‍👩‍👧 4 pers.</p><div class="actions"><button class="action ${state.liked.has(n)?'liked':''}" onclick="like('${n}')">👍 J'aime</button><button class="action" onclick="toast('Préférence enregistrée 👌')">👎 Pas pour moi</button><button class="action ${state.favorites.has(n)?'liked':''}" onclick="fav('${n}')">❤️ Favori</button></div><div class="form-card"><b>🧊 Compatible avec ton frigo</b><p>${r.match}% des ingrédients disponibles</p><div class="progress"><i style="width:${r.match}%"></i></div></div></section><section class="section"><h2>Ingrédients</h2><div class="row-card">🍝 Pâtes <span class="grow"></span>200 g <span class="badge">✓</span></div><div class="row-card">🍄 Champignons <span class="grow"></span>250 g <span class="badge">✓</span></div><div class="row-card">🥛 Crème fraîche <span class="grow"></span>20 cl <span class="badge warning">Manque</span></div></section><button class="primary pressable" onclick="cookMode('${n}')">👨‍🍳 Commencer à cuisiner</button>`}
function like(n){state.liked.has(n)?state.liked.delete(n):state.liked.add(n);save();toast(state.liked.has(n)?"👍 J'aime !":"Like retiré");openRecipe(n)}
function fav(n){state.favorites.has(n)?state.favorites.delete(n):state.favorites.add(n);save();toast(state.favorites.has(n)?"❤️ Ajouté aux favoris":"Favori retiré");openRecipe(n)}
function cookMode(n){title.textContent="Mode cuisine 👨‍🍳";subtitle.textContent="Étape 2 sur 6";app.innerHTML=`<div class="recipe-hero" style="height:340px;background:linear-gradient(180deg,#493830,#171313)">🍄</div><section class="section" style="text-align:center"><h2>Fais revenir les champignons</h2><p>Dans une poêle avec un filet d'huile d'olive pendant 5 minutes.</p><div style="font-size:54px;font-weight:900;margin:24px" id="timer">05:00</div><button class="secondary pressable" onclick="startTimer()">▶ Démarrer</button></section><button class="primary pressable" onclick="toast('Bravo ! Étape suivante 🎉')">Étape suivante →</button>`}
function startTimer(){let s=300,e=document.querySelector("#timer");clearInterval(window.timer);window.timer=setInterval(()=>{s--;e.textContent=`${String(s/60|0).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;if(s<=0){clearInterval(window.timer);toast("⏰ Temps écoulé !")}},1000)}
function addFood(x){x=x.trim();if(x){state.fridge.push("🥕 "+x);save();toast("Ajouté au frigo 🧊");render()}}
function removeFood(i){state.fridge.splice(i,1);save();toast("Aliment retiré");render()}
function showSuggestions(){title.textContent="Suggestions ✨";subtitle.textContent="Des idées selon ton frigo";app.innerHTML=sugg();bind()}
function surprise(){openRecipe(recipes[Math.floor(Math.random()*recipes.length)].name)}
function generateMenu(){let p=prompt("Pour combien de personnes ?",2);if(!p)return;state.menu.forEach((d,i)=>{d[1]=recipes[i%recipes.length].emoji+" "+recipes[i%recipes.length].name;d[2]=recipes[(i+2)%recipes.length].emoji+" "+recipes[(i+2)%recipes.length].name});save();toast(`✨ Menu généré pour ${p} personne(s)`);render()}
function editMeal(i,j){let x=prompt("Modifier ce repas :",state.menu[i][j]);if(x){state.menu[i][j]=x;save();render()}}
function shopping(){toast("🛒 Liste de courses générée !")}
function ask(q){state.chat+=`<div class="chat-bubble user">${q}</div>`;let l=q.toLowerCase(),a=l.includes("frigo")?"Avec ton frigo, je te conseille le poulet curry coco 🍛 : il correspond très bien à tes ingrédients.":l.includes("rapide")?"Je te propose le bowl quinoa avocat 🥗, prêt en 20 minutes.":l.includes("cher")?"Les pâtes crémeuses aux champignons 🍝 sont simples et économiques.":"Je te propose de découvrir le poulet curry coco 🍛 !";setTimeout(()=>{state.chat+=`<div class="chat-bubble">${a}</div>`;render()},280);render()}
function sendChat(e){e.preventDefault();let x=document.querySelector("#chatInput").value.trim();if(x)ask(x)}
function search(q){q=q.toLowerCase();if(!q){render();return}let a=recipes.filter(r=>r.name.toLowerCase().includes(q));app.innerHTML=`<h2>Résultats</h2><div class="grid">${a.length?a.map(card).join(""):`<div class="empty">Aucune recette trouvée 😕</div>`}</div>`}
function filterCat(c){let a=recipes.filter(r=>r.cat===c);app.innerHTML=`<button class="link" onclick="setPage('discover')">← Retour</button><section class="section"><h2>${c}</h2><div class="grid">${a.length?a.map(card).join(""):`<div class="empty">Cette catégorie sera bientôt remplie 🍋</div>`}</div></section>`}

// --- Scanner OCR de recettes ---
let scannedImage = null;
function privateRecipes(){
  const list=state.privateRecipes||[];
  title.textContent="Mes recettes 📚";
  subtitle.textContent="Tes recettes scannées et personnelles";
  app.innerHTML=`<button class="link" onclick="setPage('profile')">← Retour</button>
  <section class="section">
    <div class="scan-zone" onclick="openScanner()">
      <div style="font-size:52px">📷</div>
      <h2>Scanner une recette</h2>
      <p>Prends une photo d'une page de livre ou importe une image.</p>
      <p class="scan-note">L'application analysera le texte automatiquement.</p>
    </div>
  </section>
  <section class="section"><div class="section-head"><h2>Mes recettes (${list.length})</h2></div>
  ${list.length?`<div class="grid">${list.map((r,i)=>privateCard(r,i)).join("")}</div>`:`<div class="empty">Aucune recette personnelle pour le moment.<br><br>📖 Scanne une recette pour commencer !</div>`}
  </section>`;
}
function privateCard(r,i){
 return `<article class="recipe-card private-recipe" onclick="openPrivateRecipe(${i})">
 <div class="recipe-img">${r.emoji||"📖"}</div><span class="private-tag">Privée</span>
 <div class="pad"><h3>${escapeHtml(r.title||"Recette sans titre")}</h3>
 <div class="small">📷 Scannée · ⏱ ${escapeHtml(r.time||"?")}</div></div></article>`;
}
function openScanner(){
 title.textContent="Scanner une recette 📷";
 subtitle.textContent="Photo → texte → recette";
 app.innerHTML=`<button class="link" onclick="privateRecipes()">← Retour</button>
 <section class="section">
 <div class="scan-zone" onclick="document.getElementById('recipeImage').click()">
   <div style="font-size:58px">📸</div><h2>Photographier une recette</h2>
   <p>Utilise la caméra ou choisis une image.</p>
 </div>
 <input id="recipeImage" type="file" accept="image/*" capture="environment" hidden onchange="previewScan(this)">
 <div id="scanPreviewArea"></div>
 <div class="form-card" style="margin-top:15px"><b>💡 Conseil pour un meilleur résultat</b>
 <p style="margin-top:7px">Prends la page de face, avec une bonne lumière et un texte suffisamment net.</p></div>
 </section>`;
}
function previewScan(input){
 const file=input.files&&input.files[0]; if(!file)return;
 scannedImage=file;
 const url=URL.createObjectURL(file);
 document.querySelector("#scanPreviewArea").innerHTML=`<img class="scan-preview" src="${url}" alt="Recette à analyser">
 <div class="scan-actions"><button class="secondary pressable" onclick="openScanner()">↻ Changer</button>
 <button class="primary pressable" onclick="runOCR()">✨ Lire la recette</button></div>`;
}

async function imageToProcessedData(file, crop){
  const bitmap = await createImageBitmap(file);
  const sx = Math.floor(bitmap.width * crop.x);
  const sy = Math.floor(bitmap.height * crop.y);
  const sw = Math.floor(bitmap.width * crop.w);
  const sh = Math.floor(bitmap.height * crop.h);
  const scale = Math.min(2.2, 2200 / Math.max(sw, sh));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(sw * scale));
  canvas.height = Math.max(1, Math.floor(sh * scale));
  const ctx = canvas.getContext("2d", {willReadFrequently:true});
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  // Grayscale + contrast. This makes small cookbook text easier for OCR.
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;
  const contrast = 1.35;
  for(let i=0;i<d.length;i+=4){
    const gray = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2];
    const v = Math.max(0, Math.min(255, ((gray-128)*contrast)+128));
    d[i]=d[i+1]=d[i+2]=v;
  }
  ctx.putImageData(imageData,0,0);
  return canvas.toDataURL("image/jpeg", 0.94);
}
function cleanZoneText(text){
  return (text||"").replace(/\r/g,"").split("\n")
    .map(cleanOCRLine).filter(Boolean)
    .filter(x=>x.length>1)
    .join("\n");
}
async function recognizeZone(file, crop, label, psm=6){
  const status = document.querySelector("#ocrProgress");
  const titleEl = document.querySelector("#ocrTitle");
  if(titleEl) titleEl.textContent = label;
  const dataUrl = await imageToProcessedData(file, crop);
  const result = await Tesseract.recognize(dataUrl, "fra+eng", {
    tessedit_pageseg_mode: psm,
    preserve_interword_spaces: "1",
    logger:m=>{
      if(status && m.progress!==undefined){
        status.textContent = `${label} — ${Math.round(m.progress*100)}%`;
      }
    }
  });
  return cleanZoneText(result.data.text);
}
function extractTitle(titleText){
  const lines = titleText.split("\n").map(cleanOCRLine).filter(Boolean);
  const good = lines.filter(l =>
    !/^(pour|ingrédients?|préparation|cuisson|temps)/i.test(l) &&
    l.length >= 3 && l.length <= 60
  );
  return (good[0] || "Recette scannée")
    .replace(/[=~_]+$/g,"")
    .replace(/\s{2,}/g," ")
    .replace(/^(ROUGAIL\s+SAUCISSE.*)$/i,"Rougail saucisse")
    .trim();
}
function extractMetaAndIngredients(leftText){
  const lines = leftText.split("\n").map(cleanOCRLine).filter(Boolean);
  let people="", time="", mode=false, ingredients=[];
  for(const line of lines){
    if(/pour\s+\d+\s+personnes?/i.test(line)){
      const m=line.match(/(\d+)/); if(m) people=m[1]; continue;
    }
    if(/préparation\s*:?\s*\d+/i.test(line)){
      const m=line.match(/(\d+\s*(?:min(?:utes)?|h(?:eures?)?))/i); if(m) time=m[1]; continue;
    }
    if(/cuisson\s*:?\s*\d+/i.test(line) && !time){
      const m=line.match(/(\d+\s*(?:à\s*)?\d*\s*(?:min(?:utes)?|h(?:eures?)?))/i); if(m) time=m[1]; continue;
    }
    if(/^ingrédients?/i.test(line)){ mode=true; continue; }
    if(!mode) continue;
    // Ignore page numbers and decorative text.
    if(/^\d{1,4}$/.test(line)) continue;
    ingredients.push(line);
  }
  // If OCR missed the INGREDIENTS heading, keep lines that look like quantities/foods.
  if(!ingredients.length){
    ingredients = lines.filter(l =>
      !/^(pour|préparation|cuisson|ingrédients?)/i.test(l) &&
      /(?:\d|oignon|ail|tomate|saucisse|lard|gingembre|huile|concentr|thym|laurier|curcuma|eau|sel|poivre)/i.test(l)
    );
  }
  return {people,time,ingredients:[...new Set(ingredients)].join("\n")};
}
function extractSteps(rightText){
  const lines = rightText.split("\n").map(cleanOCRLine).filter(Boolean);
  const out=[];
  let current="";
  for(const raw of lines){
    if(/^préparation/i.test(raw)) continue;
    const numbered = raw.match(/^(\d{1,2})\s*[.)]?\s*(.*)$/);
    if(numbered){
      if(current) out.push(current);
      current = numbered[2].trim();
    }else{
      current = current ? `${current} ${raw}` : raw;
    }
  }
  if(current) out.push(current);
  return out
    .map(s=>s.replace(/\s{2,}/g," ").trim())
    .filter(s=>s.length>4 && !/^astuce/i.test(s))
    .slice(0,20)
    .map((s,i)=>`${i+1}. ${s}`)
    .join("\n");
}
async function runOCR(){
  if(!scannedImage)return;
  title.textContent="Analyse intelligente ✨";
  subtitle.textContent="Lecture séparée du titre, des ingrédients et des étapes";
  app.innerHTML=`<section class="scan-status">
    <div class="scan-spinner"></div>
    <h2 id="ocrTitle">Préparation du scan…</h2>
    <p id="ocrProgress">Découpage intelligent de la page…</p>
    <p class="scan-note">Nous analysons les différentes zones de la recette séparément.</p>
  </section>`;
  try{
    if(!window.Tesseract) throw new Error("OCR non chargé");

    // Cookbook layout: title at top, metadata/ingredients on the left,
    // numbered preparation steps on the right.
    const titleText = await recognizeZone(scannedImage,{x:.10,y:.04,w:.80,h:.19},"Lecture du titre",6);
    const leftText = await recognizeZone(scannedImage,{x:.06,y:.24,w:.35,h:.56},"Lecture des ingrédients",6);
    const rightText = await recognizeZone(scannedImage,{x:.37,y:.24,w:.58,h:.55},"Lecture de la préparation",6);

    const meta = extractMetaAndIngredients(leftText);
    const recipe = {
      title: extractTitle(titleText),
      people: meta.people,
      time: meta.time,
      ingredients: meta.ingredients,
      steps: extractSteps(rightText),
      emoji:"📖",
      rawOCR:{titleText,leftText,rightText}
    };

    // Safety fallback: never mix all page text into ingredients.
    if(!recipe.ingredients) recipe.ingredients="";
    if(!recipe.steps) recipe.steps="";
    openRecipeEditorData(recipe);
  }catch(err){
    console.error(err);
    toast("Le scan automatique a rencontré un problème");
    openRecipeEditorData({title:"Recette scannée",time:"",people:"",ingredients:"",steps:"",emoji:"📖"});
  }
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

function cleanOCRLine(line){
  return line
    .replace(/[|¦]/g," ")
    .replace(/[“”]/g,'"')
    .replace(/[’]/g,"'")
    .replace(/[^\S\r\n]+/g," ")
    .replace(/\s+([,.;:!?])/g,"$1")
    .trim();
}
function normalizeOCRText(text){
  return text.replace(/\r/g,"")
    .split("\n")
    .map(cleanOCRLine)
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g,"\n\n");
}
function looksLikeIngredient(line){
  return /(?:^\d+(?:[.,]\d+)?\s*(?:g|kg|ml|cl|l|c\.?\s*à\s*soupe|c\.?\s*à\s*café|cuillère|sachet|pincée|tranche|oeuf|œuf|verre)|farine|sucre|beurre|lait|levure|sel|poivre|huile|crème|fromage|chocolat|tomate|oignon|ail|poulet|pâtes|riz|vanille|citron)/i.test(line);
}
function looksLikeStep(line){
  return /^(?:\d+\s*[.)-]\s*)?(mettre|mélanger|ajouter|incorporer|faire|cuire|verser|préparer|chauffer|fouetter|laisser|couper|servir|réserver|déposer|remuer|enfourner|battre)/i.test(line);
}
function isHeading(line){
  return /^(ingrédients?|préparation|instructions?|étapes?|recette|pour\s+\d+\s+personnes?|temps de préparation|temps de cuisson)/i.test(line);
}
function parseRecipe(text){
  const normalized = normalizeOCRText(text);
  const raw = normalized.split("\n").map(x=>x.trim()).filter(Boolean);
  const lines = raw.filter(x=>!isHeading(x));
  let title = lines.find(x=>x.length>3 && x.length<55 && !looksLikeIngredient(x) && !looksLikeStep(x)) || "Recette scannée";
  title = title.replace(/[=~_]+$/g,"").trim();

  const timeMatch = normalized.match(/(?:préparation|cuisson|temps)?\s*:?\s*(\d+\s*(?:min(?:utes)?|h(?:eures?)?))/i);
  const peopleMatch = normalized.match(/(?:pour\s*)?(\d+)\s*(?:personnes?|pers\.?)/i);

  const ingredients = [];
  const steps = [];
  let mode = "";
  for(const line of lines){
    const l = cleanOCRLine(line);
    if(!l || l === title) continue;
    if(/^ingrédients?/i.test(l)){ mode="ingredients"; continue; }
    if(/^(préparation|instructions?|étapes?)/i.test(l)){ mode="steps"; continue; }

    if(mode==="ingredients"){
      if(looksLikeStep(l)){ mode="steps"; steps.push(l); }
      else ingredients.push(l);
      continue;
    }
    if(mode==="steps"){
      steps.push(l);
      continue;
    }

    if(looksLikeIngredient(l) && steps.length===0) ingredients.push(l);
    else if(looksLikeStep(l) || ingredients.length>0) steps.push(l);
  }

  // OCR can merge ingredients and instructions on one line. Split obvious instruction starts.
  const fixedIngredients = [];
  const fixedSteps = [...steps];
  for(const line of ingredients){
    const split = line.split(/(?=(?:\d+\s*[.)-]\s*)?(?:mettre|mélanger|ajouter|incorporer|faire|cuire|verser|préparer|chauffer|fouetter|laisser)\b)/i);
    if(split.length>1){
      fixedIngredients.push(split[0].trim());
      fixedSteps.unshift(...split.slice(1).map(x=>x.trim()).filter(Boolean));
    } else fixedIngredients.push(line);
  }

  const dedupe = arr => [...new Set(arr.map(cleanOCRLine).filter(Boolean))];
  return {
    title,
    ingredients: dedupe(fixedIngredients).join("\n"),
    steps: dedupe(fixedSteps).join("\n"),
    time: timeMatch ? timeMatch[1] : "",
    people: peopleMatch ? peopleMatch[1] : "",
    emoji:"🥞"
  };
}
function formatSteps(text){
  const lines=text.split(/\n+/).map(cleanOCRLine).filter(Boolean);
  return lines.map((line,i)=>{
    const cleaned=line.replace(/^\d+\s*[.)-]\s*/,"").trim();
    return `${i+1}. ${cleaned}`;
  }).join("\n");
}



function openRecipeEditor(text){
  openRecipeEditorData(parseRecipe(text));
}
function openRecipeEditorData(r){
  title.textContent="Vérifier la recette ✏️";
  subtitle.textContent="Chaque zone du livre a été analysée séparément";
  app.innerHTML=`<button class="link" onclick="openScanner()">← Scanner à nouveau</button>
  <section class="section scanner-editor">
    <div class="scan-result-banner">
      <span>✨</span><div><b>Analyse terminée</b><p>Le titre, les ingrédients et les étapes ont été lus séparément.</p></div>
    </div>
    <div class="ocr-quality">
      <span>📷 Scan par zones</span><span>🧅 Ingrédients séparés</span><span>👨‍🍳 Étapes numérotées</span>
    </div>
    <div class="form-card">
      <div class="field"><label>Nom de la recette</label><input id="rTitle" value="${escapeHtml(r.title||"")}"></div>
      <div class="meta-fields">
        <div class="field"><label>Temps de préparation</label><input id="rTime" value="${escapeHtml(r.time||"")}" placeholder="ex. 20 min"></div>
        <div class="field"><label>Personnes</label><input id="rPeople" value="${escapeHtml(r.people||"")}" placeholder="ex. 4"></div>
      </div>
      <div class="field"><label>Ingrédients <span class="hint">— un par ligne</span></label>
        <textarea id="rIngredients" placeholder="2 oignons&#10;4 gousses d'ail&#10;4 tomates">${escapeHtml(r.ingredients||"")}</textarea>
      </div>
      <div class="field"><label>Préparation <span class="hint">— une étape par ligne</span></label>
        <textarea id="rSteps" placeholder="1. Épluchez les oignons…">${escapeHtml(r.steps||"")}</textarea>
      </div>
      <button class="primary pressable" onclick="saveScannedRecipe()">💾 Enregistrer ma recette</button>
    </div>
  </section>`;
}

function saveScannedRecipe(){
 const r={title:document.querySelector("#rTitle").value.trim()||"Recette sans titre",
 time:document.querySelector("#rTime").value.trim()||"?",
 people:document.querySelector("#rPeople").value.trim()||"",
 ingredients:document.querySelector("#rIngredients").value.trim(),
 steps:document.querySelector("#rSteps").value.trim(),emoji:"📖",scannedAt:new Date().toISOString()};
 state.privateRecipes=state.privateRecipes||[];
 if(scannedImage && scannedImage.size < 3*1024*1024){
   const reader=new FileReader();
   reader.onload=()=>{r.image=reader.result;state.privateRecipes.unshift(r);save();toast("📚 Recette enregistrée !");privateRecipes();};
   reader.readAsDataURL(scannedImage);return;
 }
 state.privateRecipes.unshift(r);save();toast("📚 Recette enregistrée !");privateRecipes();
}


function ingredientEmoji(name){
  const n=(name||"").toLowerCase();
  const map=[
    [/pâte|spaghetti|penne|tagliatelle/,"🍝"],
    [/champignon/,"🍄"],[/crème|lait/,"🥛"],[/tomate/,"🍅"],
    [/oignon/,"🧅"],[/ail/,"🧄"],[/œuf|oeuf/,"🥚"],
    [/beurre/,"🧈"],[/farine/,"🌾"],[/sucre/,"🍬"],
    [/poulet|viande|saucisse|lard/,"🍖"],[/riz/,"🍚"],
    [/citron/,"🍋"],[/huile/,"🫒"],[/fromage/,"🧀"],
    [/poivre|sel|épice|curcuma|gingembre/,"🧂"],[/eau/,"💧"]
  ];
  for(const [re,e] of map) if(re.test(n)) return e;
  return "🥕";
}
function splitIngredient(line){
  const clean=line.replace(/^[•\-]\s*/,"").trim();
  const match=clean.match(/^((?:\d+(?:[.,]\d+)?\s*(?:g|kg|ml|cl|l|min|sachet|cuill(?:ère)?s?|tranches?|gousses?|boîtes?|verres?|pincée|½|1\/2)?\s*)+)(.*)$/i);
  if(match && match[2].trim()) return {qty:match[1].trim(),name:match[2].trim()};
  return {qty:"",name:clean};
}
function getScannedIngredients(r){
  return (r.ingredients||"").split(/\n+/).map(x=>splitIngredient(x)).filter(x=>x.name);
}
function fridgeMatchForScanned(r){
  const fridge=(state.fridge||[]).map(x=>String(x).toLowerCase());
  const items=getScannedIngredients(r);
  if(!items.length) return {percent:0,available:new Set()};
  const available=new Set();
  items.forEach((item,idx)=>{
    const n=item.name.toLowerCase();
    if(fridge.some(f=>n.includes(f)||f.includes(n))) available.add(idx);
  });
  return {percent:Math.round((available.size/items.length)*100),available};
}
function togglePrivateReaction(i,type){
  const r=state.privateRecipes[i];
  r.reaction = r.reaction===type ? null : type;
  save(); openPrivateRecipe(i);
}
function togglePrivateFavorite(i){
  const r=state.privateRecipes[i];
  r.favorite=!r.favorite; save(); openPrivateRecipe(i);
}
function openPrivateRecipe(i){
  const r=state.privateRecipes[i];
  title.textContent=r.title;
  subtitle.textContent="Recette personnelle";
  const ingredients=getScannedIngredients(r);
  const steps=(r.steps||"").split(/\n+/).map(x=>x.replace(/^\d+\s*[.)-]\s*/,"").trim()).filter(Boolean);
  const match=fridgeMatchForScanned(r);
  const image = r.image
    ? `<img src="${r.image}" class="detail-image" alt="${escapeHtml(r.title)}">`
    : `<div class="detail-image detail-placeholder">${r.emoji||"🍽️"}</div>`;

  app.innerHTML=`
    <button class="link" onclick="privateRecipes()">← Mes recettes</button>

    <section class="recipe-detail-mobile">
      <div class="detail-hero">${image}</div>

      <div class="detail-content">
        <h1 class="detail-title">${escapeHtml(r.title)}</h1>

        <div class="detail-meta">
          <span>⭐ ${r.rating||"Nouvelle"}</span>
          <span>⏱ ${escapeHtml(r.time||"Temps à préciser")}</span>
          ${r.people?`<span>👥 ${escapeHtml(r.people)} pers.</span>`:""}
        </div>

        <div class="detail-actions">
          <button class="action-btn ${r.reaction==="like"?"active-like":""}" onclick="togglePrivateReaction(${i},'like')">👍 J'aime</button>
          <button class="action-btn ${r.reaction==="dislike"?"active-dislike":""}" onclick="togglePrivateReaction(${i},'dislike')">👎 Pas pour moi</button>
          <button class="action-btn ${r.favorite?"active-favorite":""}" onclick="togglePrivateFavorite(${i})">💗 ${r.favorite?"Favori":"Favori"}</button>
        </div>

        <div class="fridge-compat">
          <div class="fridge-title">🧊 <strong>Compatible avec ton frigo</strong></div>
          <div class="fridge-percent">${match.percent}% des ingrédients disponibles</div>
          <div class="compat-track"><div class="compat-fill" style="width:${match.percent}%"></div></div>
        </div>

        <h2 class="detail-section-title">Ingrédients</h2>
        <div class="ingredient-list">
          ${ingredients.length ? ingredients.map((item,idx)=>`
            <div class="ingredient-row ${match.available.has(idx)?"ingredient-available":""}">
              <div class="ingredient-left"><span class="ingredient-icon">${ingredientEmoji(item.name)}</span><span>${escapeHtml(item.name)}</span></div>
              <div class="ingredient-right">${escapeHtml(item.qty)} ${match.available.has(idx)?'<span class="check">✓</span>':""}</div>
            </div>`).join("") : `<div class="empty">Aucun ingrédient détecté.</div>`}
        </div>

        <h2 class="detail-section-title">Préparation</h2>
        <div class="step-list">
          ${steps.length ? steps.map((step,n)=>`
            <div class="step-row"><div class="step-number">${n+1}</div><div>${escapeHtml(step)}</div></div>`).join("")
            : `<div class="empty">Aucune étape détectée.</div>`}
        </div>

        <div class="detail-bottom-actions">
          <button class="secondary pressable" onclick="editPrivateRecipe(${i})">✏️ Modifier</button>
          <button class="primary pressable" onclick="addPrivateToMenu(${i})">📅 Ajouter au menu</button>
        </div>
      </div>
    </section>`;
}

function editPrivateRecipe(i){
 const r=state.privateRecipes[i];openRecipeEditorFromData(r,i);
}
function openRecipeEditorFromData(r,i){
 title.textContent="Modifier la recette ✏️";subtitle.textContent="Tes modifications sont sauvegardées";
 app.innerHTML=`<section class="section"><div class="form-card">
 <div class="field"><label>Nom</label><input id="rTitle" value="${escapeHtml(r.title)}"></div>
 <div class="grid"><div class="field"><label>Temps</label><input id="rTime" value="${escapeHtml(r.time)}"></div><div class="field"><label>Personnes</label><input id="rPeople" value="${escapeHtml(r.people)}"></div></div>
 <div class="field"><label>Ingrédients</label><textarea id="rIngredients">${escapeHtml(r.ingredients)}</textarea></div>
 <div class="field"><label>Préparation</label><textarea id="rSteps">${escapeHtml(r.steps)}</textarea></div>
 <button class="primary pressable" onclick="updatePrivateRecipe(${i})">💾 Sauvegarder</button></div></section>`;
}
function updatePrivateRecipe(i){
 const r=state.privateRecipes[i];r.title=document.querySelector("#rTitle").value||r.title;r.time=document.querySelector("#rTime").value;r.people=document.querySelector("#rPeople").value;r.ingredients=document.querySelector("#rIngredients").value;r.steps=document.querySelector("#rSteps").value;save();toast("Modifications enregistrées");openPrivateRecipe(i);
}
function addPrivateToMenu(i){
 const r=state.privateRecipes[i];const day=prompt("Jour : Lun, Mar, Mer, Jeu, Ven, Sam ou Dim","Lun");if(!day)return;
 const idx=state.menu.findIndex(x=>x[0].toLowerCase()===day.slice(0,3).toLowerCase());if(idx<0){toast("Jour non reconnu");return}
 const meal=prompt("1 = midi, 2 = soir","2");state.menu[idx][meal==="1"?1:2]="📖 "+r.title;save();toast("Ajouté au menu 📅");
}

document.querySelector("#themeBtn").onclick=()=>{state.dark=!state.dark;document.body.classList.toggle("dark",state.dark);document.querySelector("#themeBtn").textContent=state.dark?"☀️":"🌙";save()};
document.body.classList.toggle("dark",state.dark);document.querySelector("#themeBtn").textContent=state.dark?"☀️":"🌙";render();
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js");
