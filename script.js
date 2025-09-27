console.log("Le script est bien connecté !");

const inputDisplay = document.querySelector('input');
const buttonClick = document.querySelectorAll('button');
const buttonEgal = document.getElementById('ButtonEgal');

// stocke toutes ce que l'utilisateur tape
let expression = '';
let booleanCalculTerminer = false;

buttonClick.forEach(button => {        

    button.addEventListener('click', (e) => {   
        let value = e.target.textContent;     
    
        if(value === 'C'){
            expression = '';
            inputDisplay.value = '';
            booleanCalculTerminer = false;
            return
        }

        //    on repart sur une nouvelle expression si c’est un chiffre après un calcul
        if (booleanCalculTerminer) {
            if (/\d/.test(value)) { // si c’est un chiffre
                expression = "";
                inputDisplay.value = "";
            }
        booleanCalculTerminer = false;

        }

        
        expression += value;
        inputDisplay.value += value;
        console.log(e.target.textContent);     
    })
})


buttonEgal.addEventListener('click', () => {
    inputDisplay.value = calculate(expression)
    expression = inputDisplay.value;
    booleanCalculTerminer = true;
});
  

function calculate(expr) {
    // Separer les nombre et les operateurs
    const tokens = expr.match(/\d+(\.\d+)?|[+\-*/]/g)
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


    // Gerer les operation + et -
    let result = parseFloat(stack[0]);
    i = 1;
    while (i < stack.length) {
        const operator = stack[i];
        const next = parseFloat(stack[i + 1]);
        if (operator === "+") result += next 
        else if (operator === "-") result -= next;
        i += 2;
    }

    return result;
}
