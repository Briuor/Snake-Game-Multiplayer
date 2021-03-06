export default class Food {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 32;
		this.height = 32;
	}

	draw(ctx) {
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	generateFood(canvas) {
		this.x = Math.floor(Math.random() * canvas.width);
		this.y = Math.floor(Math.random() * canvas.height);
	}
}