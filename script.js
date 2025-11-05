const username = "mregterschot";
const repo = "mregterschot.github.io";
const branch = "main"; // or "master"
const basePath = "assets";

const folderSelect = document.getElementById("folderSelect");
const gallery = document.getElementById("gallery");

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

// Fetch all signpack folders
async function loadFolders() {
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${basePath}`;
  const data = await fetchJSON(apiUrl);

  const folders = data.filter(item => item.type === "dir");
  folderSelect.innerHTML = `<option value="">Select a signpack...</option>`;
  folders.forEach(folder => {
    const opt = document.createElement("option");
    opt.value = folder.name;
    opt.textContent = folder.name;
    folderSelect.appendChild(opt);
  });
}

// Load images for the selected folder
async function loadImages(folderName) {
  gallery.innerHTML = "";
  if (!folderName) return;

  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${basePath}/${folderName}`;
  const data = await fetchJSON(apiUrl);

  const images = data.filter(item => /\.(png|jpg|jpeg|gif|webp)$/i.test(item.name));
  if (images.length === 0) {
    gallery.innerHTML = "<p>No images found in this folder.</p>";
    return;
  }

  for (const img of images) {
    const rawUrl = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${basePath}/${folderName}/${img.name}`;
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <img src="${rawUrl}" alt="${img.name}">
      <div class="item-title">${img.name}</div>
    `;
    item.onclick = async () => {
      await navigator.clipboard.writeText(rawUrl);
      item.classList.add("copied");
      item.querySelector(".item-title").textContent = "Copied!";
      setTimeout(() => {
        item.classList.remove("copied");
        item.querySelector(".item-title").textContent = img.name;
      }, 1000);
    };
    gallery.appendChild(item);
  }
}

folderSelect.addEventListener("change", e => {
  loadImages(e.target.value);
});

loadFolders();
