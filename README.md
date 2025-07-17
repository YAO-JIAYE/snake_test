## 此项目用途

```
一个AI小测试
```



## 创建nextjs工程

```npx create-next-app```命令创建

前提是，你有nodejs环境

我的项目取名为`snake`，也就是贪吃蛇应用

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250716174925653.png)

然后我们可以启动项目,`npm run dev`

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250716175313782.png)

## 使用AI工具

本人不会`nextJS`/(ㄒoㄒ)/~~😶，所以这里使用vscode的插件`codegeex`，在应用市场把这个插件下了

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250716184833597.png)

很快，AI就帮我们做好了这个小程序

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250716184732022.png)

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250716184645251.png)

## 上传GitHub

`建一个新仓库` 

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250716231059717.png)

复制SSH

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250716231154625.png)

再通过vscode的git插件上传

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250716231329185.png)

## 数据库

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250716231719401.png)

这边使用[NEON数据库](https://neon.com/),它有免费的500mb的存储空间

NEON是基于Postgresql的免费数据库

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250716232046513.png)

:::note

记得选择离自己近的，我选择新加坡区域



点击右上角的connect，就可以查看数据库链接地址

![image-20250716232542989](D:\myWorkSpace\qianduanProjects\snake\assets\image-20250716232542989.png)

打开navicat

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250717011448846.png)

创建一个数据库

```postgresql
DROP TABLE IF EXISTS "public"."player_score";
CREATE TABLE "public"."player_score" (
  "player_name" varchar(255) COLLATE "pg_catalog"."default",
  "score" int4
);
```

## 再次使用AI工具

我的诉求是

```
游戏开始前，弄一个输入框让玩家填入名称，再弄一个结束按钮，当点击结束按钮时，请把玩家数据保存到PostPreSQL数据库里，以下是建表语句：
CREATE TABLE "public"."player_score" (
"player_name" varchar(255) COLLATE "pg_catalog"."default",
"score" int4
); 连接数据库的信息：postgresql://用户名:密码@ep-lingering-voice-a1fqfc92-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require 要求：编写的是后端nodejs代码，发起post请求到数据库
```

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250717013338764.png)

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250717013427276.png)

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250717013445436.png)

也是成功实现了

## 部署到vercel

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250717130100106.png)

![](https://cdn.jsdelivr.net/gh/YAO-JIAYE/my_imgs_repo@main/imgs/20250717131106650.png)

## 其他
以下是部署好的网站：但是国内不能访问，得托管一下
https://snake-test-omega.vercel.app/

```
此项目主要用作ai写代码的测试，当然还有ddos防御，买域名，利用cloudflare托管，创建公司邮箱等等没有实现...之后再说
```

