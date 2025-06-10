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
       this.puntosElement.textContent = `puntos: ${this.puntuacion}`;
    }
   }
   
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
   
   const juego = new Game();
   