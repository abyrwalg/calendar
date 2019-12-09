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

    /*  this.eventFormSubmit = document.getElementById('event-submit');
    this.eventFormSubmit.addEventListener('click', this.addEventHandler); */

    this.eventFormRemove = document.getElementById('event-remove');
    this.eventFormRemove.addEventListener('click', this.removeEventHandler);

    this.addEventButton = document.getElementById('add-event-button');
    this.addEventButton.addEventListener('click', this.addEventButtonHandler);

    this.today = new Date();
    this.days = [];
    this.events = [];
    this.selectedDay = null;

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
    this.createOverlay();
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

  createOverlay = () => {
    const overlay = document.createElement('div');
    overlay.style = 'background-color: transparent; position: fixed; top: 0; left:0; right: 0; bottom: 0; display: block;';
    overlay.id = 'overlay';
    overlay.addEventListener('click', this.closeFormHandler);
    document.body.appendChild(overlay);
  }

  clearForm = () => {
    this.eventFormTitle.value = '';
    this.eventFormParticipants.value = '';
    this.eventFormDescription.value = '';
    this.eventFormDate.value = '';
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
    this.eventForm.scrollIntoView({inline: 'end'});
    this.createOverlay();
  }

  addEventHandler = event => {
    event.preventDefault();
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
  }

  removeEventHandler = event => {
    this.emit('remove', this.selectedDay.dataset.date);
    this.closeFormHandler();
  }

  closeFormHandler = event => {
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
    if (date.getMonth() === today.getMonth() && date.getDate() === today.getDate() && date.getFullYear() === today.getFullYear()) {
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