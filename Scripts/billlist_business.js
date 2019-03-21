function LoadData(id,tableid,layerindex){
    layui.use(['laydate', 'laypage', 'htcsLG','layer', 'laytpl', 'jquery', 'form'], function () {
    var laytpl = layui.laytpl;
    var doc = layui.htcsLG;
    var url = "api/Bill/Querybillbyid";
    var $ = layui.jquery;
    
    var form = layui.form;
    var url1 ="api/BaseData/Queryfgy";
    var alldata=[];
    doc.objectQuery(url1, {  }, function (data) {
        debugger;
        alldata.push(data.numberData);
        doc.objectQuery(url, { "Id": id }, function (data) {
            alldata.push(data.numberData);
            var getTpl = billreceivescript.innerHTML
       , view = document.getElementById('bill-receive-view');
            laytpl(getTpl).render(alldata, function (html) {
                view.innerHTML = html;
            });
            $("#cancelbtn").click(function(){
                layer.close(layerindex);
                return false;
             });
             $("#addimage").click(function () {
                debugger;
             var addid="layui-contract-addzjimage";
             var view = layui.view;
             indexclose=layer.open({
                id:addid,
                type: 1,
                title: '上传文件',
                skin: 'two-layer',
                //anim: 4,
                shadeClose: true,//开启遮罩关闭
                //shade: ['0.5'],
                maxmin: true, //开启最大化最小化按钮
                area:['800px', '500px'],
                success: function(layero,index){
                    view(this.id).render('upload/index', {
                        img:$("#Image").val(),
                        type:1,
                        layerindex:index
                    });
                  }
            });  
           });
            var laydate = layui.laydate;
            var myDate = new Date();
            //执行一个laydate实例
            laydate.render({
                elem: '#PayTime' //指定元素
                ,value: myDate
            });
            form.render('');
            var url="api/Bill/billlist";
            var clos=[[ //表头
                   { type: 'numbers' , width: 80, title: '编号', }
                   , { field: 'BillType', width: 100, title: '费用类型' }
                   , { field: 'Amount', width: 80, title: '金额' }
                   , { width: 80, title: '已收', field: 'ReciveAmount' }
                  , { width: 80, title: '待收', field: 'RecivedAmount' }
                   ]];
        var idopt={"BillId":id};
        var options={"id":id,"idopt":idopt, "url":url,"tableid":"#billlist-receive-table","clos":clos};
        doc.childtable(options);
        });
     });
 
    
   
    //监听提交
    form.on('submit(save)', function (data) {
        debugger;
        data.field.Id=id;
         var saveoption={
         url:'api/Bill/receivebill',
         data:data.field,
         tableid:tableid,
         callBack:function(resultData){
            if (resultData.Code == 0) {
                layer.close(layerindex);
        }
       }
     }
     doc.Submit(saveoption);
     return false;
 });
    function formatterstatus(value) {
        if (value == 1) {
            return '<div><span style="padding:10px;background-color:#1bb974;color:#ffffff;border-radius:5px;">在租中</span></div>'
        } else {
            return '<div><span style="padding:10px;background-color:#ff4b5e;color:#ffffff;border-radius:5px;">已预订</span></div>';
        }
        
    }
  
    function formattertime(value) {
     
        return '<div>' + value.BeginTime + "→" + value.EndTime + '</div>';
    }
  
});
}
    
function complteimg(name,type, number){
    debugger;
    layui.use(['jquery'], function () {
        var $ = layui.jquery;
        if(type==1){
         $("#Image").val(name);
         $("#imgnumber").html(number);
        }
        if(type==2){
         $("#zjImage").val(name);
         $("#imgzjnumber").html(number);
        }
    })
  }