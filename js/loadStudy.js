$(function() {
	var hashStudyId = window.location.hash.split('#')[1] //真实数据
	var userId = window.location.hash.split('#')[2] //获取用户id 用于获取和保存用户习惯

//	var hashStudyId = '1.2.826.0.1.3680043.2.461.9905009.607588521'
//var hashStudyId="1.2.826.0.1.3680043.2.461.9704076.3682707669";
//var hashStudyId="1.2.826.0.1.3680043.2.461.9947810.437802733";
//  var hashStudyId = "1.2.826.0.1.3680043.2.461.9931774.1340304768";
    var hashStudyId = "1.2.826.0.1.3680043.2.461.9714596.2091690011";


	

	panZoomSynchronizer = new cornerstoneTools.Synchronizer(
		'cornerstoneimagerendered',
		cornerstoneTools.panZoomSynchronizer
	)
	wcWwSynchronizer = new cornerstoneTools.Synchronizer(
		'cornerstoneimagerendered',
		cornerstoneTools.wwwcSynchronizer
	)
	rotationSynchronizer = new cornerstoneTools.Synchronizer(
		'cornerstoneimagerendered',
		cornerstoneTools.rotationSynchronizer
	)
	referenceLineSynchronizer = new cornerstoneTools.Synchronizer(
		'cornerstonenewimage',
		cornerstoneTools.updateImageSynchronizer
	)
	synchronizer = new cornerstoneTools.Synchronizer(
		'cornerstonenewimage',
		cornerstoneTools.automaticPlanePositioningSynchronizer
	)
	stackscrollSynchronizer = new cornerstoneTools.Synchronizer(
		'cornerstonestackscroll',
		cornerstoneTools.layoutStackScrollSynchronizer
	)

	var url = clinic + wadoOrFapForDicom + '?studyId=' + hashStudyId //影像接口
	var videoUrl = clinic + videoOfMedia + hashStudyId + '/' //流媒体接口
	var loadedPercents = []
	cornerstoneWADOImageLoader.external.cornerstone = cornerstone
	cornerstoneWADOImageLoader.configure({
		beforeSend: function(xhr) {
			// Add custom headers here (e.g. auth tokens)
			//xhr.setRequestHeader('APIKEY', 'my auth token');
		}
	})
	//	获取用户习惯
	var urlOfGetHabits = clinic + getUserHabits
	$.get(
		urlOfGetHabits, {
			userIdty: userId
		},
		function(result) {
			if(result.data == null || result.data.viewFields == null) {
				useData = {
					//初始化用户习惯
					playSpeed: '默认[10]'
				}
				var regex = /\[(\d+)\]/.exec(useData.playSpeed)
				var speed = regex[1]
				$('.toolbar-item .playSpeed').attr('data-play', speed)
			} else {
				//获取用户习惯
				useData = JSON.parse(result.data.viewFields)
				//			var regex="\\[(.+?)\\]";
				//			var arr=useData.playSpeed.match(regex);
				var regex = /\[(\d+)\]/.exec(useData.playSpeed)
				var speed = regex[1]
				$('.toolbar-item .playSpeed').attr('data-play', speed)
				$('.toolbar-item .playSpeed').text(useData.playSpeed)
			}
		}
	)
	//获取用户权利级别  判断是否有保存影像的权限
	if(window.sessionStorage.getItem('user-info') != undefined) {
		var userinfo = JSON.parse(window.sessionStorage.getItem('user-info'))
		var power = userinfo.power
		//		 power="01234";
		if(power.indexOf('4') == -1) {
			$('.downloadOfLi').hide() //影藏保存按钮
		}
	}

	//流媒体video-------lanjianqing

	function MediaPlay() {
		ajax(videoUrl).then(function(res) {
			var urlArr = []
			var durationOfVideo
			if(res.code == 200) {
				if(res.data.seriesVideoList.length > 0) {
					res.data.seriesVideoList.forEach(function(series, i) {
						var url =
							res.data.studyId +
							'/' +
							series.seriesInstanceUID +
							'/' +
							series.instanceVideoList[0].imageId +
							'/'
						urlArr.push(url)
					})
					var videoList = template('videoList', urlArr)
					$('.videoContainer').append(videoList)
					$('.showVideoList').on('click', function() {
						$('.videoContainer').toggle('slow')
					})
				} else {
					//没有视频则隐藏导航栏
					$('.showVideoList').hide()
				}
			} else {
				//没有视频则隐藏导航栏
				$('.showVideoList').hide()
			}

			//模态框弹出的时候
			$('#myModal').on('show.bs.modal', function(event) {
				var event = event || window.event
				var partOfLink = $(event.relatedTarget).data('link')

				var urlOfSrc = clinic + mediaOfMedia + partOfLink

				$.ajax({
					url: urlOfSrc,
					//			 	async:false,
					success: function(res) {
						durationOfVideo = Math.floor(res.data.videoDurationLength)
					}
				})

				//初始化视频
				var linkOfSrc = clinic + mediaOfM3u8 + partOfLink + '.m3u8'
				$('source').attr('src', linkOfSrc)

				var player = (window.player = videojs(
					'video', {
						textTrackDisplay: false,
						posterImage: true,
						errorDisplay: false,
						controlBar: true
					},
					function() {
						player.src({
							src: linkOfSrc,
							type: 'application/x-mpegURL'
						})
						player.load(linkOfSrc)
						player.play()
						this.on('durationchange', function() {
							this.duration(durationOfVideo)
						})
					}
				))
			})
		})
	}
	//下载视频影像
	$('.videoContainer').on('mouseover', '.list-group-item', function() {
		if(window.sessionStorage.getItem('user-info') != undefined) {
			var userinfo = JSON.parse(window.sessionStorage.getItem('user-info'))
			var power = userinfo.power
			//			power="01234";
			if(power.indexOf('4') == -1) {
				$('.downLoadSeries').hide()
			} else {
				var downLoad = $(this).find('.downLoadSeries')
				downLoad.css({
					top: '0px'
				})
			}
		}
	})
	$('.videoContainer').on('mouseout', '.list-group-item', function() {
		var downLoad = $(this).find('.downLoadSeries')
		downLoad.css({
			top: '-22px'
		})
	})
	$('.videoContainer').on('click', '.downLoadSeries-down', function(event) {
		event.stopPropagation()
		var event = event || window.event
		var partOfLink = $(this).data('link')
		var n = partOfLink.indexOf('/', partOfLink.indexOf('/') + 1)
		partOfLink = partOfLink.substring(0, n + 1)
		var url = clinic + mediaOfDownLoad + partOfLink
		window.location.href = url
	})

	//dicm
	ajax(url)
		.then(function(data) {
			if(data.code == 200) {
				if(
					data.data.seriesList[0].modality == 'CT' ||
					data.data.seriesList[0].modality == 'MR'
				) {
					$('.ctMrBtn').css('display', 'block')
				}
				MediaPlay() //流媒体
				// Add tab content by making a copy of the studyViewerTemplate element
				var studyViewerCopy = $('#studyViewerTemplate')

				var imageViewer = new ImageViewer($('.imageViewer'))

				imageViewer.setViewport('2 x 2 序列', $('.imageViewer')) // default layout

				function initViewports() {
					imageViewer.forEachElement(function(el, vp, i) {
						if($(el).data('waiting')) {
							cornerstone.enable(el)
							useItemStack(i, i)
						}
					})
				}

				// setup the tool buttons
				setupButtons('.toolbar')

				// 点击序列图标的下拉菜单
				$('.changeViewport li').click(function(e) {
					var e = e || window.event
					e.stopPropagation()

					//判断当前的class和序列图标的class是否一致   12.25lanjq
					var className = $(this)
						.children('i')
						.attr('class')
					var parentClassName = $('#toolViewport').attr('class')
					if(className != parentClassName) {
						//不一致则把序列全屏初始化 12.25lanjq
						$('.full-screen').attr('class', 'tool-screen-full full-screen')
						$('.full-screen')
							.siblings()
							.text('序列放大')
						hideElement = false
					}

					//切换文字
					selectText($(this))
					$('#toolViewport').removeClass('blue') //移除blue类名  拖拽的时候防止模拟点击之后出现下拉菜单
					//其他功能
					$(this)
						.parent()
						.hide()
					var type = $(this).text()
					var viewport = $('.imageViewer')

					imageViewer.setViewport(type, viewport)
					initViewports()
					forEachViewport(function(element) {
						cornerstone.resize(element, true)
						cornerstone.fitToWindow(element)
					})
					resizeStudyViewer()
					activeWrapper() //hover的时候增加边框样式
//					ininFullScreen ()

					return false
				})

				//点击序列放大图标   序列放大
				function fullScreen(activeRoot) {
					$('.sub-toolbar').hide() //所有的下拉菜单
					$('.sub-toolbar-play').hide() //播放的下拉菜单
					$('.sub-toolbar-download').hide() //保存的下拉菜单


					//只有在这两个选项之下才能切换hideElement
					if(
						$('#toolViewport').hasClass('tool-layout-1x2') ||
						$('#toolViewport').hasClass('tool-layout-2x2')
					) {
						//切换图标
						$('.full-screen')
							.toggleClass('tool-screen-shrink')

						var nLayout = $('.viewer').data('viewport')
						var ab = imageViewer.getRowsCols(nLayout),
							a = ab[0],
							b = ab[1],
							perWidth = 100 / b,
							perHeight = 100 / a
						if(hideElement) {
							activeRoot
								.css({
									width: perWidth + '%',
									height: perHeight + '%'
								})
								.siblings('.imageViewer ')
								.show()
							forEachViewport(function(element) {
						cornerstone.resize(element, true)
						cornerstone.fitToWindow(element)
					})
							hideElement = false

							$('.full-screen')
								.next()
								.text('序列放大')
						} else {
							activeRoot
								.css({
									width: 100 + '%',
									height: 100 + '%'
								})
								.siblings('.imageViewer')
								.hide()
								
							forEachActiveRootViewport(activeRoot, function(element) {
						cornerstone.resize(element, true)
						cornerstone.fitToWindow(element)
					})
							hideElement = true
							$('.full-screen')
								.next()
								.text('收起序列')
						}
					}

					
					resizeStudyViewer()

				}

				var hideElement = false
				$('.full-screen').parent().click(function(){
					var activeRoot=selectElement()
					if(!activeRoot) return
					
					fullScreen(activeRoot)	
						
						
				})
				
				//点击布局之后的下拉菜单
				$('.changeLayout li').click(function(e) {
					selectText($(this)) //切换文字
					$('#toolLayout').removeClass('blue') //移除blue类名  拖拽的时候防止模拟点击之后出现下拉菜单
					var e = e || window.event
					e.stopPropagation()

					$(this)
						.parent()
						.hide()

					//获取单个选中元素  如果没有 默认选择第一个序列第一个
					var activeRoot = selectElement()
					var avtiveElement = activeRoot.find(".viewport").get(0);

					if(!activeRoot || $(avtiveElement).data('waiting')) {
						return
					}

					var activeRootElement = activeRoot.find('.viewport')[0]

					referenceLineSynchronizer.remove(activeRootElement)
					synchronizer.remove(activeRootElement)

					var toolStateManager =
						cornerstoneTools.globalImageIdSpecificToolStateManager

					toolStateManager.clear(activeRootElement)
					cornerstone.updateImage(activeRootElement)

					var type = $(this).text()
					var ab = imageViewer.getRowsCols(type),
						numOfChildViewports = ab[0] * ab[1]
					imageViewer.setLayout(type, activeRoot)

					//              给选中序列的第一个元素增加蓝色边框
					activeRoot
						.find('.viewportWrapper')
						.eq(0)
						.addClass('activeViewer')

					if(numOfChildViewports == 1) {
						var activeElement = activeRoot.find('.viewport')[0]

						referenceLineSynchronizer.add(activeElement)
						synchronizer.add(activeElement)
					} else {
						//			cornerstone.updateImage(element);
						imageViewer.forEachLayoutElement(function(el, vp, i) {
							if(!$(el).data('display')) {
								var ol = vp.find('.overlay-text')
								if(ol.length < 1) {
									ol = $(
										'<div class="overlay overlay-text">NO IMAGE</div>'
									).appendTo(vp)
								}
								var ow = vp.width() / 2,
									oh = vp.height() / 2
								ol.css({
									top: oh,
									left: ow - ol.width() / 2
								})
							}

							displayLayoutImage(el, i, imageViewer.layoutStacks[i], function(
								el,
								stack
							) {
								if(!$(el).data('setup')) {
									setupLayoutViewport(el, stack, this)
									setupViewportOverlays(el, data)
									$(el).data('setup', true)
								}
							})
							//		                cornerstone.fitToWindow(el);
							cornerstone.resize(el, true)

							if($(el).hasClass('ui-droppable')) {
								$(el).droppable('destroy')
							}
						})
					}
					forEachViewport(function(element) {
						// cornerstone.enable(element);
						cornerstone.resize(element, true)
						cornerstone.fitToWindow(element)
					})
					activeWrapper() //hover的时候增加边框样式
//					ininFullScreen ()
					//keepFunction();//保留当前功能
					//判断此时是否全部同步
					if(
						$('#tool-sync').data('sync') &&
						$('#tool-sync').data('sync') == 'allSync'
					) {
						$('.imageViewer')
							.unbind('mouseenter')
							.unbind('mouseleave') //解绑hover
						forEachViewport(function(element) {
							panZoomSynchronizer.add(element)
						})
					}
					keepFunction() //保留当前功能

					return false
				})

				//			完成图像加载之后
				activeWrapper() //hover增加边框样式

				var seriesIndex = 0

				// Create a stack object for each series
				data.data.seriesList.forEach(function(series, i) {
					var stack = {
						seriesDescription: series.seriesDescription,
						stackId: series.seriesNumber,
						imageIds: [],
						seriesIndex: seriesIndex,
						currentImageIdIndex: 0,
						frameRate: series.frameRate,
						seriesId: series.seriesInstanceUID
					}
					// Populate imageIds array with the imageIds from each series
					// For series with frame information, get the image url's by requesting each frame
					if(series.numberOfFrames !== undefined) {
						var numberOfFrames = series.numberOfFrames
						for(var i = 0; i < numberOfFrames; i++) {
							var imageId = series.instanceList[0].imageId + '?frame=' + i
							if(imageId.substr(0, 4) !== 'http') {
								imageId =
									'dicomweb://cornerstonetech.org/images/ClearCanvas/' + imageId
							}
							stack.imageIds.push(imageId)
						}
						// Otherwise, get each instance url
					} else {
						series.instanceList.forEach(function(image) {
							var imageId =
								'wadouri:' +
								clinic.substr(5) +
								'/wadoOrFap/image/' +
								data.data.studyId +
								'/' +
								series.seriesInstanceUID +
								'/' +
								image.imageId +
								'/'

							stack.imageIds.push(imageId)
						})
					}
					// Move to next series
					seriesIndex++

					// Add the series stack to the stacks array
					imageViewer.stacks.push(stack)
				})

				// Resize the parent div of the viewport to fit the screen
				var imageViewerElement = $(studyViewerCopy).find('.imageViewer')[0]
				var viewportWrapper = $(imageViewerElement).find('.viewportWrapper')[0]
				var parentDiv = $(studyViewerCopy).find('.viewer')[0]

				var studyRow = $(studyViewerCopy).find('.studyRow')[0]
				var width = $(studyRow).width()

				// Get the viewport elements
				var element = $(studyViewerCopy).find('.viewport')[0]

				// Image enable the dicomImage element
				initViewports()
				//cornerstone.enable(element);

				// Get series list from the series thumbnails (?)
				var seriesList = $(studyViewerCopy).find('.thumbnails')[0]
				$(seriesList).html(' ')
				imageViewer.stacks.forEach(function(stack, stackIndex) {
					// Create series thumbnail item
					var seriesEntry =
						'<a class="list-group-item" + ' +
						'oncontextmenu="return false"' +
						'unselectable="on"' +
						'onselectstart="return false;"' +
						'onmousedown="return false;">' +
						'<div class="csthumbnail"' +
						'oncontextmenu="return false"' +
						'unselectable="on"' +
						'onselectstart="return false;"' +
						'onmousedown="return false;"></div>' +
						'<div class="text-center small">' +
						stack.imageIds.length +
						'</div><div class="progress progress-striped active" style="margin:0;height:8px;">' +
						'<div class="loadProgress' +
						stackIndex +
						' progress-bar progress-bar-color" role="progressbar"' +
						'aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">' +
						'<span class="sr-only"></span></div></div>' +
						'<div class="downLoadSeries" ><div class="downLoadSeries-down text-center"  data-series-id="' +
						stack.seriesId +
						'" >下载序列视频</div></div>' +
						'</a>'

					// Add to series list
					var seriesElement = $(seriesEntry).appendTo(seriesList)

					// Find thumbnail
					var thumbnail = $(seriesElement).find('div')[0]

					// Enable cornerstone on the thumbnail
					cornerstone.enable(thumbnail)

					//加载进度条
					var loadProgress = {
						imageIds: stack.imageIds.slice(0),
						total: stack.imageIds.length,
						remaining: stack.imageIds.length,
						percentLoaded: 0
					}

					// Image loading events are bound to the cornerstone object, not the element
					cornerstone.events.addEventListener(
						'cornerstoneimageloadprogress',
						onImageLoaded
					)

					function onImageLoaded(event) {
						var progressDetail = event.detail
						loadedPercents[stackIndex] = progressDetail.percentComplete + '%'

						$('.loadProgress' + stackIndex).css(
							'width',
							loadedPercents[stackIndex]
						)
						$('.loadProgress' + stackIndex)
							.children()
							.html(loadedPercents[stackIndex])

						if(100 === progressDetail.percentComplete) {
							$('.loadProgress' + stackIndex)
								.parent()
								.fadeOut(6000)
							//                        alert('123')
						}
					}

					// Have cornerstone load the thumbnail image
					cornerstone
						.loadAndCacheImage(
							imageViewer.stacks[stack.seriesIndex].imageIds[0]
						)
						.then(function(image) {
							// Make the first thumbnail active
							if(stack.seriesIndex === 0) {
								$(seriesElement).addClass('active')
							}
							$(thumbnail)
								.find('img')
								.css('display', 'none')
							// Display the image
							cornerstone.displayImage(thumbnail, image)

							$(seriesElement).draggable({
								helper: 'clone'
							})
						})

					// Handle thumbnail click
					$(seriesElement)
						.on('click', function() {
							var activeRoot = selectElement()

							if(!activeRoot || activeRoot.data('isLayout')) {
								return
							}
							if(
								activeRoot.data('viewportIndex') !== undefined ||
								activeRoot.data('viewportIndex') !== null
							) {
								var sericesIndex = activeRoot.data('viewportIndex')
								useItemStack(sericesIndex, stackIndex)
							}
							keepFunction() //保留当前功能
						})
						.data('stack', stackIndex)
				})

				function useItemStack(item, stack) {
					if(!imageViewer.stacks[stack] || !imageViewer.viewports[item]) return

					var imageId = imageViewer.stacks[stack].imageIds[0],
						element = imageViewer.getElement(item)

					if($(element).data('waiting')) {
						imageViewer.viewports[item].find('.overlay-text').remove()
						$(element).data('waiting', false)
					}
					$(element)
						.parents('.imageViewer')
						.data('useStack', stack)

					displayThumbnail(
						seriesList,
						$(seriesList).find('.list-group-item')[stack],
						element,
						imageViewer.stacks[stack],
						function(el, stack) {
							if(!$(el).data('setup')) {
								setupViewport(el, stack, this)
								setupViewportOverlays(el, data)
								//                      el.addEventListener('cornerstonenewimage', onNewImage);
								$(el).data('setup', true)
							}
						}
					)
				}
				// Resize study viewer
				function resizeStudyViewer() {
					var studyRow = $('.studyContainer')[0]
					var height = $(studyRow).height()
					var width = $(studyRow).width()
					$(seriesList).height('100%')
					$(parentDiv).width(width - $('.thumbnailSelector:eq(0)').width() - 2)
					$(parentDiv).css({
						height: '100%'
					})

					

					imageViewer.forEachElement(function(el, vp) {
						if($(el).data('waiting')) {
							var ol = vp.find('.overlay-text')
							if(ol.length < 1) {
								ol = $(
									'<div class="overlay overlay-text">Please click a stack left to view images.</div>'
								).appendTo(vp)
							}
							var ow = vp.width() / 2,
								oh = vp.height() / 2
							ol.css({
								top: oh,
								left: ow - ol.width() / 2
							})
						}
					})

					imageViewer.forEachLayoutElement(function(el, vp, i) {
						if(!$(el).data('display')) {
							var ol = vp.find('.overlay-text')
							if(ol.length < 1) {
								ol = $(
									'<div class="overlay overlay-text">NO IMAGE</div>'
								).appendTo(vp)
							}
							var ow = vp.width() / 2,
								oh = vp.height() / 2
							ol.css({
								top: oh,
								left: ow - ol.width() / 2
							})
						}
					})
				}
				// Call resize viewer on window resize
				$(window).resize(function() {
					forEachViewport(function(element) {
						cornerstone.resize(element, true)
						cornerstone.fitToWindow(element)
					})
					resizeStudyViewer()
				})
				resizeStudyViewer()
			} else if(data.code == 400) {
				alert(data.msg)
			}
		})
		.catch(function(err) {
			console.log(err)
		})

	// Resize main
	function resizeMain() {
		var height = $(window).height()
		$('#main').height(height - 50)
		$('#tabContent').height(height - 50 - 24)
	}

	// Call resize main on window resize
	$(window).resize(function() {
		resizeMain()
	})
	resizeMain()

	// Prevent scrolling on iOS
	document.body.addEventListener('touchmove', function(e) {
		e.preventDefault()
	})
})