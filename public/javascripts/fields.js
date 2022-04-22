const requestMethods = {
  GET: "GET",
  POST: "POST",
};

let currentRequestMethod = null;
let optionBtns = null;
let optionAreas = null;
let currentOptionArea = null;

let queryParamIdCounter = 0;


// ### FUNCTIONS ### 

function setElementText(element, text) {
  element.textContent = text;
}

function toggleActiveElement(element) {
  element.classList.toggle("active");
}

function activateElement(element) {
  element.classList.add("active");
}

function deactivateElement(element) {
  element.classList.remove("active");
}

function setGlobalClickEventFuncs(clickEvent, functionsList) {
  // TODO: 
  // set of functions to run on every document (global) click event 
  $(document).click(function(e) {
    for (func of functionsList) {
      func(clickEvent); 
    }
  });
}

const globalClickEventFuncs = {
  deactivateElementIfNotClicked: function(clickEvent, element) {
    return (clickEvent) => {
      // TODO: 
    }
  }
}

function changeCurrReqMethod(newMethod) {
  if (newMethod == "GET") {
    currentRequestMethod = requestMethods.GET;
  } else {
    currentRequestMethod = requestMethods.POST;
  }
}

function activateOptionArea(elementSelector) {
  prevOptionArea = currentOptionArea;
  if (prevOptionArea != null) {
    deactivateElement(prevOptionArea);
  }
  currentOptionArea = document.querySelector(elementSelector);
  activateElement(currentOptionArea);
}


// ### jQuerry Events ### 

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
      activateElement(e.target);
    } else {
      deactivateElement(btn);
    }
  }
});

$(".query-params-btn").click(function (e) {
  activateOptionArea(".query-params-option-area");
});

$(".headers-btn").click(function (e) {
  activateOptionArea(".headers-option-area");
});

$(".json-btn").click(function (e) {
  activateOptionArea(".json-option-area");
});

$(".query-params-add-btn").click(function (e) {
  // create new query param input row 
  let queryParamInstance = document.createElement("div");
  queryParamInstance.classList.add("query-param-instance");

  // create components of the input row 
  let key = document.createElement("input");
  key.classList.add("key");
  let value = document.createElement("input");
  value.classList.add("value");
  let removeBtn = document.createElement("div");
  removeBtn.textContent = "Remove";
  removeBtn.classList.add("removeBtn");

  // add the components to the input row 
  queryParamInstance.appendChild(key);
  queryParamInstance.appendChild(value);
  queryParamInstance.appendChild(removeBtn);
  queryParamInstance.id = queryParamIdCounter;
  queryParamIdCounter++;

  // add the input row the query param area 
  let queryParamsArea = document.querySelector(".query-params-option-area");
  queryParamsArea.insertBefore(queryParamInstance, e.target);
});

$(".send-btn").click(function (e) {
  // TODO:
});

$(document).ready(function (e) {
  let dropdownButtonText = document.querySelector(".dropdown-main-btn-text");
  let dropdownArea = document.querySelector(".dropdown-area");

  // set default text for dropdown button
  let defaultText = dropdownArea.children[0].textContent;
  setElementText(dropdownButtonText, defaultText);

  // default setup
  currentRequestMethod = requestMethods.GET;
  optionBtns = document.querySelectorAll(".btns-list .btn");
  optionAreas = document.querySelectorAll(".option-area-list .option-area");
  $(".query-params-btn").click();

  // Mutation Observer for future query param instances
  const config = { childList: true };
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        $(".removeBtn").off("click");
        $(".removeBtn").click(function (e) {
          e.target.parentNode.remove();
        });
      }
    }
  };
  const observer = new MutationObserver(callback);
  let queryParamsArea = document.querySelector(".query-params-option-area");
  observer.observe(queryParamsArea, config);
});
