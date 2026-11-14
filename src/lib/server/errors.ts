import { ApiError } from "$lib/server/api";

export function errorFields(error: unknown): Record<string, string> {
	if (error instanceof ApiError) {
		return error.fields ?? { general: error.message };
	}
	return {
		general: error instanceof Error ? error.message : "Error inesperado",
	};
}

export function messageOf(error: unknown): string {
	return error instanceof Error ? error.message : "Error inesperado";
}
