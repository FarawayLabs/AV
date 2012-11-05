/*
 *   Alien Vista (working title)
 *   ---------------------------
 * 
 * 
 *   Properties of metals
 *   Titanium: 	density 			4.5 g/cm3
 *             	Young's Modulus		105-120
 * 				Melting Point		1670
 * 				Summary				Titanium is a medium density, medium-strength alloy with a very
 * 									high melting point.  
 * 
 * 	 Bronze: 	density				7.4 - 8.9
 * 				Young's Modulus		96-120
 * 				Melting Point		950
 * 				Summary				Bronze is a high density, medium-strength alloy with a medium
 * 									melting point
 * 
 * 	 Steel:		density				7.85
 * 				Young's Modulus		200
 * 				Melting Point		1425 - 1540
 * 				Summary				Steel is a medium-high density, high-strength alloy with a high
 * 									melting point
 * 		
 * 	 Aluminum:	density				2.5 - 2.8
 * 				Young's Modulus		69
 * 				Melting Point		463 - 671
 * 				Summary				Aluminum is a low density, low-strength alloy with a very low
 * 									melting point.
 * 
 * 
 * 
 */

function AV(canvas) {
		// Initialize Variables
		
		// mobile robot density of about 1 robot per 500,000 pixels is suggested, though this will self-adjust quickly if it's too high
		var mobileRobots = 100;
		var frameNum = 0;
		var mmapUpdate = 1;
		var scrollTransparency = .3;
		var initialPlants = 500000;
		var plantDensity = 2000;  // The larger the number, the lower the density.  Yeah, I know.
		
		var worldSizeX = 8000;
		var worldSizeY = 6000;
		
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
		
		// images for robot
		var roboImageArray = new Array(11);
	
		// segregated mobile robot array
		var Robot = [];
		// segregated robo-tree array
		var RoboTreeArray = [];
		
		// experimental fruit target array
		var FruitTargets = [];
	
	
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
	    var mmTreecontext = canvas2.getContext("2d");
	    
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
		if (timeCounter > 99) {
			timeCounter = 0;
			fps = Math.floor(100000 / (timeArray[99]-timeArray[0]));
		}
		
	    // clear
	    context.clearRect(0, 0, canvasSizeX, canvasSizeY);
	    uicontext.clearRect(0, 0, uiCanvasSizeX, uiCanvasSizeY);
	    

	    // draw
	    drawRobos(context);
	    // request new frame
	    requestAnimFrame(function() {
	      animate(lastTime, myRectangle);
	    });
	    
	    // Robot Thinking and doing
	    for (var irobot3 = 0; irobot3 < Robot.length; irobot3++) {
	    	Robot[irobot3].robotPsyche();
	    	Robot[irobot3].robotAction();
	    	worldWrap(Robot[irobot3]);
	    	Robot[irobot3].trajectory = calcTrajectory(Robot[irobot3].X, Robot[irobot3].Y, Robot[irobot3].destinationX, Robot[irobot3].destinationY, Robot[irobot3].trajectory, Robot[irobot3].maneuver, Robot[irobot3]);
	    }
	    
	    
	    /*
	    Robot1.robotPsyche();
	    Robot1.robotAction();
	    worldWrap(Robot1);
	    Robot1.trajectory = calcTrajectory(Robot1.X, Robot1.Y, Robot1.destinationX, Robot1.destinationY, Robot1.trajectory, Robot1.maneuver, Robot1);
	    
	    Robot2.robotPsyche();
	    Robot2.robotAction();
	    worldWrap(Robot2);
	    Robot2.trajectory = calcTrajectory(Robot2.X, Robot2.Y, Robot2.destinationX, Robot2.destinationY, Robot2.trajectory, Robot2.maneuver, Robot2);
	    */
	    
	    
	    // Check to see if window should be scrolling
	    scrollWindow(context, {x: globalMouseX, y: globalMouseY});
	    
	    // Update FPS counter
	    context.fillStyle = "blue";
		context.font="40px Arial";;
	  	context.fillText(fps, 20, 60);
	  	
	  	// Update the Minimap
	  	if ((frameNum % mmapUpdate) == 0) {
		    // Clear minimap
    	    mmcontext.clearRect(0, 0, mmCanvasSizeX, mmCanvasSizeY);
    	    
			/*
			if ((frameNum % (mmapUpdate * 100)) == 0) {
				// Draw the trees.
				mmTreecontext.fillStyle = "rgba(0, 100, 0, .3)";
				for (var itree = 0; itree < initialPlants; itree++ ) {
					mmTreecontext.fillRect(Math.floor(RoboTreeArray[itree].X  * mmRatioX), Math.floor(RoboTreeArray[itree].Y * mmRatioY), Math.floor(RoboTreeArray[itree].energy * .6), Math.floor(RoboTreeArray[itree].energy * .6));
				}
			}
			*/
    	    
		    //mmcontext.fillRect(0, 0, 1000, 1000);
		    mmcontext.strokeStyle = "rgb(0, 0, 250)";
		    mmcontext.strokeRect(Math.floor(mmViewBoxX), Math.floor(mmViewBoxY), Math.floor(mmViewBoxOppX), Math.floor(mmViewBoxOppY));
		
			// Draw data on the miniMap
			// Draw Robot1

			mmcontext.fillStyle = 'black';
			for (var irobot = 0; irobot < mobileRobots; irobot++) {
				mmcontext.fillRect(Math.floor(Robot[irobot].X * mmRatioX), Math.floor(Robot[irobot].Y * mmRatioY), 2, 2);
				//mmcontext.fillRect(Math.floor(Robot2.X * mmRatioX), Math.floor(Robot2.Y * mmRatioY), 2, 2);
			}
			
			mmcontext.fillStyle = 'red';
			for (var irobot = 0; irobot < mobileRobots; irobot++) {
				// Draw the contrived Robot destination
				mmcontext.fillRect(Math.floor(Robot[irobot].destinationX * mmRatioX), Math.floor(Robot[irobot].destinationY * mmRatioY), 2, 2);
			}

		}
		
		// Clear the UI box
	    uicontext.fillRect(0, 0, 1000, 1000);
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

		// Draw the trees if they are close to the canvas window
		for (var k3=0; k3<initialPlants; k3++) {
			if (RoboTreeArray[k3].X > (canvasOriginX - 20)) {
				if (RoboTreeArray[k3].Y > (canvasOriginY - 20)) {
					if (RoboTreeArray[k3].X < (canvasOriginX + 20 + canvasSizeX)) {
						if (RoboTreeArray[k3].Y < (canvasOriginY + 20 + canvasSizeY)){
							for (var trees = 0; trees < RoboTreeArray[k3].image.length; trees++) {
								context.drawImage(RoboTreeArray[k3].image[trees], Math.floor(RoboTreeArray[k3].X + RoboTreeArray[k3].imagex[trees] - canvasOriginX), Math.floor(RoboTreeArray[k3].Y + RoboTreeArray[k3].imagey[trees] - canvasOriginY));
							}				
						}
					}
				}
			}
		}
		// Draw Robot[] destinations
		
		for (var irobot = 0; irobot < Robot.length; irobot++) {
			// Draw Robot destinations
			context.drawImage(roboImageArray[11], Robot[irobot].destinationX - canvasOriginX, Robot[irobot].destinationY - canvasOriginY);
			context.save();
			context.translate((Robot[irobot].X + Robot[irobot].image[0].width/2) - canvasOriginX, (Robot[irobot].Y + Robot[irobot].image[0].height/2) - canvasOriginY);
			context.rotate((-Robot[irobot].trajectory-90)*Math.PI/180);

			// Draw the robots
			for (var irobotimg = 0; irobotimg < Robot[irobot].image.length; irobotimg++) {
				context.drawImage(Robot[irobot].image[0], 0 - Robot[irobot].image[0].width/2, 0 - Robot[irobot].image[0].height/2);
			}
			context.restore();	
		}
		
	}
	
	function robot(X, Y, alive, energy) {
		this.X = X;
		this.Y = Y;
		this.alive = 1;
		this.energy = 100;
		this.image = [];
		this.image[0] = roboImageArray[10];
		this.imagex = [];
		this.imagex[0] = 0;
		this.imagey = [];
		this.imagey[0] = 0;
		this.destinationX =  300;
		this.destinationY = 220;
		this.speed = .1;
		this.maxspeed = 7;
		this.trajectory = 0;
		this.XVelocity = 1;
		this.YVelocity = 1;
		this.maneuver = 5;
		
		this.carriedMetalTitanium = 0;
		this.carriedMetalAluminum = 0;
		this.carriedMetalSteel = 0;
		this.carriedMetalBronze = 0;
	
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
							
		// Check for Death of robot
		
		if (this.energy < 0) {
			// Robot Dies
		}				
		
		// Change the position of the robot based on its speed	
		this.XVelocity = this.speed * Math.cos(this.trajectory/(180/Math.PI));
		this.YVelocity = (-1) * this.speed * Math.sin(this.trajectory/(180/Math.PI));
		this.X += this.XVelocity;
		this.Y += this.YVelocity;
	}
	
	function roboPsyche() { // This method runs every cycle and is the robot's "brain"
		var distanceX;
		var distanceY;
		var distanceToTarget;
		distanceX = Math.abs(this.destinationX - this.X);
		distanceY = Math.abs(this.destinationY - this.Y);
		distanceToTarget = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
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
		for (var i = 0; i < 100; i++) {
			roboImageArray[i] = new Image();
		}		

		roboImageArray[0].src = "Tree1.png";
		roboImageArray[1].src = "Tree2.png";
		roboImageArray[2].src = "Tree3.png";
		roboImageArray[3].src = "Tree4.png";
		roboImageArray[4].src = "Tree5.png";
		roboImageArray[5].src = "Tree6.png";
		roboImageArray[6].src = "Tree7.png";
		roboImageArray[7].src = "Tree8.png";
		roboImageArray[8].src = "Tree9.png";
		roboImageArray[9].src = "Tree10.png";
		roboImageArray[10].src = "robot.png";
		roboImageArray[11].src = "Fruit1.png";
		roboImageArray[12].src = "SP1.png";
		roboImageArray[13].src = "SP2.png";
		roboImageArray[14].src = "SP3.png";
		roboImageArray[15].src = "SP4.png";
		

		for (var i2 = 0; i2 < initialPlants; i2++) {
			RoboTreeArray[i2] = new robot(Math.random()*worldSizeX, Math.random()*worldSizeY, 1, 100);
			//RoboTreeArray[i2] = new robot(400, 400, 1, 100);
			RoboTreeArray[i2].energy = Math.floor(Math.random()*10);
			RoboTreeArray[i2].image[0] = roboImageArray[RoboTreeArray[i2].energy];
			for (var itree = 0; itree < (Math.random() * 10); itree++) {
				RoboTreeArray[i2].image[itree] = roboImageArray[Math.floor((Math.random() * 4) + 12)];
				RoboTreeArray[i2].imagex[itree] = Math.floor(Math.random() * 20) - 10;
				RoboTreeArray[i2].imagey[itree] = Math.floor(Math.random() * 20) - 10;
			}
		}
		
		//RoboTreeArray[0].image = 
		
		for (var irobot2 = 0; irobot2 < mobileRobots; irobot2++) {
			Robot[irobot2] = new robot(200,50,1,100);
			Robot[irobot2].image[0] = roboImageArray[10];
		}

		//Robot1.image = roboImageArray[10];
		//Robot2.image = roboImageArray[9];
		
		mmRatioX = 500 / worldSizeX;
		mmRatioY = 250 / worldSizeY;
		
	}
}