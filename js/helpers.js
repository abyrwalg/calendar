function dateFormatter(date) {
  let month = date.getMonth() + 1;
  switch (month) {
    case 1:
      month = 'Январь';
      break;
    case 2:
      month = 'Февраль';
      break;
    case 3:
      month = 'Март';
      break;
    case 4:
      month = 'Апрель';
      break;
    case 5:
      month = 'Май';
      break;
    case 6:
      month = 'Июнь';
      break;
    case 7:
      month = 'Июль';
      break;
    case 8:
      month = 'Август';
      break;
    case 9:
      month = 'Сентябрь';
      break;
    case 10:
      month = 'Октябрь';
      break;
    case 11:
      month = 'Ноябрь';
      break;
    case 12:
      month = 'Декабрь';
      break;
  }
  return `${month} ${date.getFullYear()}`;

}

function dateToString(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(type, callback) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(callback);
  }

  emit(type, arg) {
    if (this.events[type]) {
      this.events[type].forEach(callback => callback(arg));
    }
  }
}

export { dateFormatter, dateToString, EventEmitter };