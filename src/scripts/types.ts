/** Coordenadas de posición en el campo (basadas en porcentaje para responsividad) */
export interface Position {
  x: number; // 0-100 porcentaje del ancho del campo
  y: number; // 0-100 porcentaje del alto del campo
}

/** Roles de jugador para fútbol 8 */
export type PlayerRole = 'GK' | 'DEF' | 'MID' | 'FWD' | 'SUB';

/** Datos de un jugador individual */
export interface Player {
  id: string;
  name: string;
  number: number;
  role: PlayerRole;
  position: Position;
  color: string;
  isOnField: boolean;
}

/** Tipos de elementos de dibujo */
export type DrawingType = 'arrow' | 'dashed' | 'curved' | 'line';

/** Elemento de dibujo individual (flecha, línea, etc.) */
export interface DrawingElement {
  id: string;
  type: DrawingType;
  points: Position[];
  color: string;
  thickness: number;
}

/** Formación/jugada completa */
export interface Formation {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  players: Player[];
  drawings: DrawingElement[];
}

/** Herramientas disponibles */
export type Tool = 'select' | 'arrow' | 'dashed' | 'curved' | 'eraser';

/** Estado de la aplicación */
export interface AppState {
  currentFormation: Formation;
  savedFormations: Formation[];
  selectedTool: Tool;
  selectedPlayerId: string | null;
  isDrawing: boolean;
  drawColor: string;
}

/** Abstracción de evento de puntero (mouse + touch) */
export interface PointerData {
  x: number;
  y: number;
  pointerId: number;
  type: 'mouse' | 'touch';
}
