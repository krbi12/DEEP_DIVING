var width = 600, 
	height = 500,
	gameLoop,
	points = 0,
	depth;
	state = true,
	c = document.getElementById('gameArea'), 
	ctx = c.getContext('2d');

	c.width = width;
	c.height = height;


var clear = function(){
	ctx.fillStyle = '#000098';
	ctx.clearRect(0, 0, width, height);
	ctx.beginPath();
	ctx.rect(0, 0, width, height);
	ctx.closePath();
	ctx.fill();
}


// Set information about the bubbles, the background of the game

var setBubbleQuantity = 50,
		bubbles = [];

	var Bubble = function(){
		var
		that=this;
		
		that.width = Math.random() * width;
		that.height = Math.random() * height;
		that.radius = Math.random() * 15;
		that.transparency = Math.random() / 2;
		
		
		that.draw = function(){
		        ctx.fillStyle = 'rgba(255, 255, 255, ' + that.transparency + ')';
			ctx.beginPath();
		        ctx.arc(that.width, that.height, that.radius, 0, Math.PI * 2, true);
		        ctx.closePath();
		        ctx.fill();
		};
		
		
               that.move = function(e){
	        	if (that.height + that.radius < 0) {
			that.width = Math.random() * width;
			that.radius = Math.random() * 15;
			that.height = height + that.radius;
			that.transparency = Math.random() / 2;
	        	}
		        else {
			that.height -= e;
		}
};
}


// Generate bubbles.
	
	var generateBubbles = function(){
		for (var i = 0; i < setBubbleQuantity; i++) {
			bubbles[i] = new Bubble();
		}
	}();



// Create a diver object, the player in the game

var diver = new (function(){
	var that = this;
	that.image = new Image();

	that.image.src = "game/img/shoe-string-diver.png"
	that.width = 82;
	that.height = 100;
	that.X = 0;
	that.Y = 0;	

	that.isJumping = false;
	that.isFalling = false;
	that.jumpSpeed = 0;
	that.fallSpeed = 0;

	
// Initiate the jump
	
    that.jump = function() {
		if (!that.isJumping && !that.isFalling) {
			that.fallSpeed = 0;
			that.isJumping = true;
			that.jumpSpeed = 35;
		}
	}

// Set position for next frame based on value in jumpSpeed	
// If diver is above middle of screen, move the background instead of the diver.

	that.checkJump = function() {

		if (that.Y > height*0.4) {
			that.setPosition(that.X, that.Y - that.jumpSpeed / 4);		
		}
		else {
			if (that.jumpSpeed > 10) 
				points++;
			
                        bubbles.forEach(function(bubble){
	                bubble.move(that.jumpSpeed * -0.5);
                	});
				

			bouncers.forEach(function(bouncer, ind){
				bouncer.y += that.jumpSpeed;

				if (bouncer.y > height) {
					var type = ~~(Math.random() * 20);
					if(type == 0) {
					  type = 3;
					} else if (type > 0 && type <= 1) {
					  type = 2;
					} else if (type > 1 && type <= 10) {
						type = 1;
					} else { 
						type = 0;
					}
				

					bouncers[ind] = new Bouncer(Math.random() * (width - (Math.round(bouncer.bouncerWidth - points * 0.02))), bouncer.y - height, type);
					
				}
			});
		}

// Check if the player is still jumping (gaining height). If not he is falling
		
		that.jumpSpeed--;
		if (that.jumpSpeed == 0) {
			that.isJumping = false;
			that.isFalling = true;
			that.fallSpeed = 1;
		}
	}

	
	that.fallStop = function(){
		that.isFalling = false;
		that.fallSpeed = 0;
		that.jump();	
	}
	
	

	that.checkFall = function(){
		if (that.Y < height - that.height) {
			that.setPosition(that.X, that.Y + that.fallSpeed / 4);
			that.fallSpeed++;
		} else {
			if (points == 0) 
				that.fallStop();
			else 
				GameOver();
		}
	}

// Based on mouse or key input, set new target value for horizontal move
	
	that.move2Left = function(){
	  if (that.X > 0) {
	        that.newX = that.X - 280;
	  } else {
	    that.newX = 0;
	  }
	}

	that.move2Right = function(){
	  if (that.X + that.width < width) {
	  that.newX = that.X + 280;
	} else {
	  that.newX = width - that.width;
	}
	}
	
// Make sure that diver stays within the canvas

		that.checkXPosition = function(){
	    if(that.newX < that.X) {
	      if(that.X < 1) {
		that.X = that.X;
	      } else {
		that.X = that.X - 4;
	      }
	    } else if (that.newX > that.X) {
	      if(that.X + that.width > width) {
		that.X = that.X;
	      } else {
	      that.X = that.X + 4;
	      }
	    }
	  }

	
	
	

	that.setPosition = function(x, y){
		that.X = x;
		that.Y = y;
	}
	


	that.draw = function(){
		try {
			ctx.drawImage(that.image, 0, 0, that.width, that.height, that.X, that.Y, that.width, that.height);
		} 
		catch (e) {
		}
	}
})();


