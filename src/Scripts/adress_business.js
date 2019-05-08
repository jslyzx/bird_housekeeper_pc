
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
      , { field: 'CityName', width: 180, title: '所属区' }
      , { field: 'Name', width: 180, title: '名称' }
      , { width: 180, title:'类别',templet: formastatus}
      ]];
        var tableoption = {
            domid: "#sysuser-table", formid: "#zsysuser-search-form", arr: namearr, url: 'api/cellname/Querylist',
            ismuilti: true, "tabfield": "regtype",
        };
        var BtnOption = {
            area: ['50%', '50%'],
            tableid: "sysuser-table",
            ismuilti:true,
            btnview: "sysuser-button-view",
            tooladd: "addstore",
            tooledit: "",
            tooldelete: "deletestore",
            toolview: "viewstore",
            menuid:232,
            "realtable": "T_CELLNAME"
        };
        doc.InitButton(BtnOption, sysuerbtnscribt, tableoption);
        //监听工具栏按钮
       table.on('tool(demoEvent)', function(obj) {
        var data = obj.data,
        layEvent = obj.event,
        url = $(this).data('url');
        if (layEvent === 'editstore') { //编辑
            if(data.regtype==4){
                url="msystem/adress/edit";
            }
            if(data.regtype==5){
                url="msystem/adress/areaedit";
            }
            var editid = "layuibillreceivebtn";
            var view = layui.view;
            layer.open({
                id: editid,
                type: 1,
                title: '编辑',
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
       $("#addarea").click(function(){
        var editid = "layuibillreceivebtn";
        var view = layui.view;
        layer.open({
            id: editid,
            type: 1,
            title: "新增大区",
            skin: 'two-layer',
            shadeClose: true, //开启遮罩关闭
            maxmin: true, //开启最大化最小化按钮
            area: ['50%', '50%'],
            success: function(layero, index) {
                view(this.id).render('msystem/adress/addarea', {
                    id: 0,
                    tableid: "sysuser-table",
                    layerindex: index
                });
            }
        });
       })
       function formastatus(value) {
        if (value.regtype ==1) {
            return '<span>' + "市" + '</span>'
        } 
        if (value.regtype ==2) {
            return '<span>' + "区" + '</span>'
        } 
        if (value.regtype ==3) {
            return '<span>' + "小区" + '</span>'
        } 
        if (value.regtype ==4) {
            return '<span>' + "门店" + '</span>'
        } 
        if (value.regtype ==5) {
            return '<span>' + "大区" + '</span>'
        } 
    }
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