'use strict';

const e = React.createElement;
loadProjects();

class RegisterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'Registered';
    }

    return e(
      'btn',
      { onClick: () => this.setState({ liked: true }) },
      'Register'
    );
  }
}

const registerButtonContainer = document.querySelector('#register_button_container');
ReactDOM.render(e(RegisterButton), registerButton);

class LoginButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      //if login = true
      login();
      loadProjects();
      return 'Logged In';
    }

    return e(
      'btn',
      { onClick: () => this.setState({ liked: true }) },
      'Log In'
    );
  }
}

const loginButtonContainer = document.querySelector('#login_button_container');
ReactDOM.render(e(LoginButton), loginButton);

function loadProjects() {
  $.ajax({
    type: 'GET',
    url: 'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/developmentStage/getProjects',

    success: function(data){
      $('#projects').html('');

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
      }
    })
}

function login() {
  $.ajax({
    type: 'POST',
    url: 'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/productionVersion/getProjects',

    success: function(data){
      $('#projects').html('');

      //alert("Logged In");
    }
  })
}
