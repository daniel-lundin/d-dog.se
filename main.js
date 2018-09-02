/* global h, mjukna */
const byId = document.getElementById.bind(document);

function waitForEvent(element, event) {
  return new Promise(resolve => {
    element.addEventListener(event, resolve, { once: true });
  });
}

function selectMenu() {
  // const details = h.div({ class: "details" });
  // mjukna(
  //   { anchor: this.querySelector(".underline"), element: () => details },
  //   { spring: { stiffness: 1 } }
  // );
  // document.body.appendChild(details);
}

function selectSection(sectionName) {
  content.innerHTML = "";
  const section = h.div({}, [
    createLogo(),
    h.h2({ class: "section-header" }, h.span({}, sectionName)),
    createMenu({ omittedSection: sectionName })
  ]);

  mjukna(document.querySelectorAll("nav li span"));

  content.appendChild(section);
}

function createMenu({ omittedSection } = {}) {
  const sections = Array.from(document.querySelectorAll("article section"));
  return h.nav(
    {},
    h.ul(
      {},
      sections
        .map(section => {
          return section.querySelector("h2").textContent;
        })
        .filter(sectionName => sectionName !== omittedSection)
        .map(sectionName =>
          h.li(
            {},
            h.a(
              {
                href: "#",
                onClick: () => {
                  selectSection(sectionName);
                }
              },
              [h.span({}, sectionName)]
            )
          )
        )
    )
  );
}

function injectMenu() {
  const menu = createMenu();
  content.appendChild(menu);
}

function introAnimation() {
  content.innerHTML = "";
  const circle = h.div({ class: "circle" });
  content.appendChild(circle);

  setTimeout(async () => {
    const animation = mjukna(
      { anchor: circle, element: () => byId("the-o") },
      {
        spring: {
          stiffness: 10,
          damping: 0.3
        }
      }
    );

    renderLogo();
    await animation;

    const logo = byId("logo");

    const fadeAnimation = waitForEvent(
      logo.querySelector(".logo-letter"),
      "transitionend"
    );
    logo.classList.remove("hidden-letters");

    await fadeAnimation;
    mjukna(
      { anchor: logo, element: () => byId("logo") },
      {
        enterFilter: element => element.tagName === "NAV"
      }
    );
    injectMenu();
  }, 100);
}

function renderLogo() {
  content.innerHTML = "";
  const logo = createLogo();
  logo.classList.add("hidden-letters");
  content.appendChild(logo);
}
//
// let state = { view: "initial" };
const content = byId("content");

introAnimation();

function createLogo() {
  const template = byId("logo-tpl");

  return template.querySelector("svg").cloneNode(true);
}
