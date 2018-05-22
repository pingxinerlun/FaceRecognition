
/**  
判断输入框中输入的日期格式为yyyy-mm-dd和正确的日期  
*/
function IsDate(sm, mystring) {
    var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
    var str = mystring;
    var arr = reg.exec(str);
    if (str == "") return true;
    if (!reg.test(str)) {
        //&& RegExp.$2 <= 12 && RegExp.$3 <= 31) {
        //alert("请保证" + sm + "中输入的日期格式为yyyy-mm-dd或正确的日期!");
        return false;
    }
    return true;
}