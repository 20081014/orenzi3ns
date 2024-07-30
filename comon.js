//ナビゲーション用
;$(function(){
	$('#gnav_btn').on('click', function(){
		if($(this).hasClass('open')){
			$(this).removeClass('open');
			$('header nav').removeClass('open').stop().slideUp(500);
			$('#outside').fadeOut(100).addClass("disnone");
			$('body').removeClass('add_overray');
		}else{
			$(this).addClass('open');
			$('header nav').addClass('open').stop().slideDown(500);
			$('#outside').fadeIn(100).addClass("disnone");
			$('body').addClass('add_overray');
		}
	});
	$('#outside').on('click', function(){
		$('#gnav_btn').removeClass('open');
		$('header nav').removeClass('open').stop().slideUp(500);
		$(this).fadeOut(100).addClass("disnone");
		$('body').removeClass('add_overray');
	});
	$('#nav_inner a').on('click', function() {
				$('#gnav_btn').removeClass('open');
		$('header nav').removeClass('open').stop().slideUp(500);
		$('#outside').fadeIn(100).addClass("disnone");
		$('body').removeClass('add_overray');
		});
});

function showElementAnimation() {

	var element = document.getElementsByClassName('fadeIn');
	if(!element) return; // 要素がなかったら処理をキャンセル
						
	var showTiming = window.innerHeight > 768 ? 200 : 80; // 要素が出てくるタイミングはここで調整
	var scrollY = window.pageYOffset; //スクロール量を取得
	var windowH = window.innerHeight; //ブラウザウィンドウのビューポート(viewport)の高さを取得
					  
	for(var i=0;i<element.length;i++) { 
	  var elemClientRect = element[i].getBoundingClientRect(); 
	  var elemY = scrollY + elemClientRect.top; 
	  if(scrollY + windowH - showTiming > elemY) {
		element[i].classList.add('scrollin');
	  } else if(scrollY + windowH < elemY) {
	  // 上にスクロールして再度非表示にする場合はこちらを記述
		element[i].classList.remove('scrollin');
	  }
	}
}
showElementAnimation();
window.addEventListener('scroll', showElementAnimation);

let currentIndex = 0;


function nextSlide() {
  const slides = document.querySelectorAll(".slide");
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
}


function updateSlider() {
  const slides = document.querySelectorAll(".slide");
  const sliderWidth = slides[0].offsetWidth; // 1枚のスライドの横幅を取得
  const newPosition = -currentIndex * sliderWidth + "px";
  document.querySelector(".carousel").style.transition =
    "transform 0.5s ease-in-out";
  document.querySelector(".carousel").style.transform =
    "translateX(" + newPosition + ")";
}

var unit = 100,
    canvasList, // キャンバスの配列
    info = {}, // 全キャンバス共通の描画情報
    colorList; // 各キャンバスの色情報

/**
 * Init function.
 * 
 * Initialize variables and begin the animation.
 */
function init() {
    info.seconds = 0;
    info.t = 0;
		canvasList = [];
    colorList = [];
    // canvas1個めの色指定
    canvasList.push(document.getElementById("waveCanvas"));
    colorList.push(['#43c0e4']);
	// 各キャンバスの初期化
		for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        canvas.width = document.documentElement.clientWidth; //Canvasのwidthをウィンドウの幅に合わせる
        canvas.height = 200;//波の高さ
        canvas.contextCache = canvas.getContext("2d");
    }
    // 共通の更新処理呼び出し
		update();
}

function update() {
		for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        // 各キャンバスの描画
        draw(canvas, colorList[canvasIndex]);
    }
    // 共通の描画情報の更新
    info.seconds = info.seconds + .014;
    info.t = info.seconds*Math.PI;
    // 自身の再起呼び出し
    setTimeout(update, 35);
}

/**
 * Draw animation function.
 * 
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */
function draw(canvas, color) {
		// 対象のcanvasのコンテキストを取得
    var context = canvas.contextCache;
    // キャンバスの描画をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);

    //波を描画 drawWave(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ )
    drawWave(canvas, color[0], 1, 3, 0);//drawWave(canvas, color[0],0.5, 3, 0);とすると透過50%の波が出来る
}

/**
* 波を描画
* drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
*/
function drawWave(canvas, color, alpha, zoom, delay) {
		var context = canvas.contextCache;
    context.fillStyle = color;//塗りの色
    context.globalAlpha = alpha;
    context.beginPath(); //パスの開始
    drawSine(canvas, info.t / 0.5, zoom, delay);
    context.lineTo(canvas.width + 10, canvas.height); //パスをCanvasの右下へ
    context.lineTo(0, canvas.height); //パスをCanvasの左下へ
    context.closePath() //パスを閉じる
    context.fill(); //波を塗りつぶす
}

/**
 * Function to draw sine
 * 
 * The sine curve is drawn in 10px segments starting at the origin. 
 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawSine(canvas, t, zoom, delay) {
    var xAxis = Math.floor(canvas.height/2);
    var yAxis = 0;
    var context = canvas.contextCache;
    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t; //時間を横の位置とする
    var y = Math.sin(x)/zoom;
    context.moveTo(yAxis, unit*y+xAxis); //スタート位置にパスを置く

    // Loop to draw segments (横幅の分、波を描画)
    for (i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t+(-yAxis+i)/unit/zoom;
        y = Math.sin(x - delay)/3;
        context.lineTo(i, unit*y+xAxis);
    }
}

init();