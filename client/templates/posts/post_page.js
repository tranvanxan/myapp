//Client

Template.Template_PostPage.helpers({
    comments: function() {
        return Collection_Comments.find({postId: this._id});
    }
});
