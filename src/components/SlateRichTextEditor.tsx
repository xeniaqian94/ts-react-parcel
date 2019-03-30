import { Editor } from 'slate-react'
import { Value, Block, Document, Selection } from 'slate'
import { LinkPlugin, LinkButton } from '@slate-editor/link-plugin'

import * as React from 'react'
const initialValue = require('./value.json') // TODO: pre-load Joel's outline
import { isKeyHotkey } from 'is-hotkey'
import { Button, Icon, Toolbar } from './SlateComponent'

const DEFAULT_NODE = 'paragraph'

const isBoldHotkey = isKeyHotkey('mod+b') // Mac users shall press cmd + b
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')
const isRecontextualize = isKeyHotkey('mod+r')

const plugins = [LinkPlugin()]
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
  RECONTEXTUALIZE_HOOK_ICON = 'find_in_page'

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state
    // console.log(type)
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
    // console.log(
    //   'Code for fun!!! [TODO] maybe use this function to local recontext-hook and insert an href element for floating window'
    // )
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

  componentDidUpdate() {
    // console.log('updated something is it [x]')
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
          {this.renderMarkButton(
            'recontextualize_hook',
            this.RECONTEXTUALIZE_HOOK_ICON
          )}{' '}
          {/* TODO when user click this button, it will insert into current cursor position a reconteztualize hook, e.g. [cite!] or [x] */}
          {/* <LinkButton /> */}
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
          // decorateNode={this.decorateNode}
          // plugins={plugins}
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
    let sidenote = <div />
    if (icon === this.RECONTEXTUALIZE_HOOK_ICON) {
      sidenote = 'cmd+r'
    }

    // TODO: onClickMark for recontext hook
    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
        {sidenote}
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
      case 'list-item': // this is the node inside either bulleted-list or numbered-list
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'recontextualize-hook':
        return (
          <button
            onClick={() => {
              window.location.href = 'https://www.w3docs.com'
            }}
            {...attributes}
          >
            nnn{children}
          </button>
        )
      default:
        return next()
    }
  }

  /**
   * Render a Slate mark.
   *
   *
   * TODO: renderMark for recontext Hook
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
    }, 800)

    this.setState({ value })
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
    } else if (isRecontextualize(event)) {
      //   mark = 'recontextualize-hook'
      //   console.log('mod+r clicked do insert the button')
      this.editor.insertText('[x]')
      // this.editor
      //   .focus()
      //   .insertBlock({
      //     type: 'recontextualize-hook',
      //     data: {
      //       className: 'img-responsive',
      //     },
      //   })
      //   .insertBlock('paragraph')
      //   .delete()
      // this.editor.delete()
      // event.preventDefault()
      // return next()
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
    // window.alert('onkeydown')
  }

  /*

  TODO: decorateNode

    Function decorateNode(node: Node, editor: Editor, next: Function) => Array<Decoration>|Void
    The decorateNode hook takes a node and returns an array of decorations with marks to be applied 
    to the node when it is rendered.
  */
  // decorateNode = (node, editor, next) => {
  //   // console.log('inside decorateNode')
  //   // console.log(node)

  //   const others = next() || []

  //   let decorations = []

  //   console.log(node.key)

  //   if (node.text.includes('[x]')) {
  //     node.type = 'recontextualize-hook'
  //   }

  //   return [...others, ...decorations]
  // }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    // if (type === 'recontextualize_hook') {
    // console.log('inside recontexutalize_hook')
    this.editor.insertText('[x]')
    // this.editor
    //   .focus()
    //   // .moveToEndOfBlock()
    //   .insertInline({
    //     type: 'recontextualize-hook',
    //     data: {
    //       src: 'http://placekitten.com/200/300',
    //       alt: 'Kittens',
    //     },
    //   })
    //   .insertBlock('paragraph')
    // }

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
