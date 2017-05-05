/*
* @Author: Administrator
* @Date:   2017-03-01 09:33:50
* @Last Modified by:   Administrator
* @Last Modified time: 2017-03-03 09:22:40
*/

'use strict';

/*需求：在PC端 需要加载大图，并且让图片定位居中，在移动端，加载小图，让高度随着宽度等比例缩放*/

// （1）在resize的时候去判断当前是在什么设备上，如果屏宽小于768的情况下，为手机端，反之，为PC
// （2）针对不同的设备获取不同的图片路径（我们将两个不同的图片路径以自定义的属性存放在每个img图片上）
// （3）将对应的图片地址设置在不同的img上面
// （4）修改图片的css （PC端：定位 transform 定高）（手机：标准流 还原transform 高度auto width：100%）
$(function(){
	// 手机的屏幕宽度，可以根据自己的需求改
	var mobileWidth =  768;
	// 获取所有的轮播图片对象
	var items = $('.wjs-lbt .item');
	// 从items查找图片
	var imgAll = $('img',items);
	// 在屏幕改变的时候不断触发
	$(window).on('resize',_resize).trigger('resize');
	// resize里面的代码
	/*function _resize(){
		// 获取屏幕的宽度，
		var screenWidth = $(window).width();
		var isMoile = screenWidth < mobileWidth;
		// 如果是手机
		if(isMoile){
			imgAll.each(function(index,el){
				var _el = $(el);
				var src = _el.data('ssrc');
				_el.attr('src',src);
			})
			imgAll.css({
				// 标准流
				'position' : 'static',
				'transform' : 'none',
				'height' : 'auto',
				'width' : '100%'
			});
			items.css('height','auto');
		}else{
			imgAll.each(function(index,el){
				var _el = $(el);
				var src = _el.data('bsrc');
				_el.attr('src',src);
			})
			imgAll.css({
				// 标准流
				'position' : 'absolute',
				'transform' : 'translateX(-50%)',
				'height' : '410',
				'width' : 'auto'
			});
			items.css('height','410');
		}
	}*/
	/*优化版*/
	function _resize(){
		// 获取屏幕的宽度，
		var screenWidth = $(window).width();
		var isMoile = screenWidth < mobileWidth;

		imgAll.each(function(index,el){
			var _el = $(el);
			var src = _el.data(isMoile ? 'ssrc' : 'bsrc');
			_el.attr('src',src);
		})
		imgAll.css({
			// 标准流
			'position' : isMoile ? 'static' : 'absolute',
			'transform' : isMoile ? 'none' : 'translateX(-50%)',
			'height' : isMoile ?'auto' : 410,
			'width' : isMoile ?'100%' : 'auto'
		});
		items.css('height',isMoile ? 'auto' : 410);
	}


	// 横向滚动条
	var tabScroll = $('.wjs-main .nav-tabs');
	var tabLi = $('li',tabScroll);
	var widthAll = 0;
	var screenWidth = $(window).width();
	tabLi.each(function(index,el){
		var _el = $(el);
		// 局部变量不能累加
		widthAll += _el.width();
	})
	tabScroll.width(widthAll);

	// 在手机端利用touch去切换轮播图
	
	var carousel = $('.carousel');
	var startX = 0;
	var startTime = null;
	carousel.on('touchstart',function(e){
		startTime = new Date();
		startX = e.originalEvent.changedTouches[0].pageX;
	});

	carousel.on('touchend',function(e){

		var dx = e.originalEvent.changedTouches[0].pageX - startX;
		var dTime = new Date() - startTime;
		if(Math.abs(dx) > screenWidth/3 || (dTime < 300 && Math.abs(dx) > 30)){
			if(dx > 0){
				// 看到上一张
				carousel.carousel('prev');
			}else {
				// 看到下一张
				carousel.carousel('next');
			}
		}
	})

})
