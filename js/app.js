const submitBtn = document.getElementById("submit-btn");
const img = document.getElementById("dog-image");
const input = document.getElementById("name");
const predictions = document.getElementById("predictions");
const gender = document.getElementById("gender");
const age = document.getElementById("age");
const nationalities = document.getElementById("nationalities");

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

const generatePredictions = () => {
  // Get the inputValue(name) and validate first if it contains special characters or numbers
  const inputName = input.value;
  let lettersValidation = /^[A-Za-z]+$/.test(inputName);
  if (!inputName || !lettersValidation) {
    predictions.classList.add("display-none");
    return;
  }
  // If input passed the validation we display the paragraph that will contain the results
  if (predictions.classList.contains("display-none")) {
    predictions.classList.remove("display-none");
  }
  fetch_gender_API(inputName);
  fetch_age_API(inputName);
};


// Each time our window loads
window.addEventListener("load", fetch_dog_image);
// Each time the Guess button clicked => generatePredictions()
submitBtn.addEventListener("click", generatePredictions);
