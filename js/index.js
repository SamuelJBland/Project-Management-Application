(function scopeWrapper($) {
  $(document).ready(function() {

    handleSessionState();
    $('#loginForm').submit(handleLogin);
    $('#logOutButton').click(function() {
      if(localStorage.getItem('LoginStatus') == 'loggedIn') { //logs out the user
        localStorage.setItem('LoginStatus', 'loggedOut');
        localStorage.setItem('LoggedInUser', 'N/A');
        location.reload(); //refreshes the page once the user is logged out of the session
        alert("Logged Out");
      }
    });
  });
    //checks if the page is logged in or not, then logs in the user if so
    function handleSessionState() {
      if(localStorage.getItem('LoginStatus') == 'loggedIn') {
        loginUser();
      }
    }
    //sets the local storage values, username and password
    function handleLogin() {
      localStorage.setItem('LoggedInUser', $("#usernameInputLogin").val());
      localStorage.setItem('CurrentPassword', $("#passwordInputLogin").val());
      loginUser();
      alert("Processing");
    }
    //performs field validation on the inputted login values. Implement access control depending on the users' usertype
    function loginUser() {
      $.ajax({
        type: 'GET',
        url:'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/dev/getusers',
        success: function(data){
          var count = 0;
          data.Items.forEach(function(user){
            if (user.userName == localStorage.getItem('LoggedInUser') && user.password == localStorage.getItem('CurrentPassword')) { //loads the projects if both the password and username is correct
              loadProjects();
              $('#createProjectContainer').html(
                '<div class="col-md-6 row" style="margin: 1%;">' +
                  '<div class="card">'+
                    '<button class="btn btn-info" data-toggle="modal" data-target="#createProjectPopUp">' +
                      '<div class="card-body row">' +
                        '<div class="col-md-12">' +
                          '<div class="card-text">' +
                            'Create Project <i class="fas fa-plus-circle"></i>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</button>' +
                  '</div>' +
                '</div>'
              )
              if (user.userType == "Administrator") { //loads the users as well if the user in an administrator
                loadUsers();
                $('#registrationForm').css('display', 'none');
              } else {
                $('#users').append('<h4>' + user.userType + 's cannot view users');
              }
              localStorage.setItem('LoginStatus', 'loggedIn');               //Sets the persistent session data, to be checked and loaded on reload of the page (index.html)
              alert("Logged in as " + localStorage.getItem('LoggedInUser'));
            }
          });
        }
      })
    }
    //Loads the list of projects and appends a div to display each project in a bootstrap 'card'
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
          $('#title2').append('<h2>Logged In as ' + localStorage.getItem('LoggedInUser') + '</h2>');
        }
      })
    }
    //Loads the list of users and appends a div to display each user in a bootstrap 'card'
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
