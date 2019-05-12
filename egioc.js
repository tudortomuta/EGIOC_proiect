	var gl;
	var mvMatrix = mat4.create();
	var pMatrix = mat4.create();
	var mvMatrixStack = [];
	var shaderProgram;

	var cubeVertexPositionBuffer;
	var cubeVertexColorBuffer;
	var cubeFan1Buffer;
	var cubeFan2Buffer;

    var pyramideVertexPositionBuffer;
	var pyramideVertexColorBuffer;


    var transY = 0.0;
	var rCubeZ = 0.0;
	var rCubeY = 0.0;

	var fov=70.0;

	var red = 0.0;
	var green= 0.75;
	var blue = 0.7;
	var alpha = 0.95;
var a=0.0;
var b=2.0;
    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl", {stencil:true});
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("WebGl couln not be initialised!");
        }
    }
    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    function initShaders() {
        var fragmentShader = getShader(gl, "fragment-shader");
        var vertexShader = getShader(gl, "vertex-shader");
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Shaders could not be initia;ised!");
        }
        gl.useProgram(shaderProgram);
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
		gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    }


    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }
    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }
    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }



    function initBuffers() {
        cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        vertices = [
				0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,
                0.0, 1.0, -1.0,
               1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                -1.0, -1.0, -1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        cubeVertexPositionBuffer.itemSize = 3;
        cubeVertexPositionBuffer.numItems = 8;

		cubeVertexColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
		colors = [
			1.0,  0.0, 1.0, 1.0,
			1.5, 0.0, 1.5, 1.0,
			1.5,  0.0, 1.0, 1.0,
			1.5, 0.5, 1.5, 1.0,
			1.5,  0.0, 1.0, 0.5,
			1.5,  0.0, 1.0, 1.0,
			1.5,  0.0, 1.0, 0.5,
			1.5,  0.0, 1.0, 1.0,

		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		cubeVertexColorBuffer.itemSize = 4;
		cubeVertexColorBuffer.numItems = 8;


		cubeFan1Buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeFan1Buffer);
		tFan1 = [
				1,0,3,
                1,3,2,
                1,2,6,
                1,6,5,
                1,5,4,
                1,4,0
		];

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tFan1), gl.STATIC_DRAW);
		cubeFan1Buffer.itemSize = 1;
		cubeFan1Buffer.numItems = 6 * 3;


		cubeFan2Buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeFan2Buffer);
		tFan2 = [
				7,4,5,
                7,5,6,
                7,6,2,
                7,2,3,
                7,3,0,
                7,0,4
		];

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tFan2), gl.STATIC_DRAW);
		cubeFan2Buffer.itemSize = 1;
		cubeFan2Buffer.numItems = 6 * 3;
	}


function initBuffers1() {
        cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        vertices = [
				-1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,
                -1.0, 1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, -1.0, -1.0,
                -1.0, -1.0, -1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        cubeVertexPositionBuffer.itemSize = 3;
        cubeVertexPositionBuffer.numItems = 8;
		
		cubeVertexColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
		colors = [
			1.0,  1.0, 2.0, 0.8,
			0.15, 1.0, 0.5, 0.8,
			1.0,  1.0, 1.0, 1.0,
			0.5, 1.0, 0.75, 1.0,
			0.75,  1.0, 0.20, 0.65,
			1.0,  1.0, 0.30, 1.0,
			0.65,  1.0, 0.30, 0.75,
			1.0,  1.0, 0.10, 1.0,

		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		cubeVertexColorBuffer.itemSize = 4;
		cubeVertexColorBuffer.numItems = 8;
		
		
		cubeFan1Buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeFan1Buffer);
		tFan1 = [
				1,0,3,
                1,3,2,
                1,2,6,
                1,6,5,
                1,5,4,
                1,4,0
		];
		
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tFan1), gl.STATIC_DRAW);
		cubeFan1Buffer.itemSize = 1;
		cubeFan1Buffer.numItems = 6 * 3;

		
		cubeFan2Buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeFan2Buffer);
		tFan2 = [
				7,4,5,
                7,5,6,
                7,6,2,
                7,2,3,
                7,3,0,
                7,0,4
		];
		
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tFan2), gl.STATIC_DRAW);
		cubeFan2Buffer.itemSize = 1;
		cubeFan2Buffer.numItems = 6 * 3;
	}
	
    function renderStage() {
        pyramideVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pyramideVertexPositionBuffer);
        var reflPyramideVertices = [
            -1.0, 0.0, -1.0,

			1.0, 0.0, -1.0,

			-1.0, 0.0, 1.0,

			1.0, 0.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(reflPyramideVertices), gl.STATIC_DRAW);
        pyramideVertexPositionBuffer.itemSize = 3;
        pyramideVertexPositionBuffer.numItems = 4;

		pyramideVertexColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pyramideVertexColorBuffer);
		var reflPyramideColor = [
			0.5, 1.0, 0.8, 0.5,

			0.5, 1.0, 0.8, 1.0,

			0.0, 1.0, 0.0, 0.0,

			0.5, 0.0, 0.5, 0.5
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(reflPyramideColor), gl.STATIC_DRAW);
		pyramideVertexColorBuffer.itemSize = 4;
		pyramideVertexColorBuffer.numItems = 4;

		gl.frontFace(gl.CW);

		mvPushMatrix();

		mat4.translate(mvMatrix, [-0.25, -2.0, -8.0]);

		mat4.scale(mvMatrix, [3.5, 2.5, 3.0]);

		gl.bindBuffer(gl.ARRAY_BUFFER, pyramideVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pyramideVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, pyramideVertexColorBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, pyramideVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.depthMask(false);
		gl.colorMask(true, false, false, true);

        setMatrixUniforms();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, pyramideVertexPositionBuffer.numItems);

		gl.colorMask(true, true, true, true);
		gl.depthMask(true);



		mvPopMatrix();


	}

	function renderToStencil(){

		gl.enable(gl.STENCIL_TEST);
		gl.stencilFunc(gl.ALWAYS, 1, 0xFFFFFFFF);
		gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

		renderStage();

		gl.stencilFunc(gl.EQUAL, 1, 0xFFFFFFFF);
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

	}



	function degToRad(degrees){
		return degrees * Math.PI / 180;
	}

	function drawCube(){


		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeFan1Buffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLE_FAN, cubeFan1Buffer.numItems, gl.UNSIGNED_SHORT, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeFan2Buffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLE_FAN, cubeFan2Buffer.numItems, gl.UNSIGNED_SHORT, 0);
	}

