// Not mine.

var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
import {Provider} from 'react-redux';
import {createStore} from 'redux';

// Mine.

import Dashboard from './Dashboard.js';


// Create a reducer and store.
// The job of a reducer is to take an action and make a change to the store.

var userReducer = function(state, action) {
  //console.log('here:');
  //console.log(action);
  if (state === undefined) {
    state = {
      widgets: [
        {key:  0,
         data: {type:             'pie',
                width:            'half',
                height:           'half',
                source:           'source01',
                aggNumeric:       true,
                aggDatetime:      true,
                aggMethod:        'mean',
                metrics:          ['datetime','cost'],
                filters:          [{metric:'age',comp:'<',value:'50'}],
                timeframe:        'mine',
                //tabStartDateISO:  moment('2016-06-15T00:00:00').toISOString(),
                //tabEndDateISO:    moment('2016-06-30T00:00:00').toISOString(),
                myStartDateISO:   moment('2016-06-01T00:00:00').toISOString(),
                myEndDateISO:     moment('2016-06-15T00:00:00').toISOString(),
                configDisplay:    'none'}},
        {key:  1,
         data: {type:             'line',
                width:            'full',
                height:           'half',
                source:           'source01',
                aggNumeric:       false,
                aggDatetime:      true,
                aggMethod:        'mean',
                metrics:          ['datetime','cost'],
                filters:          [],
                timeframe:        'tab',
                //tabStartDateISO:  moment('2016-06-15T00:00:00').toISOString(),
                //tabEndDateISO:    moment('2016-06-30T00:00:00').toISOString(),
                myStartDateISO:   moment().toISOString(),
                myEndDateISO:     moment().toISOString(),
                configDisplay:    'none'}},
        {key:  2,
         data: {type:             'histogram',
                width:            'half',
                height:           'half',
                source:           'source01',
                metrics:          ['age'],
                buckets:          10,
                filters:          [],
                timeframe:        'tab',
                //tabStartDateISO:  moment('2016-06-15T00:00:00').toISOString(),
                //tabEndDateISO:    moment('2016-06-30T00:00:00').toISOString(),
                myStartDateISO:   moment().toISOString(),
                myEndDateISO:     moment().toISOString(),
                configDisplay:    'none'}},
        {key:  3,
         data: {type:             'scatter',
                width:            'half',
                height:           'half',
                source:           'source02',
                metrics:          ['age','happiness'],
                filters:          [],
                timeframe:        'none',
                //tabStartDateISO:  moment('2016-06-15T00:00:00').toISOString(),
                //tabEndDateISO:    moment('2016-06-30T00:00:00').toISOString(),
                myStartDateISO:   moment().toISOString(),
                myEndDateISO:     moment().toISOString(),
                configDisplay:    'none'}},
        {key:  4,
         data: {type:             'stats',
                width:            'half',
                height:           'half',
                source:           'source02',
                metrics:          ['happiness'],
                filters:          [],
                timeframe:        'none',
                //tabStartDateISO:  moment('2016-06-15T00:00:00').toISOString(),
                //tabEndDateISO:    moment('2016-06-30T00:00:00').toISOString(),
                myStartDateISO:   moment().toISOString(),
                myEndDateISO:     moment().toISOString(),
                configDisplay:    'none'}}
      ],
      dashLayout: [{tabName:         'Justin',
                    layout:          [[0,2],[1]],
                    tabHideDate:     true,
                    tabStartDateISO: moment('2016-06-15T00:00:00').toISOString(),
                    tabEndDateISO:   moment('2016-06-30T00:00:00').toISOString()},
                   {tabName:         'Stuart',
                    layout:          [[3,4]],
                    tabHideDate:     false,
                    tabStartDateISO: moment('2016-06-15T00:00:00').toISOString(),
                    tabEndDateISO:   moment('2016-06-30T00:00:00').toISOString()},
                  ],
      currentTab: 0,
      configAddWidgetDisplay: 'none',
      configAddTabDisplay: 'none',
      configEditTabDisplay: 'none',
      dummy: true
    };
  }
  var newState = JSON.parse(JSON.stringify(state));
  // action.type === UPDATE_WIDGET then we also have:
  // action.widgetindex
  // action.changes
  if (action.type === 'UPDATE_WIDGET') {
    newState.widgets[action.widgetindex].data = _.extend(newState.widgets[action.widgetindex].data,action.changes);
  }
  if (action.type === 'UPDATE_DASH') {
    newState = _.extend(newState,action.changes);
    if (newState.currentTab >= newState.dashLayout.length) {
      newState.currentTab--;
    }
  }
  if (action.type === 'ADD_WIDGET') {
    // Find a valid key.
    var validKey = 0;
    var usedKeys = _.pluck(newState.widgets,'key');
    while (_.contains(usedKeys,validKey)) {
      validKey++;
    }
    // Push the widget on.
    newState.widgets.push({key:validKey,data:action.data});
    // Get the index of the widget we just added.
    var windex = newState.widgets.length-1;
    // Put the widget in the tab layout.
    newState.dashLayout[newState.currentTab].layout.push([windex]);
  }
  if (action.type === 'DELETE_WIDGET') {
    var indexToDelete = action.widgetindex;
    var currentLayout = newState.dashLayout[newState.currentTab].layout;
    var currentWidgets = newState.widgets;
    _.each(currentLayout,function(row,i) {
      currentLayout[i] = _.without(row,indexToDelete);
    });
    currentLayout = _.filter(currentLayout,function(row){return (row.length != 0);});
    newState.dashLayout[newState.currentTab].layout = currentLayout;
    _.each(newState.dashLayout,function(tab,ti) {
      _.each(tab.layout,function(row,i) {
        _.each(row,function(entry,j) {
          if (entry > indexToDelete) {
            newState.dashLayout[ti].layout[i][j] = entry-1;
          }
        });
      });
    });
    newState.widgets.splice(indexToDelete,1);
  }
  if (action.type === 'UPDATE_LAYOUT') {
    newState.dashLayout = action.newLayout;
  }
  if (action.type === 'CHANGE_CURRENT_TAB') {
    newState.currentTab = action.newTab;
  }
  return newState;
}

// The store holds the state.
// I guess it's passed the reducer to ... allow the reducer to access it or something?

var store = createStore(userReducer);

// Add one more thing for testing.

{/*
store.dispatch({type:'ADD_WIDGET',data: {type:             'column',
                                         source:           'source01',
                                         aggNumeric:       true,
                                         aggDatetime:      true,
                                         aggMethod:        'mean',
                                         metrics:          ['datetime','save'],
                                         filters:          [],
                                         configDisplay:    'none'
                                        }});
 */}
// Now the app.

ReactDOM.render(
    <Provider store={store}>
    <Dashboard/>
    </Provider>,
  document.getElementById('app')
);
