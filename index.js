document.addEventListener('DOMContentLoaded', () => {
  // Get body to attach canvas
  const body = document.querySelector('body')
  const canvasElement = document.createElement('canvas')
  canvasElement.setAttribute('id', 'game')
  body.append(canvasElement)

  // Get canvas and set it's width and height
  const canvas = document.getElementById('game')
  canvas.setAttribute('width', '400px')
  canvas.setAttribute('height', '250px')

  // Get context to draw on it
  const ctx = canvas.getContext('2d')
  const ctxWidth = 400
  const ctxHeight = 250
  ctx.fillStyle = 'lightgrey'
  ctx.fillRect(0, 0, ctxWidth, ctxHeight)
  
  document.addEventListener('keydown', changeDirection)
  var timeFrame = 300

  //document.addEventListener(KeyboardEvent,)

  let snake = [
    {x: 30, y: 100},
    {x: 20, y: 100},
    {x: 10, y: 100}
  ]

  let direction = 0
  let gameIsGoing = true
  let paused = false
  let wasPaused = false
  
  const headXY = [
    {x1: 0, y1: -2, x2: 13, y2: 5, x3: 0, y3: 12},
    {x1: -2, y1: 0, x2: 5, y2: 13, x3: 12, y3: 0},
    {x1: 10, y1: -2, x2: -3, y2: 5, x3: 10, y3: 12},
    {x1: -2, y1: 10, x2: 5, y2: -3, x3: 12, y3: 10},
  ]
  //const no_Dir = [0, 1, 2, 3]

  let dx = [ 10, 0, -10, 0 ]
  let dy = [ 0, 10, 0, -10 ]

    
  function drawSnake(){
    ctx.fillStyle = 'green'
    ctx.strokeStyle = 'black'
    snake.forEach(part => {
      ctx.fillRect(part.x,part.y,10,10)
      ctx.strokeRect(part.x,part.y,10,10)
    })
    if (gameIsGoing) {ctx.fillStyle = 'yellow'}
    else {ctx.fillStyle = 'red'}
    ctx.beginPath()
    ctx.moveTo(snake[0].x + headXY[direction].x1, snake[0].y + headXY[direction].y1)
    ctx.lineTo(snake[0].x + headXY[direction].x2, snake[0].y + headXY[direction].y2)
    ctx.lineTo(snake[0].x + headXY[direction].x3, snake[0].y + headXY[direction].y3)
    ctx.lineTo(snake[0].x + headXY[direction].x1, snake[0].y + headXY[direction].y1)
    ctx.fill()
    ctx.closePath()
    ctx.stroke()
  }
  
  let snakeEats = false

  function moveSnake(){
    const head = snake[0]
    const newHead = {
      x: head.x + dx[direction],
      y: head.y + dy[direction]
    }

    snake.forEach(part => {
      if (newHead.x === part.x && newHead.y === part.y){
        gameIsGoing = false
      ended()
      }
    })

    //checkIfSnakeTouchesWall()

    if (!gameIsGoing) {return}

    for (let i=0; i<3; i++){
      if (newHead.x === apples[i].x && newHead.y === apples[i].y){
        snakeEats = true
        createApple()
        apples[i].x = foodX
        apples[i].y = foodY
      }
    }

    snake.unshift(newHead)
    if (!snakeEats) {
      snake.pop()
    } else {
      score = score + 1
      const scoreEl = document.getElementById('score')
      scoreEl.innerText = 'Wynik: ' + score
      snakeEats = false
    }
  }

  function clrCanvas(){
  ctx.fillStyle = 'lightgrey'
  ctx.fillRect(0, 0, ctxWidth, ctxHeight)
  ctx.strokeStyle = 'brown'
  ctx.strokeRect(4, 4, ctxWidth - 8, ctxHeight - 8)
  }

  
  function changeDirection(event) {
    const key = event.keyCode
    const LEFT_KEY = 37
    const RIGHT_KEY = 39
    const UP_KEY = 38
    const DOWN_KEY = 40
    const P_KEY = 80
    const SPACE_KEY = 32

   if (key === LEFT_KEY && direction !== 0) {
      direction = 2
    } else if (key === RIGHT_KEY && direction !== 2) {
      direction = 0
    } else if (key === DOWN_KEY && direction !== 3) {
      direction = 1
    } else if (key === UP_KEY && direction !== 1)  {
      direction = 3
    } else if (key === P_KEY) {
      paused = !paused
    }
  } 

  function randomNumber(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
  }

  let foodX
  let foodY
  let score = 1
  let game_Time = 0
  let pause_Time = 0
  let apples = [ 
    {x: 0, y: 0 },
    {x: 0, y: 1 },
    {x: 0, y: 3 }
   ]


  function createApple(){
    foodX = randomNumber(10, ctxWidth - 20)
    foodY = randomNumber(10, ctxHeight - 20)
    
    snake.forEach(part => {
      if (part.x === foodX  &&  part.y === foodY) {createApple()}
    })
    apples.forEach(part => {
      if (part.x === foodX  &&  part.y === foodY) {createApple()}
    })
  }

  function makeApples(){
    for (let i=0; i<3; i++) {
      createApple()
      apples[i].x = foodX
      apples[i].y = foodY
    }
  }
    
  function drawApples(){
    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'black'
    for (let i=0; i<3; i++) {
      drawAnApple(apples[i].x, apples[i].y)
      //ctx.strokeRect(apples[i].x, apples[i].y, 10, 10)
    }
  }

  function drawAnApple(x,y){
    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(x+5, y+5)
    ctx.lineTo(x+4, y+3)
    ctx.lineTo(x+2, y+3)
    ctx.lineTo(x+1, y+5)
    ctx.lineTo(x+1, y+7)
    ctx.lineTo(x+3, y+9)
    ctx.lineTo(x+7, y+9)
    ctx.lineTo(x+9, y+7)
    ctx.lineTo(x+9, y+5)
    ctx.lineTo(x+8, y+3)
    ctx.lineTo(x+6, y+3)
    ctx.lineTo(x+5, y+5)
    ctx.fill()
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.lineTo(x+6, y+1)
    ctx.lineTo(x+7, y)
    ctx.closePath()
    ctx.stroke()
  }

  function checkIfSnakeTouchesWall() {
    const head = snake[0]
    const isHeadTouchingUpperWall = head.y < 10
    const isHeadTouchingBottomWall = head.y >= (ctxHeight - 10)
    const isHeadTouchingLeftWall = head.x < 10
    const isHeadTouchingRightWall = head.x >= (ctxWidth - 10)
  
    if (isHeadTouchingBottomWall || isHeadTouchingLeftWall ||
      isHeadTouchingRightWall ||    isHeadTouchingUpperWall
      ) {gameIsGoing = false
    }
  }
  
  function gameTime(){
    if (!gameIsGoing) {return}
    if (paused) {
      pause_Time = pause_Time + 1
      wasPaused = true
    } else {
      game_Time = game_Time + 1
    }
    
    const gTime = document.getElementById('time')
    
    if (wasPaused) {
      gTime.innerText = 'Czas: ' + game_Time + '     Czas pauzy: ' + pause_Time
    } else {
      gTime.innerText = 'Czas: ' + game_Time
    }
    if (!paused  &&  game_Time % 5 === 0  &&  timeFrame>80) {timeFrame = timeFrame - 2}
    const gFrame = document.getElementById('tframe')
    gFrame.innerText = 'Snake speed: ' + Math.round(30000/timeFrame) 
  }

  function ended(){
    clrCanvas()
    drawSnake()
    drawApples()
    ctx.fillStyle = 'red';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    ctx.fillText('Game over', ctxWidth/2, ctxHeight/2);
    exit()
  }

  function tick(){
  checkIfSnakeTouchesWall()  
  if (!gameIsGoing){ended()}
  
  clrCanvas()
  if (!paused) {moveSnake()}
  drawSnake()
  drawApples()
    if (gameIsGoing) {setTimeout(tick, timeFrame)}
  }

//}
makeApples()

//setInterval(tick, 300)
setInterval(gameTime,1000) 
tick()
//while (gameIsGoing) {setTimeout(tick, timeFrame)}
})
  //ctx.fillRect(snake[0].x,snake[0].y,10,10)
  //ctx.fillRect(snake[1].x,snake[1].y,10,10)
  //ctx.fillRect(snake[2].x,snake[2].y,10,10)
