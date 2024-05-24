// const supabaseUrl = "https://uncjkpkwhmqigxlwcexc.supabase.co";
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY2prcGt3aG1xaWd4bHdjZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzMTY4OTgsImV4cCI6MjAyNjg5Mjg5OH0.nMwtflu4l78vmFGJ4_V3LpFMLoa23UbBu22evPTwiow";
// const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

const populatePublicEvents = async () => {
    const publicEvents = document.getElementById('public-events');

    // Delete all children of the public events container
    while (publicEvents.firstChild) {
        publicEvents.removeChild(publicEvents.firstChild);
    }

    // Get all of the user's events 
    const allUserEvents = await getAllUserEvents(); 
    const allUserEventsTitles = allUserEvents.map(event => event.title);
    // Convert the array of event titles into a set for faster lookup
    const allUserEventsSet = new Set(allUserEventsTitles);

    // Retrieve public events from JSON file (../../public/data/events.json)
    fetch('../public/data/events.json')
        .then((response) => response.json())
        .then((data) => {
            data = data.flat;

            for (const [ eventDate, eventTitle ] of Object.entries(data)) {
                // Exclude events that have already passed
                if (new Date(eventDate) < new Date()) {
                    continue;
                }

                // Convert date into a human-readable format
                const eventDateReadable = new Date(eventDate).toLocaleDateString('en-UK', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });

                // Check if the event is already in the user's calendar
                const added = allUserEventsSet.has(eventTitle);

                const eventCard = buildCardComponent(added, eventTitle, eventDate, eventDateReadable);
                publicEvents.innerHTML += eventCard;
            }
        })
        .catch((error) => {
            console.error('Error fetching public events:', error);
        });

}

const buildCardComponent = (added, eventTitle, eventDate, eventDateDisplay) => {
    let buttonText = added ? 'Added to Calendar' : 'Add Event to Calendar';
    let buttonColor = added ? 'bg-green-400' : 'bg-white';
    let buttonHoverColor = added ? '' : 'hover:bg-gray-200';
    let buttonHoverCursor = added ? 'cursor-default' : 'cursor-pointer';
    // reomve all ' and " from the event title
    eventTitle = eventTitle.replace(/['"]+/g, '');
    let buttonOnClick = added ? '""' : `addEventToUsersCalendar('${eventTitle}', '${eventDate}')`;

    let buttonIcon = added ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>`
         : '';


    return `<div class="flex flex-column justify-between bg-gray-900 p-10 my-3 rounded-xl">
                <div class="flex flex-col items-start justify-start">
                    <p class="text-gray-400">${eventDateDisplay}</p>
                    <h2 class="text-3xl font-bold tracking-tight text-white pt-2 sm:text-4xl">
                        ${eventTitle}
                    </h2>
                </div>
                <div class="flex items-center justify-end gap-2">
                    <a href="#" onclick="${buttonOnClick}"
                        class="text-sm font-semibold text-gray-900 rounded-md px-3.5 py-2.5 ${buttonColor} shadow-sm ${buttonHoverCursor} ${buttonHoverColor} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        ${buttonText}
                    </a>
                </div>
            </div>`
}

const addEventToUsersCalendar = async (eventTitle, eventDate) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user.id;

    // Check if the calendar event is already in the database (should always be true)
    if (!eventExistsInDatabase(eventTitle, eventDate, userId)) {
        Toast.fire({
            icon: 'error',
            title: 'Event not in the database!'
        });
        return;
    }

    // debugger;
    // Try to insert the event into the user's calendar
    const { data, error } = await insertEventIntoCalendar(eventTitle, eventDate, userId);

    if (error) {
        console.error('Error inserting event into database:', error);
        Toast.fire({
            icon: 'error',
            title: `${error.message}`
        });
        return; 
    } 

    Toast.fire({
        icon: 'success',
        title: 'Event added to your calendar!'
    });

    // Refresh the public events
    populatePublicEvents();
}

const eventExistsInDatabase = async (eventTitle, eventDate, userId) => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('title', eventTitle.replace(/['"]+/g, ''))
        .eq('date', eventDate)
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching event from database:', error);
        return false;
    }

    return data.length > 0;
}

const insertEventIntoCalendar = async (eventTitle, eventDate, userId) => {
    const title = eventTitle.replace(/['"]+/g, '');
    const location = '362 Leith Street, Dunedin North, Dunedin 9016';
    
    // Convert the date from YYYY-MM-DD to DD/MM/YYYY
    let date = new Date(eventDate);
    date = date.toLocaleDateString('en-UK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const start_time = '00:00';
    const end_time = '11:59';
    const type = 'public';
    const user_id = userId;
    const username = await getUserUsername();


    return await supabase.from('events').insert([
        { title, location, date, start_time, end_time, type, user_id, username }
    ]);
}

const getUserUsername = async () => {
    const user = await supabase.auth.getUser();
    const userEmail = user.data.user.email;


    const { data, error } = await supabase
        .from('users')
        .select('custom_id')
        .eq('email', userEmail);

    if (error) {
        console.error('Error fetching user from database:', error);
        return null;
    }
    
    return data[0].custom_id;
}

const getAllUserEvents = async () => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user.id;

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching user events from database:', error);
        return null;
    }


    return data;
}