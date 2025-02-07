export function getButton(id) {
    return getEl(id, HTMLButtonElement);
}
export function getSpan(id) {
    return getEl(id, HTMLSpanElement);
}
export function getEl(id, type) {
    const el = document.getElementById(id);
    if (el == null)
        throw new Error(`${id} not found`);
    if (el instanceof type)
        return el;
    throw new Error(`${id} element not ${type.name}`);
}
export function addButtonListener(id, f) {
    const button = getButton(id);
    button.addEventListener("click", e => f(e, button));
    return button;
}
