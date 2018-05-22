//layoutStackScrollWheel函数
(function($, cornerstone, cornerstoneTools) {
	'use strict';

	const toolType = 'layoutStackScroll';
	const toolTypeTouchDrag = 'layoutStackScrollTouchDrag';
	
	
	function mouseUpCallback(e) {
		const eventData = e.detail;
		const element = eventData.element;
	
		element.removeEventListener('cornerstonetoolsmousedrag', dragCallback);
		element.removeEventListener('cornerstonetoolsmouseup', mouseUpCallback);
		element.removeEventListener('cornerstonetoolsmouseclick', mouseUpCallback);
	}
	function mouseDownCallback(e) {
		const eventData = e.detail;
		const element = eventData.element;
		const options = cornerstoneTools.getToolOptions(toolType, element);

		if(cornerstoneTools.isMouseButtonEnabled(eventData.which, options.mouseButtonMask)) {
			options.deltaY = 0;

			cornerstoneTools.setToolOptions(toolType, element, options);
		
			element.addEventListener('cornerstonetoolsmousedrag', dragCallback);
			element.addEventListener('cornerstonetoolsmouseup', mouseUpCallback);
			element.addEventListener('cornerstonetoolsmouseclick', mouseUpCallback);
			e.stopImmediatePropagation();

			return false;
		}
	}

	function mouseWheelCallback(e) {
		const eventData = e.detail;
		const images = -eventData.direction;

		const config = cornerstoneTools.layoutStackScroll.getConfiguration();

		let loop = false;

		if(config && config.loop) {
			loop = config.loop;
		}

		layoutScroll(eventData.element, images, loop);
	}

	function dragCallback(e) {
		const eventData = e.detail;
		const element = eventData.element;

		const toolData = cornerstoneTools.getToolState(element, 'stack');

		if(!toolData || !toolData.data || !toolData.data.length) {
			return;
		}

		const stackData = toolData.data[0];

		const config = cornerstoneTools.layoutStackScroll.getConfiguration();

		// The Math.max here makes it easier to mouseDrag-scroll small or really large image stacks
		let pixelsPerImage = Math.max(2, element.offsetHeight / Math.max(stackData.imageIds.length, 8));

		if(config && config.stackScrollSpeed) {
			pixelsPerImage = config.stackScrollSpeed;
		}

		const options = cornerstoneTools.getToolOptions(toolType, element);
		let deltaY = options.deltaY || 0;

		deltaY += eventData.deltaPoints.page.y;

		if(Math.abs(deltaY) >= pixelsPerImage) {
			const imageIdIndexOffset = Math.round(deltaY / pixelsPerImage);

			layoutScroll(element, imageIdIndexOffset);

			options.deltaY = deltaY % pixelsPerImage;
		} else {
			options.deltaY = deltaY;
		}

		cornerstoneTools.setToolOptions(toolType, element, options);

		e.preventDefault();
		e.stopPropagation();
	}

	function layoutScroll(element, images, loop = false) {

		const toolData = cornerstoneTools.getToolState(element, 'stack');
		
		if(!toolData || !toolData.data || !toolData.data.length) {
			return;
		}
		
		const stackData = toolData.data[0];
		let newImageIdIndex;
		
		
		if((images < 0 && stackData.currentLayoutImageIdIndex === stackData.layoutIndex )||(stackData.imageIds.length < stackData.layout)
		||(images > 0 && stackData.currentLayoutImageIdIndex === (stackData.imageIds.length+stackData.layoutIndex-stackData.layout))) {
			newImageIdIndex = stackData.currentLayoutImageIdIndex;
		} else {
			newImageIdIndex = stackData.currentLayoutImageIdIndex + images;
		}
		
		if(loop) {
			const nbImages = stackData.imageIds.length;
		
			newImageIdIndex %= nbImages;
		} else {
			newImageIdIndex = Math.min(stackData.imageIds.length - 1, newImageIdIndex);
			newImageIdIndex = Math.max(0, newImageIdIndex);
		}

		layoutScrollToIndex(element, newImageIdIndex);
	}

	function layoutScrollToIndex(element, newImageIdIndex) {
		const toolData = cornerstoneTools.getToolState(element, 'stack');

		if(!toolData || !toolData.data || !toolData.data.length) {
			return;
		}

		// If we have more than one stack, check if we have a stack renderer defined
		let stackRenderer;

		if(toolData.data.length > 1) {
			const stackRendererData = cornerstoneTools.getToolState(element, 'stackRenderer');

			if(stackRendererData && stackRendererData.data && stackRendererData.data.length) {
				stackRenderer = stackRendererData.data[0];
			}
		}

		const stackData = toolData.data[0];
		
		// Allow for negative indexing
		if(newImageIdIndex < 0) {
			newImageIdIndex += stackData.imageIds.length;
		}

		const startLoadingHandler = cornerstoneTools.loadHandlerManager.getStartLoadHandler();
		const endLoadingHandler = cornerstoneTools.loadHandlerManager.getEndLoadHandler();
		const errorLoadingHandler = cornerstoneTools.loadHandlerManager.getErrorLoadingHandler();
//		var stackscrollSynchronizer = new cornerstoneTools.Synchronizer("cornerstonestackscroll", cornerstoneTools.layoutStackScrollSynchronizer);

		function doneCallback(image) {
//			alert('123')
			if(stackData.currentLayoutImageIdIndex !== newImageIdIndex) {
				return;
			}

			// Check if the element is still enabled in Cornerstone,
			// If an error is thrown, stop here.
			try {
				// TODO: Add 'isElementEnabled' to Cornerstone?
				cornerstone.getEnabledElement(element);
			} catch(error) {
				return;
			}

			if(stackRenderer) {
				stackRenderer.currentLayoutImageIdIndex = newImageIdIndex;
				stackRenderer.render(element, toolData.data);
			} else {
				cornerstone.displayImage(element, image);
			}

			if(endLoadingHandler) {
				endLoadingHandler(element, image);
			}

		}

		function failCallback(error) {
			const imageId = stackData.imageIds[newImageIdIndex];

			if(errorLoadingHandler) {
				errorLoadingHandler(element, imageId, error);
			}
		}

		if(newImageIdIndex === stackData.currentLayoutImageIdIndex) {
			return;
		}

		if(startLoadingHandler) {
			startLoadingHandler(element);
		}
		
//		alert($(element).data('imageIndex'))
		
		
		
		const eventData = {
			newImageIdIndex: newImageIdIndex,
			direction: newImageIdIndex - stackData.currentLayoutImageIdIndex
		};

		
//		var newLayoutIndex=layoutIndex + eventData.direction;
		
//		if(newImageIdIndex>stackData.imageIds.length - 1){
//			newLayoutIndex=stackData.imageIds.length - 1;
//		}
//		if(newLayoutIndex<0){
//			newLayoutIndex=0;
//		}
//		$(element).data('layoutIndex',newImageIdIndex);
		stackData.currentLayoutImageIdIndex = newImageIdIndex;
// 		newImageIdIndex = Math.min(Math.max(newImageIdIndex, 0), stackData.imageIds.length - 1);
		const newImageId = stackData.imageIds[newImageIdIndex];
		
//		$('.viewport').each(function(index, element) {
//
//			stackscrollSynchronizer.remove(element);
//		})
		
		
		const allViewport = document.querySelectorAll('.viewport');
		const layoutViewport=element.parentNode.parentNode.querySelectorAll('.viewport');
		for(let i=0;i < allViewport.length;i++) {
			stackscrollSynchronizer.remove(allViewport[i]);
			
		}
		for(let i=0;i < layoutViewport.length; i++) {
			stackscrollSynchronizer.add(layoutViewport[i]);
		}
		
		
		// Retry image loading in cases where previous image promise
		// Was rejected, if the option is set
		/*

		  Const config = stackScroll.getConfiguration();

		  TODO: Revisit this. It appears that Core's imageCache is not
		  keeping rejected promises anywhere, so we have no way to know
		  if something was previously rejected.

		  if (config && config.retryLoadOnScroll === true) {
		  }
		*/

		// Convert the preventCache value in stack data to a boolean
		const preventCache = Boolean(stackData.preventCache);

		let imagePromise;

		if(preventCache) {
			imagePromise = cornerstone.loadImage(newImageId);
		} else {
			imagePromise = cornerstone.loadAndCacheImage(newImageId);
		}

		imagePromise.then(doneCallback, failCallback);
		// Make sure we kick off any changed download request pools
		cornerstoneTools.requestPoolManager.startGrabbing();

		triggerEvent(element, 'cornerstonestackscroll', eventData);

		function triggerEvent(el, type, detail = null) {
			let event;

			// This check is needed to polyfill CustomEvent on IE11-
			if(typeof window.CustomEvent === 'function') {
				event = new CustomEvent(type, {
					detail,
					cancelable: true
				});
			} else {
				event = document.createEvent('CustomEvent');
				event.initCustomEvent(type, true, true, detail);
			}

			return el.dispatchEvent(event);
		}

	};

	//var stackscrollSynchronizer = new cornerstoneTools.Synchronizer("cornerstonestackscroll", cornerstoneTools.layoutStackScrollSynchronizer);

	// Module/private exports
	cornerstoneTools.layoutStackScroll = cornerstoneTools.simpleMouseButtonTool(mouseDownCallback, toolType);
	cornerstoneTools.layoutStackScrollWheel = cornerstoneTools.mouseWheelTool(mouseWheelCallback);

	const options = {
		eventData: {
			deltaY: 0
		}
	};
	cornerstoneTools.layoutStackScrollTouchDrag = cornerstoneTools.touchDragTool(dragCallback, toolType, options);

	function multiTouchDragCallback(e) {
		const eventData = e.detail;
		const config = cornerstoneTools.stackScrollMultiTouch.getConfiguration();

		if(config && config.testPointers(eventData)) {
			dragCallback(e);
		}
	}

	const configuration = {
		testPointers(eventData) {
			return(eventData.numPointers >= 3);
		}
	};

	cornerstoneTools.layoutStackScrollMultiTouch = cornerstoneTools.multiTouchDragTool(multiTouchDragCallback, options);
	cornerstoneTools.layoutStackScrollMultiTouch.setConfiguration(configuration);

})($, cornerstone, cornerstoneTools);