import React from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import{ handleResponse, cleanActivityData } from '../helpers';
import { API_URL_NicksActivities } from '../config';
import MapAndSideBar from './MapAndSideBar';
import Loading from './Loading';

class Activities extends React.Component {
    constructor(props) {
        super(props);

        const name = props.match.params.name ? props.match.params.name : '';

        this.state = {
            name: name,
            summaryText: '',
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

    setNameFilter = (e) => {
        this.setState({ name: e.target.value })
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

    getActivitySummary = (filterText, filteredActivities) => {
        const names = filteredActivities.map((a) => a.name)
        const types = filteredActivities.map((a) => a.type).filter((v, i, a) => a.indexOf(v) === i)
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
        const summaryText = `${activityTypes.join(', ').replace(/^\w/, c => c.toUpperCase())} activities for "${filterText}": ${names.join(', ')}.`
        if ( filteredActivities.length > 0 && filteredActivities.length <= 20 ) {
            this.setState({ summaryText: summaryText });
        } else {
            this.setState({ summaryText: "" });
        }
    }

    render() {

        const { name, summaryText, allActivities, allActivityTypes, minDateLimit, maxDateLimit, durationLimits } = this.state;

        if ( allActivities.length > 0 ) {
            return (
                <div>
                    {summaryText !== "" &&
                        <Helmet>
                            <meta name='description' content={summaryText} />
                            <meta name ="robots" content="index" />
                            <title>Activity Map {name && name !== '' ? '- '+name : ''}</title>
                        </Helmet>
                    }
                    <MapAndSideBar
                        user={'nick'}
                        name={name}
                        getActivitySummary={this.getActivitySummary}
                        setNameFilter={this.setNameFilter}
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