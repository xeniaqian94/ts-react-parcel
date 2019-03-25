import { Editor } from 'slate-react'
import { Value, Document, Selection } from 'slate'

import * as React from 'react'
const initialValue = require('./value.json') // TODO: pre-load Joel's outline
import { isKeyHotkey } from 'is-hotkey'
import { Button, Icon, Toolbar } from './SlateComponent'

const DEFAULT_NODE = 'paragraph'

const isBoldHotkey = isKeyHotkey('mod+b') // Mac users shall press cmd + b
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

/**
 * The rich text example. from https://github.com/ianstormtaylor/slate/tree/master/examples/rich-text
 *
 * @type {Component}
 */

export class SlateRichTextEditor extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }
  timeout: number = 0

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type === type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type === type)
  }

  codeForFun = () => {
    console.log(
      'Code for fun!!! [TODO] maybe use this function to insert an href element for floating window'
    )
    // console.log(this.editor.value.document.nodes.get(0).text)
  }
  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  refRealEditor = editor => {
    this.editor = editor
  }
  // getEditorDocument() {
  //   return this.refRealEditor.document
  // }

  componentDidMount() {
    // console.log('componentDidMount' + this.editor.value)
    this.props.onUpdate(this.editor.value, 0)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <Toolbar>
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
          {this.renderBlockButton('heading-one', 'looks_one')}
          {this.renderBlockButton('heading-two', 'looks_two')}
          {this.renderBlockButton('block-quote', 'format_quote')}
          {this.renderBlockButton('numbered-list', 'format_list_numbered')}
          {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          ref={this.refRealEditor}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          // onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
        />
      </div>
    )
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
   * Render a block-toggling toolbar button.
   * TODO: maybe refactor level-ed block
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const {
        value: { document, blocks },
      } = this.state

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        isActive = this.hasBlock('list-item') && parent && parent.type === type
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return (
          <li {...attributes}>
            {children}
            <button
              onClick={() => {
                // console.log('BADDDDD w3docs')
                window.location.href = 'https://www.w3docs.com'
              }}
              //  {/* Just kidding but BIG TODO: add floating box in someway like this...  */}
            >
              To w3docs
            </button>
          </li>
        )
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      default:
        return next()
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  /**
   * On change, save the new `value`.
   * (from Xin) This falls apart, however, because the user can usually type faster your server can respond.
   *
   * @param {Editor} editor
   *
   * mismatch between "editor" and "value" concepts  https://github.com/ianstormtaylor/slate/issues/2206
   */

  onChange = ({ value }) => {
    clearTimeout(this.timeout)
    // console.log('Timeout cleared' + this.timeout)

    // Make a new timeout set to go off in 800ms
    this.timeout = setTimeout(() => {
      // console.log('500 seconds, updated')
      this.props.onUpdate(value, 1)
    }, 500)

    this.setState({ value })
    // this.props.onUpdate(value, 1)

    // console.log(value.toJSON())
    // get selected text https://github.com/ianstormtaylor/slate/issues/551
    // console.log(value.selection.toJSON())
    // console.log(value.fragment.text)
    // this.props.onUpdate(value)
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Change}
   */

  onKeyDown = (event, editor, next) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      // this.props.onUpdate(editor.value, 0)
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
    // window.alert('onkeydown')
  }

  // onMouseDown = (event, editor, next) => {
  //   console.log('Mouse down')
  //   // this.props.onUpdate(value.fragment.text)

  //   this.props.onUpdate(editor.value.fragment.text)
  //   console.log(editor.value.fragment.text)
  // }

  // onMouseUp = (event, editor, next) => {
  //   // when selection finished
  //   // console.log('Mouse up!')
  //   // this.props.onUpdate(value.fragment.text)

  //   this.props.onUpdate(editor.value, 1)
  //   // console.log(editor.value.fragment.text)
  // }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    this.editor.toggleMark(type)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }
}

/**
 * Export.
 */

// export default SlateRichTextEditor
