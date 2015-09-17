//Client

//Chứa các khai báo để khởi tạo các thành phần đầu tiên

//Định nghĩa và gán giá trị cho biến Session
if (Session.get('Errors') === undefined) {Session.set('Errors', {});}
//----------------------------------------------------------

//Khai báo biến toàn cục
//Khai báo G_Lang là một biến reactive, phải cài gói reactive-var, chứa ngôn ngữ đang sử dụng có khả năng tương tác lại
G_Lang = new ReactiveVar();
G_Lang.set("vn");
if (('localStorage' in window) && window['localStorage'] !== null && localStorage.User_Lang!="") {G_Lang.set(localStorage.User_Lang);}
//Khai báo G_Translate là một biến ReactiveDict, phải cài gói reactive-dict, chứa phần dịch ngôn ngữ đang sử dụng có khả năng tương tác lại
G_Translate = new ReactiveDict();
//Khai báo G_Assistant là một biến ReactiveDict, phải cài gói reactive-dict, chứa các thông tin hổ trợ sử dụng
G_Assistant = new ReactiveDict();
 //Khai báo G_LangList là một biến có dạng Object Json, chứa danh sách các ngôn ngữ được sử dụng, có thể dùng trực tiếp G_LangList[0].title
G_LangList = [{symbol:"vn",title:"Việt Nam"}];


//Tạo collection local dạng null ở client để không bao giờ được lưu vào server, tuy nhiên nếu refresh website sẽ mất dữ liệu này
Collection_Local = new Mongo.Collection(null);
