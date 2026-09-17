const CONFIG = {

  nombre: "Mi Gigi💕",

  nombreFirma: "Gigi💕",

  mensajeInicial:
    "Hay algo para ti 💛",

  titulo:
    "Feliz día de las flores amarillas",

  mensajeFinal:
    "Este ramo es para ti 💛",

  carta:
    "Dicen que regalar flores amarillas significa que esa persona ilumina tus días... pero si te soy sincero, esto es más bien una pequeña indirecta para recordarte lo mucho que me encantas y que no sales de mi cabeza. ¿Aceptas la indirecta? 🙈💗",

  musica:
    "./assets/audio/music.mp3"
};



const SVG_NS =
  "http://www.w3.org/2000/svg";


const $ = (selector) =>
  document.querySelector(selector);


const experience =
  $("#experience");

const intro =
  $("#intro");

const music =
  $("#music");


let started = false;



/* ==================================================
   POSICIONES DE LOS GIRASOLES
   ==================================================

   d = momento en el que aparece la flor.

   Las flores aparecen progresivamente desde
   el centro hacia los extremos del ramo.
*/

const flowerLayout = [

  // Superior central (flor principal)
  {
    x: 195,
    y: 150,
    r: 56,
    lean: -4,
    d: 1.45
  },

  // Superior izquierda
  {
    x: 130,
    y: 220,
    r: 48,
    lean: -8,
    d: 1.58
  },

  // Superior derecha
  {
    x: 262,
    y: 222,
    r: 49,
    lean: 7,
    d: 1.70
  },

  // Centro
  {
    x: 194,
    y: 280,
    r: 48,
    lean: 1,
    d: 1.82
  },

  // Lateral izquierdo
  {
    x: 112,
    y: 310,
    r: 40,
    lean: -11,
    d: 1.95
  },

  // Lateral derecho
  {
    x: 278,
    y: 308,
    r: 39,
    lean: 11,
    d: 2.08
  },

  // Inferior izquierda
  {
    x: 156,
    y: 357,
    r: 35,
    lean: -5,
    d: 2.20
  },

  // Inferior derecha
  {
    x: 238,
    y: 363,
    r: 33,
    lean: 7,
    d: 2.32
  },

  // Flores de relleno para conseguir un ramo abundante
  {
    x: 165,
    y: 205,
    r: 34,
    lean: -3,
    d: 1.52
  },
  {
    x: 229,
    y: 190,
    r: 36,
    lean: 5,
    d: 1.64
  },
  {
    x: 88,
    y: 258,
    r: 34,
    lean: -14,
    d: 1.76
  },
  {
    x: 302,
    y: 260,
    r: 34,
    lean: 14,
    d: 1.88
  },
  {
    x: 196,
    y: 344,
    r: 34,
    lean: 0,
    d: 2.14
  }

];



/* ==================================================
   CREAR ELEMENTOS SVG
   ================================================== */

function svgEl(tag, attrs = {}) {

  const element =
    document.createElementNS(
      SVG_NS,
      tag
    );


  Object.entries(attrs)
    .forEach(([key, value]) => {

      element.setAttribute(
        key,
        value
      );

    });


  return element;

}



/* ==================================================
   CREAR RAMO
   ================================================== */

