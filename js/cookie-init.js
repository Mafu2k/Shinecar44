(function () {
    'use strict';

    function syncConsentMode() {
        var analytics = CookieConsent.acceptedCategory('analytics') ? 'granted' : 'denied';
        var marketing = CookieConsent.acceptedCategory('marketing') ? 'granted' : 'denied';
        gtag('consent', 'update', {
            analytics_storage: analytics,
            ad_storage: marketing,
            ad_user_data: marketing,
            ad_personalization: marketing
        });
    }

    CookieConsent.run({
        guiOptions: {
            consentModal: { layout: 'box', position: 'bottom left' },
            preferencesModal: { layout: 'box' }
        },
        onFirstConsent: syncConsentMode,
        onConsent: syncConsentMode,
        onChange: syncConsentMode,
        categories: {
            necessary: { enabled: true, readOnly: true },
            analytics: {},
            marketing: {}
        },
        language: {
            default: 'pl',
            translations: {
                pl: {
                    consentModal: {
                        title: 'Używamy plików cookie 🍪',
                        description: 'Korzystamy z plików cookie, aby analizować ruch na stronie i mierzyć skuteczność reklam. Niezbędne działają zawsze, resztę włączasz sam.',
                        acceptAllBtn: 'Akceptuj wszystkie',
                        acceptNecessaryBtn: 'Odrzuć',
                        showPreferencesBtn: 'Ustawienia',
                        footer: '<a href="#contact">Kontakt</a>'
                    },
                    preferencesModal: {
                        title: 'Ustawienia plików cookie',
                        acceptAllBtn: 'Akceptuj wszystkie',
                        acceptNecessaryBtn: 'Odrzuć wszystkie',
                        savePreferencesBtn: 'Zapisz wybór',
                        closeIconLabel: 'Zamknij',
                        sections: [
                            {
                                title: 'Pliki niezbędne',
                                description: 'Konieczne do poprawnego działania strony. Nie można ich wyłączyć.',
                                linkedCategory: 'necessary'
                            },
                            {
                                title: 'Pliki analityczne',
                                description: 'Pomagają zrozumieć, jak odwiedzający korzystają ze strony (np. Google Analytics). Dane są anonimowe i zbiorcze.',
                                linkedCategory: 'analytics'
                            },
                            {
                                title: 'Pliki marketingowe',
                                description: 'Służą do mierzenia skuteczności reklam i wyświetlania dopasowanych treści (np. piksel Meta).',
                                linkedCategory: 'marketing'
                            }
                        ]
                    }
                }
            }
        }
    });

    window.showCookiePreferences = function (e) {
        if (e) e.preventDefault();
        CookieConsent.showPreferences();
    };
})();
