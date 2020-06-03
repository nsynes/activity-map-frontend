import React from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import stravaConnectImg from '../images/btn_strava_connectwith_light.svg';
import './SelectUser.css';
import { API_Domain } from '../config';

const SelectUser = (props) => {
    const { history } = props;

    return(
        <div align='center' style={{width: '100%', height: '100vh', background: 'radial-gradient(80% 80% at center, #ececec, white)'}}>
            <Helmet>
                <meta name='description' content='Web app to display all your Strava activities on a single filterable map.' />
                <meta name="robots" content="index,follow" />
                <title>Activity Map</title>
            </Helmet>
            <h1 id='main-title'>
                Activity Mapping
            </h1>
            <div style={{position:'relative'}}>
                <img
                    id='connect-strava'
                    alt='Connect with Strava'
                    draggable='false'
                    src={stravaConnectImg}
                    onClick={() => window.location.href = `${API_Domain}/auth/strava`} />
                <br/><br/>
                <Button
                    id='view-nick'
                    variant='contained'
                    onClick={() => history.push('/NicksActivities')}>
                    View Nick's Activities
                </Button>
            </div>
            <div style={{maxWidth: 500, paddingTop: '2em'}}>
                <b>Activity highlights:</b>
                <ul>
                    <li><a href='/NicksActivities/Capital%20Ring'>Capital Ring, London</a></li>
                    <li><a href='/NicksActivities/Cotswold%20Way'>Cotswold Way, National Trail</a></li>
                    <li><a href='/NicksActivities/Hadrians%20Wall'>Hadrian's Wall Path, National Trail</a></li>
                    <li><a href='/NicksActivities/Offas%20Dyke'>Offa's Dyke Path, National Trail</a></li>
                    <li><a href='/NicksActivities/South%20Downs%20Way'>South Downs Way, National Trail</a></li>
                    <li><a href='/NicksActivities/Thames%20Path'>Thames Path, National Trail</a></li>
                    <li><a href='/NicksActivities/Dartmoor'>Dartmoor Hike, South -> North</a></li>
                    <li><a href='/NicksActivities/IMW'>Ironman Wales, 2015</a></li>
                </ul>
            </div>
        </div>
    )
}

export default withRouter(SelectUser);