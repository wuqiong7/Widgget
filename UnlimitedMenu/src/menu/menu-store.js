import {Modal, message} from 'antd'
import {observable, action, toJS} from 'mobx'

class MenuStore {
  @observable activeKey = '';
  @observable menuData = [];
  @observable archIdArr = [];
  @observable subMenuNoDataHide = true;

  constructor(props) {
  }

  ajaxRequestBack = (type) => {
    if(type === 'search') this.archIdArr.replace([]);

    let id = Math.ceil(Math.random() * 100);
    let count = id < 10 ? 0 : 6;
    this.archIdArr.push(`${id}`)
    return [
      {archName: `菜单${id}`, archId: `${id}`, childCount: count},
      {archName: '菜单101', archId: '101', childCount: 101}
    ];
  };

  changeActiveKey = (key) => {
    this.activeKey = key;
  };

  /**
   * option[object] 查询接口所需参数
   * {
   * data: [array] 需格式化的数据
   * type: [string] 'search'||'fetch'
   * key: [number] 当前节点的archId
   * parentId: 父节点的archId
   */

  formatData = (option) => {
    option.data.map(item => {
      item.fold = false;
      item.icoup = false;
      item.loading = false;

      if (!item.children) item.children = [];

      if (option.type === 'fetch') {

        if (option && option.key) {
          /* fetch subMenu */
          item.parentId =  option.parentId === '' ? `${option.key}` : `${option.parentId}-${option.key}`;
        } else {
          /* init data */
          item.parentId = '';
        }

      } else  if (option.type === 'search') {
        item.parentId = option.key;
      }

    });

    return option.data;
  };


  /**
   * option[object] 查询接口所需参数
   * {key: 当前节点的archId, parentId: 父级节点的archId}
   */
  @action fetchData = (option) => {
    // ajax
    let data = this.ajaxRequestBack();

    const parentId = (option && option.parentId);
    const key = (option && option.key);
    data = this.formatData({
      type:'fetch',
      data,
      parentId,
      key,
    });

    /* key为空，返回的是顶层数据，否则是向下撰取 */
    if (!key) this.menuData = data;

    option && option.cb && option.cb(data);
  };

  @action expandMenu = (obj) => {
    obj.icoup = !obj.icoup;

    /* children为空数组，重新请求数据 */
    if (!obj.children.length) {
      obj.loading = true;

      this.fetchData({
        key: toJS(obj).archId,
        parentId: toJS(obj).parentId,
        cb: (data) => {
          obj.loading = false;
          obj.children = data;
        }
      });
    } else {
      /* 已有数据，不重新请求数据 */
      obj.children.map(item => {
        item.fold = !item.fold;
      })
    }
  };

  @action searchMenu = (keyWord, cb) => {
    if (!keyWord) return false;

    // ajax
    let data = this.ajaxRequestBack('search');

    if(data.length) {
      /* 查询有结果时, Hide Tip */
      this.subMenuNoDataHide = true;

      data = this.formatData({
        type:'search',
        data,
        key: keyWord,
      });

      this.menuData = data;

      cb && cb(data);

    } else {
      /* 查询结果为空, Show Tip */
      this.subMenuNoDataHide = false;
    }
  }

  @action selectedAndExpandMenu(archId) {
    let i = -1;
    // 所有父ID集合
    let archIdList = [];

    /**
     * 找到当前archId的item去取parentId
     * 结构为:[顶级ID] - [二级ID] - [三级ID]
     */
    const loopToFindArchId = (list, archId) => {
      list.map(item => {
        if (item.archId === archId) {
          if (item.parentId) archIdList = item.parentId.split('-');
          return false;
        } else {
          loopToFindArchId(item.children, archId);
        }
      });
    }
    loopToFindArchId(this.menuData, archId);


    /**
     * 从顶层数据开始向下撰取查找parentId
     */
    const loopToFindParentsId = (list) => {
      i++;

      list.map(item => {
        if (item.archId === archIdList[i]) {
          item.fold = false;
          item.icoup = true;
          item.children.map(subItem => {
            subItem.fold = false;
          });
          if (item.children.length) loopToFindParentsId(item.children);
        }
      });
    }
    loopToFindParentsId(this.menuData);

    this.changeActiveKey(archId);
  }

}
let store = new MenuStore();
export default store
