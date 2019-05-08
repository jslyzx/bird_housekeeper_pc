layui.use(['laypage', 'layer', 'laytpl', 'jquery', 'htcsLG'], function () {
    var doc = layui.htcsLG;
    var laytpl = layui.laytpl;
    //横向菜单列表;
    doc.objectQuery("api/Menu/hQuerylist", {Id:layui.data('layuiAdmin').userid}, function (result) {   
    var realdata = result.numberData;
    var getTpl = storescript.innerHTML,
    view = document.getElementById('sysuer-edit-view');
    laytpl(getTpl).render(realdata, function (html) {
       view.innerHTML = html;
    });  
   }); 
})
   
   
