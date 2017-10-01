import * as $ from 'jquery';
import StringUtil, {LineInfo} from './StringUtil';

export default class NoteBodyInput {
  private el: JQuery;

  constructor() {
    this.el = $('#note-body-input');

    this.el.keydown((e: any) => {
      if (e.key === 'Tab' && e.shiftKey) {
        this.handleShiftTabKeyDown(e);
      } else if (e.key === 'Tab' && !e.shiftKey) {
        this.handleTabKeyDown(e);
      } else if (e.key === 'Backspace') {
        this.handleBackspaceKeyDown(e);
      }
    });

    this.el.keypress((e: any) => {
      if (e.key === 'Enter') {
        this.handleEnterKeyPress(e);
      }
    });
  }

  public setValue(value: string): void {
    this.el.val(value);
  }

  public getValue(): string {
    return this.el.val() as string;
  }

  private setSelection(start: number, end: number): void {
    this.el.prop('selectionStart', start);
    this.el.prop('selectionEnd', end);
  }

  private getSelectionStart(): number {
    return parseInt(this.el.prop('selectionStart') as string);
  }

  private getSelectionEnd(): number {
    return parseInt(this.el.prop('selectionEnd') as string);
  }

  private handleTabKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    const posStart = this.getSelectionStart();
    const posEnd = this.getSelectionEnd();
    if (posStart !== posEnd) {
      // text selected
      const ret = StringUtil.increaseIndentRange(this.getValue(), posStart, posEnd);
      this.setValue(ret.updated);
      this.setSelection(posStart + ret.numAddStart, posEnd + ret.numAddEnd);
    } else {
      // no text selected
      const pos = posStart;
      const ret = StringUtil.increaseIndent(this.getValue(), pos);
      this.setValue(ret.updated);
      this.setSelection(pos + ret.numAdd, pos + ret.numAdd);
    }
  }

  private handleShiftTabKeyDown(e: KeyboardEvent): void {
    e.preventDefault();
    const posStart = this.getSelectionStart();
    const posEnd = this.getSelectionEnd();
    if (posStart !== posEnd) {
      // text selected
      const ret = StringUtil.decreaseIndentRange(this.getValue(), posStart, posEnd);
      this.setValue(ret.updated);
      this.setSelection(posStart - ret.numRemoveStart, posEnd - ret.numRemoveStart);
    } else {
      // no text selected
      this.unindent(posStart);
    }
  }

  private handleBackspaceKeyDown(e: KeyboardEvent) {
    const posStart = this.getSelectionStart();
    const posEnd = this.getSelectionEnd();
    if (posStart === posEnd) {
      const pos = posStart;
      const line = StringUtil.getLineInfo(pos, this.getValue());
      if (line.indent > 0 && 0 < line.col && line.col <= line.indent) {
        e.preventDefault();
        this.unindent(pos);
      }
    }
  }

  private handleEnterKeyPress(e: KeyboardEvent) {
    const posStart = this.getSelectionStart();
    const posEnd = this.getSelectionEnd();
    if (posStart !== posEnd) {
      return;
    }
    const pos = posStart;
    const line = StringUtil.getLineInfo(pos, this.getValue());
    if (line.col === line.str.length && line.indent > 0 && line.str.length === line.indent) {
      // when there's indent only and the cursor is at the end of line
      e.preventDefault();
      this.unindent(pos);
    } else if (line.bullet && line.str.length === line.indent + line.bullet.length && line.str.length === line.indent) {
      // when there's indent and bullet only and the cursor is at the end of line
      e.preventDefault();
      this.removeBullet(pos, line);
    } else if (line.col >= line.indent + line.bullet.length) {
      // when the cursor is after the indent and bullet (if exists)
      // => continues indent and bullet (if exists)
      e.preventDefault();
      const strInsert: string = '\n' + ' '.repeat(line.indent) + line.bullet;
      this.insert(strInsert, pos);
    } else if (line.bullet && line.col === line.indent) {
      // when the cursor is between indent and bullet
      // => continues only the indent
      e.preventDefault();
      const strInsert: string = '\n' + ' '.repeat(line.indent);
      this.insert(strInsert, pos);
    }
  }

  private unindent(pos: number): void {
    const ret = StringUtil.decreaseIndent(this.getValue(), pos);
    this.setValue(ret.updated);
    this.setSelection(pos - ret.numRemove, pos - ret.numRemove);
  }

  private removeBullet(pos: number, line: LineInfo): void {
    const value = this.getValue();
    const newValue = value.substring(0, pos - line.bullet.length) + value.substring(pos);
    this.setValue(newValue);
    this.setSelection(pos - line.bullet.length, pos - line.bullet.length);
  }

  private insert(str: string, pos: number): void {
    const value = this.getValue();
    const newValue: string = value.substring(0, pos) + str + value.substring(pos);
    this.setValue(newValue);
    this.setSelection(pos + str.length, pos + str.length);
  }
}
