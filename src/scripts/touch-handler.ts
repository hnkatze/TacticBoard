import type { PointerData } from './types';

type PointerCallback = (data: PointerData) => void;

interface TouchHandlerCallbacks {
  onStart: PointerCallback;
  onMove: PointerCallback;
  onEnd: PointerCallback;
}

/**
 * Manejador unificado de eventos de mouse y touch
 * Normaliza los eventos para que el resto de la aplicación no tenga que preocuparse
 * por las diferencias entre dispositivos
 */
export class TouchHandler {
  private element: HTMLElement;
  private onStart: PointerCallback;
  private onMove: PointerCallback;
  private onEnd: PointerCallback;
  private activePointer: number | null = null;
  private isMouseDown = false;

  constructor(element: HTMLElement, callbacks: TouchHandlerCallbacks) {
    this.element = element;
    this.onStart = callbacks.onStart;
    this.onMove = callbacks.onMove;
    this.onEnd = callbacks.onEnd;

    this.bindEvents();
  }

  private bindEvents(): void {
    // Mouse events
    this.element.addEventListener('mousedown', this.handleMouseDown);
    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('mouseup', this.handleMouseUp);
    this.element.addEventListener('mouseleave', this.handleMouseLeave);

    // Touch events
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd);
    this.element.addEventListener('touchcancel', this.handleTouchEnd);
  }

  // === MOUSE HANDLERS ===

  private handleMouseDown = (e: MouseEvent): void => {
    // Ignorar si hay un touch activo
    if (this.activePointer !== null) return;

    this.isMouseDown = true;
    const data = this.getMouseData(e);
    this.onStart(data);
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.isMouseDown) return;

    const data = this.getMouseData(e);
    this.onMove(data);
  };

  private handleMouseUp = (e: MouseEvent): void => {
    if (!this.isMouseDown) return;

    this.isMouseDown = false;
    const data = this.getMouseData(e);
    this.onEnd(data);
  };

  private handleMouseLeave = (e: MouseEvent): void => {
    if (!this.isMouseDown) return;

    this.isMouseDown = false;
    const data = this.getMouseData(e);
    this.onEnd(data);
  };

  private getMouseData(e: MouseEvent): PointerData {
    const rect = this.element.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pointerId: 0,
      type: 'mouse',
    };
  }

  // === TOUCH HANDLERS ===

  private handleTouchStart = (e: TouchEvent): void => {
    e.preventDefault(); // Prevenir scroll y zoom

    // Solo manejar el primer touch
    if (this.activePointer !== null) return;

    const touch = e.touches[0];
    this.activePointer = touch.identifier;

    const data = this.getTouchData(touch);
    this.onStart(data);
  };

  private handleTouchMove = (e: TouchEvent): void => {
    e.preventDefault();

    const touch = this.findActiveTouch(e.touches);
    if (!touch) return;

    const data = this.getTouchData(touch);
    this.onMove(data);
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    const touch = this.findActiveTouch(e.changedTouches);
    if (!touch) return;

    const data = this.getTouchData(touch);
    this.onEnd(data);
    this.activePointer = null;
  };

  private getTouchData(touch: Touch): PointerData {
    const rect = this.element.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      pointerId: touch.identifier,
      type: 'touch',
    };
  }

  private findActiveTouch(touches: TouchList): Touch | null {
    for (let i = 0; i < touches.length; i++) {
      if (touches[i].identifier === this.activePointer) {
        return touches[i];
      }
    }
    return null;
  }

  // Limpiar eventos al destruir
  destroy(): void {
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('mouseup', this.handleMouseUp);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);

    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchEnd);
  }
}
