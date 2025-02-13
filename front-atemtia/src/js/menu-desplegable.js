export function abrirMenuIzquierda() {
    const contenedor = document.querySelector('.desplegable-izquierda');
    const menu = document.querySelector('.nav-izquierda');
    const boton = document.querySelector('.btn-menudesplegable');
    const barras = document.querySelectorAll('.bar-izquierda');

    contenedor.classList.toggle('active');
    menu.classList.toggle('active');

    if (contenedor.classList.contains('active')) {
        boton.style.left = menu.offsetWidth + 'px';
        barras[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        barras[1].style.opacity = '0';
        barras[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        document.addEventListener('click', cerrarMenuFuera);
    } else {
        boton.style.left = '0';
        barras[0].style.transform = 'rotate(0) translate(0, 0)';
        barras[1].style.opacity = '1';
        barras[2].style.transform = 'rotate(0) translate(0, 0)';
        document.removeEventListener('click', cerrarMenuFuera);
    }
}

function cerrarMenuFuera(event) {
    const menu = document.querySelector('.nav-izquierda');
    const boton = document.querySelector('.btn-menudesplegable');
    const barras = document.querySelectorAll('.bar-izquierda');

    if (!menu.contains(event.target) && !boton.contains(event.target)) {
        const contenedor = document.querySelector('.desplegable-izquierda');
        contenedor.classList.remove('active');
        menu.classList.remove('active');
        boton.style.left = '0';
        barras[0].style.transform = 'rotate(0) translate(0, 0)';
        barras[1].style.opacity = '1';
        barras[2].style.transform = 'rotate(0) translate(0, 0)';
        document.removeEventListener('click', cerrarMenuFuera);
    }
}
