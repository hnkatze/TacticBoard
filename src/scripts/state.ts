import type { AppState, Formation, Player, DrawingElement, Tool, Position } from './types';

type Subscriber = () => void;

/**
 * Clase para manejar el estado global de la aplicación
 * Implementa un patrón simple de pub/sub para reactividad
 */
class AppStateManager {
  private state: AppState;
  private subscribers: Subscriber[] = [];

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): AppState {
    return {
      currentFormation: this.createDefaultFormation(),
      savedFormations: [],
      selectedTool: 'select',
      selectedPlayerId: null,
      isDrawing: false,
      drawColor: '#ef4444',
    };
  }

  private createDefaultFormation(): Formation {
    return {
      id: this.generateId(),
      name: 'Nueva Formación',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      players: this.createDefaultPlayers(),
      drawings: [],
    };
  }

  private createDefaultPlayers(): Player[] {
    // Formación 3-3-1 típica de fútbol 8
    const positions: Array<{ role: Player['role']; x: number; y: number; color: string }> = [
      // Portero
      { role: 'GK', x: 8, y: 50, color: '#f59e0b' },
      // Defensas
      { role: 'DEF', x: 25, y: 25, color: '#3b82f6' },
      { role: 'DEF', x: 25, y: 50, color: '#3b82f6' },
      { role: 'DEF', x: 25, y: 75, color: '#3b82f6' },
      // Mediocampistas
      { role: 'MID', x: 50, y: 20, color: '#3b82f6' },
      { role: 'MID', x: 50, y: 50, color: '#3b82f6' },
      { role: 'MID', x: 50, y: 80, color: '#3b82f6' },
      // Delantero
      { role: 'FWD', x: 75, y: 50, color: '#3b82f6' },
    ];

    return positions.map((pos, i) => ({
      id: this.generateId(),
      name: `Jugador ${i + 1}`,
      number: i + 1,
      role: pos.role,
      position: { x: pos.x, y: pos.y },
      color: pos.color,
      isOnField: true,
    }));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  // Obtener estado actual
  get(): AppState {
    return this.state;
  }

  // Suscribirse a cambios
  subscribe(fn: Subscriber): () => void {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== fn);
    };
  }

  // Notificar a todos los suscriptores
  private notify(): void {
    this.subscribers.forEach((fn) => fn());
  }

  // === ACCIONES ===

  // Actualizar posición de un jugador
  updatePlayerPosition(playerId: string, position: Position): void {
    const player = this.state.currentFormation.players.find((p) => p.id === playerId);
    if (player) {
      player.position = position;
      this.state.currentFormation.updatedAt = new Date().toISOString();
      this.notify();
    }
  }

  // Seleccionar jugador
  selectPlayer(playerId: string | null): void {
    this.state.selectedPlayerId = playerId;
    this.notify();
  }

  // Cambiar herramienta
  setTool(tool: Tool): void {
    this.state.selectedTool = tool;
    this.notify();
  }

  // Cambiar color de dibujo
  setDrawColor(color: string): void {
    this.state.drawColor = color;
    this.notify();
  }

  // Agregar dibujo
  addDrawing(drawing: DrawingElement): void {
    this.state.currentFormation.drawings.push(drawing);
    this.state.currentFormation.updatedAt = new Date().toISOString();
    this.notify();
  }

  // Eliminar dibujo por ID
  removeDrawing(drawingId: string): void {
    this.state.currentFormation.drawings = this.state.currentFormation.drawings.filter(
      (d) => d.id !== drawingId
    );
    this.notify();
  }

  // Limpiar todos los dibujos
  clearDrawings(): void {
    this.state.currentFormation.drawings = [];
    this.notify();
  }

  // Actualizar datos de jugador
  updatePlayer(playerId: string, updates: Partial<Player>): void {
    const player = this.state.currentFormation.players.find((p) => p.id === playerId);
    if (player) {
      Object.assign(player, updates);
      this.state.currentFormation.updatedAt = new Date().toISOString();
      this.notify();
    }
  }

  // Crear nueva formación
  newFormation(): void {
    this.state.currentFormation = this.createDefaultFormation();
    this.state.selectedPlayerId = null;
    this.notify();
  }

  // Cargar formación
  loadFormation(formation: Formation): void {
    this.state.currentFormation = { ...formation };
    this.state.selectedPlayerId = null;
    this.notify();
  }

  // Establecer nombre de formación
  setFormationName(name: string): void {
    this.state.currentFormation.name = name;
    this.state.currentFormation.updatedAt = new Date().toISOString();
    this.notify();
  }

  // Establecer formaciones guardadas (desde localStorage)
  setSavedFormations(formations: Formation[]): void {
    this.state.savedFormations = formations;
    this.notify();
  }

  // Estado de dibujo
  setIsDrawing(isDrawing: boolean): void {
    this.state.isDrawing = isDrawing;
  }

  // Agregar un nuevo jugador
  addPlayer(player: Player): void {
    this.state.currentFormation.players.push(player);
    this.state.currentFormation.updatedAt = new Date().toISOString();
    this.notify();
  }

  // Eliminar un jugador
  removePlayer(playerId: string): void {
    this.state.currentFormation.players = this.state.currentFormation.players.filter(
      (p) => p.id !== playerId
    );
    if (this.state.selectedPlayerId === playerId) {
      this.state.selectedPlayerId = null;
    }
    this.state.currentFormation.updatedAt = new Date().toISOString();
    this.notify();
  }
}

// Exportar instancia singleton
export const state = new AppStateManager();
