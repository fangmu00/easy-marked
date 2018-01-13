import React, { PropTypes } from 'react';
import marked from 'marked';
import { Input, Row, Col, Upload, Button, message, Icon, Dropdown, Menu } from 'antd';
import { cmd, uploadRPC } from './const';
import './style.less';

const { TextArea } = Input;
const ButtonGroup = Button.Group;

class MarkdownEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      history: {
        data: [props.value],
        currentIndex: 0,
      }, // 记录操作记录
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    marked.setOptions(this.props.option);
    this.view.innerHTML = marked(this.state.value || '');
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

  setHistory(value) {
    const { history } = this.state;
    history.data.push(value);
    history.currentIndex = history.data.length - 1;
    this.props.onChange(value, marked(value || ''));
  }

  getSelectValue() {
    const { value } = this.state;
    const { selectionStart, selectionEnd } = this.textareaRef;
    return value.substring(selectionStart, selectionEnd);
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
    this.props.onChange(history.data[history.currentIndex], marked(history.data[history.currentIndex] || ''));
  }

  nextHistory() {
    const { history } = this.state;
    if (history.currentIndex < history.data.length - 1) {
      history.currentIndex += 1;
      this.setState({
        value: history.data[history.currentIndex],
        history,
      }, this.renderView);
    }
    this.props.onChange(history.data[history.currentIndex], marked(history.data[history.currentIndex] || ''));
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
    } else if (keyCode === 89 && ctrlKey) {
      e.preventDefault();
      this.nextHistory();
    } else if (keyCode === 83 && ctrlKey) {
      e.preventDefault();
      this.props.onSave(this.state.value, marked(this.state.value || ''));
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
    const { uploadAction, uploadName, afterUpload } = me.state;
    const props = {
      name: uploadName,
      action: uploadAction,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
          const imgCode = cmd.img(info.file.name, afterUpload(info.file.response));
          me.selectionReplace(imgCode);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const menu = (
      <Menu onClick={(e) => {
          switch (e.key) {
            case '1':
            this.selectionReplace(cmd.h1());
            break;
            case '2':
            this.selectionReplace(cmd.h2());
            break;
            case '3':
            this.selectionReplace(cmd.h3());
            break;
            default:
            {
              this.selectionReplace(cmd.h1());
              break;
            }
          }
        }}
      >
        <Menu.Item key="1">h1 大标题</Menu.Item>
        <Menu.Item key="2">h2 中标题</Menu.Item>
        <Menu.Item key="3">h3 小标题</Menu.Item>
      </Menu>
    );
    return (
      <div className="markdown-edit-actionbar">
        <ButtonGroup>
          <Dropdown overlay={menu}>
            <Button>
              h1  <Icon type="down" />
            </Button>
          </Dropdown>
          <Button
            title="粗体"
            onClick={() => {
              this.selectionReplace(cmd.bold(this.getSelectValue()));
            }}
          >
            B
          </Button>
          <Button
            title="斜体"
            onClick={() => {
              this.selectionReplace(cmd.italic(this.getSelectValue()));
            }}
          >
            <span className="italic">I</span>
          </Button>
          <Button
            title="删除线"
            onClick={() => {
              this.selectionReplace(cmd.deleteline(this.getSelectValue()));
            }}
          >
            <span className="deleteline">S</span>
          </Button>
          <Button
            title="无序列"
            onClick={() => {
              this.selectionReplace(cmd.ulist());
            }}
          >
            <span className="markdown-edit-i ulist" />
          </Button>
          <Button
            title="有序列"
            onClick={() => {
              this.selectionReplace(cmd.olist());
            }}
          >
            <span className="markdown-edit-i olist" />
          </Button>
          <Button
            title="插入代码"
            onClick={() => {
              this.selectionReplace(cmd.code);
            }}
            icon="code-o"
          />
          <Button
            title="插入表格"
            onClick={() => {
              this.selectionReplace(cmd.table);
            }}
            icon="table"
          />
          <Button
            title="插入链接"
            onClick={() => {
              this.selectionReplace(cmd.link(this.getSelectValue()));
            }}
            icon="link"
          />
          <Upload {...props}>
            <Button icon="picture" title="插入图片" />
          </Upload>
          <Button
            title="撤销 Ctrl+Z"
            onClick={() => {
              this.prevHistory();
            }}
            disabled={history.currentIndex === 0}
            icon="arrow-left"
          />
          <Button
            title="重做 Ctrl+Y"
            onClick={() => {
              this.nextHistory();
            }}
            disabled={history.currentIndex === history.data.length - 1}
            icon="arrow-right"
          />
        </ButtonGroup>
      </div>
    );
  }
  render() {
    const { placeholder, className } = this.props;
    const { value } = this.state;
    return (
      <div className={`markdown-edit ${className}`}>
        <Row gutter={16}>
          {
            this.renderButton()
          }
          <Col span={12}>
            <TextArea
              placeholder={placeholder}
              onChange={this.handleChange}
              onScroll={this.handleScroll}
              onKeyDown={this.handleKeyDown}
              value={value}
              className="markdown-edit-text"
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
  option: {},
  uploadAction: '',
  uploadName: 'file',
  afterUpload: data => data,
  placeholder: '请输入',
  className: '',
  value: '',
  onChange: () => {},
  onSave: () => {},
};

MarkdownEdit.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  option: PropTypes.objectOf(PropTypes.any),
  uploadAction: PropTypes.string,
  uploadName: PropTypes.string,
  afterUpload: PropTypes.func,
  onSave: PropTypes.func,
};

export default MarkdownEdit;
