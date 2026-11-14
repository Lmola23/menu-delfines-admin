/**
 * Normaliza texto para búsquedas: quita acentos, ignora mayúsculas y colapsa
 * espacios. Es isomorfa (sin APIs de Node ni del DOM) para poder usarla en el
 * servidor y replicar la misma lógica en el script del navegador.
 */
export function normalize(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/\s+/g, " ")
		.trim();
}
