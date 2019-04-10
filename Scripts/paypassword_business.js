LoadData();
function LoadData(){
  layui.use(['laypage', 'layer', 'htcsLG','laytpl', 'jquery', 'form'], function () {
  var laytpl = layui.laytpl;
  var doc = layui.htcsLG;
  var url = "api/Enterprise/querycompany";
  var $ = layui.jquery;
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
$("#LAY-user-getsmscode").click(function(){
  mymod.sendyzm(8);
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


