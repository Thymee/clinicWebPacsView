function setupButtons(studyViewer) {
	
	//隐藏下拉菜单
	function hideStyle(){
		$(".sub-toolbar").hide(); //所有的下拉菜单
		$(".sub-toolbar-play").hide(); //播放的下拉菜单
		$(".sub-toolbar-download").hide(); //保存的下拉菜单
	};
	
	//恢复文字和图标
	function resetStyle(){
		$("#magnifier").text("放大镜");//恢复
		$("#mark").text("标注测量").prev().removeClass().addClass("tool-mark");//恢复
		$("#vertical").text("镜像操作").prev().removeClass().addClass("tool-vertical");//恢复

		$(".toolbar-button i").removeClass("blue");//移除全部蓝色

	};
//	

	//	下载图像函数的封装
	function download(image, imageUrl, type) {
		var fileName = image.data.string("x00080018") + type;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", imageUrl, true)
		xhr.responseType = "arraybuffer"
		xhr.onload = function(evt) {
			var blob = new Blob([xhr.response], {
				type: "text/plain"
			})
			saveAs(blob, fileName)
		}
		xhr.send()
	}
	
	//点击屏幕图像 增加蓝色边框  /停止播放	
//	forEachViewport(function(element) {
//		$(element).mousedown(function(e) {
//		activeViewer(element);//增加蓝色边框
//		//播放按钮  如果在播放就暂停
//		if($('.tool-play').is(".icon-play")) { 
//			disableAllTools();
//			cornerstoneTools.stopClip(element);
//			$('.tool-play').removeClass('icon-play').addClass('icon-stop')
//		}
//		event.preventDefault();
//			
//		})
//		
//	})

//$('.viewportWrapper').on('click',function(){
//	alert('3223')
//	var activeElement = $(this).children(".viewport");
//		activeViewer(activeElement);//增加蓝色边框
//		//播放按钮  如果在播放就暂停
//		if($('.tool-play').is(".icon-play")) { 
//			disableAllTools();
//			var el = activeElement.get(0);
//			cornerstoneTools.stopClip(el);
//			$('.tool-play').removeClass('icon-play').addClass('icon-stop')
//		}
//		event.preventDefault();
//})


	
	$('.viewer').on('click', '.viewportWrapper', function(event) {
		var activeElement = $(this).children(".viewport");
		activeViewer(activeElement);//增加蓝色边框
		//播放按钮  如果在播放就暂停
		if($('.tool-play').is(".icon-play")) { 
			disableAllTools();
			var el = activeElement.get(0);
			cornerstoneTools.stopClip(el);
			$('.tool-play').removeClass('icon-play').addClass('icon-stop')
		}
		event.preventDefault();
	});


		
		
		
	//点击工具按钮出现下拉菜单效果				
	$(".toolbar-functions").on("click", ".toolbar-item", function(e) {
		hideStyle();
//		resetStyle();
//		$(".toolbar-button i").removeClass("blue");//移除全部蓝色
		$(this).children(".sub-toolbar").show();//当前的下拉菜单出现
				
		//播放按钮  如果在播放就暂停
		if($('.tool-play').is(".icon-play")){ 
			$('.tool-play').removeClass('icon-play').addClass('icon-stop');
		}
		
		//对于单功能按钮	
		if($(this).children(":first").hasClass("fun-btn")){	
			resetStyle();
			$(this).children(":first").children("i").addClass("blue");
		}else if($(this).hasClass("ctMrBtn")){
			$(this).children(":first").children("i").addClass("CTMRblue");
		}
		
		//如果点击的是保存按钮则出现子菜单
		if($(this).children("ul").hasClass('sub-toolbar-download')) {
			$(this).children("ul").show();
		}
		e.stopPropagation();
	});

	//点击播放小箭头出现下拉菜单效果
	$(".playArrow").on("click", function(e) {
		hideStyle();
//		resetStyle();
		$(".toolbar-button i").removeClass("blue");//移除全部蓝色
		$(this).next().show();
		e.stopPropagation();
	});

	//点击任意区域隐藏下拉菜单":not(.toolbar-item)",
	$(document).on("click", function() {
		hideStyle();
	});
	//点击下拉菜单添加切换图标和文字
	$(".sub-toolbar").on("click", "li", function(e) {
		resetStyle();
		$(this).parent().hide();
		var $el = $(this);
		selectText($el,panZoomSynchronizer);
		e.stopPropagation();
	});

	//点击保存下拉菜单 保存图片格式
	$(".sub-toolbar-download").on("click", "li", function(e){
		resetStyle();
		$(".sub-toolbar-download").hide();
		e.stopPropagation();
		var formatUpper = $(this).children('span').text();
		var formatLower = formatUpper.toLowerCase();
		
		if($('.activeViewer').length <= 0) {//如果没有选中 则下载全部的图像
			if(formatLower == ".dcm") {
				forEachViewport(function(element) {
					var image = cornerstone.getImage(element);
					var imageUrl = "http:" + image.imageId.substr(8);
					download(image, imageUrl, formatLower)
				})
			}else{ //其他格式
				forEachViewport(function(element) {
					var image = cornerstone.getImage(element);
					var imageUrl = "http:" + image.imageId.substr(8);
					//替换url
					imageUrl = imageUrl.replace("image", "download") + formatUpper.substr(1) + '/';
					download(image, imageUrl, formatLower)
				})
			};
		}else{//如果有选中 则下载当前选中的那一张
			
			var avtiveElement = $('.activeViewer').find(".viewport").get(0);
			 
			if(formatLower == ".dcm") {
					var image = cornerstone.getImage(avtiveElement);
					var imageUrl = "http:" + image.imageId.substr(8);
					download(image, imageUrl, formatLower)
			} else { //其他格式
					var image = cornerstone.getImage(avtiveElement);
					var imageUrl = "http:" + image.imageId.substr(8);
					//替换url
					imageUrl = imageUrl.replace("image", "download") + formatUpper.substr(1) + '/';
					download(image, imageUrl, formatLower)
			};
		};

	});


	//点击播放下拉菜单  切换播放文本
	$(".sub-toolbar-play").on("click", "li", function(e) {
		e.stopPropagation();
//		$(".sub-toolbar-play").hide();
		$(this).parent().hide();
		var sLi = $(this).children('span');
		var sLiText = $(sLi).text();
		var iLi = $(this).children('i');
		var iLiAttr = $(iLi).attr('data-play');

		var url = clinic + saveUserHabiys;
		var userId = window.location.hash.split("#")[2]; //获取用户id 用于获取和保存用户习惯
		var objParams = {
			"key": "playSpeed",
			"userIdty": userId,
			"value": sLiText
		};
		$.post(url, objParams, function() {});

		var sDiv = $(this).parent().siblings(".toolbar-button").children('span');
		var sDivText = $(sDiv).text();

		var sLiTextReg = new RegExp(sLiText)

		if(!sLiTextReg.test(sDivText)) {
			$(sDiv).text(sLiText);
			$(sDiv).attr('data-play', iLiAttr)
		}

		disableAllTools();
		
		//获取当前元素viewport 如果没有选中 则选择第一个序列的第一个元素viewport
		var avtiveElement = selectCurrentElement();

		var stackState = cornerstoneTools.getToolState(avtiveElement, 'stack');
				
		if(stackState) {
			var frameRate = stackState.data[0].frameRate;
			var stackData = stackState.data[0];
			//获取图像当前索引
			var index = stackData.currentImageIdIndex;
			if(index == stackData.imageIds.length - 1) {
				//如果为最后一张 则调到第一张
				cornerstoneTools.scrollToIndex(avtiveElement, 0);
			};
			// Play at a default 10 FPS if the framerate is not specified
			if(frameRate === undefined) {
				frameRate = 10;
			}

			//alert($('.tool-play').siblings('span').attr('data-play'))
			var frameSpan = $('.tool-play').siblings('span').attr('data-play')
			frameRate = parseInt(frameSpan);

			cornerstoneTools.playClip(avtiveElement, frameRate);
			var playClipToolData = cornerstoneTools.getToolState(avtiveElement, 'playClip');
			playClipToolData.data[0].loop = false;
			$('.tool-play').removeClass('icon-stop').addClass('icon-play')

		}

		
	});


	
	// Zoom缩放
	$($(studyViewer).find('.tool-zoom:visible').parent()).on('click', function(e) {
		disableAllTools();
		// alert(synchronizer)
		var e = e||window.event;
//		e.stopPropagation();
		forEachViewport(function(element) {
			cornerstoneTools.zoom.activate(element,5);
			// synchronizer.remove(element); // 5 is right mouse button and left mouse button
		});
		sync(panZoomSynchronizer);
	});

	// Pan移动
	$($(studyViewer).find('.tool-move:visible').parent()).on('click', function(e) {
		var e = e||window.event;
//		e.stopPropagation();
		disableAllTools();
		forEachViewport(function(element) {
			cornerstoneTools.pan.activate(element, 3); // 3 is middle mouse button and left mouse button
		});
		
		sync(panZoomSynchronizer);
		
		
	});

	// Rotate旋转
	$($(studyViewer).find('.tool-rotate:visible').parent()).on('click', function(e) {
		var e = e||window.event;
//		e.stopPropagation();
		disableAllTools();

		forEachViewport(function(element) {

			cornerstoneTools.rotate.activate(element, 1);
			var targetViewport = cornerstone.getViewport(element);
		});

		sync(rotationSynchronizer);
	});

	// ReferenceLine定位线
	$($(studyViewer).find('.tool-position:visible').parent()).on('click', function() {
		$(".tool-location").removeClass("CTMRblue");
//		disableAllTools();
//		forEachViewport(function(element){
//			panZoomSynchronizer.remove(element);
//		})
		forEachViewport(function(element){

			if ($(element).data('waiting')||$(element).parents('.imageViewer').data('isLayout')) {
        		return ;
    		};
  
			synchronizer.remove(element)
			cornerstoneTools.automaticPlanePositioning.tool.disable(element);
			
			referenceLineSynchronizer.add(element);
			cornerstoneTools.referenceLines.tools.enable(element, referenceLineSynchronizer);

		})
	});
 
	
	// automatic plane positioning 自动平面定位
	$($(studyViewer).find('.tool-location:visible').parent()).on('click', function() {
//		disableAllTools();
		$(".tool-position").removeClass("CTMRblue");
		
		forEachViewport(function(element) {
			if ($(element).data('waiting')||$(element).parents('.imageViewer').data('isLayout')) {
        		return ;
    		};

			referenceLineSynchronizer.remove(element);
			cornerstoneTools.referenceLines.tools.disable(element)
			
			synchronizer.add(element);
			cornerstoneTools.automaticPlanePositioning.tool.enable(element, synchronizer);
			

		})
	});

	// 播放 Play clip 
	$($(studyViewer).find('.tool-play').parent()).on('click', function(e) {
		e.stopPropagation();
		hideStyle();
		resetStyle();
//		$(".toolbar-button i").removeClass("blue");//移除全部蓝色
		disableAllTools();		
//		判断选中序列是否有内容 如果没有则返回false(activeRoot=false)
		var activeRoot = selectElement()
          var avtiveElement = activeRoot.find(".viewport").get(0);

          
          if (!activeRoot||$(avtiveElement).data('waiting')) {
            return
          }

//		获取当前元素viewport 如果没有选中 则选择第一个序列的第一个元素viewport
		var avtiveElement = selectCurrentElement();
	
		if($('.tool-play').is(".icon-play")) { //如果隐藏就显示
			cornerstoneTools.stopClip(avtiveElement);
			$('.tool-play').removeClass('icon-play').addClass('icon-stop')
		} else if($('.tool-play').is(".icon-stop")) {
			
			var stackState = cornerstoneTools.getToolState(avtiveElement, 'stack');
			
			
			if(stackState) {
				var frameRate = stackState.data[0].frameRate;
				// Play at a default 10 FPS if the framerate is not specified
				var stackData = stackState.data[0];
				//获取图像当前索引
				var index = stackData.currentImageIdIndex;
				if(index == stackData.imageIds.length - 1) {
					//如果为最后一张 则调到第一张
					cornerstoneTools.scrollToIndex(avtiveElement, 0);
				};
				if(frameRate === undefined) {
					frameRate = 10;
				}

				//alert($('.tool-play').siblings('span').attr('data-play'))
				var frameSpan = $('.tool-play').siblings('span').attr('data-play')
				frameRate = parseInt(frameSpan);

				cornerstoneTools.playClip(avtiveElement, frameRate);
				var playClipToolData = cornerstoneTools.getToolState(avtiveElement, 'playClip');
				playClipToolData.data[0].loop = false;
				$('.tool-play').removeClass('icon-stop').addClass('icon-play')
			}

		}

	});

	// 调窗
	$($(studyViewer).find('.tool-adjustment').parent()).on('click', function() {
		disableAllTools();
		var e = e||window.event;
//		e.stopPropagation();
		forEachViewport(function(element) {
			cornerstoneTools.wwwc.activate(element, 1);
			var viewport = cornerstone.getViewport(element);
			if(viewport.voiLUT !== undefined) {
				viewport.voiLUT = undefined;
			}
			cornerstone.setViewport(element, viewport);
		});
		sync(wcWwSynchronizer);
	});
	
//	// 默认WW/WL
//	$($(studyViewer).find('.tool-adjustment-default').parent()).on('click touchstart', function() {

//		disableAllTools();
//		forEachViewport(function(element) {
//
//			cornerstoneTools.wwwc.activate(element, 1);
//			var image = cornerstone.getImage(element);
//			var viewport = cornerstone.getViewport(element);
//			if(viewport.voiLUT !== undefined) {
//				viewport.voiLUT = undefined;
//			}
//			viewport.voi.windowWidth = image.windowWidth;
//			viewport.voi.windowCenter = image.windowCenter;
//			cornerstone.setViewport(element, viewport);
//
//		});
//	});

//	// 自动WW/WL
//	$($(studyViewer).find('.tool-adjustment-auto').parent()).on('click touchstart', function() {
//
//		disableAllTools();
//		forEachViewport(function(element) {
//
//			cornerstoneTools.wwwc.activate(element, 1);
//			var viewport = cornerstone.getViewport(element);
//			if(viewport.voiLUT !== undefined) {
//				viewport.voiLUT = undefined;
//			}
//
//			cornerstone.setViewport(element, viewport);
//
//		});
//
//		sync(wcWwSynchronizer);
//	});
//
//	// 骨窗bone window
//	$($(studyViewer).find('.tool-adjustment-bone').parent()).on('click touchstart', function() {
//
//		disableAllTools();
//		forEachViewport(function(element) {
//
//			cornerstoneTools.wwwc.activate(element, 1);
//			var viewport = cornerstone.getViewport(element);
//			if(viewport.voiLUT !== undefined) {
//				viewport.voiLUT = undefined;
//			}
//			viewport.voi.windowWidth = 2000;
//			viewport.voi.windowCenter = 300;
//			cornerstone.setViewport(element, viewport);
//
//		});
//	});
//
//	// 肺窗lung window
//
//	$($(studyViewer).find('.tool-adjustment-lung').parent()).on('click touchstart', function() {
//		disableAllTools();
//		forEachViewport(function(element) {
//
//			cornerstoneTools.wwwc.activate(element, 1);
//			var viewport = cornerstone.getViewport(element);
//			if(viewport.voiLUT !== undefined) {
//				viewport.voiLUT = undefined;
//			}
//			viewport.voi.windowWidth = 1600;
//			viewport.voi.windowCenter = -600;
//			cornerstone.setViewport(element, viewport);
//
//		});
//	});
//
//	// 软窗softTissue window
//	$($(studyViewer).find('.tool-adjustment-softTissue').parent()).on('click touchstart', function() {
//
//		disableAllTools();
//		forEachViewport(function(element) {
//
//			cornerstoneTools.wwwc.activate(element, 1);
//			var viewport = cornerstone.getViewport(element);
//			if(viewport.voiLUT !== undefined) {
//				viewport.voiLUT = undefined;
//			}
//			viewport.voi.windowWidth = 400;
//			viewport.voi.windowCenter = 20;
//			cornerstone.setViewport(element, viewport);
//
//		});
//	});

	// 放大镜magnifierTool
	$("#sub-magnifier").on('click', 'li', function() {
		disableAllTools();
		var self = $(this).children('i')
		forEachViewport(function(element) {
			var config = cornerstoneTools.magnify.getConfiguration();
			config.magnificationLevel = parseFloat($(self).attr('data-magnifier'));
			config.magnifySize = 100;
			//cornerstoneTools.referenceLines.activate(element, 1);
			cornerstoneTools.magnify.activate(element, 1);
		});
		
		$("#magnifier").data("scale",$(self).attr('data-magnifier'));//设置span的data为放大的倍率，目的：为了保持当前功能中获取到该值
	});

	//垂直镜像vertical
	$("#tool-vertical").on("click", function() {
		disableAllTools();
		var element = selectCurrentElement();
		var viewport = cornerstone.getViewport(element);
		//判断选中元素是否有内容 如果没有则return；
		if(!viewport){
			return;
		}
		viewport.vflip = !viewport.vflip;
		cornerstone.setViewport(element, viewport);
	});

	//水平镜像flip
	$("#tool-flip").on("click", function() {
		disableAllTools();
		var element = selectCurrentElement();
		var viewport = cornerstone.getViewport(element);
		//判断选中元素是否有内容 如果没有则return；
		if(!viewport){
			return;
		}
		viewport.hflip = !viewport.hflip;
		cornerstone.setViewport(element, viewport);
	});

	/*PC工具*/
	// Invert反色
	$($(studyViewer).find(".tool-inverse:visible").parent()).on('click', function() {
		disableAllTools();
		//判断选中序列是否有内容 如果没有则返回false(activeRoot=false)
		var activeRoot = selectElement()
          var avtiveElement = activeRoot.find(".viewport").get(0);

          
          if (!activeRoot||$(avtiveElement).data('waiting')) {
            return
          }

//		反色的时候去掉同步  因为同步的时候  如果反色sourceElement  其他的也会反色
		if ($("#tool-sync").data("sync") && $("#tool-sync").data("sync") == "allSync"){
			forEachViewport(function(element) {
				wcWwSynchronizer.remove(element);
			});
		};
//		获取当前元素viewport 如果没有选中 则选择第一个序列的第一个元素viewport
		var element = selectCurrentElement();
		var viewport = cornerstone.getViewport(element);
		//判断选中元素是否有内容 如果没有则return；
		if(!viewport){
			return;
		}
		// Toggle invert
		if(viewport.invert === true){
			viewport.invert = false;
		} else {
			viewport.invert = true;
		}
		cornerstone.setViewport(element, viewport);
	});

	//一键还原restore
	$($(studyViewer).find('.tool-restore:visible').parent()).on('click', function() {
		//禁用功能
		disableAllTools();
		//移除蓝色
		$(".ctMrBtn i").removeClass("CTMRblue");
		resetStyle();//重置文字
		$("#tool-sync").data('sync',"");//取消同步
		$("#tool-sync").text("同步操作").prev().removeClass().addClass("tool-list-de");//取消同步
		$('.imageViewer').unbind('mouseenter').unbind('mouseleave');//解绑hover（序列同步）
		$('.tool-play').removeClass('icon-play').addClass('icon-stop');//暂停播放 
		//恢复图像  清除同步
		forEachViewport(function(element) {
			//恢复图像
			var image = cornerstone.getImage(element);
			var defaultView = cornerstone.getDefaultViewportForImage(element, image);
			cornerstone.setViewport(element, defaultView);
			//      var toolStateManager = cornerstoneTools.getElementToolStateManager(element);
			var toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager
			// Note that this only works on ImageId-specific tool state managers (for now)
			toolStateManager.clear(element)
			cornerstone.updateImage(element);
			//var toolState=toolStateManager.get(element) 
			//清除同步
			panZoomSynchronizer.remove(element);
        	wcWwSynchronizer.remove(element);
        	rotationSynchronizer.remove(element);
        	
        	synchronizer.remove(element);//移除自动平面定位
        	referenceLineSynchronizer.remove(element);//移除定位线
        	
        	//还原默认调窗
			cornerstoneTools.wwwc.activate(element, 1);
			var viewport = cornerstone.getViewport(element);
			if(viewport.voiLUT !== undefined) {
				viewport.voiLUT = undefined;
			};
			cornerstone.setViewport(element, viewport);
		});
	});
	
	//取消同步
	$(".cancleSync").on("click",function(e){
		var e = e||window.event;
		e.stopPropagation();		
		$("#tool-sync").data('sync',"");
		$("#tool-sync").text("同步操作").prev().removeClass().addClass("tool-list-de");//取消同步
		$(this).parent().hide();
//		resetStyle();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
		$('.imageViewer').unbind('mouseenter').unbind('mouseleave');//解绑hover
		//取消所有的同步功能
		forEachViewport(function(element){
        	panZoomSynchronizer.remove(element);
        	wcWwSynchronizer.remove(element);
        	rotationSynchronizer.remove(element);
    	});
	});
	//下载序列影像AVI
	$('.list-group').on('mouseover','.list-group-item',function(){
		if(window.sessionStorage.getItem("user-info") != undefined) {
			var userinfo = JSON.parse(window.sessionStorage.getItem("user-info"));
			var power = userinfo.power;
//			power="01234"; 
			if(power.indexOf("4") == -1) {
				$(".downLoadSeries").hide();
			}else{ 	
				var downLoad=$(this).find('.downLoadSeries'); 
				downLoad.css({"top":"0px"});
			}
		}
	})
	
	$('.list-group').on('mouseout','.list-group-item',function(){
		var downLoad=$(this).find('.downLoadSeries'); 
		downLoad.css({"top":"-26px"});
	})
	
	$(".list-group").on("click", ".downLoadSeries-down", function(e) {
		var e = e||window.event;
		e.stopPropagation();
		var seriesId = $(this).attr("data-series-id");
		var hashStudyId = window.location.hash.split("#")[1]; //真实数据
		var downLoadSeriesUrl = clinic + downLoadSeries + hashStudyId + "/" + seriesId + "/"; //下载序列影像接口 
		window.location.href = downLoadSeriesUrl;
//		window.open(downLoadSeriesUrl,"_blank")
	}); 

	//测量工具
	// 长度测量Length measurement 
	$($(studyViewer).find('.tool-line').parent()).on('click', function() {
		disableAllTools();
		forEachViewport(function(element) {
			cornerstoneTools.length.activate(element, 1);
		});

	});

	// 角度测量Angle measurement
	$($(studyViewer).find('.tool-angle').parent()).on('click', function() {
		disableAllTools();
		forEachViewport(function(element) {
			cornerstoneTools.simpleAngle.activate(element, 1);
		});
	});

	// 点测量Pixel probe
	$($(studyViewer).find('.tool-dot').parent()).on('click', function() {
		disableAllTools();
		forEachViewport(function(element) {
			cornerstoneTools.probe.activate(element, 1);
		});
	});

	// 椭圆测量 Elliptical ROI
	$($(studyViewer).find('.tool-ellipse').parent()).on('click', function() {
		disableAllTools();
		forEachViewport(function(element) {
			cornerstoneTools.ellipticalRoi.activate(element, 1);
		});
	});

	// 矩形测量 Rectangle ROI
	$($(studyViewer).find('.tool-rectangle').parent()).on('click', function() {
		disableAllTools();
		forEachViewport(function(element) {
			cornerstoneTools.rectangleRoi.activate(element, 1);
		});
	});

	 //tool-clear清除测量数据
	 $($(studyViewer).find('.tool-clear').parent()).on('click', function(event) {
//	 	disableAllTools();
		var e = event||window.event;
		e.stopPropagation();
		$(this).parent().hide();
	 	forEachViewport(function(element){
	 		var toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager
	 		toolStateManager.clear(element)
	 		cornerstone.updateImage(element);
	 	});
	 });

	// 箭头标注arrowAnnotate PC
	$($(studyViewer).find('.tool-arrows').parent()).on('click', function() {

		// Register the dialogs using the HTML5 Dialog Polyfill
		var annotationDialog = document.querySelector('.annotationDialog');
		var relabelDialog = document.querySelector('.relabelDialog');
		dialogPolyfill.registerDialog(annotationDialog);
		dialogPolyfill.registerDialog(relabelDialog);

		disableAllTools();

		forEachViewport(function(element) {
			var config = {
				getTextCallback: getTextCallback,
				changeTextCallback: changeTextCallback,
				drawHandles: false,
				drawHandlesOnHover: true,
				arrowFirst: true
			}
			cornerstoneTools.arrowAnnotate.setConfiguration(config);
			// Enable all tools we want to use with this element
			cornerstoneTools.arrowAnnotate.activate(element, 1);
			cornerstoneTools.arrowAnnotateTouch.activate(element);
		});

		// Define a callback to get your text annotation
		// This could be used, e.g. to open a modal
		function getTextCallback(doneChangingTextCallback) {
			var annotationDialog = $('.annotationDialog');
			var getTextInput = annotationDialog.find('.annotationTextInput');
			var confirm = annotationDialog.find('.annotationDialogConfirm');

			annotationDialog.get(0).showModal();

			confirm.off('click');
			confirm.on('click', function() {
				closeHandler();
			});

			annotationDialog.off("keydown");
			annotationDialog.on('keydown', keyPressHandler);

			function keyPressHandler(e) {
				// If Enter is pressed, close the dialog
				if(e.which === 13) {
					closeHandler();
				}
			}

			function closeHandler() {
				annotationDialog.get(0).close();
				doneChangingTextCallback(getTextInput.val());
				// Reset the text value
				getTextInput.val("");
			}
		}

		// Define a callback to edit your text annotation
		// This could be used, e.g. to open a modal
		function changeTextCallback(data, eventData, doneChangingTextCallback) {
			var relabelDialog = $('.relabelDialog');
			var getTextInput = relabelDialog.find('.annotationTextInput');
			var confirm = relabelDialog.find('.relabelConfirm');
			var remove = relabelDialog.find('.relabelRemove');

			getTextInput.val(data.annotationText);
			relabelDialog.get(0).showModal();

			confirm.off('click');
			confirm.on('click', function() {
				relabelDialog.get(0).close();
				doneChangingTextCallback(data, getTextInput.val());
			});

			// If the remove button is clicked, delete this marker
			remove.off('click');
			remove.on('click', function() {
				relabelDialog.get(0).close();
				doneChangingTextCallback(data, undefined, true);
			});

			relabelDialog.off("keydown");
			relabelDialog.on('keydown', keyPressHandler);

			function keyPressHandler(e) {
				// If Enter is pressed, close the dialog
				if(e.which === 13) {
					closeHandler();
				}
			}

			function closeHandler() {
				relabelDialog.get(0).close();
				doneChangingTextCallback(data, getTextInput.val());
				// Reset the text value
				getTextInput.val("");
			}

		}

	});


	/*---------------------更多start-----------------------*/
	// Invert反色
	$($(studyViewer).find('.ipad-screen .tool-inverse').parent()).on('click', function() {
		disableAllTools();
		//判断选中序列是否有内容 如果没有则返回false(activeRoot=false)
		var activeRoot = selectElement()
          var avtiveElement = activeRoot.find(".viewport").get(0);

          
          if (!activeRoot||$(avtiveElement).data('waiting')) {
            return
          }

//		反色的时候去掉同步  因为同步的时候  如果反色sourceElement  其他的也会反色
		if ($("#tool-sync").data("sync") && $("#tool-sync").data("sync") == "allSync"){
			forEachViewport(function(element) {
				wcWwSynchronizer.remove(element);
			});
		};
//		获取当前元素viewport 如果没有选中 则选择第一个序列的第一个元素viewport
		var element = selectCurrentElement();
		var viewport = cornerstone.getViewport(element);
		//判断选中元素是否有内容 如果没有则return；
		if(!viewport){
			return;
		}
		// Toggle invert
		if(viewport.invert === true){
			viewport.invert = false;
		} else {
			viewport.invert = true;
		}
		cornerstone.setViewport(element, viewport);
	});

	//一键还原restore
	$($(studyViewer).find('.ipad-screen .tool-restore').parent()).on('click', function() {
		//禁用功能
		disableAllTools();
		//移除蓝色
//		$(".fun-btn i").removeClass("blue");
		resetStyle();//重置文字
		$("#tool-sync").data('sync',"");//取消同步
		$("#tool-sync").text("同步操作").prev().removeClass().addClass("tool-list-de");//取消同步
		$('.imageViewer').unbind('mouseenter').unbind('mouseleave');//解绑hover（序列同步）
		$('.tool-play').removeClass('icon-play').addClass('icon-stop');//暂停播放 
		//恢复图像  清除同步
		forEachViewport(function(element) {
			//恢复图像
			var image = cornerstone.getImage(element);
			var defaultView = cornerstone.getDefaultViewportForImage(element, image);
			cornerstone.setViewport(element, defaultView);
			//      var toolStateManager = cornerstoneTools.getElementToolStateManager(element);
			var toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager
			// Note that this only works on ImageId-specific tool state managers (for now)
			toolStateManager.clear(element)
			cornerstone.updateImage(element);
			//var toolState=toolStateManager.get(element) 
			//清除同步
			panZoomSynchronizer.remove(element);
        	wcWwSynchronizer.remove(element);
        	rotationSynchronizer.remove(element);
        	
        	synchronizer.remove(element);//移除自动平面定位
        	referenceLineSynchronizer.remove(element);//移除定位线
        	//还原默认调窗
			cornerstoneTools.wwwc.activate(element, 1);
			var viewport = cornerstone.getViewport(element);
			if(viewport.voiLUT !== undefined) {
				viewport.voiLUT = undefined;
			};
			cornerstone.setViewport(element, viewport);
		});
	});
	
	//自动平面定位
	$($(studyViewer).find('.ipad-screen .tool-location').parent()).on('click', function() {
//		disableAllTools();
		forEachViewport(function(element) {
			if ($(element).data('waiting')||$(element).parents('.imageViewer').data('isLayout')) {
        		return ;
    		};

			referenceLineSynchronizer.remove(element);

			synchronizer.add(element);
			cornerstoneTools.automaticPlanePositioning.tool.enable(element, synchronizer);
			

		})
	});
	
	//定位线显示
	$($(studyViewer).find('.ipad-screen .tool-position').parent()).on('click', function() {
//		disableAllTools();

		forEachViewport(function(element){

			if ($(element).data('waiting')||$(element).parents('.imageViewer').data('isLayout')) {
        		return ;
    		};
  
			synchronizer.remove(element)
			
			referenceLineSynchronizer.add(element);
			cornerstoneTools.referenceLines.tools.enable(element, referenceLineSynchronizer);

		})

	});
	
	/*---------------------更多end-----------------------*/
	
	// Tooltips
	//  $($(studyViewer).find(".tool-save")).tooltip();
	//  $($(studyViewer).find('.tool-inverse')[0]).tooltip();
	//  $($(studyViewer).find('.tool-zoom')[0]).tooltip();
	//  $($(studyViewer).find('.tool-move')[0]).tooltip();
	//  $($(studyViewer).find('.tool-line')[0]).tooltip();
	//  $($(studyViewer).find('.tool-angle')[0]).tooltip();
	//  $($(studyViewer).find('.tool-dot')[0]).tooltip();
	//  $($(studyViewer).find('.tool-ellipse')[0]).tooltip();
	//  $($(studyViewer).find('.tool-rectangle')[0]).tooltip();
	//  $($(studyViewer).find('.tool-prev')[0]).tooltip();
	//  $($(studyViewer).find('.tool-next')[0]).tooltip();
	//  $($(studyViewer).find('.tool-layout')[0]).tooltip();
	//  $($(studyViewer).find('.tool-mark')[0]).tooltip();

	$("[data-toggle='tooltip']").tooltip({
		html: true
	});

};