//Client
var GetHeaderUserInfomation = function(){
    Meteor.call('Method_Server_GetUserFriendList', Meteor.userId(), function (error, result) {
        if (result!=null){
            G_Assistant.set("ResponseSearchFriend", G_Translate.get("ResponseSearchFriend").replace("{count}", result.length));
            G_Assistant.set("SearchFriendList", result);
        }else{
            G_Assistant.set("ResponseSearchFriend",G_Translate.get("RequestAddFriend"));
            G_Assistant.set("SearchFriendList", "");
        }
    });

    Meteor.setTimeout(function () {
        if ($('#right-sidebar').hasClass("sidebar-open")){GetHeaderUserInfomation();}
    },5000);
};


Template.Template_Header.events({
    "click #Header_A_Logout" : function () {
        swal({
            title: G_Translate.get('Confirm'),
            text: G_Translate.get('QuestionSignOut'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: G_Translate.get('Yes'),
            cancelButtonText: G_Translate.get('No'),
            closeOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm){
                ShowLogs(G_Translate.get("CompleteSignOut"));
                Meteor.logout();
                FlowRouter.go('/');
            }
        });
    },
    "change .myFileInput": function(event, template) {
        FS.Utility.eachFile(event, function (file) {
            Collection_Images.insert(file, function (err, fileObj) {
                if (err) {
                    // handle error
                } else {
                    // handle success depending what you need to do
                    var userId = Meteor.userId();
                    var imagesURL = {
                        "profile.image": "/cfs/files/images/" + fileObj._id
                    };
                    Meteor.users.update(userId, {$set: imagesURL});
                }
            });
        });
    },
    'keypress #Header_Input_SearchUser': function (event) {
        if (event.which === 13) {
            Meteor.call('Method_Server_SearchUsersByName', $(event.target).val(), Meteor.userId(), function (error, result) {
                if (result != null) {
                    if (result.length == 0) {
                        G_Assistant.set("ResponseSearchUser", G_Translate.get("RequestRetryAgain"));
                    } else {
                        G_Assistant.set("ResponseSearchUser", G_Translate.get("ResponseSearchUser").replace("{count}", result.length));
                    }
                    G_Assistant.set("SearchUserList", result);
                } else {
                    G_Assistant.set("ResponseSearchUser", G_Translate.get("RequestRetryAgain"));
                    G_Assistant.set("SearchUserList", "");
                }
            });
            G_Assistant.set("ResultSearchUser", G_Translate.get("ErrorSearchUser"));
        }
    },
    'keypress #Header_Input_UserSlogan': function (event) {
        if (event.which === 13) {
            if(Meteor.userId()) {
                Meteor.users.update({_id: Meteor.userId()}, {$set: {"status.slogan": $(event.target).val()}}, {multi: true})
            }
        }
    },
    "change #Hearder_Select_Lang" : function (event) {
        RemoveJsCssFile('/system/languages/'+G_Lang.get()+'.js','js');
        G_Lang.set($(event.target).val());
        localStorage.User_Lang=G_Lang.get();
        if(Meteor.userId()) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {"settings.language": G_Lang.get()}}, {multi: true})
        }
        InsertJsCssFile('/system/languages/'+G_Lang.get()+'.js','js','Before',false);
    },
    "click #Hearder_CheckBox_OtherLogin" : function (event) {
        if (!$('#Hearder_CheckBox_OtherLogin').is(":checked")){
            swal({
                title: G_Translate.get('Confirm') ,
                text: G_Translate.get("QuestionDisconnectOtherLogin"),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: G_Translate.get('Yes'),
                cancelButtonText: G_Translate.get('No'),
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm) {
                    swal({
                        title: G_Translate.get('Complete'),
                        text: G_Translate.get("CompleteDisconnectOtherLogin"),
                        type: "success"
                    });
                    Meteor.logoutOtherClients();
                }
            });
        }
        if(Meteor.userId()) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {"settings.otherlogin": $('#Hearder_CheckBox_OtherLogin').is(":checked")}}, {multi: true})
        }
    },
    "click #Hearder_CheckBox_Busy" : function (event) {
        if (!$('#Hearder_CheckBox_Busy').is(":checked")) {
            $("#Hearder_I_Busy").removeClass('fa-bell-slash').addClass('fa-bell');
        }else{
            $("#Hearder_I_Busy").removeClass('fa-bell').addClass('fa-bell-slash');
        }
        if(Meteor.userId()) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {"status.busy": $('#Hearder_CheckBox_Busy').is(":checked")}}, {multi: true})
        }
    },
    "click #Header_A_UserInfomation" : function(event) {
        if ($('#right-sidebar').hasClass("sidebar-open")) {
            if (G_Assistant.get("ResponseSearchUser")==undefined){
                G_Assistant.set("ResponseSearchUser", G_Translate.get("RequestSearchUser"));
                G_Assistant.set("ResultSearchUser", "");
            }
            FlowRouter.subsReady("Register_UserData", function() {
                GetHeaderUserInfomation();
                if (!IsAdmin()){$('#Hearder_Div_AdminSettings').addClass('hidden');}

                var J_Switch=null;
                J_Switch=document.querySelector('#Hearder_CheckBox_OtherLogin');
                J_Switch.checked = Meteor.user().settings.otherlogin;
                ElementOnChange(J_Switch);

                J_Switch=document.querySelector('#Hearder_CheckBox_Busy');
                J_Switch.checked = Meteor.user().status.busy;
                ElementOnChange(J_Switch);
                if (J_Switch.checked) {
                    $("#Hearder_I_Busy").removeClass('fa-bell').addClass('fa-bell-slash');
                }else{
                    $("#Hearder_I_Busy").removeClass('fa-bell-slash').addClass('fa-bell');
                }

                if (Meteor.user().status.mood){
                    G_Assistant.set("UserMood","<i class='fa fa-pencil'></i> "+Meteor.user().status.mood);
                }else{
                    G_Assistant.set("UserMood","<i class='fa fa-pencil'></i> "+G_Translate.get("RequestEditMood"));
                }
            });
        }
    }
});



Template.Template_Header.created = function()  {

};

Template.Template_Header.rendered = function() {

};

Template.Template_Header.helpers({
    Header_Notifications: function() {
        return Collection_Notifications.find({userId: Meteor.userId()}, {sort: {read: 1, createdate: -1}});
    },
    Header_NotificationCount: function(){
        return Collection_Notifications.find({userId: Meteor.userId()}).count();
    },
    Header_NotificationCountNew: function(){
        return Collection_Notifications.find({userId: Meteor.userId(), read: false}).count();
    }
});


Template.Template_Header_NotificationItem.events({
    'click a': function() {
        Collection_Notifications.update(this._id, {$set: {read: true}});
        Router.go('Route_PostPage',{_id: this.postId});
    },
    "click .xan-div-quick-news" : function () {
        Collection_Notifications.update(this._id, {$set: {read: true}});
        Router.go('Route_PostPage',{_id: this.postId});
    }
});