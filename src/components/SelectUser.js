import React from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import stravaConnectImg from '../images/btn_strava_connectwith_light.svg';
import './SelectUser.css';
import { API_Domain } from '../config';

const SelectUser = (props) => {
    const { history } = props;

    return(
        <div align='center'>
            <div style={{paddingTop: '20%'}}>
                <Button
                    variant='contained'
                    onClick={() => history.push('/NicksActivities')}>
                    View Nick's Activities
                </Button>
                <br/><br/>
                <img
                    id='connect-strava'
                    alt='Connect with Strava'
                    draggable='false'
                    src={stravaConnectImg}
                    onClick={() => window.location.href = `${API_Domain}/auth/strava`} /></div>
        </div>
    )
}

export default withRouter(SelectUser);