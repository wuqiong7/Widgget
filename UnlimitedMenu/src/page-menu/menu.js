import {Component} from 'react'
import {Button, Modal} from 'antd'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import UnlimitedMenu from '../menu'


@observer
export default class Home extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{width: '300px', margin: '0 auto'}}>
        <UnlimitedMenu />
      </div>
    )
  }
}
