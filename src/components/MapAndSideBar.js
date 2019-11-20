import React from 'react';
import { withRouter } from 'react-router-dom';
import SideBar from './SideBar';
import Map from './LeafletMap';

class MapAndSideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sideBar: true,
            activityTypes: props.allActivityTypes,
            date: {min: props.minDateLimit, max: props.maxDateLimit},
            duration: props.durationLimits,
            name: '',
            selectedActivity: null,
            startEndPoints: null
        };
    }

    filterType = (activity) => {
        return this.state.activityTypes.indexOf(activity.properties.type.toLowerCase()) > -1
    }

    filterDate = (activity) => {
        const activityDate = activity.properties.start_date;
        return ( activityDate >= this.state.date.min ) && ( activityDate <= this.state.date.max );
    }

    filterDuration = (activity) => {
        const duration = activity.properties.moving_time_mins;
        return ( duration >= this.state.duration.min ) && ( duration <= this.state.duration.max );
    }

    filterName = (activity) => {
        const parts = this.state.name.toLowerCase().replace('\'','').replace('-','').split(' ');
        return parts.every(function(part) {
            return part.length === 0 ? true : activity.properties.name.toLowerCase().replace('\'','').replace('-','').indexOf(part) > -1;
        });
    }

    filter = (a) => {
        return this.filterType(a) && this.filterDate(a) && this.filterDuration(a) && this.filterName(a);
    }

    setMinDate = (min) => {
        let date = this.state.date;
        date.min = min;
        this.setState({ date: date });
    }

    setMaxDate = (max) => {
        let date = this.state.date;
        date.max = max;
        this.setState({ date: date });
    }

    setDuration = (value) => {
        const { min, max } = this.props.durationLimits;
        if ( value.min >= min && value.max <= max ) {
            this.setState({ duration: value })
        }
    }

    setNameFilter = (e) => {
        this.setState({ name: e.target.value })
    }

    handleActivityTypeChange = (e, {value}) => {
        this.setState({ activityTypes: value })
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

    render() {

        const { sideBar, activityTypes, date, duration, name, selectedActivity, startEndPoints } = this.state;

        return (
            <div>
                <SideBar
                    sideBar={sideBar}
                    date={date}
                    duration={duration}
                    name={name}
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
                    setNameFilter={this.setNameFilter}
                    toggleSideBar={this.toggleSideBar}
                    zoomToActivities={this.zoomToActivities} />
                <Map
                    ref='mapContainer'
                    activityTypes={activityTypes}
                    date={date}
                    duration={duration}
                    name={name}
                    activities={this.props.allActivities}
                    filter={this.filter}
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