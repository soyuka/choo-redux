const DOMTITLECHANGE = 'DOMTitleChange'
const PUSHSTATE = 'pushState'
const POPSTATE = 'popState'
const REPLACESTATE = 'replaceState'
const RENDER = 'render'
const DOMCONTENTLOADED = 'DOMContentLoaded'
const NAVIGATE = 'navigate'

const types = {
  DOMCONTENTLOADED, NAVIGATE, RENDER, DOMTITLECHANGE, PUSHSTATE, POPSTATE, REPLACESTATE
}

module.exports.types = types

/**
 * Action creators
 */
module.exports.changeDOMTitle = changeDOMTitle

function changeDOMTitle(title) {
  return {type: DOMTITLECHANGE, payload: title}
}

module.exports.render = render

function render() {
  return {type: RENDER}
}

module.exports.pushState = pushState

function pushState(route) {
  return {type: PUSHSTATE, payload: route}
}

module.exports.replaceState = replaceState

function replaceState(route) {
  return {type: REPLACESTATE, payload: route}
}

module.exports.popState = popState

function popState(route) {
  return {type: POPSTATE, payload: route}
}

module.exports.chooMiddleware = chooMiddleware

/**
 * A choo middleware for redux that propagates redux events through nanobus (the choo event emitter)
 */
function chooMiddleware (app) {
  const events = Object.keys(app._events).map((e) => app._events[e])

  return function chooReduxDispatcher ({ getState }) {
    return next => action => {
      if (~events.indexOf(action.type)) {
        app.emitter.emit(action.type, action.payload)
      }

      if (!action.render) {
        return next(action)
      }

      const result = next(action)
      app.emitter.emit(RENDER)
      return result
    }
  }
}

module.exports.patchRouter = patchRouter

/**
 * Path the router view and use choo state combined with redux state
 * The `emit` argument in the view is replaced by redux dispatch function
 */
function patchRouter (app, store) {
  const route = app.route

  app.route = function reduxRoute(path, view) {
    return route.call(app, path, function reduxView(state, emit) {
      return view(Object.assign({}, state, store.getState()), store.dispatch)
    })
  }
}

