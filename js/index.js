import View from './view.js';
import Model from './model.js';
import Controller from './controller.js';
import { loadData, saveData } from './helpers.js';

const calendarData = loadData();

const view = new View();

const model = new Model(calendarData);
model.on('update', events => saveData(events));

const controller = new Controller(model, view);