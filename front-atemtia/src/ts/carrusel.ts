export function iniciarCarrusel() {
    const contenedor = document.querySelector('.carrusel-container') as HTMLElement;
    const scrollbar = document.querySelector('.carrusel-scrollbar') as HTMLElement;
    const scroll = document.querySelector('.carrusel-scroll') as HTMLElement;
  
    // Sincronizar el movimiento del carrusel con la barra
    contenedor.addEventListener('scroll', () => {
      const scrollPercentage = contenedor.scrollLeft / (contenedor.scrollWidth - contenedor.clientWidth);
      scrollbar.style.transform = `translateX(${scrollPercentage * (scroll.clientWidth - scrollbar.clientWidth)}px)`;
    });
  
    // Arrastre del pulgar para mover el carrusel
    let isDragging = false;
    let startX: number;
  
    scrollbar.addEventListener('mousedown', (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      document.body.style.cursor = 'grabbing';
    });
  
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.style.cursor = 'default';
    });
  }
  