const dataUrl = "data.json";
const gallery = document.getElementById("gallery");
const backBtn = document.getElementById("backBtn");

let folders = [];

function copyToClipboard(text, element) {
  navigator.clipboard.writeText(text);
  element.classList.add("copied");
  const title = element.querySelector(".item-title");
  const oldText = title.textContent;
  title.textContent = "Copied!";
  setTimeout(() => {
    element.classList.remove("copied");
    title.textContent = oldText;
  }, 1000);
}

async function loadData() {
  const res = await fetch(dataUrl);
  if (!res.ok) throw new Error("Failed to load data.json");
  folders = await res.json();
  loadFolders();
}

function loadFolders() {
  backBtn.style.display = "none";
  gallery.innerHTML = "";

  folders.forEach(folder => {
    const card = document.createElement("div");
    card.className = "item";
    card.innerHTML = `
      <img src="${folder.image}" alt="${folder.title}">
      <div class="item-title">${folder.title}</div>
    `;
    card.onclick = () => loadFiles(folder);
    gallery.appendChild(card);
  });
}

function loadFiles(folder) {
  backBtn.style.display = "block";
  gallery.innerHTML = "";

  if (!folder.files || folder.files.length === 0) {
    gallery.innerHTML = "<p>No files found in this folder.</p>";
    return;
  }

  folder.files.forEach(file => {
    const card = document.createElement("div");
    card.className = "item";
    card.innerHTML = `
      <img src="${file.image}" alt="${file.title}">
      <div class="item-title">${file.title}</div>
    `;
    card.onclick = () => copyToClipboard(file.url, card);
    gallery.appendChild(card);
  });
}

backBtn.onclick = loadFolders;
loadData();
