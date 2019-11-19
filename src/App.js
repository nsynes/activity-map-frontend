import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SelectUser from './components/SelectUser';
import Activities from './components/Activities';
import StravaActivities from './components/StravaActivities';

const App = () => {

    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/" component={SelectUser} exact />
                    <Route path="/NicksActivities" component={Activities} exact />
                    <Route path="/StravaActivities" component={StravaActivities} exact />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


export default App;
