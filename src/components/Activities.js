import React from 'react';
import { withRouter } from 'react-router-dom';
import{ handleResponse, cleanActivityData } from '../helpers';
import { API_URL_NicksActivities } from '../config';
import MapAndSideBar from './MapAndSideBar';
import Loading from './Loading';

class Activities extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allActivities: [],
            allActivityTypes: [],
            minDateLimit: '',
            maxDateLimit: '',
            durationLimits: {min: '', max: ''}
        };
    }

    componentDidMount = () => {
        this.fetchActivities();
    }

    fetchActivities = () => {

        fetch(API_URL_NicksActivities)
            .then(handleResponse)
            .then((result) => {
                const activities = cleanActivityData(result.activities)
                var activityTypes = [];
                var minDate = new Date();
                var minMovingTime = 60; //minutes
                var maxMovingTime = 0;
                if ( activities.length > 0) {
                    activities.forEach(activity => {
                        const activityDate = activity.properties.start_date;
                        minDate = activityDate < minDate ? activityDate : minDate;
                        const movingTime = activity.properties.moving_time_mins;
                        minMovingTime = movingTime < minMovingTime ? movingTime : minMovingTime;
                        maxMovingTime = movingTime > maxMovingTime ? movingTime : maxMovingTime;
                        if ( activityTypes.indexOf(activity.properties.type.toLowerCase()) === -1 ) activityTypes.push(activity.properties.type.toLowerCase());
                    })
                }
                this.setState({
                    allActivities: activities,
                    allActivityTypes: activityTypes,
                    minDateLimit: minDate,
                    maxDateLimit: new Date(),
                    durationLimits: {min: Math.floor(minMovingTime), max: Math.ceil(maxMovingTime)}
                })
            })
            .catch((error) => {
                console.log('Error', error);
            });
    }

    render() {

        const { allActivities, allActivityTypes, minDateLimit, maxDateLimit, durationLimits } = this.state;

        if ( allActivities.length > 0 ) {
            return (
                <div>
                    <MapAndSideBar
                        allActivities={allActivities}
                        allActivityTypes={allActivityTypes}
                        minDateLimit={minDateLimit}
                        maxDateLimit={maxDateLimit}
                        durationLimits={durationLimits}
                    />
                </div>
            );
        } else {
            return (<div className='loading-container'><Loading width='48px' height='48px' /></div>)
        }
    }
}

export default withRouter(Activities);