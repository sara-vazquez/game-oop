class Game {
    constructor() {
       this.container = document.getElementById("game-container");
       this.personaje = null;
       this.monedas = [];
       this.puntuacion = 0;

       this.crearEscenario();
       this.agregarEventos();
       this.puntosElement = document.getElementById("puntos");

       this.overlay = document.getElementById('win-overlay');
       this.jugarBtn = document.getElementById('jugar-btn');

       this.jugarBtn.addEventListener("click", () => this.reiniciarJuego());
    }
    crearEscenario() {
       this.personaje = new Personaje();
       this.container.appendChild(this.personaje.element);
       for (let i = 0; i < 10; i++) {
           const moneda = new Moneda();
           this.monedas.push(moneda);
           this.container.appendChild(moneda.element);
       }
    }
    
    agregarEventos() {
       window.addEventListener("keydown", (e) => this.personaje.mover(e));
       this.checkColisiones();
    }
    checkColisiones() {
       setInterval(() => {
           this.monedas.forEach((moneda, index) => {
               if (this.personaje.colisionaCon(moneda)) {
                   this.container.removeChild(moneda.element);
                   this.monedas.splice(index, 1);
                   this.actualizarPuntuacion(10);

                   if (this.monedas.length === 0) {
                    this.mostrarVentanaGanadora();
                   }
               }
           });
       },100);
    }
    actualizarPuntuacion(puntos) {
       this.puntuacion += puntos;
       this.puntosElement.textContent = `puntos 0/100: ${this.puntuacion}`;
    }
    mostrarVentanaGanadora(){
        this.overlay.style.display = 'flex';
        const winMessage = document.getElementById('win-message');
        winMessage.innerText = `¡enhorabuena!`;
        const modalText = document.getElementById('modal-text');
        modalText.innerText = `has ganado el juego 🏆✨`;
        this.gameStarted = false;
    }
    reiniciarJuego() {
        this.overlay.style.display = 'none';
        this.container.innerHTML = ''; 
        this.monedas = []; 
        this.puntuacion = 0; 
        this.personaje = new Personaje();
        this.container.appendChild(this.personaje.element);
        this.crearEscenario(); 
        this.updateScore();
       }
   }

   const toggleSwitch = document.getElementById('toggleMusic');
   const music = document.getElementById('music');

   toggleSwitch.addEventListener('change', function() {
    if (this.checked) {
        music.play();
    }else {
        music.pause();
        music.currentTime = 0;
    }
   });
   music.addEventListener('ended', () => toggleMusic.checked = false);

   class Personaje {
       constructor() {
           this.x = 50;
           this.y = 300;
           this.width = 50;
           this.height = 50;
           this.velocidad = 30;
           this.element = document.createElement("div");
           this.element.classList.add("personaje");
           this.actualizarPosicion();
       }
       mover(evento) {
        if (evento.key === "ArrowRight" && this.x + this.width < 750) {
          this.x += this.velocidad;
        } else if (evento.key === "ArrowLeft" && this.x > 0) {
          this.x -= this.velocidad;
        } else if (evento.key === "ArrowUp" && this.y > 0) {
          this.y -= this.velocidad;
        } else if (evento.key === "ArrowDown" && this.y + this.height < 350) {
          this.y += this.velocidad;
        }
        this.actualizarPosicion();
      }
      
       actualizarPosicion() {
           this.element.style.left = `${this.x}px`;
           this.element.style.top = `${this.y}px`;
       }
       colisionaCon(objeto) {
           return (
             this.x < objeto.x + objeto.width &&
             this.x + this.width > objeto.x &&
             this.y < objeto.y + objeto.height &&
             this.y + this.height > objeto.y
           );
       }
   }
   
   class Moneda {
       constructor() {
           this.x = Math.random() * 700 + 50;
           this.y = Math.random() * 250 + 50;
           this.width = 30;
           this.height = 30;
           this.element = document.createElement("div");
           this.element.classList.add("moneda");
           this.actualizarPosicion();
       }
       actualizarPosicion() {
           this.element.style.left = `${this.x}px`;
           this.element.style.top = `${this.y}px`;
       }
   }

   const jugarBtn = document.getElementById('jugar-btn');   
   jugarBtn.addEventListener('click', () => {
    location.reload();
   });
   
   const juego = new Game();
   