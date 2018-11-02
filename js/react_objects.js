'use strict';

const createElement = React.createElement;

class ProjectsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      //return 'Logged In';
      return 'PROJECTS';
    }

    return createElement(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Login'
    );
  }
}

class RegisterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'Registered';
    }

    return createElement(
      'button',
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
      return 'test';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Log In'
    );
  }
}

const loginButtonContainer = document.querySelector('#login_button_container');
ReactDOM.render(e(LoginButton), loginButtonContainer);

//const projectsDisplayContainer = document.querySelector('#projectsContainer');
//ReactDOM.render(e(ProjectsContainer), projectsDisplayContainer);

//function createProjectsContainer() {
  //const projectsDisplayContainer = document.querySelector('#projectsContainer');
  //ReactDOM.render(e(ProjectsContainer), projectsDisplayContainer);
  //document.getElementByID(projectsContainer).style.display = "inline";
  //return true;
//}
