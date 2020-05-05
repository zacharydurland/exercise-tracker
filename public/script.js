// // client-side js, loaded by index.html
// // run by the browser each time the page is loaded


// // define variables that reference elements on our page
// const dreamsList = document.getElementById("dreams");
// const dreamsForm = document.querySelector("form");

// // a helper function that creates a list item for a given dream
// function appendNewDream(dream) {
//   const newListItem = document.createElement("li");
//   newListItem.innerText = dream;
//   dreamsList.appendChild(newListItem);
// }

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0,10) === dateString;
}


let dateField = document.getElementById("date")
let dateError = document.getElementById("dateError")
let dateErrorMessage = document.getElementById("dateErrorMessage")

dateField.addEventListener('keyup', (e)=>{
  let date = e.target.value
  console.log(isValidDate(date))
  if (!isValidDate(date)) {
    dateError.classList.remove('hidden')
  } else {
    dateError.classList.add('hidden')
  }
})
