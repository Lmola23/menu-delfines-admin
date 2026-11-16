# menu-delfines-admin

Panel de administración móvil (SvelteKit) para la API de Delfines.

El dominio de la API está fijado en `src/lib/config.ts`
(`https://menu.huellasalrescate.org`); no usa variables de entorno.

Las fotos se suben, reemplazan y quitan desde la ficha del producto. El
formulario multipart va directo al API (no pasa por Vercel) y este guarda la
foto en ImageKit y redirige de vuelta con `foto=ok`. La clave privada de
ImageKit vive solo en el servidor.

La sección `/categorias` permite crear, renombrar y reordenar categorías. Es la
única ruta con hidratación porque usa `svelte-dnd-action`; el resto del admin
sigue siendo SSR sin JavaScript.
