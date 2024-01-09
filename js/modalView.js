const getJokeBtn = document.querySelector(".get_jokes");
const closeModalBtn = document.querySelector(".close-modal-btn");

const replaceModalClass = function () {
  modal.classList.replace("hidden", "slide_down");
};

const toggleModal = function () {
  modal.classList.toggle("hidden");
};

const blurBackground = () => {
  const elementsToBlur = document.querySelectorAll("body > *:not(.modal)");
  elementsToBlur.forEach((element) => {
    element.style.filter = "blur(5px)";
  });
};
const unblurBackground = () => {
  const elementsToUnblur = document.querySelectorAll("body > *:not(.modal)");
  elementsToUnblur.forEach((element) => {
    element.style.filter = "none";
  });
};

const closeModalOnClickOutside = (event) => {
  if (event.target.closest(".modal")) {
    return;
  }
  toggleModal();
  unblurBackground();
  document.removeEventListener("click", closeModalOnClickOutside);
};

getJokeBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  await getJoke(getLink());
  toggleModal();
  unblurBackground();
});

closeModalBtn.addEventListener("click", function () {
  toggleModal();
  unblurBackground();
});

joker.addEventListener("click", (event) => {
  if (!modal.classList.contains("hidden")) {
    unblurBackground();
    return;
  } else blurBackground();

  replaceModalClass();
  event.stopPropagation();
  document.addEventListener("click", closeModalOnClickOutside);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.add("hidden");
    unblurBackground();
    document.removeEventListener("click", closeModalOnClickOutside);
  }
});