function buildBouquet() {

  const stems =
    $("#stems");

  const leaves =
    $("#leaves");

  const flowers =
    $("#flowers");


  flowerLayout.forEach(
    (flowerData, index) => {


      /* ==============================
         TALLO
         ============================== */

      const stem =
        svgEl(
          "path",
          {

            d: `
              M 195 500
              Q
              ${190 + (flowerData.x - 195) * .22}
              390
              ${flowerData.x}
              ${flowerData.y + 14}
            `

          }
        );


      stem.style.setProperty(
        "--delay",
        `${0.60 + index * .07}s`
      );


      stems.append(stem);



      /* ==============================
         HOJA
         ============================== */

      const leafCount = index < 4 ? 2 : 1;

      for (let leafIndex = 0; leafIndex < leafCount; leafIndex++) {
        const side = (index + leafIndex) % 2 ? -1 : 1;
        const leafX = 195 + (flowerData.x - 195) * (.35 + leafIndex * .17);
        const leafY = 392 - index * 10 - leafIndex * 47;
        const positionedLeaf = svgEl("g", {
          transform: `translate(${leafX} ${leafY})`
        });
        const leaf = svgEl("g", {
          class: `leaf leaf--${side > 0 ? "right" : "left"}`
        });

        leaf.style.setProperty("--delay", `${1.15 + index * .12 + leafIndex * .18}s`);
        leaf.style.setProperty("--rot", `${side * (12 + leafIndex * 5)}deg`);
        leaf.style.setProperty("--closed", `${side * 55}deg`);
        leaf.style.setProperty("--overshoot", `${side * -4}deg`);
        leaf.style.setProperty("--side", side);
        leaf.append(svgEl("path", {
          class: "leaf-blade",
          d: "M0 0 C13 -39 49 -49 66 -42 C61 -16 35 11 0 0 Z"
        }));
        leaf.append(svgEl("path", {
          class: "leaf-vein",
          d: "M3 -2 Q30 -20 57 -38"
        }));
        positionedLeaf.append(leaf);
        leaves.append(positionedLeaf);
      }



      /* ==============================
         POSICIÓN DE LA FLOR
         ============================== */

      const positioned =
        svgEl(
          "g",
          {

            transform:
              `translate(${flowerData.x} ${flowerData.y})`

          }
        );



      /* ==============================
         GIRASOL
         ============================== */

      const flower =
        svgEl(
          "g",
          {
            class:
              "flower"
          }
        );


      flower.style.setProperty(
        "--delay",
        `${flowerData.d}s`
      );


      flower.style.setProperty(
        "--lean",
        `${flowerData.lean}deg`
      );


      flower.style.setProperty(
        "--sway-time",
        `${3.2 + (index % 3) * .55}s`
      );


      flower.style.setProperty(
        "--sway-start",
        `${7.3 + index * .08}s`
      );



      /* ==============================
         PÉTALOS
         ============================== */

      const petalCount =
        flowerData.r > 42
          ? 36
          : 32;


      for (
        let layer = 0;
        layer < 2;
        layer++
      ) {

        for (
          let petalIndex = 0;
          petalIndex < petalCount;
          petalIndex++
        ) {


          const angle =
            (360 / petalCount)
            * petalIndex
            + (layer ? 6 : 0);


          const length =
            flowerData.r * 1.10 *
            (
              layer
                ? .64
                : .84
            );


          const width =
            flowerData.r * 1.10 *
            (
              layer
                ? .16
                : .14
            );


          const petalHolder =
            svgEl(
              "g",
              {
                class: "petal-holder",
                transform: `rotate(${angle})`
              }
            );


          const petal =
            svgEl(
              "ellipse",
              {

                class:
                  `petal${layer
                    ? " inner"
                    : ""}`,

                cx:
                  0,

                cy:
                  -length * .61,

                rx:
                  width,

                ry:
                  length * .44

              }
            );


          /*
            Pequeña diferencia entre pétalos
            para dar la sensación de apertura rápida y viva.
          */

          petal.style.setProperty(
            "--petal-delay",
            `${
              petalIndex * .015
              + layer * .05
            }s`
          );


          petalHolder.append(petal);
          flower.append(petalHolder);

        }

      }



      /* ==============================
         CENTRO DEL GIRASOL
         ============================== */

      flower.append(

        svgEl(
          "circle",
          {

            class:
              "flower-center",

            cx:
              0,

            cy:
              0,

            r:
              flowerData.r * 1.10 * .34

          }
        )

      );


      flower.append(

        svgEl(
          "circle",
          {

            class:
              "center-ring",

            cx:
              0,

            cy:
              0,

            r:
              flowerData.r * 1.10 * .25

          }
        )

      );



      /* ==============================
         PARTÍCULAS QUE SUBEN DEL CENTRO DEL GIRASOL
         ============================== */

      const pollenStream =
        svgEl(
          "g",
          {
            class: "pollen-stream"
          }
        );

      const streamCount =
        flowerData.r > 42 ? 9 : 6;

      for (let p = 0; p < streamCount; p++) {
        // Radio entre 2.4 y 3.8 (diámetro 5px a 7.6px: visibles y bien proporcionadas)
        const radius = 2.4 + (p % 3) * 0.7;
        const driftX = -18 + ((p * 17) % 36);
        const riseY = -(65 + ((p * 19) % 55));
        const dur = 2.4 + ((p * 7) % 15) * 0.1;
        const delay = flowerData.d + 0.15 + p * 0.35;

        const pollenDot =
          svgEl(
            "circle",
            {
              class: "sunflower-center-pollen",
              cx: (-5 + ((p * 11) % 10)).toFixed(1),
              cy: (-4 + ((p * 7) % 8)).toFixed(1),
              r: radius.toFixed(1)
            }
          );

        pollenDot.style.setProperty("--drift-x", `${driftX}px`);
        pollenDot.style.setProperty("--rise-y", `${riseY}px`);
        pollenDot.style.setProperty("--p-dur", `${dur}s`);
        pollenDot.style.setProperty("--p-delay", `${delay}s`);

        pollenStream.append(pollenDot);
      }

      positioned.append(
        flower
      );

      positioned.append(
        pollenStream
      );

      flowers.append(
        positioned
      );

    }
  );

}



