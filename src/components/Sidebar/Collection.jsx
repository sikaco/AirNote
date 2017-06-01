import {Component} from 'react'
import {observer} from 'mobx-react'

@observer
export default class Collection extends Component {
  render() {
    return (
      <div>
        <CollectionHead/>
        <CollectionList/>
      </div>
    )
  }
}

export class CollectionHead extends Component {
  render() {
    return (
      <div>
        <div className="collection-icon"></div>
        <div className="collection-title"></div>
        <div className="collection-number"></div>
      </div>
    )
  }
}

export class CollectionList extends Component {
  render() {
    return (
      <div></div>
    )
  }
}