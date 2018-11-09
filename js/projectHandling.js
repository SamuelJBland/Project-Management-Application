/*global _config AmazonCognitoIdentity AWSCognito*/

var ProjectManagementApp = window.projectManagementApp || {};

(function scopeWrapper($) {

    $(function onDocReady() {
        $('#createProjectForm').submit(createProjectHandler);
        //$('#editProjectForm').submit(editProjectHandler);
    });

    function createProjectHandler() {
      alert("create");


      $.ajax({
        type: 'GET',
        url:'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/dev/getprojects',

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

}(jQuery));
