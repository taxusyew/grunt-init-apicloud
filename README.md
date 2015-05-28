grunt-init-apicloud
========================
基于grunt-init文档开发的一套模板
用于快速开发、部署APICloud应用

# 基本使用方法
## 下载模板
`git clone https://github.com/taxusyew/grunt-init-apicloud.git ~/.grunt-init/apicloud`
> windows上就放在`%USERPROFILE%\.grunt-init\`

## 创建新项目
1. 新建项目文件夹，`/path/to/my-project`
2. 在**该文件夹**下，初始化模板: `grunt-init apicloud`

> 如果模板文件不是放在`.grunt-init`文件夹下，那就使用`grunt-init /path/to/my-template`

## 生成编译后项目
1. 安装npm模块: `npm install`
2. 生成项目: `grunt`

> 最终项目源码会在 `/path/to/my-project/build` 文件夹下


# 开发流程
1. 在src文件夹下开发源码
2. 对html文件书写usemin的block
	```
	<!-- build:css ./css/css_index.css -->
	    <link rel="stylesheet" type="text/css" href="./css/api.css" />
	    <link rel="stylesheet" type="text/css" href="./css/common.css" />
	<!-- endbuild -->

	<!-- build:js ./script/api_index.js -->
		<script src="./script/api.js"></script>
		<script src="./script/apiutil.js"></script>
		<script src="./script/chatbox.js"></script>
	<!-- endbuild -->
	```
> 第一行第一部分build后面写的是链接类型：css或js
> 第一行第二部分是替换后希望出现的路径，一般情况下usemin会在concat的阶段解析这个路径，造成最终生成代码位置出错，所以在Gruntfile.js里面的配置中，做出相应处理，现已能正确生成文件 

3. 生成可以上线代码 `grunt`
