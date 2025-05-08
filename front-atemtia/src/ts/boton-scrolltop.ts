import { ref, onMounted, onUnmounted } from "vue";

export function useBotonScroll() {
  const mostrarBotonScroll = ref(false);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleScroll() {
    mostrarBotonScroll.value = window.scrollY > 100;
  }

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  return { mostrarBotonScroll, scrollToTop };
}
