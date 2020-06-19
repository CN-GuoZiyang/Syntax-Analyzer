# Parser

![node-current](https://img.shields.io/node/v/electron)
[![GitHub license](https://img.shields.io/github/license/CN-GuoZiyang/Syntax-Analyzer)](https://github.com/CN-GuoZiyang/Syntax-Analyzer/blob/master/LICENSE)

Electron平台的基于C89语法子集的语法分析器，在线体验：https://guoziyang.top/projects/Syntax-Analyzer

对应的Web版本：https://github.com/CN-GuoZiyang/Syntax-Analyzer-Web

## 运行方式

请首先安装nodejs和npm，并clone此项目，在项目目录下
```shell
# 安装依赖
npm install
# 运行
npm start
```

由于项目使用electron，国内可使用electron镜像完成依赖安装，在安装依赖前运行：
```shell
export ELECTRON_MIRROR="https://cdn.npm.taobao.org/dist/electron/
```

## 项目介绍

![74424E56-1C08-4F2E-AFBB-A7B15CE06FC3.png](https://img.guoziyang.top/images/2020/06/19/74424E56-1C08-4F2E-AFBB-A7B15CE06FC3.png)

本项目在Electron平台下实现了一个语法分析器，语法采用C89标准的子集语法。

用户可以手动在编辑器栏输入文本，也可通过`读取`按钮选择本地文件，亦可以将文件直接拖动到编辑器中实现上传。

上传完成后，点击`分析`按钮，会对编辑器中的文本进行词法及语法分析。分析后的结果——token树会呈现在右侧的结果栏，分析过程中出现的错误也会显示在下方的错误栏中，包括错误的字串、所在行号及错误信息，编辑器中也会对错误部分使用红色波浪线高亮。

分析后，点击`树状图`按钮，分析结果便更直观地通过树状图展现出来，如下，该界面可以任意拖动缩放、展开收回节点，更好地把握文本结构。

![B03B9B00-8AFA-4175-B87C-240B49CEEBB3.png](https://img.guoziyang.top/images/2020/06/19/B03B9B00-8AFA-4175-B87C-240B49CEEBB3.png)

语法分析使用自顶向上分析，基于LL1文法，点击`LL1`按钮，即可查看文法定义。

![E300F1A1-BEA0-4B32-A190-D5CB3DED9A1F.png](https://img.guoziyang.top/images/2020/06/19/E300F1A1-BEA0-4B32-A190-D5CB3DED9A1F.png)

该界面同时可查看产生式对应的预测分析表，以及各个非终结符的First集、Follow集和Select集。
