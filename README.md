# Futbolle

Proyecto final individual de la materia Desarrollo y Arquitecturas Web (UAI, 2026).

Es un juego para adivinar futbolistas, con la misma mecánica de Wordle: al arrancar la partida se elige un jugador "secreto" al azar, y hay que adivinar de quién se trata en 8 intentos como máximo, escribiendo nombres en un buscador con autocompletado.

## Cómo se juega

1. Al entrar, se pide un nombre para identificar al jugador humano.
2. Empieza la partida y se elige un futbolista secreto al azar.
3. En el buscador se escribe el nombre de un futbolista y se elige uno de la lista que aparece.
4. Por cada intento, el tablero muestra si el jugador secreto comparte nacionalidad, club y posición con el intento (verde si coincide, rojo si no), y si tiene la misma edad, overall o altura, o si el secreto es mayor/menor en cada uno de esos valores (con una flecha).
5. Se gana si se adivina el nombre correcto antes de agotar los 8 intentos. Si se acaban los intentos, se pierde y se muestra quién era el jugador secreto.
6. Se puede reiniciar la partida en cualquier momento sin recargar la página, para jugar contra un nuevo jugador secreto.

Los datos de los jugadores (nombre, club, nacionalidad, foto, etc.) se piden a un servicio provisto por la cátedra, no están guardados dentro del proyecto.

## Jugar

El juego está publicado con GitHub Pages en:

`https://renzocampisi.github.io/final-daw-2026/`

## Página de contacto

Además del juego, hay una página de contacto con un formulario para dejar nombre, mail y un mensaje. Al enviarlo se abre el programa de mail que tengas configurado en tu computadora, con el mensaje ya cargado.

## Modo oscuro

Arriba a la derecha, en la barra de navegación, hay un botón para cambiar entre modo claro y oscuro. La elección queda guardada en el navegador, así que se mantiene aunque se recargue la página o se cambie entre el juego y la página de contacto.

## Cómo está organizado el proyecto

```
index.html          pantalla principal: bienvenida y juego
contacto.html        formulario de contacto
css/
  reset.css          normaliza estilos base entre navegadores
  estilos.css        estilos del sitio (layout, colores, responsive)
js/
  api.js             pedidos al servicio de jugadores
  juego.js           reglas del juego: comparar jugadores, estado de la partida
  interfaz.js        todo lo que se dibuja en pantalla (tablero, modales, autocompletado)
  eventos.js         qué pasa cuando el usuario hace click o escribe
  init.js            arranque de la página principal
  contacto.js        validación y envío del formulario de contacto
  tema.js            botón de modo oscuro/claro, se guarda en LocalStorage
img/                 imágenes propias del sitio
```

## Tecnologías

Hecho solo con HTML, CSS y JavaScript, sin librerías ni frameworks. El JavaScript está escrito en una versión clásica del lenguaje (ES5) a propósito, como pide la consigna de la materia.

## Autor

Renzo Campisi — Desarrollo y Arquitecturas Web, UAI.
