import {Component} from 'react'
import {Input, Menu, Icon, Button, Spin} from 'antd'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import cls from 'classnames'
import store from './menu-store'

const Search = Input.Search;

@observer
export default class Home extends Component {
  @observable keyWord = '';

  constructor(props) {
    super(props)
  }

  loopToRenderLi(data) {
    const liDom = data.map(item => {
      return (
        <li key={item.archId}
            className={cls({'fn-hide': item.fold})}>
          <div className={cls({
            active: item.archId === store.activeKey
          })}>
            <a href="javascript:void(0)"
               title={item.archName}
               onClick={() => this.handleItemClick(item)}>
              <Spin size="small" spinning={item.loading}/>
              {item.archName}
            </a>
            { !!item.childCount ?
              <i className={cls({
                'anticon': true,
                'anticon-up': item.icoup,
                'anticon-down': !item.icoup
              })}
                 onClick={() => {
                   this.handleIconClick(item.archId)
                 }}/>
              : null}
          </div>
          {item.children && item.children.length > 0 ? this.loopToRenderLi(item.children) : null}
        </li>
      )
    })

    return <ul> {liDom} </ul>;
  }

  @action handleIconClick(key) {
    const loopToFindArchId = (data) => {
      data.map(item => {
        if (item.archId === key) {
          store.expandMenu(item);
          return false;
        } else {
          loopToFindArchId(item.children);
        }
      });
    }

    loopToFindArchId(store.menuData);
  }

  /**
   * click选中某行
   */
  @action handleItemClick(o) {
    store.changeActiveKey(o.archId);
  }

  /**
   * 禁止默认的search事件
   * 通过监听input的change事件触发search事件
   */
  @action handleInputSearch() {
    return false;
  }

  /**
  * 监听input的change事件触发search事件
  */
  @action onChangeKeyWord = (e) => {
    this.keyWord = e.target.value;
    store.searchMenu(this.keyWord);
  }

  /* 指定选中某行 */
  @action handleSelectId(key) {
    store.selectedAndExpandMenu(key);
  }

  componentDidMount() {
    store.fetchData();
  }

  render() {
    return (
      <div className="menu-container">
        <div className="search-box">
          <Search style={{width: 230}}
                  placeholder="搜索空间"
                  value={this.keyWord}
                  onChange={this.onChangeKeyWord}
                  onSearch={value => this.handleInputSearch(value)}
          />
          <div className={cls({
            'no-data': true,
            'fn-hide': store.subMenuNoDataHide
          })}>
            <Icon type="exclamation-circle-o"/>
            <span>暂无数据</span>
          </div>
        </div>
        <div className={cls({
          'menu-panel': true,
          'fn-hide': !store.subMenuNoDataHide
        })}>
          {this.loopToRenderLi(store.menuData)}
        </div>

        {/* just for demo */}
        <div>
          {store.archIdArr.map(key => {
            return (
              <Button type="primary"
                      style={{margin:'5px'}}
                      key={key}
                      onClick={this.handleSelectId.bind(this,key)}>Key:{key}
              </Button>
            );
          })}
        </div>
      </div>
    )
  }
}
