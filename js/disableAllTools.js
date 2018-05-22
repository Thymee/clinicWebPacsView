// Disable all tools
function disableAllTools() {
    forEachViewport(function(element) {
        cornerstoneTools.wwwc.disable(element);
        cornerstoneTools.pan.activate(element, 2); // 2 is middle mouse button
        cornerstoneTools.zoom.activate(element,4); // 4 is right mouse button
        cornerstoneTools.probe.deactivate(element, 1);
        cornerstoneTools.length.deactivate(element, 1);
        cornerstoneTools.simpleAngle.deactivate(element, 1);
        cornerstoneTools.ellipticalRoi.deactivate(element, 1);
        cornerstoneTools.rectangleRoi.deactivate(element, 1);
        cornerstoneTools.stackScroll.deactivate(element, 1);
        cornerstoneTools.magnify.disable(element);
//      cornerstoneTools.referenceLines.tool.disable(element);
        cornerstoneTools.rotate.disable(element);
        cornerstoneTools.stopClip(element);
       
        cornerstoneTools.arrowAnnotate.deactivate(element);
        
//      synchronizer.remove(element);
        // cornerstoneTools.dbrclickZoom.activate(element,4);
//      cornerstoneTools.arrowAnnotateTouch.deactivate(element);
//      cornerstoneTools.magnifyTouchDrag.disable(element);
//      cornerstoneTools.panTouchDrag.deactivate(element);
//      cornerstoneTools.rotateTouchDrag.deactivate(element);
//      cornerstoneTools.rotateTouch.disable(element);
//      cornerstoneTools.ellipticalRoiTouch.deactivate(element);
//      cornerstoneTools.angleTouch.deactivate(element);
//      cornerstoneTools.rectangleRoiTouch.deactivate(element);
//      cornerstoneTools.lengthTouch.deactivate(element);
//      cornerstoneTools.probeTouch.deactivate(element);
//      cornerstoneTools.zoomTouchDrag.deactivate(element);
//      cornerstoneTools.wwwcTouchDrag.deactivate(element);
//      cornerstoneTools.stackScrollTouchDrag.deactivate(element);


//      $(".toolbar-button .tool-play").removeClass("blue").removeClass("play");//播放恢复
    });
}