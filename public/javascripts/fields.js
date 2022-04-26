import { awaitHandle } from "./util.js";

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

// set of functions to run on every document (global) click event
function setGlobalClickEventFuncs(functionsList) {
  $(document).click(function (e) {
    for (const func of functionsList) {
      func(e);
    }
  });
}

const globalClickEventFuncs = {
  // used for deactivating dropdown if other areas are clicked
  deactivateElementIfNotClicked: function (
    elementToCheck,
    elementToDeactivate
  ) {
    return (clickEvent) => {
      const clickedElement = clickEvent.target;
      if (clickedElement !== elementToCheck) {
        deactivateElement(elementToDeactivate);
      }
    };
  },
};

function changeCurrReqMethod(newMethod) {
  if (newMethod == "GET") {
    currentRequestMethod = requestMethods.GET;
  } else {
    currentRequestMethod = requestMethods.POST;
  }
}

function activateOptionArea(elementSelector) {
  const prevOptionArea = currentOptionArea;
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
  for (const btn of optionBtns) {
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

$(".send-btn").click(async function (e) {
  // get URL
  let fetchURL = document.querySelector(".url-input").value;

  // get query params from the rows
  const queryParamRows = document.querySelectorAll(".query-param-instance");
  const queryParamList = [];
  for (const row of queryParamRows) {
    queryParamList.push({
      key: row.querySelector(".key").value,
      value: row.querySelector(".value").value,
    });
  }

  if (queryParamList.length != 0) {
    fetchURL += "?";
    for (const queryParamPair of queryParamList) {
      fetchURL =
        fetchURL + queryParamPair.key + "=" + queryParamPair.value + "&";
    }
    fetchURL = fetchURL.substring(0, fetchURL.length - 1);
  }

  const [data, fetchError] = await awaitHandle(
    fetch(fetchURL, {
      method: currentRequestMethod,
    })
  );
  if (fetchError) {
    console.error("FETCH ERROR: ", fetchError);
    return;
  }
  const data_json = await data.json();

  console.log("FETCHED DATA: ", data_json);
});


$(document).ready(function (e) {
  let dropdownButtonText = document.querySelector(".dropdown-main-btn-text");
  let dropdownArea = document.querySelector(".dropdown-area");

  // set default text for dropdown button
  let defaultText = dropdownArea.children[0].textContent;
  setElementText(dropdownButtonText, defaultText);
  
  // default value for request writer input field
  let URLInput = document.querySelector(".url-input");
  URLInput.value = "http://localhost:3000/"

  // default setup
  currentRequestMethod = requestMethods.GET;
  optionBtns = document.querySelectorAll(".btns-list .btn");
  optionAreas = document.querySelectorAll(".option-area-list .option-area");

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

  // set global click event process functions
  const functionsList = [];
  let dropdownMainBtn = document.querySelector(".dropdown-main-btn");
  functionsList.push(
    globalClickEventFuncs.deactivateElementIfNotClicked(
      dropdownMainBtn,
      dropdownArea
    )
  );
  setGlobalClickEventFuncs(functionsList);

  // initial default clicks
  $(".query-params-btn").click();
});
