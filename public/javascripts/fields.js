const requestMethods = {
  GET: "GET",
  POST: "POST",
};

let currentRequestMethod = requestMethods.GET;
let optionBtns = null;

function setElementText(element, text) {
  element.textContent = text;
}

function toggleActiveElement(element) {
  element.classList.toggle("active");
}

function deactivateElement(element) {
  element.classList.remove("active");
}

function changeCurrReqMethod(newMethod) {
  if (newMethod == "GET") {
    currentRequestMethod = requestMethods.GET;
  } else {
    currentRequestMethod = requestMethods.POST;
  }
}

function showQueryParams(e) {}

function showHeaders(e) {}

function showJSON(e) {}

$(".dropdown-main-btn").click(function (e) {
  let dropdownArea = document.querySelector(".dropdown-area");
  toggleActiveElement(dropdownArea);
});

$(".dropdown-area .dropdown-btn").click(function (e) {
  let chosenRequestMethod = e.target.textContent;
  changeCurrReqMethod(chosenRequestMethod);
});

$(".btn").click(function (e) {
  for (btn of optionBtns) {
    if (btn == e.target) {
      toggleActiveElement(e.target);
    } else {
      deactivateElement(btn);
    }
  }
});

$(".query-params-btn").click(function (e) {});

$(".headers-btn").click(function (e) {});

$(".json-btn").click(function (e) {});

$(document).ready(function (e) {
  let dropdownButtonText = document.querySelector(".dropdown-main-btn-text");
  let dropdownArea = document.querySelector(".dropdown-area");

  // set default text for dropdown button
  let defaultText = dropdownArea.children[0].textContent;
  setElementText(dropdownButtonText, defaultText);

  // populate optionBtns
  optionBtns = document.querySelectorAll(".btns-list .btn");
});
