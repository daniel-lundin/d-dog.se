/* global h, mjukna */
const byId = document.getElementById.bind(document);
const qS = document.querySelector.bind(document);
const qSA = document.querySelectorAll.bind(document);

const logo = byId("logo");
const nav = qS("nav");
const content = byId("content");

let activeSection = null;

async function changeSection(section) {
  const sectionContent = qS("#content .section-content");
  const contentRemoval = mjukna([logo, sectionContent, nav, qS("h1")]);
  sectionContent.remove();
  await contentRemoval;

  const currentNavItem = byId(activeSection);
  const newNavItem = byId(section);
  const otherItems = Array.from(qSA("nav a")).filter(
    item => ![currentNavItem, newNavItem].includes(item)
  );

  const animation = mjukna([
    ...otherItems,
    { anchor: qS("h1 span"), element: () => currentNavItem },
    { anchor: newNavItem, element: () => qS("h1 span") },
    logo
  ]);
  qS("h1 span").textContent = section;

  currentNavItem.parentNode.classList.remove("hidden");
  newNavItem.parentNode.classList.add("hidden");
  activeSection = section;
  return animation;
}

async function animateMenu(section) {
  if (activeSection) {
    return changeSection(section);
  }

  const navItem = byId(section);

  const animation = mjukna([
    { anchor: navItem, element: () => qS("h1 span") },
    ...Array.from(qSA("nav a")),
    logo
  ]);

  logo.classList.add("logo--small");
  navItem.parentNode.classList.add("hidden");
  content.insertBefore(h.h1({}, h.span({}, section)), nav);
  activeSection = section;
  return animation;
}

async function selectSection(section) {
  await animateMenu(section);
  const sectionContent = byId(`${section}-section`).querySelector("div");
  const nav = qS("nav");
  mjukna([logo, nav, qS("h1")]);
  nav.parentNode.insertBefore(sectionContent.cloneNode(true), nav);
}

function setupListeners() {
  qS("nav").addEventListener("click", event => {
    if (event.target.tagName === "A") {
      selectSection(event.target.textContent.toLowerCase());
    }
  });
}

setupListeners();
