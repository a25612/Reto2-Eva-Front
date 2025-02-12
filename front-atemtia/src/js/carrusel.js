export default function iniciarCarrusel() {
    const contenedor = document.querySelector('.carrusel-container');
    const thumb = document.querySelector('.carrusel-scrollbar');
    const scrollbar = document.querySelector('.carrusel-scroll');

    // Sincronizar el movimiento del carrusel con la barra
    contenedor.addEventListener('scroll', () => {
        const scrollPercentage = contenedor.scrollLeft / (contenedor.scrollWidth - contenedor.clientWidth);
        thumb.style.transform = `translateX(${scrollPercentage * (scrollbar.clientWidth - thumb.clientWidth)}px)`;
    });

    // Arrastre del pulgar para mover el carrusel
    let isDragging = false;
    let startX;

    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        document.body.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.cursor = 'default';
    });
}
