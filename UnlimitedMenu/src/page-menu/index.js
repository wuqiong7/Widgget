import Menu from './menu';
import ReactDOM from 'react-dom';
import DevTools from 'mobx-react-devtools';

ReactDOM.render(
  <div>
    {__DEV__ && <DevTools />}
    <Menu/>
  </div>,
  document.getElementById('root')
)
