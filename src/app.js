/*import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';

import awsconfig from './aws-exports';

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
// send analytics events to Amazon Pinpoint
Analytics.configure(awsconfig);

const AnalyticsResult = document.getElementById('AnalyticsResult');
const AnalyticsEventButton = document.getElementById('AnalyticsEventButton');
let EventsSent = 0;
AnalyticsEventButton.addEventListener('click', (evt) => {
    Analytics.record('AWS Amplify Tutorial Event')
        .then( (evt) => {
            const url = 'https://console.aws.amazon.com/pinpoint/home/?region=eu-west-2#/apps/'+awsconfig.aws_mobile_analytics_app_id+'/analytics/events';
            AnalyticsResult.innerHTML = '<p>Event Submitted.</p>';
            AnalyticsResult.innerHTML += '<p>Events sent: '+(++EventsSent)+'</p>';
            AnalyticsResult.innerHTML += '<a href="'+url+'" target="_blank">View Events on the Amazon Pinpoint Console</a>';
        });
});*/

import { Auth } from "aws-amplify";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };


    return (

    );
  }
}
export default App;
