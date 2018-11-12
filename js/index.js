/*global _config AmazonCognitoIdentity AWSCognito*/

(function scopeWrapper($) {
  $(document).ready(function() {
      handleSessionState();
      $('#loginForm').submit(handleLogin);
      $('#logOutButton').click(function() {
        if(localStorage.getItem('LoginStatus') == 'loggedIn') {
          localStorage.setItem('LoginStatus', 'loggedOut');
          localStorage.setItem('LoggedInUser', 'N/A');
          alert("Logged Out");
        }
      });
      //loadProjects("tester");
    });

    function handleSessionState() {
      var currentSessionStatus = localStorage.getItem('LoginStatus');
      if(currentSessionStatus == 'loggedIn') {
        alert("test");
        loginUser();
      } else {
        alert("Not Logged In");
      }
    }

    function handleLogin() {
      loginUser();
      alert("Logged in as " + localStorage.getItem('LoggedInUser'));
    }

    function loginUser() {
      $.ajax({
        type: 'GET',
        url:'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/dev/getusers',
        success: function(data){
          var currentUser = $('#usernameInputLogin').val();
          var password = $('#passwordInputLogin').val();
          var count = 0;
          data.Items.forEach(function(user){
            if (user.userName == currentUser && user.password == password) {
              loadProjects(currentUser);
              if (user.userType == "Administrator") {
                loadUsers();
                $('#registrationForm').css('display', 'none');
              }
              //Sets the persistent session data, to be checked and loaded on reload of the page (index.html)
              localStorage.setItem('LoginStatus', 'loggedIn');
              localStorage.setItem('LoggedInUser', currentUser);
              localStorage.setItem('CurrentPassword', password);
            } else {
              count = count + 1;
              if (count == data.Count && localStorage.getItem('LoginStatus') != 'loggedIn') {
                alert("Incorrect username or password");
                //exit;
              }
            }
          });
        }
      })
    }

    function loadProjects(usernameRef) {
      alert("tester");
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
          $('#title2').html('<h2>Logged In as ' + usernameRef + '</h2>');*/
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
}(jQuery));
