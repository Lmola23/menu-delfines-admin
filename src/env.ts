import { defineEnvVars } from "@sveltejs/kit/env";

// Variables de entorno tipadas. `API_URL` es privada (solo servidor) y se lee
// en tiempo de ejecución, por lo que se puede cambiar en Vercel sin rebuild.
export const variables = defineEnvVars({
	API_URL: {
		description: "URL de la API de Go",
		// En producción se usa el dominio público. En local, `.env` define
		// API_URL=http://127.0.0.1:8080 y tiene prioridad.
		schema: (value) => value || "https://menu.huellasalrecate.org",
	},
});
