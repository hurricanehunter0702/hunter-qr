const switchers = [...document.querySelectorAll(".switcher")];
const signupForm = document.getElementById("formSignup");
const loginForm = document.getElementById("formLogin");
switchers.forEach((item) => {
  item.addEventListener("click", function () {
    switchers.forEach((item) =>
      item.parentElement.classList.remove("is-active")
    );
    this.parentElement.classList.add("is-active");
  });
});

const signUp = async (url) => {
  var email = document.getElementById("signup-email").value;
  var firstname = document.getElementById("signup-firstname").value;
  var lastname = document.getElementById("signup-lastname").value;
  var password = document.getElementById("signup-password").value;
  var organization = document.getElementById("signup-org").value;

  let query = `mutation {
    registerMember(email: "${email}", firstname: "${firstname}", lastname:"${lastname}", organization:"${organization}", password: "${password}") {
            firstname,
            lastname,
            token}}`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => {
      return response.json();
    })
    .then(function (data) {
      sessionStorage.setItem("token", data.data.registerMember.token);
      window.location = "events.html";
    });
};

const login = async (url) => {
  var email = document.getElementById("login-email").value;
  var password = document.getElementById("login-password").value;

  let query = `query {
        login(email: "${email}", password:"${password}") {
            firstname,
            lastname,
            token
        }
    }`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => {
      return response.json();
    })
    .then(function (data) {
      sessionStorage.setItem("token", data.data.login.token);
      window.location = "events.html";
    });
};

loginForm.onsubmit = () => {
  login("/graphql");
  return false;
};
signupForm.onsubmit = () => {
  signUp("/graphql");
  return false;
};
