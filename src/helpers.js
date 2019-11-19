import getDistance from 'geodist';

/*
Fetch error helper

@param {object} response
*/

export const handleResponse = (response) => {
    return response.json().then(json => {
        return response.ok ? json : Promise.reject(json);
    });
}

/*
Clean activity data helper:
- create MultiLineString for activities with large segment gaps (due to long paused activities)
- convert start_date to date object
*/
export const cleanActivityData = (activities) => {
    var lineBreaker = {};
    var cleanActivities = [];
    if (activities && activities.length > 0) {
        cleanActivities = activities.map((activity, activityIndex) => {
            activity.geometry.coordinates.forEach((coord, index, coordinates) => {
                const dist = index+1 !== coordinates.length ? getDistance(coord, coordinates[index+1], {unit:'km'}) : 0;
                if ( dist >= 10 ) {
                    lineBreaker[activityIndex] = lineBreaker[activityIndex] ?
                        [lineBreaker[activityIndex][lineBreaker[activityIndex].length-1].slice(0,index+1), lineBreaker[activityIndex][lineBreaker[activityIndex].length-1].slice(index+1,lineBreaker[activityIndex].length)] :
                        [activity.geometry.coordinates.slice(0,index+1), activity.geometry.coordinates.slice(index+1, activity.geometry.coordinates.length)]
                }
            })
            activity.properties.start_date = new Date(activity.properties.start_date);
            activity.properties.moving_time_mins = activity.properties.moving_time/60;
            return activity;
        })
        Object.keys(lineBreaker).forEach(function(activityIndex) {
            cleanActivities[activityIndex].geometry.type = 'MultiLineString';
            cleanActivities[activityIndex].geometry.coordinates = lineBreaker[activityIndex];
        });
    }
    return cleanActivities;

}

export const getColour = (activityType) => {
    switch (activityType) {
        // NOTE not using hex as the dropdown for activity types only handles named colours
        case 'hike': return 'green';//"#006400";
        case 'walk': return 'green';//"#006400";
        case 'run':  return 'blue';//"#0000ff";
        case 'ride': return 'red';//"#ff0000";
        case 'swim': return 'purple';//"#ff0000";
        default:     return 'black';//"#000000";
    }
}