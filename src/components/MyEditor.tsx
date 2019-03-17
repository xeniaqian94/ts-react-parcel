import * as React from 'react'
import { render } from 'react-dom'
import { Editor, EditorState, RichUtils } from 'draft-js'

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em',
  },
}

export class MyEditor extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = { editorState: EditorState.createEmpty() }
    this.onChange = editorState => {
      this.setState({ editorState })
      console.log(editorState.getCurrentContent())
    }
    this.setEditor = editor => {
      this.editor = editor
    }
    this.focusEditor = () => {
      if (this.editor) {
        this.editor.focus()
      }
    }
  }

  componentDidMount() {
    this.focusEditor()
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
  }

  render() {
    return (
      <div>
        {/* <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        /> */}

        <div style={styles.editor} onClick={this.focusEditor}>
          {/* <button onClick={this._onBoldClick.bind(this)}>BOLDLDLDLD</button> */}
          <Editor
            ref={this.setEditor}
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    )
  }
}
