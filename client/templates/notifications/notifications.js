//Client

Template.Template_Notifications.helpers({
    notifications: function() {
        return Collection_Notifications.find({userId: Meteor.userId()}, {sort: {read: 1, createdate: -1}});
    },
    notificationCount: function(){
        return Collection_Notifications.find({userId: Meteor.userId()}).count();
    },
    notificationCountNew: function(){
        return Collection_Notifications.find({userId: Meteor.userId(), read: false}).count();
    }
});

Template.Template_Notifications.events({
    'click [name=Delete-Notification-Old]' : function(){
        if (confirm("Bạn muốn xóa hết thông báo đã đọc?")) {
            Meteor.call('NotificationRemove', function (error, result) {
                if (error) {
                    ShowError(error.reason);
                }
                if (result.remove) {
                    ShowLogs('Đã xóa các thông báo!')
                }
            });
        }
    }

});

Template.Template_NotificationItem.helpers({
    notificationPostPath: function() {
        return Router.routes.Route_PostPage.path({_id: this.postId});
    },
    creatDateTime: function(){
        return ConverISODate(this.createDate);
    }
});

Template.Template_NotificationItem.events({
    'click a': function() {
        Collection_Notifications.update(this._id, {$set: {read: true}});
    }
});