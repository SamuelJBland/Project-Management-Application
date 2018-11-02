'use strict';

const e = React.createElement;

class ProjectsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      loggedIn();
      return 'Logged In';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Log In'

    );
  }
}



class LoginButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {


      const projectsDisplayContainer = document.querySelector('#projectsContainer');
      ReactDOM.render(e(projectsContainer), projectsDisplayContainer);
      return 'You Logged In.';
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

class RegisterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You registered.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Register'
    );
  }
}

const registerButtonContainer = document.querySelector('#register_button_container');
ReactDOM.render(e(RegisterButton), registerButtonContainer);
