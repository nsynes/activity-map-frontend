import React from 'react';
import { withRouter } from 'react-router-dom';
import SideBar from './SideBar';
import Map from './LeafletMap';

class MapAndSideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sideBar: true,
            activitiesToDisplay: props.allActivities.map((a,i) => true),
            activityTypes: props.allActivityTypes,
            date: {min: props.minDateLimit, max: props.maxDateLimit},
            duration: props.durationLimits,
            selectedActivity: null,
            startEndPoints: null,
            zoomedInitially: !props.filterByURL,
        };
    }

    filterType = (activity) => {
        //console.log('-- filterType', this.state.activityTypes, activity.properties.type.toLowerCase())
        return this.state.activityTypes.indexOf(activity.properties.type.toLowerCase()) > -1
    }

    filterDate = (activity) => {
        const activityDate = activity.properties.start_date;
        //console.log('-- filterDate', activityDate, '-', this.state.date.min, '-', this.state.date.max)
        return ( activityDate >= this.state.date.min ) && ( activityDate <= this.state.date.max );
    }

    filterDuration = (activity) => {
        const duration = activity.properties.moving_time_mins;
        //console.log('-- filterDuration', duration, '-', this.state.duration.min, '-', this.state.duration.max)
        return ( duration >= this.state.duration.min ) && ( duration <= this.state.duration.max );
    }

    filterName = (activity) => {
        const parts = this.props.name.toLowerCase().replace('\'','').replace('-','').split(' ');
        return parts.every(function(part) {
            return part.length === 0 ? true : activity.properties.name.toLowerCase().replace('\'','').replace('-','').indexOf(part) > -1;
        });
    }

    displayActivity = (a) => {
        return this.filterType(a) && this.filterDate(a) && this.filterDuration(a) && this.filterName(a);
    }

    filterActivities = () => {
        if ( this.props.allActivities.length > 0) {
            const activitiesToDisplay = this.props.allActivities.map((activity, index) => {
                //console.log('ACTIVITY', activity)
                if ( this.displayActivity(activity) ) {
                    return true;
                } else {
                    return false;
                }
            })
            this.setState({ activitiesToDisplay: activitiesToDisplay })

            if ( !this.state.zoomedInitially && this.props.name && this.props.name !== '' ) {
                this.setState({
                    zoomedInitially: true
                })
                window.requestAnimationFrame(() => {
                    this.zoomToActivities();
                })
            }
        }
    }

    setMinDate = (min) => {
        let date = this.state.date;
        date.min = min;
        this.setState({ date: date }, this.filterActivities);
    }

    setMaxDate = (max) => {
        let date = this.state.date;
        date.max = max;
        this.setState({ date: date }, this.filterActivities);
    }

    setDuration = (value) => {
        const { min, max } = this.props.durationLimits;
        if ( value.min >= min && value.max <= max ) {
            this.setState({ duration: value }, this.filterActivities)
        }
    }

    handleActivityTypeChange = (e, {value}) => {
        this.setState({ activityTypes: value }, this.filterActivities)
    }

    toggleSideBar = () => {
        const sideBar = this.state.sideBar;
        this.setState({
            sideBar: !sideBar
        })
    }

    hideSideBar = () => {
        this.setState({
            sideBar: false
        })
    }

    selectActivity = (event) => {
        if ( event.layer && event.layer.feature && event.layer.feature.properties ) {
            const { id } = event.layer.feature.properties;
            const { coordinates, type } = event.layer.feature.geometry;
            let startPoint, endPoint;
            if ( type === "MultiLineString" ) {
                startPoint = coordinates[0][0];
                endPoint = coordinates[coordinates.length-1][coordinates[coordinates.length-1].length-1];
            } else {
                startPoint = coordinates[0];
                endPoint = coordinates[coordinates.length-1];
            }
            this.setState({
                selectedActivity: id,
                startEndPoints: [[startPoint[1],startPoint[0]], [endPoint[1],endPoint[0]]]
            })
            this.toggleSideBar();
        }
    }


    zoomToActivities = (e) => {
        const { history } = this.props;
        if ( history && this.props.user === 'nick' ) {
            history.push(`/NicksActivities/${this.props.name}`);
            const filteredActivityProperties = this.props.allActivities.filter((a, i) => this.state.activitiesToDisplay[i] ).sort((a, b) => (a.properties.start_date > b.properties.start_date) ? 1 : -1)
            this.props.getActivitySummary(this.props.name, filteredActivityProperties);
        }
        const refs = this.refs.mapContainer.refs;
        var minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
        var newBounds;

        Object.keys(refs).forEach(function(key) {
            if (key[0] !== 'm') {
                const bnds = refs[key].leafletElement.getBounds();
                maxLat = bnds._northEast.lat > maxLat ? bnds._northEast.lat : maxLat;
                maxLon = bnds._northEast.lng > maxLon ? bnds._northEast.lng : maxLon;
                minLat = bnds._southWest.lat < minLat ? bnds._southWest.lat : minLat;
                minLon = bnds._southWest.lng < minLon ? bnds._southWest.lng : minLon;
            } else {
                newBounds = refs[key].leafletElement.getBounds();
            }
        });
        newBounds._northEast.lat = maxLat;
        newBounds._northEast.lng = maxLon;
        newBounds._southWest.lat = minLat;
        newBounds._southWest.lng = minLon;
        refs.map.leafletElement.fitBounds(newBounds);
        this.hideSideBar();
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            date: {min: nextProps.minDateLimit, max: nextProps.maxDateLimit},
            duration: nextProps.durationLimits,
        }, this.filterActivities)

    }

    render() {

        const { sideBar, activitiesToDisplay, activityTypes, date, duration, selectedActivity, startEndPoints } = this.state;

        return (
            <div>
                {this.props.allActivities.length > 0 &&
                <SideBar
                    sideBar={sideBar}
                    date={date}
                    duration={duration}
                    name={this.props.name}
                    photo={this.props.photo}
                    selectedActivity={selectedActivity}
                    activityTypes={this.props.allActivityTypes}
                    minDateLimit={this.props.minDateLimit}
                    maxDateLimit={this.props.maxDateLimit}
                    durationLimits={this.props.durationLimits}
                    handleActivityTypeChange={this.handleActivityTypeChange}
                    setMinDate={this.setMinDate}
                    setMaxDate={this.setMaxDate}
                    setDuration={this.setDuration}
                    setNameFilter={this.props.setNameFilter}
                    toggleSideBar={this.toggleSideBar}
                    zoomToActivities={this.zoomToActivities} />
                }
                <Map
                    ref='mapContainer'
                    activityTypes={activityTypes}
                    date={date}
                    duration={duration}
                    name={this.props.name}
                    allActivities={this.props.allActivities}
                    activitiesToDisplay={activitiesToDisplay}
                    hideSideBar={this.hideSideBar}
                    selectedActivity={selectedActivity}
                    startEndPoints={startEndPoints}
                    selectActivity={this.selectActivity}
                    />
            </div>
        );
    }
}

export default withRouter(MapAndSideBar);