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

function createMediaElement(src, alt) {
  const ext = src.split(".").pop().toLowerCase();
  if (["webm", "mp4"].includes(ext)) {
    const video = document.createElement("video");
    video.src = src;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.title = alt;
    video.style.width = "100%";
    video.style.height = "160px";
    video.style.objectFit = "cover";
    return video;
  } else {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    return img;
  }
}

function loadFolders() {
  backBtn.style.display = "none";
  gallery.innerHTML = "";

  folders.forEach(folder => {
    const preview = folder.files?.[0]?.file || "https://via.placeholder.com/300x160?text=No+Preview";

    const card = document.createElement("div");
    card.className = "item";

    const media = createMediaElement(preview, folder.title);
    const title = document.createElement("div");
    title.className = "item-title";
    title.textContent = folder.title;

    card.appendChild(media);
    card.appendChild(title);

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

    const media = createMediaElement(file.file, file.title);
    const title = document.createElement("div");
    title.className = "item-title";
    title.textContent = file.title;

    card.appendChild(media);
    card.appendChild(title);

    card.onclick = () => copyToClipboard(file.url, card);
    gallery.appendChild(card);
  });
}

backBtn.onclick = loadFolders;
loadData();
