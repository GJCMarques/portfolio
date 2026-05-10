/* assets/js/dynamic-status.js */

document.addEventListener('DOMContentLoaded', () => {
    const clockElement = document.getElementById('live-clock');
    const titleElement = document.getElementById('status-title');
    const messageElement = document.getElementById('status-message');
    const iconElement = document.getElementById('status-icon');

    const statusData = {
        // Monday - Friday
        workday: {
            morning: {
                title: "Café & Código",
                message: "A injetar cafeína para começar o dia no Porto. Vamos a isto!",
                icon: "☕"
            },
            afternoon: {
                title: "Deep Work",
                message: "Focado em transformar pixels em experiências de alta performance.",
                icon: "🚀"
            },
            evening: {
                title: "Sunset no Porto",
                message: "Trabalho feito. Tempo de apreciar a vista e recarregar baterias.",
                icon: "🍷"
            },
            night: {
                title: "Modo Coruja",
                message: "A magia acontece quando o resto do mundo decide ir dormir.",
                icon: "✨"
            }
        },
        // Weekend
        weekend: {
            day: {
                title: "Offline... quase",
                message: "A explorar o Porto e a buscar inspiração fora do ecrã.",
                icon: "📸"
            },
            night: {
                title: "Domingo de Paz",
                message: "A planear uma semana épica. O Porto nunca dorme.",
                icon: "🧘‍♂️"
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
        const day = now.getDay(); // 0 is Sunday, 6 is Saturday
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
        if (iconElement) iconElement.textContent = currentStatus.icon;
    }

    // Initial run
    updateClock();
    updateStatus();

    // Update clock every second
    setInterval(updateClock, 1000);
    
    // Update status every 5 minutes (300,000 ms)
    setInterval(updateStatus, 300000);
});
