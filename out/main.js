import { addButtonListener, getSpan } from "./functions.js";
const stateEl = getSpan("state");
const resultEl = getSpan("result");
const memoryEl = getSpan("memory");
addButtonListener("btnC", () => {
    const memory = state.memory;
    state = getCleanState();
    state.memory = memory;
    saveState();
    updateUI();
});
addButtonListener("btnCE", () => {
    state.input = "0";
    saveState();
    updateUI();
});
addButtonListener("btnDel", () => {
    if (state.input.length <= 1)
        state.input = "0";
    else
        state.input = state.input.slice(0, state.input.length - 1);
    state.clearInputOnType = false;
    saveState();
    updateUI();
    resultEl.parentElement?.scroll(resultEl.parentElement.scrollWidth, 0);
});
addButtonListener("btn1", () => digit(1));
addButtonListener("btn2", () => digit(2));
addButtonListener("btn3", () => digit(3));
addButtonListener("btn4", () => digit(4));
addButtonListener("btn5", () => digit(5));
addButtonListener("btn6", () => digit(6));
addButtonListener("btn7", () => digit(7));
addButtonListener("btn8", () => digit(8));
addButtonListener("btn9", () => digit(9));
addButtonListener("btn0", () => digit(0));
addButtonListener("btn,", () => {
    if (!state.input.includes(","))
        state.input = `${state.input},`;
    saveState();
    updateUI();
    resultEl.parentElement?.scroll(resultEl.parentElement.scrollWidth, 0);
});
addButtonListener("btnSign", () => {
    if (state.input.startsWith("-"))
        state.input = state.input.slice(1);
    else
        state.input = "-" + state.input;
    saveState();
    updateUI();
});
addButtonListener("btnInv", () => unary(x => 1 / x));
addButtonListener("btnSq", () => unary(x => x * x));
addButtonListener("btnSqrt", () => unary(Math.sqrt));
addButtonListener("btn/", () => operation("/"));
addButtonListener("btn*", () => operation("*"));
addButtonListener("btn-", () => operation("-"));
addButtonListener("btn+", () => operation("+"));
addButtonListener("btn=", calc);
addButtonListener("btn%", () => {
    if (state.saved != null && state.operation != "" && state.saved2 == null) {
        if (state.operation == "+" || state.operation == "-")
            state.input = `${getNum(state.saved) / 100 * getNum(state.input)}`;
        else
            state.input = `${getNum(state.input) / 100}`;
        saveState();
        updateUI();
    }
});
const btnMC = addButtonListener("btnMC", () => {
    state.memory = null;
    saveState();
    updateUI();
});
const btnMR = addButtonListener("btnMR", () => {
    if (state.memory == null)
        return;
    state.input = state.memory;
    state.clearInputOnType = true;
    saveState();
    updateUI();
});
addButtonListener("btnM+", () => {
    if (state.memory == null)
        state.memory = "0";
    state.memory = `${getNum(state.memory) + getNum(state.input)}`;
    saveState();
    updateUI();
});
addButtonListener("btnM-", () => {
    if (state.memory == null)
        state.memory = "0";
    state.memory = `${getNum(state.memory) - getNum(state.input)}`;
    saveState();
    updateUI();
});
addButtonListener("btnMS", () => {
    state.memory = state.input;
    saveState();
    updateUI();
});
let state = loadState();
updateUI();
function digit(v) {
    if (state.input == "0" || state.clearInputOnType)
        state.input = `${v}`;
    else
        state.input = `${state.input}${v}`;
    state.clearInputOnType = false;
    saveState();
    updateUI();
    resultEl.parentElement?.scroll(resultEl.parentElement.scrollWidth, 0);
}
function operation(v) {
    if (!state.clearInputOnType)
        calc();
    state.saved = state.input;
    state.saved2 = null;
    state.operation = v;
    state.clearInputOnType = true;
    saveState();
    updateUI();
}
function unary(calcF) {
    state.input = `${calcF(getNum(state.input))}`;
    if (state.saved2 != null && state.clearInputOnType) {
        state.operation = "";
        state.saved2 = null;
        state.saved = null;
    }
    state.clearInputOnType = true;
    saveState();
    updateUI();
}
function calc() {
    if (state.saved == null || state.operation == "")
        return;
    if (state.saved2 != null && state.clearInputOnType)
        state.saved = state.input;
    else
        state.saved2 = state.input;
    state.input = `${{
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "/": (a, b) => a / b,
        "*": (a, b) => a * b,
    }[state.operation](getNum(state.saved), getNum(state.saved2))}`.replace(".", ",");
    state.clearInputOnType = true;
    saveState();
    updateUI();
    stateEl.parentElement?.scroll(stateEl.parentElement.scrollWidth, 0);
}
function getNum(num) {
    if (num === null)
        return 0;
    return parseFloat(num.replace(",", "."));
}
function updateUI() {
    if (state.saved === null)
        stateEl.innerText = "";
    else if (state.operation != "") {
        stateEl.innerText = state.saved + " " + {
            "+": "+",
            "-": "-",
            "/": "÷",
            "*": "×",
        }[state.operation];
        if (state.saved2 !== null)
            stateEl.innerText += " " + state.saved2 + " =";
    }
    else
        stateEl.innerText = state.saved;
    resultEl.innerText = state.input;
    const memEmpty = state.memory == null;
    btnMC.disabled = memEmpty;
    btnMR.disabled = memEmpty;
    memoryEl.innerText = memEmpty ? "" : `M: ${state.memory}`;
    resultEl.parentElement?.scroll(0, 0);
}
function loadState() {
    const stateStr = localStorage.getItem("calculator_state");
    if (stateStr)
        return JSON.parse(stateStr);
    return getCleanState();
}
function saveState() {
    localStorage.setItem("calculator_state", JSON.stringify(state));
}
function getCleanState() {
    return {
        input: "0",
        clearInputOnType: false,
        saved: null,
        saved2: null,
        operation: "",
        memory: null,
    };
}
