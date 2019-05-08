LoadData();
function LoadData(){
  layui.use(['laypage', 'layer', 'htcsLG','laytpl', 'jquery', 'form'], function () {
  var laytpl = layui.laytpl;
  var doc = layui.htcsLG;
  var url = "api/Sysuser/appQueryUser";
  var $ = layui.jquery;
  var mymod = layui.htcsradio;
  var form = layui.form,setter = layui.setter ,admin = layui.admin;
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
    var field = data.field;
    field.password = hex_md5(field.password).toUpperCase();
    var saveoption={
      url:'api/Sysuser/Retrieve',
      data:data.field,
      tableid:"",
      callBack:function(){
   
     }
   }
   doc.Submit(saveoption);
   return false;
});
$("#LAY-user-getsmscode").click(function(){
  debugger;
  mymod.sendyzm(3);
 });
function cmdsend(type){
  var $phone = $('#LAY-user-login-cellphone')
  ,phone = $phone.val();
  var subdata = {"Phone": phone,"Type":type};
  if(!/^1\d{10}$/.test(phone)){
    $phone.focus();
    return layer.msg('请先输入正确的手机号');
  }
  

  var baseurl = setter.baseurl;
  //请求发送短信的接口
  admin.req({
    url: baseurl+'api/SysUser/Sendyzm' //实际使用请改成服务端真实接口
    ,type: "POST"
    ,
     dataType: 'json'
    ,data: subdata
    ,done: function(res){        
      layer.msg('验证码已成功发送至您的手机', {
        offset: '15px'
        ,icon: 1
        ,time: 3000
      });
    }
  });
}
});
});
}   


