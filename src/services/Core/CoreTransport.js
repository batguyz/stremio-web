// Copyright (C) 2017-2020 Smart code 203358507

const EventEmitter = require('eventemitter3');
const { default: initialize_api, initialize_runtime, get_state, get_debug_state, dispatch, analytics } = require('@stremio/stremio-core-web');

function CoreTransport() {
    const events = new EventEmitter();

    initialize_api()
        .then(() => initialize_runtime(({ name, args }) => {
            try {
                events.emit(name, args);
            } catch (error) {
                console.error('CoreTransport', error);
            }
        }))
        .then(() => {
            try {
                events.emit('init');
            } catch (error) {
                console.error('CoreTransport', error);
            }
        })
        .catch((error) => {
            events.emit('error', error);
        });

    this.on = function(name, listener) {
        events.on(name, listener);
    };
    this.off = function(name, listener) {
        events.off(name, listener);
    };
    this.getState = function(field) {
        return get_state(field);
    };
    this.getDebugState = function() {
        return get_debug_state();
    };
    this.dispatch = function(action, field) {
        try {
            dispatch(action, field);
        } catch (error) {
            console.error('CoreTransport', error);
        }
    };
    this.analytics = function(event) {
        try {
            analytics(event);
        } catch (error) {
            console.error('CoreTransport', error);
        }
    };
}

module.exports = CoreTransport;
