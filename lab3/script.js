const content = document.getElementById("content");
const message = document.getElementById("message");

document.getElementById("download").addEventListener("click", () => {
  fetch("https://randomuser.me/api")
    .then(response => response.json())
    .then(data => addUser(data?.results[0]))
    .catch(() => message.innerText = "failure!");
})

// picture cell city country postcode
function addUser(user) {
  const item = document.createElement("div");
  item.className = "item";
  const image = document.createElement("img");
  image.src = user?.picture?.large || "";
  image.alt = "User picture";
  item.appendChild(image);
  const cell = document.createElement("div");
  cell.innerText = `Cell: ${user?.cell}`
  item.appendChild(cell);
  const city = document.createElement("div");
  city.innerText = `City: ${user?.location?.city}`;
  item.appendChild(city);
  const country = document.createElement("div");
  country.innerText = `Country: ${user?.location?.country}`;
  item.appendChild(country);
  const postcode = document.createElement("div");
  postcode.innerText = `Postcode: ${user?.location?.postcode}`;
  item.appendChild(postcode);
  content.appendChild(item);
  message.innerText = "success!"
}