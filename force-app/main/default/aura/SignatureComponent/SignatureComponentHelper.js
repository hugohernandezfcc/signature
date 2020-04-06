({
    doInit : function(component, event, helper) {
        component.set('v.moveCount', 0);
        var action = component.get("c.InitSignature");
		console.log(component.get('v.IdRec'));
        console.log(component.get('v.recordId'));
        action.setParams({
            recordId : component.get('v.recordId')
        });

        action.setCallback(this,function(res){
            var state = res.getState();
            if(state == "SUCCESS"){
                var hostname = window.location.hostname;
                 var urlString = window.location.href;
                 var baseURL = urlString.substring(0, urlString.indexOf("/s/"));
                                console.log(res.getReturnValue());
                component.set('v.baseurl', baseURL + '/servlet/servlet.FileDownload?file=');   
                component.set('v.signature', res.getReturnValue());  
                component.set('v.view', true);
				document.getElementById('edit').style.display = "none";
            }else{
                component.set('v.view', false);
                document.getElementById('edit').style.display = "block";
            }
        });      
        
        $A.enqueueAction(action);
        
            var canvas, ctx, flag = false,
            prevX = 0,
            currX = 0,
            prevY = 0,
            currY = 0,
            dot_flag = false;
       
        var x = "black",
            y = 2,
            w,h;
        canvas=component.find('can').getElement();
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        w = canvas.width*ratio;
        h = canvas.height*ratio;
        ctx = canvas.getContext("2d");
        console.log('ctx:='+ctx);
       
        canvas.addEventListener("mousemove", function (e) {
            findxy('move', e)
        }, false);
        canvas.addEventListener("mousedown", function (e) {
            findxy('down', e)
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            findxy('up', e)
        }, false);
        canvas.addEventListener("mouseout", function (e) {
            findxy('out', e)
        }, false);
        // Set up touch events for mobile, etc
        canvas.addEventListener("touchstart", function (e) {
            var touch = e.touches[0];
            console.log('touch start:='+touch);
            var mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
             e.preventDefault();
        }, false);
        canvas.addEventListener("touchend", function (e) {
            var mouseEvent = new MouseEvent("mouseup", {});
            canvas.dispatchEvent(mouseEvent);
        }, false);
        canvas.addEventListener("touchmove", function (e) {
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
             e.preventDefault();
           
        }, false);
       
        // Get the position of a touch relative to the canvas
        function getTouchPos(canvasDom, touchEvent) {
            var rect = canvasDom.getBoundingClientRect();
            return {
                x: touchEvent.touches[0].clientX - rect.left,
                y: touchEvent.touches[0].clientY - rect.top
            };
        }
       
        function findxy(res, e){
            const rect = canvas.getBoundingClientRect();
            if (res == 'down') {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - rect.left ;
                currY = e.clientY -  rect.top;
               
                flag = true;
                dot_flag = true;
                if (dot_flag) {
                    ctx.beginPath();
                    ctx.fillStyle = x;
                    ctx.fillRect(currX, currY, 2, 2);
                    ctx.closePath();
                    dot_flag = false;
                }
            }
            if (res == 'up' || res == "out") {
                flag = false;
            }
            if (res == 'move') {
                if (flag) {
                    prevX = currX;
                    prevY = currY;
                    currX = e.clientX -  rect.left;
                    currY = e.clientY - rect.top;
                    draw(component,ctx);
                    
                }
            }
        }
        function draw() {
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currX, currY);
            ctx.strokeStyle = x;
            ctx.lineWidth = y;
            ctx.stroke();
            ctx.closePath();
            component.set('v.moveCount', 1);
       		console.log('a move move ');
        }
       
    },

    eraseHelper: function(component, event, helper){
            var canvas=component.find('can').getElement();
            var ctx = canvas.getContext("2d");
            var w = canvas.width;
            var h = canvas.height;
            ctx.clearRect(0, 0, w, h);
        component.set('v.moveCount', 0);
    },
    
    saveHelper:function(component, event, helper){
       var c = component.get('v.moveCount');
       
        if(c == 1){
        console.log('move '+ c);
        var pad=component.find('can').getElement();
        var dataUrl = pad.toDataURL();
        console.log('dataUrl:='+ dataUrl);
        var strDataURI=dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
        var action = component.get("c.saveSignature");
        action.setParams({
            signatureBody : strDataURI,
            recordId : component.get('v.recordId')
        });

        action.setCallback(this,function(res){
            var state = res.getState();
            if(state==="SUCCESS"){
            	var showToast = $A.get("e.force:showToast"); 
                    showToast.setParams({ 
                    'duration' : 1000, 
                    'type' : 'success',   
                    'title' : 'Success', 
                    'message' : 'Signature saved correctly' 
                    }); 
                    showToast.fire(); 
                helper.doInit(component, event, helper);
            }
        });       
        $A.enqueueAction(action);
        }
        else{
            console.log('not move '+ c);
            var showToast = $A.get("e.force:showToast"); 
                showToast.setParams({ 
                'duration' : 5000, 
                'type' : 'error',   
                'title' : 'Error', 
                'message' : 'Signature is blank' 
                }); 
                showToast.fire(); 
        }
    }
})