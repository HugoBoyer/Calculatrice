console.log("Le script est bien connecté !");

const inputDisplay = document.querySelector('input');
const buttonClick = document.querySelectorAll('button');
const buttonEgal = document.getElementById('ButtonEgal');

// stocke toutes ce que l'utilisateur tape
let expression = '';
let booleanCalculTerminer = false;
let TapePuissanceY = false;

// Fonction pour vérifier si l'expression se termine par un opérateur
function endWithOperator(expr) {
    const operators = ['+', '-', '*', '/'];
    if(!expr) return false;
    const lastChar = expr[expr.length - 1];
    return operators.includes(lastChar);
}


buttonClick.forEach(button => {        
    button.addEventListener('click', (e) => {   
        let value = e.target.textContent;  
        if(value === 'C'){
            expression = '';
            inputDisplay.value = '';
            booleanCalculTerminer = false;
            return
        }
        
        
        if (!/\d/.test(value)) {
           if (expression === '' ||  endWithOperator(expression)) {
                return; // ne rien faire si l'expression est vide ou se termine par un opérateur
            }
        }


        // on repart sur une nouvelle expression si c’est un chiffre après un calcul
        if (booleanCalculTerminer) {
            if (/\d/.test(value)) { // si c’est un chiffre
                expression = "";
                inputDisplay.value = "";
            }
        booleanCalculTerminer = false;
        }

        // Gérer le cas de la puissance y
        if(value === "xʸ"){
            TapePuissanceY = true;
            expression += "xʸ";
            inputDisplay.value += "^";
            return;
        }


        if (TapePuissanceY && /\d/.test(value)) {
            inputDisplay.value += Superscript(value);
            expression += value;
            booleanCalculTerminer = false;
            TapePuissanceY = false;
            return; // NE PAS mettre TapePuissanceY = false ici
        }
        
        // Ajouter la valeur cliquée à l'expression
        
        inputDisplay.value += (
            value === "x²" ? "²" : 
            value === "x³" ? "³" : value       
        );
        expression += value;
        console.log(e.target.textContent);     
    })
})


buttonEgal.addEventListener('click', () => {
    // Retirer le dernier caractère si c'est un opérateur
    if (endWithOperator(expression)) {
        expression = expression.slice(0, -1); // retirer le dernier caractère
    } ; 
    
    inputDisplay.value = calculate(expression)
    expression = inputDisplay.value;
    booleanCalculTerminer = true;
});
  

function calculate(expr) {
    // Separer les nombre et les operateurs
    const tokens = expr.match(/\d+(\.\d+)?|x²|x³|xʸ|[+\-*/]/g)
    if (!tokens) return 0;
    console.log("Tokens:", tokens);

    // Gérer l'opération x²    
    let stackPuissance = [];
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i]
        if(!isNaN(token)) {
            stackPuissance.push(parseFloat(token));
        }
        else if(token === "x²" || token === "x³") {
            const prev = stackPuissance.pop();
            stackPuissance.push(
                token === "x²" ? prev**2 
                : token === "x³" ? prev**3 
                : prev
            );
        } else if(token === "xʸ") {
            if (tokens[i + 1] === undefined) return NaN;
            const prev = stackPuissance.pop();
            const next = parseFloat(tokens[i + 1]);
            stackPuissance.push(prev**next);
            i++; // sauter le nombre suivant car il a deja ete utilise
        } else {
            stackPuissance.push(token);
        }
    }

    // Gerer la prioriter des operation * et /
    let stack = [];
    let i = 0;
    while (i < stackPuissance.length) {
        let token = stackPuissance[i]
        if(token === "*" || token === "/") {
            const prev = parseFloat(stack.pop());
            const next = parseFloat(stackPuissance[i + 1]); // le nombre suivant
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


function Superscript(express){
    const UnicodeMap = {
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹',
    }
    return express.toString().split('').map(char => UnicodeMap[char] || char).join('');
}