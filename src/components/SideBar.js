import React from 'react';
import { withRouter } from 'react-router-dom';
import './SideBar.css';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import Search from '@material-ui/icons/Search';
import { Dropdown } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputRange from 'react-input-range';
import './input-range.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { getColour } from '../helpers';
import UserImage from './UserImage';
import ActivityPlot from './ActivityPlot';
import stravaPoweredImg from '../images/api_logo_pwrdBy_strava_horiz_light.svg';

const SideBar = (props) => {

    const { sideBar, activityTypes, date, minDateLimit, maxDateLimit, durationLimits, duration, name, photo, selectedActivity } = props;

    const dropdownOptions = activityTypes.map(activityType => {
        return {
            key: activityType,
            text: activityType,
            value: activityType,
        }
    })

    const ExampleCustomInput = React.forwardRef((props, ref) => {
        return <Button ref={ref} variant='contained' onClick={props.onClick}>{props.preText} {props.value}</Button>
    });

    const renderActivityLabel = (label) => {
        return {
            color: getColour(label.key),
            content: `${label.text}`
        }
    };

    return (
        <div>
            <div className={`side-bar ${sideBar ? 'visible' : 'hidden'}`}>
                <div style={{float:'left', width:'100%'}}>
                    <div style={{float:'right', width: '20%'}}>
                        <Tooltip title='Zoom to filtered activities'>
                            <Button
                                style={{float:'right', zIndex: 3}}
                                variant='contained'
                                onClick={props.zoomToActivities}><Search fontSize='default'/>
                            </Button>
                        </Tooltip>
                    </div>
                    <div style={{float:'left', width:'80%'}}>
                        <TextField
                            style={{width:'100%', paddingRight: '0.1em'}}
                            type="text"
                            placeholder='keywords'
                            name="name-filter"
                            value={name}
                            onChange={props.setNameFilter}
                            onKeyDown={e => e.key === 'Enter' && props.zoomToActivities(e)} /><br/>
                        <br/>
                        <Dropdown
                            placeholder='Activity type'
                            fluid
                            multiple
                            search
                            selection
                            options={dropdownOptions}
                            defaultValue={activityTypes}
                            onChange={props.handleActivityTypeChange}
                            renderLabel={renderActivityLabel}
                        />
                        <br/>
                        <div className='filter-container'>
                            Activity dates
                            <div>
                                <div style={{float: 'left', padding: '1em'}}>
                                    <DatePicker
                                        dateFormat='dd-MMM-yyyy'
                                        selected={date.min}
                                        onChange={value => props.setMinDate(value)}
                                        dropdownMode="select"
                                        showMonthDropdown
                                        showYearDropdown
                                        customInput={<ExampleCustomInput ref={React.createRef()} preText='from' />}
                                        minDate={minDateLimit}
                                        maxDate={date.max}
                                    />
                                </div>
                                <div id='datepicker-max'>
                                    <DatePicker
                                        dateFormat='dd-MMM-yyyy'
                                        selected={date.max}
                                        onChange={value => props.setMaxDate(value)}
                                        dropdownMode="select"
                                        showMonthDropdown
                                        showYearDropdown
                                        customInput={<ExampleCustomInput ref={React.createRef()} preText='until' />}
                                        minDate={date.min}
                                        maxDate={maxDateLimit}
                                        showDisabledMonthNavigation
                                    />
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className='filter-container'>
                            Activity duration (minutes)
                            <div style={{margin:'1.5em'}}>
                                <InputRange
                                    draggableTrack
                                    maxValue={durationLimits.max}
                                    minValue={durationLimits.min}
                                    onChange={value => props.setDuration(value)}
                                    value={duration}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{float:'left', width:'100%', flexGrow:1}}>
                    <ActivityPlot selectedActivity={selectedActivity} />
                </div>
                <div style={{float:'left', width:'100%'}}>
                    <div style={{float:'left', width:'50%', height:'100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
                        <div style={{flexGrow:1}}></div>
                        <img
                            alt='Strava API'
                            draggable='false'
                            style={{position:'relative', width:'60%'}}
                            src={stravaPoweredImg} />
                    </div>
                    <div style={{float:'left', width:'50%'}}>
                        {photo && <UserImage photo={photo} />}
                    </div>
                </div>
            </div>
            <div
                onClick={props.toggleSideBar}
                className={`side-bar-toggle ${sideBar ? 'visible' : 'hidden'}`}>
                {sideBar ? <ArrowLeft className='toggle-arrow' fontSize='large'/> : <ArrowRight className='toggle-arrow' fontSize='large'/>}
            </div>
        </div>
    )
}


export default withRouter(SideBar);