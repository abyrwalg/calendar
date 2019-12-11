import { dateFormatter, dateToString, EventEmitter } from './helpers.js';

class View extends EventEmitter {
  constructor() {
    super();

    this.calendar = document.getElementById('calendar');
    this.dateSpan = document.getElementById('current-month');

    this.nextMonthButton = document.getElementById('next-month');
    this.nextMonthButton.addEventListener('click', this.switchMonthHandler);

    this.previousMonthButton = document.getElementById('previous-month');
    this.previousMonthButton.addEventListener('click', this.switchMonthHandler);

    this.todayButton = document.getElementById('today');
    this.todayButton.addEventListener('click', this.switchMonthHandler);

    this.eventForm = document.getElementById('add-event');
    this.eventForm.addEventListener('submit', this.addEventHandler);
    this.eventFormClose = document.getElementById('close');
    this.eventFormClose.addEventListener('click', this.closeFormHandler);
    this.eventFormDate = document.getElementById('event-date');
    this.eventFormTitle = document.getElementById('event-title');
    this.eventFormParticipants = document.getElementById('event-participants');
    this.eventFormDescription = document.getElementById('event-description');

    this.eventFormRemove = document.getElementById('event-remove');
    this.eventFormRemove.addEventListener('click', this.removeEventHandler);

    this.addEventButton = document.getElementById('add-event-button');
    this.addEventButton.addEventListener('click', this.addEventButtonHandler);

    this.searchField = document.getElementById('search-input');
    this.searchField.value = '';
    this.searchField.addEventListener('keyup', this.searchHandler);
    this.searchField.addEventListener('focus', this.closeFormHandler);
    this.searchBox = document.getElementById('search-box');

    this.currentMonthInput = document.getElementById('date-input');
    this.currentMonthInput.addEventListener('change', this.inputDateHandler);

    this.today = new Date();
    this.days = [];
    this.events = [];
    this.selectedDay = null;
  }


  inputDateHandler = event => {
    if (event.target.value) {
      this.today = new Date(event.target.value);
      this.showCalendar();

      this.selectedDay = document.querySelector(`td[data-date="${dateToString(this.today)}"]`);
      this.selectedDay.classList.add('active');
      this.showEventForm(this.selectedDay.getBoundingClientRect(), dateToString(this.today));
    }
  } 

  searchHandler = event => {
    if (event.target.value === '' && this.searchBox.style.display === 'block') {
      this.closeSearchHandler();
    }
    this.searchBox.style.display = 'none';
    this.emit('search', event.target.value);
  }

  showSearchResults = searchResults => {
    this.searchBox.innerHTML = '';
    if (searchResults.length > 0) {
      this.searchBox.style.display = 'block';
      if (!document.getElementById('overlay')) {
        this.createOverlay(this.closeSearchHandler);
      }
    }
    searchResults.sort((a, b) => new Date(a.date) - new Date(b.date));
    searchResults.forEach(result => {
      const searchResultBox = document.createElement('div');
      searchResultBox.className = 'search-result';
      searchResultBox.dataset.date = result.date;
      searchResultBox.addEventListener('click', this.showEvent);

      const searchResultHeader = document.createElement('h3');
      searchResultHeader.textContent = result.title;

      const searchResultDateSpan = document.createElement('span');
      const monthsNames = 'января, февраля, марта, апреля, мая, июня, июля, август, сентября, октября, ноября, декабря'.split(',');
      const date = new Date(result.date);
      searchResultDateSpan.textContent = `${date.getDate()} ${monthsNames[date.getMonth()]} ${date.getFullYear()}`;

      searchResultBox.appendChild(searchResultHeader);
      searchResultBox.appendChild(searchResultDateSpan);
      this.searchBox.appendChild(searchResultBox);
    });
  }

  closeSearchHandler = () => {
    this.searchBox.style.display = 'none';
    this.searchField.value = '';
    document.body.removeChild(document.getElementById('overlay'));
  }

  showEvent = event => {
    const { date } = event.target.closest('.search-result').dataset;

    this.today = new Date(date);
    this.showCalendar();
    this.closeSearchHandler();

    this.selectedDay = document.querySelector(`td[data-date="${date}"]`);
    this.selectedDay.classList.add('active');
    this.showEventForm(this.selectedDay.getBoundingClientRect(), date);
  }

  addEventButtonHandler = event => {
    const position = event.target.getBoundingClientRect();
    this.selectedDay = null;

    this.eventForm.style.display = 'block';
    this.eventFormDate.style.display = 'block';
    this.eventFormRemove.style.display = 'none';
    this.eventFormDate.required = true;

    this.eventForm.classList.add('button');
    this.eventForm.classList.remove('day');

    this.eventForm.style.left = `${position.x + window.pageXOffset}px`;
    this.eventForm.style.top = `${position.y + 50 + window.pageYOffset}px`;

    this.eventForm.scrollIntoView();
    this.createOverlay(this.closeFormHandler);
  }

  switchMonthHandler = event => {
    if (event.target.id === 'next-month') {
      this.today.setMonth(this.today.getMonth() + 1);
    } else if (event.target.id === 'previous-month') {
      this.today.setMonth(this.today.getMonth() - 1);
    } else if (event.target.id === 'today') {
      this.today = new Date();
    }
    this.showCalendar();
  }

  createOverlay = handler => {
    const overlay = document.createElement('div');
    overlay.style = 'background-color: transparent; position: fixed; top: 0; left:0; right: 0; bottom: 0; display: block;';
    overlay.id = 'overlay';
    overlay.addEventListener('click', handler);
    document.body.appendChild(overlay);
  }

