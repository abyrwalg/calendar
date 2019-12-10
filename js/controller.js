class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.showCalendar(model.events);
    view.on('add', this.addEvent.bind(this));
    view.on('remove', this.deleteEvent.bind(this));
    view.on('search', this.searchEvent.bind(this))
  }

  addEvent(event) {
    this.model.addEvent(event);
    this.view.showCalendar(this.model.events);
  }

  deleteEvent(date) {
    this.model.deleteEvent(date);
    this.view.showCalendar(this.model.events);
  }

  searchEvent(text) {
    const searchResults = this.model.search(text);
    this.view.showSearchResults(searchResults);
  }

}


export default Controller;