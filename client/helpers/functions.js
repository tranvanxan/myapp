//Client

//Chứa các hàm, phương thức và các registerHelper cho toàn chương trình

//-----------------------------------------------Functions------------------------------------------------------

//Hàm IsAdmin xác nhận người dùng là Admin
IsAdmin = function() {
    return Meteor.userId() ? Meteor.user().isAdmin : false ;
};

//Hàm kiểm tra giá trị của lưu trữ cục bộ là chuổi "true" thì trả về giá trị true và ngược lại là false
StringIsTrue = function(Str) {
    return (String(Str).trim()==="true"||String(Str).trim()==="on");
};

//Hàm kiểm tra trình duyệt có hổ trợ HTML 5 để lưu trữ cục bộ các biến
LocalStorageOk = function() {
    return (('localStorage' in window) && window['localStorage'] !== null);
};

//Phương thức SaveDataLocal lưu dữ liệu cục bộ vào collection local theo userId người đăng nhập
SaveDataLocal = function(Expression) {
    if (!Collection_Local.findOne({userid: Meteor.userId()})) {
        Collection_Local.insert(Expression);
    }
    else{
        Collection_Local.update({userid: Meteor.userId()}, {$set: Expression});
    }
};

//Phương thức ShowError thêm báo lổi vào collection
ShowError = function(Message) {
    toastr.error(Message);
};

//Phương thức ShowError thêm hành động vào collection
ShowLogs = function(Message) {
    if (StringIsTrue(localStorage.showalert)){toastr.success(Message);}
    if (Meteor.userId()) {
        if (Meteor.user().settings.log) {Meteor.call('LogInsert',Message);}
    }
};


RemoveJsCssFile = function(PathJsCss,FileType){
    var J_TargetElement=(FileType=="js")? "script" : (FileType=="css")? "link" : "none";
    var J_TargetAttr=(FileType=="js")? "src" : (FileType=="css")? "href" : "none";
    var J_AllSuspects=document.getElementsByTagName(J_TargetElement);
    for (var i=J_AllSuspects.length; i>=0; i--){
        if (J_AllSuspects[i] && J_AllSuspects[i].getAttribute(J_TargetAttr)!=null && J_AllSuspects[i].getAttribute(J_TargetAttr).indexOf(PathJsCss)!=-1)
        {J_AllSuspects[i].parentNode.removeChild(J_AllSuspects[i]);}
    }
};

InsertJsCssFile = function(PathJsCss, FileType, Position, CrossSite){
    var J_FileRef=null;
    if (FileType=="js"){
        J_FileRef=document.createElement('script');
        J_FileRef.type="text/javascript";
        if (CrossSite){
            J_FileRef.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + PathJsCss;
        }
        else{
            J_FileRef.src = PathJsCss;
        }

        var J_Tag = document.getElementsByTagName('script')[0];
        if (Position==='Before'){
            J_Tag.parentNode.insertBefore(J_FileRef, J_Tag);
        }
        else{
            J_Tag.parentNode.appendChild(J_FileRef, J_Tag);
        }
    }
    else if (FileType=="css"){
        J_FileRef=document.createElement("link");
        J_FileRef.rel="stylesheet";
        J_FileRef.type="text/css";
        if (CrossSite){
            J_FileRef.href = ('https:' == document.location.protocol ? 'https://' : 'http://') + PathJsCss;
        }
        else{
            J_FileRef.href = PathJsCss;
        }
        document.getElementsByTagName("head")[0].appendChild(J_FileRef);
    }
};

//Phương thức làm lại một element
ElementOnChange = function(Element){
    if (typeof Event === 'function' || !document.fireEvent) {
        var J_Event = document.createEvent('HTMLEvents');
        J_Event.initEvent('change', true, true);
        Element.dispatchEvent(J_Event);
    } else {
        Element.fireEvent('onchange');
    }
};

