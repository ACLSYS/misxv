# Invitación Digital XV — [Nombre]

Invitación digital estática (HTML + CSS + JS puro), **diseñada primero para móvil**.
Sin backend, sin base de datos, sin panel. Lista para GitHub Pages.

## Estructura

```
/invitacion-xv
├── index.html
├── /css   reset · variables · components · main
├── /js    main · animations · music · video · countdown · gallery · rsvp
├── /assets
│   ├── /images   hero.webp, gallery-01..03.webp, og.jpg
│   ├── /video    intro.mp4
│   ├── /audio    music.mp3
│   └── /icons
└── README.md
```

## Mobile-first: cómo está pensado

- Los estilos base son los del celular; tablet (600px) y escritorio (900px) solo se
  *agregan* con `min-width`.
- Alturas con `svh` para que no salte con la barra del navegador móvil.
- Zonas seguras (`safe-area-inset`) para el notch y la barra inferior del iPhone.
- Todos los botones y campos miden al menos 44–48px (cómodo para el dedo).
- Campos de texto a 16px para que iOS no haga zoom al escribir.
- Fotos y video: `preload` ligero, el video se pausa cuando no se ve y no se
  reproduce si el usuario tiene activado el ahorro de datos.
- La música se pausa sola si cambian de app o apagan la pantalla.
- Respeta "reducir movimiento" y el modo oscuro del teléfono.

## Qué falta llenar

Reemplaza los textos entre corchetes `[...]` en `index.html` (usa el checklist de datos).

- `js/countdown.js` → `FECHA_EVENTO` (fecha y hora reales)
- `js/rsvp.js` → `WHATSAPP_NUMERO` (con código de país, sin `+`, ej. `5219991234567`)
- `index.html` → enlaces "Ver mapa", playlist y datos de regalos

## Multimedia (recomendaciones para celular)

| Archivo | Recomendación |
|---|---|
| `assets/video/intro.mp4` | MP4 H.264, 720p, ~30 seg, idealmente menos de 5–8 MB |
| `assets/audio/music.mp3` | MP3 128 kbps |
| `assets/images/*.webp` | WebP, máx. ~1200px de ancho, menos de 200 KB c/u |
| `assets/images/og.jpg` | JPG 1200×630, es la vista previa al compartir por WhatsApp |

Para las fotos de la galería, cambia el texto `foto 1` por:
```html
<img src="assets/images/gallery-01.webp" alt="Descripción" loading="lazy" width="600" height="800">
```

En `index.html`, cambia `TUUSUARIO` en la etiqueta `og:image` por tu usuario real de GitHub.

## Links personalizados por invitado

El formulario permite máximo **4** asistentes por default. Para personalizar:

```
https://tuusuario.github.io/invitacion-xv/?invitado=Familia+Perez&pases=7
```

- `invitado=` → nombre que se muestra y se precarga en el formulario
- `pases=` → máximo de asistentes que puede elegir (tope de seguridad: 20)

Si el link no trae nada, cae en 4. El mensaje de WhatsApp incluye los pases del
link como referencia para ti.

## Deploy en GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub.
2. **Settings → Pages** → rama `main`, carpeta `/root`.
3. Queda en `https://tuusuario.github.io/invitacion-xv/` con HTTPS.

## Probar en celular

- En Chrome de escritorio: F12 → icono de dispositivo móvil → prueba 360px y 390px.
- Lo ideal: publicarlo y abrir el link en un teléfono real (iPhone y Android).
