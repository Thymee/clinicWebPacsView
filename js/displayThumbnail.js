function displayThumbnail(seriesList, seriesElement, element, stack, loaded) {
    // Deactivate other thumbnails
    $(seriesList).find('a').each(function() {
        $(this).removeClass('active');
    });

    // Make this series visible

	
    // Make the selected thumbnail active
    $(seriesElement).addClass('active');

    var enabledImage = cornerstone.getEnabledElement(element);
    if (enabledImage.image) {
        // Stop clip from if playing on element
        cornerstoneTools.stopClip(element);
        // Disable stack scrolling
        cornerstoneTools.stackScroll.disable(element);
        // Enable stackScroll on selected series
        cornerstoneTools.stackScroll.enable(element);
        
        var configuration = {
        testPointers: function(eventData) {
            return (eventData.numPointers >= 3);
        	}
    	};
    	cornerstoneTools.panMultiTouch.setConfiguration(configuration);
               
    }





 

////获取工具状态管理   一键还原使用
// toolStateManager = cornerstoneTools.getElementToolStateManager(element);


// $('.tool-restore').on('click touchstart', function () {
//      disableAllTools();
//      
//      	
//			alert('3232')
//         
////         
//          toolStateManager.clear(element)
////          
//          cornerstone.updateImage(element);
////                  var image = cornerstone.getImage(element);
////		var defaultView=cornerstone.getDefaultViewportForImage(element, image);
////
////       cornerstone.setViewport(element, defaultView);
//       
//       
//       
//        
//        
//     
//  });

    
    

   
    // Load the first image of the selected series stack
    cornerstone.loadAndCacheImage(stack.imageIds[0]).then(function(image) {
    	
        if (loaded) {
            loaded.call(image, element, stack);
        }
//		console.log(image)
//		console.log(image.data.string("x00100010"))
		if(image.data.string("x00080060")!=='CT' ||image.data.string("x00080060")!=='MR'){
			$(".toolbar").find('.tool-adjustment-bone').parent().css("display","none");
			$(".toolbar").find('.tool-adjustment-thoracic').parent().css("display","none");
			$(".toolbar").find('.tool-adjustment-lung').parent().css("display","none");
			$(".toolbar").find('.tool-adjustment-softTissue').parent().css("display","none");
			
		}
		
	    $('.viewport .loading').css('display','none');
        // Get the state of the stack tool
        var stackState = cornerstoneTools.getToolState(element, 'stack');
        if(stackState){
        stackState.data[0] = stack;
        stackState.data[0].currentImageIdIndex = 0;


         // Prefetch the remaining images in the stack (?)
         cornerstoneTools.stackPrefetch.enable(element);
        }
        // Get the default viewport
        var defViewport = cornerstone.getDefaultViewport(element, image);
        // Get the current series stack index
        // Display the image
        cornerstone.displayImage(element, image, defViewport);
        // Fit the image to the viewport window
        cornerstone.fitToWindow(element);

       

        // Play clip if stack is a movie (has framerate)
        if (stack.frameRate !== undefined) {
            cornerstoneTools.playClip(element, stack.frameRate);
        }
		

		  
       
    });



////获取工具状态管理   一键还原使用
// toolStateManager = cornerstoneTools.getElementToolStateManager(enabledImage);

    // return deferred;

};	