diver.setPosition(~~((width-diver.width)/2), height - diver.height);
diver.jump();

// If mouse is moved to the left of diver, call move2Left-function.
// move2Right is called if moved to the right of diver


document.onmousemove = function(e){
	if (diver.X + c.offsetLeft > e.pageX) {
		diver.move2Left();
	} else if (diver.X + c.offsetLeft < e.pageX) {
		diver.move2Right();
	}

}

// Left and right arrow keys calls the functions for left and right movement

document.onkeydown = function(e){
  if (e.keyCode == 13) {
window.location.href=window.location.href;
	} else if (e.keyCode == 37) {
		diver.move2Left();	  
	} else if (e.keyCode == 39) {
		diver.move2Right();
	}
}


// Some variables about the bouncers

	var nrOfBouncers = 8, 
		bouncers = [];

	var Bouncer = function(x, y, type){
		var
		that=this;


// Four different types of bouncers, with different actions when they collide with diver
		
		that.firstColor = '#FF8C00';
		that.secondColor = '#EEEE00';
		that.bouncerWidth = 150 - (points * 0.02);
		that.bouncerHeight = 10;
		that.onCollide = function(){
		  	var collisionSound = new Audio("game/sounds/alert_drip.ogg");
                        collisionSound.play();
			diver.fallStop();
		};

		if (type === 1) {
			that.firstColor = '#AADD00';
			that.secondColor = '#698B22';
			that.bouncerWidth = 130 - (points * 0.02);
			that.onCollide = function(){
			        var collisionSound = new Audio("game/sounds/cell_death.ogg");
                                collisionSound.play();
				diver.fallStop();
				diver.jumpSpeed = 45;
			};
		}
		
		if (type === 2) {
			that.firstColor = '#000000';
			that.secondColor = '#050165';
			that.bouncerWidth = 110 - (points * 0.02);
			that.onCollide = function(){
			        var collisionSound = new Audio("game/sounds/explosion.ogg");
                                collisionSound.play();
				points = -1;
			};
		}
		
		
			if (type === 3) {
			that.firstColor = '#DA19C4';
			that.secondColor = '#800F75';
			that.bouncerWidth = 90 - (points * 0.02);
			that.onCollide = function(){
			        var collisionSound = new Audio("game/sounds/f1_car_short.ogg");
                                collisionSound.play();
				diver.fallStop();
				diver.jumpSpeed = 75;
			};
		}



		that.x = ~~ x;
		that.y = y;
		that.type = type;


		that.isMoving = ~~(Math.random() * 2);
		that.direction= ~~(Math.random() * 2) ? -1 : 1;
		
		
// Draw bouncers

		that.draw = function(){
			ctx.fillStyle = 'rgba(255, 255, 255, 1)';
			var gradient = ctx.createRadialGradient(that.x + (Math.round(that.bouncerWidth - points * 0.02/2)), that.y + (that.bouncerHeight/2), 5, that.x + (Math.round(that.bouncerWidth - points * 0.02/2)), that.y + (that.bouncerHeight/2), 45);
			gradient.addColorStop(0, that.firstColor);
			gradient.addColorStop(1, that.secondColor);
			ctx.fillStyle = gradient;
			ctx.fillRect(that.x, that.y, Math.round(that.bouncerWidth - points * 0.02), that.bouncerHeight);

		};

		return that;
	};
	
