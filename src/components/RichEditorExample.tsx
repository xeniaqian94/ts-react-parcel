import * as React from 'react'
import { render } from 'react-dom'
import { Editor, EditorState, RichUtils } from 'draft-js'
// const {Editor, EditorState, RichUtils} = Draft;
// import styles from from './RichEditorExample.css'

import Raw from 'draft-js-raw-content-state'
const newEntity = {
  type: 'CUSTOM_COLOR',
  mutability: 'MUTABLE',
  data: { color: 'red' },
}

//TODO: this is where we paste Joel's outline
const contentState = new Raw()
  // first block
  .addBlock(
    'The most important problems in science are increasingly interdisciplinary'
  )
  .setKey('edr45')
  .addEntity(newEntity, 2, 4)

  // second block
  .addBlock('block 2')
  .addInlineStyle('COLOR_RED', 0, 6)
  .anchorKey(10)
  .focusKey(4)

  //to Editor State
  .toEditorState()

export class RichEditorExample extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // editorState: EditorState.createEmpty(),
      editorState: contentState,
    }

    this.focus = () => this.refs.editor.focus()
    this.onChange = editorState => {
      this.setState({ editorState })
      console.log(editorState.getCurrentContent().getPlainText())
    }

    this.handleKeyCommand = command => this._handleKeyCommand(command)
    this.onTab = e => this._onTab(e)
    this.toggleBlockType = type => this._toggleBlockType(type)
    this.toggleInlineStyle = style => this._toggleInlineStyle(style)
  }

  _handleKeyCommand(command) {
    const { editorState } = this.state
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }

  _onTab(e) {
    const maxDepth = 4
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    )
  }

  _getTextSelection(contentState, selection, blockDelimiter) {
    blockDelimiter = blockDelimiter || '\n'
    var startKey = selection.getStartKey()
    var endKey = selection.getEndKey()
    var blocks = contentState.getBlockMap()

    var lastWasEnd = false
    var selectedBlock = blocks
      .skipUntil(function(block) {
        return block.getKey() === startKey
      })
      .takeUntil(function(block) {
        var result = lastWasEnd

        if (block.getKey() === endKey) {
          lastWasEnd = true
        }

        return result
      })

    return selectedBlock
      .map(function(block) {
        var key = block.getKey()
        var text = block.getText()

        var start = 0
        var end = text.length

        if (key === startKey) {
          start = selection.getStartOffset()
        }
        if (key === endKey) {
          end = selection.getEndOffset()
        }

        text = text.slice(start, end)
        return text
      })
      .join(blockDelimiter)
  }

  _onBoldClick() {
    // TODO: console.log SELECTED piece of text
    // This will also make the "bold" key in the second line as selected

    // Editor state includes the current selection state:
    // https://draftjs.org/docs/api-reference-editor-state
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
    console.log("{CURRENT SELECTION}"
      this._getTextSelection(
        this.state.editorState.getCurrentContent(),
        this.state.editorState.getSelection(),
        '\n'
      )
    )
    // window.alert('this.state.editorState')
  }

  render() {
    const { editorState } = this.state

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor'
    var contentState = editorState.getCurrentContent()
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== 'unstyled'
      ) {
        className += ' RichEditor-hidePlaceholder'
      }
    }

    return (
      <div className="RichEditor-root">
        <button onClick={this._onBoldClick.bind(this)}>
          Re-contextualize!
        </button>
        {/* Below are control tooltip */}
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        {/* Below are Style tooltip */}
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="Tell a story..."
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    )
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
}

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    default:
      return null
  }
}

export class StyleButton extends React.Component {
  constructor() {
    super()
    this.onToggle = e => {
      e.preventDefault()
      this.props.onToggle(this.props.style)
    }
  }

  render() {
    let className = 'RichEditor-styleButton'
    if (this.props.active) {
      className += ' RichEditor-activeButton'
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    )
  }
}

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
]

const BlockStyleControls = props => {
  const { editorState } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

var INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
]

const InlineStyleControls = props => {
  var currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

// ReactDOM.render(<RichEditorExample />, document.getElementById('target'))
