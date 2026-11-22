const display = document.getElementById("display");
const keys = document.querySelector(".keys");

let expression = "0";

function updateDisplay(value) {
  display.value = value;
}

function formatResult(value) {
  if (!Number.isFinite(value)) return "Ошибка";
  return String(Number.parseFloat(value.toPrecision(12)));
}

function calculate() {
  try {
    if (!/^\d+(\.\d*)?([+*/\-]\d+(\.\d*)?)*$/.test(expression)) {
      throw new Error("Неверное выражение");
    }

    const result = Function(`"use strict"; return (${expression})`)();
    expression = formatResult(result);
    updateDisplay(expression);
  } catch {
    expression = "0";
    updateDisplay("Ошибка");
  }
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (action === "clear") {
    expression = "0";
  } else if (action === "delete") {
    expression = expression.length > 1 ? expression.slice(0, -1) : "0";
  } else if (action === "percent") {
    const number = Number.parseFloat(expression);
    expression = Number.isFinite(number) ? String(number / 100) : "0";
  } else if (action === "equals") {
    calculate();
    return;
  } else if (value) {
    if (expression === "0" && /^\d$/.test(value)) {
      expression = value;
    } else if (expression === "Ошибка") {
      expression = /^\d$/.test(value) ? value : "0";
    } else {
      const isOperator = /^[+*/-]$/.test(value);
      const endsWithOperator = /^[+*/-]$/.test(expression.at(-1));

      if (isOperator && endsWithOperator) {
        expression = expression.slice(0, -1) + value;
      } else if (value === "." && expression.split(/[+*/-]/).at(-1).includes(".")) {
        return;
      } else {
        expression += value;
      }
    }
  }

  updateDisplay(expression);
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9+*/.-]$/.test(event.key)) {
    document.querySelector(`[data-value="${CSS.escape(event.key)}"]`)?.click();
  } else if (event.key === "Enter") {
    document.querySelector('[data-action="equals"]')?.click();
  } else if (event.key === "Backspace") {
    document.querySelector('[data-action="delete"]')?.click();
  } else if (event.key === "Escape") {
    document.querySelector('[data-action="clear"]')?.click();
  }
});
