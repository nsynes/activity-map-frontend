import React from 'react';
import { Map as LeafletMap, TileLayer, GeoJSON, Marker, ZoomControl } from 'react-leaflet';
import LocateControl from './LocateControl';
import './LeafletMap.css';
import { getMarkerPin } from './MarkerPin';
import { getColour } from '../helpers';

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            windowHeight: window.innerHeight
        }
    }

    stylePopups = (feature, layer) => {
        const text = `<p>${feature.properties.name}<br/>
                        Date: ${new Date(feature.properties.start_date).toLocaleString('en-GB', {year:'numeric', month:'short',day:'numeric'})}<br/>
                        Distance: ${(feature.properties.distance/1000).toFixed(1)} km</p>`;
        layer.bindPopup(text);
    }

    styleGeoJson = (feature) => {
        const style = {
            opacity: 0.9,
            weight: 3,
            color: getColour(feature.properties.type.toLowerCase()),
            dashArray: this.props.selectedActivity === feature.properties.id ? [1,4] : [1]
        };
        return style;
    }

    render() {
        const { windowHeight } = this.state;
        const { activities, startEndPoints } = this.props;

        const activityGeoJson = [];
        if ( activities.length > 0) {
            activities.forEach((activity, activityIndex) => {
                if ( this.props.filter(activity) ) {
                    activityGeoJson.push(
                        <GeoJSON
                            data={activity}
                            key={activity.properties.id}
                            ref={`geoJson${activityIndex}`}
                            style={this.styleGeoJson}
                            onEachFeature={(feature, layer) => {this.stylePopups(feature, layer)}}
                            onClick={(event) => {this.props.selectActivity(event)}}
                        />
                    )
                }
            })
        }
        var markers = [];
        if (startEndPoints) {
            markers.push(
                <Marker
                    position={startEndPoints[0]}
                    icon={getMarkerPin('green')}
                    key={0} />
            );
            markers.push(
                <Marker
                    position={startEndPoints[1]}
                    icon={getMarkerPin('red')}
                    key={1} />
            );
        }

        return (
            <div style={{width: '100%'}}>
                <LeafletMap
                    ref='map'
                    style={{height: windowHeight}}
                    center={[55.8, -4.5]}
                    zoom={6}
                    maxZoom={19}
                    attributionControl={true}
                    zoomControl={false}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    animate={true}
                    easeLinearity={0.35}
                    onMouseDown={this.props.hideSideBar}
                    onZoomStart={this.props.hideSideBar}
                >
                    <ZoomControl position='bottomright' />
                    <LocateControl />
                    <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    {activityGeoJson.length > 0 && activityGeoJson}
                    {markers}
                </LeafletMap>
            </div>
        );
    }
}

export default Map;