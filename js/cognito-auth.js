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

    /*
     * Cognito User Pool functions
     */

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

    function login(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            //onSuccess: onSuccess,
            onSuccess: function(session) {
              const tokens = {
                accessToken: session.getAccessToken().getJwtToken(),
                idToken: session.getIDToken().getJwtToken(),
                refreshToken: session.getRefreshToken.getJwtToken()
              }
              cognitoUser['tokens'] = tokens;
              resolve(cognitoUser);
            },
            onFailure: onFailure
        });
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

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    }

    /*
     *  Event Handlers
     */

    $(function onDocReady() {
        $('#loginForm').submit(handleLogin);
        $('#registrationForm').submit(handleRegister);
        $('#verifyForm').submit(handleVerify);
    });

    function handleLogin(event) {
        const email = $('#emailInputLogin').val();
        var password = $('#passwordInputLogin').val();
        event.preventDefault();
        login(email, password, loginSuccess(email),
            function loginError(err) {
                alert(err);
            }
        );
    }

    function loginSuccess(emailRef) {
        alert("Logged In");
        $('#title').append(
          '<h2>Logged In as SADASDASD' + emailRef + '</h2>'
        )
    }

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
}(jQuery));