/* Follaje exterior inspirado en el crecimiento por capas de Details. */
function buildWildFoliage() {

  const foliage =
    $("#wildFoliage");

  const blades = [
    [101,500,-68,185,-20], [112,510,-45,155,-10],
    [126,515,-25,125,3], [143,520,-12,105,9],
    [86,516,-78,130,-28], [73,520,-92,105,-36],
    [289,500,68,185,20], [278,510,45,155,10],
    [264,515,25,125,-3], [247,520,12,105,-9],
    [304,516,78,130,28], [317,520,92,105,36]
  ];

  blades.forEach(
    ([x, y, dx, height, lean], index) => {

      const holder =
        svgEl("g", {
          transform: `translate(${x} ${y})`
        });

      const blade =
        svgEl("path", {
          class: "wild-leaf",
          d: `M0 0 C ${dx*.18} ${-height*.35}, ${dx*.72} ${-height*.82}, ${dx} ${-height} C ${dx*.48} ${-height*.58}, ${dx*.16} ${-height*.18}, 0 0 Z`
        });

      blade.style.setProperty("--delay", `${1.05 + index*.105}s`);
      blade.style.setProperty("--lean", `${lean}deg`);
      blade.style.setProperty("--wind", `${index%2 ? 1 : -1}deg`);

      holder.append(blade);
      foliage.append(holder);
    }
  );
}



/* ==================================================
   ESTRELLAS
   ================================================== */

function buildStars() {

  const box =
    $("#stars");


  for (
    let i = 0;
    i < 26;
    i++
  ) {

    const star =
      document.createElement(
        "i"
      );


    star.className =
      `star${
        i % 7 === 0
          ? " butterfly"
          : ""
      }`;


    star.style.left =
      `${
        3
        + Math.random() * 94
      }%`;


    star.style.top =
      `${
        8
        + Math.random() * 78
      }%`;


    star.style.animationDelay =
      `${
        Math.random() * 3
      }s`;


    box.append(
      star
    );

  }

}



/* ==================================================
   PARTÍCULAS
   ================================================== */

function startParticles() {

  const box =
    $("#particles");


  /*
    Evita generar partículas nuevamente
    si la función se ejecutara otra vez.
  */

  if (
    box.children.length > 0
  ) {

    return;

  }


  for (
    let i = 0;
    i < 30;
    i++
  ) {

    const particle =
      document.createElement(
        "i"
      );


    particle.className =
      `particle ${i % 3 === 0 ? "tiny-heart" : "loose-petal"}`;


    particle.style.left =
      `${
        8
        + Math.random() * 84
      }%`;


    particle.style.top =
      `${
        28
        + Math.random() * 61
      }%`;


    particle.style.setProperty(
      "--duration",
      `${
        4
        + Math.random() * 4
      }s`
    );


    particle.style.setProperty(
      "--delay",
      `${
        Math.random() * 4
      }s`
    );


    particle.style.setProperty(
      "--drift",
      `${
        -35
        + Math.random() * 70
      }px`
    );


    particle.style.transform =
      `scale(${
        .5
        + Math.random()
      })`;


    box.append(
      particle
    );

  }

}