function myFunction1(event) {
  var x = event.which || event.keyCode;
  if(event.keyCode==61)
	var p= fov-=4;
}
function myFunction2(event) {
  var x = event.which || event.keyCode;
  if(event.keyCode==45)
			var p= fov+=4;
		
}
function myFunction3(event) {
  var x = event.which || event.keyCode;
  if(event.keyCode==97)
			var p= a-=0.1;
		
}
function myFunction4(event) {
  var x = event.which || event.keyCode;
  if(event.keyCode==100)
			var p= a+=0.1;
		
}
function myFunction5(event) {
  var x = event.which || event.keyCode;
  if(event.keyCode==119)
			var p= b+=0.1;
		
}
function myFunction6(event) {
  var x = event.which || event.keyCode;
  if(event.keyCode==115)
			var p= b-=0.1;
		
}
	function checkButtons()
	{
		document.getElementById("Schimba").onclick = function webGLStart1() {
        var canvas = document.getElementById("reflSurface1");
        //initGL(canvas);
       // initShaders();
	   initBuffers1();
	   
        onChange();
	
		
      //  gl.clearColor(0.0, 0.0, 0.0, 1.0);
        //gl.enable(gl.DEPTH_TEST);

    }

		document.getElementById("further").onclick= function(){var p = 
fov-=4;};
		document.getElementById("nonfurther").onclick = function() {fov+=4;};

		

		document.getElementById("red").onclick = function(){if(red>=1.0) red=0; else red+=0.1;};
		document.getElementById("green").onclick = function(){if(green>=1.0) green=0; else green+=0.1;};
		document.getElementById("blue").onclick = function(){if(blue>=1.0) blue=0; else blue+=0.1;};
		document.getElementById("alpha").onclick = function(){if(alpha>=1.0) alpha=0; else alpha+=0.1;};

		document.getElementById("redd").onclick = function(){if(red<=0) red=0; else red-=0.1;};
		document.getElementById("greend").onclick = function(){if(green<=0) green=0; else green-=0.1;};
		document.getElementById("blued").onclick = function(){if(blue<=0) blue=0; else blue-=0.1;};
		document.getElementById("alphad").onclick = function(){if(alpha<=0) alpha=0; else alpha-=0.1;};

	}

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

		gl.clearColor(red, green, blue,alpha);

		renderToStencil();

		//adjusting the frustum
		var fieldOfView = fov;
		var aspectRatio = gl.viewportWidth/gl.viewportHeight;
		var zNear = 0.3;
		var zFar = 1200.0;


        mat4.perspective(fieldOfView, aspectRatio, zNear, zFar, pMatrix);


		gl.enable(gl.CULL_FACE);

		gl.cullFace(gl.BACK);

		mat4.identity(mvMatrix);


		mvPushMatrix();

		gl.enable(gl.STENCIL_TEST);

		gl.disable(gl.DEPTH_TEST);

		mat4.translate(mvMatrix, [a, (Math.sin(-transY)/ 2.0) - b, -8.0]);

		mat4.rotate(mvMatrix, degToRad(rCubeY), [5, 5, 5]);

		mat4.scale(mvMatrix, [1.0, -1.0, 1.0]);

		gl.frontFace(gl.CW);

		gl.enable(gl.BLEND);

		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);

		drawCube();

		gl.disable(gl.BLEND);

		mvPopMatrix();

		gl.enable(gl.DEPTH_TEST);

		gl.disable(gl.STENCIL_TEST);

		mvPushMatrix();

		mat4.scale(mvMatrix, [1.0, 1.0, 1.0]);

		gl.frontFace(gl.CCW);

		mat4.translate(mvMatrix, [a, 1.5 * (Math.sin(transY)/ 2.0) + b, -8.0]);

		mat4.rotate(mvMatrix, degToRad(rCubeY), [0, 1, 0]);

		mat4.rotate(mvMatrix, degToRad(rCubeZ), [0, 0, 1]);

		rCubeY+=0.4;
		transY+=0.075;
		rCubeZ+=0.4;
		

		checkButtons();
        drawCube();

		mvPopMatrix();

    }


	function onChange(){


		requestAnimFrame(onChange);

		drawScene();
		
	}
function onChange1(){


		requestAnimFrame(onChange1);

		drawScene1();
		
	}

    function webGLStart() {
        var canvas = document.getElementById("reflSurface");
        initGL(canvas);
        initShaders();
        initBuffers();
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
		checkButtons();
		onChange();
    }