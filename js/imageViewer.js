// var imageViewer = new ImageViewer(studyViewerCopy, studyViewerTemplate);
ImageViewer = function(imageViewer) {
    var self = this;

    // self.root = $(".viewer");
    // self.rootModel= $(".viewer").clone();
    self.stacks = [];
    self.layoutStacks = [];
    self.viewports = [];
    self.viewport = '1x1';  
    self.layouts = []; 
    self.layout = '1x1'; 
    self.layoutRoot=[]; 
//  self.oldActiveRoot={};
    self.viewportModel = imageViewer;

    self.setViewport= function(viewport,imageViewer) {
        self.viewport = viewport;
        // TODO: create viewports
        viewportRowsCols = self.getRowsCols(self.viewport), a = viewportRowsCols[0], b = viewportRowsCols[1], numOfViewports = a * b,
            perWidth = 100 / b, perHeight = 100 / a; 
        self.viewports = [];
        var viewportRoot=$(imageViewer[0]).parent();
        var viewport=viewportRoot.data('viewport');
        
      if(viewport == null || viewport == undefined ||viewport == false) {
			viewportRoot.data('viewport', self.viewport.trim());
//			viewportRoot.html('');
			$(imageViewer).remove()
			self.createViewport(0);
			self.appendElement(viewportRoot, self.viewports);
			return false;
		}    
            
       var oldViewport = viewportRoot.data('viewport');
		
		if(oldViewport){
			oldAB = self.getRowsCols(oldViewport)
			oldNumOfViewports = oldAB[0] * oldAB[1];
		};
		 

        if(numOfViewports == oldNumOfViewports && numOfViewports != 1) { //chendeping 12.27 20:17
			return;
		} 

		if(numOfViewports < oldNumOfViewports) {
			
		
		
			for(var i = 0; i < oldNumOfViewports; i++) {
				
				if(i < numOfViewports){
					$(imageViewer[i]).css({
						width: perWidth + '%',
						height: perHeight + '%'
					}).show();
			
					self.viewports[i] = $(imageViewer[i]);
				}else{
					$(imageViewer[i]).remove(); 
				}
				
			
			}	
			
		}else{
			
			for(var i = 0; i < oldNumOfViewports; i++) {
				$(imageViewer[i]).css({
					width: perWidth + '%',
					height: perHeight + '%'
				}).show();
				
				self.viewports[i] = $(imageViewer[i]);
				
      	
			   
			}
			self.createViewport(oldNumOfViewports);
			self.appendElement(viewportRoot,self.viewports,oldNumOfViewports);
		}	

		viewportRoot.data('viewport', self.viewport.trim());
		







    }

    self.setLayout = function(layout, activeRoot) {

        self.layout = layout;
        // TODO: create viewports
        var layoutRowsCols = self.getRowsCols(self.layout),
            a = layoutRowsCols[0],
            b = layoutRowsCols[1],
            numOfLayouts = a * b,
            perWidth = 100 / b,
            perHeight = 100 / a;
        // $('.viewer').find('.activeViewer').html('');
        // var i = 0;
        self.layouts = [];
     
		var oldLayout = activeRoot.data('layout');
		
		if(oldLayout) {oldAB = self.getRowsCols(oldLayout);oldNumOfLayouts = oldAB[0] * oldAB[1]};
		
		
		if(activeRoot.data('isLayout')){layoutGrid();}else{
			if(numOfLayouts==1){
        		return;
        	}
			
			self.layoutRoot[activeRoot.data('useStack')] = activeRoot.find('.viewportWrapper');
			activeRoot.data('layout', self.layout.trim());
			activeRoot.data('isLayout',true);
			activeRoot.html('');
			createLayout(0)
			self.appendElement(activeRoot, self.layouts);
		};
		
//		self.oldActiveRoot=activeRoot;
		
		function layoutGrid() {
			if(numOfLayouts !== 1) {
				if(numOfLayouts == oldNumOfLayouts) return;
		
				if(numOfLayouts < oldNumOfLayouts) {
					for(var i = 0; i < oldNumOfLayouts; i++) {
		
						if(i < numOfLayouts) {
							$(activeRoot.find('.viewportWrapper')[i]).css({
								width: perWidth + '%',
								height: perHeight + '%'
							});
		
							self.layouts[i] = $(activeRoot.find('.viewportWrapper')[i]);
							self.layoutStacks[i].layout=numOfLayouts;
							self.layoutStacks[i].layoutRowsCols = layoutRowsCols;
						} else {
							$(activeRoot.find('.viewportWrapper')[numOfLayouts]).remove();
							if(self.layoutStacks[numOfLayouts]){
								 self.layoutStacks.splice(-1,1);
							}
						}
		
					}
		
				} else {
		
					for(var i = 0; i < oldNumOfLayouts; i++) {
						$(activeRoot.find('.viewportWrapper')[i]).css({
							width: perWidth + '%',
							height: perHeight + '%'
						}).show();
		
						self.layouts[i] = $(activeRoot.find('.viewportWrapper')[i]);
						self.layoutStacks[i].layout=numOfLayouts;
						self.layoutStacks[i].layoutRowsCols = layoutRowsCols;
					}
					createLayout(oldNumOfLayouts);
					self.appendElement(activeRoot, self.layouts, oldNumOfLayouts);
				}
		
				activeRoot.data('layout', self.layout.trim());
		
			} else {
		
				activeRoot.html('');
				self.layoutRoot[activeRoot.data('useStack')].css({
					width: perWidth + '%',
					height: perHeight + '%'
				}).show().appendTo(activeRoot);
				activeRoot.data('isLayout', false).data('layout', '');
		
			}
		}
		
		
		function createLayout(i) {
//			self.layoutStacks = [];
			var useStack=activeRoot.data('useStack');
			if(useStack!==undefined||useStack!==null){
				viewerStack = self.stacks[useStack];
			}
			
			
	    	while (i < numOfLayouts) {
	
	            var elem = self.viewportModel.find('.viewportWrapper').clone().css({
	                width: perWidth + '%',
	                height: perHeight + '%'
	            });
	            elem.find('.viewport').data('imageIndex', i).data('display', false).addClass('viewport'+i);
	            elem.parent().data('isLayout', true);
	
	            self.layouts.push(elem);
	            
	            var layoutStack = {'currentImageIdIndex':viewerStack.currentImageIdIndex,
								'currentLayoutImageIdIndex':i,
								'frameRate':viewerStack.frameRate,
								'imageIds':viewerStack.imageIds,
								'layout':numOfLayouts,
								'layoutIndex':i,
								'layoutRowsCols':layoutRowsCols,
								'seriesDescription':viewerStack.seriesDescription,
								'seriesId':viewerStack.seriesId,
								'seriesIndex':viewerStack.seriesIndex,
								'stackId':viewerStack.stackId
							}
							self.layoutStacks.push(layoutStack)
	           
	            i++;
	        };  
	    }


    }
    self.getRowsCols = function(grid) {
        var s = grid.split(/x/);
        return [parseInt(s[0]), parseInt(s[1])];
    }
	self.createViewport = function (i){
		while(i < numOfViewports) {
		
			var elem = self.viewportModel.clone().css({
				width: perWidth + '%',
				height: perHeight + '%'
			}).data('viewportIndex', i).data('selected', false).data('isLayout', false).addClass('imageViewer' + i);
			elem.find('.viewport').data('waiting', true).addClass('viewport' + i);
		
			self.viewports.push(elem);
      
			i++;
		
		}
    }
	
	self.appendElement=function(root,item,num){
		var j = num == undefined ? 0 : num;
		
		while(j < item.length) {
		
			var elem = item[j].show().appendTo(root);
		
			j++;
		
		}
		
	}
    self.isSingle = function() {
        return self.layout == '1x1';
    }
    self.isLayoutSingle = function() {
        return self.layout == '1x1';
    }

    self.getElement = function(item) { 
        return self.viewports[item].find('.viewport')[0];
    }
    self.getLayoutElement = function(item) {
        return self.layouts[item].find('.viewport')[0];
    }

    self.forEachElement = function(cb) {
        self.viewports.forEach(function(vp, i) {
            cb.call(self, vp.find('.viewport')[0], vp, i);
        });
    }
    self.forEachLayoutElement = function(cb) {
        self.layouts.forEach(function(vp, i) {
          
            cb.call(self, vp.find('.viewport')[0], vp, i);
        });
    }
}