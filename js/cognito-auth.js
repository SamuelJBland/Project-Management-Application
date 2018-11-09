/*global _config AmazonCognitoIdentity AWSCognito*/

var ProjectManagementApp = window.projectManagementApp || {};

(function scopeWrapper($) {
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool;

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    ProjectManagementApp.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };

    ProjectManagementApp.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });


    $(function onDocReady() {
        $('#loginForm').submit(handleLogin);
        $('#registrationForm').submit(handleRegister);
        $('#verifyForm').submit(handleVerify);
    });

    /*
     * Cognito User Pool functions
     */

     function handleRegister(event) {
         var email = $('#emailInputRegister').val();
         var password = $('#passwordInputRegister').val();
         var passwordConfirm = $('#passwordConfirmInputRegister').val();

         var onSuccess = function registerSuccess(result) {
             var cognitoUser = result.user;
             //console.log('user name is ' + cognitoUser.getUsername());

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
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        userPool.signUp(email, password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    }

    function handleLogin(event) {
        const email = $('#emailInputLogin').val();
        var password = $('#passwordInputLogin').val();
        event.preventDefault();
        login(email, password, loginSuccess(email),
            function loginError(err) {
                alert(err);
            }
        );

        loadUsers();
    }

    function login(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    function loginSuccess(emailRef) {
      //var cognitoUser = userPool.getCurrentUser();
      //var currentSession = cognitoUser.getSession();
      //alert("Logged in as" + currentSession.fetchCurrentAuthToke());
      //const tokens = {
      //  accessToken: session.getAccessToken().getJwtToken(),
      //  idToken: session.getIDToken().getJwtToken(),
      //  refreshToken: session.getRefreshToken.getJwtToken()
      //}
      //cognitoUser['tokens'] = tokens;
      //resolve(cognitoUser);

      $.ajax({
        type: 'GET',
        url:'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/deploymentStage/getProjects',

        success: function(data){
          data.Items.forEach(function(projectItem){
              $('#projects').append(
                '<div class="col-md-6" style="margin: 0.5%;">' +
                  '<div class="card">' +
                    '<div class="card-body row">' +
                      '<div class="col-md-10">' +
                        '<div class="card-title">' +
                          projectItem.projectName +
                        '</div>' +
                        '<div class="card-text">' +
                          'Status: ' + projectItem.status +
                        '</div>' +
                      '</div>' +
                      '<div class="col-md-2">' +
                        '<button class="btn btn-info col-sm-12 row" type="submit" data-toggle="modal" data-target="#editProjectPopUp" style="margin: 2%;"><i class="fas fa-edit"></i></button>' +
                        '<button class="btn btn-info col-sm-12 row" type="submit" style="margin: 2%;"> <i class="fas fa-trash-alt"></i></button>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>'
              )
          });

          $('#title2').append('<h2>Logged In as ' + emailRef + '</h2>');
        }
      })
    }

    function loadUsers() {
        $.ajax({
          type: 'GET',
          url:'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/deploymentStage/getUsers',

          success: function(data){
            //error("TLETLT");
            data.Items.forEach(function(user){
                $('#users').append(
                  '<div class="col-md-6" style="margin: 0.5%;">' +
                    '<div class="card">' +
                      '<div class="card-body row">' +
                        '<div class="col-md-10">' +
                          '<div class="card-title">' +
                            user.username +
                          '</div>' +
                          '<div class="card-text">' +
                            'User Type: ' + user.userType +
                          '</div>' +
                        '</div>' +
                        '<div class="col-md-2">' +
                          '<button class="btn btn-info col-sm-12 row" type="submit" data-toggle="modal" data-target="#editProjectPopUp" style="margin: 2%;"><i class="fas fa-edit"></i></button>' +
                          '<button class="btn btn-info col-sm-12 row" type="submit" style="margin: 2%;"> <i class="fas fa-trash-alt"></i></button>' +
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

    /*
    //Sets up the cognito user session using the current session access tokens

    const AccessToken = new CognitoAccessToken({ AccessToken: tokens.accessToken });
    const IdToken = new CognitoIdToken({ IdToken: tokens.idToken });
    const RefreshToken = new CognitoRefreshToken({ RefreshToken: tokens.refreshToken });

    const sessionInfo = {
      idToken: IdToken,
      AccessToken: AccessToken,
      RefreshToken: RefreshToken
    };

    const userSession = new CognitoUserSession(sessionInfo);

    cognitoUser.setSignInUserSession(userSession);
    */

}(jQuery));
