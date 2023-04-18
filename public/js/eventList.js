const eventDiv = document.getElementById("event");
const loadScanner = (urlParam) => {
  console.log("Opening scanner");
  window.location = "scanner.html" + urlParam;
};

const makeList = (data) => {
  const list = document.createElement("ul");
  for (var i = 0; i < data.length; i++) {
    var listDiv = document.createElement("div");
    listDiv.id = "listDiv";
    listDiv.className = "card";

    var leftDiv = document.createElement("div");
    var rightDiv = document.createElement("div");
    leftDiv.id = "leftDiv";
    rightDiv.id = "rightDiv";

    var arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.classList.add("arrow-right");
    rightDiv.appendChild(arrow);
    rightDiv.data = "?eventId=" + data[i].id +"&eventName=" + data[i].name;
    rightDiv.onclick = function () {
        loadScanner(this.data);
    };

    var listName = document.createElement("li");
    var listDate = document.createElement("li");
    var listLocation = document.createElement("li");
    var listCount = document.createElement("li");

    var nameSpan = document.createElement("h1");
    var dateSpan = document.createElement("span");
    var locationSpan = document.createElement("span");
    var countSpan = document.createElement("span");

    var date = new Date(data[i].date);
    nameSpan.innerHTML = data[i].name;
    dateSpan.innerHTML = `${date.getHours()}:${date.getMinutes()} - ${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`;
    locationSpan.innerHTML = data[i].location;
    countSpan.innerHTML = "Attendee count: " + data[i].attendees.length;

    listName.appendChild(nameSpan);
    listDate.appendChild(dateSpan);
    listLocation.appendChild(locationSpan);
    listCount.appendChild(countSpan);

    leftDiv.appendChild(listName);
    leftDiv.appendChild(listDate);
    leftDiv.appendChild(listLocation);
    leftDiv.appendChild(listCount);

    listDiv.appendChild(leftDiv);
    listDiv.appendChild(rightDiv);
    list.appendChild(listDiv);
  }
  eventDiv.appendChild(list);
};

const fetchEvents = async (httpUrl) => {
  fetch(httpUrl, {
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      makeList(data.data.allEvents);
    });
};
if (sessionStorage.getItem('token')!=null) {
  fetchEvents("/event");
}
else {
  console.log("No token");
}

