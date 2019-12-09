class Model {
  constructor() {
    this.events = [
      {
        title: 'Test',
        date: '2019-12-10',
        participants: 'Вася Пупкин, Иван Иванов',
        description: 'Абырвалг абыр абарвалг',
      },
      {
        title: 'Очень важное событие',
        date: '2019-12-15',
        participants: 'Петя Сидоров, Петя Сидоров, Петя Сидоров, Петя Сидоров, Петя Сидоров, Петя Сидоров, Петя Сидоров, Петя Сидоров, ',
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

  }

  deleteEvent(date) {
    const index = this.events.findIndex(event => event.date === date);
    if (index !== -1) {
      this.events.splice(index, 1);
    }

  }
}

export default Model;