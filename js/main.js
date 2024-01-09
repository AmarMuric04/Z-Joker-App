const joker = document.querySelector(".joker");
const main = document.querySelector(".main");
const modal = document.querySelector(".modal");

const getMarkupForOneJoke = function (data, html) {
  return `
    <div class="joke-container ${data.type}">
      <div class="${data.category} card">
        <div class="info-container"> <span>${data.category}</span><ul class="${
    Object.entries(data.flags).some((el) => el[1] === true) === false
      ? "safe"
      : "notsafe"
  }"> ${Object.entries(data.flags)
    .filter((el) => el[1] === true)
    .map((el) => `<li>${el[0]}</li>`)
    .join(" ")}</ul></div>
      </div>
      <div>  
     ${html}
      </div>
    </div>`;
};

const getJoke = async function (link) {
  try {
    const response = await fetch(`${link}`);
    const data = await response.json();
    let html;

    if (data.error === true)
      throw new Error(
        "<div class='error'><img class='error-icon' src='./imgs/warning.png'/> <h2>Could not find any jokes under the given filters </h2></div>"
      );
    else if (!data.jokes && !data.joke)
      //prettier-ignore
      html = getMarkupForOneJoke(data, `<p>${data.setup}</p> <p>${data.delivery}</p>`);
    else if (!data.jokes && !data.setup && !data.delivery)
      html = getMarkupForOneJoke(data, `<p>${data.joke}</p>`);
    else if (link.includes("type=single")) {
      html = data.jokes
        .map(
          (el) =>
            `<div class="joke-container ${el.type}">
                <div class="${el.category} card">
                    <div class="info-container"><span>${
                      el.category
                    }</span> <ul class="${
              Object.entries(el.flags).some((el) => el[1] === true) === false
                ? "safe"
                : "notsafe"
            }"> ${Object.entries(el.flags)
              .filter((el) => el[1] === true)
              .map((el) => `<li>${el[0]}</li>`)
              .join(" ")}</ul></div>
                </div>
                <div>
                 <p>${el.joke}</p>
                </div>
              </div>`
        )
        .join("");
    } else if (link.includes("type=twopart")) {
      //prettier-ignore
      html = data.jokes.map(
      (el) =>
        `<div class="joke-container ${el.type}">
                <div class="${el.category} card">
                    <div class="info-container"><span>${
                      el.category
                    }</span> <ul class="${
          Object.entries(el.flags).some((el) => el[1] === true) === false
            ? "safe"
            : "notsafe"
        }"> ${Object.entries(el.flags)
          .filter((el) => el[1] === true)
          .map((el) => `<li>${el[0]}</li>`)
          .join(" ")}</ul></div>
                </div>
                <div>
                 <p>${el.setup}</p>
                 <p>${el.delivery}</p>
                </div>
              </div>`
    )
    .join("");
    } else {
      html = data.jokes
        .map((el) =>
          el.joke
            ? `
            <div class="joke-container ${el.type}">
              <div class="${el.category} card">
                <div class="info-container">
                  <span>${el.category}
                  </span>
                    <ul class="${
                      Object.entries(el.flags).some((el) => el[1] === true) ===
                      false
                        ? "safe"
                        : "notsafe"
                    }">
                      ${Object.entries(el.flags)
                        .filter((el) => el[1] === true)
                        .map((el) => `<li>${el[0]}</li>`)
                        .join(" ")}
                    </ul>
                  </div>
              </div>
              <div>
                <p>${el.joke}</p>
              </div>
            </div>`
            : `
            <div class="joke-container ${el.type}">
              <div class="${el.category} card">
                <div class="info-container"> 
                  <span>${el.category}
                  </span> 
                    <ul class="${
                      Object.entries(el.flags).some((el) => el[1] === true) ===
                      false
                        ? "safe"
                        : "notsafe"
                    }">
                     ${Object.entries(el.flags)
                       .filter((el) => el[1] === true)
                       .map((el) => `<li>${el[0]}</li>`)
                       .join(" ")}
                    </ul>
                </div>
              </div>
              <div>
                <p>${el.setup}</p>
                <p>${el.delivery}</p> 
              </div>
            </div>`
        )
        .join("");
    }
    main.innerHTML = html;
  } catch (err) {
    main.innerHTML = `${err.message}`;
  }
};

const getLink = function () {
  const data = [...new FormData(modal)];
  const flags = data
    .filter((el) => el[0].endsWith("_flag"))
    .map((el) => `${el[0].slice(0, el.indexOf("_") - 4)}`)
    .join(",");
  const typesArr = data
    .filter((el) => el[0].endsWith("_type"))
    .map((el) => `${el[0].slice(0, el.indexOf("_") - 4)}`);

  const type = typesArr.length === 2 ? "" : typesArr[0];
  const category = data.filter((el) => el[0] === "select")[0][1];
  const amount = data.filter((el) => el[0] === "amount")[0][1];

  return `https://v2.jokeapi.dev/joke/${category}${
    amount == 1 || !amount ? "" : "?amount=" + amount
  }${
    flags
      ? amount == 1
        ? "?blacklistFlags=" + flags
        : "&blacklistFlags=" + flags
      : ""
  }${
    type
      ? amount == 1 && flags.length === 0
        ? "?type=" + type
        : "&type=" + type
      : ""
  }`;
};

document.querySelector(".joker").addEventListener("mouseover", function (e) {
  if (!e.target.classList.contains("joker")) {
    e.target.parentElement.classList.add("animation");
    return;
  }

  e.target.classList.add("animation");
});
document.querySelector(".joker").addEventListener("mouseleave", function (e) {
  e.target.classList.remove("animation");
});
