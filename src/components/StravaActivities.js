import React from 'react';
import{ handleResponse, cleanActivityData } from '../helpers';
import { API_URL_StravaActivities, API_URL_StravaPhoto } from '../config';
import MapAndSideBar from './MapAndSideBar';
import Loading from './Loading';

class StravaActivities extends React.Component {
    constructor() {
        super();
        this.state = {
            allActivities: [],
            allActivityTypes: [],
            minDateLimit: new Date(),
            maxDateLimit: new Date(),
            durationLimits: {min: 60, max: 0},
            photo: ''
        };
    }

    componentDidMount = () => {
        this.fetchUserPhoto();
        this.fetchActivities(0);
    }

    fetchUserPhoto = () => {
        fetch(`${API_URL_StravaPhoto}`, {  credentials: 'include' })
            .then(handleResponse)
            .then((result) => {
                this.setState({photo: result.photo})
            })
            .catch((error) => {
                this.setState({photo: ''})
            });
    }

    fetchActivities = (page) => {

        fetch(`${API_URL_StravaActivities}?page=${page}`, {  credentials: 'include' })
            .then(handleResponse)
            .then((result) => {
                //console.log(page, result)
                var { allActivities, allActivityTypes, minDateLimit, maxDateLimit, durationLimits } = this.state
                const newActivities = cleanActivityData(result.activities);
                var minMovingTime = durationLimits.min;
                var maxMovingTime = durationLimits.max;
                if ( newActivities.length > 0) {
                    newActivities.forEach(activity => {
                        const activityDate = activity.properties.start_date;
                        minDateLimit = activityDate < minDateLimit ? activityDate : minDateLimit;
                        const movingTime = activity.properties.moving_time_mins;
                        minMovingTime = movingTime < minMovingTime ? movingTime : minMovingTime;
                        maxMovingTime = movingTime > maxMovingTime ? movingTime : maxMovingTime;
                        if ( allActivityTypes.indexOf(activity.properties.type.toLowerCase()) === -1 ) allActivityTypes.push(activity.properties.type.toLowerCase());
                    })
                    //console.log('state', this.state) //NEED TO MAKE SURE THAT WHEN NEW ACTIVITIES ADDED, child components update
                    // so that dates, duration controls (etc) are set at limits (unless user has already interacted with them?)
                    this.setState({
                        allActivities: allActivities.concat(newActivities),
                        allActivityTypes: allActivityTypes,
                        minDateLimit: minDateLimit,
                        maxDateLimit: maxDateLimit,
                        durationLimits: {min: Math.floor(minMovingTime), max: Math.ceil(maxMovingTime)}
                    })
                }
                if ( !result.finished ) this.fetchActivities(page+1)
            })
            .catch((error, other) => {
                console.log('Error fetching activities', error);
                window.location.href='/'
            });
    }

    render() {

        const { allActivities, allActivityTypes, minDateLimit, maxDateLimit, durationLimits, photo } = this.state;

        if ( allActivities.length > 0 ) {
            return (
                <div>
                    <MapAndSideBar
                        allActivities={allActivities}
                        allActivityTypes={allActivityTypes}
                        minDateLimit={minDateLimit}
                        maxDateLimit={maxDateLimit}
                        durationLimits={durationLimits}
                        photo={photo}

                    />
                </div>
            );
        } else {
            return (<div className='loading-container'><Loading width='36px' height='36px' /></div>)
        }
    }
}

export default StravaActivities;