/*let buttonClick = document.querySelectorAll('button');
let display = document.querySelector('.display');

console.log(buttonClick);

buttonClick.addEventListener('click', (e) => {
     alert('Bouton cliqué !');
})

document.addEventListener('keydown', function(event) {
    console.log('Touche pressée:', event.key);
});


*/
console.log("Le script est bien connecté !");

let inputDisplay = document.querySelector('input');
let buttonClick = document.querySelectorAll('button');

buttonClick.forEach(button => {
    button.addEventListener('click', (e) => {
        value = e.target.textContent;
        inputDisplay.value += value;
        console.log(e.target.textContent);
    })
})