

var widthbgmax = 510;
var heightbgmax = 410;

var widthbg = 510;
var heightbg = 410;

var pott = 1000;
var curt = 500;

var divisionsx = 8;
var divisionsy = 8;

var border = 5;

var vpeca1 = 1;
var vpeca2 = 1;
var peca1 = 0;
var peca2 = 0;

var autoscale = 1;
var autopeca = 0;

function showData(what) {
		pecaid = (what=="peca1")?(document.getElementById("autoPeca1").value):(document.getElementById("autoPeca2").value);
}
   
function plot() {
	autopeca = document.getElementById("manualdata").checked;
	autoscale = document.getElementById("autoescalecheck").checked;
	curt = autoscale?curt:(document.getElementById("scalexbox").value);
	pott = autoscale?pott:(document.getElementById("scaleybox").value);
	document.getElementById("scalebox").style.display = autoscale?"None":"";
	
	if(autopeca) {
		document.getElementById("manualbox").style.display = "block";
		document.getElementById("autobox").style.display = "none";
		vpeca1 = parseFloat(document.getElementById("Valor1").value);
		vpeca2 = parseFloat(document.getElementById("Valor2").value);
		peca1 = parseInt(document.getElementById("Peca1").value);
		peca2 = parseInt(document.getElementById("Peca2").value);
	}else{
		document.getElementById("manualbox").style.display = "none";
		document.getElementById("autobox").style.display = "block";
		peca1 = pecas[document.getElementById("autoPeca1").value][0];
		vpeca1 = pecas[document.getElementById("autoPeca1").value][1];
		peca2 = pecas[document.getElementById("autoPeca2").value][0];
		vpeca2 = pecas[document.getElementById("autoPeca2").value][1];
		
	}
	draw();
}
  

