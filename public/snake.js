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
	}

	draw(ctx, colorHead, colorBody) {
		this.body.forEach(part => {
			if(this.body[0] == part) {
				ctx.fillStyle = colorHead;
			}
			else {
				ctx.fillStyle = colorBody;
			}
			ctx.fillRect(part.x, part.y, this.width, this.height);
		})
	}

	movePartsOfBody() {
		for(let i = this.body.length-1; i >= 1; i--) {
			if(this.body[i].x > this.body[i - 1].x) 	 
				this.body[i].direction = 'left';
			else if(this.body[i].x < this.body[i - 1].x) 
				this.body[i].direction = 'right';
			else if(this.body[i].y > this.body[i - 1].y) 
				this.body[i].direction = 'top';
			else  
				this.body[i].direction = 'down';

			this.body[i].x = this.body[i - 1].x;
			this.body[i].y = this.body[i - 1].y;
		}
	}

	move(direction) {
		switch(direction) {
			case 'top':
				this.body[0].y -= this.height; 
				this.body[0].direction = 'top'; 
				return true;
			case 'right':
				this.body[0].x += this.width;
				this.body[0].direction = 'right'; 
				return true;
			case 'down':
				this.body[0].y += this.height;		
				this.body[0].direction = 'down'; 
				return true;
			case 'left':
				this.body[0].x -= this.width;
				this.body[0].direction = 'left'; 
				return true;
			default: 
				return false;
		}
	}

	checkCollisionFood(food, direction) {
		let head = this.body[0];
		if( (head.x + this.width > food.x) && 
			(head.x <= food.x + food.width) && 
			(head.y + this.height >= food.y) &&
			(head.y <= food.y + food.height)) 
		{
			// inscrease body
			let bodyPart;
			if(direction == 'top')
				bodyPart = {x: this.body[this.body.length-1].x, y: this.body[this.body.length-1].y + this.height};
			else if(direction == 'left')
				bodyPart = {x: this.body[this.body.length-1].x + this.width, y: this.body[this.body.length-1].y};
			else if(direction == 'right')
				bodyPart = {x: this.body[this.body.length-1].x - this.width, y: this.body[this.body.length-1].y};
			else if(direction == 'down')
				bodyPart = {x: this.body[this.body.length-1].x, y: this.body[this.body.length-1].y - this.height};
			this.body.push(bodyPart);
			return true;
		}
		return false;
	}

	checkCollisionSnakes (snakes) {
		let that = this;
		var snake = null;
		var part = null;
		var head = null; 
		for(let i = 0; i < snakes.length; i++){
			snake = snakes[i];
			for(let j = 0; j < snake.body.length; j++) {
				head = that.body[0];
				part = snake.body[j];
				// if my head touch other snake's head or body and the directions are not the same i lose
				if( (head.x + that.width > part.x) && 
					(head.x <= part.x + snake.width) && 
					(head.y + that.height >= part.y) &&
					(head.y <= part.y + snake.height))
				{
					return true;
				}
			}
		}
		return false;
	}

	checkCollisionMysnake() {

	}
}