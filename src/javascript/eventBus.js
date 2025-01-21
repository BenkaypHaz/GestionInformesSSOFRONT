// src/eventBus.js
import { reactive } from 'vue';

const eventBus = reactive(new Map());

export function on(event, callback) {
  if (!eventBus.has(event)) {
    eventBus.set(event, []);
  }
  eventBus.get(event).push(callback);
}

export function emit(event, data) {
  if (eventBus.has(event)) {
    eventBus.get(event).forEach(callback => callback(data));
  }
}
