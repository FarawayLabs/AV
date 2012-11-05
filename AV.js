/*
 *   Alien Vista (working title)
 *   ---------------------------
 * 
 * 
 * 
 */

function AV(canvas) {
		// Initialize Variables
		var frameNum = 0;
		var mmapUpdate = 100;
		var scrollTransparency = .3;
		var initialPlants = 500000;
		var plantDensity = 100;
		
		var worldSizeX = 2000;
		var worldSizeY = 2000;
		
		initialPlants = (worldSizeX * worldSizeY / plantDensity);
		
		var canvasOriginX = 0;
		var canvasOriginY = 0;
		
		var mmCanvasOriginX = 0;
		var mmCanvasOriginY = 0;
		
		var mmRatioX = 0;
		var mmRatioY = 0;
		
		var mmViewBoxX = 0;
		var mmViewBoxY = 0;
		var mmViewBoxOppX = 0;
		var mmViewBoxOppY = 0;
		
		var canvasSizeX;
		var canvasSizeY;
		var mmCanvasSizeX;
		var mmCanvasSizeY;
		var uiCanvasSizeX;
		var uiCanvasSizeY;
		
		var alertDelay = 0;
		
		var smallMoveZone = 150;
		var largeMoveZone = 75;
		var mousePosBufferZone = 3;
		var smallMove = 5;
		var largeMove = 10;
		
		var mmMouseX = 200;
		var mmMouseY = 200;
		var globalMouseX = 200;
		var globalMouseY = 200;
		
		var timeArray = [];
		var timeCounter = 0;
		var fps = 0;
		
		var roboArray = new Array(11);
	
		var Robot1 = new robot(200,50,1,100);
		var Robot2 = new robot(200,70,1,100);
		var RoboTreeArray = [];
	
	
	window.requestAnimFrame = (function(callback) {
	    return window.requestAnimationFrame || 
	    window.webkitRequestAnimationFrame || 
	    window.mozRequestAnimationFrame || 
	    window.oRequestAnimationFrame || 
	    window.msRequestAnimationFrame ||
	    function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
 	})();
	
	function animate(lastTime, myRectangle) {
		frameNum++;
	    var canvas = document.getElementById("myCanvas");
	    var context = canvas.getContext("2d");
	    
	    var canvas2 = document.getElementById("minMapCanvas");
	    var mmcontext = canvas2.getContext("2d");
	    
	    var canvas3 = document.getElementById("UI");
	    var uicontext = canvas3.getContext("2d");
	    
		// Calculate MiniMap view Box
	    canvasSizeX = canvas.width;    
	    canvasSizeY = canvas.height;
	    
	    mmCanvasSizeX = canvas2.width;
	    mmCanvasSizeY = canvas2.height;
	    
	    uiCanvasSizeX = canvas3.width;
	    uiCanvasSizeY = canvas3.height;
		
		// Calculate the coordinates of the mini map view window
		mmViewBoxX = canvasOriginX * ( mmCanvasSizeX / worldSizeX );
		mmViewBoxY = canvasOriginY * ( mmCanvasSizeY / worldSizeY );
	    mmViewBoxOppX = (canvasSizeX) * ( mmCanvasSizeX / worldSizeX );
	   	mmViewBoxOppY = (canvasSizeY) * ( mmCanvasSizeY / worldSizeY );

	    // update
	    var date = new Date();
	    var time = date.getTime();
	    var timeDiff = time - lastTime;
	    var linearSpeed = 71.7;
	    // pixels / second
	    var linearDistEachFrame = linearSpeed * timeDiff / 100;   
	    lastTime = time;
	
		// fill the timeArray, used for FPS calculation
		timeArray[timeCounter] = time;
		timeCounter++;
		if (timeCounter > 9) {
			timeCounter = 0;
			fps = Math.floor(10000 / (timeArray[9]-timeArray[0]));
		}
		
	    // clear
	    context.clearRect(0, 0, canvasSizeX, canvasSizeY);
	    mmcontext.clearRect(0, 0, mmCanvasSizeX, mmCanvasSizeY);
	    uicontext.clearRect(0, 0, uiCanvasSizeX, uiCanvasSizeY);
	    

	    // draw
	    drawRobos(context);
	    // request new frame
	    requestAnimFrame(function() {
	      animate(lastTime, myRectangle);
	    });
	    
	    // Robot Thinking and doing
	    Robot1.robotPsyche();
	    Robot1.robotAction();
	    worldWrap(Robot1);
	    Robot1.trajectory = calcTrajectory(Robot1.X, Robot1.Y, Robot1.destinationX, Robot1.destinationY, Robot1.trajectory, Robot1.maneuver, Robot1);
	    
	    Robot2.robotPsyche();
	    Robot2.robotAction();
	    worldWrap(Robot2);
	    Robot2.trajectory = calcTrajectory(Robot2.X, Robot2.Y, Robot2.destinationX, Robot2.destinationY, Robot2.trajectory, Robot2.maneuver, Robot2);
	    
	    // Check to see if window should be scrolling
	    scrollWindow(context, {x: globalMouseX, y: globalMouseY});
	    
	    // Update FPS counter
	    context.fillStyle = "blue";
		context.font="40px Arial";;
	  	context.fillText(fps, 20, 60);
	  	
	  	// Update the Minimap
	  	//if ((frameNum % mmapUpdate) == 1) {
		    // Temporary 
		    //mmcontext.fillRect(0, 0, 1000, 1000);
		    mmcontext.strokeStyle = 'blue';
		    mmcontext.strokeRect(Math.floor(mmViewBoxX), Math.floor(mmViewBoxY), Math.floor(mmViewBoxOppX), Math.floor(mmViewBoxOppY));
		    uicontext.fillRect(0, 0, 1000, 1000);
		//}
		
		// Draw data on the miniMap
		mmcontext.fillRect(Math.floor(Robot1.X * mmRatioX), Math.floor(Robot1.Y * mmRatioY), 1, 1);
		
	}
	
	window.onload = function() {
	    var myRectangle = {
	      x: 0,
	      y: 50,
	      width: 100,
	      height: 50,
	      borderWidth: 5
	    };
	
	    var date = new Date();
	    var time = date.getTime();
	    animate(time, myRectangle);
	    
	    
	    var newcanvas = document.getElementById('myCanvas');
	    var newcontext = newcanvas.getContext('2d');
		
		var newmmcanvas = document.getElementById('minMapCanvas');
	    var newmmcontext = newmmcanvas.getContext('2d');
	
	    newcanvas.addEventListener('mousemove', function(evt) {
	      var mousePos = getMousePos(newcanvas, evt);
	      var message = "Mouse position: " + mousePos.x + "," + mousePos.y;
	    }, false);
	    
	    newmmcanvas.addEventListener('mousedown', function(evt) {
          var mmmousePos = getMousePos(newmmcanvas, evt);
          //alert ("we have explosive");
          mmMouseX = mmmousePos.x;
          mmMouseX -= (canvasSizeX + 6);
          mmMouseY = mmmousePos.y + 806;
          // alert (mmMouseY);
          minimapClick();
        }, false);
	};
	
	function minimapClick() {
		canvasOriginX = Math.floor(((mmMouseX - (mmViewBoxOppX / 2)) / 500) * (worldSizeX));
		canvasOriginY = Math.floor(((mmMouseY - (mmViewBoxOppY / 2)) / 250) * (worldSizeY));
		
		// Check to make sure map isn't of the top or left
		if (canvasOriginX < 0) { canvasOriginX = 0; }
		if (canvasOriginY < 0) { canvasOriginY = 0; }
		
		// Check to make sure map isn't off the right or bottom
		if (canvasOriginX > (worldSizeX - canvasSizeX)) { canvasOriginX = (worldSizeX - canvasSizeX); }
		if (canvasOriginY > (worldSizeY - canvasSizeY)) { canvasOriginY = (worldSizeY - canvasSizeY); }
	}
	
	function drawRobos(context) {
		var imageheight;
		var imagewidth;
		for (var k3=0; k3<initialPlants; k3++) {
			//alert (RoboTreeArray[k3].Y);
			if (RoboTreeArray[k3].X > (canvasOriginX - 20)) {
				if (RoboTreeArray[k3].Y > (canvasOriginY - 20)) {
					if (RoboTreeArray[k3].X < (canvasOriginX + 20 + canvasSizeX)) {
						if (RoboTreeArray[k3].Y < (canvasOriginY + 20 + canvasSizeY)){
							context.drawImage(RoboTreeArray[k3].image, Math.floor(RoboTreeArray[k3].X - canvasOriginX), Math.floor(RoboTreeArray[k3].Y - canvasOriginY));				
						}
					}
				}
			}
		}
	
		context.drawImage(roboArray[10], Robot1.destinationX - canvasOriginX, Robot1.destinationY - canvasOriginY);
		// Draw Robot1
		
		context.save();
		context.translate((Robot1.X + Robot1.image.width/2) - canvasOriginX, (Robot1.Y + Robot1.image.height/2) - canvasOriginY);
		context.rotate((-Robot1.trajectory-90)*Math.PI/180);
		context.drawImage(Robot1.image, 0 - Robot1.image.width/2, 0 - Robot1.image.height/2);
		context.restore();
		
		// Draw Robot2
		context.save();
		context.translate((Robot2.X + Robot2.image.width/2) - canvasOriginX, (Robot2.Y + Robot2.image.height/2) - canvasOriginY);
		context.rotate((-Robot2.trajectory-90)*Math.PI/180);
		//context.drawImage(Robot2.image, 0 - Robot2.image.width/2, 0 - Robot2.image.height/2);
		context.restore();
		
	}
	
	function robot(X, Y, alive, energy) {
		this.X = X;
		this.Y = Y;
		this.alive = 1;
		this.energy = 100;
		this.image = roboArray[10];
		this.destinationX =  300;
		this.destinationY = 220;
		this.speed = .1;
		this.maxspeed = 7;
		this.trajectory = 0;
		this.XVelocity = 1;
		this.YVelocity = 1;
		this.maneuver = 5;
	
		this.robotAction = roboAction;
		this.robotPsyche = roboPsyche;
		this.robotChangeDestinationSet = changeDestinationSet;
		this.robotChangeDestinationRand = changeDestinationRand;
		this.robotWorldWrap = worldWrap;
	}
	
	
	function changeDestinationRand() {
		this.destinationX = Math.floor(Math.random()*worldSizeX);
		this.destinationY = Math.floor(Math.random()*worldSizeY);
	}
		
	function changeDestinationSet() {
		this.destinationX = this.X - 100;
		if (this.destinationX < 0) {
			this.destinationX = worldSizeX - this.destinationX;
		} else if (this.destinationX > worldSizeX) {
			this.destinationX = this.destinationX - worldSizeX;
		}
		this.destinationY = this.Y - 100;
		if (this.destinationY < 0) {
			this.destinationY = worldSizeY - this.destinationY;
		} else if (this.destinationY > worldSizeY) {
			this.destinationY = this.destinationY - worldSizeY;
		}
	}
		
	function roboAction() { // This is the method that causes the robot to act, based on what it
							// decides in roboPsyche.
		this.XVelocity = this.speed * Math.cos(this.trajectory/(180/Math.PI));
		this.YVelocity = (-1) * this.speed * Math.sin(this.trajectory/(180/Math.PI));
		// alert ("XVel");
		// alert (this.XVelocity);
		// alert (this.YVelocity);
		this.X += this.XVelocity;
		this.Y += this.YVelocity;
	}
	
	function roboPsyche() { // This method runs every cycle and is the robot's "brain"
		//alert ("roboPsyche");
		var distanceX;
		var distanceY;
		var distanceToTarget;
		distanceX = Math.abs(this.destinationX - this.X);
		distanceY = Math.abs(this.destinationY - this.Y);
		distanceToTarget = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
		//alert (distanceToTarget);
		if (distanceToTarget < this.speed) {
			//alert ("We're Close");	
			this.robotChangeDestinationRand();
		}
	}
	
	function calcTrajectory(XStart, YStart, XEnd, YEnd, currentTraj, roboManeuver, trajRobot) {
		var right = 0;
		var left = 0;
		var up = 0;
		var down = 0;
		var XEndCalc = 0;
		var YEndCalc = 0;
		var bestTraj = 0;
		var slowDownWindow;
		var decelRate = .95;
		
		if (Math.abs(XStart - XEnd) <= (worldSizeX / 2)) {
			if (XStart <= XEnd) {
				// move right, no jumping
				right = 1;
				XEndCalc = XEnd;
			} else if (XStart > XEnd) {
				// move left, no jumping
				left = 1;
				XEndCalc = XEnd;
			}
		} else {
			if (XStart < XEnd) {
				// move left, jump
				left = 1;
				XEndCalc = XEnd - worldSizeX;
				
			} else if (XEnd < XStart) {
				// move right, jump
				right = 1;
				XEndCalc = XEnd + worldSizeX;
			}
		}
		
		if (Math.abs(YStart - YEnd) <= (worldSizeY / 2)) { 
			if (YStart <= YEnd) {
				// move down, no jumping
				down = 1;
				YEndCalc = YEnd;
			} else if (YStart > YEnd) {
				// move up, no jumping
				up = 1;
				YEndCalc = YEnd;
			}
		} else {
			if (YStart < YEnd) {
				// move up, jump
				up = 1;
				YEndCalc = YEnd - worldSizeY;
			} else if (YEnd < YStart) {
				// move down, jump
				down = 1;
				YEndCalc = YEnd + worldSizeY;
			}
		}
		  
		// Get angle
		bestTraj = Math.atan((YStart-YEndCalc)/(XStart-XEndCalc))*(180/Math.PI);
		// alert (returnTraj);	
			
		if (up && right) {
			//alert ("up and right");
			bestTraj = bestTraj * (-1);
		} else if (up && left) {
			bestTraj = 180 - bestTraj;
			//alert ("up and left");
		} else if (down && left) {
			//alert ("down and left");
			bestTraj = 180 - bestTraj;
		} else if (down && right) {
			//alert ("down and right");
			bestTraj = 360 - bestTraj;
		}
		
		slowDownWindow = Math.floor((trajRobot.speed / trajRobot.maxspeed) * 60);
			alertDelay++;
		if ((alertDelay % 177) == 1) {
			//alert ("huh");
			//alert (slowDownWindow);
			//alert (bestTraj);	
		}
	
		var modCurTraj = currentTraj - 180;
		var modBestTraj = bestTraj - 180;
		if (modBestTraj < 0) { modBestTraj = 360 + modBestTraj; }
		
		//alert (currentTraj);
		
		if (currentTraj <= 180) {
			if ((bestTraj <= (currentTraj + 180)) && (bestTraj > currentTraj)) {
				// turn left
				if (Math.abs(currentTraj - bestTraj) > roboManeuver) {
					returnTraj = currentTraj + roboManeuver;
				} else {
					returnTraj = bestTraj;
				}
				
				if (Math.abs(bestTraj - currentTraj) > slowDownWindow) {
					// also slow down
					trajRobot.speed = trajRobot.speed * decelRate;
				} else {
					// otherwise accelerate
					trajRobot.speed = trajRobot.speed / decelRate;
					if (trajRobot.speed > trajRobot.maxspeed) {
						trajRobot.speed = trajRobot.maxspeed;
					}
				}
			} else {
				// turn right
				if (Math.abs(currentTraj - bestTraj) > roboManeuver) {
					returnTraj = currentTraj - roboManeuver;
				} else {
					returnTraj = bestTraj;
				}
				
				if (Math.abs(bestTraj - currentTraj) > slowDownWindow) {
					// also slow down
					trajRobot.speed = trajRobot.speed * decelRate;
				} else {
					// otherwise accelerate
					trajRobot.speed = trajRobot.speed / decelRate;
					if (trajRobot.speed > trajRobot.maxspeed) {
						trajRobot.speed = trajRobot.maxspeed;
					}
				}
			}
		} else {
			if ((bestTraj >= (currentTraj - 180)) && (bestTraj < currentTraj)) {
				// turn right
				if (Math.abs(currentTraj - bestTraj) > roboManeuver) {
					returnTraj = currentTraj - roboManeuver;
				} else {
					returnTraj = bestTraj;
				}
				
				if (Math.abs(bestTraj - currentTraj) > slowDownWindow) {
					// also slow down
					trajRobot.speed = trajRobot.speed * decelRate;
				} else {
					// otherwise accelerate
					trajRobot.speed = trajRobot.speed / decelRate;
					if (trajRobot.speed > trajRobot.maxspeed) {
						trajRobot.speed = trajRobot.maxspeed;
					}
				}
			} else {
				// turn left
				if (Math.abs(currentTraj - bestTraj) > roboManeuver) {
					returnTraj = currentTraj + roboManeuver;
				} else {
					returnTraj = bestTraj;
				}
				
				if (Math.abs(bestTraj - currentTraj) > slowDownWindow) {
					// also slow down
					trajRobot.speed = trajRobot.speed * decelRate;
				} else {
					// otherwise accelerate
					trajRobot.speed = trajRobot.speed / decelRate;
					if (trajRobot.speed > trajRobot.maxspeed) {
						trajRobot.speed = trajRobot.maxspeed;
					}
				}
			}
		}
	
		if (returnTraj < 0) { 
			returnTraj += 360; 
		} else if (returnTraj > 360) {
			returnTraj -= 360
		}
		//alert (returnTraj);
		return returnTraj;
	}
	
	function moveRandom(robo) {
		robo.X += Math.floor(Math.random()*3)-2;
		robo.Y += Math.floor(Math.random()*3)-2;
	
		if (robo.X < 0) {
			robo.X = worldSizeX + robo.X;
		}	
		if (robo.Y < 0) {
			robo.Y = worldSizeY + robo.Y;
		}
		robo.X = robo.X % worldSizeX;
		robo.Y = robo.Y % worldSizeY;
	}
	
	// Checks to see if the robot is outside of the world.  If so, it warps it to the opposite edge
	function worldWrap(robo) {
		if (robo.X < 0) {
			robo.X = worldSizeX + robo.X;
		}	
		if (robo.Y < 0) {
			robo.Y = worldSizeY + robo.Y;
		}
		robo.X = robo.X % worldSizeX;
		robo.Y = robo.Y % worldSizeY;
	}
	
	
	function scrollWindow(newercontext, mousePos) {
		newercontext.fillStyle = "rgba(10,50,10," + scrollTransparency + ")";
		if ((mousePos.x < smallMoveZone) && (mousePos.x > mousePosBufferZone)) {
			if (mousePos.x < largeMoveZone) {
				// Move left (largeMove)
				canvasOriginX -= largeMove;
				newercontext.fillRect(0, 0, largeMoveZone, canvasSizeY);
			}
			// Move left (smallMove)
			canvasOriginX -= smallMove;
			newercontext.fillRect(0, 0, smallMoveZone, canvasSizeY);
		} else if ((mousePos.x > (canvasSizeX - smallMoveZone)) && (mousePos.x < (canvasSizeX - mousePosBufferZone))) {
			if (mousePos.x > (canvasSizeX - largeMoveZone)) {
				// Move right (largeMove)
				canvasOriginX += largeMove;
				newercontext.fillRect(canvasSizeX - largeMoveZone, 0, canvasSizeX, canvasSizeY);
			}
			// Move right (smallMove)
			canvasOriginX+= smallMove;
			newercontext.fillRect(canvasSizeX - smallMoveZone, 0, canvasSizeX, canvasSizeY);
		}
		if ((mousePos.y < smallMoveZone) && (mousePos.y > mousePosBufferZone)) {
			if (mousePos.y < largeMoveZone) {
				// move up (largeMove)
				canvasOriginY -= largeMove;
				newercontext.fillRect(0, 0, canvasSizeX, largeMoveZone);
			}
			// move up (smallMove)
			newercontext.fillRect(0, 0, canvasSizeX, smallMoveZone);
			canvasOriginY -= smallMove;
		} else if ((mousePos.y > (canvasSizeY - smallMoveZone)) && (mousePos.y < canvasSizeY - mousePosBufferZone)) {
			if (mousePos.y > (canvasSizeY - largeMoveZone)) {
				// move down (largeMove)
				canvasOriginY += largeMove;
				newercontext.fillRect(0, canvasSizeY - largeMoveZone, canvasSizeX, canvasSizeY);
			}
			// move down (smallMove)
			canvasOriginY += smallMove;
			newercontext.fillRect(0, canvasSizeY - smallMoveZone, canvasSizeX, canvasSizeY);
		}
		
		if (canvasOriginX < 0) { canvasOriginX = 0; }
		if (canvasOriginX > (worldSizeX - canvasSizeX - 1)) { canvasOriginX = worldSizeX - canvasSizeX - 1; }
		if (canvasOriginY < 0) { canvasOriginY = 0; }
		if (canvasOriginY > (worldSizeY - canvasSizeY - 1)) { canvasOriginY = worldSizeY - canvasSizeY - 1; }  
	}
	
	function writeMessage(newcanvas, message) {
	    var newcontext = newcanvas.getContext('2d');
	    //newcontext.clearRect(0, 0, newcanvas.width, newcanvas.height);
	    newcontext.font = '18pt Calibri';
	    newcontext.fillStyle = 'black';
	    newcontext.fillText(message, 10, 25);
	}
	
	function getMousePos(newcanvas, evt) {
		var rect = newcanvas.getBoundingClientRect(), root = document.documentElement;
	
	    // return relative mouse position
	    var mouseX = evt.clientX - rect.top - root.scrollTop;
	    var mouseY = evt.clientY - rect.left - root.scrollLeft;
	    globalMouseX = mouseX;
	    globalMouseY = mouseY;
	    return {
	      x: mouseX,
	      y: mouseY	
	    };
	}
	
	this.init = function() {
		for (var i = 0; i < 11; i++) {
			roboArray[i] = new Image();
		}

		roboArray[0].src = "Tree1.png";
		roboArray[1].src = "Tree2.png";
		roboArray[2].src = "Tree3.png";
		roboArray[3].src = "Tree4.png";
		roboArray[4].src = "Tree5.png";
		roboArray[5].src = "Tree6.png";
		roboArray[6].src = "Tree7.png";
		roboArray[7].src = "Tree8.png";
		roboArray[8].src = "Tree9.png";
		roboArray[9].src = "Tree10.png";
		roboArray[10].src = "robot.png";

		for (var i2 = 0; i2 < initialPlants; i2++) {
			RoboTreeArray[i2] = new robot(Math.random()*worldSizeX, Math.random()*worldSizeY, 1, 100);
			//RoboTreeArray[i2] = new robot(400, 400, 1, 100);
			RoboTreeArray[i2].image = roboArray[Math.floor(Math.random()*10)];
		}
		Robot1.image = roboArray[10];
		Robot2.image = roboArray[9];
		
		mmRatioX = 500 / worldSizeX;
		mmRatioY = 250 / worldSizeY;
		
	}
}