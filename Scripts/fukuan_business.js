function LoadData(id,tableid,layerindex){
    layui.use(['laydate', 'laypage', 'htcsLG','layer', 'laytpl', 'jquery', 'form','element'], function () {
    var laytpl = layui.laytpl;
    var doc = layui.htcsLG;
    var url = "api/Bill/Querybillbyid";
    var $ = layui.jquery;
    var element = layui.element;
    var form = layui.form;
    var alldata=[];
    var url1 ="api/BaseData/Queryfgy";
    doc.objectQuery(url1, {  }, function (data) {
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
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#PayTime' //指定元素
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
         url:'api/Bill/receive',
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
    
     