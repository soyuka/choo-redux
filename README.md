# choo-redux
Redux bridge for choojs.

## Disclaimer

1. [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
2. Choojs already has a state system similar to redux (see `choo.use` and the `emitter`)
3. I made this because I want to benefit from the `redux` ecosystem with `choo` but in most cases this **is not needed**!

## Install

```
npm install choo-redux -S
```

## Usage

```javascript
const { createStore, applyMiddleware } = require('redux')
const { patchRouter, chooMiddleware, changeDOMTitle } = require('choo-redux')
const choo = require('choo')
const html = require('choo/html')

const reducer = function (state = {}, action) {
  switch (action.type) {
    default:
      return state
  }
}

const app = choo()
const store = createStore(reducer, applyMiddleware(chooMiddleware(app)))

patchRouter(app, store)

app.route('/', mainView)

function mainView (state, dispatch) {
  if (state.title !== TITLE) dispatch(changeDOMTitle(🚂🚋🚋))

  return html`
    <body>
      <h1>Choo choo!</h1>
    </body>
  `
}
```

## Under the hood

### chooMiddleware

It propagates native choo events (eg: `render`, 'DOMTitleChange' etc.) from redux through nanobus (the choo event emitter).

This means that dispatching a render action will call `emit('render')` in choo:

```javascript
const {render} = require('choo-redux')

// somewhere in the code, trigger choo rendering:
dispatch(render())
```

### patchRouter

The patchRouter allows to use redux state and the `dispatch` method inside views.

Indeed, the view now gets `store.getState()` and `dispatch` instead of the initial `state` and `emit` arguments:

```javascript
/**
 * Note that the state is actually:
 * Object.assign({}, state, store.getState())
 */
app.route('/', function mainView (state, dispatch) {
  // dispatch a redux action:
  dispatch(Action({payload: 'foo'}))
})
```

## API

The following action creators are available:

```typescript
changeDOMTitle(title: string): {type: CHANGEDOMTITLE, payload: string}
render(): {type: RENDER}
pushState(route: string): {type: PUSHSTATE, payload: string}
replaceState(route: string): {type: REPLACESTATE, payload: string}
popState(route: string): {type: POPSTATE, payload: string}
```

Every choo native events have associated types which are exported as:

```javascript
const {types} = require('choo-redux').types
```
