function extractData(inputText) {
    const timePattern = /\b\d{2}:\d{2}-\d{2}:\d{2}\b/g;
    const paperPattern = /\b[A-Z]{4}\d{3}\b/g;
    const titlePattern = /\b(?:\d{2}:\d{2}-\d{2}:\d{2}\s+)(.*?)(?=\s+[A-Z]+\d{3}\b)/g;
    const roomPattern = /([A-Z]+\d+)\s+(.*?)\s+(?=\d{2}:\d{2}-\d{2}:\d{2}|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|$)/g;
    const datePattern = /^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/gm;

    const dates = [];
    let match;
    while ((match = datePattern.exec(inputText)) !== null) {
        // find that date in the inputText and get the index
        const index = inputText.indexOf(match[1]);
        // push an object with the date and the index to the dates array
        dates.push({ date: convertDate(match[1]), index });
        
        

    }
    console.log(dates);

    const times = inputText.match(timePattern) || [];
    const typeAndTitles = extractTitleFromTextBlocks(inputText);
    const papers = inputText.match(paperPattern) || [];
    const rooms = extractRoomsFromTextBlocks(inputText);

    const data = [];

    for (let i = 0; i < Math.max(times.length, typeAndTitles.length, papers.length, rooms.length); i++) {
        const start_time = times[i] ? times[i].split("-")[0] : '';
        const end_time = times[i] ? times[i].split("-")[1] : '';
        const type = typeAndTitles[i] ? typeAndTitles[i].split("-")[0].trim() : '';
        const title = typeAndTitles[i] ? typeAndTitles[i].split("-")[1].trim() : '';
        const paper = papers[i] || '';
        const room = rooms[i] || '';

        // mean the index of the whole item in the inputText. time, type, title, paper, room
        const wholeItem = `${start_time}-${end_time} ${type} - ${title}`;
        const itemIndex = inputText.indexOf(wholeItem);
        // console.log(wholeItem);
        console.log(itemIndex);


        let currIndex = itemIndex;
        for (let i = 0; i < dates.length; i++) {
            currIndex = itemIndex;
            while (dates[i].index === currIndex && currIndex > 0) {
                currIndex = currIndex - 1;
            }
        }

        // date = the date that has index as currIndex;
        const date = dates.find(dateObj => dateObj.index === currIndex)?.date;

        data.push({ date, start_time, end_time, type, title, paper, room });
    }

    return data;
}



// function to convert "5 March 2024" to 05/03/2024
function convertDate(date) {
    const months = {
        January: '01',
        February: '02',
        March: '03',
        April: '04',
        May: '05',
        June: '06',
        July: '07',
        August: '08',
        September: '09',
        October: '10',
        November: '11',
        December: '12'
    };
    const [day, month, year] = date.split(' ');
    return `${day.padStart(2, '0')}/${months[month]}/${year}`;
}



function extractTitleFromTextBlocks(inputText) {
    const titlePattern = /\d{2}:\d{2}-\d{2}:\d{2}\s+(.*?)\s+(?=\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)|[A-Z]{4}\d{3}\b)/g;
    const titles = [];
    let match;
    while ((match = titlePattern.exec(inputText)) !== null) {
        titles.push(match[1]);
    }
    return titles;
}

function extractRoomsFromTextBlocks(inputText, index) {
    const roomPattern = /[A-Z]+\d+\s+(.*?)\s+(?=\d{2}:\d{2}-\d{2}:\d{2}|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|$)/g;
    const rooms = [];
    let match;
    while ((match = roomPattern.exec(inputText.substring(index))) !== null) {
        rooms.push(match[1]);
    }

    // Handle the last item separately
    const lastRoomIndex = rooms.length - 1; // Adjusted to get the correct index
    if (lastRoomIndex >= 0) {
        const lastRoomMatch = inputText.match(/\b([A-Z]+\d+)\b/g);
        if (lastRoomMatch && lastRoomMatch.length > lastRoomIndex) {
            rooms[lastRoomIndex] = lastRoomMatch[lastRoomIndex];
        }
    }

    return rooms;
}

function trimTimetableText(text) {
   
}

function upload(){
    // get text from #input-texxt
    const data = document.getElementById('input-text').value;

    // call extractData function
    const result = extractData(data);
    console.log(result);
}
