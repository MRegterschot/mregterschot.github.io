const username = "MRegterschot";
const repo = "yourrepo";
const path = "assets/signpacks";

const gallery = document.getElementById("gallery");

// Fetch list of signpack folders using GitHub API
async function fetchSignpacks() {
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  // Filter only folders (signpacks)
  const folders = data.filter(item => item.type === "dir");

  for (const folder of folders) {
    const folderName = folder.name;

    // Fetch folder contents to find preview image
    const folderUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}/${folderName}`;
    const folderRes = await fetch(folderUrl);
    const files = await folderRes.json();

    const preview = files.find(file => file.name.toLowerCase().includes("preview"));
    const previewUrl = preview
      ? `https://raw.githubusercontent.com/${username}/${repo}/main/${path}/${folderName}/${preview.name}`
      : "https://via.placeholder.com/200?text=No+Preview";

    // Create a card
    const card = document.createElement("div");
    card.className = "pack";
    card.innerHTML = `
      <a href="${path}/${folderName}/" target="_blank">
        <img src="${previewUrl}" alt="${folderName} preview">
        <div class="pack-name">${folderName}</div>
      </a>
    `;
    gallery.appendChild(card);
  }
}

fetchSignpacks();
