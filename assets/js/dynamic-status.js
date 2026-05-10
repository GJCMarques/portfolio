/* assets/js/dynamic-status.js */

document.addEventListener('DOMContentLoaded', () => {
    const clockElement = document.getElementById('live-clock');
    const titleElement = document.getElementById('status-title');
    const messageElement = document.getElementById('status-message');
    const iconElement = document.getElementById('status-icon');

    const icons = {
        coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
        zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
        moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
        camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
        peace: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"></path><path d="M12 18v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path><circle cx="12" cy="12" r="4"></circle></svg>`,
        code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
        search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
        waves: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C5.8 7 7 5.6 8.5 5.6c1.3 0 2.5 1.4 3.5 1.4 1 0 2.4-1.4 3.5-1.4 1.4 0 2.4 1.4 3.5 1.4 1.2 0 1.9-.5 2.5-1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 1.3 0 2.5-1.4 3.5-1.4 1 0 2.4 1.4 3.5 1.4 1.2 0 2.4-1.4 3.5-1.4 1.4 0 2.4 1.4 3.5 1.4 1.2 0 1.9-.5 2.5-1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 1.3 0 2.5-1.4 3.5-1.4 1 0 2.4 1.4 3.5 1.4 1.2 0 2.4-1.4 3.5-1.4 1.4 0 2.4 1.4 3.5 1.4 1.2 0 1.9-.5 2.5-1"></path></svg>`,
        paint: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l5 5"></path><path d="M5.2 9.6L14.4 20"></path></svg>`,
        beer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"></path><path d="M5 21h12V7H5v14z"></path><path d="M5 3h12"></path><path d="M11 7v14"></path></svg>`,
        book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5V4.5z"></path></svg>`,
        target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`
    };

    const statusMap = {
        0: { // Sunday
            morning: { title: "Slow Living", message: "Domingo é para ler e recarregar a alma.", icon: icons.book },
            afternoon: { title: "Side Projects", message: "Codar por prazer, sem prazos nem pressas.", icon: icons.code },
            late: { title: "Reset & Plan", message: "Organizar a mente para uma nova semana épica.", icon: icons.peace },
            night: { title: "Ready for 01", message: "Tudo alinhado. Segunda-feira, estou pronto.", icon: icons.target }
        },
        1: { // Monday
            morning: { title: "Início de Semana", message: "Café duplo para enfrentar a segunda-feira.", icon: icons.coffee },
            afternoon: { title: "Back to Business", message: "A limpar a inbox e a planear sprints.", icon: icons.zap },
            late: { title: "Primeiro Round", message: "Primeiro dia superado. O Porto brilha lá fora.", icon: icons.waves },
            night: { title: "Estratégia", message: "Planear a semana enquanto a cidade acalma.", icon: icons.moon }
        },
        2: { // Tuesday
            morning: { title: "Full Focus", message: "Terça-feira é dia de produção intensiva.", icon: icons.zap },
            afternoon: { title: "Code Review", message: "A polir detalhes e a caçar bugs.", icon: icons.search },
            late: { title: "Pausa Criativa", message: "Uma caminhada pela Foz para arejar as ideias.", icon: icons.waves },
            night: { title: "Quiet Hours", message: "O silêncio da noite é o melhor depurador.", icon: icons.moon }
        },
        3: { // Wednesday
            morning: { title: "Mid-week Energy", message: "Metade da semana! O ritmo está alto.", icon: icons.zap },
            afternoon: { title: "Interface Design", message: "Figma e café. A combinação perfeita.", icon: icons.paint },
            late: { title: "Networking", message: "A buscar inspiração na comunidade do Porto.", icon: icons.peace },
            night: { title: "Refining", message: "Ajustar animações até estarem perfeitas.", icon: icons.code }
        },
        4: { // Thursday
            morning: { title: "Sprint Final", message: "Quinta-feira é dia de fechar grandes módulos.", icon: icons.zap },
            afternoon: { title: "QA Testing", message: "Nada escapa ao olhar clínico de um dev.", icon: icons.search },
            late: { title: "Quase lá", message: "A pensar na imperial de amanhã, mas focado.", icon: icons.beer },
            night: { title: "Build Time", message: "A compilar os sucessos do dia.", icon: icons.moon }
        },
        5: { // Friday
            morning: { title: "TGIF Prep", message: "Manhã de fecho. Tudo pronto para o deploy.", icon: icons.coffee },
            afternoon: { title: "Deploy Friday", message: "Sim, eu faço deploys à sexta. Com confiança.", icon: icons.zap },
            late: { title: "Relax Mode", message: "O fim de semana começa agora nas Virtudes.", icon: icons.beer },
            night: { title: "Offline Vibes", message: "Computador fechado. Porto, aqui vou eu.", icon: icons.moon }
        },
        6: { // Saturday
            morning: { title: "Lazy Saturday", message: "Pequeno-almoço tardio e zero notificações.", icon: icons.coffee },
            afternoon: { title: "Exploração", message: "A descobrir novos cantos escondidos do Porto.", icon: icons.camera },
            late: { title: "Golden Hour", message: "Câmara na mão e inspiração visual.", icon: icons.camera },
            night: { title: "Night Out", message: "A viver a noite vibrante da Invicta.", icon: icons.moon }
        }
    };

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-PT', { 
            hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });
        if (clockElement) clockElement.textContent = timeString;
    }

    function updateStatus() {
        const now = new Date();
        let day = now.getDay();
        const hour = now.getHours();
        
        // Human perception logic: 
        // If it's before 6 AM, it's still "vibe-wise" the previous day's night
        if (hour < 6) {
            day = (day === 0) ? 6 : day - 1;
        }

        let period;
        if (hour >= 6 && hour < 12) period = 'morning';
        else if (hour >= 12 && hour < 17) period = 'afternoon';
        else if (hour >= 17 && hour < 21) period = 'late';
        else period = 'night'; // This now covers 21h to 05h59

        const current = statusMap[day][period];

        if (titleElement) titleElement.textContent = current.title;
        if (messageElement) messageElement.textContent = current.message;
        if (iconElement) iconElement.innerHTML = current.icon;
    }

    updateClock();
    updateStatus();
    setInterval(updateClock, 1000);
    setInterval(updateStatus, 60000); // Check every minute
});
