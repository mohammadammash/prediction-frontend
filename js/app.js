const submitBtn = document.getElementById("submit-btn");
const img = document.getElementById("dog-image");
const input = document.getElementById("name");
const predictions = document.getElementById("predictions");
const gender = document.getElementById("gender");
const age = document.getElementById("age");
const nationalities = document.getElementById("nationalities");
const boredBtn = document.getElementById("bored");
const boredContent = document.getElementById("bored-content");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const authentication_section = document.getElementById("authentication");
// login username and password
const authenticationLabels = document.getElementsByClassName(
  "authentication-label"
);
const loginForm = document.getElementById("login-form");
const username = document.getElementById("username");
const password = document.getElementById("password");
// registration username and password
const signupForm = document.getElementById("signup-form");
const newUsername = document.getElementById("new-username");
const newPassword = document.getElementById("new-password");

// The Intl.DisplayNames object enables the consistent translation of language, region and script display names. (Reference: mdn-web docs)
const regionNames = new Intl.DisplayNames(["de"], { type: "region" });

// Intiate or load Local Storage
var data = localStorage.getItem("data");
const loadStorage = () => {
  if (!data) {
    data = {};
    localStorage.setItem("data", JSON.stringify(data));
  } else {
    data = JSON.parse(data);
  }
  console.log(data);
};

// --------START OF API SECTION-------- //
// We fetch from an API a dog image then show it, and we handle any error by showing a local dog image instead.
const fetch_dog_image = async () => {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await response.json();
    if (!data.message) throw "empty";
    img.src = data.message;
  } catch {
    img.src = "../styles/images/dogs.jfif";
  }
};

// We fetch from an API the gender then show it, and we handle any error by showing a random gender.
const fetch_gender_API = async (inputName) => {
  try {
    const response = await fetch(`https://api.genderize.io/?name=${inputName}`);
    const data = await response.json();
    if (!data.gender) throw "empty";
    gender.textContent = data.gender;
  } catch {
    const rand = Math.floor(Math.random() * 2) + 1;
    console.log(rand);
    if (rand == 1) {
      gender.textContent = "male";
    } else {
      gender.textContent = "female";
    }
  }
};

// We fetch from an API the age then show it, and we handle any error by showing a random age.
const fetch_age_API = async (inputName) => {
  try {
    const response = await fetch(`https://api.agify.io/?name=${inputName}`);
    const data = await response.json();
    if (!data.age) throw "empty";
    age.textContent = data.age;
  } catch {
    const rand = Math.floor(Math.random() * (70 - 7)) + 7;
    age.textContent = rand;
  }
};

// We fetch from an API the nationalities code then show the country name using regionNames object, and we handle any error by showing a little joke.
const fetch_nationalities_API = async (inputName) => {
  try {
    const response = await fetch(
      `https://api.nationalize.io/?name=${inputName}`
    );
    const data = await response.json();
    const [region1, region2] = [
      regionNames.of(data.country[0]["country_id"]),
      regionNames.of(data.country[1]["country_id"]),
    ];
    for (let i = 0; i < 2; i++) {
      if (i == 0) {
        nationalities.textContent = `${region1}, or `;
        continue;
      }
      nationalities.textContent += region2;
    }
  } catch {
    nationalities.textContent = "a Great Country :)";
  }
};

// We fetch an API that show random activity -this time using AXIOS-
const fetch_activity_API = async () => {
  try {
    const res = await axios.get("https://www.boredapi.com/api/activity");
    boredContent.textContent = res.data.activity;
  } catch (err) {
    boredContent.textContent = "Take a nap :p";
  }
};

// fetch the current IP of current machine(using axios):
const fetch_IP = async (heading4) => {
  let data;
  try {
    const res = await axios.get("https://api.ipify.org");
    data = await res.data;
  } catch (err) {
    data = "Welcome Home!!";
  }
  return data;
};
// --------END OF API SECTION--------//

// --------START OF MAIN SECTION-------- //
const generatePredictions = () => {
  // Get the inputValue(name) and validate first if it contains special characters or numbers
  const inputName = input.value;
  let lettersValidation = /^[A-Za-z]+$/.test(inputName);
  if (!inputName || !lettersValidation) {
    predictions.classList.add("display-none");
    return;
  }
  fetch_gender_API(inputName);
  fetch_age_API(inputName);
  fetch_nationalities_API(inputName);
  // If input passed the validation and after retrieving data we display the paragraph that will contain the results
  if (predictions.classList.contains("display-none"))
    predictions.classList.remove("display-none");
};
// --------END OF MAIN SECTION-------- //

// -------START OF AUTHENTICATION SECTION-------
// after user login/signup hide the buttons and fetch the IP-API, then Display it
const after_authentication = async () => {
  signupForm.classList.add("display-none");
  loginForm.classList.add("display-none");
  for (let i = 0; i < authenticationLabels.length; i++)
    authenticationLabels[i].classList.add("display-none");
  const h4 = document.createElement("h4");
  const data = await fetch_IP(h4);
  h4.textContent = data;
  authentication_section.appendChild(h4);
};

// Login User
const userLogin = () => {
  let currentUser = username.value;
  let currentPass = password.value;
  if (!currentUser || !currentPass) return;
  if (data[currentUser]) {
    if (currentPass == data[currentUser]) {
      after_authentication();
      console.log(`Welcome Again ${currentUser}`);
    } else console.log("Wrong Password Dude!");
  } else {
    console.log("No User Exists!!");
  }
};

// Register new User
const registerUser = () => {
  let newUser = newUsername.value;
  let newPass = newPassword.value;
  if (!newUser || !newPass) return;
  if (data[newUser]) {
    console.log("User already found! Choose different username!");
    return;
  } else {
    after_authentication();
    data[newUser] = newPass;
    localStorage.setItem("data", JSON.stringify(data));
    console.log(`Welcome to the family: ${newUser}`);
  }
};
// -------END OF AUTHENTICATION SECTION-------

//--------EVENTLISTENERS--------//
window.addEventListener("load", fetch_dog_image);
window.addEventListener("load", loadStorage);
submitBtn.addEventListener("click", generatePredictions);
boredBtn.addEventListener("click", fetch_activity_API);
loginBtn.addEventListener("click", userLogin);
signupBtn.addEventListener("click", registerUser);
