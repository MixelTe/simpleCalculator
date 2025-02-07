export function getButton(id: string)
{
	return getEl(id, HTMLButtonElement);
}
export function getSpan(id: string)
{
	return getEl(id, HTMLSpanElement);
}
export function getEl<T extends typeof HTMLElement>(id: string, type: T)
{
	const el = <unknown | null>document.getElementById(id);
	if (el == null) throw new Error(`${id} not found`);
	if (el instanceof type) return el as InstanceType<T>;
	throw new Error(`${id} element not ${type.name}`);
}

export function addButtonListener(id: string, f: (e: MouseEvent, btn: HTMLButtonElement) => void)
{
	const button = getButton(id);
	button.addEventListener("click", e => f(e, button));
	return button;
}