//Hàm tìm kiếm giá trị của một trường dữ liệu từ một biểu thứ tương ứng, trả về một object json hoặc mảng dữ liệu
// Obj : đối tượng Json cần tìm kiếm
// lookupkey : trường dữ liệu điều kiện
// operator : toán tử điều kiện (===,==,!==,!=,>=,<=,>,<)
// lookupvalue : giá trị dữ liệu điều kiện (kiểu chuổi và kiểu số)
// resultkey : trường trả một khóa có dạng ID (cần chọn trường mà dữ liệu không bao giờ trùng nhau, vd _id, nếu không có trường này tự động lấy số thứ tự)
// resultvalue : trường trả giá trị (có thể lấy trường xâu trong object theo dạng 'field_cha.field_con')
// typedata : kiểu dữ liệu trả về (obj, arr)
// VD : J_ABC=JsonLookup(G_LangList,'symbol','!=','','symbol','title','obj');
JsonLookup = function(Obj,LookupKey,Operator,LookupValue,ResultKey,ResultValue,TypeData){
    var J_Data = null;
    if (TypeData==="obj"){
        J_Data = {};    //Khai báo một đối tượng json trống
    }else {
        J_Data = [];    //Khai báo một mảng json trống
    }
    var J_Result='';
    var J_Key='';
    var J_Action=false;
    $(Obj).each(function(i,val) {
        $.each(val, function (k, v) {
            if (LookupKey === k){
                if (Operator==="==="&&LookupValue === v){J_Action=true;}
                if (Operator==="=="&&LookupValue == v){J_Action=true;}
                if (Operator==="!=="&&LookupValue !== v){J_Action=true;}
                if (Operator==="!="&&LookupValue != v){J_Action=true;}
                if (typeof v === 'number' && isFinite(v)){
                    if (Operator===">="&&LookupValue <= v){J_Action=true;}
                    if (Operator==="<="&&LookupValue >= v){J_Action=true;}
                    if (Operator===">"&&LookupValue < v){J_Action=true;}
                    if (Operator==="<"&&LookupValue > v){J_Action=true;}
                }
                if (J_Action){
                    J_Result =  Obj[i];
                    var J_String=ResultValue;
                    while(J_String.indexOf(".") > 0 )
                    {
                        var J_SubStr = J_String.substr(0, J_String.indexOf("."));
                        if (J_SubStr!=''){
                            J_Result =  J_Result[J_SubStr];

                        }
                        J_String=J_String.slice(J_String.indexOf(".")+1);
                    }
                    J_Result =  J_Result[J_String];
                    if (J_Result==undefined){J_Result='';}

                    if (TypeData==="obj"){
                        J_Key = Obj[i][ResultKey];
                        if (J_Key==undefined){
                            J_Data[i] = J_Result;
                        }else{
                            J_Data[J_Key] = J_Result;
                        }
                    }
                    else{J_Data.push(J_Result);}

                    J_Action=false;
                }
            }
        });
    });
    return J_Data;
};

//-----------------------------------------------registerHelper------------------------------------------------------

//Đăng ký helper Pluralize phân tích số nhiều trong tiếng anh
UI.registerHelper('Pluralize', function(n, thing) {
    if (n === 1) {return '1 ' + thing;}
    else {return n + ' ' + thing + 's';}
});

//Đăng ký helper TimeSince đếm khoản thời gian tính từ date đến hiện tại
UI.registerHelper('TimeSince',function(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return G_Translate.get('YearsAgo') ? G_Translate.get('YearsAgo').replace("{count}",interval) : interval ;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return G_Translate.get('MonthsAgo') ? G_Translate.get('MonthsAgo').replace("{count}",interval) : interval;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return G_Translate.get('DaysAgo') ? G_Translate.get('DaysAgo').replace("{count}",interval) : interval;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return G_Translate.get('HoursAgo') ? G_Translate.get('HoursAgo').replace("{count}",interval) : interval;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return G_Translate.get('MinutesAgo') ? G_Translate.get('MinutesAgo').replace("{count}",interval) : interval;
    }
    return G_Translate.get('SecondsAgo') ? G_Translate.get('SecondsAgo').replace("{count}",interval) : interval;
});

//Đăng ký helper ConverISODate lấy ngày giờ theo chuẩn ISO trả về ngày giờ theo chuẩn máy đang chạy
UI.registerHelper('ConverISODate', function(ISOdate){
    return (ISOdate.toLocaleTimeString() + ' - ' + ISOdate.toLocaleDateString());
});

//Đăng ký helper Selected trả về selected cho option trong nó nếu so sánh đúng a = b
UI.registerHelper('Selected', function(a, b) {
    return a == b ? {selected:'selected'}: '';
});

//Đăng ký helper Checked trả về checked cho checkbox nếu so sánh đúng a = b
UI.registerHelper('Checked', function(a, b) {
    return a == b ? 'checked' : '';
});

//Đăng ký helper IsAdmin xác nhận người dùng là Admin
UI.registerHelper('IsAdmin', function() {
    return Meteor.userId() ? Meteor.user().isAdmin : false ;
});

//Đăng ký helper Translate trả về nội dung tương ứng khóa trong biến G_Translate
UI.registerHelper('Translate', function(key) {
    return G_Translate.get(key) ? G_Translate.get(key) : "" ;
});

//Đăng ký helper Assistant trả về nội dung tương ứng khóa trong biến G_Assistant
UI.registerHelper('Assistant', function(key) {
    return G_Assistant.get(key) ? G_Assistant.get(key) : "" ;
});

//Đăng ký helper Lang trả về ngôn ngữ đang sử dụng
UI.registerHelper('Lang', function () {
    return G_Lang.get();
});

//Đăng ký helper Lang trả về ngôn ngữ đang sử dụng
UI.registerHelper('LangList', function () {
    return G_LangList;
});
