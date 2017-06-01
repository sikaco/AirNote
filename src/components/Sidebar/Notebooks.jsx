import {Component} from 'react'
import {observer} from 'mobx-react'

@observer
export default class Notebooks extends Component {
  render() {
    return (
      <div>
        <NotebooksHead/>
        <NotebooksList/>
      </div>
    )
  }
}

export class NotebooksHead extends Component {
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

class NotebooksList extends Component {
  render() {
    return (
      <div></div>
    )
  }
}