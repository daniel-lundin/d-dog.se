/* global h, mjukna */
const byId = document.getElementById.bind(document);
const qS = document.querySelector.bind(document);
const qSA = document.querySelectorAll.bind(document);

const logo = byId("logo");
const nav = qS("nav");
const content = byId("content");

const slowSpring = {
  stiffness: 8
};

let activeSection = null;

async function changeSection(section) {
  const sectionContent = qS(".content-wrapper .section-content");
  const contentRemoval = mjukna([
    logo,
    // sectionContent,
    nav,
    qS("h1"),
    qS(".content-wrapper")
  ]);
  sectionContent.remove();
  await contentRemoval;

  const currentNavItem = byId(`${activeSection}-nav`);
  const newNavItem = byId(`${section}-nav`);
  const otherItems = Array.from(qSA("nav a")).filter(
    item => ![currentNavItem, newNavItem].includes(item)
  );

  const animation = mjukna([
    ...otherItems,
    { anchor: qS("h1 span"), element: () => currentNavItem },
    {
      anchor: qS(".content-wrapper hr"),
      element: () => currentNavItem.parentNode.querySelector("hr")
    },
    { anchor: newNavItem, element: () => qS("h1 span") },
    {
      anchor: newNavItem.parentNode.querySelector("hr"),
      element: () => qS(".content-wrapper hr")
    },
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

  const navItem = byId(`${section}-nav`);

  const animation = mjukna([
    { anchor: navItem, element: () => qS("h1 span") },
    {
      anchor: navItem.parentNode.querySelector("hr"),
      element: () => qS(".content-wrapper hr")
    },
    nav,
    logo
  ]);

  logo.classList.add("logo--small");
  navItem.parentNode.classList.add("hidden");
  content.append(
    h.div({ class: "content-wrapper" }, [
      h.hr({}),
      h.h1({}, h.span({}, section))
    ])
  );
  activeSection = section;
  return animation;
}

async function selectSection(section) {
  await animateMenu(section);
  const sectionContent = byId(`${section}-section`).querySelector("div");
  const nav = qS("nav");
  mjukna([logo, nav, qS(".content-wrapper hr"), qS("h1")], {
    enterFilter: element => element.classList.contains("section-content")
  });
  qS(".content-wrapper").appendChild(sectionContent.cloneNode(true));
}

function setupListeners() {
  qS("nav").addEventListener("click", event => {
    if (event.target.tagName === "A") {
      selectSection(event.target.textContent.toLowerCase());
    }
  });
  byId("logo-link").addEventListener("click", () => {
    if (activeSection) {
      const navItem = byId(`${activeSection}-nav`);

      const animation = mjukna([
        { element: () => navItem, anchor: qS("h1 span") },
        {
          element: () => navItem.parentNode.querySelector("hr"),
          anchor: qS(".content-wrapper hr")
        },
        nav,
        logo
      ]);

      logo.classList.remove("logo--small");
      navItem.parentNode.classList.remove("hidden");
      qS(".content-wrapper").remove();
      activeSection = null;
      return animation;
    }
  });
}

setupListeners();
