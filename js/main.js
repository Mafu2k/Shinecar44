(function () {
    'use strict';

    const navbar = document.getElementById('mainNav');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });

    const SERVICES = {
        'svc-komplet':           { name: 'Komplet',               min: 250,  max: 350,  sizeBased: true, desc: 'Odświeżenie wnętrza i mycie podstawowe nadwozia w jednym pakiecie. Cena zależna od rozmiaru auta.' },
        'svc-odswiezenie':       { name: 'Odświeżenie',           min: 150,  max: 200,  desc: 'Odkurzanie, przetarcie plastików, mycie szyb i kokpitu — wnętrze schludne i świeże.' },
        'svc-premium':           { name: 'Premium',               min: 250,  max: 600,  desc: 'Dogłębne czyszczenie całego wnętrza: detale, szczeliny, plastiki, podsufitka i dezynfekcja.' },
        'svc-pranie-podstawowe': { name: 'Pranie podstawowe',     min: 250,  max: 400,  desc: 'Pranie ekstrakcyjne foteli lub dywaników w wybranych strefach.' },
        'svc-pranie-pelne':      { name: 'Pranie pełne',          min: 450,  max: 1200, desc: 'Pranie ekstrakcyjne całej tapicerki, dywanów i boczków — usuwa plamy i zapachy.' },
        'svc-czyszczenie-skor':  { name: 'Czyszczenie skór',      min: 150,  max: 550,  desc: 'Czyszczenie i pielęgnacja tapicerki skórzanej dedykowanymi preparatami.' },
        'svc-mycie-podstawowe':  { name: 'Mycie podstawowe',      min: 100,  max: 200,  desc: 'Bezpieczne mycie ręczne nadwozia, felg i szyb wraz z osuszeniem.' },
        'svc-mycie-premium':     { name: 'Mycie premium',         min: 250,  max: 600,  desc: 'Mycie detailingowe z dekontaminacją wstępną i woskiem w sprayu.' },
        'svc-dekontaminacja':    { name: 'Dekontaminacja lakieru', min: 350, max: 800,  desc: 'Usunięcie zanieczyszczeń wżartych w lakier (smoła, opad, glinkowanie) — baza pod korektę i powłoki.' },
        'svc-felgi':             { name: 'Felgi +',               min: 100,  max: 250,  desc: 'Dokładne czyszczenie felg z wewnętrznej strony i ich zabezpieczenie.' },
        'svc-pol-1step':         { name: 'Polerowanie 1-step',    min: 400,  max: 800,  desc: 'Jednoetapowa korekta lakieru — redukcja drobnych rys i matu, wyraźna poprawa połysku.' },
        'svc-pol-2step':         { name: 'Polerowanie 2-step',    min: 850,  max: 1300, desc: 'Dwuetapowa korekta — usunięcie głębszych rys i hologramów, mocny efekt lustra.' },
        'svc-pelna-korekta':     { name: 'Pełna korekta',         min: 900,  max: 2000, desc: 'Wieloetapowa korekta przywracająca maksymalny połysk; w pakiecie renowacja reflektorów.' },
        'svc-wosk':              { name: 'Wosk',                  min: 150,  max: 350,  desc: 'Naturalny lub syntetyczny wosk dający połysk i kilkumiesięczną ochronę.' },
        'svc-powloka-15':        { name: 'Powłoka 1,5-roczna',    min: 50,   max: 600,  desc: 'Powłoka ceramiczna z ochroną ok. 1,5 roku — efekt hydrofobowy i głębia lakieru.' },
        'svc-powloka-3':         { name: 'Powłoka 3-letnia',      min: 500,  max: 750,  desc: 'Powłoka ceramiczna z ochroną do 3 lat — trwała hydrofobowość i twardość.' },
        'svc-powloka-5':         { name: 'Powłoka 5-letnia',      min: 600,  max: 900,  desc: 'Powłoka ceramiczna z ochroną do 5 lat — najwyższa trwałość i odporność.' },
        'svc-ppf':               { name: 'Folia PPF',             min: 0,    max: 0, individual: true, desc: 'Bezbarwna folia ochronna chroniąca lakier przed odpryskami i rysami.' },
        'svc-folia-winyl':       { name: 'Folia winylowa',        min: 0,    max: 0, individual: true, desc: 'Zmiana koloru auta lub dechroming folią winylową.' },
    };

    const SIZES = {
        maly:   { label: 'Małe',    komplet: { min: 150, max: 250 }, minMult: 1.0, maxMult: 0.65 },
        sredni: { label: 'Średnie', komplet: { min: 250, max: 350 }, minMult: 1.2, maxMult: 0.85 },
        duzy:   { label: 'Duże',    komplet: { min: 350, max: 450 }, minMult: 1.5, maxMult: 1.2 },
    };

    function round10(value) {
        return Math.round(value / 10) * 10;
    }

    function formatRange(min, max) {
        return min === max ? `${min} zł` : `${min}–${max} zł`;
    }

    // Pozycje pokazują ceny bazowe z cennika (Komplet ma stałą cenę per rozmiar,
    // ustawianą w applySize). Mnożnik rozmiaru dotyczy tylko ceny finalnej.
    function priceLabel(id) {
        const svc = SERVICES[id];
        if (svc.individual) return 'Wycena indyw.';
        return formatRange(svc.min, svc.max);
    }

    let currentSize = 'sredni';

    const REQUIRES = {
        'svc-pranie-podstawowe': ['svc-premium'],
        'svc-pranie-pelne':      ['svc-premium'],
        'svc-czyszczenie-skor':  ['svc-premium'],
        'svc-pol-1step':         ['svc-dekontaminacja'],
        'svc-pol-2step':         ['svc-dekontaminacja'],
        'svc-pelna-korekta':     ['svc-dekontaminacja'],
        'svc-wosk':              ['svc-dekontaminacja'],
        'svc-powloka-15':        ['svc-dekontaminacja', 'svc-pelna-korekta'],
        'svc-powloka-3':         ['svc-dekontaminacja', 'svc-pelna-korekta'],
        'svc-powloka-5':         ['svc-dekontaminacja', 'svc-pelna-korekta'],
    };

    const EXCLUSIVE_GROUPS = [
        ['svc-odswiezenie', 'svc-premium'],
        ['svc-pranie-podstawowe', 'svc-pranie-pelne'],
        ['svc-mycie-podstawowe', 'svc-mycie-premium'],
        ['svc-pol-1step', 'svc-pol-2step', 'svc-pelna-korekta'],
        ['svc-wosk', 'svc-powloka-15', 'svc-powloka-3', 'svc-powloka-5'],
    ];

    let lastChangedId = null;

    function isChecked(id) {
        const el = document.getElementById(id);
        return el ? el.checked : false;
    }

    function getWrapperId(svcId) {
        return 'cb-' + svcId.replace('svc-', '');
    }

    function decorateServices() {
        Object.keys(SERVICES).forEach(id => {
            const wrapper = document.getElementById(getWrapperId(id));
            if (!wrapper) return;

            const label = wrapper.querySelector('label');
            const name = label.querySelector('.service-name');
            if (!name || label.querySelector('.svc-head')) return;

            const head = document.createElement('span');
            head.className = 'svc-head';
            label.insertBefore(head, name);
            head.appendChild(name);

            if (SERVICES[id].desc) {
                const desc = document.createElement('span');
                desc.className = 'svc-desc';
                desc.textContent = SERVICES[id].desc;
                label.appendChild(desc);
            }
        });
    }

    function applySize(size) {
        if (!SIZES[size]) return;
        currentSize = size;

        document.querySelectorAll('.calc-size-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === size);
        });

        const komplet = SERVICES['svc-komplet'];
        komplet.min = SIZES[size].komplet.min;
        komplet.max = SIZES[size].komplet.max;

        const sizeLabel = document.getElementById('summarySize');
        if (sizeLabel) sizeLabel.textContent = SIZES[size].label;

        updateSummary();
        updatePrice();
    }

    function updateDependencies() {

        const requiredBy = {};
        Object.entries(REQUIRES).forEach(([triggerId, deps]) => {
            if (isChecked(triggerId)) {
                deps.forEach(depId => {
                    if (!requiredBy[depId]) requiredBy[depId] = new Set();
                    requiredBy[depId].add(triggerId);
                });
            }
        });

        const allDeps = new Set(Object.values(REQUIRES).flat());

        allDeps.forEach(depId => {
            const cb = document.getElementById(depId);
            const wrapper = document.getElementById(getWrapperId(depId));
            if (!cb || !wrapper) return;

            const isRequired = !!(requiredBy[depId] && requiredBy[depId].size > 0);

            if (isRequired) {
                cb.checked = true;
                cb.disabled = true;
                wrapper.classList.add('service-required');
                wrapper.classList.add('selected');

                let note = wrapper.querySelector('.required-note');
                if (!note) {
                    note = document.createElement('small');
                    note.className = 'required-note';
                    note.innerHTML = '<i class="fas fa-lock"></i> wymagane';
                    wrapper.querySelector('label').appendChild(note);
                }
            } else {
                cb.disabled = false;
                wrapper.classList.remove('service-required');
                const note = wrapper.querySelector('.required-note');
                if (note) note.remove();
                if (!cb.checked) wrapper.classList.remove('selected');
            }
        });
    }

    function updateSummary() {
        const list = document.getElementById('selectedServices');
        if (!list) return;

        const checked = Object.keys(SERVICES).filter(id => isChecked(id));

        if (checked.length === 0) {
            list.innerHTML = '<li class="empty-state">Brak wybranych usług</li>';
        } else {
            list.innerHTML = checked.map(id => {
                const svc = SERVICES[id];
                const cb = document.getElementById(id);
                const isReq = cb && cb.disabled;
                const badge = isReq ? ' <small class="req-badge"><i class="fas fa-lock"></i> wymagane</small>' : '';
                return `<li>
                    <span>${svc.name}${badge}</span>
                    <span class="svc-range">${priceLabel(id)}</span>
                </li>`;
            }).join('');
        }
    }

    function updatePrice() {
        const totalEl = document.getElementById('totalPrice');
        if (!totalEl) return;

        const checked = Object.keys(SERVICES).filter(id => isChecked(id));

        if (checked.length === 0) {
            totalEl.textContent = '— zł';
            return;
        }

        const priced = checked.filter(id => !SERVICES[id].individual);
        const hasIndividual = checked.some(id => SERVICES[id].individual);
        const size = SIZES[currentSize];

        let kompletMin = 0, kompletMax = 0, otherMin = 0, otherMax = 0;
        priced.forEach(id => {
            if (id === 'svc-komplet') {
                kompletMin += SERVICES[id].min;
                kompletMax += SERVICES[id].max;
            } else {
                otherMin += SERVICES[id].min;
                otherMax += SERVICES[id].max;
            }
        });

        // Mnożnik rozmiaru działa na sumę usług (Komplet ma cenę stałą).
        // Przy małych autach maxMult < minMult, więc granice trzeba uporządkować.
        const scaledA = otherMin * size.minMult;
        const scaledB = otherMax * size.maxMult;
        const totalMin = kompletMin + round10(Math.min(scaledA, scaledB));
        const totalMax = kompletMax + round10(Math.max(scaledA, scaledB));

        const totalStr = totalMin === totalMax
            ? `${totalMin} zł`
            : `od ${totalMin} do ${totalMax} zł`;

        if (priced.length === 0 && hasIndividual) {
            totalEl.textContent = "Wycena indywidualna";
        } else if (hasIndividual) {
            totalEl.textContent = `${totalStr} + wycena indyw.`;
        } else {
            totalEl.textContent = totalStr;
        }
    }

    function enforceExclusivity() {
        EXCLUSIVE_GROUPS.forEach(group => {
            const checkedInGroup = group.filter(id => isChecked(id));
            if (checkedInGroup.length <= 1) return;

            let keep = checkedInGroup.find(id => {
                const cb = document.getElementById(id);
                return cb && cb.disabled;
            });
            if (!keep) {
                keep = checkedInGroup.includes(lastChangedId)
                    ? lastChangedId
                    : checkedInGroup[checkedInGroup.length - 1];
            }

            checkedInGroup.forEach(id => {
                if (id === keep) return;
                const cb = document.getElementById(id);
                if (!cb || cb.disabled) return;
                cb.checked = false;
                const wrapper = document.getElementById(getWrapperId(id));
                if (wrapper) wrapper.classList.remove('selected');
            });
        });
    }

    function onCalcChange() {
        updateDependencies();
        enforceExclusivity();
        updateDependencies();
        updateSummary();
        updatePrice();
    }

    Object.keys(SERVICES).forEach(id => {
        const cb = document.getElementById(id);
        if (!cb) return;

        const wrapper = cb.closest('.service-checkbox');
        if (!wrapper) return;

        wrapper.addEventListener('click', function (e) {
            const lbl = wrapper.querySelector('label');
            if (lbl && lbl.contains(e.target)) return;
            if (e.target === cb) return;
            if (cb.disabled) return;
            cb.checked = !cb.checked;
            wrapper.classList.toggle('selected', cb.checked);
            lastChangedId = id;
            onCalcChange();
        });

        cb.addEventListener('change', function () {
            if (this.disabled) return;
            wrapper.classList.toggle('selected', this.checked);
            lastChangedId = id;
            onCalcChange();
        });
    });

    document.querySelectorAll('.calc-group-header').forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.calc-group').classList.toggle('open');
        });
    });

    document.querySelectorAll('.calc-size-option').forEach(btn => {
        btn.addEventListener('click', function () {
            applySize(this.dataset.size);
        });
    });

    decorateServices();
    applySize(currentSize);

    const scrollTopBtn = document.getElementById('scrollTop');

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const heroSection = document.querySelector('.hero-section');

    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalVehicle = document.getElementById('modalVehicle');
    const modalServices = document.getElementById('modalServices');
    const closeModal = document.querySelector('.gallery-modal-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const image = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');
            const vehicle = this.getAttribute('data-vehicle');
            const services = (this.getAttribute('data-services') || '').split(',').filter(Boolean);

            modalImage.src = image;
            modalImage.alt = `${title} - ${vehicle}`;
            modalTitle.textContent = title;
            modalVehicle.textContent = vehicle;

            modalServices.innerHTML = services.map(service =>
                `<li>${service.trim()}</li>`
            ).join('');

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeGalleryModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeGalleryModal);
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeGalleryModal();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (modal && e.key === 'Escape' && modal.classList.contains('active')) {
            closeGalleryModal();
        }
    });

    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (!this.value) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '#28a745';
                }
            });

            input.addEventListener('input', function () {
                if (this.value) {
                    this.style.borderColor = '#28a745';
                }
            });
        });
    });

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && navbarCollapse && navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse, { toggle: true });
            }
        });
    });

    function loadPromotions() {
        const promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
        const container = document.getElementById('promotionsContainer');

        if (!container) return;

        if (promotions.length === 0) {
            container.innerHTML = `
                <div class="no-promotions" style="text-align: center; padding: 3rem; color: #6c757d;">
                    <i class="fas fa-tag" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>Brak aktualnych promocji. Wróć wkrótce!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = promotions.map(promo => `
            <div class="promotion-card">
                ${promo.badge ? `<div class="promotion-badge">${promo.badge}</div>` : ''}
                <img src="${promo.image}" alt="${promo.title}" class="promotion-image">
                <div class="promotion-content">
                    <h3 class="promotion-title">${promo.title}</h3>
                    <p class="promotion-description">${promo.description}</p>
                    <div class="promotion-footer">
                        <div class="promotion-price">
                            ${promo.oldPrice ? `<span class="promotion-old-price">${promo.oldPrice} zł</span>` : ''}
                            <span class="promotion-new-price">${promo.newPrice} zł</span>
                        </div>
                        <a href="#contact" class="promotion-btn">Kontakt</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.addEventListener('load', function () {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);

        loadPromotions();
    });

    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navLinkBySection = {};
    sections.forEach(section => {
        navLinkBySection[section.id] = document.querySelector(`.navbar-nav a[href="#${section.id}"]`);
    });

    let scrollTicking = false;

    function handleScroll() {
        const scrollY = window.scrollY;

        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }

        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', scrollY > 500);
        }

        if (heroSection && scrollY < window.innerHeight) {
            heroSection.style.transform = `translateY(${scrollY * 0.5}px)`;
        }

        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const navLink = navLinkBySection[section.id];
            if (navLink && scrollY > top && scrollY <= top + section.offsetHeight) {
                allNavLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });

        scrollTicking = false;
    }

    window.addEventListener('scroll', function () {
        if (!scrollTicking) {
            scrollTicking = true;
            window.requestAnimationFrame(handleScroll);
        }
    }, { passive: true });

    handleScroll();

    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace(/20\d{2}/, currentYear);
    }

    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    window.addEventListener('beforeprint', function () {
        document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', function () {
        document.body.classList.remove('printing');
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const statusEl = document.getElementById('cfStatus');
        const servicesField = document.getElementById('cfServices');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const quoteBox = document.getElementById('cfQuoteBox');
        const quoteText = document.getElementById('cfQuoteText');
        const attachBtn = document.getElementById('attachQuoteBtn');
        const attachHint = document.getElementById('attachQuoteHint');
        const removeQuoteBtn = document.getElementById('cfQuoteRemove');
        const PHONE = '+48 537 897 951';

        function buildQuoteText() {
            const items = Array.from(document.querySelectorAll('#selectedServices li'))
                .map(li => li.textContent.replace(/\s+/g, ' ').trim())
                .filter(text => text && !/Brak wybranych/i.test(text));
            if (!items.length) return '';
            const total = (document.getElementById('totalPrice') || {}).textContent || '';
            const size = (document.getElementById('summarySize') || {}).textContent || '';
            return `Rozmiar auta: ${size}\n- ${items.join('\n- ')}\nWycena: ${total}`;
        }

        function showQuote(text) {
            if (servicesField) servicesField.value = text;
            if (quoteText) quoteText.textContent = text;
            if (quoteBox) quoteBox.hidden = false;
        }

        function clearQuote() {
            if (servicesField) servicesField.value = '';
            if (quoteText) quoteText.textContent = '';
            if (quoteBox) quoteBox.hidden = true;
        }

        function setStatus(message, type) {
            if (!statusEl) return;
            statusEl.textContent = message;
            statusEl.className = 'contact-status' + (type ? ' is-' + type : '');
        }

        function setHint(message) {
            if (!attachHint) return;
            attachHint.textContent = message || '';
            attachHint.classList.toggle('is-visible', !!message);
        }

        if (attachBtn) {
            attachBtn.addEventListener('click', function () {
                const text = buildQuoteText();
                if (!text) {
                    setHint('Najpierw zaznacz usługi w kalkulatorze.');
                    return;
                }
                setHint('');
                showQuote(text);
                contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                window.setTimeout(function () {
                    const nameField = document.getElementById('cfName');
                    if (nameField) nameField.focus();
                }, 450);
            });
        }

        if (removeQuoteBtn) {
            removeQuoteBtn.addEventListener('click', clearQuote);
        }

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (servicesField && !servicesField.value) {
                servicesField.value = buildQuoteText() || 'Klient nie skorzystał z kalkulatora.';
            }

            const original = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie…';
            setStatus('', null);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { Accept: 'application/json' }
                });
                const data = await response.json().catch(() => ({}));

                if (response.ok && data.success) {
                    setStatus('Dziękujemy! Wiadomość wysłana — odezwiemy się wkrótce.', 'success');
                    contactForm.reset();
                    clearQuote();
                } else {
                    setStatus((data && data.message) || `Nie udało się wysłać. Zadzwoń: ${PHONE}.`, 'error');
                }
            } catch (err) {
                setStatus(`Brak połączenia. Spróbuj ponownie lub zadzwoń: ${PHONE}.`, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = original;
            }
        });
    }

})();
