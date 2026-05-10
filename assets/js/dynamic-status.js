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
        peace: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"></path><path d="M12 18v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path><circle cx="12" cy="12" r="4"></circle></svg>`
    };

    const statusData = {
        workday: {
            morning: {
                title: "Café & Código",
                message: "A injetar cafeína para começar o dia no Porto. Vamos a isto!",
                icon: icons.coffee
            },
            afternoon: {
                title: "Deep Work",
                message: "Focado em transformar pixels em experiências de alta performance.",
                icon: icons.zap
            },
            evening: {
                title: "Sunset no Porto",
                message: "Trabalho feito. Tempo de apreciar a vista e recarregar baterias.",
                icon: icons.moon
            },
            night: {
                title: "Modo Coruja",
                message: "A magia acontece quando o resto do mundo decide ir dormir.",
                icon: icons.moon
            }
        },
        weekend: {
            day: {
                title: "Offline... quase",
                message: "A explorar o Porto e a buscar inspiração fora do ecrã.",
                icon: icons.camera
            },
            night: {
                title: "Domingo de Paz",
                message: "A planear uma semana épica. O Porto nunca dorme.",
                icon: icons.peace
            }
        }
    };

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-PT', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        if (clockElement) clockElement.textContent = timeString;
    }

    function updateStatus() {
        const now = new Date();
        const day = now.getDay(); 
        const hour = now.getHours();
        
        let currentStatus;
        const isWeekend = (day === 0 || day === 6);

        if (isWeekend) {
            if (hour >= 6 && hour < 19) {
                currentStatus = statusData.weekend.day;
            } else {
                currentStatus = statusData.weekend.night;
            }
        } else {
            if (hour >= 6 && hour < 12) {
                currentStatus = statusData.workday.morning;
            } else if (hour >= 12 && hour < 19) {
                currentStatus = statusData.workday.afternoon;
            } else if (hour >= 19 && hour < 23) {
                currentStatus = statusData.workday.evening;
            } else {
                currentStatus = statusData.workday.night;
            }
        }

        if (titleElement) titleElement.textContent = currentStatus.title;
        if (messageElement) messageElement.textContent = currentStatus.message;
        if (iconElement) iconElement.innerHTML = currentStatus.icon;
    }

    updateClock();
    updateStatus();
    setInterval(updateClock, 1000);
    setInterval(updateStatus, 300000);
});
