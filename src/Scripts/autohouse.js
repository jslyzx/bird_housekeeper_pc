debugger;
layui.use(['laypage', 'layer', 'laytpl', 'jquery', 'form'], function () {
var $ = layui.jquery;
$('#HouseName').devbridgeAutocomplete({
    lookup: function (query, done) {
        debugger;
        var querydata = {};
        querydata.Name = query;
        querydata.PageSize = 100;
        querydata.PageIndex = 1;
        doc.objectQuery("api/House/Querybyname", querydata, function (result) {
            debugger;
            if (result.numberData != null) {
                var realresut = [];
                $.each(result.numberData, function (tindex, tvalue) {
                    var val = {};
                    val.value = tvalue.Name;
                    val.data = tvalue.HouseId;
                    val.HouseType = tvalue.HouseType;
                    realresut.push(val);
                });
                var dresult = {
                    suggestions: realresut
                };
                done(dresult);
            }
        })
     
    },
    minChars: 1,
    onSelect: function (suggestion) {
        isSearch = true;
        debugger;
        $("#HouseId").val(suggestion.data);
        $("#HouseType").val(suggestion.HouseType);
    },
    triggerSelectOnValidInput:false,
    result: function (event, data, formatted) {
    
        debugger;
        // 必须阻止事件的默认行为，否则autocomplete默认会把ui.item.value设为输入框的value值
        event.preventDefault();     
    },
    showNoSuggestionNotice: true,
    noSuggestionNotice: function () {

        return '<span>找不到小区,可手动添加</span>'

    },
    groupBy: 'category'
});
})