//Client

Template.Template_NotFound.helpers({
    NotFound_Lang : function() {
        if (G_Lang.get()==="en"){
            this.Title = 'Page not found';
            this.Desc = 'Sorry, but the page you are looking for has note been found. Try checking the infomations.';
        }
        else{
            this.Title = 'Không tìm thấy dữ liệu';
            this.Desc = 'Xin lổi, chúng tôi không tìm thấy thông tin bạn cần. Vui lòng kiểm tra thông tin.';
        }
        return this;
    }

});