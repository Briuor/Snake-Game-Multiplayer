export default class Snake {
  constructor(id, x, y, speed, width, height) {
    this.id = id;
    this.body = [
      {
        x: x,
        y: y,
        direction: null
      }
    ];
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.isDead = false;
  }

  draw(ctx, colorHead, colorBody) {
    this.body.forEach(part => {
      ctx.fillStyle =
        this.body[0] == part
          ? (ctx.fillStyle = colorHead)
          : (ctx.fillStyle = colorBody);
      ctx.fillRect(part.x, part.y, this.width, this.height);
    });
  }

  movePartsOfBody() {
    for (let i = this.body.length - 1; i >= 1; i--) {
      if (this.body[i].x > this.body[i - 1].x) this.body[i].direction = "left";
      else if (this.body[i].x < this.body[i - 1].x)
        this.body[i].direction = "right";
      else if (this.body[i].y > this.body[i - 1].y)
        this.body[i].direction = "top";
      else this.body[i].direction = "down";

      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
    }
  }

  move(direction) {
    if (direction != "stop") {
      this.movePartsOfBody();
      switch (direction) {
        case "top":
          this.body[0].y -= this.height;
          this.body[0].direction = "top";
          return true;
        case "right":
          this.body[0].x += this.width;
          this.body[0].direction = "right";
          return true;
        case "down":
          this.body[0].y += this.height;
          this.body[0].direction = "down";
          return true;
        case "left":
          this.body[0].x -= this.width;
          this.body[0].direction = "left";
          return true;
        default:
          return false;
      }
    }
  }

  checkCollisionFood(food, direction) {
    let head = this.body[0];
    if (
      head.x + this.width > food.x &&
      head.x <= food.x + food.width &&
      head.y + this.height >= food.y &&
      head.y <= food.y + food.height
    ) {
      // inscrease body
      let bodyPart;
      if (direction == "top")
        bodyPart = {
          x: this.body[this.body.length - 1].x,
          y: this.body[this.body.length - 1].y + this.height
        };
      else if (direction == "left")
        bodyPart = {
          x: this.body[this.body.length - 1].x + this.width,
          y: this.body[this.body.length - 1].y
        };
      else if (direction == "right")
        bodyPart = {
          x: this.body[this.body.length - 1].x - this.width,
          y: this.body[this.body.length - 1].y
        };
      else if (direction == "down")
        bodyPart = {
          x: this.body[this.body.length - 1].x,
          y: this.body[this.body.length - 1].y - this.height
        };
      this.body.push(bodyPart);
      return true;
    }
    return false;
  }

  checkCollisionSnakes(otherSnakes) {
    let otherSnake = null;
    let otherSnakePart = null;
    let head = null;
    for (let i = 0; i < otherSnakes.length; i++) {
      otherSnake = otherSnakes[i];
      for (let j = 0; j < otherSnake.body.length; j++) {
        head = this.body[0];
        otherSnakePart = otherSnake.body[j];
        // if my head touch other snake's head or body
        if (
          head.x + this.width > otherSnakePart.x &&
          head.x <= otherSnakePart.x + otherSnake.width &&
          head.y + this.height >= otherSnakePart.y &&
          head.y <= otherSnakePart.y + otherSnake.height
        ) {
          return true;
        }
      }
    }
    return false;
  }

  checkCollisionMysnake() {
    let head = this.body[0];
    let snakePart = null;
    for (let i = 1; i < this.body.length; i++) {
      snakePart = this.body[i];
      // if my head touch other snake's head or body
      if (
        head.x + this.width > snakePart.x &&
        head.x < snakePart.x + snakePart.width &&
        head.y + this.height > snakePart.y &&
        head.y < snakePart.y + snakePart.height
      ) {
        return true;
      }
    }
    return false;
  }
}
