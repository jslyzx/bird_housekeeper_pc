function LoadData(id,tableid,layerindex){
layui.use(['laypage', 'layer', 'laytpl', 'jquery', 'htcsLG','htcsradio'], function () {
    var doc = layui.htcsLG;
    var mymod = layui.htcsradio;
    var laytpl = layui.laytpl;
    var $ = layui.jquery;
    var form = layui.form;
    var alldata=[];
    //横向菜单列表;
    doc.objectQuery("api/Enterprise/querycompany", {}, function (result) {   
    var realdata = result.numberData;
    alldata.push(realdata);
    doc.objectQuery("api/bankcard/Query", {  }, function (result) {
    debugger;
    var realdata = result.numberData;
    alldata.push(realdata);
    var getTpl = sysuereditscript.innerHTML,
    view = document.getElementById('addzfb-view');
    laytpl(getTpl).render(alldata, function (html) {
       view.innerHTML = html;
    });  
    form.render('');
    $("#cancelbtn").click(function(){
        debugger;
    layer.close(layerindex);
    return false;
   });
   $("#LAY-user-getsmscode").click(function(){
    mymod.sendyzm(6);
   });
    //监听提交
    form.on('submit(save)', function (data) {
        debugger;
        data.field.type=2;
        var tjdata =data.field;
        var saveoption={
          url:'api/AccountBank/save',
          data:tjdata,
          tableid:tableid,
          callBack:function(resultData){
            debugger;
            if (resultData.Code == 0) {
                layer.close(layerindex);
            }
        }
       }
      doc.Submit(saveoption);
      return false;
});
    debugger;
    });
    
    
     
   }); 
})
}