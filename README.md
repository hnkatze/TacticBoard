# TacticBoard

Tablero táctico interactivo para entrenadores de fútbol 8 (fútbol sintético).

## Características

- **Campo de fútbol 8** - Canvas interactivo con proporciones correctas
- **Jugadores arrastrables** - Tokens con número, nombre y color personalizable
- **Dibujo de jugadas** - Flechas sólidas y punteadas para planificar movimientos
- **Gestión de roster** - Agregar, editar y eliminar jugadores
- **Formaciones** - Guardar y cargar múltiples formaciones
- **Persistencia local** - Todo se guarda en localStorage
- **Responsive** - Funciona en desktop, tablet y móvil

## Stack Tecnológico

- [Astro 5](https://astro.build/) - Framework web
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [Tailwind CSS 4](https://tailwindcss.com/) - Estilos utilitarios
- Canvas API - Renderizado del campo y jugadores

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/hnkatze/TacticBoard.git
cd TacticBoard

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |

## Uso

1. **Agregar jugadores** - Click en "Añadir" en el panel izquierdo
2. **Mover jugadores** - Arrastra los tokens en el campo
3. **Editar jugador** - Cambia nombre, número, color o posición en el roster
4. **Dibujar jugadas** - Selecciona "Flecha" o "Punteada" y dibuja en el campo
5. **Guardar formación** - Click en "Guardar" para persistir la formación actual

## Estructura del Proyecto

```
src/
├── components/
│   ├── FieldCanvas.astro    # Canvas del campo (2 capas)
│   └── RosterPanel.astro    # Panel de jugadores
├── scripts/
│   ├── field-renderer.ts    # Dibujo del campo
│   ├── player-manager.ts    # Gestión de tokens
│   ├── state.ts             # Estado global
│   ├── storage.ts           # localStorage
│   └── touch-handler.ts     # Mouse + touch
├── pages/
│   └── index.astro          # Página principal
└── styles/
    └── global.css           # Estilos globales
```

## Licencia

[MIT](LICENSE)
