//Client

Template.Template_CommentItem.helpers({
    ownComment: function() {
        return this.userId === Meteor.userId();
    },
    submittedText: function() {
        return ConverISODate(this.submitted);
    }
});


Template.Template_CommentItem.events({
    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Bạn muốn xóa bình luận có ID " + this._id)) {
            Meteor.call('commentDelete', this._id, this.postId, function(error, result) {
                if (error) {
                    ShowError(error.reason);
                }else{
                    //ShowLogs('Đã xóa bình luận có ID ' + result._id);
                }
            });
        }
    }
});
