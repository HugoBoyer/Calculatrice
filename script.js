console.log("Le script est bien connecté !");
const inputDisplay = document.querySelector('input[type="text"]');
const buttonClick = document.querySelectorAll('button');
const buttonEgal = document.getElementById('ButtonEgal');
const toggleButton = document.getElementById('toggle');
const body = document.body;

// Mode sombre / clair
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});

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

// Gérer le cas où l'utilisateur tape un opérateur en premier
function handleOperatorAtStart(op) {
const lastChar = expression[expression.length - 1];
    if (expression === "") {
        if(op === '-' || op === '+' || op === '*' || op === '/') {
        expression = '0' + op; // empêche de commencer par un opérateur
        inputDisplay.value = '0' + op;
        }
    return;
    }

    if(/[+\-*/]/.test(lastChar) && /[+\-*/]/.test(op)) {
        // Remplacer le dernier opérateur par le nouveau
        expression = expression.slice(0, -1) + op;
        inputDisplay.value = inputDisplay.value.slice(0, -1) + op;
        return true; // Indique qu'un remplacement a été effectué
    }
    expression += op;
    inputDisplay.value += op;
}

buttonClick.forEach(button => {        
    button.addEventListener('click', (e) => {   
        let value = e.target.textContent;  
        if(!value || value === '=' ) return; // ignorer les boutons sans valeur ou le bouton '='
        
        // Gérer le bouton C (clear)
        if(value === 'C'){
            expression = '';
            inputDisplay.value = '';
            booleanCalculTerminer = false;
            return
        }

        // on repart sur une nouvelle expression si c’est un chiffre après un calcul
        if (booleanCalculTerminer) {
            if (/\d/.test(value)) { // si c’est un chiffre
                expression = "";
                inputDisplay.value = "";
            }
        booleanCalculTerminer = false;
        }

        // Gérer le cas où l'utilisateur tape un opérateur en premier
        if(/[+\-*/]/.test(value)) {
            handleOperatorAtStart(value);
            return; // Sortir de la fonction après avoir géré l'opérateur
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
    if(!expression) return; // si l'expression est vide, ne rien faire

    // Calculer le résultat avec 0 si l'expression se termine par un opérateur
    const result = calculate(expression, true);
    console.log("Resultat:", result);

    inputDisplay.value = result
    expression = result.toString(); // pour continuer les calculs avec le résultat
    booleanCalculTerminer = true;
});


function calculate(expr, completeOperation = false) {
    if(completeOperation && endWithOperator(expr)) {
        expr += '0'; // Ajouter 0 si l'expression se termine par un opérateur
    }
    console.log("Expr corrigée:", expr); 
    // Separer les nombre et les operateurs
    const tokens = expr.match(/sin|cos|tan|log|\d+(\.\d+)?|x²|x³|xʸ|%|√|[+\-*/()]/g)
    if (!tokens) return 0; 
       // Evaluer les parenthèses en premier
    let tokensWithoutParentheses = evalParenthese(tokens);
    console.log("Tokens:", tokens);

    // Gérer l'opération x²    
    let stackPuissance = [];
    for (let i = 0; i < tokensWithoutParentheses.length; i++) {
        let token = tokensWithoutParentheses[i]
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
            if (tokensWithoutParentheses[i + 1] === undefined) return NaN;
            const prev = stackPuissance.pop();
            const next = parseFloat(tokensWithoutParentheses[i + 1]);
            if (isNaN(prev) || isNaN(next)) return 0;
            stackPuissance.push(prev**next);
            i++; // sauter le nombre suivant car il a deja ete utilise
        } else {
            stackPuissance.push(token);
        }
    }
    tokensWithoutParentheses = stackPuissance;

    // Gerer les pourcentage 
    let stackPourcentage = [];
    for (let i = 0; i < tokensWithoutParentheses.length; i++) {
        let token = tokensWithoutParentheses[i]
        if(token === "%") {
            const prev = stackPourcentage.pop();
            const op = stackPourcentage[stackPourcentage.length - 1]; // l'operateur avant le nombre
            if(op === "+" || op === "-") {
                const Beforeop = stackPourcentage[stackPourcentage.length - 2];
                stackPourcentage.push(Beforeop * (prev / 100));

            } else {
                stackPourcentage.push(prev / 100);
            }
        } else {
            stackPourcentage.push(token);
        }
    }
 tokensWithoutParentheses = stackPourcentage;


    // Gerer la racine car elle a la plus haute prioriter
    let stackRacine = [];
    for(let i =0; i < tokensWithoutParentheses.length; i++) {
        let token = tokensWithoutParentheses[i]
        if(token === "√") {
            const next = parseFloat(tokensWithoutParentheses[i + 1]);
            if (isNaN(next)) return NaN;
            stackRacine.push(Math.sqrt(next));
            i++; // sauter le nombre suivant car il a deja ete utilise
    } else if (typeof token === "number") {
        stackRacine.push(token);
    } else {
        stackRacine.push(token);
    }
    }
 tokensWithoutParentheses = stackRacine;

    // Gerer le Cos Radian
    let stackCos = [];
    for (let i = 0; i < tokensWithoutParentheses.length; i++) {
        let token = tokensWithoutParentheses[i]
        if(token === "cos") {
            const next = parseFloat(tokensWithoutParentheses[i + 1]);
            if(typeof next !== "number") return "NaN";
            stackCos.push(Math.cos(next))
            i++;
        } else {
            stackCos.push(token);
        }
    }
 tokensWithoutParentheses = stackCos;



    // Gerer la prioriter des operation * et /
    let stack = [];
    let i = 0;
    while (i < tokensWithoutParentheses.length) {
        let token = tokensWithoutParentheses[i]
        if(token === "*" || token === "/") {
            const prev = parseFloat(stack.pop());
            const next = parseFloat(tokensWithoutParentheses [i + 1]); // le nombre suivant
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

 // Gerer les parentheses 
function evalParenthese(tokens) {
    let stackParentheses = [];
    let temp = [];

    for(let token of tokens) {
        if(token === "(") {
            temp.push(stackParentheses)
            stackParentheses = []
        } else if (token === ")") {
            let value = calculate(stackParentheses.join(''), true);
            stackParentheses = temp.pop()
            stackParentheses.push(value.toString());
        }
        else {
            stackParentheses.push(token)
        }
    }
    return stackParentheses
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