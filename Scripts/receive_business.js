

        layui.use(['laypage', 'layer', 'htcsLG','laytpl', 'jquery', 'form'], function () {
        var laytpl = layui.laytpl;
        var doc = layui.htcsLG;
        var url = "api/Enterprise/querycompany";
        var $ = layui.jquery;
        var form = layui.form;
        doc.objectQuery(url, {}, function (data) {
             debugger;
             var getTpl = editzafeiscript.innerHTML
           , view = document.getElementById('edit-zafei-view');
             laytpl(getTpl).render(data.numberData, function (html) {
                 view.innerHTML = html;
             });
             
                 //监听提交
        form.on('submit(save)', function (data) {
         data.field.Id=id;
         var saveoption={
         url:'api/store/save',
         data:data.field,
         tableid:tableid,
         callBack:function(){
            layer.close(layerindex);
       }
     }
     doc.Submit(saveoption);
     return false;
  });
  $("#cancelbtn").click(function(){
    layer.close(layerindex);
   })
  form.render('');
  doc.objectQuery("api/bankcard/Query", {"PageSize":100000,"PageIndex":1}, function (result) {  
    debugger; 
    var realdata = result.numberData;
    var getTpl = storescript.innerHTML,
    view = document.getElementById('viewstoreid');
    laytpl(getTpl).render(realdata, function (html) {
        view.innerHTML = html;
    });  
    $("#storeid").val(storeid);
    form.render('select');
   });
         });
     
 
    });
      
