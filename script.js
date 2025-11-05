const username = "mregterschot";
const repo = "mregterschot.github.io";
const branch = "main"; // or "master"
const basePath = "assets";

const gallery = document.getElementById("gallery");
const backBtn = document.getElementById("backBtn");

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

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

// Show all folders
async function loadFolders() {
  backBtn.style.display = "none";
  gallery.innerHTML = "<p>Loading folders...</p>";

  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${basePath}`;
  const data = await fetchJSON(apiUrl);
  const folders = data.filter(item => item.type === "dir");

  gallery.innerHTML = "";

  for (const folder of folders) {
    const folderName = folder.name;
    const folderApi = `https://api.github.com/repos/${username}/${repo}/contents/${basePath}/${folderName}`;
    const folderData = await fetchJSON(folderApi);

    // Try to load metadata
    const dataJson = folderData.find(f => f.name.toLowerCase() === "data.json");
    let title = folderName;
    let previewFile = null;

    if (dataJson) {
      const jsonUrl = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${basePath}/${folderName}/data.json`;
      try {
        const meta = await fetchJSON(jsonUrl);
        if (meta.title) title = meta.title;
        if (meta.preview) previewFile = meta.preview;
      } catch (e) {
        console.warn("Bad JSON in", folderName);
      }
    }

    // Find preview image (meta or first image)
    if (!previewFile) {
      const firstImage = folderData.find(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f.name));
      if (firstImage) previewFile = firstImage.name;
    }

    const previewUrl = previewFile
      ? `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${basePath}/${folderName}/${previewFile}`
      : "https://via.placeholder.com/300x160?text=No+Preview";

    // Create folder card
    const card = document.createElement("div");
    card.className = "item";
    card.innerHTML = `
      <img src="${previewUrl}" alt="${title}">
      <div class="item-title">${title}</div>
    `;
    card.onclick = () => loadImages(folderName);
    gallery.appendChild(card);
  }
}

// Show images in one folder
async function loadImages(folderName) {
  backBtn.style.display = "block";
  gallery.innerHTML = "<p>Loading images...</p>";

  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${basePath}/${folderName}`;
  const data = await fetchJSON(apiUrl);

  const images = data.filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f.name));
  gallery.innerHTML = "";

  for (const img of images) {
    const rawUrl = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${basePath}/${folderName}/${img.name}`;
    const card = document.createElement("div");
    card.className = "item";
    card.innerHTML = `
      <img src="${rawUrl}" alt="${img.name}">
      <div class="item-title">${img.name}</div>
    `;
    card.onclick = () => copyToClipboard(rawUrl, card);
    gallery.appendChild(card);
  }
}

backBtn.onclick = loadFolders;

// Initialize
loadFolders();