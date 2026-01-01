const NOMBRE = "Mirellita Milenka";
document.getElementById('persona').innerText = NOMBRE;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let listFireworks = [];
let listRockets = [];
const colors = ['#D4AF37', '#E5E4E2', '#FF69B4', '#AFEEEE', '#FFD700', '#FF4500', '#00FF7F', '#1E90FF'];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function makefireworks(fire, type) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const max = 150;
    const force = Math.random() * 10 + 12;

    for (let i = 0; i < max; i++) {
        let rad = (i * Math.PI * 2) / max;
        let vx, vy;
        let r = 1;

        switch(type) {
            case "heart":
                vx = 16 * Math.pow(Math.sin(rad), 3);
                vy = -(13 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad));
                r = force / 15; vx *= r; vy *= r;
                break;
            case "star":
                r = (1 + 0.8 * Math.sin(rad * 5)) * force;
                vx = Math.cos(rad) * r;
                vy = Math.sin(rad) * r;
                break;
            case "flower":
                r = (Math.abs(Math.cos(rad * 3)) * 1.5 + 0.5) * force * 1.5;
                vx = Math.cos(rad) * r;
                vy = Math.sin(rad) * r;
                break;
            case "square":
                r = (1 / Math.max(Math.abs(Math.cos(rad)), Math.abs(Math.sin(rad)))) * force;
                vx = Math.cos(rad) * r;
                vy = Math.sin(rad) * r;
                break;
            case "spiral":
                r = (rad / Math.PI) * force * 2;
                vx = Math.cos(rad * 3) * r;
                vy = Math.sin(rad * 3) * r;
                break;
            default:
                let rf = force * (0.8 + Math.random() * 0.8);
                vx = Math.cos(rad) * rf;
                vy = Math.sin(rad) * rf;
        }

        listFireworks.push({
            x: fire.x, y: fire.y, vx: vx, vy: vy,
            size: Math.random() * 2 + 1.2, fill: color,
            alpha: 1, friction: 0.95, gravity: 0.15, flicker: Math.random() * 0.4
        });
    }
}

function launchRocket() {
    listRockets.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        tx: Math.random() * canvas.width,
        ty: Math.random() * (canvas.height * 0.7), 
        vy: -(Math.random() * 5 + 15)
    });
}

function loop() {
    ctx.fillStyle = 'rgba(0, 5, 10, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    listRockets.forEach((r, i) => {
        r.y += r.vy;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fill();
        if (r.y <= r.ty) {
            const s = ["circle", "heart", "star", "flower", "square", "spiral"];
            makefireworks({x: r.x, y: r.y}, s[Math.floor(Math.random() * s.length)]);
            listRockets.splice(i, 1);
        }
    });

    listFireworks.forEach((f, i) => {
        f.vx *= f.friction;
        f.vy *= f.friction;
        f.vy += f.gravity;
        f.x += f.vx;
        f.y += f.vy;
        f.alpha -= 0.012; 

        if (f.alpha > 0) {
            ctx.globalAlpha = f.alpha + (Math.random() < 0.5 ? f.flicker : 0);
            ctx.fillStyle = f.fill;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            listFireworks.splice(i, 1);
        }
    });
    requestAnimationFrame(loop);
}

// Eventos de la ventanita
const btnMensaje = document.getElementById('btn-mensaje');
const modalMensaje = document.getElementById('modal-mensaje');
const closeBtn = document.getElementById('close-btn');

btnMensaje.onclick = () => modalMensaje.style.display = 'flex';
closeBtn.onclick = () => modalMensaje.style.display = 'none';
window.onclick = (e) => { if (e.target === modalMensaje) modalMensaje.style.display = 'none'; };

setInterval(launchRocket, 400); // Un poco más rápido para Bárbara
loop();