// Generate bouncers of the four types.
	
	var generateBouncers = function(){
		var position = 0, type;
		for (var i = 0; i < nrOfBouncers; i++) {
			type = ~~(Math.random() * 20);
					if(type == 0) {
					  type = 3;
					} else if (type > 0 && type <= 1) {
					  type = 2;
					} else if (type > 1 && type <= 10) {
						type = 1;
					} else { 
						type = 0;
					}
			bouncers[i] = new Bouncer(Math.random() * (width - 100), position, type);
			if (position < height - 10) 
				position += ~~(height / nrOfBouncers);
		}
	}();

	
// Function to check if there was a collision
	
	var checkCollision = function(){
	bouncers.forEach(function(e, ind){
		if (
		(diver.isFalling) && 
		(diver.X < e.x + Math.round(e.bouncerWidth - points * 0.02)) && 
		(diver.X + diver.width > e.x) && 
		(diver.Y + diver.height > e.y) && 
		(diver.Y + diver.height < e.y + e.bouncerHeight)
		) {

			e.onCollide();
		}
	})
	}
	
	
	
	
	
// The gameloop which is called 50 times each second

var GameLoop = function(){
	clear();	
	bubbles.forEach(function(bubble){
	    bubble.move(8);
	    bubble.draw();
	});
	
	if (diver.isJumping) diver.checkJump();
	if (diver.isFalling) diver.checkFall();
        if(diver.newX) diver.checkXPosition();
	diver.draw();
	bouncers.forEach(function(bouncer, index){
		if (bouncer.isMoving) {
			if (bouncer.x < 0) {
				bouncer.direction = 1;
			} else if (bouncer.x > width - Math.round(bouncer.bouncerWidth - points * 0.02)) {
				bouncer.direction = -1;
			}
				bouncer.x += bouncer.direction * (index / 2) * ~~(points / 100);
			}
		bouncer.draw();
		
	});

	checkCollision();
        if(points > 1102 || points < 0) { GameOver(); }
	ctx.fillStyle = "White";
	ctx.fillText("POINTS:" + points, 10, height-10);
	if(points > 1102) { depth = 0 } else {depth = 11024 - points * 10;}
	ctx.fillText("LEFT TO SURFACE: " + depth + " METERS", 10, height-25);

	if (state)
		gameLoop = setTimeout(GameLoop, 1000 / 50);
}

// Stopping game and generating game over screen

	var GameOver = function(){
		state = false;
		clearTimeout(gameLoop);
		setTimeout(function(){
			clear();

			ctx.fillStyle = "White";
			ctx.font = "12pt Arial";
			if(points > 1102) { depth = 0;
			ctx.fillText("CONGRATULATIONS! YOU SAVED THE DIVER.", width / 4 - 60, height / 2 - 150);
			ctx.fillText("YOUR RESULT: " + points + " POINTS", width / 4 - 60, height / 2 - 130);
	                ctx.fillText("LEFT TO SURFACE: " + depth + " METERS", width / 4 - 60, height / 2 - 110);
			} else if(points == -1){depth = 11024;
			ctx.fillText("TOO BAD, THE DIVER GOT KILLED IN THE EXPLOSION.", width / 4 - 60, height / 2 - 150);
			} else {depth = 11024 - points * 10;
			ctx.fillText("GAME OVER", width / 4 - 60, height / 2 - 150);
			ctx.fillText("YOUR RESULT: " + points + " POINTS", width / 4 - 60, height / 2 - 130);
	                ctx.fillText("LEFT TO SURFACE: " + depth + " METERS", width / 4 - 60, height / 2 - 110);	
			}
			ctx.fillText("HIT ENTER TO START NEW GAME ", width / 2 + 10, height / 2 + 150);
		}, 100);

	};

GameLoop();
