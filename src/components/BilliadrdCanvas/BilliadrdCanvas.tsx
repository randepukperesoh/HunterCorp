import React, { useRef, useEffect } from 'react';
import { SettingsInterface } from '../../App';
import './BilliadrdCanvas.css'
interface Ball {
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  corner: number;
}
interface CanvasProps {
  settings: SettingsInterface;
}

export const BilliadrdCanvas: React.FC<CanvasProps> = ({settings}) => {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let balls :Ball[] = [
    { x: 50, y: 50, radius: 10, color: 'red', speed:0, corner: 0},
    { x: 150, y: 150, radius: 15, color: 'green', speed:0, corner: 0},
    { x: 100, y: 100, radius: 13, color: 'blue', speed:0, corner: 0},
  ];

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const drawBalls = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
      });
    };
    balls.forEach((ball, index) => {
        if (ball.speed !== 0) {
            if( (ball.x - ball.radius <= 0 || ball.x + ball.radius >= settings.width || ball.y - ball.radius <= 0 || ball.y + ball.radius >= settings.height) ) {
                ball.corner = ball.corner + 90;
            }
            const newSpeed = ball.speed * 0.98;
            const newX = ball.x - newSpeed * Math.cos(ball.corner * Math.PI / 180);
            const newY = ball.y - newSpeed * Math.sin(ball.corner * Math.PI / 180);
            balls.forEach((otherBall, otherIndex) => {
                if (index !== otherIndex) {
                    const distance = Math.sqrt((newX - otherBall.x) ** 2 + (newY - otherBall.y) ** 2);
                    if (distance < ball.radius + otherBall.radius) {
                        ball.corner = ball.corner + 90;
                        ball.speed = ball.speed * 0.8;
                        otherBall.corner = otherBall.corner + 90;
                        otherBall.speed = otherBall.speed + (ball.speed / 2)
                    }
                }
            });
            ball.x = newX;
            ball.y = newY;
            ball.speed = newSpeed;
        }
      });
      drawBalls();
      requestAnimationFrame(animate);
  }
  useEffect(() => {
    animate();
  }, []);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if(!e.altKey) return;
    const canvas = canvasRef.current;
    const rect = canvas ? canvas.getBoundingClientRect() : {left: 0, top: 0};
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    balls = balls.map((ball) => {
        if ((ball.x - ball.radius <= mouseX && mouseX <= ball.x + ball.radius) && (ball.y - ball.radius <= mouseY && mouseY <= ball.y + ball.radius))
            {
            const endX = mouseX;
            const endY = mouseY;
            const angle = Math.atan2(endY - ball.y, endX - ball.x) * 180 / Math.PI;
            const positiveAngle = (angle < 0) ? 360 + angle : angle;       
            return{ x: ball.x, y: ball.y, radius: ball.radius, color: ball.color, speed: settings.speed, corner: positiveAngle, picked: false }
            }
        return ball;
      });
  };

  const handleClick = (_e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      let mouseX = e.clientX - rect.left;
      let mouseY = e.clientY - rect.top;
  
      balls.forEach((ball) => {
          if ((ball.x - ball.radius <= mouseX && mouseX <= ball.x + ball.radius) && (ball.y - ball.radius <= mouseY && mouseY <= ball.y + ball.radius)) {
              const menu = document.getElementById('menu');
              if (menu) {
                  menu.style.display = 'block';
                  menu.style.left = `${e.clientX}px`;
                  menu.style.top = `${e.clientY}px`;
  
                  // Обработчик выбора цвета
                  let menuClickHandler  = (event : Event) => {
                    event.stopPropagation();
                    const target = event.target as HTMLElement;
                    if (target.tagName === 'LI') {
                      const color = target.dataset.color;
                        if (color) {
                          ball.color = color;
                        }
                        menu.style.display = 'none';
                        menu.removeEventListener('click', menuClickHandler)
                    }
                  };
  
                  // Добавляем новый обработчик click
                  menu.addEventListener('click', menuClickHandler);
              }
          }
      });
  });
};
  

const addBall = () => {
  balls.push({ x: Math.floor(Math.random() * settings.width ), y: Math.floor(Math.random() * settings.height ), radius: 5 + Math.floor(Math.random() * 10 ), color: 'red', speed:0, corner: 0 })
}
  return (
    <div>
      <div className='settingsWrapper'>
        <button onClick={addBall}>Добавить шар</button>
        <div>
        Зажмите Alt что бы ударить шар
        </div>
      </div>
      <canvas style={{border: '1px solid white'}}
        ref={canvasRef}
        width={settings.width}
        height={settings.height}
        onMouseMove={ handleMouseMove }
        onClick={handleClick}
      />
      <div id="menu" style={{position: 'absolute', display: 'none', background: 'white', border:' 1px solid black', padding: '5px'}}>
        <ul style={{listStyleType: 'none', padding: '0', margin: '0'}}>
          <li data-color="red" style={{cursor: 'pointer', padding: '5px', background: 'red', color: 'white'}}>Red</li>
          <li data-color="green" style={{cursor: 'pointer', padding: '5px', background: 'green', color: 'white'}}>Green</li>
          <li data-color="blue" style={{cursor: 'pointer', padding: '5px', background: 'blue', color: 'white'}}>Blue</li>
        </ul>
      </div>

    </div>
  );
};

