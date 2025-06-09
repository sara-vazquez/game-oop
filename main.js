class Game {
    constructor() {
       this.container = document.getElementById("game-container");
       this.personaje = null;
       this.monedas = [];
       this.puntuacion = 0;
       this.crearEscenario();
       this.agregarEventos();
       this.puntosElement = document.getElementById("puntos");
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
               }
           });
       },100);
    }
    actualizarPuntuacion(puntos) {
       this.puntuacion += puntos;
       this.puntosElement.textContent = `Punto: ${this.puntuacion}`;
    }
   }
   
   class Personaje {
       constructor() {
           this.x = 50;
           this.y = 300;
           this.width = 50;
           this.height = 50;
           this.velocidad = 20;
           this.saltando = false;
           this.ultimoSalto = 0; //marca de tiempo del último salto
           this.umbralDobleSalto = 1000; //ms máximos entre dos pulsaciones
           this.element = document.createElement("div");
           this.element.classList.add("personaje");
           this.actualizarPosicion();
       }
       mover(evento) {
         if (evento.key === "ArrowRight") {
           this.x += this.velocidad;
         } else if (evento.key === "ArrowLeft") {
           this.x -= this.velocidad;
         } else if (evento.code === "Space") {
           const ahora = Date.now();
           if (ahora - this.ultimoSalto < this.umbralDobleSalto) {
               this.saltar(20);
           } else {
               this.saltar(10);
           }
           this.ultimoSalto = ahora;
       }
         
         this.actualizarPosicion();
           
       }
       saltar(altura) {
           if (this.saltando) return;
           this.saltando = true;
   
           let alturaMaxima = this.y - altura * 10;
   
           const salto = setInterval(() => {
               if (this.y > alturaMaxima) {
                   this.y -=10;
               }else {
                   clearInterval(salto);
                   this.caer();
               }
               this.actualizarPosicion();
               },20);
       }
   
       caer() {
           const suelo = 300;
           const gravedad = setInterval(() => {
               if (this.y < suelo) {
                   this.y += 10;
               } else {
                   clearInterval(gravedad);
                   this.y = suelo;
                   this.saltando = false;
               }
               this.actualizarPosicion();
           },20)
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
   
   const juego = new Game();
   