function draw() {

 	var canvas = document.getElementById("canvas");
 	var ctx = canvas.getContext("2d");

	//Potência e corrente de cruzamento
	var cruzcur = peca1!=peca2?(peca1?(vpeca2/vpeca1):(vpeca1/vpeca2)):0;
	var cruzpot = peca1!=peca2?(peca1?(Math.pow(vpeca2,2)/vpeca1):(Math.pow(vpeca1,2)/vpeca2)):0;
	
	//Acertar escala automaticamente:
	pott = autoscale&(peca1!=peca2)?(cruzpot*2):pott;
	curt = autoscale&(peca1!=peca2)?(cruzcur*2):curt;
	
	//Posição X e Y que inicia o gráfico
	var graphx = border+20;
	var graphy = heightbg-border-20;
	
	//Altura e Largura do gráfico
	var graphheightbg = heightbg - 2 * border - 25;
	var graphwidthbg = widthbg - 2 * border;
	
	//Constantes de Corrente Por Pixel e Potência por Pixel
	var curconst  =  (graphwidthbg-20)/curt; // px/amper
	var potconst  =  graphheightbg/pott;  // px/W
	
	//Ponto X e Y do cruzamento das linhas de potencia - usado para colocar o ponto
	var cruzx = graphx+(cruzcur*curconst-border);
	var cruzy = graphy -( peca1?(vpeca1*Math.pow(cruzcur,2)):(vpeca1*cruzcur) )*potconst;
	
	//Variaveis de uso geral
	var x = 0;
	var i = 0;
	var litegap = 25;
	

	//Apagar tela de desenho
	ctx.clearRect(0,0,widthbgmax,heightbgmax);

 	//Desenhar BG
	ctx.fillStyle = '#000000';
	ctx.fillRect(0,0,widthbg,heightbg);
	
	//Desenhar Grade
	ctx.beginPath();
	ctx.strokeStyle = '#009900';
	ctx.lineWidth = 1;
	
	//Colunas
	while((i * (graphwidthbg-litegap)/divisionsx) <= Math.round( (graphwidthbg-litegap) ) ) {
		ctx.moveTo((i * (graphwidthbg-litegap)/divisionsx)+graphx-2,border*2);
		ctx.lineTo((i * (graphwidthbg-litegap)/divisionsx)+graphx-2,graphy);
		i++;
	}
	i=0;
	//Linhas 
	while((i * (graphheightbg)/divisionsy) <= Math.round( (graphheightbg) ) ) {
		ctx.moveTo(graphx,graphy-(i * (graphheightbg)/divisionsy));
		ctx.lineTo(widthbg-(border*2),graphy-(i * (graphheightbg)/divisionsy));
		i++;
	}
    ctx.stroke();
	ctx.closePath();

	//Gráfico
	
	ctx.beginPath();
	ctx.strokeStyle = '#3366FF';
	ctx.lineWidth = 2;
	
	var resolutionx = 1;
	if(curconst > 0) 
		resolutionx = 10*curconst;
	else
		resolutionx = 1;
	//while (x*curconst+border  < graphwidthbg-20) {
	while(true) {
		var potencia;
		var newx = x / resolutionx;
		potencia = peca1?(vpeca1*Math.pow(newx,2)):(vpeca1*newx);
		if( graphy-(potencia*potconst) > border*2  ) 
			if(newx*curconst+border  > graphwidthbg-20) {
				ddx = (graphwidthbg-20-border)/curconst;
				ddpot = peca1?(vpeca1*Math.pow(ddx,2)):(vpeca1*ddx);
				ctx.lineTo(graphx+graphwidthbg-20-border,graphy-(ddpot*potconst));
				break;
			}else
				ctx.lineTo(graphx+(newx*curconst-border),graphy-(potencia*potconst));
		else{
			if(newx*curconst+border  > graphwidthbg-20) {
				ddx = (graphwidthbg-20-border)/curconst;
				ddpot = peca1?(vpeca1*Math.pow(ddx,2)):(vpeca1*ddx);
				ctx.lineTo(graphx+graphwidthbg-20-border,graphy-(ddpot*potconst));
			}else{
				ddpot = (graphy-2*border) / potconst;
				ddx = peca1?(Math.sqrt(ddpot/vpeca1)):ddpot/vpeca1;
				ctx.lineTo(graphx+(ddx*curconst-border),border*2);
			}
			break;
		}
		x++;
	}
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle = '#FF6633';
	ctx.lineWidth = 2;
	x = 0;
	while(true) {
		var potencia;
		var newx = x / resolutionx;
		potencia = peca2?(vpeca2*Math.pow(newx,2)):(vpeca2*newx);
		if( graphy-(potencia*potconst) > border*2  ) 
			if(newx*curconst+border  > graphwidthbg-20) {
				ddx = (graphwidthbg-20-border)/curconst;
				ddpot = peca2?(vpeca2*Math.pow(ddx,2)):(vpeca2*ddx);
				ctx.lineTo(graphx+graphwidthbg-20-border,graphy-(ddpot*potconst));
				break;
			}else
				ctx.lineTo(graphx+(newx*curconst-border),graphy-(potencia*potconst));
		else{
			if(newx*curconst+border  > graphwidthbg-20) {
				ddx = (graphwidthbg-20-border)/curconst;
				ddpot = peca2?(vpeca2*Math.pow(ddx,2)):(vpeca2*ddx);
				ctx.lineTo(graphx+graphwidthbg-20-border,graphy-(ddpot*potconst));
			}else{
				ddpot = (graphy-2*border) / potconst;
				ddx = peca2?(Math.sqrt(ddpot/vpeca2)):ddpot/vpeca2;
				ctx.lineTo(graphx+(ddx*curconst-border),border*2);
			}
			break;
		}
		x++;
	}
	ctx.stroke();
	ctx.closePath();	

	//Escalas
	ctx.beginPath();
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 2;
	
	ctx.moveTo(graphx-2,border*2);
	ctx.lineTo(graphx-2,graphy+16);
	ctx.moveTo(graphx-18,graphy);
	ctx.lineTo(graphwidthbg-2,graphy);
	ctx.font = "bold 14px sans-serif";
	ctx.fillStyle = "#FFFFFF";
	i=1;
	while((i * (graphwidthbg-litegap)/divisionsx) <= Math.round( (graphwidthbg-litegap) ) ) {
		tmpx = (i * (graphwidthbg-litegap)/divisionsx)+graphx-2;
		tmptxt = Math.round(curt/divisionsx*i*10)/10+"A";
		ctx.fillText(tmptxt,tmpx-(tmptxt.length *8)-4,graphy+16);
		ctx.moveTo(tmpx,graphy);
		ctx.lineTo(tmpx,graphy+16);
		i++;
	}

	i=1;
	//Linhas 
	while((i * (graphheightbg)/divisionsy) <= Math.round( (graphheightbg) ) ) {
		tmpy = (i * (graphheightbg)/divisionsy);
		ctx.fillText(Math.round(pott/divisionsy*i*10)/10 +"W",graphx,graphy-tmpy+14);
		ctx.moveTo(graphx-2,graphy-tmpy);
		ctx.lineTo(graphx-16,graphy-tmpy);
		i++;
	}
	
	if(peca1!=peca2) {

		tmpx = cruzx+2;
		tmpy = cruzy;
		ctx.moveTo(tmpx,tmpy);
		ctx.fillText(Math.round(cruzpot)+"W",tmpx+10,tmpy+10);
		ctx.fillText(Math.round(cruzcur)+"A",tmpx-40,tmpy-10);
		ctx.arc(tmpx,tmpy,4,0,Math.PI*2,true);
		ctx.fill();

	}
	ctx.stroke();
	ctx.closePath();
	
	
	
}
function vartypex(objeto) {
	return parseInt(document.getElementById(objeto).value)?"Rds: ":"Vce: ";
}
window.addEventListener('load', plot, false);
