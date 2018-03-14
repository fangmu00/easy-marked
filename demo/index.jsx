import React from 'react';
import ReactDOM from 'react-dom';
import Edit from '../src';

// ReactDOM.render(<Edit value={'# 大标题\n**粗体**\n_斜体_\n~~删除线~~\n* List\n\n\n1. List\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n| Text     | Text     | Text     |\n| Text     | Text     | Text     |\n| Text     | Text     | Text     |\n| Text     | Text     | Text     |\n| Text     | Text     | Text     |\n[我的github](https://github.com/fangmu00)\n```\ncode\n```\n![](https://avatars0.githubusercontent.com/u/15853597?s=460&v=4)'} />, document.getElementById('App'));
ReactDOM.render(
  <Edit
    value="# 欢迎试用编辑器"
    uploadAction="//127.0.0.1:8090/file-upload"
    uploadName="file"
    afterUpload={data => data.url}
    onChange={(data, htmlData) => {
      console.log(data, htmlData);
    }}
    onSave={(data, htmlData) => {
      console.log(data, htmlData);
    }}
  />,
  document.getElementById('App'),
);
