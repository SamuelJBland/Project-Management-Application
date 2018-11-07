'use strict';

const e = React.createElement;
//loadProjects();

class LoginRegisterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      //if login = true
      //login();
      //loadProjects();
      return 'Log Out';
    }

    return e(
      'btn',
      { onClick: () => this.setState({ liked: true }) },
      'Login/Register'
    );
  }
}

const loginRegisterButton = document.querySelector('#loginRegisterButton');
ReactDOM.render(e(LoginRegisterButton), loginRegisterButton);
