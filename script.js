const username = "MRegterschoot";
const repo = "mregterschot.github.io";
const branch = "main"; // or 'master' if that's your branch name
const dataFile = "data.json";

async function loadImages() {
  const gallery = document.getElementById("gallery");

  // Load JSON file from raw GitHub
  const jsonUrl = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${dataFile}`;
  const response = await fetch(jsonUrl);
  const data = await response.json();

  // Render gallery
  data.forEach(item => {
    const imgUrl = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${item.image}`;
    const card = document.createElement("div");
    card.className = "item";
    card.innerHTML = `
      <a href="${item.url}" target="_blank">
        <img src="${imgUrl}" alt="${item.title || 'Image'}">
        <div class="item-title">${item.title || ''}</div>
      </a>
    `;
    gallery.appendChild(card);
  });
}

loadImages();
