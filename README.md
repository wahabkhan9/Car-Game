# 🚗 Car Parking Game

A fun and interactive car parking game built entirely with **HTML**, **CSS**, and **JavaScript** using **Object-Oriented Programming (OOP)** principles.

🎮 **Live Demo:** [Play the Game](https://wahabkhan9.github.io/Car-Game/)  

---

## 📄 Project Description

In this game, you control a car and must park it in randomly highlighted spots. Your goal is to park correctly in all designated spots to win the game. The game challenges your coordination, spatial awareness, and logic.

---

## 👨‍💻 OOP Concepts Used

### 🔒 Encapsulation
Each class encapsulates its own data and behavior. For example, the `Car` class manages its internal state (position, speed, angle) and exposes movement behaviors through methods.

### 🎭 Abstraction
Complex logic is hidden behind well-defined class methods. Users interact with high-level game actions, not low-level implementation details.

---

## 🧱 Class Overview

### 🚗 `Car` Class
- Handles movement and steering using arrow key input.
- Uses trigonometry to calculate the car’s real-time position and rotation.
- Implements acceleration, deceleration, and friction for smoother controls.

### 🎮 `Game` Class
- Manages gameplay flow, score, and win/loss logic.
- Randomizes parking spots.
- Tracks successful and failed parking attempts.
- Displays game over or success messages.

---

## 🎯 Features

- 🅿️ **Random Parking Targets** – Parking spots are randomly selected each game.
- ✅ **Win Conditions** – Park correctly in all designated spots to win.
- ❌ **Loss Conditions** – Parking in the wrong spot or repeating a spot ends the game.
- 📦 **Encapsulated Game Logic** – All game mechanics are modular and reusable.
- 🔁 **Replayable** – Refresh to try new random parking challenges.
- 📱 **Responsive Design** – Works well on desktop and tablet screens.

---

## 🚀 Run the Game Locally

```bash
# 1. Clone the repository
git clone https://github.com/wahabkhan9/Car-Game.git

# 2. Navigate to the project directory
cd Car-Game

# 3. Launch the game
# Open index.html in any web browser



