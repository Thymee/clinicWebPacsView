function setupViewport(element, stack, image) {
  // Display the image on the viewer element
  cornerstone.displayImage(element, image)

  // If it's a movie (has frames), then play the clip
  if (stack.frameRate !== undefined) {
    cornerstone.playClip(element, stack.frameRate)
  }

  // Activate mouse clicks, mouse wheel and touch
  cornerstoneTools.mouseInput.enable(element)
  cornerstoneTools.mouseWheelInput.enable(element)
  //  cornerstoneTools.touchInput.enable(element);

  // Enable all tools we want to use with this element
  cornerstoneTools.wwwc.activate(element, 1) // ww/wc is the default tool for left mouse button
  cornerstoneTools.pan.activate(element, 2) // pan is the default tool for middle mouse button
cornerstoneTools.zoom.activate(element,4) // zoom is the default tool for right mouse button
  cornerstoneTools.probe.enable(element)
  cornerstoneTools.length.enable(element)
  cornerstoneTools.ellipticalRoi.enable(element)
  cornerstoneTools.rectangleRoi.enable(element)
  cornerstoneTools.simpleAngle.enable(element)
  cornerstoneTools.arrowAnnotate.enable(element)
  cornerstoneTools.arrowAnnotateTouch.enable(element)
  //  cornerstoneTools.wwwcTouchDrag.activate(element);
  //  cornerstoneTools.zoomTouchPinch.activate(element);
  cornerstoneTools.magnify.enable(element)
  //  cornerstoneTools.magnifyTouchDrag.enable(element);
  cornerstoneTools.rotate.activate(element)
  //  cornerstoneTools.rotateTouchDrag.activate(element);
  //  cornerstoneTools.panMultiTouch.activate(element);

  // Stack tools
  // if(stack.imageIds.length>1){
  cornerstoneTools.addStackStateManager(element, [
    'playClip',
    'linkedStacks',
    'referenceLiness'
  ])
  cornerstoneTools.addToolState(element, 'stack', stack)
  cornerstoneTools.stackScroll.activate(element, 1)
  cornerstoneTools.stackScrollWheel.activate(element)
  cornerstoneTools.stackPrefetch.enable(element)
  // }
}
