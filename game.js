document.addEventListener("DOMContentLoaded", function() {
    const player = document.getElementById("player");
    const gameContainer = document.getElementById("game-container");
    const scoreDisplay = document.getElementById("score-value");
    const platform = document.getElementById("platform");

    let playerX = 0;
    let playerY = 0;
    let platformX = platform.style.left;
    let platformY = platform.style.top;
    let score = 0;
    let bullets = [];
    let canShoot = true;
    let canShoot2 = true;

    
    
  
    function movePlayer(x, y) { //рух гравця
      player.style.left = x + "px";
      player.style.bottom = y + "px";
    }

    function spawnSpike() { //спавн шипів
        const spike = document.createElement("div");
        spike.classList.add("spike");
        spike.style.top = 360;
        spike.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - 10)) + "px";
        gameContainer.appendChild(spike);
        return spike;
    }

    for (let i = 0; i < 5; i++) { //кількість шипів
        spawnSpike();
    }

    

    function spawnItem() { //спавн червоних квадратів
        const item = document.createElement("div");
        item.classList.add("item");
        const size = Math.floor(Math.random() * (25 - 7 + 1)) + 7;
        item.style.top = "0px";
        item.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - 10)) + "px";
        item.style.width = size + "px";
        item.style.height = size + "px";
        gameContainer.appendChild(item);
    
        // Animate falling item
        let itemPositionY = 0;
        const fallSpeed = 2;
        const fallInterval = setInterval(() => {
          itemPositionY += fallSpeed;
          item.style.top = itemPositionY + "px";
    
          // Check if the item is below the game scene
          if (itemPositionY > gameContainer.offsetHeight) {
            item.remove();
            clearInterval(fallInterval);
          } else if (checkCollision(player, item)) {
            restartScene();
            item.remove();
            clearInterval(fallInterval);
          } else {
            const spikes = document.querySelectorAll(".spike");
            spikes.forEach(spike => {
                if (checkCollision(player, spike)) {
                    restartScene();
                }
            });
        }
    }, 20);

    
        item.addEventListener("click", function() {//функціонал кліка мишки
          item.style.display = "none";
          score++;
          scoreDisplay.textContent = score;
          clearInterval(fallInterval);
        });
      }
    
      setInterval(spawnItem, 100);
  
    document.addEventListener("keydown", function(event) { //функціонал клавіш
      switch(event.key) {
        case "ArrowLeft":
          playerX -= 20;
          if (playerX < 0) playerX = 0;
          break;
        case "ArrowRight":
          playerX += 20;
          if (playerX > gameContainer.offsetWidth - player.offsetWidth) playerX = gameContainer.offsetWidth - player.offsetWidth;
          break;
        case "ArrowUp":
          if (playerY === 0) {
            player.classList.add("jump");
            playerY += 100; // Відстань стрибка
            movePlayer(playerX, playerY);
            if (playerY >= 100 && playerX >= 171 && playerX <= 329){
              movePlayer(playerX, playerY);
              player.classList.remove("jump");
            }
            else {setTimeout(() => {
              if (playerY !== 0){playerY -= 100;
                player.classList.remove("jump"); // Повертаємо гравця на землю
              movePlayer(playerX, playerY);}
            }, 1500); // Час підйому і падіння в мілісекундах (тут 1000 мс = 1 с)
            
          }}
          break;
        case "ArrowDown":
            if (canShoot) { // Перевірка, чи може гравець випустити пулю
                // Створення пулі та відправка її вверх
                const bullet = document.createElement("div");
                bullet.classList.add("bullet");
                bullet.style.left = playerX + player.offsetWidth / 2 + "px";
                bullet.style.bottom = playerY + player.offsetHeight + "px";
                gameContainer.appendChild(bullet);
    
                // Встановлення флагу, що гравець не може випускати пулю
                canShoot = false;
    
                setTimeout(() => {
                  canShoot = true; // Знову дозволяємо випускати пулю через 5 секунд
                }, 3000);
    
                // Рух пулі вперед
                const bulletSpeed = 5;
                const bulletInterval = setInterval(() => {
                  const bulletY = parseInt(bullet.style.bottom);
                  bullet.style.bottom = bulletY + bulletSpeed + "px";
                  const items = document.querySelectorAll(".item");
                  items.forEach(item => {
                    if (checkCollision(bullet, item)) {
                      bullet.remove();
                      item.remove();
                      scoreDisplay.textContent = score;
                    }
                  });
                  // Перевірка чи пуля вийшла за межі сцени
                  if (parseInt(bullet.style.bottom) > gameContainer.offsetHeight) {
                    bullet.remove();
                    clearInterval(bulletInterval);
                  }
                }, 20);
              }
              break;
              case " ":
                if (canShoot2) {
                    // Перевірка, чи може гравець випустити пулю
                    canShoot2 = false;
                    setTimeout(() => {
                        canShoot2 = true;
                    }, 15000); // Затримка 15 секунд перед наступним випуском куль

                    // Випуск 16 куль в різних напрямках
                    for (let i = 0; i < 32; i++) {
                        const bullet = document.createElement("div");
                        bullet.classList.add("bullet");
                        bullet.style.left = playerX + player.offsetWidth / 2 + "px";
                        bullet.style.bottom = playerY + player.offsetHeight + "px";
                        gameContainer.appendChild(bullet);

                        const angle = (i * 11.25) * (Math.PI / 180); // Кут в радіанах
                        const bulletSpeed = 5;
                        const bulletXSpeed = Math.sin(angle) * bulletSpeed;
                        const bulletYSpeed = Math.cos(angle) * bulletSpeed;

                        const bulletInterval = setInterval(() => {
                            const bulletX = parseFloat(bullet.style.left);
                            const bulletY = parseFloat(bullet.style.bottom);
                            bullet.style.left = bulletX + bulletXSpeed + "px";
                            bullet.style.bottom = bulletY + bulletYSpeed + "px";

                            // Перевірка чи куля вийшла за межі сцени
                            if (bulletX < 0 || bulletX > gameContainer.offsetWidth || bulletY < 0 || bulletY > gameContainer.offsetHeight) {
                                bullet.remove();
                                clearInterval(bulletInterval);
                            }
                            const items = document.querySelectorAll(".item");
                            items.forEach(item => {
                                if (checkCollision(bullet, item)) {
                                    bullet.remove();
                                    item.remove();
                                    scoreDisplay.textContent = score;
                                }
                            });
                        }, 20);
                    }
                }
                break;
        }
        
        movePlayer(playerX, playerY);
    });

    


    
    function checkCollision(rect1, rect2) { //перевірка зіткнення
        const rect1Pos = rect1.getBoundingClientRect();
        const rect2Pos = rect2.getBoundingClientRect();
      
        return !(
          rect1Pos.right < rect2Pos.left ||
          rect1Pos.left > rect2Pos.right ||
          rect1Pos.bottom < rect2Pos.top ||
          rect1Pos.top > rect2Pos.bottom
        );
    }

    function despawnSpikes() {
        const spikes = document.querySelectorAll(".spike"); // Знаходимо всі елементи з класом "spike"
        spikes.forEach(spike => {
            spike.remove(); // Видаляємо кожний елемент зі списку
        });
    }

    function restartScene() { //рестарт гри
        despawnSpikes(); //старі шипи
        playerX = 0;
        playerY = 0;
        movePlayer(playerX, playerY);
        score = 0;
        canShoot = true;
        canShoot2 = true;
        scoreDisplay.textContent = score;
        for (let i = 0; i < 5; i++) { //нові шипи
            spawnSpike();
        }
    }
  });