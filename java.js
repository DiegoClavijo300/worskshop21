// reference to api
const baseURL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-ftb-et-web-pt'

// get events
async function getEvent() {
    const response = await fetch(`${baseURL}/events`);
    const json = await response.json();

    if(!json.success) {
        throw new Error(json.error);
    }

    return json.data;
}

// create new event
async function createEvent(event) {
    const response = await fetch(`${baseURL}/events`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event),
    });
    const json = await response.json();

    if(!json.success) {
        throw new Error(json.error.message);
    }

    return json.data;
}

// delete event
async function deleteEvent(id) {
    const response = await fetch(`${baseURL}/events/${id}`, {
        method: 'delete'
    });

    if(response.status === 204) {
        return true;
    }

    throw new Error(`cannot delete ${id}`);
}

//add events to the screen
function addEventScreen(event){
    const eventDiv = document.getElementById('events');
    const singleEvent = document.createElement('div');
        singleEvent.classList.add('event');
    
    const eventName = document.createElement('h1');
    eventName.append(event.name);
    
    const eventDesc = document.createElement('div');
    eventDesc.classList.add('description');
    eventDesc.append(event.description);

    const eventDate = document.createElement('h2');
    eventDate.append(event.date);

    const eventLocation = document.createElement('div');
    eventLocation.classList.add('location');
    eventLocation.append(event.location);

    const eventId = document.createElement('div')
    eventId.classList.add('eventId')
    eventId.append('#'+event.id)

    const deleteBtn = document.createElement('button');
    const deleteText = document.createTextNode('delete event');
    deleteBtn.addEventListener('click', async(event) => {
        const selectedEvent = event.target.closest('.event')
        const id = selectedEvent.querySelector('.eventId').innerText.slice(1)
        //console.log(id)
        deleteEvent(id)
        selectedEvent.remove()

    })
    deleteBtn.appendChild(deleteText);

    singleEvent.appendChild(eventName);
    singleEvent.appendChild(eventDate);
    singleEvent.appendChild(eventLocation);
    singleEvent.appendChild(eventDesc);
    singleEvent.appendChild(eventId)
    singleEvent.appendChild(deleteBtn);
    eventDiv.appendChild(singleEvent);

}    

document.addEventListener('DOMContentLoaded', async () => {
    const events = await getEvent();

    events.forEach(event => {
        addEventScreen(event);
    });
    const form = document.getElementById('eventForm');
    //add event listener to form
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name');
        const description = document.getElementById('description');
        const date = document.getElementById('date');
        const location = document.getElementById('location');


        const addedEvent = {
            name: name.value,
            description: description.value,
            date: date.value,
            location: location.value
        };

        try {
            const newEvent = await createEvent(addedEvent);
            // add the new event to the screen
            addEventScreen(newEvent);
        } catch(err){ 
            console.error(err);
        }
    })

    // add event listener to button
    //const removing= await deleteEvent();

});