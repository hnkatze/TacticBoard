import type { Player, Position } from './types';

/**
 * Manejador de tokens de jugadores en el canvas
 * Se encarga de renderizar los jugadores y detectar hits
 */
export class PlayerManager {
  private ctx: CanvasRenderingContext2D;
  private players: Player[] = [];
  private selectedId: string | null = null;
  private canvasWidth = 0;
  private canvasHeight = 0;
  private tokenRadius = 20;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se pudo obtener contexto 2D');
    this.ctx = context;
  }

  // Actualizar lista de jugadores
  setPlayers(players: Player[]): void {
    this.players = players.filter((p) => p.isOnField);
  }

  // Establecer jugador seleccionado
  setSelectedId(id: string | null): void {
    this.selectedId = id;
  }

  // Actualizar dimensiones del canvas
  setDimensions(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
    // Ajustar tamaño del token según el tamaño del canvas
    this.tokenRadius = Math.min(width, height) * 0.04;
    this.tokenRadius = Math.max(15, Math.min(this.tokenRadius, 30));
  }

  // Renderizar todos los jugadores
  render(): void {
    // No limpiar aquí - se hace en el compositor principal
    for (const player of this.players) {
      this.drawToken(player);
    }
  }

  // Dibujar un token de jugador
  private drawToken(player: Player): void {
    const { x, y } = this.percentToPixel(player.position);
    const ctx = this.ctx;
    const radius = this.tokenRadius;
    const isSelected = player.id === this.selectedId;

    // Sombra
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Círculo del token
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.restore();

    // Borde
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (isSelected) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
    } else {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
    }
    ctx.stroke();

    // Número del jugador
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${radius * 0.8}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(player.number), x, y);

    // Indicador de posición (debajo del token)
    ctx.font = `${radius * 0.5}px system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(player.role, x, y + radius + 12);

    // Nombre del jugador (debajo del rol)
    ctx.font = `bold ${radius * 0.45}px system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    // Truncar nombre si es muy largo
    const displayName = player.name.length > 10 ? player.name.slice(0, 9) + '…' : player.name;
    ctx.fillText(displayName, x, y + radius + 26);
  }

  // Detectar si un punto toca un jugador
  hitTest(pixelX: number, pixelY: number): Player | null {
    // Buscar desde arriba (último dibujado) hacia abajo
    for (let i = this.players.length - 1; i >= 0; i--) {
      const player = this.players[i];
      const { x, y } = this.percentToPixel(player.position);
      const distance = Math.hypot(pixelX - x, pixelY - y);

      if (distance <= this.tokenRadius + 5) {
        // +5 para facilitar el touch
        return player;
      }
    }
    return null;
  }

  // Convertir porcentaje a píxeles
  private percentToPixel(pos: Position): { x: number; y: number } {
    return {
      x: (pos.x / 100) * this.canvasWidth,
      y: (pos.y / 100) * this.canvasHeight,
    };
  }

  // Convertir píxeles a porcentaje
  pixelToPercent(x: number, y: number): Position {
    return {
      x: (x / this.canvasWidth) * 100,
      y: (y / this.canvasHeight) * 100,
    };
  }

  // Obtener radio del token para cálculos externos
  getTokenRadius(): number {
    return this.tokenRadius;
  }
}
