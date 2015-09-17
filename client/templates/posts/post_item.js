//Client

Template.Template_PostItem.created = function () {

};

Template.Template_PostItem.rendered = function () {

};

//Tạo và xử lý dữ liệu các helper cho trang post_item.html
Template.Template_PostItem.helpers({
    //Kiểm tra người dùng đang đăng nhập có phải là tác giả của bài viết hoặc phải có quyền admin
    ownPost: function() {
        if (Meteor.user()){
            return (this.userId === Meteor.userId())||(Meteor.user().isAdmin === true);
        }else{
            return this.userId === Meteor.userId();
        }
    },
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    },
    upvotedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.upvoters, userId)) {
            return 'btn-primary upvotable';
        } else {
            return 'disabled';
        }
    }
});

Template.Template_PostItem.events({
    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Bạn muốn xóa bài viết có ID " + this._id)) {
            //Posts.remove(this._id);
            Meteor.call('postDelete', this._id, function(error, result) {
                if (error) {
                    ShowError(error.reason);
                }else{
                    //ShowLogs('Đã xóa bài viết có ID ' + result._id);
                }
            });
            Router.go('home');
        }
    },
    'click .upvotable': function(e) {
        e.preventDefault();
        Meteor.call('postUpvote', this._id, function(error, result) {
            if (error) {
                ShowError(error.reason);
            }else{
                if (result.voted){ShowError('Bạn đã bình chọn bài viết này!');}
                if (result._id){ShowLogs('Cám ơn bạn đã bình chọn!');}
            }
        });
    }
});
