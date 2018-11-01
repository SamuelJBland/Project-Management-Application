'use strict';

const e = React.createElement;

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
      'Register In'
    );
  }
}

const domContainer = document.querySelector('#register_button_container');
ReactDOM.render(e(RegisterButton), domContainer);
