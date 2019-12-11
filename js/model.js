import { EventEmitter } from "./helpers.js";

class Model extends EventEmitter {
  constructor(calendarData) {
    super();
    this.events = calendarData || [
      {
        title: 'Событие 1',
        date: '2019-12-10',
        participants: 'Вася Пупкин, Иван Иванов',
        description: 'Абырвалг абыр абарвалг',
      },
      {
        title: 'Очень важное событие',
        date: '2019-12-15',
        participants: 'Петя Сидоров, Петя Сидоров, Петя Сидоров, Петя Сидоров, Петя Сидоров, Петя Сидоров, Петя Сидоров, Петя Сидоров',
        description: 'Абырвалг абыр абарвалг',
      },
      {
        title: 'Еще одно необычайно важное событие',
        date: '2020-1-15',
        participants: 'Петя Сидоров',
        description: 'Описание важного события',
      },
    ];
  }

  addEvent(event) {
    const index = this.events.findIndex(eventItem => eventItem.date === event.date);
    if (index !== -1) {
      this.events[index] = event;
    } else {
      this.events.push(event);
    }
    this.emit('update', this.events);
  }

  deleteEvent(date) {
    const index = this.events.findIndex(event => event.date === date);
    if (index !== -1) {
      this.events.splice(index, 1);
      this.emit('update', this.events);
    }
  }

  search(text) {
    if (text.length > 2) {

      let dateArray = [];

      if (text.includes('-')) {
        dateArray = text.split('-');
      } else {
        dateArray = text.split(' ');
      }

      dateArray.forEach((item, index) => {
        if (isNaN(item)) {
          switch (item.toLowerCase()) {
            case 'января':
              dateArray[index] = 1;
              break;
            case 'февраля':
              dateArray[index] = 2;
              break;
            case 'марта':
              dateArray[index] = 3;
              break;
            case 'апреля':
              dateArray[index] = 4;
              break;
            case 'мая':
              dateArray[index] = 5;
              break;
            case 'июня':
              dateArray[index] = 6;
              break;
            case 'июля':
              dateArray[index] = 7;
              break;
            case 'августа':
              dateArray[index] = 8;
              break;
            case 'сентября':
              dateArray[index] = 9;
              break;
            case 'октября':
              dateArray[index] = 10;
              break;
            case 'ноября':
              dateArray[index] = 11;
              break;
            case 'декабря':
              dateArray[index] = 12;
              break;
          }
        }
      });

      const date = new Date(dateArray.reverse().join('-'));
      const result = this.events.filter(event => {
        const eventDate = new Date(event.date);
        return event.title.toLowerCase().includes(text.toLowerCase())
          || event.participants.toLowerCase().includes(text.toLowerCase())
          || date.getTime() === eventDate.getTime();
      });
      return result;
    }
  }
}

export default Model;