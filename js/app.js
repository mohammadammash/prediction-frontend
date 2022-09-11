const submitBtn = document.getElementById("submit-btn");
const img = document.getElementById("dog-image");
const input = document.getElementById("name");
const predictions = document.getElementById("predictions");
const gender = document.getElementById("gender");
const age = document.getElementById("age");
const nationalities = document.getElementById("nationalities");
const boredBtn = document.getElementById("bored");
const boredContent = document.getElementById("bored-content");
const authenticationBtn = document.getElementById("authenticationBtn");
const authenticationForm = document.getElementById("authentication");
const username = document.getElementById("username");

// The Intl.DisplayNames object enables the consistent translation of language, region and script display names. (Reference: mdn-web docs)
const regionNames = new Intl.DisplayNames(["de"], { type: "region" });

// Intiate or load Local Storage
const loadStorage = () => {
  let usernames = localStorage.getItem("usernames");
  if (!usernames) {
    usernames = new Set();
    localStorage.setItem("usernames",JSON.stringify(usernames));
  } else {
    usernames = JSON.parse(usernames);
  }

  return usernames;
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

// Authenticating User
const authenticateUser = () => {
  let currentUser = username.value;
  if (currentUser in usernames) {
    console.log(`Welcome Again ${currentUser}`);
  } else {
    console.log(`Hello ${currentUser}`);
    usernames.add(currentUser);
    localStorage.setItem("usernames", JSON.stringify(usernames));
  }
};


//--------EVENTLISTENERS--------//
window.addEventListener("load", fetch_dog_image);
var usernames = window.addEventListener("load", loadStorage);
submitBtn.addEventListener("click", generatePredictions);
boredBtn.addEventListener("click", fetch_activity_API);
authenticationBtn.addEventListener("click", authenticateUser);
