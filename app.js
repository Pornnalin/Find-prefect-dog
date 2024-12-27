CreateWord();
const form = document.querySelector("#form");
const searchBox = document.querySelector("#inputbox");
const searchBtn = document.querySelector("#search");

const checkSm = document.querySelector(".check-sm");
const checkMd = document.querySelector(".check-md");
const checkLg = document.querySelector(".check-lg");
const checkXl = document.querySelector(".check-xl");

const cardList = document.createElement("div");
cardList.className =
  "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4 justify-center";
cardList.id = "card";
document.body.appendChild(cardList);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const search = searchBox.value;

  if (!search) {
    alert("Please enter a search.");
    return;
  }
  if (cardList.childElementCount > 0) {
    cardList.replaceChildren();
    req(search);
  } else {
    req(search);
  }
});

checkSm.addEventListener("change", () => {
  SetGroupByWeight(".sm", checkSm);
  console.log(`Checkbox checked: ${checkSm.checked}`);
});
checkMd.addEventListener("change", () => {
  SetGroupByWeight(".md", checkMd);
  console.log(`Checkbox checked: ${checkMd.checked}`);
});
checkLg.addEventListener("change", () => {
  SetGroupByWeight(".lg", checkLg);
  console.log(`Checkbox checked: ${checkLg.checked}`);
});
checkXl.addEventListener("change", () => {
  SetGroupByWeight(".xl", checkXl);
  console.log(`Checkbox checked: ${checkXl.checked}`);
});

const req = async (search) => {
  try {
    let res = await request();
    // console.log(res.data);
    let lowSearch = search.toLowerCase();
    let isCardsCreated = false;
    for (const element of res) {
      if (element.temperament) {
        const temperaments = element.temperament
          .toLowerCase()
          .split(",")
          .map((t) => t.trim());
        // console.log(temperaments);
        if (temperaments.includes(lowSearch)) {
          // console.log(element.name);
          // console.log(element.image.url);
          CreateCardInfo(
            element.image.url,
            element.name,
            element.life_span,
            element.weight.metric,
            element.temperament
          );
          isCardsCreated = true;
        }
      }
    }

    if (isCardsCreated) {
      SetGroupByWeight(".sm", checkSm);
      SetGroupByWeight(".md", checkMd);
      SetGroupByWeight(".lg", checkLg);
      SetGroupByWeight(".xl", checkXl);
    } else {
      alert("No results found for your search.");
    }

    // console.log(results);
  } catch (err) {
    console.error(err);
  }
};
async function CreateWord() {
  try {
    let res = await request();
    const spanRand = document.querySelector("#rand-word");
    const temperaments = res.map((breed) => breed.temperament).filter(Boolean); //delete null and undefined

    const allTemperaments = temperaments.join("");
    const covertToArr = allTemperaments.split(",").map((str) => str.trim()); //covert to arr and delete space
    const removeDuplicate = [...new Set(covertToArr)];
    let randomWords = [];
    for (let i = 0; i < 5; i++) {
      const element = Math.floor(Math.random() * removeDuplicate.length);
      randomWords.push(removeDuplicate[element]);
      const selectWord = randomWords.join(", ");

      spanRand.innerHTML = "The suggested words are " + selectWord;
      // console.log(selectWord);
    }
  } catch (err) {
    console.error(err);
  }
}

async function request() {
  try {
    axios.defaults.headers.common["x-api-key"] = "API_Key";

    let res = await axios.get("https://api.thedogapi.com/v1/breeds/");
    return res.data;
  } catch (err) {
    console.error("Error fetching data:", error);
  }
}

function CreateCardInfo(src, name, age, metric, temperament) {
  const cardInfo = document.createElement("div");
  cardInfo.className = "flex flex-col bg-neutral rounded-md  justify-center";

  const containerP = document.createElement("div");
  const nameElement = document.createElement("p");
  const ageElement = document.createElement("p");
  const weightElement = document.createElement("p");
  const temperamentElement = document.createElement("p");
  containerP.className = "px-4 pb-6 rounded-b-md text-base-content";
  nameElement.innerHTML =
    "<span class='font-medium text-secondary'>Name:</span> " + name;
  ageElement.innerHTML =
    "<span class='font-medium text-secondary'>Life span:</span> " +
    age +
    " years";
  weightElement.innerHTML =
    "<span class='font-medium text-secondary'>Weight:</span> " +
    metric +
    " kg.";
  temperamentElement.innerHTML =
    "<span class='font-medium text-secondary'>Temperament:</span> " +
    temperament;
  //set weight
  cardInfo.className += setTypeWeightDog(metric);

  const img = document.createElement("img");
  img.src = src;
  img.className = "p-3 w-full";
  cardList.appendChild(cardInfo);
  cardInfo.appendChild(img);
  cardInfo.appendChild(containerP);
  containerP.appendChild(nameElement);
  containerP.appendChild(ageElement);
  containerP.appendChild(weightElement);
  containerP.appendChild(temperamentElement);
}

function SetGroupByWeight(className, status) {
  const divList = document.querySelectorAll(className);
  divList.forEach((item) => {
    if (status.checked) {
      item.style.display = "";
      console.log(`Showing item: ${item}`);
    } else {
      item.style.display = "none";
      console.log(`Hiding item: ${item}`);
    }
  });
}
const setTypeWeightDog = (weight) => {
  const spite = weight.split("-");

  if (isNaN(Number(spite[0]))) {
    spite[0] = 0;
  } else {
    spite[0] = Number(spite[0]);
  }
  if (isNaN(Number(spite[1]))) {
    spite[1] = 0;
  } else {
    spite[1] = Number(spite[1]);
  }
  const min = spite[0];
  const max = spite[1];

  const result = min + max;
  // console.log(result);

  let message = " ";
  if (result < 10) {
    message += "sm";
  } else if (result <= 35 && result >= 10) {
    message += "md";
  } else if (result > 35 && result < 73) {
    message += "lg";
  } else if (result > 73) {
    message += "xl";
  }
  return message;
};
function toggleMenu() {
  const menu = document.querySelector("#res-menu");

  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
    menu.classList.add("menu-open");
  } else {
    menu.classList.add("hidden");
    menu.classList.remove("menu-open");
  }
}
