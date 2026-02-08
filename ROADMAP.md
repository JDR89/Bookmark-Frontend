# Roadmap

## Fase 1: Pulir el Producto (Modo "Demo")
Objetivo: Que la UI y la UX sean perfectas usando datos locales.

Itera sobre el Store actual: Sigue usando zustand y los datos mock. Modifica la estructura de los tags, implementa las acciones que faltan en los botones (Editar, Borrar real, Compartir).
Persistencia Local: Agrega el middleware persist de Zustand.
¿Por qué? Esto transforma tu versión "mock" en una App Funcional Local. Un usuario puede entrar a tu demo, crear bookmarks, recargar la página y seguirán ahí (guardados en su navegador). Cumple 100% tu objetivo de "mostrar el producto".



## Fase 2: Abstracción de Datos (El puente)
Objetivo: Preparar el terreno para el backend sin romper la demo.

Crea un Service Layer: En lugar de que el Store manipule arrays directamente, abstracte las llamadas.
Ejemplo: BookmarksService.getAll(), BookmarksService.add(b).
Tendrás dos implementaciones:
LocalBookmarksService: (Lo que tienes ahora + LocalStorage).
ApiBookmarksService: (Lo que conectarás a tu base de datos).



## Fase 3: Backend Real (Modo "Pro")
Objetivo: Tu versión personal con base de datos.

Elige tu Backend: Para este stack (Next.js), Supabase o Convex son ideales. Te dan base de datos real + Auth + API con muy poco esfuerzo.
Auth Toggle:
Si el usuario NO está logueado -> Usa LocalBookmarksService (Modo Demo).
Si el usuario SÍ está logueado -> Usa ApiBookmarksService (Tus datos reales).