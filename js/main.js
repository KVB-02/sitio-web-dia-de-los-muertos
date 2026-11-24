
(() => {
  "use strict";

  // =====================================================
  // TRADUCCIONES DEL SITIO WEB
  // =====================================================
  // Se almacenan los textos en español, inglés y francés.
  // Cada idioma contiene los mensajes de bienvenida y
  // los nombres de las diferentes secciones del menú.

  const translations = {
    es: {
      morning: "¡Buenos días! Te damos la bienvenida a un recorrido por la tradición del Día de Muertos.",
      afternoon: "¡Buenas tardes! Descubre los colores, sabores y símbolos del Día de Muertos.",
      evening: "¡Buenas noches! Gracias por acercarte a esta tradición llena de memoria y significado.",
      menu: "Explorar", history: "Historia", altars: "Altares", food: "Gastronomía",
      about: "Acerca de", home: "Volver al inicio", language: "Idioma"
    },
    en: {
      morning: "Good morning! Welcome to a journey through Mexico's Day of the Dead tradition.",
      afternoon: "Good afternoon! Discover the colors, flavors and symbols of the Day of the Dead.",
      evening: "Good evening! Thank you for exploring this meaningful tradition of remembrance.",
      menu: "Explore", history: "History", altars: "Altars", food: "Food",
      about: "About", home: "Back to home", language: "Language"
    },
    fr: {
      morning: "Bonjour ! Bienvenue dans l'univers de la tradition mexicaine du Jour des morts.",
      afternoon: "Bon après-midi ! Découvrez les couleurs, les saveurs et les symboles du Jour des morts.",
      evening: "Bonsoir ! Merci de découvrir cette tradition pleine de mémoire et de sens.",
      menu: "Explorer", history: "Histoire", altars: "Autels", food: "Gastronomie",
      about: "À propos", home: "Retour à l'accueil", language: "Langue"
    }
  };

  // =====================================================
  // DETECCIÓN DEL MOMENTO DEL DÍA
  // =====================================================
  // Obtiene la hora actual del dispositivo y determina
  // si corresponde a la mañana, tarde o noche.

  const getPeriod = () => {
    const hour = new Date().getHours();

    return hour < 12
      ? "morning"
      : hour < 19
        ? "afternoon"
        : "evening";
  };

  // =====================================================
  // SELECCIÓN Y CAMBIO DE IDIOMA
  // =====================================================
  // Se identifican los elementos HTML donde se encuentra
  // el selector de idioma y el mensaje de bienvenida.

  const languageSelect = document.querySelector("#site-language");
  const welcome = document.querySelector("#welcome-message");

  // Recupera el idioma que el usuario seleccionó anteriormente.
  // Si no existe uno guardado, utiliza español por defecto.

  const currentLang = () => {
    const stored = localStorage.getItem("diaMuertosLanguage");
    return stored && translations[stored] ? stored : "es";
  };

  // Aplica el idioma seleccionado a los textos de la página.
  function applyLanguage(lang) {

    // Comprueba que el idioma seleccionado esté disponible.
    if (!translations[lang]) lang = "es";

    // Guarda la preferencia del usuario en el navegador.
    localStorage.setItem("diaMuertosLanguage", lang);

    // Actualiza el idioma declarado en el documento HTML.
    document.documentElement.lang = lang;

    // Actualiza el valor del selector de idioma.
    if (languageSelect) languageSelect.value = lang;

    // Muestra un mensaje de bienvenida según la hora del día.
    if (welcome) welcome.textContent = translations[lang][getPeriod()];

    // Busca todos los elementos HTML que tengan el atributo data-i18n.
    // Después reemplaza su contenido por el texto del idioma elegido.
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;

      if (translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
  }

  // Detecta cuando el usuario cambia el idioma en el selector.
  if (languageSelect) {
    languageSelect.addEventListener("change", (event) => {
      applyLanguage(event.target.value);
    });
  }

  // Al cargar la página, aplica el último idioma seleccionado.
  applyLanguage(currentLang());


  // =====================================================
  // MENÚ DESPLEGABLE
  // =====================================================
  // Permite mostrar y ocultar las opciones del menú.
  // Utiliza los eventos mouseover y mouseout para responder
  // cuando el usuario pasa el cursor o lo retira del menú.
  // También permite utilizar el menú mediante clic y teclado.

  document.querySelectorAll(".dropdown").forEach((dropdown) => {

    // Identifica el botón principal y el submenú.
    const trigger = dropdown.querySelector(".dropdown-toggle");
    const submenu = dropdown.querySelector(".dropdown-menu");

    // Si alguno de los elementos no existe, continúa con el siguiente menú.
    if (!trigger || !submenu) return;

    // Función para abrir el menú desplegable.
    const open = () => {
      dropdown.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    };

    // Función para cerrar el menú desplegable.
    const close = () => {
      dropdown.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    };

    // Abre el menú cuando el cursor pasa sobre él.
    dropdown.addEventListener("mouseover", open);

    // Cierra el menú cuando el cursor sale completamente de su área.
    dropdown.addEventListener("mouseout", (event) => {
      if (!dropdown.contains(event.relatedTarget)) close();
    });

    // Permite abrir o cerrar el menú al hacer clic.
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      dropdown.classList.contains("is-open") ? close() : open();
    });

    // Permite controlar el menú utilizando el teclado.
    trigger.addEventListener("keydown", (event) => {

      // La tecla Escape cierra el menú y devuelve el foco al botón.
      if (event.key === "Escape") {
        close();
        trigger.focus();
      }

      // Enter o espacio permiten abrir y cerrar el menú.
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        dropdown.classList.contains("is-open") ? close() : open();
      }
    });

    // Cierra el menú cuando el usuario hace clic fuera de él.
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) close();
    });
  });


  // =====================================================
  // SLIDER DE IMÁGENES
  // =====================================================
  // Permite visualizar diferentes imágenes de manera automática
  // y también mediante botones de navegación manual.

  const slider = document.querySelector(".hero-slider");

  // Comprueba que exista un slider en la página.
  if (slider) {

    // Obtiene todas las imágenes que forman parte del slider.
    const slides = Array.from(slider.querySelectorAll(".hero-slide"));

    // Identifica los botones para avanzar y retroceder.
    const previous = slider.querySelector(".slider-prev");
    const next = slider.querySelector(".slider-next");

    // Identifica el contenedor donde se mostrarán los indicadores.
    const dotsContainer = slider.querySelector(".slider-dots");

    // Guarda la posición de la imagen que se está mostrando.
    let activeIndex = 0;

    // Variable que almacena el temporizador del cambio automático.
    let intervalId;


    // =====================================================
    // MOSTRAR UNA IMAGEN
    // =====================================================
    // Cambia la imagen activa y actualiza los indicadores
    // para señalar cuál imagen está visible.

    const showSlide = (index) => {

      // Calcula la posición de la imagen y permite volver al inicio
      // cuando se llega a la última imagen.
      activeIndex = (index + slides.length) % slides.length;

      // Recorre todas las imágenes para mostrar solamente la activa.
      slides.forEach((slide, i) => {
        const active = i === activeIndex;

        // Agrega o elimina la clase que controla la imagen visible.
        slide.classList.toggle("is-active", active);

        // Indica si la imagen está visible o no.
        slide.setAttribute("aria-hidden", String(!active));
      });

      // Actualiza los puntos indicadores del slider.
      if (dotsContainer) {
        dotsContainer.querySelectorAll("button").forEach((dot, i) => {
          dot.classList.toggle("is-active", i === activeIndex);

          // Identifica cuál indicador corresponde a la imagen actual.
          dot.setAttribute(
            "aria-current",
            i === activeIndex ? "true" : "false"
          );
        });
      }
    };


    // =====================================================
    // CREACIÓN DE INDICADORES
    // =====================================================
    // Crea automáticamente un botón pequeño por cada imagen.
    // Estos botones permiten seleccionar una imagen directamente.

    if (dotsContainer) {
      slides.forEach((_, index) => {

        // Crea un nuevo botón indicador.
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "slider-dot";

        // Agrega una descripción para facilitar su identificación.
        dot.setAttribute("aria-label", `Mostrar imagen ${index + 1}`);

        // Al hacer clic, muestra la imagen correspondiente
        // y reinicia el cambio automático.
        dot.addEventListener("click", () => {
          showSlide(index);
          restart();
        });

        // Agrega el botón creado al contenedor de indicadores.
        dotsContainer.appendChild(dot);
      });
    }


    // =====================================================
    // CAMBIO AUTOMÁTICO DE IMÁGENES
    // =====================================================
    // Utiliza setInterval para cambiar de imagen cada cinco segundos.
    // clearInterval evita que se acumulen varios temporizadores.

    const restart = () => {
      window.clearInterval(intervalId);

      intervalId = window.setInterval(() => {
        showSlide(activeIndex + 1);
      }, 5000);
    };


    // =====================================================
    // NAVEGACIÓN MANUAL
    // =====================================================
    // Permite que el usuario avance o retroceda mediante los botones.

    previous?.addEventListener("click", () => {
      showSlide(activeIndex - 1);
      restart();
    });

    next?.addEventListener("click", () => {
      showSlide(activeIndex + 1);
      restart();
    });


    // =====================================================
    // CONTROL DEL SLIDER CON EL CURSOR
    // =====================================================
    // Pausa el cambio automático cuando el usuario coloca
    // el cursor sobre las imágenes y lo reanuda al retirarlo.

    slider.addEventListener("mouseenter", () => {
      window.clearInterval(intervalId);
    });

    slider.addEventListener("mouseleave", restart);


    // =====================================================
    // CONTROL CUANDO SE CAMBIA DE PESTAÑA
    // =====================================================
    // Detiene el slider cuando la página deja de estar visible
    // y lo reactiva cuando el usuario regresa a ella.

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.clearInterval(intervalId);
      } else {
        restart();
      }
    });

    // Muestra la primera imagen al cargar el slider.
    showSlide(0);

    // Inicia el cambio automático de imágenes.
    restart();
  }

})();
