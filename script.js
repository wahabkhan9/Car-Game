class Car {
    constructor(carElement, gameArea) {
      this.element = carElement;
      this.gameArea = gameArea;
      this.x = 100;
      this.y = gameArea.offsetHeight / 2 - carElement.offsetHeight / 2;
      this.speed = 0;
      this.acceleration = 0.4;
      this.maxSpeed = 5;
      this.friction = 0.1;
      this.angle = 0;
      this.turningSpeed = 2;
      this.controls = { forward: false, backward: false, left: false, right: false };
      this.updatePosition();
    }
  
    update() {
      if (this.controls.forward) this.speed += this.acceleration;
      if (this.controls.backward) this.speed -= this.acceleration;
      if (!this.controls.forward && !this.controls.backward) {
        if (this.speed > 0) { this.speed -= this.friction; if (this.speed < 0) this.speed = 0; }
        if (this.speed < 0) { this.speed += this.friction; if (this.speed > 0) this.speed = 0; }
      }
      if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
      if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;
      if (this.controls.left) this.angle -= this.turningSpeed;
      if (this.controls.right) this.angle += this.turningSpeed;
  
      this.x += this.speed * Math.cos(this.angle * Math.PI / 180);
      this.y += this.speed * Math.sin(this.angle * Math.PI / 180);
  
      const areaWidth = this.gameArea.offsetWidth;
      const areaHeight = this.gameArea.offsetHeight;
      if (this.x < 0) this.x = 0;
      if (this.x + this.element.offsetWidth > areaWidth) this.x = areaWidth - this.element.offsetWidth;
      if (this.y < 0) this.y = 0;
      if (this.y + this.element.offsetHeight > areaHeight) this.y = areaHeight - this.element.offsetHeight;
  
      this.updatePosition();
    }
  
    updatePosition() {
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
      this.element.style.transform = `rotate(${this.angle}deg)`;
    }
  }
  
  class Game {
    constructor(car, parkingSpots, messageElement, scoreElement, restartButton) {
      this.car = car;
      this.parkingSpots = parkingSpots;
      this.messageElement = messageElement;
      this.scoreElement = scoreElement;
      this.restartButton = restartButton;
      this.score = 0;
      this.spotOrder = this.shuffle([...Array(this.parkingSpots.length).keys()]);
      this.currentTargetIndex = 0;
      this.parkedSpots = new Set();
      this.lastParkedSpot = null;
      this.isGameOver = false;
      this.init();
      this.showNextTarget();
    }
  
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    init() {
      window.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'ArrowRight': this.car.controls.right = true; break;
          case 'ArrowLeft': this.car.controls.left = true; break;
          case 'ArrowUp': this.car.controls.forward = true; break;
          case 'ArrowDown': this.car.controls.backward = true; break;
        }
      });
  
      window.addEventListener('keyup', (e) => {
        switch (e.key) {
          case 'ArrowRight': this.car.controls.right = false; break;
          case 'ArrowLeft': this.car.controls.left = false; break;
          case 'ArrowUp': this.car.controls.forward = false; break;
          case 'ArrowDown': this.car.controls.backward = false; break;
        }
      });
  
      this.gameLoop();
    }
  
    gameLoop() {
      if (this.isGameOver) {
        return; // 🔥 Stop the loop if game is over (win or lose)
      }
      this.car.update();
      this.checkParking();
      requestAnimationFrame(() => this.gameLoop());
    }
  
    checkParking() {
      const carRect = this.car.element.getBoundingClientRect();
      let isInsideAnySpot = false;
  
      for (let i = 0; i < this.parkingSpots.length; i++) {
        const spot = this.parkingSpots[i];
        const spotRect = spot.getBoundingClientRect();
  
        const carCenterX = carRect.left + carRect.width / 2;
        const carCenterY = carRect.top + carRect.height / 2;
        const spotCenterX = spotRect.left + spotRect.width / 2;
        const spotCenterY = spotRect.top + spotRect.height / 2;
  
        const inX = Math.abs(carCenterX - spotCenterX) < 20;
        const inY = Math.abs(carCenterY - spotCenterY) < 15;
  
        if (inX && inY) {
          isInsideAnySpot = true;
  
          if (this.lastParkedSpot !== i) {
            if (this.parkedSpots.has(i)) {
              this.gameOver("❌ Already used spot!");
              return;
            }
            if (i !== this.spotOrder[this.currentTargetIndex]) {
              this.gameOver("❌ Wrong spot!");
              return;
            }
  
            this.parkedSpots.add(i);
            this.lastParkedSpot = i;
            if (spot.classList.contains('green')) this.incrementScore(200);
            else if (spot.classList.contains('gray')) this.incrementScore(100);
            this.currentTargetIndex++;
  
            if (this.currentTargetIndex >= this.spotOrder.length) {
              this.winGame();
            } else {
              this.showNextTarget();
            }
          }
  
          this.messageElement.textContent = "✅ Parked Successfully!";
          return;
        }
      }
  
      if (!isInsideAnySpot && this.messageElement.textContent === "✅ Parked Successfully!") {
        this.messageElement.textContent = "";
        this.lastParkedSpot = null;
      }
    }
  
    incrementScore(points) {
      this.score += points;
      this.scoreElement.textContent = `Score: ${this.score}`;
    }
  
    gameOver(message) {
      this.messageElement.textContent = message;
      this.car.speed = 0;
      this.isGameOver = true;
      this.restartButton.style.display = 'block';
    }
  
    winGame() {
      this.messageElement.textContent = "🏆 Congratulations! You have parked all cars perfectly!";
      this.car.speed = 0;
      this.isGameOver = true;
      this.restartButton.style.display = 'block';
    }
  
    showNextTarget() {
      this.parkingSpots.forEach(spot => spot.classList.remove('blue'));
      if (this.currentTargetIndex < this.spotOrder.length) {
        const targetSpot = this.parkingSpots[this.spotOrder[this.currentTargetIndex]];
        targetSpot.classList.add('blue');
      }
    }
  }
  
  function generateParkingSpots(gameArea) {
    const spots = [];
    for (let i = 0; i < 6; i++) {
      const spot = document.createElement('div');
      spot.classList.add('parking-spot');
      spot.classList.add(i % 2 === 0 ? 'green' : 'gray');
      spot.innerText = i + 1;
      spot.style.top = '30%';
      spot.style.left = `${10 + i * 13}%`;
      gameArea.appendChild(spot);
      spots.push(spot);
    }
    return spots;
  }
  
  window.onload = () => {
    const carElement = document.getElementById('car');
    const gameArea = document.getElementById('gameArea');
    const messageElement = document.getElementById('message');
    const scoreElement = document.getElementById('score');
    const restartButton = document.getElementById('restartBtn');
  
    const parkingSpots = generateParkingSpots(gameArea);
    const car = new Car(carElement, gameArea);
    const game = new Game(car, parkingSpots, messageElement, scoreElement, restartButton);
  
    restartButton.addEventListener('click', () => location.reload());
  };