/* ==================================================
   CONFIGURACIÓN
   ================================================== */

function applyConfig() {

  $("#introMessage")
    .textContent =
      CONFIG.mensajeInicial;


  $("#mainTitle")
    .textContent =
      CONFIG.titulo;


  $("#recipient")
    .textContent =
      CONFIG.nombre;


  $("#signatureName")
    .textContent =
      CONFIG.nombreFirma || CONFIG.nombre;


  $("#letterText")
    .textContent =
      CONFIG.carta;


  $("#finalMessage")
    .textContent =
      CONFIG.mensajeFinal;


  music.src =
    CONFIG.musica;

}



/* ==================================================
   COMENZAR EXPERIENCIA
   ================================================== */

async function begin() {

  if (started) {

    return;

  }


  started = true;


  intro.classList.add(
    "hidden"
  );


  experience.classList.add(
    "started"
  );


  /*
    Intentar reproducir música
  */

  try {

    await music.play();

    $("#soundButton")
      .textContent =
        "🔊";

  }

  catch (error) {

    $("#soundButton")
      .textContent =
        "🔇";

  }


  /*
    Cuando termina aproximadamente
    la animación del ramo aparecen
    partículas y carta.
  */

  setTimeout(
    () => {

      experience.classList.add(
        "ready"
      );

      startParticles();
      startPollenParticles();

    },

    3800
  );

}



/* ==================================================
/* ==================================================
   CONTROL DEL SOBRE Y CARTA
   ================================================== */

let isAnimatingLetter = false;
let isClosingLetter = false;

function openLetter() {

  if (isClosingLetter) return;

  const modal =
    $("#letterModal");

  const envelope =
    $("#envelope");

  modal.removeAttribute("inert");

  modal.classList.add(
    "visible"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  /*
    Primero solo se abre la tapa del sobre.
    La carta permanece adentro protegida.
  */
  setTimeout(
    () => {

      envelope.classList.add(
        "open"
      );

    },
    450
  );

}



/* ==================================================
   ALTERNAR CARTA (sacar o guardar con clic)
   ================================================== */

function toggleLetter() {

  if (isAnimatingLetter || isClosingLetter) return;

  const envelope =
    $("#envelope");

  /* Solo interactuar si el sobre ya está abierto */
  if (!envelope.classList.contains("open")) {
    return;
  }

  isAnimatingLetter = true;

  if (!envelope.classList.contains("revealed")) {
    /* La carta sale suavemente desde adentro del sobre */
    envelope.classList.add(
      "revealed"
    );

    setTimeout(
      () => {
        isAnimatingLetter = false;
      },
      950
    );

  } else {
    /* La carta se guarda de nuevo suavemente adentro del sobre */
    envelope.classList.remove(
      "revealed"
    );

    setTimeout(
      () => {
        isAnimatingLetter = false;
      },
      900
    );

  }

}



/* Helper para ocultar el modal limpiamente sin atrapar el foco */
function hideModalElement(modal) {

  if (document.activeElement && modal.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  modal.classList.remove("visible");
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("inert", "");
  isClosingLetter = false;

}



/* ==================================================
   CERRAR CARTA (con animación completa)
   ================================================== */

function closeLetter() {

  if (isClosingLetter) return;

  const modal =
    $("#letterModal");

  const envelope =
    $("#envelope");

  if (!modal.classList.contains("visible")) return;

  isClosingLetter = true;

  if (envelope.classList.contains("revealed")) {
    /*
      1. Primero se guarda la carta adentro del sobre
    */
    envelope.classList.remove(
      "revealed"
    );

    setTimeout(
      () => {

        /*
          2. Se cierra la tapa del sobre
        */
        envelope.classList.remove(
          "open"
        );

        setTimeout(
          () => {

            /*
              3. Se oculta el modal suavemente
            */
            hideModalElement(modal);

          },
          550
        );

      },
      750
    );

  } else if (envelope.classList.contains("open")) {
    /* Si solo estaba la tapa abierta, cerrarla */
    envelope.classList.remove(
      "open"
    );

    setTimeout(
      () => {

        hideModalElement(modal);

      },
      550
    );

  } else {

    hideModalElement(modal);

  }

}



/* ==================================================
   EVENTOS
   ================================================== */

intro.addEventListener(
  "click",
  begin
);


intro.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter"
      ||
      event.key === " "
    ) {

      event.preventDefault();

      begin();

    }

  }
);



