	var parallax = 64;
	var paracounter = 63;
	var elem;
	var context;
	var widthbg = 240;
	var heightbg = 240;
	var frames = new Array();
	var running = 0;
	var x = 0, y =0;
	var started = 0;
	var fpscounter = 0;
	var startTime;
	var counterStarted = 0;
	function clear() {

		context.clearRect(0,0,widthbg,heightbg);

	}
	function draw() {
		if(running == 1) {
			if(!counterStarted == 1) {
				startTime = new Date().getTime() ;
				counterStarted = 1;
			}else{
				nowTime = new Date().getTime();
				if((nowTime - startTime) > 1000) {
					document.getElementById('fpsc').value = fpscounter;
					fpscounter = 0;
					startTime = new Date().getTime() ;
				}
			}
			clear();
			context.putImageData(frames[paracounter], 0, 0);
			document.getElementById('fframe').value = 64 - paracounter;
			if(paracounter == 0) 
				paracounter = 63;
			else
				paracounter--;
			fpscounter++;
		}
	}
	function changeFrame() {
		if(started == 1 & running == 0) {
			clear();
			framex = parseInt(document.getElementById('fframe').value);
			if(framex < 64) {
				paracounter = framex;
				context.putImageData(frames[framex], 0, 0);
			}else{
				alert("Valor máximo: 63");
				document.getElementById('fframe').value = 63;
				changeFrame();
			}
		}
	}
	function generate() {
		//Pega todas as fórmulas e armazena nas variáveis
		var fred = document.getElementById('codered').value!=''?document.getElementById('codered').value:0;
		var fgreen = document.getElementById('codegreen').value!=''?document.getElementById('codegreen').value:0;
		var fblue = document.getElementById('codeblue').value!=''?document.getElementById('codeblue').value:0;
		//Cria função que retorna o valor da cor.
		eval("fcolor = function(x, y, parallax,color) { return color==0?"+fred+":(color==1?"+fgreen+":"+fblue+"); }");
		//Inicia o loop para gerar os quadros
		while(parallax != 0) {
			var imgd = false;
			x=0;	
			y=0;
			if (context.createImageData) {
				imgd = context.createImageData(widthbg, heightbg);
			} else if (context.getImageData) {
				imgd = context.getImageData(0, 0, widthbg, heightbg);
			} else {
				imgd = {'widthbg' : w, 'heightbg' : h, 'data' : new Array(widthbg*heightbg*4)};
			}
			var pix = imgd.data;
			for (var i = 0, n = pix.length; i < n; i += 4) {
				x = (i/4) % widthbg;
				y = (i/4) / widthbg;
				pix[i] = fcolor(x,y,parallax,0);
				pix[i+1] = fcolor(x,y,parallax,1);
				pix[i+2] = fcolor(x,y,parallax,2)
				pix[i+3] 	= 	255; //Alpha
			}
			x = 0; y = 0;
			frames[parallax-1] = imgd; 
			parallax--;
		}
		parallax = 64;
	}

	function init() {
		elem = document.getElementById('myCanvas');
		if (!elem || !elem.getContext) {
			return;
		}
	
		context = elem.getContext('2d');
		if (!context || !context.putImageData) {
			return;
		}
		context.fillStyle = "#000000";
		context.fillRect(0,0,240,240);
		context.fillStyle = "#FFFFFF";
		context.font = "bold 10px sans-serif";
		context.fillText("Clique em \"Gerar Buffer\" para iniciar.", 12,120);
		setInterval(draw,16);
	}

	window.addEventListener('load', init, false);
