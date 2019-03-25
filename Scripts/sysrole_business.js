layui.use(['laypage','layer', 'htcsradio', 'laytpl','table', 'jquery', 'form', 'htcsLG'], function () {
    var laypage = layui.laypage
        , layer = layui.layer;
    var laytpl = layui.laytpl;
    var $ = layui.$;
    var doc = layui.htcsLG;
    var table=layui.table;
    var tableid='sysrole-index-table';
    var namearr = [[ //表头
        { type: 'checkbox'}
      , { field: 'Id', width: 100, title: '编号' }
      , { field: 'RoleName', width: 120, title: '角色名称' }
        , { field: 'RoleDesc', width: 150, title: '描述' }
      , { field: 'PasswordExpiration', width: 200, title: '密码' }
     , { field: 'IsActive', width: 200, title: '是否激活' }
    ]];
    var tableoption = {
        domid: "#sysrole-index-table", formid: "#zsysrole-search-form", arr: namearr, url: 'api/Sysrole/Querylistrole',
        ismuilti: true
    };
    
    var BtnOption = {
        area: ['990px', '310px'],
        tableid: tableid,
        menuid:167,
        ismuilti:true,
        btnview: "bill-button-view",
        tooladd: "zcontract-add-btn",
        tooledit: "zcontract-edit-btn",
        tooldelete: "zcontract-delete-btn",
        "realtable": "T_SYSROLE"
    };
    doc.InitButton(BtnOption, zsysrolebtnscribt, tableoption);

//监听工具栏按钮
table.on('tool(demoEvent)', function(obj) {
    var data = obj.data,
       layEvent = obj.event,
       url = $(this).data('url');
       if (layEvent === 'Permissions') { 
        debugger; 
        var addid="layui-Permissions";
        var view = layui.view;
        layer.open({
            id:addid,
            type: 1,
            title: '分配权限',
            skin: 'two-layer',
            shadeClose: true,//开启遮罩关闭
            //shade: ['0.5'],
            maxmin: true, //开启最大化最小化按钮
            area:['800px', '80%'],
            success: function(layero,index){
                view(this.id).render(url, {
                    RoleId:data.Id,
                    tableid:tableid,
                    layerindex:index
                });
              }
        });  
    }
       doc.bindCommonEvents(BtnOption, data, layEvent, url);
    });
   
    
    }); 
    function reflash() {
        debugger;
        layui.use(['table'], function () {
            var table = layui.table;
            table.reload("sysrole-index-table");   
        });
    }   
    
        