$("#envelopeCta")
  .addEventListener(
    "click",
    openLetter
  );



$("#closeLetter")
  .addEventListener(
    "click",
    (event) => {

      event.stopPropagation();
      closeLetter();

    }
  );



$("#letterModal")
  .addEventListener(
    "click",
    (event) => {

      if (
        event.target.id
        === "letterModal"
      ) {

        closeLetter();

      }

    }
  );



/* Alternar carta: sacar o guardar al tocar sobre o carta */

$("#envelope")
  .addEventListener(
    "click",
    (event) => {

      event.stopPropagation();
      toggleLetter();

    }
  );


window.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
      &&
      $("#letterModal").classList.contains("visible")
    ) {

      closeLetter();

    }

  }
);



$("#soundButton")
  .addEventListener(
    "click",
    async (event) => {

      event.stopPropagation();


      if (music.paused) {

        try {

          await music.play();

          event
            .currentTarget
            .textContent =
              "🔊";

        }

        catch (error) {

          event
            .currentTarget
            .textContent =
              "🔇";

        }

      }

      else {

        music.pause();

        event
          .currentTarget
          .textContent =
            "🔇";

      }

    }
  );



/* ==================================================
   INICIALIZACIÓN
   ================================================== */

applyConfig();

buildBouquet();

buildStars();



/* ==================================================
   PARTÍCULAS DE POLEN (girasoles)
   ==================================================

   Genera pequeñas partículas amarillas que
   flotan hacia arriba desde el centro de
   cada girasol, simulando polen.
*/

function startPollenParticles() {

  const bouquet = $("#bouquet");
  const bouquetRect = bouquet.getBoundingClientRect();
  const gardenEl = $(".garden");

  // Obtener las dimensiones del SVG viewBox para mapear coordenadas
  const svgWidth = bouquetRect.width;
  const svgHeight = bouquetRect.height;
  const viewBoxWidth = 390;
  const viewBoxHeight = 600;

  const scaleX = svgWidth / viewBoxWidth;
  const scaleY = svgHeight / viewBoxHeight;

  // Posición del SVG relativa al garden
  const gardenRect = gardenEl.getBoundingClientRect();
  const svgOffsetX = bouquetRect.left - gardenRect.left;
  const svgOffsetY = bouquetRect.top - gardenRect.top;

  flowerLayout.forEach((flowerData) => {

    const centerScreenX = svgOffsetX + flowerData.x * scaleX;
    const centerScreenY = svgOffsetY + flowerData.y * scaleY;

    // Crear 4-6 partículas por flor
    const count = 4 + Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i++) {

      const particle = document.createElement("i");
      particle.className = "sunflower-pollen";

      // Posicionar en el centro del girasol con un poco de variación
      const offsetX = -8 + Math.random() * 16;
      const offsetY = -8 + Math.random() * 16;

      particle.style.left = `${centerScreenX + offsetX}px`;
      particle.style.top = `${centerScreenY + offsetY}px`;

      particle.style.setProperty(
        "--pollen-dur",
        `${2.5 + Math.random() * 3}s`
      );

      particle.style.setProperty(
        "--pollen-delay",
        `${Math.random() * 4}s`
      );

      particle.style.setProperty(
        "--pollen-x",
        `${-12 + Math.random() * 24}px`
      );

      // Variar el tamaño (visibles pero armoniosas: 5px a 8px)
      const size = 5 + Math.random() * 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      gardenEl.append(particle);
    }

  });

}
