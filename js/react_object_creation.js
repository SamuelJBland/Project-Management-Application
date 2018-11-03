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
ReactDOM.render(e(RegisterButton), registerButtonContainer);

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
ReactDOM.render(e(LoginButton), loginButtonContainer);

function loadProjects() {
  $.ajax({
    type: 'GET',
    url: 'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/productionVersion',

    success: function(data){
      $('#projects').html('');

      data.Items.forEach(function(projectItem){
        //$('#projects').append(
          //'<div class="card"> <tr> <th>'
          //  + projectItem.projectID +
          //'</th> <th>'
          //  + projectItem.projectName +
          //'</th> </tr></div>'



          $('#projects').append(
            '<div class="card">' +
              '<div class="card-body">' +
                '<div class="card-title">' +
                  projectItem.projectName +
                '</div>' +
                '<div class="card-text">' +
                  projectItem.projectName +
                '</div>' +
                '<button class="btn" type="submit" formaction="login()"> <i class="fas fa-edit"></i></button>' +
                '<button class="btn" type="submit" formaction="login()"> <i class="fas fa-trash-alt"></i></button>' +
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
    url: 'https://khpfxud07b.execute-api.eu-west-2.amazonaws.com/productionVersion',

    success: function(data){
      $('#projects').html('');

      alert("Logged In");
    }
  })
}
