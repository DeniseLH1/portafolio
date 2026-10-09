// Catálogo estructurado para reutilizar o renderizar dinámicamente los proyectos.
// Cada objeto contiene identificador, contenido, tecnologías, enlaces e imagen.
const projectsData = [
  // Plataforma para vender y administrar entradas de eventos.
  {
    id: "tickyiyo",
    title: "Tickyiyo – Plataforma de Ticketing para Eventos",
    description: "Aplicación web interactiva para la adquisición y gestión de boletos en tiempo real. Cuenta con autenticación, CRUD completo para eventos y manipulación del DOM.",
    tags: ["JavaScript", "HTML", "CSS Grid/Flexbox", "LocalStorage"],
    demoUrl: "#",
    githubUrl: "https://github.com/DeniseLH1/conciertos_tickyiyo.git",
    image: "./assets/img/projects/tickyiyo.png"
  },
  // Flujos de automatización que conectan n8n, Telegram y otros servicios.
  {
    id: "n8n-automation",
    title: "Flujos de Automatización con n8n y Telegram",
    description: "Implementación de flujos de trabajo automatizados para optimizar el procesamiento de justificantes mediante APIs y bots interactivos.",
    tags: ["n8n", "Telegram API", "Google Sheets API", "Webhooks"],
    demoUrl: "#",
    githubUrl: "https://github.com/DeniseLH1/justificacion_inasistencia.git",
    image: "./assets/img/projects/n8n.png"
  },
  // Interfaz web para explorar música y reproducir canciones.
  {
    id: "music-stream",
    title: "MusicStream – Plataforma Web de Streaming Musical",
    description: "Aplicación web frontend con interfaz en modo oscuro dedicada a la exploración musical, detalle de álbumes, reproductor interactivo de audio y flujo de checkout.",
    tags: ["HTML", "CSS", "JavaScript", "CSS Grid/Flexbox"],
    demoUrl: "#",
    githubUrl: "https://github.com/DeniseLH1/music_stream_app_Jennifer_Lopez.git",
    image: "./assets/img/projects/musicstream.png"
  }
];