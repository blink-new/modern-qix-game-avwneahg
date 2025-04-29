
# Modern Qix Game

A modern, fully functional browser-based version of the classic arcade game Qix, built with React and Vite.

![Modern Qix Game](https://i.imgur.com/JYqXXXX.png)

## About the Game

Qix is a classic arcade game released by Taito in 1981. The objective is to claim territory on the game board while avoiding enemies. This modern version recreates the gameplay with updated visuals and smooth animations.

## How to Play

1. **Objective**: Claim at least 75% of the screen area to advance to the next level.

2. **Controls**:
   - Arrow keys or WASD to move
   - Hold Shift for faster movement
   - Mobile: On-screen buttons for touch controls

3. **Gameplay Mechanics**:
   - You start on the border of the game area
   - Draw lines by moving away from the border into unclaimed territory
   - Complete a shape by returning to a border or already claimed area
   - The smaller area between your line and the border will be filled
   - Avoid the Qix (colorful spinning shape) and Sparx (yellow dots) while drawing

4. **Enemies**:
   - **Qix**: The main enemy that moves randomly in unclaimed territory
   - **Sparx**: Secondary enemies that patrol the borders and your drawn lines

5. **Scoring**:
   - Points are awarded based on the percentage of the screen claimed
   - Bonus points for completing a level
   - Higher levels introduce more enemies and faster movement

## Features

- Responsive design that works on both desktop and mobile
- Modern neon-style visuals with gradients and glow effects
- Animated enemies with dynamic movement patterns
- Level progression with increasing difficulty
- Lives system and score tracking

## Development

This game is built with:
- React for UI components
- Canvas API for game rendering
- Framer Motion for animations
- Tailwind CSS for styling

## Running Locally

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to the local server address (usually http://localhost:3000)

## Credits

This modern implementation is inspired by the original Qix arcade game by Taito Corporation (1981).