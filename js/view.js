import {dateFormatter} from "./helpers.js";

class View {
  constructor() {
    this.calendar = document.getElementById('calendar');
    this.dateSpan = document.getElementById("current-month");
    this.today = new Date();

    this.dateSpan.textContent = dateFormatter(this.today);
  }

  showCalendar() {
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    const startDate = new Date(this.today.getTime());
    startDate.setDate(1);
    console.log(startDate);
    startDate.setDate(startDate.getDay() === 1 ? startDate.getDate() : startDate.getDate() - startDate.getDay() + 1);
    console.log(startDate);

    const endDate = new Date(startDate.getTime());
    endDate.setMonth(endDate.getMonth() + 1);

    
    for (let i = 0; i < 5; i++) {

      const tr = document.createElement('tr');
      for (let j = 0; j < 7; j++) {
        const td = document.createElement('td');
        const text = document.createTextNode(`${i === 0 ? `${days[j]}, ${startDate.getDate()}` : startDate.getDate()}`);
        startDate.setDate(startDate.getDate() + 1);
        td.appendChild(text);
        tr.appendChild(td);
        this.calendar.appendChild(tr);
        console.log(startDate.getMonth(), endDate.getMonth());
      }

    }
  }
}

export default View;