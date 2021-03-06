import React from 'react';
import { withRouter } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { handleResponse } from '../helpers';
import { API_URL_NicksStreams, API_URL_StravaStreams, API_URL_GetActivity, API_URL_GetActivityPhotos } from '../config';
import Loading from './Loading';

class ActivityPlot extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            time: null,
            distance: null,
            altitude: null,
            velocity_smooth: null,
            heartrate: null,
            cadence: null,
            watts: null,
            temp: null,
            moving: null,
            grade_smooth: null,
            activityPhotos: []
        }
    }
    componentDidUpdate = (prevProps) => {
        //console.log('componentDidUpdate props', prevProps.selectedActivity, this.props.selectedActivity)
        if (this.props.selectedActivity !== prevProps.selectedActivity) {
            this.setState({loading: true});
            this.getActivityStreams(this.props.selectedActivity);
            //this.getActivity(this.props.selectedActivity)
            this.getActivityPhotos(this.props.selectedActivity)
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //console.log('shouldComponentUpdate props', nextProps, this.props)
        //console.log('shouldComponentUpdate state', nextState, this.state)
        return true
    }

    getActivity = (id) => {
        fetch(`${API_URL_GetActivity}/${id}`, {  credentials: 'include' })
            .then(handleResponse)
            .then((result) => {
                console.log('getActivity', result)
            })
    }

    getActivityPhotos = (id) => {
        fetch(`${API_URL_GetActivityPhotos}/${id}`, {  credentials: 'include' })
            .then(handleResponse)
            .then((result) => {
                console.log('photos', result)
                this.setState({activityPhotos: result.map((photoObj) => photoObj.urls[600])})
            })
    }

    getActivityStreams = (id) => {
        const streamsURL = this.props.location.pathname.indexOf('NicksActivities') > -1 ? API_URL_NicksStreams : API_URL_StravaStreams;
        fetch(`${streamsURL}/${id}`, {  credentials: 'include' })
            .then(handleResponse)
            .then((result) => {
                //console.log('result', result)
                this.setState({
                    loading: false,
                    time: result.time,
                    distance: result.distance,
                    altitude: result.altitude,
                    velocity_smooth: result.velocity_smooth,
                    heartrate: result.heartrate,
                    cadence: result.cadence,
                    watts: result.watts,
                    temp: result.temp,
                    moving: result.moving,
                    grade_smooth: result.grade_smooth
                })
            })
            .catch((error) => {
                console.log('stream ERROR', error)
            });
    }

    render() {
        const { loading, distance, altitude } = this.state; //time, velocity_smooth, heartrate, cadence, watts, temp, moving, grade_smooth } = this.state;

        const photos = this.state.activityPhotos.map((photoUrl, index) => {
            return <img alt={{index}} key={{index}} src={photoUrl} style={{ position: 'relative', width: '100%' }}></img>
        });

        return(
            <div>
                { loading && <div className='loading-container'><Loading
                    width='36px'
                    height='36px' /></div> }
                { !loading && this.props.selectedActivity && <Plot
                    className="plotly-graph"
                    data={[
                    {type: 'line',
                    x: distance,
                    y: altitude,
                    orientation: 'v'
                    }]}
                    useResizeHandler
                    layout={ {
                        margin: {
                            l: 30,
                            r: 30,
                            b: 50,
                            t: 0,
                            pad: 0
                        },
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        title: '',
                        yaxis: {
                            fixedrange: true
                        },
                        xaxis : {
                            fixedrange: true
                        },
                        autosize: true
                    } }
                    style={{ position: 'relative', width: '100%', top: '1em' }}
                    config={ {displayModeBar: false} }
                    /> }
                    { this.state.activityPhotos.length > 0 && photos}
            </div>
        )
    }
}

export default withRouter(ActivityPlot);