/*
 *   Alien Vista (working title)
 *   ---------------------------
 * 
 * 
 *   Properties of metals
 *   Titanium: 	density 			4.5 g/cm3
 *             	Young's Modulus		105
 * 				Melting Point		1670
 * 				Summary				Titanium is a medium density, medium-strength alloy with a very
 * 									high melting point.  
 * 
 * 	 Bronze: 	density				9.0
 * 				Young's Modulus		96
 * 				Melting Point		950
 * 				Summary				Bronze is a high density, medium-strength alloy with a medium
 * 									melting point
 * 
 * 	 Steel:		density				7.8
 * 				Young's Modulus		200
 * 				Melting Point		1425
 * 				Summary				Steel is a medium-high density, high-strength alloy with a high
 * 									melting point
 * 		
 * 	 Aluminum:	density				2.5
 * 				Young's Modulus		69
 * 				Melting Point		463
 * 				Summary				Aluminum is a low density, low-strength alloy with a very low
 * 									melting point.
 * 
 * 
 * 
 */

function AV(canvas) {
		// Initialize Variables
		
		// mobile robot density of about 1 robot per 500,000 pixels is suggested, though this will self-adjust quickly if it's too high
// Population Parameters
		var mobileRobots = 1;
		var initialPlants = 500000;
		var plantDensity = 10000;  // The larger the number, the lower the density.  Yeah, I know.
		
// World Parameters		
		var worldSizeX = 1000;
		var worldSizeY = 1000;
		var energyIntensity = 200;	// increase energy harvest by this factor
		var LatheModifier = .5;	// make lathing less energy intensive by this factor
	
		var frameNum = 0;
		var mmapUpdate = 1;		
		var scrollTransparency = .3;
		
		
		var TreeChance = 3;		
		var TreeChanceCounter = 0;
		initialPlants = (worldSizeX * worldSizeY / plantDensity);
		
		var minScarceTitanium = 25;
		var minScarceBronze = 50;
		var minScarceSteel = 50;
		var minScarceAluminum = 10;
		
		
// Usert Interface Variables
		var userPause = 0;
		var userSelectActive = 0;


		var savelastTime;
		var savemyRectangle;

		var scrollLock = 0; 	// Which robot should be followed?
		var scrollRandom = 1; 	// Should the tracking randomly switch occassionally?
		
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
		
		// Variables pertaining to panning on the map
		var smallMoveZone = 150;		// distance from edge to allow slow panning
		var largeMoveZone = 75;			// distance from edge to allow fast panning
		var mousePosBufferZone = 3;		// distance from edge where no panning occurs.  Should help when the mouse leaves the canvas
		var smallMove = 2;				// how many pixels to travel for each small move
		var largeMove = 2;				// how many pixels to travel (in addition) for each large move
		
		var mmMouseX = 200;
		var mmMouseY = 200;
		var cpMouseX = 0;
		var cpMouseY = 0;
		var globalMouseX = 200;
		var globalMouseY = 200;
		
		var timeArray = [];
		var timeCounter = 0;
		var fps = 0;
		
		var closestIndex;
		var closestType;
		
		// this array holds the positions of every entity
		var entityArray = [];
		var entityGridArray = new Array();
		var GridSize = 100;				// set the spacing of the grid
		for (var i = 0; i < (Math.floor(worldSizeX / GridSize)); i++ ) {
			entityGridArray[i] = new Array();
			for (var j = 0; j < (Math.floor(worldSizeY / GridSize)); j++ ) {
				entityGridArray[i][j] = new Array();
			}
		}
		
		// images for robot
		var roboImageArray = new Array(11);
		
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
		roboImageArray[16].src = "VPylon.png";
		roboImageArray[17].src = "HPylon.png";
		roboImageArray[18].src = "Trunk.png";
		roboImageArray[19].src = "blank.png";
		roboImageArray[20].src = "Multibracket.png";
		roboImageArray[21].src = "SolarPylon.png";
		roboImageArray[22].src = "Pylon.png";
		roboImageArray[23].src = "Crosshair.png";
		roboImageArray[24].src = "Crosshaired.png";
		roboImageArray[25].src = "Pause.png";
		roboImageArray[26].src = "Paused.png";
		
	
		// segregated mobile robot array
		var Robot = [];
		// segregated robo-tree array
		var RoboTreeArray = [];

		// experimental fruit target array
		var FruitTargets = [];
		
		var componentBlueprint = [];
				
		for (test = 0; test < 100; test++) {
			componentBlueprint[test] = {
				"code": "00000000",
				"compName": "null",
				"dimX0": 0,
				"dimY0": 0,
				"dimZ0": 0,
				"dimX100": 0,
				"dimY100": 0,
				"dimZ100": 0,
				"angleX": 0,
				"angleY": 0,
				"angleZ": 0,
				"angleXjitter": 0,
				"angleYjitter": 0,
				'angleZjitter': 0,
				"yawX": 0,
				"yawY": 0,
				"yawZ": 0,
				"yawXjitter": 0,
				"yawYjitter": 0,
				"yawZjitter": 0,
				"volumeRatio0": 1,
				"volumeRatio100": 1,
				"overallScale": 1,
				"imageSource": roboImageArray[19],
				"HardTopMin": 0,
				"HardTopMax": 0,
				"HardTopSpecify": -1,
				"HardTopActivate": 1,
				"HardTopJitter": 0,
				"HardRadialMin": 0,
				"HardRadialMax": 0,
				"HardRadialSpecify": -1,
				"HardRadialActivate": 1,
				"HardRadialJitter": 0,
				"Complexity": 1,
				"NanolatheCapability": 0,
				"scaleMax": 1
			}
		}
		
		
		componentBlueprint[0].code = "00000000";
		componentBlueprint[0].compName = "Root Structure";
		componentBlueprint[0].dimX0 = .03;
		componentBlueprint[0].dimY0 = .03;
		componentBlueprint[0].dimZ0 = .02; 
		componentBlueprint[0].dimX100 = 3;
		componentBlueprint[0].dimY100 = 3;
		componentBlueprint[0].dimZ100 = -2;
		componentBlueprint[0].volumeRatio0 = .01;
		componentBlueprint[0].volumeRatio100 = .01;
		componentBlueprint[0].imageSource = roboImageArray[19];
		
		 
		componentBlueprint[1].code = "00000001";
		componentBlueprint[1].compName = "Pylon";
		componentBlueprint[1].dimX100 = 1; 
		componentBlueprint[1].dimY100 = .1;
		componentBlueprint[1].dimZ100 = .1;
		componentBlueprint[1].volumeRatio0 = .1;
		componentBlueprint[1].volumeRatio100 = .1;
		componentBlueprint[1].imageSource = roboImageArray[16];
		
		componentBlueprint[3].code = "00000003";
		componentBlueprint[3].compName = "SolarPanel";
		componentBlueprint[3].dimX0 = .005;
		componentBlueprint[3].dimY0 = .005;
		componentBlueprint[3].dimZ0 = .1;
		componentBlueprint[3].dimX100 = 2;
		componentBlueprint[3].dimY100 = 2;
		componentBlueprint[3].dimZ100 = .1;
		componentBlueprint[3].volumeRatio0 = .6666;
		componentBlueprint[3].volumeRatio100 = .6666;
		componentBlueprint[3].imageSource = roboImageArray[21];
		componentBlueprint[3].scaleMax = .5;
				
		componentBlueprint[4].code = "00000004";
		componentBlueprint[4].compName = "TrunkStick";
		componentBlueprint[4].dimX0 = .01;
		componentBlueprint[4].dimY0 = .01;
		componentBlueprint[4].dimZ0 = .1;
		componentBlueprint[4].dimX100 = 1;
		componentBlueprint[4].dimY100 = 1;
		componentBlueprint[4].dimZ100 = 10;
		componentBlueprint[4].angleZjitter = 10;
		componentBlueprint[4].yawZ = 20;
		componentBlueprint[4].yawZjitter = 10;
		componentBlueprint[4].volumeRatio0 = .7854;
		componentBlueprint[4].volumeRatio100 = .7854;
		componentBlueprint[4].NanolatheCapability = 1;
		componentBlueprint[4].imageSource = roboImageArray[18];
		componentBlueprint[4].HardTopMin = 1;
		componentBlueprint[4].HardTopMax = 1;
		
		componentBlueprint[5].code = "00000005";
		componentBlueprint[5].compName = "RandomBracket";
		componentBlueprint[5].dimX0 = .001;
		componentBlueprint[5].dimY0 = .001;
		componentBlueprint[5].dimZ0 = .001;
		componentBlueprint[5].dimX100 = .1;
		componentBlueprint[5].dimY100 = .1;
		componentBlueprint[5].dimZ100 = .1;
		componentBlueprint[5].imageSource = 19;
		componentBlueprint[5].HardTopMin = 4;
		componentBlueprint[5].HardTopMax = 8;
		componentBlueprint[5].HardTopJitter = 15;
		componentBlueprint[5].volumeRatio0 = .1;
		componentBlueprint[5].volumeRatio100 = .1;
		componentBlueprint[5].imageSource = roboImageArray[20];
		
		/*
		component0Blueprint[6].code = "00000006";
		componentBlueprint[6].compName = "Branch";
		componentBlueprint[6].dimX0 = .01;
		componentBlueprint[6].dimY0 = .01;
		componentBlueprint[6].dimZ0 = .01;
		componentBlueprint[6].dimX100 = .5;
		componentBlueprint[6].dimY100 = .1;
		componentBlueprint[6].dimZ100 = .1;
		componentBlueprint[6].code = "00000006";
		componentBlueprint[6].code = "00000006";
		componentBlueprint[6].code = "00000006";
		*/
		
		componentBlueprint[6] = componentBlueprint[4];
		componentBlueprint[6].code = "00000006";
		componentBlueprint[6].compName = "Branch";
		componentBlueprint[6].imageSource = roboImageArray[22];
		componentBlueprint[6].scaleMax = .4;
		
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
		if (userPause == 0) {
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
			if (timeCounter > 9) {
				timeCounter = 0;
				fps = Math.floor(10000 / (timeArray[9]-timeArray[0]));
			}
			
		    // clear
		    context.clearRect(0, 0, canvasSizeX, canvasSizeY);
		    //uicontext.clearRect(0, 0, uiCanvasSizeX, uiCanvasSizeY);
		    
	
		    // draw
		    drawRobos(context);
		    
		    savelastTime = lastTime;
		    savemyRectangle = myRectangle;
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
		    
		   
		    // Trees doing tree-stuff
		    if (TreeChanceCounter == 0) {
		    	//alert ("Charging");
		    	for (var i = 0; i < RoboTreeArray.length; i++) {
	    			RoboTreeArray[i].robotTreeCharge();
		    	}
		    }
		    
		    // The trees don't do stuff every time through the loop.  
		    TreeChanceCounter++;
		    if (TreeChanceCounter > TreeChance) {
		    	TreeChanceCounter = 0;
		    }
    		
    		
    		// Clear the grid array
    		for (var i = 0; i < (Math.floor(worldSizeX / GridSize)); i++ ) {
				entityGridArray[i] = new Array();	
				for (var j = 0; j < (Math.floor(worldSizeY / GridSize)); j++ ) {
					entityGridArray[i][j] = new Array();
				}
			}

		    // Update the grid Array
		    for (var i = 0; i < (RoboTreeArray.length + Robot.length); i++) {
		    	var posArray = [];
		    	if (i < RoboTreeArray.length) {
		    		posArray.type = "RoboTree";
		    		posArray.x = RoboTreeArray[i].X;
		    		posArray.y = RoboTreeArray[i].Y;
		    		posArray.slot = i;
		    	} else {
		    		posArray.type = "Robot";
		    		posArray.x = Robot[i - RoboTreeArray.length].X;
		    		posArray.y = Robot[i - RoboTreeArray.length].Y;
		    		posArray.slot = i - RoboTreeArray.length;
		    	}
		    	
		    	entityGridArray[Math.floor(posArray.x / GridSize)][Math.floor(posArray.y / GridSize)][entityGridArray[Math.floor(posArray.x / GridSize)][Math.floor(posArray.y / GridSize)].length] = posArray;
		    
		    }
			
		    // Check to see if window should be scrolling
		    scrollWindow(context, {x: globalMouseX, y: globalMouseY});
		    
		    // Update FPS counter
		    context.fillStyle = "blue";
			context.font="40px Arial";
		  	context.fillText(fps, 20, 60);
		  	
// Make this its own sub, as in drawRobos
		  	// Update the Minimap
		  	if ((frameNum % mmapUpdate) == 0) {
			    // Clear minimap
	    	    mmcontext.clearRect(0, 0, mmCanvasSizeX, mmCanvasSizeY);
	    	    
				// Draw the trees.
				mmTreecontext.fillStyle = "rgba(0, 100, 0, .3)";
				for (var itree = 0; itree < initialPlants; itree++ ) {
					mmTreecontext.beginPath();
					mmTreecontext.arc(RoboTreeArray[itree].X * mmRatioX, RoboTreeArray[itree].Y * mmRatioY, Math.pow(RoboTreeArray[itree].mass, .1), 0, 2 * Math.PI, false);
					//mmTreecontext.arc(RoboTreeArray[itree].X + canvasOriginX, RoboTreeArray[itree].Y + canvasOriginY, RoboTreeArray[itree].mass, 0, 2 * Math.PI, false);
					//mmTreecontext.arc(RoboTreeArray[itree].X, RoboTreeArray[itree].Y, RoboTreeArray[itree].mass, 0, 2 * Math.PI, false);
					mmTreecontext.fill();
					//mmTreecontext.fillRect(Math.floor(RoboTreeArray[itree].X  * mmRatioX), Math.floor(RoboTreeArray[itree].Y * mmRatioY), Math.floor(RoboTreeArray[itree].energy * .6), Math.floor(RoboTreeArray[itree].energy * .6));
				}
				
			    //mmcontext.fillRect(0, 0, 1000, 1000);
			    mmcontext.strokeStyle = "rgb(0, 0, 250)";
			    mmcontext.strokeRect(Math.floor(mmViewBoxX), Math.floor(mmViewBoxY), Math.floor(mmViewBoxOppX), Math.floor(mmViewBoxOppY));
			
				// Draw data on the miniMap
				// Draw Robot1
	
				mmcontext.fillStyle = 'black';
				for (var irobot = 0; irobot < mobileRobots; irobot++) {
					mmcontext.fillRect((Robot[irobot].X * mmRatioX), (Robot[irobot].Y * mmRatioY), 2, 2);
					//mmcontext.fillRect(Math.floor(Robot2.X * mmRatioX), Math.floor(Robot2.Y * mmRatioY), 2, 2);
				}
				
				mmcontext.fillStyle = 'red';
				for (var irobot = 0; irobot < mobileRobots; irobot++) {
					// Draw the contrived Robot destination
					mmcontext.fillRect(Math.floor(Robot[irobot].destinationX * mmRatioX), Math.floor(Robot[irobot].destinationY * mmRatioY), 2, 2);
				}
	
			}
			
		}
		cpClear(uicontext);
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
	    
	    var cpcanvas = document.getElementById('UI');
	    var cpcontext = cpcanvas.getContext('2d');
	
	    newcanvas.addEventListener('mousemove', function(evt) {
	      var mousePos = getMousePos(newcanvas, evt);
	    }, false);
	    
	    newcanvas.addEventListener('mousedown', function(evt) {
	      var clickmousePos = getMousePos (newcanvas, evt);
	      mainClick(newcontext, clickmousePos);
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
        
        cpcanvas.addEventListener('mousedown', function(evt) {
        	var cpmousePos = getMousePos(cpcanvas, evt);
        	//cpMouseX = cpmousePos.x - 164.14999389648438;
        	cpMouseX = cpmousePos.x - canvasSizeX + 254;
        	cpMouseY = cpmousePos.y - (mmCanvasSizeY) + 796;
        	cpClick(cpcontext);
        }, false);
	};
	
	function minimapClick() {
		scrollLock = -1;
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
		
		// Code to follow a robot
		if (scrollLock >= 0) {
			if (scrollRandom == 1) {
				if (Math.floor(Math.random() * 500) == 10) { 
					scrollLock = Math.floor(Math.random() * Robot.length); 
				}
			}
			canvasOriginX = Robot[scrollLock].X - (canvasSizeX / 2);
			canvasOriginY = Robot[scrollLock].Y - (canvasSizeY / 2);
			
			scrollOverflow();
		}
		
				
		for (var irobot = 0; irobot < Robot.length; irobot++) {
			// Draw Robot destinations
			context.drawImage(roboImageArray[11], Robot[irobot].destinationX - canvasOriginX, Robot[irobot].destinationY - canvasOriginY);
			context.save();
			context.translate((Robot[irobot].X + Robot[irobot].image[0].width/2) - canvasOriginX, (Robot[irobot].Y + Robot[irobot].image[0].height/2) - canvasOriginY);
			context.rotate((-Robot[irobot].trajectory-90)*Math.PI/180);

			// Draw the robots
			for (var irobotimg = 0; irobotimg < Robot[irobot].image.length; irobotimg++) {
				context.drawImage(Robot[irobot].image[0], 0 - Robot[irobot].image[0].width/2, 0 - Robot[irobot].image[0].height/2);
				// Draw right-overlap and bottom-overlap robot
			}
			context.restore();	
		}
		//context.drawImage(Robot[0].image[0], -15, -15);
		

		
		// Draw the trees if they are close to the canvas window
		for (var k3=0; k3<initialPlants; k3++) {
			if (RoboTreeArray[k3].X > (canvasOriginX - 20)) {
				if (RoboTreeArray[k3].Y > (canvasOriginY - 20)) {
					if (RoboTreeArray[k3].X < (canvasOriginX + 20 + canvasSizeX)) {
						if (RoboTreeArray[k3].Y < (canvasOriginY + 20 + canvasSizeY)){
							for (var treeparts = 0; treeparts < RoboTreeArray[k3].components.length; treeparts++) {
								//alert (RoboTreeArray[k3].components[treeparts].imageSource);
								var CompScale = (RoboTreeArray[k3].components[treeparts].dimX / RoboTreeArray[k3].components[treeparts].dimX100); 
								//alert (CompScale);
								
								
								context.save();
								//context.translate((RoboTreeArray[k3].X - canvasOriginX) - (((RoboTreeArray[k3].components[treeparts].imageSource.width) * CompScale)/2), (RoboTreeArray[k3].Y - canvasOriginY) - (((RoboTreeArray[k3].components[treeparts].imageSource.height) * CompScale)/2));
								context.translate((RoboTreeArray[k3].X - canvasOriginX), (RoboTreeArray[k3].Y - canvasOriginY));
								context.rotate(RoboTreeArray[k3].components[treeparts].angleZ*(Math.PI/180));
								//context.drawImage(RoboTreeArray[k3].components[treeparts].imageSource, (RoboTreeArray[k3].X - canvasOriginX) - (((RoboTreeArray[k3].components[treeparts].imageSource.width) * CompScale)/2), (RoboTreeArray[k3].Y - canvasOriginY) - (((RoboTreeArray[k3].components[treeparts].imageSource.height) * CompScale)/2), CompScale*RoboTreeArray[k3].components[treeparts].imageSource.width, CompScale*RoboTreeArray[k3].components[treeparts].imageSource.height);
								context.drawImage(RoboTreeArray[k3].components[treeparts].imageSource, 0-(((RoboTreeArray[k3].components[treeparts].imageSource.width) * CompScale)/2),0-(((RoboTreeArray[k3].components[treeparts].imageSource.height) * CompScale)/2), CompScale*RoboTreeArray[k3].components[treeparts].imageSource.width, CompScale*RoboTreeArray[k3].components[treeparts].imageSource.height);
								context.restore();
								
								
								//context.drawImage(RoboTreeArray[k3].components[treeparts].imageSource, 100, 100);
								//context.fillRect(RoboTreeArray[k3].X - canvasOriginX, RoboTreeArray[k3].Y - canvasOriginY, 3, 3);
								/*
								// Draw branches
								context.beginPath();
								context.moveTo(RoboTreeArray[k3].X - canvasOriginX, RoboTreeArray[k3].Y - canvasOriginY);
								context.lineTo(RoboTreeArray[k3].X + (RoboTreeArray[k3].image[trees].width / 2) + RoboTreeArray[k3].imagex[trees] - canvasOriginX, RoboTreeArray[k3].Y + (RoboTreeArray[k3].image[trees].height / 2) + RoboTreeArray[k3].imagey[trees] - canvasOriginY);
								context.lineWidth = 2;
								context.stroke();
								
								// Draw Tree
								context.drawImage(RoboTreeArray[k3].image[trees], Math.floor(RoboTreeArray[k3].X + RoboTreeArray[k3].imagex[trees] - canvasOriginX), Math.floor(RoboTreeArray[k3].Y + RoboTreeArray[k3].imagey[trees] - canvasOriginY));
								*/
							}				
						}
					}
				}
			}
		}

	}
	
	// Definition of the robot object
	function robot(X, Y, alive, energy) {
		this.X = X;
		this.Y = Y;
		this.alive = 1;
		this.energy = energy;
		this.image = [];
		this.image[0] = roboImageArray[10];
		this.imagex = [];
		this.imagex[0] = 0;
		this.imagey = [];
		this.imagey[0] = 0;
		this.destinationX =  800;
		this.destinationY = 190;
		this.speed = .1;
		this.maxspeed = 3;
		this.trajectory = 0;
		this.XVelocity = 1;
		this.YVelocity = 1;
		this.maneuver = 5;
		
		this.mass = 0;
		this.components = [];
		
		this.inventoryMetalTitanium = 0;
		this.inventoryMetalAluminum = 0;
		this.inventoryMetalSteel = 0;
		this.inventoryMetalBronze = 0;
		
		this.MetalTitaniumNeeded = 0;
		this.MetalAluminumNeeded = 0;
		this.MetalSteelNeeded = 0;
		this.MetalBronzeNeeded = 0;
		
		this.robotTreeCharge = treeCharge;
		this.robotAction = roboAction;
		this.robotPsyche = roboPsyche;
		this.robotChangeDestinationSet = changeDestinationSet;
		this.robotChangeDestinationRand = changeDestinationRand;
		this.robotWorldWrap = worldWrap;
	
		this.lastHarvest = 0;  									// Tracks the last energy harvest
		this.growDelayCounter = 10000;								// Used to delay the growth of new components
	}
	
	/*   Component Type List (codes)
	 *   -------------------------------------
	 *		00000000 - (Chassis) Root Structure     // Fixed root structure that extracts metal from the ground
	 *      00000001 - (Component) Pylon Structure   // A fixed structure that can support additional weight
	 *      00000002 - (Chassis) Shell
	 *      00000003 - Solar Panel
	 * 
	 * 	Titanimum 4.5
	 *  Bronze 9.0
	 *  Steel   7.8
	 *  Aluminum 2.5
	 */
	
	// Definition of the robot component object
	//function roboComponent (componentDesc, scale, scalemax, health, titanium, bronze, steel, aluminum, connectsToIndex, growable, imagesource) {
	function roboComponent (blueprintID, scale, scalemax, health, titanium, bronze, steel, aluminum, parentIndex, HardPointIndex, growable, imagesource, imageRot) {
		// Populate component parameters from the blueprint
		this.code = componentBlueprint[blueprintID].code;
		this.compName = componentBlueprint[blueprintID].compName;
		this.dimX0 = componentBlueprint[blueprintID].dimX0;
		this.dimY0 = componentBlueprint[blueprintID].dimY0;
		this.dimZ0 = componentBlueprint[blueprintID].dimZ0;
		this.dimX100 = componentBlueprint[blueprintID].dimX100;
		this.dimY100 = componentBlueprint[blueprintID].dimY100;
		this.dimZ100 = componentBlueprint[blueprintID].dimZ100;
		this.angleX = componentBlueprint[blueprintID].angleX;
		this.angleY = componentBlueprint[blueprintID].angleY;
		this.angleZ = componentBlueprint[blueprintID].angleZ;
		this.angleXjitter = componentBlueprint[blueprintID].angleXjitter;
		this.angleYjitter = componentBlueprint[blueprintID].angleYjitter;
		this.angleZjitter = componentBlueprint[blueprintID].angleZjitter;
		this.yawX = componentBlueprint[blueprintID].yawX;
		this.yawY = componentBlueprint[blueprintID].yawY;
		this.yawZ = componentBlueprint[blueprintID].yawZ;
		this.yawXjitter = componentBlueprint[blueprintID].yawXjitter;
		this.yawYjitter = componentBlueprint[blueprintID].yawYjitter;
		this.yawZjitter = componentBlueprint[blueprintID].yawZjitter;
		this.volumeRatio0 = componentBlueprint[blueprintID].volumeRatio0;
		this.volumeRatio100 = componentBlueprint[blueprintID].volumeRatio100;
		this.overallScale = componentBlueprint[blueprintID].overallScale;
		this.imageSource = componentBlueprint[blueprintID].imageSource;
		this.HardRadialMin = componentBlueprint[blueprintID].HardRadialMin;
		this.HardRadialMax = componentBlueprint[blueprintID].HardRadialMax;
		this.HardRadialSpecify = componentBlueprint[blueprintID].HardRadialSpecify;
		this.HardRadialActivate = componentBlueprint[blueprintID].HardRadialActivate;
		this.HardRadialJitter = componentBlueprint[blueprintID].HardRadialJitter;
		this.HardTopMin = componentBlueprint[blueprintID].HardTopMin;
		this.HardTopMax = componentBlueprint[blueprintID].HardTopMax;
		this.HardTopSpecify = componentBlueprint[blueprintID].HardTopSpecify;
		this.HardTopActivate = componentBlueprint[blueprintID].HardTopActivate;
		this.HardTopJitter = componentBlueprint[blueprintID].HardTopJitter;

		this.Complexity = componentBlueprint[blueprintID].Complexity;
		this.NanolatheCapability = componentBlueprint[blueprintID].NanolatheCapability;
		this.scaleMax = componentBlueprint[blueprintID].scaleMax;

		this.dimX = this.dimX0;
		this.dimY = this.dimY0;
		this.dimZ = this.dimZ0;
		
		this.currentLoad = 0;
		this.currentLoadAvailable = 0;
		
		this.currentVolumeRatio = this.volumeRatio100;
		
		// Figure out how many hard points to have
		if ((this.HardTopSpecify >= this.HardTopMin) && (this.HardTopSpecify <= this.HardTopMax)) {
			//alert ("one");
		} else {
			this.HardTopSpecify = this.HardTopMin + (Math.round(Math.random() * (this.HardTopMax - this.HardTopMin)));
		}
		
		this.HardTopAngles = [];
		// Populate the HardTop angles
		if (this.HardTopSpecify > 0) {
			for (var i = 0; i < this.HardTopSpecify; i ++) {
				if (i > 0) {
					this.HardTopAngles[i] = this.HardTopAngles[i-1] + (360 / this.HardTopSpecify) + (360 / this.HardTopSpecify)*(((Math.random() * 2 * this.HardTopJitter)-this.HardTopJitter)/100);
				} else {
					this.HardTopAngles[i] = (Math.random() * 360) + (360 / this.HardTopSpecify) + (360 / this.HardTopSpecify)*(((Math.random() * 2 * this.HardTopJitter)-this.HardTopJitter)/100);
				}
				//alert (this.HardTopAngles[i]);		
			}
		} else {
			this.HardTopAngles[0] = 0;
		}

		// Array listing hard point children
		this.HardTopChildren = [];
		for (var i = 0; i < this.HardTopMax; i++) {
			this.HardTopChildren[i] = -1;
		}
		//alert (this.HardPointChildren.length);
		// number of children
		this.NumberOfChildren = 0;
		
		this.MakeupTitanium = titanium;
		this.MakeupSteel = steel;
		this.MakeupBronze = bronze;
		this.MakeupAluminum = aluminum;
		
		this.totalMetal = titanium + bronze + steel + aluminum;
		this.averageStrength = ((titanium * 105) + (bronze * 96) + (steel * 200) + (aluminum * 69)) / this.totalMetal;
		this.averageDensity = ((titanium * 4.5) + (bronze * 9.0) + (steel * 7.8) + (aluminum * 2.5)) / this.totalMetal;
		this.averageMelt = ((titanium * 1670) + (bronze * 950) + (steel * 1425) + (aluminum * 463)) / this.totalMetal;
		
		this.parentID = parentIndex;
		this.hardPointID = HardPointIndex;
		this.imageRotation = imageRot;
		this.mass = 0; 

		//alert (this.averageStrength);
		//this.orientationArray = [];
	 
	}
	
	function treeAddComponent (tree, blueprintID, scale, scaleMax, health, titanium, bronze, steel, aluminum, parentIndex, HardTopIndex, growable, imagesource, imageRot) {
		var success = 0;
		// existingComponents is the amount of components in the parent tree
		var existingComponents = tree.components.length;
	// if there are no components, 
	//if (existingComponents == 0) { existingComponents = 1; }
		
		// Create array containing the indices of available hard point locations of the parent component
		var possibleSlots = [];
		var totPossibleSlots = 0;
		for (var i = 0; i < tree.components[parentIndex].HardTopSpecify; i++) {
			if (tree.components[parentIndex].HardTopChildren[i] > 0) {
			} else {
				possibleSlots[totPossibleSlots] = i;
				totPossibleSlots++;
			}
		}
		var destination = -1
		// If a hard point index is not specified, pick a random one.
//         if the specified index is greater than then number of specified hard points |OR| specified index < 0 |OR| the Parent component's HardTopChildren array with specified index has a 
		if ((HardTopIndex >= (tree.components[parentIndex].HardTopSpecify - 1)) || ((HardTopIndex < 0) || (tree.components[parentIndex].HardTopChildren[HardTopIndex] > -1 ))) {
			destination = Math.floor(Math.random() * (possibleSlots.length));
		}
		
		// if there's a valid destination, create the component
		if (destination < 0) {
		} else if (possibleSlots.length > 0) {
			destination = possibleSlots[destination];
			//alert (destination);
			// Instantiate component
			tree.components[existingComponents] = new roboComponent(blueprintID, scale, scaleMax, health, titanium, bronze, steel, aluminum, parentIndex, destination, growable, imagesource, imageRot);
			// Set the rotation angle for the new component
			tree.components[existingComponents].angleZ = tree.components[parentIndex].HardTopAngles[destination];
			// Set the hard parent's hard point index for the new component
			tree.components[existingComponents].hardPointID = destination;
			// Set the parent's HardTopChildren array item to "occupied" so it won't be selected later
			tree.components[parentIndex].HardTopChildren[destination] = tree.components.length;
			// Increment the parent's children number
			tree.components[parentIndex].NumberOfChildren++;
			success = 1;
		}
		
		/*
		if (existingComponents != 1) {
			tree.components[parentIndex].NumberOfChildren++;
			//tree.components[existingComponents].angleZ = tree.components[existing]
		} 
		*/
		
		return success;
	}
	
	function treeBuilder () {
		var newTree = new robot(Math.random()*worldSizeX, Math.random()*worldSizeY, 1, 50000);
		// Make some roots
		
		newTree.components[0] = new roboComponent(0, 1.0, 10,.05, 50, 50, 50, 50, -1, 0, 1, roboImageArray[19], 0);
		
		// Make a trunk
		newTree.components[1] = new roboComponent(4, 3.0, 10, .05, 50, 50, 50, 50, 0, 0, 1, roboImageArray[16]),0;
		newTree.components[newTree.components[1].parentID].NumberOfChildren++;
		//newTree.components[1] = new roboComponent()
		
		// Make a bracket
		newTree.components[2] = new roboComponent(5, 1.0, 10, .05, 50, 50, 50, 50, 1, 0, 1, roboImageArray[19], 0);
		newTree.components[newTree.components[2].parentID].NumberOfChildren++;
		
		// Make a solar panel explicitly
		/*
		newTree.components[3] = new roboComponent(3, 1.0, 3, .05, 50, 50, 50, 50, 2, 0, 1, roboImageArray[21], 0);
		newTree.components[newTree.components[3].parentID].NumberOfChildren++;
		// Rotate the piece appropriately
		newTree.components[3].angleZ = newTree.components[2].HardTopAngles[0]; 
		newTree.components[2].HardTopChildren[0] = 3;
		*/
		var foo = treeAddComponent(newTree, 3, 1.0, 3, .05, 50, 50, 50, 50, 2, -1, 1, roboImageArray[21], 0);
		foo = treeAddComponent(newTree, 3, 1.0, 3, .05, 50, 50, 50, 50, 2, -1, 1, roboImageArray[21], 0);
		
		//alert ("abort");
		/*
		newTree.components[5] = new roboComponent(3, 1.0, 3, .05, 50, 50, 50, 50, 2, 1, 1, roboImageArray[21], 0);
		newTree.components[newTree.components[5].parentID].NumberOfChildren++;
		newTree.components[5].angleZ = newTree.components[2].HardTopAngles[2];
		*/
		
	
		/*
		 * Each tree should have a genetically-controlled list of initial components followed by a list of "and then build..."
		 * components.  Once the initial list is populated, it goes to the "and then build" list and loops through that list.
		 * 
		 * Additionally, genes should control how much of the energy is spent each turn on growing new components, growing fruit,
		 * and growing solar panels.
		 */
	
		/*
		// Makes some random solar panel size/locations
		/for (var itree = 0; itree < (Math.random() * 10); itree++) {
			newTree.image[itree] = roboImageArray[Math.floor((Math.random() * 4) + 12)];
			newTree.imagex[itree] = Math.floor(Math.random() * 30) - 15;
			newTree.imagey[itree] = Math.floor(Math.random() * 30) - 15;
		}
		*/
		
		return newTree;
	}
	
	// Definition of the proto-ro
	function roboFoetus (energyNeed, titaniumNeed, bronzeNeed, steelNeed, aluminumNeed) {
		var energy = 0;
		var titanium = 0;
		var bronze = 0;
		var steel = 0;
		var aluminum = 0;
		var energyNeeded = energyNeed;
		var titaniumNeeded = titaniumNeed;
		var bronzeNeeded = bronzeNeed;
		var steelNeeded = steelNeed;
		var aluminumNeeded = aluminumNeed; 
	}
	
	function LoadCalc (componentArray) {
		// Add loads
		for (var i = (componentArray.length - 1); i > 0; i--) {
			//alert ("component: " + i + " mass: " + componentArray[i].mass + " currentload:" + componentArray[i].currentLoad);
			componentArray[componentArray[i].parentID].currentLoad += (componentArray[i].mass + componentArray[i].currentLoad);
		}
	}
	
	function StrengthCalc (componentArray) {
		// Calc Strength
		for (var i = (componentArray.length - 1); i > 0; i--) {
			componentArray[i].currentLoadAvailable = ((componentArray[i].averageStrength * componentArray[i].dimX * componentArray[i].dimY * componentArray[i].dimY) / (componentArray[i].dimZ)) - componentArray[i].currentLoad;
		}
	}
	
	function treeCharge () {
	// absorb solar energy
		// Loop through components and find the solar panels and get energy for each
		this.lastHarvest = 0;
		var solarPanels = 0;
		for (var i = 0; i < this.components.length; i++) {
			if (this.components[i].code == "00000003") {
				solarPanels++;
				// We have a solar panel
				var energyHarvest = this.components[i].dimX * this.components[i].dimY * energyIntensity;
				//alert ("energy harvest:" + i + " " + energyHarvest);
				this.energy += energyHarvest * TreeChance;
				this.lastHarvest += energyHarvest;
			}	
		}
		
		
	// use energy to live
	
		this.energy -= (this.mass * TreeChance);
		this.energy -= (this.components.length * TreeChance);
		
	// absorb Metals
		//this.inventoryMetalTitanium += 1;
		//this.inventoryMetalBronze += 1;
		//this.inventoryMetalSteel += 1;
		//this.inventoryMetalAluminum +=1;
		
	// Subtract energy used for normal existence
		
	// calculate the mass of each component
		
		var totMass = 0;
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].mass = this.components[i].dimX * this.components[i].dimY * this.components[i].dimZ * this.components[i].averageDensity * this.components[i].currentVolumeRatio;
			totMass += this.components[i].mass;
		}
		this.mass = totMass;
		//alert ("tree charging " + totMass);
		
	// calculate the load of each component
		// reset loads
		// eventually break this out as a separate function to conserve processing
		for (var i = (this.components.length - 1); i > -1; i--) {
			this.components.currentLoad = 0;
		}
		LoadCalc(this.components);


	// start growing new components
	
		if (this.lastHarvest > (this.mass + this.components.length)) {
			if (this.growDelayCounter > 1000) {
			// It is time to grow a new component		
	
			// Find a blank hard point
				// Create a blank array for holding possible destinations

				var possibleDestinations = [];
				for (var i = 0; i < this.components.length; i++) {
					if (this.components[i].NumberOfChildren < this.components[i].HardTopChildren.length) {
						for (var j = 0; j < this.components[i].HardTopChildren.length; j++) {
							if (this.components[i].HardTopChildren[j] < 0) {
								// store the component index
								possibleDestinations[possibleDestinations.length] = i;
								// store the HardTopindex
								possibleDestinations[possibleDestinations.length] = j;		
							}
						}
					}
				}

				if (possibleDestinations.length >= 0) {
					// Pick a random 
					var componentDi = Math.floor(Math.random()*(possibleDestinations.length / 2));
					var destinationComponent = possibleDestinations[2 * componentDi];
					var destinationHardPoint = possibleDestinations[2 * componentDi + 1];
					
			/*		
					for (var i = 0; i < possibleDestinations.length; i++ ) {
						alert ("possibleDestination Array: " + possibleDestinations[i]);
					}
					
					
					alert ("length: " + possibleDestinations.length + " componentDi: " + componentDi);
					
					alert ("destinationComponent: " + destinationComponent);
					alert ("destinationHardPoint: " + destinationHardPoint);
			*/	
				// Select randomly the type of component to create;
				
					//if (Math.random() * 10 == 2) { alert (this.growDelayCounter); }
					var ComponentType = 0;
					ComponentType = Math.floor(Math.random() * 3);
					if (ComponentType == 0) {
						// Make a solar panel
						ComponentType = 3;
					} else if (ComponentType == 1 ){
						// Make a stick
						//ComponentType = 6;
						ComponentType = 3;
					} else {
						// Make a seedpod;
						ComponentType = 3;
					}
				
					if (this.components[destinationComponent].code == "00000004") {
						// If the parent component is a stick or trunk, make a bracket
						ComponentType = 5;
					} else if (this.components[destinationComponent].code == "00000007") {
						// If the parent component is a seedpod, make a grape
						ComponentType = 8;	
					}
				
					if (ComponentType == 8) { //ComponentType = 3; 
						}
					
					
					
					
					
					
					
					//alert ("Creating a component of type " + ComponentType + " on HardTop Index " + destinationHardPoint + " on a parent that is component number " + destinationComponent + " hardTopSpecify: " + this.components[destinationComponent].HardTopSpecify);
					
					
					
					
					
					
			// If the parent component only has one remaining slot, make it a stick
			// Create the component
					// if (treeAddComponent( this, ComponentType, 1.0, 3, .05, 50, 50, 50, 50, destinationComponent, destinationHardPoint, 1, roboImageArray[21], 0)) {
					if (treeAddComponent( this, 3 , 1.0, 3, .05, 50, 50, 50, 50, 2, 3, 1, roboImageArray[21], 0)) {	
						//alert ("added");
						//if (Math.random() * 999 == 200) { alert (this.energy); }
						this.energy = this.energy - 900;
						this.growDelayCounter = 0;
					}
				}
			}	
			//alert ("abort");
		}

	// Increment the grow delay
		this.growDelayCounter += TreeChance;



	// repair components
	// (maybe seed growing is repair?  Nah.)
	
		
		
		for (var i = 0; i < this.components.length; i++) {
			var oldMass = 0;
			var newMass = 0;
			//var NanoLathe = this.components.
		}
		
	
	
	// Calculate nanolathe capability
	/*
		var NanolatheLimitEnergy = 0;
		var NanolatheLimitMetal = 0;
		var TotalComplexity = 0;
		for (var i = 0; i < this.components.length; i++) {
			//alert ("one");
			TotalNanolathe += (this.components[i].NanolatheCapability * ((this.components[i].dimX) / (this.components[i].dimX100)));
			TotalComplexity += this.components[i].Complexity;
			//alert ("two"); 
		}
		//alert (TotalComplexity);
		if (TotalNanolathe > ((this.components[0].averageMelt * TotalComplexity) / 1000)) { TotalNanolathe = ((this.components[0].averageMelt * TotalComplexity) / 1000); }
	*/
		
		
		
	// Pick 3 (this number will later be controlled genetically) juvenile components to grow.  If they can't be supported load-wise,
	// grow their supporting components instead.
	
	

		// Calculate components under load
		/*
		for (var i = 0; i < this.components.length; i++) {
			if (this.components[i].currentLoadAvailable < (this.components[i].currentLoad * .95)) {
				//j += this.components[i].Complexity;
				
			}			
		}
		*/
	
		var OriginalLatheEnergy = this.energy / 2;
		var LatheEnergyRemaining = OriginalLatheEnergy;
		
		//var thisLatheMetal = 0;  // for now, let's just use energy
		// Calculate juvenile components
		for (var i = (this.components.length - 1); i > 0; i--) {
			//if ((this.components[i].dimX < this.components[i].dimX100) && (LatheEnergyRemaining > 0)) {
			if ((LatheEnergyRemaining > 0) && ((this.components[i].dimX / this.components[i].dimX100) < this.components[i].scaleMax)) {
				// Nanolathe it
				//alert ("Nanolathing");
				
				// Calculate lathe energy available for this lathing
				var EnergyForThisLathe = OriginalLatheEnergy / 3;
				if (LatheEnergyRemaining < (OriginalLatheEnergy / 3)) { EnergyForThisLathe = LatheEnergyRemaining; }
				
				// Calculate component mass before lathing
				var oldMass = this.components[i].mass;
				
				// Given the amount of energy available to lathe, how much is available for this component
				var addedMass = ((LatheModifier)*(EnergyForThisLathe) / (this.components[i].averageMelt * this.components[i].Complexity));
				// Check to make sure the component is growing by less than 10% 
				var addedMassLimit = this.components[i].mass * .01 * TreeChance;
				if (addedMassLimit < .0000001) { addedMassLimit = .0000001; }
				
				// set mass to be added to the lesser of the two
				if (addedMass > addedMassLimit) { 
					addedMass = addedMassLimit;
					EnergyForThisLathe =  ((addedMass)*(this.components[i].averageMelt * this.components[i].Complexity))/(LatheModifier);
				}
				// alert ("Component: " + i + " current mass: " + this.components[i].mass + " addedMass: " + addedMass);
				
				var newTotalMass = oldMass + addedMass;
				
// Check to make sure supporting components can handle additional mass 
				
				
				// Calc new dimensions based on new mass
				this.components[i].dimY = Math.pow(((newTotalMass * Math.pow(this.components[i].dimY0,2))/(this.components[i].dimX0 * this.components[i].dimZ0 * this.components[i].averageDensity * this.components[i].currentVolumeRatio)), (1/3));
				this.components[i].dimZ = Math.pow(((newTotalMass * Math.pow(this.components[i].dimZ0,2))/(this.components[i].dimX0 * this.components[i].dimY0 * this.components[i].averageDensity * this.components[i].currentVolumeRatio)), (1/3));
				this.components[i].dimX = Math.pow(((newTotalMass * Math.pow(this.components[i].dimX0,2))/(this.components[i].dimY0 * this.components[i].dimZ0 * this.components[i].averageDensity * this.components[i].currentVolumeRatio)), (1/3));
				//alert (this.components[i].dimY);
				
				//Update the component's mass
				this.components[i].mass = this.components[i].dimX * this.components[i].dimY * this.components[i].dimZ * this.components[i].averageDensity * this.components[i].currentVolumeRatio;
				
				//Update the entity's energy
				LatheEnergyRemaining -= EnergyForThisLathe;
				this.energy -= EnergyForThisLathe;
				
				//alert ("Old mass: " + oldMass + " Added Mass: " + addedMass + " calc'd mass: " + this.components[i].mass);
				//alert ("Old energy: " + this.energy + " Used Energy: " + (this.components[i].Complexity * this.components[i].averageMelt * addedMass));
				
				// Update the total mass of the entity
				this.mass += addedMass;				
			}	
		}

			
		
	
	
	// if there are any new hard points, populate them using preferred method (at this point, )

	// absorb metals
		// Use remaining energy to extract metal from soil
		
		


		



		/*



		// Calculate needed stuff
		

		this.MetalSteelNeeded = 100;  // Dummy values for now
		this.MetalAluminumNeeded = 100;
		this.MetalBronzeNeeded = 100;
		this.MetalTitaniumNeeded = 100;
		
		// get solar energy
		this.energy += 10;
		
		
		// get root-stuff
		var ScarceResult = (Math.random() * (minScarceTitanium + minScarceBronze + minScarceSteel + minScarceAluminum));
		
		//alert (this.inventoryMetalAluminum);
		if (ScarceResult < minScarceTitanium) {
			if (this.inventoryMetalAluminum < this.MetalAluminumNeeded) { this.inventoryMetalAluminum += (Math.random() * Math.random()); }
		} else if (ScarceResult < (this.minScarceTitanium + this.minScarceBronze)) {
			if (this.inventoryMetalAluminum < MetalBronzeNeeded) { this.inventoryMetalBronze += (Math.random()) * (Math.random()); }
		} else if (ScarceResult < (this.minScarceTitanium + this.minScarceBronze + this.minScarceSteel)) {
			if (this.inventoryMetalSteel < MetalSteelNeeded) { this.inventoryMetalSteel += (Math.random()) * (Math.random()); }
		} else if (ScarceResult < (this.minScarceTitanium + this.minScarceBronze + this.minScarceSteel + this.minScarceTitanium)) {
			if (this.inventoryMetalTitanium < MetalTitaniumNeeded) { this.inventoryMetalTitanium += (Math.random()) * (Math.random()); }
		}
		
		if (this.energy > (1000 * this.components[2].scale)) {
			if (this.components[2].scale < this.components[2].scaleMax) {
				this.energy -= 1000 * this.components[2].scale;
				
				this.components[2].scale++;
				this.components[2].image = roboImageArray[11 + this.components[2].scale];
			}
		}
		*/
		
	}
	
	function minimumSupport ( Support, index) {
		
		return Support;
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
		
		scrollOverflow();  
	}
	
	function scrollOverflow() {
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
		
		// Create the Trees
		for (var i2 = 0; i2 < initialPlants; i2++) {
			/*
			RoboTreeArray[i2] = new robot(Math.random()*worldSizeX, Math.random()*worldSizeY, 1, 100);
			//RoboTreeArray[i2] = new robot(400, 400, 1, 100);
			RoboTreeArray[i2].energy = Math.floor(Math.random()*10);
			RoboTreeArray[i2].image[0] = roboImageArray[RoboTreeArray[i2].energy];
			for (var itree = 0; itree < (Math.random() * 10); itree++) {
				RoboTreeArray[i2].image[itree] = roboImageArray[Math.floor((Math.random() * 4) + 12)];
				RoboTreeArray[i2].imagex[itree] = Math.floor(Math.random() * 30) - 15;
				RoboTreeArray[i2].imagey[itree] = Math.floor(Math.random() * 30) - 15;
			}
			*/
			RoboTreeArray[i2] = treeBuilder();
			
		}


		// Create the mobile Robots
		for (var irobot2 = 0; irobot2 < mobileRobots; irobot2++) {
			Robot[irobot2] = new robot(200,50,1,100);
			Robot[irobot2].image[0] = roboImageArray[10];
		}

		//Robot1.image = roboImageArray[10];
		//Robot2.image = roboImageArray[9];
		
		mmRatioX = 500 / worldSizeX;
		mmRatioY = 250 / worldSizeY;
		
	}
	
	// Clear the control panel
	function cpClear(cpcontext) {
		cpcontext.clearRect(0, 0, uiCanvasSizeX, uiCanvasSizeY);
		cpRedraw(cpcontext);
		DisplayRoboInfo();
	}
	
	
	// Draw the control panel
	function cpRedraw (cpcontext) {
		// Draw the buttons
		if (userPause == 0 ) {
			cpcontext.drawImage(roboImageArray[25], 10, 10);	
		} else {
			cpcontext.drawImage(roboImageArray[26], 10, 10);
		}
		
		if (userSelectActive == 0) {
			cpcontext.drawImage(roboImageArray[23], 10, 50);			
		} else {
			cpcontext.drawImage(roboImageArray[24], 10, 50);
		}

	}
	
	
	// This function is invoked when the control panel canvas is clicked.
	function cpClick(cpcontext) {
		// Clear the UI canvas
		cpClear(cpcontext);
		
		
		// Check to see if one of the buttons was pressed
		  // Check buttons
		if ((cpMouseX >= 11) && (cpMouseX <= 39)) {
			// Check Pause
			if ((cpMouseY >= 11) && (cpMouseY <= 39)) {
				if (userPause == 0) {
					userPause = 1;
					cpcontext.drawImage(roboImageArray[26], 10, 10);
				} else {
					// reset pause indicator
					userPause = 0;
					userSelectActive = 0;
					// redraw control panel
					cpClear(cpcontext);
					
					// call animation frames
					requestAnimFrame(function() {
		 		    	animate(savelastTime, savemyRectangle);
		    		});
				}
			}
			
			// Check Selector
			if ((cpMouseY >= 51)  && (cpMouseY <=79)) {
				//alert ("Selector pressed");
				userSelectActive = 1;	
				userPause = 1;
				cpcontext.drawImage(roboImageArray[25], 10, 10);
			}
		}
			
			
			
	}
	
	function DisplayRoboInfo () {
		var cpcanvas = document.getElementById('UI');
	    var CPcontext = cpcanvas.getContext('2d');
	
		if (closestType == "Robot") {
			CPRoboInfoWriter(Robot[closestIndex], CPcontext);
		} else if (closestType == "RoboTree") {
			CPRoboInfoWriter(RoboTreeArray[closestIndex], CPcontext);
			//CPcontext.fillText("Robot Energy: " + Math.floor(RoboTreeArray[closestIndex].energy * 10)/10, textX, textY);
		}
		
	}
	
	function CPRoboInfoWriter(selectedBot, CPcontext) {
		var textX = 50;
		var textY = 10;
		CPcontext.font = "10px Arial";
		CPcontext.fillText("Robot Energy: " + Math.floor(selectedBot.energy * 10)/10, textX, textY);
		for (var i = 0; i < selectedBot.components.length; i++) {
			textY += 15;
			CPcontext.fillText("Robot Component" + i +  ": " + selectedBot.components[i].compName, textX, textY);
		}
	}
	
	function mainClick(newcontext, mousePos) {
		var clickX = mousePos.x + canvasOriginX;
		var clickY = mousePos.y + canvasOriginY;
		// alert ("X: " + clickX);	
		// alert ("Y: " + clickY);
		
		
		// Create an array to store the targets
		var targetArray = [];
		// Figure out which grid we're in
		var gridX = Math.floor(clickX / GridSize);
		var gridY = Math.floor(clickY / GridSize);
		
		// Find center of grid, and find out if we're near the edge of the grid.
		// Check left
		
		
		// Check right
		
		// Check top
		
		// check bottom
				
		// Loop through appropriate grid to find a list of entities in each grid and record the distance for each
		var thisdistance = 0;
		var closest = 1000;
		closestIndex = .1;
		closestType = "R";
		for (var i = 0; i < entityGridArray[gridX][gridY].length; i++) {
			thisdistance = Math.sqrt(Math.pow((entityGridArray[gridX][gridY][i].x - clickX),2) + Math.pow((entityGridArray[gridX][gridY][i].y - clickY),2));
			if (thisdistance <= closest) {
				closest = thisdistance;
				closestType = entityGridArray[gridX][gridY][i].type;
				closestIndex = entityGridArray[gridX][gridY][i].slot;
			}			
		} 
		
	}
	
	function gridSearch(newcontext, mousePos, GridX, GridY) {
		
		return { rtype: roboType, rindex: roboIndex };
	}
	
}