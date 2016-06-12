/**
 * seminar-web-shooting - フロントエンド スクリプト
 */

$(function () { // ページの読み込み(正しくはDOMの構築)が完了したとき

	// 入力されているキーを格納する配列
	var pressedKeys = [];

	// 飛行機オブジェクトの初期化 - 自機
	var player_x = $(window).width() / 2;
	var player_y = $(window).height() - 100;
	var player = new Airplane($('#player'), false, 10, player_x, player_y);

	// 飛行機オブジェクトの初期化 - 敵機
	var enemy = new Airplane($('#enemy'), true, 50);

	// 敵機を左右に動かす
	var enemy_direction = true;
	window.setInterval(function () {

		if (enemy_direction) {
			enemy.moveLeft();
		} else {
			enemy.moveRight();
		}

		if (!enemy_direction && enemy.getX() <= 0) {
			// 敵機を反転させる
			enemy_direction = !enemy_direction;
		} else if (enemy_direction && $(window).width() <= enemy.getX()) {
			// 敵機を反転させる
			enemy_direction = !enemy_direction;
		}

	}, 50);

	// 敵機による弾発射
	window.setInterval(function () {

		enemy.fire();

	}, 1500);

	// あたり判定
	window.setInterval(function () {

		enemy.checkCollision();
		player.checkCollision();

	}, 50);


	var onKeyDown = function(e) {
		switch (e.keyCode) {
				case 38: //up
				case 87: //w
						pressedKeys[0] = true;
						break;
				case 40: //down
				case 65: //a
						pressedKeys[1] = true;
						break;
				case 37: //left
				case 83: //s
						pressedKeys[2] = true;
						break;
				case 39: //right
				case 68: //d
						pressedKeys[3] = true;
						break;
				case 32: //shoot
						pressedKeys[4] = true;
						break;
				default:
						break;
			}
		};

		var onKeyUp = function(e) {
			switch (e.keyCode) {
				case 38: //up
				case 87: //w
						pressedKeys[0] = false;
						break;
				case 40: //down
				case 65: //a
						pressedKeys[1] = false;
						break;
				case 37: //left
				case 83: //s
						pressedKeys[2] = false;
						break;
				case 39: //right
				case 68: //d
						pressedKeys[3] = false;
						break;
				case 32: //shoot
						pressedKeys[4] = false;
						break;
				default:
						break;
			}
		};

		var moveAirplane = function() {
			//up
			if (pressedKeys[0])
				player.moveFront();

			//down
			if (pressedKeys[1])
				player.moveBack();

			//left
			if (pressedKeys[2])
					player.moveLeft();

			//right
			if (pressedKeys[3])
					player.moveRight();

			if (pressedKeys[4])
					player.fire();

		};

		document.addEventListener("keydown", onKeyDown, false);
		document.addEventListener("keyup", onKeyUp, false);

		setInterval(moveAirplane, 50);
/*
	// キーが押されたときのイベントハンドラを定義
	$(window).keydown(function (event) {

		var keycode = event.keyCode;
		if (!keycode) return;

		if (keycode == 37) { // カーソルキーの左(←)ならば
			// 自機を左へ移動
			player.moveLeft();
		} else if (keycode == 38) { // カーソルキーの上(↑)ならば
			// 自機を前へ移動
			player.moveFront();
		} else if (keycode == 40) { // カーソルキーの下(↓)ならば
			// 自機を後へ移動
			player.moveBack();
		} else if (keycode == 39) { // カーソルキーの右(→)ならば
			// 自機を右へ移動
			player.moveRight();
		} else if (keycode == 32) { // スペースキーならば
			// 自機から弾を発射
			player.fire();
		}

	});
*/
});
