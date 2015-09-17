//Server + Client

//Tạo collection C_Posts ở cả 2 môi trường và gán vào biến Posts
Collection_Posts = new Mongo.Collection('C_Posts');

//Phương thức chấp nhận hoặc từ chối
//Chỉ có tác dụng nếu client sử dụng lệnh trực tiếp insert, update hay remove từ Browser hoặc Browser Console
//Không kiểm tra nếu client gọi một methods của server để xử lý
Collection_Posts.allow({
    //Chấp nhận thêm bài viết miễn là có "tồn tại" sự đăng nhập (userId khác null) của người dùng và trường userId phải gán là userId đang đăng nhập
    insert: function(userId, doc) {return (userId && doc.userId === userId);},

    //Chấp nhận sửa đổi bài viết nếu nó thuộc người dùng đang đăng nhập
    update: function(userId, doc) { return doc && doc.userId === userId; },

    //Chấp nhận xóa bài viết nếu nó thuộc người dùng đang đăng nhập
    remove: function(userId, doc) { return doc && doc.userId === userId; },

    //Chỉ lấy trường userId để kiểm tra cho phương thức update hoặc remove ở trên
    fetch: ['userId']
});
Collection_Posts.deny({
    //Từ chối cập nhật các trường khác 2 trường url và title
    update: function(userId, post, fieldNames) {
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
});

//Phương thức thêm, sửa, xóa bài viết
Meteor.methods({
    postEdit: function(postAttributes) {
        check(Meteor.userId(), String);
        check(postAttributes, {
            id: String,
            title: String,
            url: String,
            submitted: Date
        });

        //Kiểm tra nếu trùng Url với một document khác trả về id của document đó
        var EditWithSameLink = Collection_Posts.findOne({_id:{$ne: postAttributes.id}, url: postAttributes.url});
        if (EditWithSameLink) {
            return {
                postExists: true,
                _id: EditWithSameLink._id
            }
        }

        //Cập nhật document nếu không trùng Url
        Collection_Posts.update(postAttributes.id, {$set: postAttributes});
        return {_id: postAttributes.id};
    },
    postInsert: function(postAttributes) {
        check(Meteor.userId(), String);
        check(postAttributes, {
            title: String,
            url: String
        });

        //Kiểm tra nếu trùng Url với một document khác trả về id của document đó
        var InserWithSameLink = Collection_Posts.findOne({url: postAttributes.url});
        if (InserWithSameLink) {
            return {
                postExists: true,
                _id: InserWithSameLink._id
            }
        }

        //Thêm document mới nếu không trùng Url
        var InsertPost = _.extend(postAttributes, {
            userId: Meteor.user()._id,
            author: Meteor.user().username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });

        InsertPost._id = Collection_Posts.insert(InsertPost);
        return {_id: InsertPost._id};
    },
    postDelete: function(postId){
        Collection_Posts.remove(postId);

        //Xóa toàn bộ comment và notification liên quan đến bài viết
        Collection_Comments.remove({postId:postId});
        Collection_Notifications.remove({postId:postId});

        return {_id:postId};
    },
    postUpvote: function(postId) {
        check(this.userId, String);
        check(postId, String);

        //Tìm xem người dùng đang đăng nhập đã bỏ phiếu cho bài viết này hay chưa, nếu chưa thì cập nhật
        var affected = Collection_Posts.update({
            _id: postId,
            upvoters: {$ne: this.userId}
        }, {
            $addToSet: {upvoters: this.userId},
            $inc: {votes: 1}
        });
        if (! affected)return {voted:true};

        return {_id:postId};
    }
});