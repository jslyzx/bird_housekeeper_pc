      LoadData();
      function LoadData(){
        layui.use(['laypage', 'layer', 'htcsLG','laytpl', 'jquery', 'form','user'], function () {
        var laytpl = layui.laytpl;
        var doc = layui.htcsLG;
        var url = "api/Enterprise/querycompany";
        var $ = layui.jquery;
        var form = layui.form;
        var id;
        doc.objectQuery(url, {}, function (data) {
             debugger;
             id=data.numberData.Id;
             var getTpl = sysuereditscript.innerHTML
           , view = document.getElementById('sysuer-edit-view');
             laytpl(getTpl).render(data.numberData, function (html) {
                 view.innerHTML = html;
             }); 
        form.render('');
        doc.objectQuery("api/bankcard/Query", {"PageSize":100000,"PageIndex":1}, function (result) {  
          debugger; 
          var realdata = result.numberData;
          var getTpl = storescript.innerHTML,
          view = document.getElementById('viewstoreid');
          laytpl(getTpl).render(realdata, function (html) {
              view.innerHTML = html;
          }); 
          $("#bank").val(data.numberData.bank);
          form.render('select');
        });
        //监听提交
        form.on('submit(save)', function (data) {
            data.field.Id=id;
            var saveoption={
            url:'api/account/save',
            data:data.field,
            tableid:"",
            callBack:function(){
         
           }
         }
         doc.Submit(saveoption);
      return false;
    });
    });
    });
}   

    
    