# easy-marked
简单实用的markdown(antd风格)编辑器


[![npm](https://img.shields.io/npm/v/easy-marked.svg?style=flat)]()
## 安装
```
 npm install --save easy-marked
```

## demo
[https://fangmu00.github.io/easy-marked](https://fangmu00.github.io/easy-marked)
## 使用
```
import React from 'react';
import ReactDOM from 'react-dom';
import Edit from 'easy-marked;

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

```
## props
| 参数 | 说明 | 类型 | 默认值
| -------- | -------- | -------- | -------- |
| value    | 默认输入值 | string   | ''       |
| placeholder | 提示文案 | string   | '请输入'       |
| onChange    | 输入发生变化回调 | function(data, htmlData)   | 无      |
| onSave    | 保存回调（Ctrl+S） | function(data, htmlData)   | 无      |
| className    | 自定义样式容器 | string   | ''       |
| uploadAction    | 图片上传地址 | string   | ''       |
| uploadName    | 图片上传字段 | string   | ''       |
| afterUpload    | 图片上传服务端返回的数据，返回图片地址 | function(data)   | 无      |
| option    | marked配置 基于[marked](https://github.com/chjj/marked) | object   | 无 |

