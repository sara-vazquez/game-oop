class Game {
    constructor() {
       this.container = document.getElementById("game-container");
       this.personaje = null;
       this.monedas = [];
       this.puntuacion = 0;
       this.witches = [];
       this.over = false;

       this.crearEscenario();
       this.agregarEventos();
       this.puntosElement = document.getElementById("puntos");
       this.witchGenerator();

       this.overlay = document.getElementById('win-overlay');
       this.jugarBtn = document.getElementById('jugar-btn');

       this.jugarBtn.addEventListener("click", () => this.reiniciarJuego());
    }
    crearEscenario() {
       this.personaje = new Personaje();
       this.container.appendChild(this.personaje.element);
       for (let i = 0; i < 30; i++) {
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

           this.witches.forEach((witch) => {
            if (this.personaje.colisionaCon(witch)) {
                this.gameOver();
            }
           });
       },100);
    }

    actualizarPuntuacion(puntos) {
       this.puntuacion += puntos;
       this.puntosElement.textContent = `puntos ${this.puntuacion}/300: `;
    }

    mostrarVentanaGanadora(){
        this.overlay.style.display = 'flex';
        const winMessage = document.getElementById('win-message');
        winMessage.innerText = `¡enhorabuena!`;
        const modalText = document.getElementById('modal-text');
        modalText.innerText = `has ganado el juego 🏆✨`;
        this.gameStarted = false;
        
        clearInterval(this.witchInterval);
        this.witches.forEach(witch => {
        if (this.container.contains(witch.element)) {
        this.container.removeChild(witch.element);
    }
        });
        this.witches = [];
    }

    witchGenerator(){
        this.witchInterval = setInterval(() => {
            if (this.witches.length < 3) {
                this.createWitch();
            }
        }, 500);
    }

    createWitch() {
        const side = Math.random() < 0.7 ? "left" : "right";

        let witch;
        const type = Math.random();
        if (type < 0.5) {
            witch = new CrawlingWitch(side);
        } else {
            witch = new FlyingWitch(side);
        }

        this.witches.push(witch);
        this.container.appendChild(witch.element);

        const moveInterval = setInterval(() => {
            if (!witch.offScreen()) {
                witch.moves();
            } else {
                clearInterval(moveInterval);
                if (this.container.contains(witch.element)) {
                    this.container.removeChild(witch.element);
                }
                this.witches = this.witches.filter((a) => a !== witch);
            }
        }, 20);
    }

    gameOver(){
        if (!this.over) {
            this.over = true;
            
            setTimeout(() => {
                alert("¡Nooo, las brujas te han atrapado 🧙🏻‍♀️! Ya sabemos cuál será su próximo ingrediente en la poción...🪦 ")
                clearInterval(this.witchInterval);
                this.witches.forEach(witch => {
                    if (this.container.contains(witch.element)) {
                        this.container.removeChild(witch.element);
                    }
                });
                this.witches = [];
                this.container.innerHTML = "";
                new Game();
            }, 100);
        }
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

   class Personaje {
       constructor() {
           this.x = 400;
           this.y = 300;
           this.width = 50;
           this.height = 50;
           this.velocidad = 40;
           this.element = document.createElement("div");
           this.element.classList.add("personaje");
           this.element.classList.add("bounce");
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

   class Witch {
    constructor(side) {
        this.width = 100;
        this.height = 100;
        this.speed = Math.random() * 1 + 1;
        this.side = side;
        this.element = document.createElement("div");
        this.element.classList.add("witch");

        if (side === "left") {
            this.x = -this.width;
            this.dx = this.speed;
        } else {
            this.x = 900;
            this.dx = this.speed;
        }
        this.y = 0;
        this.updatePosition();
    }

    updatePosition(){
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";

    }

    moves() {
        this.x += this.dx;
        this.updatePosition();
    }

    offScreen() {
        return this.side === "left" ? this.x > 1000 : this.x + this.width < 0;
    }
}

    class CrawlingWitch extends Witch {
        constructor(side) {
            super(side);
            this.element.classList.add("crawling-witch");
            this.y = 300;
            this.updatePosition();
        }
    }

    class FlyingWitch extends Witch {
        constructor(side) {
            super(side);
            this.element.classList.add("flying-witch");
            this.y = 100;
            this.updatePosition();
        }
    }

    const jugarBtn = document.getElementById('jugar-btn');   
    jugarBtn.addEventListener('click', () => {
     location.reload();
    });

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
   
   const juego = new Game();
   