/**
 * Renderizador del campo de fútbol 8
 * Dibuja la cancha con proporciones correctas (40m x 20m aproximadamente)
 */
export class FieldRenderer {
  private ctx: CanvasRenderingContext2D;
  private fieldColor = '#2d8a4e';
  private lineColor = '#ffffff';
  private lineWidth = 2;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se pudo obtener contexto 2D');
    this.ctx = context;
  }

  render(width: number, height: number): void {
    const ctx = this.ctx;

    // Fondo del campo
    ctx.fillStyle = this.fieldColor;
    ctx.fillRect(0, 0, width, height);

    // Patrón de césped (franjas)
    this.drawGrassPattern(width, height);

    // Configuración de líneas
    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Padding del campo
    const padding = Math.min(width, height) * 0.05;
    const fieldWidth = width - padding * 2;
    const fieldHeight = height - padding * 2;

    // Límites del campo
    ctx.strokeRect(padding, padding, fieldWidth, fieldHeight);

    // Línea central
    ctx.beginPath();
    ctx.moveTo(width / 2, padding);
    ctx.lineTo(width / 2, height - padding);
    ctx.stroke();

    // Círculo central
    const centerRadius = Math.min(fieldWidth, fieldHeight) * 0.12;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, centerRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Punto central
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = this.lineColor;
    ctx.fill();

    // Áreas de portería (ambos lados)
    this.drawGoalArea(padding, padding, fieldWidth, fieldHeight, 'left');
    this.drawGoalArea(padding, padding, fieldWidth, fieldHeight, 'right');

    // Arcos de esquina
    this.drawCornerArcs(padding, fieldWidth, fieldHeight, width, height);
  }

  private drawGrassPattern(width: number, height: number): void {
    const ctx = this.ctx;
    const stripeCount = 10;
    const stripeWidth = width / stripeCount;

    for (let i = 0; i < stripeCount; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.fillRect(i * stripeWidth, 0, stripeWidth, height);
      }
    }
  }

  private drawGoalArea(
    padding: number,
    top: number,
    fieldWidth: number,
    fieldHeight: number,
    side: 'left' | 'right'
  ): void {
    const ctx = this.ctx;

    // Proporciones del área (fútbol 8: área más pequeña)
    const areaWidth = fieldWidth * 0.12;
    const areaHeight = fieldHeight * 0.45;
    const areaTop = top + (fieldHeight - areaHeight) / 2;

    // Área pequeña
    const smallAreaWidth = fieldWidth * 0.06;
    const smallAreaHeight = fieldHeight * 0.25;
    const smallAreaTop = top + (fieldHeight - smallAreaHeight) / 2;

    if (side === 'left') {
      // Área grande
      ctx.strokeRect(padding, areaTop, areaWidth, areaHeight);
      // Área pequeña
      ctx.strokeRect(padding, smallAreaTop, smallAreaWidth, smallAreaHeight);
      // Punto penal
      const penaltyX = padding + areaWidth * 0.7;
      ctx.beginPath();
      ctx.arc(penaltyX, top + fieldHeight / 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.lineColor;
      ctx.fill();
    } else {
      const rightEdge = padding + fieldWidth;
      // Área grande
      ctx.strokeRect(rightEdge - areaWidth, areaTop, areaWidth, areaHeight);
      // Área pequeña
      ctx.strokeRect(rightEdge - smallAreaWidth, smallAreaTop, smallAreaWidth, smallAreaHeight);
      // Punto penal
      const penaltyX = rightEdge - areaWidth * 0.7;
      ctx.beginPath();
      ctx.arc(penaltyX, top + fieldHeight / 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.lineColor;
      ctx.fill();
    }
  }

  private drawCornerArcs(
    padding: number,
    fieldWidth: number,
    fieldHeight: number,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const ctx = this.ctx;
    const cornerRadius = Math.min(fieldWidth, fieldHeight) * 0.03;

    // Esquina superior izquierda
    ctx.beginPath();
    ctx.arc(padding, padding, cornerRadius, 0, Math.PI / 2);
    ctx.stroke();

    // Esquina superior derecha
    ctx.beginPath();
    ctx.arc(canvasWidth - padding, padding, cornerRadius, Math.PI / 2, Math.PI);
    ctx.stroke();

    // Esquina inferior izquierda
    ctx.beginPath();
    ctx.arc(padding, canvasHeight - padding, cornerRadius, -Math.PI / 2, 0);
    ctx.stroke();

    // Esquina inferior derecha
    ctx.beginPath();
    ctx.arc(canvasWidth - padding, canvasHeight - padding, cornerRadius, Math.PI, Math.PI * 1.5);
    ctx.stroke();
  }
}
