/*global _config AmazonCognitoIdentity AWSCognito*/

(function scopeWrapper($) {

    $(function onDocReady() {
      handleSessionState();

      $('#loginForm').submit(handleLogin);
      $('#registrationForm').submit(handleRegister);
      $('#verifyForm').submit(handleVerify);

      $('#createProjectForm').submit(handleProjectCreation);
      $('#editProjectButton').click(handleProjectEdit);

      projectsAccessControl();
    });

    function handleSessionState() {
      var currentSessionStatus = localStorage.getItem('LoginStatus');
      alert(currentSessionStatus);

      if(currentSessionStatus == 'loggedIn') {
        var currentUser = localStorage.getItem('LoggedInUser');
        var password = localStorage.getItem('CurrentPassword');

        $('#userButtonContainer').html(
          '<form>' +
            '<button id="logOutButton" class="btn btn-lg btn-info" onclick="' + logOutUser() + '">Log Out</button>' +
          '</form>'
        )
        projectsAccessControl(currentUser, password);
      }
    }

    function logOutUser() {
      localStorage.setItem('LoginStatus', 'loggedOut');
      localStorage.setItem('LoggedInUser', 'N/A');
    }

    function handleProjectEdit() {

    }

    function handleProjectCreation() {

    }

     function handleRegister(event) {
         var email = $('#emailInputRegister').val();
         var password = $('#passwordInputRegister').val();
         var passwordConfirm = $('#passwordConfirmInputRegister').val();

         var onSuccess = function registerSuccess(result) {
             var cognitoUser = result.user;

             var confirmation = ('Registration successful.');
             if (confirmation) {
               alert("Registration Successful");
               $('#loginRegisterPopUp').modal('hide');
               $('#verifyUserPopUp').modal('show');
             }
         };
         var onFailure = function registerFailure(err) {
             alert(err);
         };
         event.preventDefault();

         if (password === passwordConfirm) {
             register(email, password, onSuccess, onFailure);
         } else {
             alert('Passwords do not match');
         }
     }

    function register(email, password, onSuccess, onFailure) {

    }

    function handleLogin(event) {
      var email = $('#emailInputLogin').val();
      var password = $('#passwordInputLogin').val();

      projectsAccessControl(email, password);

      //Sets the persistent session data, to be checked and loaded on reload of the page (index.html)
      localStorage.setItem('LoginStatus', 'loggedIn');
      localStorage.setItem('LoggedInUser', email);
      localStorage.setItem('CurrentPassword', password);
    }

    function projectsAccessControl(emailRef, password) {

      $.ajax({
        type: 'GET',
        url:'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/dev/getusers',

        success: function(data){
          data.Items.forEach(function(user){

            if (user.userName == emailRef) {
              if (user.password == password) {
                alert(user.userType);
                if (user.userType == "Administrator" || user.userType == "Project Manager") {
                  loadProjects();
                  if (user.userType == "Administrator") {
                    loadUsers();
                  }
                }
              }
            }
          });
        }
      })
    }

    function loadProjects() {
      $.ajax({
        type: 'GET',
        url:'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/dev/getprojects',

        success: function(data){
          data.Items.forEach(function(projectItem){
              $('#projects').append(
                '<div class="col-md-3" style="margin: 0.5%;">' +
                  '<div class="card">' +
                    '<div class="card-body row">' +
                      '<div class="col-md-8">' +
                        '<div class="card-title">' +
                          projectItem.projectName +
                        '</div>' +
                        '<div class="card-text">' +
                          'Status: ' + projectItem.status +
                        '</div>' +
                      '</div>' +
                      '<form class="col-md-4" action="https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/dev/deleteproject" method="GET">' +
                        '<input type="hidden" name="projectName" value="' + projectItem.projectName + '">' +
                        '<button class="btn btn-info col-md-12 row" type="submit" data-toggle="modal" data-target="#editProjectPopUp" style="margin: 2%;"><i class="fas fa-edit"></i></button>' +
                        '<button class="btn btn-info col-md-12 row" type="submit" style="margin: 2%;"><i class="fas fa-trash-alt"></i></button>' +
                      '</from>' +
                    '</div>' +
                  '</div>' +
                '</div>'
              )
          });
          $('#title2').html('<h2>Logged In as ' + emailRef + '</h2>');
        }
      })
    }

    function loadUsers() {
        $.ajax({
          type: 'GET',
          url:'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/dev/getusers',

          success: function(data){
            data.Items.forEach(function(user){
                $('#users').append(
                  '<div class="col-md-3" style="margin: 0.5%;">' +
                    '<div class="card">' +
                      '<div class="card-body row">' +
                        '<div class="col-md-8">' +
                          '<div class="card-title">' +
                            user.userName +
                          '</div>' +
                          '<div class="card-text">' +
                            'User Type: ' + user.userType +
                          '</div>' +
                        '</div>' +
                        '<form class="col-md-4" action="https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/dev/deleteuser" method="GET">' +
                          '<input type="hidden" name="userName" value="' + user.userName + '">' +
                          '<button class="btn btn-info col-md-12 row" type="submit" data-toggle="modal" data-target="#editUserPopUp" style="margin: 2%;"><i class="fas fa-edit"></i></button>' +
                          '<button class="btn btn-info col-md-12 row" type="submit" style="margin: 2%;"> <i class="fas fa-trash-alt"></i></button>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                  '</div>'
                )
            });
          }
        })
    }

    function handleVerify(event) {
        var email = $('#emailInputVerify').val();
        var code = $('#codeInputVerify').val();
        event.preventDefault();
        verify(email, code,
            function verifySuccess(result) {
                $('#verifyUserPopUp').modal('close');
                $('#loginRegisterPopUp').modal('show');
                alert('Verification successful.');
            },
            function verifyError(err) {
                alert(err);
            }
        );
    }

    function verify(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

}(jQuery));
