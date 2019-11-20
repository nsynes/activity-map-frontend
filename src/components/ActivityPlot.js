import React from 'react';
import { withRouter } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { handleResponse } from '../helpers';
import { API_URL_NicksStreams, API_URL_StravaStreams } from '../config';
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
            grade_smooth: null
        }
    }
    componentDidUpdate = (prevProps) => {
        //console.log('componentDidUpdate props', prevProps.selectedActivity, this.props.selectedActivity)
        if (this.props.selectedActivity !== prevProps.selectedActivity) {
            this.setState({loading: true});
            this.getActivityStreams(this.props.selectedActivity);
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //console.log('shouldComponentUpdate props', nextProps, this.props)
        //console.log('shouldComponentUpdate state', nextState, this.state)
        return true
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
        const { time, distance, altitude, velocity_smooth, heartrate, cadence, watts, temp, moving, grade_smooth, loading } = this.state;

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
                            b: 30,
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
            </div>
        )
    }
}

export default withRouter(ActivityPlot);