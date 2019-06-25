var doc;
var tableoption;
var BtnOption;
layui.use(['laypage','layer', 'htcsradio', 'laytpl', 'jquery', 'form', 'htcsLG'], function () {
    var laypage = layui.laypage
    , layer = layui.layer;
    var laytpl = layui.laytpl;
    var $ = layui.$;
    doc = layui.htcsLG;
    var table = layui.table;
    loadtree();
    var namearr = [[ //表头
        { type: 'checkbox'}
      , { field: 'Id', width: 100, title: '编号' }
      , { field: 'Mobile', width: 180, title: '用户名' }
      , { field: 'RealName', width: 180, title: '真实姓名' }
      
     
]];
         tableoption = {
            tabfield:'isquit',
            domid: "#sysuser-table", formid: "#zsysuser-search-form", arr: namearr, url: 'api/Sysuser/Querylist',
            ismuilti: true
          
        };
        //doc.InitTable(tableoption);
         BtnOption = {
            area: ['990px', '90%'],
            tableid: "sysuser-table",
            ismuilti:true,
            btnview: "sysuser-button-view",
            toolview: "zsysuser-edit-bt",
            tooladd: "zsysuser-add-bt",
            tooledit: "zsysuser-edit-bt",
            tooldelete: "zsysuser-delete-bt",
            menuid:113,
            "realtable": "T_SYSUSER"
        };
        doc.InitButton(BtnOption, sysuerbtnscribt, tableoption);
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
                area: ['80%', '90%'],
                success: function(layero, index) {
                    view(this.id).render(url, {
                        id: data.Id,
                        tableid: "bill-main-table",
                        layerindex: index
                    });
                }
            });
        }
        if (layEvent === 'quit') { //离职
            var datafield={};
            datafield.Id=data.Id;
            var saveoption={
                url:'api/Sysuser/isquit',
                data:datafield,
                callBack:function(resultData){
                  if (resultData.Code == 0) {
                    table.reload("bill-main-table");
                  }
              }
             }
            doc.Submit(saveoption);
        }
        if (layEvent === 'distributionhouse') { //分配房源
            var editid = "layuibillreceivebtn1";
            var view = layui.view;
            layer.open({
                id: editid,
                type: 1,
                title: '分配管理房源',
                skin: 'two-layer',
                shadeClose: true, //开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['80%', '100%'],
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

function loadtree(){
    var setting = {
       callback: {
       onClick: onClick
     }
   };
   var url = "api/Sysrole/Querydepartment";
   doc.objectQuery(url, { }, function (data) {
           debugger;
           $.fn.zTree.init($("#treeDemo"), setting, data.numberData);
         
   });
}
var childarr=[];

function onClick(event, treeId, treeNode, clickFlag) {
   debugger;
   childarr=[{"Id":treeNode.Id}];
   department(treeNode.children);
   doc.queryPara({"departs":childarr}, tableoption.domid,BtnOption); 
}
function department(treeNodechildren){
    if(treeNodechildren.length>0){
        $.each(treeNodechildren,function(index,value){
            var nodeid={};
            nodeid.Id=value.Id;
            childarr.push(nodeid);
            department(value.children,childarr);
        });
    }
    else{
      return childarr;
    }
}