layui.use(['table','laypage','layer', 'htcsradio', 'laytpl', 'jquery', 'form', 'htcsLG'], function () {
var laypage = layui.laypage
    , layer = layui.layer;
var laytpl = layui.laytpl;
var $ = layui.$;
var doc = layui.htcsLG;
var table=layui.table;

var namearr = [[ //表头
        { type: 'checkbox' }
      , { field: 'Id', width: 100, title: '编号' }
      , { field: 'BtnNo', width: 200, title: '按钮编号' }
      , { field: 'BtnName', width: 200, title: '按钮名称' }
      , { field: 'BtnIcon', width: 200, title: '图标' }
      , { field: 'orderby', width: 200, title: '排序' }
      , {  width: 200, title: '所属菜单',templet:cd }
]];
var tableoption = {
    domid: "#sysbutton-table", formid: "#zsysbutton-search-form", arr: namearr, height: 650, url: 'api/Sysrole/Querylistbutton',
    ismuilti: true
};
//加载按钮数据
var BtnOption = {
    area: ['990px', '80%'],
    tableid: "sysbutton-table",
    ismuilti:true,
    btnview: "zsysbutton-button-view",
    tooladd: "sysbtn-add-btn",
    tooledit: "sysbtn-edit-btn",
    tooldelete: "sysbtn-delete-btn",
    menuid:117
};
debugger;
doc.InitButton(BtnOption, zsysbtnbtnscribt, tableoption);
//监听工具栏按钮
table.on('tool(demoEvent)', function(obj) {
var data = obj.data,
   layEvent = obj.event,
   url = $(this).data('url');
   doc.bindCommonEvents(BtnOption, data, layEvent, url);
});
function cd(value){
    var result='';
    if(value.MenuId==0){
        result='';
    }else{
        doc.formatterQuery("T_MENU", "title",value.MenuId, function (data) { 
            debugger;
            result=data;
        });
    }
    return '<div>' + result+ '</div>';
}
});   

