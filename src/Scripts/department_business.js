
layui.use(['laypage','layer', 'htcsradio', 'laytpl', 'jquery', 'form', 'htcsLG'], function () {
    var laypage = layui.laypage
    , layer = layui.layer;
    var laytpl = layui.laytpl;
    var $ = layui.$;
    var doc = layui.htcsLG;
    var table = layui.table;
    var namearr = [[ //表头
        { type: 'checkbox'}
      , { field: 'Id', width: 100, title: '编号' }
      , { field: 'Mobile', width: 180, title: '部门名称' }
      , { field: 'RealName', width: 180, title: '真实姓名' }
      , { field: 'Password', width: 200, title: '密码'}
     
]];
        var tableoption = {
            domid: "#department-table", formid: "#zdepartment-search-form", arr: namearr, url: 'api/Department/Querylist',
            ismuilti: true
          
        };
        var BtnOption = {
            area: ['990px', '90%'],
            tableid: "department-table",
            ismuilti:true,
            btnview: "department-button-view",
            toolview: "zdepartment-edit-bt",
            tooladd: "zdepartment-add-bt",
            tooledit: "editdepart",
            tooldelete: "zdepartment-delete-bt",
            menuid: 247,
            "realtable": "T_DEPARTMENT"
        };
        doc.InitButton(BtnOption, deparmentbtnscribt, tableoption);
        //监听工具栏按钮
       table.on('tool(demoEvent)', function(obj) {
        var data = obj.data,
        layEvent = obj.event,
        url = $(this).data('url');
        if(layEvent=="zsysuser-zhuanyi-bt"){
            var editid = "layuibillreceivebtn";
            var view = layui.view;
            layer.open({
                id: editid,
                type: 1,
                title: '转移房源',
                skin: 'two-layer',
                shadeClose: true, //开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['1000px', '90%'],
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
        $("#isnotactive").click(function () {
            debugger;
            var url = "/api/Procedure/CmdProce";
            doc.cmdpure(url, "sp_peibei_trante0");
        });
        $("#search").click(function () {
            debugger;
            $('#table').bootstrapTable("refresh");
        });
        
});   
function reflash() {
    debugger;
    layui.use(['table'], function () {
        var table = layui.table;
        table.reload("sysrole-index-table");   
    });
}   