console.log("Le script est bien connecté !");

let inputDisplay = document.querySelector('input');
let buttonClick = document.querySelectorAll('button');
let buttonEgal = document.getElementById('ButtonEgal');
// stocke toutes ce que l'utilisateur tape
let expression = '';

buttonClick.forEach(button => {
    button.addEventListener('click', (e) => {
        let value = e.target.textContent;
        expression += value;
        inputDisplay.value += value;
        console.log(e.target.textContent);
        
        if(value === 'C'){
            expression = '';
            inputDisplay.value = '';
        }
    })
})




buttonEgal.addEventListener('click', () => {

}


function calculate(expression) {
    // Separer les nombre et les operateurs
    const tokens = expression.match(/\d+(\.\d+)?|[+\-*/]/g)
    console.log(tokens);


    // Gerer la prioriter des operation * et /
    let stack = [];
    let i = 0;
    while (i < tokens.length) {
        let token = tokens[i]
        if(token === "*" || token === "/") {
            const prev = parseFloat(stack.pop());
            const next = parseFloat(tokens[i + 1]); // le nombre suivant
            stack.push(token === "*" ? prev * next : prev / next);
            i += 2;
        }else {
        stack.push(token);
        i++;
    }
} 


// Faire les addition et soustraction

return res

})


