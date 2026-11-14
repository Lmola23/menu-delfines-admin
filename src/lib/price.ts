// Los platos con dos raciones guardan ambos precios en el detalle. El precio
// base sigue siendo el de la ración menor para ordenar y filtrar en la API.
const RATION_RANGE =
	/Ración de 5(?: unidades)?:\s*(\d+)\s*CUP[\s\S]*?Ración de 10(?: unidades)?:\s*(\d+)\s*CUP/i;

export function priceValue(price: number, detail: string): string {
	const match = detail.match(RATION_RANGE);
	return match ? `${match[1]}-${match[2]}` : `${price}`;
}
