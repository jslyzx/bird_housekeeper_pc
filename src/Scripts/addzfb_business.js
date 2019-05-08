function LoadData(id,tableid,layerindex){
layui.use(['laypage', 'layer', 'laytpl', 'jquery', 'htcsLG','htcsradio'], function () {
    var doc = layui.htcsLG;
    var laytpl = layui.laytpl;
    var $ = layui.jquery;
    var form = layui.form;
    var mymod = layui.htcsradio;
    //横向菜单列表;
    doc.objectQuery("api/Enterprise/querycompany", {}, function (result) {   
    var realdata = result.numberData;
    var getTpl = sysuereditscript.innerHTML,
    view = document.getElementById('addzfb-view');
    laytpl(getTpl).render(realdata, function (html) {
       view.innerHTML = html;
    });  
    $("#LAY-user-getsmscode").click(function(){
        mymod.sendyzm(6);
       });
    $("#cancelbtn").click(function(){
        debugger;
    layer.close(layerindex);
    return false;
   });
      //监听提交
      form.on('submit(save)', function (data) {
        debugger;
        data.field.type=1;
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
   }); 
})
}