Template.Template_Login.events({
    'submit #Login_Form' : function(event, form){
        event.preventDefault();

        var Login_Username = form.find('#Login_Input_Username').value;
        var Login_Password = form.find('#Login_Input_Password').value;

        Meteor.loginWithPassword(Login_Username, Login_Password, function(err){
            if (err){ShowError(G_Translate.get('ErrorLogin'));}
            else{
                RemoveJsCssFile('/system/languages/'+G_Lang.get()+'.js','js');
                if (Meteor.user().settings.language!=""){
                    G_Lang.set(Meteor.user().settings.language);
                    if (LocalStorageOk()) {
                        localStorage.User_Lang = Meteor.user().settings.language;
                    }
                }
                InsertJsCssFile('/system/languages/' + G_Lang.get() + '.js', 'js', 'Before', false);

                if (!Meteor.user().settings.otherlogin) {Meteor.logoutOtherClients();}

                ShowLogs(G_Translate.get('HiLogged'));
                G_Assistant.set("Talking",G_Translate.get('HiLogged'))
            }
        });
    }
});