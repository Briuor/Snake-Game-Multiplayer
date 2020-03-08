import Snake from "./model/snake.js";
import Food from "./model/food.js";
import InputHandler from "./model/inputhandler.js";

export default class Game {
  constructor() {
    // init socket
    this.socket = io.connect("http://localhost:4000");
    // init canvas
    this.canvas = document.getElementById("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.background = "black";
    this.ctx = this.canvas.getContext("2d");

    // init players
    this.snakes = [];
    // get snakes already playing
    this.socket.emit("getsnakes");

    // init food
    this.food = new Food(
      Math.floor(Math.random() * this.canvas.width),
      Math.floor(Math.random() * this.canvas.height)
    );

    this.mySnake = new Snake(
      this.socket.id,
      Math.floor(Math.random() * this.canvas.width),
      Math.floor(Math.random() * this.canvas.height),
      32,
      32,
      32
    );
    // tell the server that have a new snake in game
    this.socket.emit("newsnake", this.mySnake);

    this.initSocketEvents(this.socket);

    this.inputHandler = new InputHandler(this.canvas);

    this.loop = null;

    this.update = this.update.bind(this);
  }

  initSocketEvents(socket) {
    var that = this;

    socket.on("connect", function () {
      that.mySnake.id = socket.id;
    });

    // when a new snake enter
    socket.on("newsnake", function (snake) {
      let newSnake = new Snake(
        snake.id,
        snake.body[0].x,
        snake.body[0].y,
        snake.speed,
        snake.width,
        snake.height
      );
      that.snakes.push(newSnake);
    });

    socket.on("getsnakes", function (snakes) {
      snakes.forEach(snake => {
        let newSnake = new Snake(
          snake.id,
          snake.body[0].x,
          snake.body[0].y,
          snake.speed,
          snake.width,
          snake.height
        );
        that.snakes.push(newSnake);
      });
      if (snakes.length == 0) {
        socket.emit("newfood", that.food);
      } else {
        socket.emit("getfood");
      }
    });

    socket.on("removesnake", function (snakeId) {
      console.log("remove " + snakeId);
      for (let i = 0; i < that.snakes.length; i++) {
        console.log(that.snakes[i].id);
        if (that.snakes[i].id == snakeId) {
          console.log("removed: " + snakeId);
          that.snakes.splice(i, 1);
          break;
        }
      }
    });

    socket.on("moved", function (snake) {
      for (let i = 0; i < that.snakes.length; i++) {
        if (snake.id == that.snakes[i].id) {
          that.snakes[i].body = snake.body;
        }
      }
    });

    socket.on("newfood", function (food) {
      let newFood = new Food();
      newFood.x = food.x;
      newFood.y = food.y;
      that.food = newFood;
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.food.draw(this.ctx);
    this.snakes.forEach(snake => {
      snake.draw(this.ctx, "white", "orange");
    });
    if (!this.mySnake.isDead) {
      this.mySnake.draw(this.ctx, "blue", "pink");
    }
  }

  update() {
    if (!this.mySnake.isDead) {
      // check collision with mySnake's body or collision with other snakes
      if (this.mySnake.checkCollisionMysnake() || this.mySnake.checkCollisionSnakes(this.snakes)) {
        this.mySnake.isDead = true;
        this.socket.emit("died");
      }

      // check if food was eated
      if (
        this.mySnake.checkCollisionFood(this.food, this.inputHandler.direction)
      ) {
        this.food.generateFood(this.canvas);
        this.socket.emit("newfood", this.food);
      }

      // if moved emit an event to other snakes
      if (this.mySnake.move(this.inputHandler.direction)) {
        this.socket.emit("moved", this.mySnake);
      }
    }

    // draw everything
    this.render();
  }

  start() {
    // slow 150
    // fast 50
    this.loop = setInterval(this.update, 100);
  }
}
