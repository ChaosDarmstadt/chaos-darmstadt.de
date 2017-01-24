var eventList = []

function Event (start, event) {
    if (!(start instanceof Date)) {
        start = start.toJSDate()
    }
    this.start = start
    this.summary = event.summary || 'No title'
    this.description = event.description
    this.event = event
}

Event.prototype.toHTML = function () {
    var br = document.createElement('br')

    var div_cal = document.createElement('div')
    div_cal.setAttribute('class', 'cal_entry')

    var div_datetime = document.createElement('div')
    var span_date = document.createElement('span')
    span_date.setAttribute('class', 'cal_date')
    span_date.appendChild(document.createTextNode(this.start.toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'})))

    var span_day = document.createElement('span')
    span_day.setAttribute('class', 'cal_day')
    span_day.appendChild((document.createTextNode(this.start.toLocaleDateString([], {weekday: 'long'}))))

    var span_time = document.createElement('span')
    span_time.setAttribute('cass', 'cal_time')
    span_time.appendChild(document.createTextNode(this.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})))

    var span_summary = document.createElement('span')
    span_summary.setAttribute('class', 'cal_summary')
    span_summary.appendChild(document.createTextNode(this.summary))

    div_datetime.appendChild(span_date)
    div_datetime.appendChild(span_day)
    div_datetime.appendChild(span_time)
    div_datetime.setAttribute('class', 'cal_datetime')

    var div_description = document.createElement('div')
    div_description.setAttribute('class', 'cal_descriptionbox')
    div_description.appendChild(span_summary)

    div_cal.appendChild(div_datetime)
    div_cal.appendChild(div_description)

    if (this.description != null) {
        var span_description = document.createElement('span')
        span_description.setAttribute('class', 'cal_description')
        span_description.appendChild(document.createTextNode(this.description))
        div_description.appendChild(span_description)
    }

    return div_cal
}

function parseIcalData(data) {
    var timeRangeStart = new Date()
    var timeRangeStop = new Date()
    timeRangeStart.setHours(0, 0, 0)
    timeRangeStop.setMonth(timeRangeStop.getMonth() + 1)

    var jcalData = ICAL.parse(data)
    var vcalendar = new ICAL.Component(jcalData)
    var events = vcalendar.getAllSubcomponents('vevent')

    events.map(function (e) {
        var event = new ICAL.Event(e)

        if (event.isRecurring()) {
            var expand = event.iterator()
            var next

            while ((next = expand.next()) && next.toJSDate() < timeRangeStop) {
                if (timeRangeStart < next.toJSDate() && next.toJSDate() < timeRangeStop) {
                    eventList.push(new Event(next, event))
                }
            }
        } else if (eventInTimeRange(event, timeRangeStart, timeRangeStop)) {
                eventList.push(new Event(event.startDate, event))
        }
    })
}

function eventInTimeRange(event, start, stop) {
    if (start < event.startDate.toJSDate() && event.startDate.toJSDate() < stop
        || start < event.endDate.toJSDate() && event.endDate.toJSDate() < stop
        || event.startDate.toJSDate() < start && stop < event.endDate.toJSDate()) return true
    return false
}

function orderEvents() {
    eventList.sort(function (e1, e2) {
        return e1.start - e2.start
    })
}

function writeEvents() {
    var cal = document.getElementById('calendar')
    cal.textContent = ''

    if (eventList.length > 0) {
        eventList.map(function (e) {
            cal.appendChild(e.toHTML())
        })
    } else {
        cal.textContent = 'No events found.'
    }
}

function xhrRequest(url, callback, fail) {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                callback(xhr.responseText)
            } else {
                fail(xhr.status)
            }
        }
    }

    xhr.open('GET', url)
    xhr.send()
}

function processData(data) {
    parseIcalData(data)
    orderEvents()
    writeEvents()
}

function requestFailed(status) {
    document.getElementById('calendar').textContent = 'Something has gone wrong. Try reloading the page.'
}

xhrRequest('https://davical.darmstadt.ccc.de/public.php/cda/public/', processData, requestFailed)