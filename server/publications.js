//Server

//Công bố các kênh dữ liệu sẽ được server cung cấp cho client

//Công bố kênh dữ liệu post có collection posts từ biến Posts
Meteor.publish('Channel_Posts', function(options) {
    /*check(options, {
        sort: Object,
        limit: Number
    });*/
    return Collection_Posts.find({}, options);
});

Meteor.publish('Channel_SinglePost', function(postId) {
    check(postId, String);
    return Collection_Posts.find(postId);
});

//Công bố kênh dữ liệu comments có collection comments từ biến Comments (dữ liệu trả về phải có postId trùng với postId được yêu cầu từ subscribe)
Meteor.publish('Channel_Comments', function(postId) {
    check(postId, String);
    return Collection_Comments.find({postId: postId});
});

//Công bố kênh dữ liệu userdata có collection user là document của người dùng đang đăng nhập (toàn bộ các field trong document)
Meteor.publish("Channel_UserData", function () {
    return Meteor.users.find({_id: this.userId});
});

//Công bố kênh dữ liệu alluserdata (tất cả người dùng và các filed trong document của họ)
Meteor.publish("Channel_AllUserData", function () {
    return Meteor.users.find();
});

//Công bố kênh dữ liệu notifications có collection notifications từ biến Notifications
Meteor.publish('Channel_Notifications', function() {
    return Collection_Notifications.find({userId: this.userId});
});

Meteor.publish("Channel_Images", function(){ return Collection_Images.find(); });