// debugger;
function LoadData(id,tableid,layerindex){
layui.use(['table', 'htcsradio', 'htcsLG', 'laydate', 'form','laytpl', 'util'], function() {
    var util = layui.util;
    var laytpl = layui.laytpl;
    var $ = layui.$;
    var mymod = layui.htcsradio;
    var nowDate = mymod.getnowdate("yyyy-MM-dd");
    var doc = layui.htcsLG;
    var laydate = layui.laydate;
    var form = layui.form;
    var table = layui.table;
    var url1 ="api/Renovation/Queryid";
    doc.objectQuery(url1, {"Id": id }, function (data) {
        var getTpl = FellowPersonscript.innerHTML
       ,view = document.getElementById('zcontract-add-view');
        laytpl(getTpl).render(data.numberData, function (html) {
            view.innerHTML = html;
        });
        form.render('');   
    });
    var clos=[[ 
        { field: 'Id' , width: 80, title: '编号' }
        , { field: 'process', width: 200, title: '进度' }
        , { field: 'amount', width: 100, title: '预算'}
        , { field: 'time', width: 200, title: '时间'}
        , {width: 100, title: '状态',templet: formastatus,}
        , { field: 'createperson', width: 100, title: '创建人'}
      
        ]];
    var tableoption = {
        domid: "#bill-main-table",
        formid: "#bill-search-form",
        arr: clos,
        height:500,
        url: 'api/Renovationlist/RepairList',
        ismuilti: true,
        "tabfield": "PayStatus",
        tablebtnid: '#billbtnintable',
        "search":{"parentid":id}
    };
    form.render('');
    var BtnOption = {
        area: ['900px', '90%'],
        tableid: "bill-main-table",
        btnview: "bill-button-view",
        tableView: "bill-table-btn",
        toolview: 'Renovationelistview',
        tooladd: "bill-add-btn",
        tooledit: "Renovationelistedit",
        tooldelete: "bill-delete-btn",
        menuid: 223,
        "realtable": "T_BILL",
        btnjishu:2
    };
    doc.InitButton(BtnOption, billbtnscribt, tableoption);
    //监听工具栏按钮
    table.on('tool(demoEvent1)', function(obj) {
        var data = obj.data,
            layEvent = obj.event,
            url = $(this).data('url');
            debugger;
        if (layEvent === 'RenovationeaddRenovationecheck') { //收款
            if(data.Status==3){
                layer.msg("审核成功不需要审核");
                return;
            }
            var editid = "layuibillreceivebtn";
            var view = layui.view;
            layer.open({
                id: editid,
                type: 1,
                title: '审核',
                skin: 'two-layer',
                shadeClose: true, //开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['1000px', '30%'],
                success: function(layero, index) {
                    view(this.id).render(url, {
                        id: data.Id,
                        tableid: "bill-main-table",
                        layerindex: index
                    });
                }
            });
        }
        doc.bindCommonEvents(BtnOption, data, layEvent, url);
    });
  
    $("#Renovationeadd").click(function () {
        debugger;
        var editid="layuizcontracttuizubtn";
        var view = layui.view;
        layer.open({
            id:editid,
            type: 1,
            title: '新增流程',
            skin: 'two-layer',
            shadeClose: true,//开启遮罩关闭
            maxmin: true, //开启最大化最小化按钮
            area: ['1100px', '500px'],
            success: function(layero,index){
                view(this.id).render($("#Renovationeadd").attr("hturl"), {
                    parentid: id,
                    tableid:"bill-main-table",
                    layerindex:index
                });
              }
            }); 
    });
    function formastatus(value) {
        if (value.status == 1) {
            return '<span>' + "未审核" + '</span>'
        } 
        if (value.status == 2) {
            return '<span>' + "审核失败" + '</span>'
        } 
        if (value.status == 3) {
            return '<span>' + "审核成功" + '</span>'
        } 
    }
    
  

  


});
}