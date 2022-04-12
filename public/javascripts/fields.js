$(".add-btn").click(function (e) {
  var ul = document.getElementsByClassName("query-params-list");
  var li = document.createElement("li");
  li.innerHTML = `
    <div></div>
  `;
  
  li.appendChild(document.createTextNode("Four"));
  ul.appendChild(li);
});
