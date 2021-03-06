/**
 * seminar-web-shooting - 飛行機オブジェクト スクリプト
 */


/**
 * 飛行機オブジェクトの初期化
 * @param {Element}  $elem          jQuery要素
 * @param {Boolean} opt_is_reverse  機体が反転しているか否か (オプション)
 * @param {[type]}  opt_x           初期位置のX座標 (オプション)
 * @param {[type]}  opt_y           初期位置のY座標 (オプション)
 */

var Airplane = function($elem, opt_is_reverse, life, opt_x, opt_y) {

    this.HitPoint = life;

    // 機体のDOM要素
    this.$elem = $elem;

    // 機体の向きが反転しているか否か
    if (opt_is_reverse) {

        this.isReverse = true; // 反転している

        // CSSで画像を反転させる
        this.$elem.css({
            transform: 'scale(1)'
        });

    } else {

        this.isReverse = false; // 反転していない

    }

    // 座標をリセット
    opt_x = opt_x || 100;
    opt_y = opt_y || 100;
    this.moveTo(opt_x, opt_y);

};


/**
 * 指定した座標へ移動
 * @param  {Number} x X座標
 * @param  {Number} y Y座標
 */
Airplane.prototype.moveTo = function(x, y) {

    var self = this;

    self.$elem.css({
        left: x,
        top: y
    });

};



//弾丸とのあたり判定
Airplane.prototype.checkCollision = function() {

    var self = this;

    $('.bullet').each(function() {

        var x = self.getX() + 50; //機体のx
        var y = self.getY(); //機体のy

        var $bullet = $(this);

        var bullet_x = $bullet.css('left');
        if (bullet_x != undefined) {
            bullet_x = parseInt(bullet_x.replace(/(\D+)/, ''));
        }
        var bullet_y = $bullet.css('top');
        if (bullet_y != undefined) {
            bullet_y = parseInt(bullet_y.replace(/(\D+)/, ''));
        }

		if (!$bullet.is(':visible')) { // 見えていない弾丸は無視
			return;
		}
        if (self.isReverse && $bullet.hasClass("e_bullet")) { //敵は、敵の弾丸を無視
			return;
        }
        if (!self.isReverse && $bullet.hasClass("p_bullet")) { //敵は、敵の弾丸を無視
            return;
        }

        if (((bullet_x - x) * (bullet_x - x)) + ((bullet_y - y) * (bullet_y - y)) <= (25 + 50) * (25 + 50)) {
			self.HitPoint--;//当たればHPを減らす
			self.$elem.hide(); //一旦消す
			$bullet.hide();

			setTimeout(function() { //消した0.2秒後、瞬間表示して、食らった感じにする。
				if (0 < self.HitPoint) {
                	self.$elem.show();
				}
            }, 200);
		}

		// GameOver画面を出す
		if (self.HitPoint == 0) {
			self.HitPoint = -1;
			self.$elem.hide();//完全に消す

			var $tag = $('<div/>');
			if (self.isReverse) {
				$tag.html('Win!');
				$tag.css({
				  color: "yellow",
				  fontSize: "80px",
				  margin: "auto",
				  top: 0,
				  bottom: 0,
				  position: "absolute",
				  width: $(window).width(),
				  textAlign: "center",
				  height: 300
				});
				$('body').append($tag);
			} else {
				$tag.html('Love is Over');
				$tag.css({
				  color: "red",
				  fontSize: "80px",
				  margin: "auto",
				  top: 0,
				  bottom: 0,
				  position: "absolute",
				  width: $(window).width(),
				  textAlign: "center",
				  height: 300
				});
				$('body').append($tag);
			}
		}
	});
};


/**
 * 弾を発射
 */
Airplane.prototype.fire = function() {

    var self = this;

	if (!self.$elem.is(':visible')) {
		return;
	}

	// 弾のDOM要素を生成
	var $ball = $('<div />');
	$ball.addClass("bullet");

    if (self.isReverse) { // 敵の玉ならばe_bulletというclassを追加
        $ball.addClass("e_bullet");
    } else { // 違えばp_bulletというclassを追加  ※p_bullet = player_bullet
        $ball.addClass("p_bullet");
    }

	// 弾のDOM要素を <div id="view"> へ追加
	$('#view').append($ball);

	// 弾の画像とサイズを指定
	$ball.css({
		backgroundImage: 'url(/images/missile.png)',
		backgroundSize: 'contain',
		height: 40,
		width: 8,
		position: 'absolute'
	});

	// 弾の位置を指定
	var ball_x = self.getX() + 25; // 機体の中心となるX座標
    var ball_y = self.getY(); // 機体と同じY座標
	$ball.css({
		left: ball_x,
		top: ball_y
	});

	// 弾を前へ移動させていくためのタイマーを生成
	var interval = setInterval(function () {

		// 弾のY座標を指定
		$ball.css({
			top: ball_y
		});

		// 弾のY座標を変化させる
		if (self.isReverse) { // 機体が反転しているならば
			ball_y += 10; // 弾を下へずらす
		} else {
			ball_y -= 10; // 弾を上へずらす
		}

		// 弾が画面外になったら
		if (ball_y < 0 || $(window).height() < ball_y) {
			// 弾を消す
			$ball.remove();
			$ball = null;
			// タイマーを停止
			clearInterval(interval);
		}

	}, 20);

};


/**
 * 機体のX座標の取得
 * @return {Number} X座標
 */
Airplane.prototype.getX = function(opt_speed) {

    var self = this;

    return parseInt(self.$elem.css('left').replace(/(\D+)/, ''));

};


/**
 * 機体のX座標の取得
 * @return {Number} Y座標
 */
Airplane.prototype.getY = function(opt_speed) {

    var self = this;

    return parseInt(self.$elem.css('top').replace(/(\D+)/, ''));

};


/**
 * 前へ移動
 * @param  {Number} opt_speed 速度 (オプション)
 */
Airplane.prototype.moveFront = function(opt_speed) {

    var self = this;

    if (self.isReverse) { // 機体が反転しているならば
        // 画面下方向へずらす
        self.moveTo(self.getX(), self.getY() + 10);
    } else { // 機体が順向(上向き)ならば
        // 画面上方向へずらす)
        self.moveTo(self.getX(), self.getY() - 10);
    }

};


/**
 * 後ろへ移動
 * @param  {Number} opt_speed 速度 (オプション)
 */
Airplane.prototype.moveBack = function(opt_speed) {

    var self = this;

    if (self.isReverse) { // 機体が反転しているならば
        // 画面上方向へずらす
        self.moveTo(self.getX(), self.getY() - 10);
    } else { // 機体が順向(上向き)ならば
        // 画面下方向へずらす
        self.moveTo(self.getX(), self.getY() + 10);
    }

};


/**
 * 左へ移動
 * @param  {Number} opt_speed 速度 (オプション)
 */
Airplane.prototype.moveLeft = function(opt_speed) {

    var self = this;
    if (self.isReverse) { // 機体が反転しているならば
        self.moveTo(self.getX() + 10, self.getY());
    } else { // 機体が順向(上向き)ならば
        self.moveTo(self.getX() - 10, self.getY());
    }

};


/**
 * 右へ移動
 * @param  {Number} opt_speed 速度 (オプション)
 */
Airplane.prototype.moveRight = function(opt_speed) {

    var self = this;

    if (self.isReverse) { // 機体が反転しているならば
        self.moveTo(self.getX() - 10, self.getY());
    } else { // 機体が順向(上向き)ならば
        self.moveTo(self.getX() + 10, self.getY());
    }

};
