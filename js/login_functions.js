'use strict';

const e = React.createElement;

class LoginButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You Logged In.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Log In'
    );
  }
}

const domContainer = document.querySelector('#login_button_container');
ReactDOM.render(e(LoginButton), domContainer);
