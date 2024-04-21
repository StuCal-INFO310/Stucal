/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '1023665178041-i9olk6ukqg3rbh9056b8n2cecgj3slb5.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAm1NQfolp2ofAGFtTNWEDl7TfzTwBZ-d8';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar';

// TODO: Change this back to 'primary'
var current_calendar_id = 'fe37442ef0332cbc52ec1e0e61f1b966e5b7e3c5d4c1ab0ce860789253b2bc38@group.calendar.google.com';
var gcal_events = [];

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';
// document.getElementById('sync_calendar_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [ DISCOVERY_DOC ],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }

        // Store the token in local storage 
        localStorage.setItem('gapi_token', JSON.stringify(resp));

        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('sync_calendar_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
    };

    let token = localStorage.getItem('gapi_token');
    if (token) {
        // If token is stored in local storage, use it to authenticate
        try {
            gapi.client.setToken(JSON.parse(token))
            listUpcomingEvents();
            syncCalendar();
            return;
        } catch (err) {
            console.error(err);
            tokenClient.requestAccessToken({ prompt: 'consent' });
        }
    }

    // Otherwise request a new token
    tokenClient.requestAccessToken({ prompt: 'consent' });
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
async function listUpcomingEvents() {
    let response;
    try {
        const request = {
            'calendarId': current_calendar_id,
            'timeMin': (new Date("2024")).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 100,
            'orderBy': 'startTime',
        };
        response = await gapi.client.calendar.events.list(request);
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }

    const events = response.result.items;
    if (!events || events.length == 0) {
        document.getElementById('content').innerText = 'No events found.';
        return;
    }
    // Flatten to string to display
    const output = events.reduce(
        (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
        'Events:\n');
    document.getElementById('content').innerText = output;
}

async function syncCalendar() {
    let dropdown = document.getElementById('calendar_dropdown');
    let user_calendars = []

    // List all calendars in the user's profile and the calendar_id
    let res = await gapi.client.calendar.calendarList.list(); 
    let all_calendars = res.result.items;

    all_calendars.forEach((calendar) => {
        if (calendar.accessRole == "owner") {
            let summary = calendar.summary;
            let id = calendar.id;
            let obj = {summary: summary, id: id};
            user_calendars.push(obj);
        }
    }); 

    // Populate the dropdown with the user's calendars
    user_calendars.forEach((calendar) => {
        let option = document.createElement('option');
        option.value = calendar.id;
        option.text = calendar.summary.trim();
        dropdown.appendChild(option);
    }); 

    // Display all the events on the page 
    listUpcomingEvents();    
}

let addEvents = async () => {
    let events = extractData(text);
    gcal_events = [];

    // Creating google calendar events for all the events
    events.forEach((event) => {
        try {
            let startDateTime = `${event.date} ${event.start_time}`;
            let endDateTime = `${event.date} ${event.end_time}`;

            let gcal_event = {
                summary: `${event.type}: ${event.title}`,
                location: event.location,
                description: `Code: ${event.code}`,
                start: {
                    dateTime: moment(startDateTime, "DD/MM/YYYY HH:mm").toDate(),
                    timeZone: 'Pacific/Auckland'
                },
                end: {
                    dateTime: moment(endDateTime, "DD/MM/YYYY HH:mm").toDate(),
                    timeZone: 'Pacific/Auckland'
                }, 
                transparency: 'transparent'
            }   

            gcal_events.push(gcal_event);

        } catch (err) {
            // Possible invalid date format
            console.log(err);
            console.log("startDateTime: ", startDateTime, "endDateTime: ", endDateTime);
        }
    });

    // Check if the user is logged in
    let token = localStorage.getItem('gapi_token');
    if (!token) {
        console.log("User not logged in.");
        return;
    }

    // Iterate over all gcal_events and add them to the calendar if they are not already present
    gcal_events.forEach(async (event) => {

        // Check if the current event is in the calendar
        let response = await gapi.client.calendar.events.list({
            'calendarId': current_calendar_id,
            'timeMin': event.start.dateTime.toISOString(),
            'q': event.summary, // Search for events with the same summary
            'singleEvents': true,
            'orderBy': 'startTime',
        }).then((response) => {
            return response;
        }).catch((err) => {
            console.error(err);
        });

        // Checking if the event already exists in the calendar
        let events = response.result.items;
        let eventExists = events.some(fetchedEvent =>
            fetchedEvent.summary === event.summary &&
            moment(fetchedEvent.start.dateTime, "YYYY/MM/DD HH:mm:ss").toDate().getTime() === new Date(event.start.dateTime).getTime() &&
            moment(fetchedEvent.end.dateTime, "YYYY/MM/DD HH:mm:ss").toDate().getTime() === new Date(event.end.dateTime).getTime()
        );

        // Add the event if it does not exist
        if (!eventExists) {
            let request = {
                'calendarId': current_calendar_id,
                'resource': event
            };

            // Adding the event to the calendar
            gapi.client.calendar.events.insert(request)
                .then((res) => console.log("Event added to calendar."))
                .catch((err) => {
                    console.error(err);
                    console.log("Error adding event to calendar.", event);
                });
        }

        console.log("Events added to calendar.")
    });

}

let deleteAllEvents = () => {
    // Iterate over all gcal_events and delete them from the calendar
    gcal_events.forEach(async (event) => {
        let response = await gapi.client.calendar.events.list({
            'calendarId': current_calendar_id,
            'timeMin': event.start.dateTime.toISOString(),
            'timeMax': event.end.dateTime.toISOString(),
            'q': event.summary, // Search for events with the same summary
            'singleEvents': true,
            'orderBy': 'startTime',
        });

        let events = response.result.items;
        events.forEach(async (existingEvent) => {
            let request = {
                'calendarId': current_calendar_id,
                'eventId': existingEvent.id
            };
            gapi.client.calendar.events.delete(request).then((response) => {
                console.log(response);
            });
        });
    });

}; 

let setCalendarId = () => {
    let dropdown = document.getElementById('calendar_dropdown');
    current_calendar_id = dropdown.options[dropdown.selectedIndex].value;
    console.log("Calendar ID: " + current_calendar_id);
}

let downloadAllicsFiles = async (gcal_events) => {
    // TODO: Work in progress

    // Using axios make a call to the backend to download the ics files
    let response = await axios.post('/download', {
        events: gcal_events
    });

    // Download the ics files
    let data = response.data;
    let zip = new JSZip();
    data.forEach((file) => {
        zip.file(file.name, file.data);
    });

    zip.generateAsync({ type: "blob" })
        .then((content) => {
            saveAs(content, "events.zip");
        });
}

