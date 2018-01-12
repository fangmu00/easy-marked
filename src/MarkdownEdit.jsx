import React, { PropTypes } from 'react';
import marked from 'marked';
import { Input, Row, Col, Upload, Button, message, Icon } from 'antd';
import { cmd, uploadRPC } from './const';
import './style.less';

const { TextArea } = Input;

class MarkdownEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      history: {
        data: [''],
        currentIndex: 0,
      }, // 记录操作记录
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    marked.setOptions(this.props.option);
    this.view.innerHTML = marked(this.state.value);
    this.textareaRef.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillReceiveProps({ value }) {
    if (value) {
      const { history } = this.state;
      history.data[history.currentIndex] = value;
      this.setState({
        value,
        history,
      }, this.renderView);
    }
  }

  componentWillUnmount() {
    this.textareaRef.removeEventListener('keydown', this.handleKeyDown);
  }

  setHistory(value) {
    const { history } = this.state;
    history.data.push(value);
    history.currentIndex = history.data.length - 1;
    this.props.onChange(value);
  }

  prevHistory() {
    const { history } = this.state;
    if (history.currentIndex > 0) {
      history.currentIndex -= 1;
      this.setState({
        value: history.data[history.currentIndex],
        history,
      }, this.renderView);
    }
    this.props.onChange(history.data[history.currentIndex]);
  }

  nextHistory() {
    const { history } = this.state;
    if (history.currentIndex < history.data.length) {
      history.currentIndex += 1;
      this.setState({
        value: history.data[history.currentIndex],
        history,
      }, this.renderView);
    }
    this.props.onChange(history.data[history.currentIndex]);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    }, this.renderView);
    this.setHistory(e.target.value);
  }

  handleKeyDown(e) {
    const { keyCode, ctrlKey } = e;
    if (keyCode === 90 && ctrlKey) {
      e.preventDefault();
      this.prevHistory();
    } else if (keyCode === 9) {
      e.preventDefault();
      this.selectionReplace(cmd.tab);
    }
  }

  handleScroll(e) {
    const { target } = e;
    const { scrollTop, scrollHeight, offsetHeight } = target;
    const viewScrollHeight = this.view.scrollHeight;
    const viewHeight = this.view.offsetHeight;
    this.view.scrollTop = (scrollTop / (scrollHeight - offsetHeight)) * (viewScrollHeight - viewHeight);
  }

  selectionReplace({ text, selectRange }) {
    const { value } = this.state;
    const { selectionStart, selectionEnd } = this.textareaRef;
    const v = value || '';
    const textBefore = v.substring(0, selectionStart);
    const textAfter = v.substring(selectionEnd, value.length);
    const backValue = `${textBefore}${text}${textAfter}`;
    this.setState({
      value: backValue,
    }, () => {
      this.renderView();
      this.textareaRef.focus();
      this.textareaRef.setSelectionRange(selectionStart + selectRange[0], selectionStart + selectRange[1]); // 设置光标位置
    });
    this.setHistory(backValue);
  }

  renderView() {
    this.view.innerHTML = marked(this.state.value || '');
  }

  renderButton() {
    const me = this;
    const { history } = me.state;
    const props = {
      name: 'file',
      action: uploadRPC,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
          const imgCode = cmd.img(info.file.name, info.file.response.content.retValue.path);
          me.selectionReplace(imgCode);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div className="markdown-edit-actionbar">
        <Button
          onClick={() => {
            this.selectionReplace(cmd.code);
          }}
        >
          插入代码
        </Button>
        <Button
          onClick={() => {
            this.selectionReplace(cmd.table);
          }}
        >
          插入表格
        </Button>
        <Button
          onClick={() => {
            const { value } = this.state;
            const { selectionStart, selectionEnd } = this.textareaRef;
            const selectText = value.substring(selectionStart, selectionEnd);
            this.selectionReplace(cmd.link(selectText));
          }}
        >
          插入链接
        </Button>
        <Upload {...props}>
          <Button>
            上传图片
          </Button>
        </Upload>
        <Button
          onClick={() => {
            this.prevHistory();
          }}
          disabled={history.currentIndex === 0}
        >
          <Icon type="arrow-left" />
        </Button>
        <Button
          onClick={() => {
            this.nextHistory();
          }}
          disabled={history.currentIndex === history.data.length - 1}
        >
          <Icon type="arrow-right" />
        </Button>
      </div>

    );
  }
  render() {
    return (
      <div className="markdown-edit">
        <Row gutter={16}>
          {
            this.renderButton()
          }
          <Col span={12}>
            <TextArea
              placeholder={this.props.placeholder}
              onChange={this.handleChange}
              onScroll={this.handleScroll}
              value={this.state.value}
              autosize={{ minRows: 20, maxRows: 20 }}
              ref={(c) => { if (c) { this.textareaRef = c.textAreaRef; } }}
            />
          </Col>
          <Col span={12}>
            <div className="markdown-edit-view" ref={(c) => { this.view = c; }} />
          </Col>
        </Row>
      </div>

    );
  }
}

MarkdownEdit.defaultProps = {
  option: {
    gfm: true,
    breaks: true,
    smartypants: true,
  },
  placeholder: '',
  value: '# Marked in browser\n\nRendered by **marked**.',
  onChange: () => {},
};

MarkdownEdit.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  option: PropTypes.objectOf(PropTypes.any),
};

export default MarkdownEdit;
