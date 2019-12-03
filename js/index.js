import View from './view.js';
import Model from './model.js';
import Controller from './controller.js';

const view = new View();
const model = new Model();
const controller = new Controller(model, view);