import { dateFormatter } from './helpers.js';

class View {
  constructor() {
    this.calendar = document.getElementById('calendar');
    this.dateSpan = document.getElementById('current-month');

    this.nextMonthButton = document.getElementById('next-month');
    this.nextMonthButton.addEventListener('click', this.switchMonth);

    this.previousMonthButton = document.getElementById('previous-month');
    this.previousMonthButton.addEventListener('click', this.switchMonth);

    this.todayButton = document.getElementById('today');
    this.todayButton.addEventListener('click', this.switchMonth);

    this.addEventForm = document.getElementById('add-event');
    this.addEventFormClose = document.getElementById('close');
    this.addEventFormClose.addEventListener('click', this.closeFormHandler);

    this.today = new Date();

    this.days = [];

  }


  switchMonth = event => {
    if (event.target.id === 'next-month') {
      this.today.setMonth(this.today.getMonth() + 1);
    } else if (event.target.id === 'previous-month') {
      this.today.setMonth(this.today.getMonth() - 1);
    } else if (event.target.id === 'today') {
      this.today = new Date();
    }
    this.showCalendar();
  }

  calendarClickHandler = event => {
    const position = event.target.getBoundingClientRect();

    this.days.forEach(day => day.classList.remove('active'));
    event.target.classList.add('active');
    this.addEventForm.style.display = 'block';
    this.addEventForm.style.left = `${143 + position.x + window.pageXOffset}px`;
    this.addEventForm.style.top = `${position.y - 20 + window.pageYOffset}px`;
    this.addEventForm.scrollIntoView();
  }

  closeFormHandler = event => {
    this.days.forEach(day => day.classList.remove('active'));
    this.addEventForm.style.display = 'none';
  }

  createCalendarDay(text, date) {
    const today = new Date();

    const td = document.createElement('td');
    if (date.getMonth() !== this.today.getMonth()) {
      td.classList.add('gray');
    }

    const header = document.createElement('p');
    td.appendChild(header);
    header.appendChild(document.createTextNode(text));
    if (date.getMonth() === today.getMonth() && date.getDate() === today.getDate() && date.getFullYear() === today.getFullYear()) {
      header.classList.add('today');
    }

    header.classList.add('header');

    td.addEventListener('click', this.calendarClickHandler);
    this.days.push(td);
    return td;
  }

  showCalendar() {
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
        const td = this.createCalendarDay(`${i === 0 ? `${days[j]}, ${startDate.getDate()}` : startDate.getDate()}`, startDate);
        tr.appendChild(td);
        startDate.setDate(startDate.getDate() + 1);
      }
      this.calendar.appendChild(tr);
      i++;
    }
  }
}

export default View;