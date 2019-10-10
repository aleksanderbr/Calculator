const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

let previous = ''
let current = ''
let operation = undefined
let result

// equals tracks if the equals button has been pressed previously so calculations without equals button work -
// but the values reset if the value directly pressed after the equals operator is a number

let equals = 0

// functionality for the number buttons

numberButtons.forEach(button => {
    button.addEventListener('click', () => {

        // check if equals was pressed before so there is no calculation and the values are reset

        if(equals === 1){
            previous = ''
            current = ''
            result = ''
            current += button.innerText
            currentOperandTextElement.innerText = current
            equals = 0
        }

        // check if there is already a '.' in the current field or if the pressed button is different then '.'

        else if(button.innerText !== '.' || !current.split('').includes('.')){
            current += button.innerText
            currentOperandTextElement.innerText = current;
            equals = 0
        }
    })
})

// all clear deletes all previously input values

allClearButton.addEventListener('click', () => {
    current = ''
    previous = ''
    result = ''
    currentOperandTextElement.innerText = ''
    previousOperandTextElement.innerText = ''
})

// delete just deletes the current value

deleteButton.addEventListener('click', () => {
    currentOperandTextElement.innerText = ''
    current = ''
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        
        // if user didn't press equals button calculate on click of operations button

        if(previous !== '' && current !== '' && equals === 0){
            calculate();
            equals = 0
            current = ''
        }

        // set equals to 0 if the user pressed equal sign before

        equals = 0

        // Saving the operation to be used in calculation

        operation = button.innerText

        // Setting the current number as previous to make space for next number
        // and clearing same current input field as well as the variable saved in it

        previous = currentOperandTextElement.innerText
        current = ''
        currentOperandTextElement.innerText = ''
        previousOperandTextElement.innerText = previous
    })
})

// because of imprecision in the calculation remove all the zeroes at the end of the result
// also remove the '.' if the result is not floating point but a number

let reduceZeroes = () => {

    let numArr = result.split('')

    if(numArr.includes('.')){
        for(let i = numArr.length - 1; i >= 0; i--){
            if(numArr[i] === '0') {
                numArr.splice(i, 1)
            }
            else if(numArr[i] === '.'){
                numArr.splice(i, 1)
                break
            }
            else {
                break
            }
        }    
    }
    
    result = parseFloat(numArr.join(''))
}

let calculate = () => {

    // convert to floating point from string to enable calculation

    previous = parseFloat(previous)
    current = parseFloat(current)
    switch(operation){
        case '+':
            result = (previous + current).toPrecision(10)
            break
        case '-':
            result = (previous - current).toPrecision(10)
            break
        case '*':
            result = (previous * current).toPrecision(10)
            break
        case '÷':
            result = (previous / current).toPrecision(10)
            break
        default:
            break
    }

    // set the current element to the result but assign the result to the previous variable
    // so the calculation can continue with a current value

    reduceZeroes(result)
    currentOperandTextElement.innerText = result
    previous = result
    
}


equalsButton.addEventListener('click', () => {

    // if there are no valid operands to calculate on don't do anything

    if(previous === '' || operation === '' || operation === 'undefined' || current === ''){
        return
    }

    // else do the calculation and set the equals-tracker to 1 so that if a number is pressed
    // directly after, the calculator can reset all values

    else if(equals === 0){
        equals = 1   
    }
    calculate()
});


// not yet added
    // calculations with big numbers
    // correct tracking of the previous operand in some cases
    // delete button deletes result atm