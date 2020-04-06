({
    Init : function(component, event, helper) {
        helper.doInit(component, event, helper);
    },
    erase:function(component, event, helper){
        helper.eraseHelper(component, event, helper);
    },
    edit:function(component, event, helper){
        component.set('v.view', false);
        document.getElementById('edit').style.display = "block";
        component.set('v.moveCount', 0);
        var canvas=component.find('can').getElement();
            var ctx = canvas.getContext("2d");
            var w = canvas.width;
            var h = canvas.height;
            ctx.clearRect(0, 0, w, h);
    },
    close:function(component, event, helper){
        component.set('v.view', true);
        document.getElementById('edit').style.display = "none";
    },
    saved:function(component, event, helper){
        helper.saveHelper(component, event, helper);
    },
       openModel: function(component, event, helper) {
      component.set("v.isOpen", true);
   },
 
   closeModel: function(component, event, helper) {
      component.set("v.isOpen", false);
   },
})