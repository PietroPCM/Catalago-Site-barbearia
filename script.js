const business = {
  name: "Navalha Prime Barber",
  city: "Cascavel - PR",
  whatsapp: "5545999999999",
  instagram: "@navalhaprimebarber",
  address: "Rua Paraná, 1234 - Centro, Cascavel - PR",
  hours: "Segunda a sábado, das 9h às 20h"
};

const categories = ["Todos", "Corte", "Barba", "Combo", "Tratamentos", "Extras"];

const services = [
  { name: "Corte masculino", category: "Corte", description: "Corte alinhado no formato do rosto, finalizado com nuca limpa e contorno conferido.", price: "R$ 45,00", highlight: false },
  { name: "Barba completa", category: "Barba", description: "Barba desenhada, toalha quente, acabamento de navalha e produto para fechar o atendimento.", price: "R$ 35,00", highlight: false },
  { name: "Corte + barba", category: "Combo", description: "O combo mais pedido: cabelo no ponto, barba feita e finalização pronta para sair.", price: "R$ 70,00", highlight: true },
  { name: "Sobrancelha", category: "Extras", description: "Limpeza discreta para manter expressão masculina sem pesar no visual.", price: "R$ 20,00", highlight: false },
  { name: "Degradê navalhado", category: "Corte", description: "Degradê marcado na precisão, com transição limpa e acabamento rente na navalha.", price: "R$ 55,00", highlight: true },
  { name: "Hidratação capilar", category: "Tratamentos", description: "Tratamento rápido para fio ressecado, ideal para manter corte com melhor caimento.", price: "R$ 40,00", highlight: false },
  { name: "Pigmentação de barba", category: "Barba", description: "Correção de falhas e reforço visual da barba com acabamento natural.", price: "R$ 50,00", highlight: false },
  { name: "Pacote premium", category: "Combo", description: "Corte, barba, sobrancelha e hidratação para atendimento completo na mesma cadeira.", price: "R$ 95,00", highlight: true }
];

const state = { category: "Todos", search: "" };

const els = {
  header: document.querySelector("[data-header]"),
  menuToggle: document.querySelector("[data-menu-toggle]"),
  mobileNav: document.querySelector("[data-mobile-nav]"),
  categories: document.querySelector("[data-categories]"),
  search: document.querySelector("[data-search]"),
  grid: document.querySelector("[data-service-grid]"),
  empty: document.querySelector("[data-empty-state]"),
  featureBook: document.querySelector("[data-feature-book]")
};

function normalizeText(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function whatsappUrl(message) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
}

function generalMessage() {
  return `Olá, vim pelo site da ${business.name} e quero agendar um horário. Pode me passar os horários disponíveis?`;
}

function serviceMessage(serviceName) {
  return `Olá, vim pelo site da ${business.name} e quero agendar ${serviceName}. Pode me passar os horários disponíveis?`;
}

function renderCategories() {
  els.categories.innerHTML = categories.map((category) => {
    const active = category === state.category ? " is-active" : "";
    return `<button class="category-pill${active}" type="button" data-category="${category}">${category}</button>`;
  }).join("");
}

function serviceCard(service, index) {
  const badge = service.highlight ? '<span class="badge">Destaque</span>' : "";
  return `
    <article class="service-card" data-tilt>
      <div class="service-meta"><span class="service-category">${service.category}</span>${badge}</div>
      <span class="service-index">${String(index + 1).padStart(2, "0")}</span>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <div class="service-price">${service.price}</div>
      <a class="btn btn-secondary" href="${whatsappUrl(serviceMessage(service.name))}" target="_blank" rel="noopener">Agendar este serviço</a>
    </article>`;
}

function filteredServices() {
  const query = normalizeText(state.search.trim());
  return services.filter((service) => {
    const categoryMatch = state.category === "Todos" || service.category === state.category;
    const searchable = normalizeText(`${service.name} ${service.category} ${service.description}`);
    return categoryMatch && (!query || searchable.includes(query));
  });
}

function renderServices() {
  const visibleServices = filteredServices();
  els.grid.innerHTML = visibleServices.map(serviceCard).join("");
  els.empty.hidden = visibleServices.length > 0;
  setupTilt();
  animateServiceCards();
}

function bindWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp='geral']").forEach((link) => {
    link.href = whatsappUrl(generalMessage());
    link.target = "_blank";
    link.rel = "noopener";
  });
  if (els.featureBook) {
    els.featureBook.href = whatsappUrl(serviceMessage("Corte + barba"));
    els.featureBook.target = "_blank";
    els.featureBook.rel = "noopener";
  }
}

function bindFilters() {
  els.categories.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderCategories();
    renderServices();
  });
  els.search.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderServices();
  });
}

function bindMenu() {
  els.menuToggle.addEventListener("click", () => {
    const isOpen = els.mobileNav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    els.menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  els.mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      els.mobileNav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      els.menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function bindHeaderState() {
  const update = () => els.header.classList.toggle("is-scrolled", window.scrollY > 18);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setupTilt() {
  if (prefersReducedMotion() || window.innerWidth < 900) return;
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 5;
      const rotateX = ((y / rect.height) - 0.5) * -5;
      card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

function setupMagneticButtons() {
  if (prefersReducedMotion() || window.innerWidth < 900) return;
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });
    button.addEventListener("mouseleave", () => { button.style.transform = ""; });
  });
}

function animateServiceCards() {
  if (prefersReducedMotion() || !window.gsap) return;
  gsap.fromTo(".service-card", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.055, ease: "power2.out" });
}

function setupAnimations() {
  if (prefersReducedMotion() || !window.gsap) {
    document.querySelectorAll(".reveal").forEach((item) => {
      item.style.opacity = 1;
      item.style.transform = "none";
    });
    return;
  }
  const { gsap } = window;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  gsap.from(".hero .reveal", { y: 34, opacity: 0, duration: 0.8, stagger: 0.11, ease: "power3.out" });
  if (window.ScrollTrigger) {
    gsap.utils.toArray("main section:not(.hero) .reveal").forEach((item) => {
      if (item.classList.contains("service-card")) return;
      gsap.from(item, { y: 28, opacity: 0, duration: 0.72, ease: "power2.out", scrollTrigger: { trigger: item, start: "top 86%" } });
    });
    gsap.utils.toArray("[data-parallax] img").forEach((image) => {
      gsap.to(image, { yPercent: -8, ease: "none", scrollTrigger: { trigger: image.closest("[data-parallax]"), start: "top bottom", end: "bottom top", scrub: true } });
    });
  }
}

function init() {
  if (!els.categories || !els.search || !els.grid) return;
  renderCategories();
  renderServices();
  bindWhatsAppLinks();
  bindFilters();
  if (els.menuToggle && els.mobileNav) bindMenu();
  bindHeaderState();
  setupMagneticButtons();
  setupAnimations();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
