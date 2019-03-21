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
 
  //监听提交
  form.on('submit(save)', function (data) {
    debugger;
    if(data.field.password !== data.field.repass){
      layer.msg('两次密码输入不一致');
      return false;

    }
      var saveoption={
      url:'api/pay/setpassword',
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


