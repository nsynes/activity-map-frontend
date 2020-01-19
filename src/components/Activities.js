import React from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import{ handleResponse, cleanActivityData } from '../helpers';
import { API_URL_NicksActivities, API_URL_StravaActivities, API_URL_StravaPhoto } from '../config';
import MapAndSideBar from './MapAndSideBar';
import Loading from './Loading';

class Activities extends React.Component {
    constructor(props) {
        super(props);

        const name = props.match.params.name ? props.match.params.name : '';
        const user = props.location.pathname.indexOf('NicksActivities') > -1 ? 'nick' : 'strava';
        const filterByURL = props.match.params.name ? true : false;

        this.state = {
            user: user,
            filterByURL: filterByURL,
            name: name,
            summaryText: '',
            allActivities: [],
            allActivityTypes: [],
            minDateLimit: new Date(),
            maxDateLimit: new Date(),
            durationLimits: {min: 0, max: 0},
            allActivitiesLoaded: false
        };
    }

    componentDidMount = () => {
        if ( this.state.user !== 'nick' ) this.fetchUserPhoto();
        this.fetchActivities(0);
    }

    setNameFilter = (e) => {
        this.setState({ name: e.target.value })
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

        const activitiesURL = this.state.user === 'nick' ? API_URL_NicksActivities : `${API_URL_StravaActivities}?page=${page}`;

        fetch(activitiesURL, {  credentials: 'include' })
            .then(handleResponse)
            .then((result) => {

                var { allActivities, allActivityTypes, minDateLimit, maxDateLimit, durationLimits } = this.state
                const newActivities = cleanActivityData(result.activities);
                var minMovingTime = durationLimits.min; //minutes
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
                }
                this.setState({
                    allActivities: allActivities.concat(newActivities),
                    allActivityTypes: allActivityTypes,
                    minDateLimit: minDateLimit,
                    maxDateLimit: maxDateLimit,
                    durationLimits: {min: Math.floor(minMovingTime), max: Math.ceil(maxMovingTime)}
                })
                if ( !result.finished ) {
                    this.fetchActivities(page+1)
                } else {
                    this.setState({allActivitiesLoaded: true})
                }
            })
            .catch((error) => {
                console.log('Error fetching activities', error);
                window.location.href='/';
            });
    }

    getActivitySummary = (filterText, filteredActivities) => {
        if ( this.state.user === 'nick' ) {
            const names = filteredActivities.map((a) => a.properties.name)
            const types = filteredActivities.map((a) => a.properties.type).filter((v, i, a) => a.indexOf(v) === i)
            const activityTypeConversion = {
                hike: 'hiking',
                walk: 'walking',
                run: 'running',
                ride: 'cycling',
                swim: 'swimming'
            }
            const activityTypes = types.map((t) => {
                return activityTypeConversion[t.toLowerCase()]
            })
            const summaryText = `${activityTypes.join(', ').replace(/^\w/, c => c.toUpperCase())} activities for "${filterText}": ${names.join('; ')}.`
            if ( filteredActivities.length > 0 && filteredActivities.length <= 20 ) {
                this.setState({ summaryText: summaryText });
            } else {
                this.setState({ summaryText: '' });
            }
        }

    }

    render() {

        const { name, user, allActivitiesLoaded, filterByURL, summaryText, allActivities, allActivityTypes, minDateLimit, maxDateLimit, durationLimits, photo } = this.state;

        return (
            <div>
                {summaryText !== '' &&
                    <Helmet>
                        <meta name='description' content={`Web app to display all your Strava activities on a single filterable map. ${summaryText}`} />
                        <meta name ="robots" content="index" />
                        <title>Activity Map {name && name !== '' ? `- ${name}` : ''}</title>
                    </Helmet>
                }
                {!allActivitiesLoaded && <div title='Still loading activities from Strava...' className='activities-loading'><Loading
                    width='36px'
                    height='36px' /></div>}
                <MapAndSideBar
                    user={user}
                    name={name}
                    filterByURL={filterByURL}
                    getActivitySummary={this.getActivitySummary}
                    setNameFilter={this.setNameFilter}
                    allActivities={allActivities}
                    allActivityTypes={allActivityTypes}
                    minDateLimit={minDateLimit}
                    maxDateLimit={maxDateLimit}
                    durationLimits={durationLimits}
                    photo={photo}
                />
            </div>
        );
    }
}

export default withRouter(Activities);