document.addEventListener("DOMContentLoaded", function() {
  const player = document.getElementById("player");
  const gameContainer = document.getElementById("game-container");
  const scoreDisplay = document.getElementById("score-value");
  const HPDisplay = document.getElementById("HP-value");
  const platform = document.getElementById("platform");


  let playerX = 0;
  let playerY = 0;
  let platformX = platform.style.left;
  let platformY = platform.style.top;
  let score = 0;
  let bullets = [];
  let canShoot = true;
  let canShoot2 = true;
  let onPlat = false;
  

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
  
      // Падіння айтемів
      let itemPositionY = 0;
      const fallSpeed = 2;
      const fallInterval = setInterval(() => {
        itemPositionY += fallSpeed;
        item.style.top = itemPositionY + "px";
  
        // Видалення айтемів за фреймом   //p. s. куча невідокремленого лишнього
        if (itemPositionY > gameContainer.offsetHeight) {
          item.remove();
          clearInterval(fallInterval);
        } else if (checkCollision(player, item)) { //item coll pl
          HPDisplay.textContent = parseInt(HPDisplay.textContent) - 25; //-hp
          item.remove(); //-item
          clearInterval(fallInterval);
        } else {
          const spikes = document.querySelectorAll(".spike");
          spikes.forEach(spike => {
              if (checkCollision(player, spike)) { //spike coll pl
                HPDisplay.textContent = parseInt(HPDisplay.textContent) - 1; //-hp  
        } else if(HPDisplay.textContent<=0){restartScene();  //перевірка hp
        } else {
          const circles = document.querySelectorAll(".circle"); 
          circles.forEach(circle => { //circ coll pl
            if (checkCollision(player, circle)){
              HPDisplay.textContent = parseInt(HPDisplay.textContent) + 50; //хілка
              circle.remove(); //-circ
            }
          })
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

  function spawnGoldItem() { //спавн Золотих квадратів 
    const gold_item = document.createElement("div");
    gold_item.classList.add("gold_item");
    const size = Math.floor(Math.random() * (25 - 7 + 1)) + 7;
    gold_item.style.top = "0px";
    gold_item.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - 10)) + "px";
    gold_item.style.width = size + "px";
    gold_item.style.height = size + "px";
    gameContainer.appendChild(gold_item);

    // Падіння айтемів
    let gold_itemPositionY = 0;
    const fallSpeed = 2;
    const fallInterval = setInterval(() => {
      gold_itemPositionY += fallSpeed;
      gold_item.style.top = gold_itemPositionY + "px";

      // Видалення айтемів за фреймом   //p. s. куча невідокремленого лишнього
      if (gold_itemPositionY > gameContainer.offsetHeight) {
        gold_item.remove();
        clearInterval(fallInterval);
      } else if (checkCollision(player, gold_item)) { //item coll pl
        HPDisplay.textContent = parseInt(HPDisplay.textContent) - 75; //-hp
        gold_item.remove(); //-item
        clearInterval(fallInterval);
      }}, 20);

    gold_item.addEventListener("click", function() {//функціонал кліка мишки
      gold_item.style.display = "none";
      score+=3;
      scoreDisplay.textContent = score;
      clearInterval(fallInterval);
    });
  }

  setInterval(spawnGoldItem, 1000);

  document.addEventListener("keydown", function(event) { //функціонал клавіш
    switch(event.key) {
      case "a":
        if (onPlat === false || (playerY >= 100 && playerX > 200 && playerX < 510) || 
        (playerY >= 100 && playerX > 900)){  
          playerX -= 20;
          if (playerX < 0) playerX = 0; 
        }
        break;
      case "d":
        if (onPlat === false || (playerY >= 100 && playerX < 480) || 
        (playerY >= 100 && playerX > 800 && playerX < 1080)){
          playerX += 20;
          if (playerX > gameContainer.offsetWidth - player.offsetWidth) playerX = gameContainer.offsetWidth - player.offsetWidth;
        }
        break;
      case "w": //171 //519 //871 //1119
        if (playerY === 100 && ((playerX >= 171 && playerX <= 519) || (playerX >= 871 && playerX <= 1119))){   
          player.classList.add("jump2");
          playerY += 100; // Відстань стрибка
          movePlayer(playerX, playerY);
          {setTimeout(() => {
            if (playerY !== 0){playerY -= 100;
              player.classList.remove("jump2"); // Повертаємо гравця на землю
            movePlayer(playerX, playerY);}
          }, 1500); // Час підйому і падіння в мілісекундах 
        }}
        if ((playerY === 0) && (playerX < 171 || (playerX > 519 && playerX < 871) || playerX > 1119)) {   
          player.classList.add("jump");
          playerY += 100; // Відстань стрибка
          movePlayer(playerX, playerY);
          {setTimeout(() => {
            if (playerY !== 0){playerY -= 100;
              player.classList.remove("jump"); // Повертаємо гравця на землю
            movePlayer(playerX, playerY);}
          }, 1500); // Час підйому і падіння в мілісекундах 
        }}
        if (playerY === 0 && ((playerX >= 171 && playerX <= 519) || (playerX >= 871 && playerX <= 1119))){
          onPlat = true;
          playerY += 100;
          movePlayer(playerX, playerY);
        }
        
        break;
      case " ":
        if(playerY === 0){
          player.classList.add("minjump");
          playerY += 60;
          movePlayer(playerX, playerY);
          {setTimeout(() => {
            if (playerY !== 0){playerY -= 60;
              player.classList.remove("minjump"); // Повертаємо гравця на землю
            movePlayer(playerX, playerY);}
          }, 1125); // Час підйому і падіння в мілісекундах 
      }}
        break;
      case "s":
        if (onPlat){
          onPlat = false;
          playerY -= 100;
          movePlayer(playerX, playerY);
        }
        break;
      case "1":
        spawnCircle();
        break;
      case "q":
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
                const items = document.querySelectorAll(".item"); //item coll bull
                items.forEach(item => {
                  if (checkCollision(bullet, item)) {
                    bullet.remove();
                    item.remove();
                    scoreDisplay.textContent = score;
                  }
                const gold_items = document.querySelectorAll(".gold_item"); //gitem coll bull
                gold_items.forEach(gold_item => {
                  if (checkCollision(bullet, gold_item)){
                    bullet.remove();
                    gold_item.remove();
                  }
                })
                });
                // Перевірка чи пуля вийшла за межі сцени
                if (parseInt(bullet.style.bottom) > gameContainer.offsetHeight) {
                  bullet.remove();
                  clearInterval(bulletInterval);
                }
              }, 20);
            }
            break;
            case "e":
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
                          const gold_items = document.querySelectorAll(".gold_item"); //gitem coll bull
                          gold_items.forEach(gold_item => {
                            if (checkCollision(bullet, gold_item)) {
                              bullet.remove();
                              gold_item.remove();
                              scoreDisplay.textContent = score;
                            }
                          })
                          const items = document.querySelectorAll(".item"); //item coll bull
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



  function spawnCircle() { //спавн круга
    if(score >= 10){
    const circle = document.createElement("div");
    circle.classList.add("circle");
    circle.style.top = "280px";
    circle.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - 50)) + "px";
    gameContainer.appendChild(circle);
    score -= 10;
    scoreDisplay.textContent = score;
  }}


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
      HPDisplay.textContent = 100;
      playerX = 0;
      playerY = 0;
      movePlayer(playerX, playerY);
      score = 0;
      canShoot = true;
      canShoot2 = true;
      onPlat = false;
      scoreDisplay.textContent = score;
      for (let i = 0; i < 5; i++) { //нові шипи
          spawnSpike();
      }
  }
});