  clearForm = () => {
    this.eventForm.reset();
  }

  calendarClickHandler = event => {
    const position = event.target.getBoundingClientRect();
    const currentDate = event.target.tagName === 'TD'
      ? event.target.dataset.date : event.target.closest('td').dataset.date;

    this.days.forEach(day => day.classList.remove('active'));

    if (event.target.tagName === 'TD') {
      event.target.classList.add('active');
      this.selectedDay = event.target;
    } else {
      const td = event.target.closest('td');
      td.classList.add('active');
      this.selectedDay = td;
    }

    this.showEventForm(position, currentDate);

  }

  showEventForm(position, currentDate) {
    this.eventForm.style.display = 'block';
    this.eventFormDate.style.display = 'none';
    this.eventFormRemove.style.display = 'inline-block';
    this.eventFormDate.required = false;

    this.eventForm.classList.add('day');
    this.eventForm.classList.remove('button');
    const currentEvent = this.events.find(eventItem => eventItem.date === currentDate);

    if (currentEvent) {
      this.eventFormTitle.value = currentEvent.title;
      this.eventFormParticipants.value = currentEvent.participants;
      this.eventFormDescription.value = currentEvent.description;
    } else {
      this.clearForm();
      this.eventFormRemove.style.display = 'none';
    }

    this.eventForm.style.left = `${143 + position.x + window.pageXOffset}px`;
    this.eventForm.style.top = `${position.y - 20 + window.pageYOffset}px`;
    this.eventForm.scrollIntoView({ inline: 'end' });
    this.createOverlay(this.closeFormHandler);
  }

  addEventHandler = event => {
    event.preventDefault();

    console.log(event.target);
    const eventObject = {
      title: this.eventFormTitle.value,
      date: this.selectedDay
        ? this.selectedDay.dataset.date : dateToString(new Date(this.eventFormDate.value)),
      participants: this.eventFormParticipants.value,
      description: this.eventFormDescription.value,
    };

    this.closeFormHandler();
    this.clearForm();
    this.emit('add', eventObject);

    if (event.target.classList.contains('button')) {
      this.today = new Date(eventObject.date);
      this.showCalendar();
      document.querySelector(`[data-date="${eventObject.date}"]`).classList.add('active');
    }
  }

  removeEventHandler = () => {
    this.emit('remove', this.selectedDay.dataset.date);
    this.closeFormHandler();
  }

  closeFormHandler = () => {
    this.days.forEach(day => day.classList.remove('active'));
    this.eventForm.style.display = 'none';
    this.clearForm();
    document.body.removeChild(document.getElementById('overlay'));
  }

  createCalendarDay(text, date, events) {
    const today = new Date();

    const td = document.createElement('td');
    if (date.getMonth() !== this.today.getMonth()) {
      td.classList.add('gray');
    }

    const header = document.createElement('p');
    td.appendChild(header);
    header.appendChild(document.createTextNode(text));
    if (date.getMonth() === today.getMonth()
      && date.getDate() === today.getDate()
      && date.getFullYear() === today.getFullYear()) {
      td.classList.add('today');
    }

    header.classList.add('header');


    const dateString = dateToString(date);

    const currentEvent = events.find(event => event.date === dateString);

    if (currentEvent) {
      const event = document.createElement('div');
      const eventHeader = document.createElement('h2');

      eventHeader.textContent = currentEvent.title;

      if (currentEvent.title.length > 18) {
        eventHeader.textContent = `${currentEvent.title.substring(0, 18)}...`;
      } else {
        eventHeader.textContent = currentEvent.title;
      }

      const eventParticipants = document.createElement('p');
      eventParticipants.textContent = currentEvent.participants;

      if (currentEvent.participants.length > 50) {
        eventParticipants.textContent = `${currentEvent.participants.substring(0, 50)}...`;
      } else {
        eventParticipants.textContent = currentEvent.participants;
      }

      event.appendChild(eventHeader);
      event.appendChild(eventParticipants);
      td.appendChild(event);
    }

    td.dataset.date = dateToString(date);
    td.addEventListener('click', this.calendarClickHandler);
    this.days.push(td);
    return td;
  }

  showCalendar(events = this.events) {

    let month = this.today.getMonth() + 1;
    month = month.toString().length > 1 ? month.toString() : `0${month.toString()}`;
    this.currentMonthInput.value = `${this.today.getFullYear()}-${month}-${this.today.getDate()}`;

    this.dateSpan.textContent = dateFormatter(this.today);
    this.calendar.innerText = '';
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    const startDate = new Date(this.today.getTime());
    startDate.setDate(1);
    startDate.setDate(startDate.getDay() === 1
      ? startDate.getDate() : startDate.getDay() === 0
        ? startDate.getDate() - 6 : startDate.getDate() - (startDate.getDay() - 1));


    let i = 0;
    const nextMonth = new Date();
    nextMonth.setMonth(this.today.getMonth() + 1);
    while (startDate.getMonth() !== nextMonth.getMonth()) {
      const tr = document.createElement('tr');
      for (let j = 0; j < 7; j++) {
        const td = this.createCalendarDay(`${i === 0 ? `${days[j]}, ${startDate.getDate()}` : startDate.getDate()}`, startDate, events);
        tr.appendChild(td);
        startDate.setDate(startDate.getDate() + 1);
      }
      this.calendar.appendChild(tr);
      i++;
    }
    this.events = events;
  }
}

export default View;