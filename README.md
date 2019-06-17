```
╔═╗╔═╗╔╦╗╔═╗╦ ║╔═╗╔╦╗╔═╗╦╔═║ ╦  ╦  ╔═╗╦ ╦╔═╗╔╦╗╦╔╗║
╚═╗╠═╣║║║║╣ ╠═╣╠═╣ ║║╠═╣╠╩╗║ ║  ║  ║╣ ║║║╠═╣ ║ ║║║║
╚═╝║ ║╩ ╩╚═╝║ ╩║ ║═╩╝║ ║╩ ╩╚═╝  ╚═╝╚═╝╚╩╝╩ ╩ ╩ ╩║╚╝
```

# Samehadaku Lewatin

[![NPM](https://nodei.co/npm/samehadaku-lewatin.png?compact=true)](https://nodei.co/npm/samehadaku-lewatin/)

![GitHub package.json version](https://img.shields.io/github/package-json/v/anasrar/samehadaku-lewatin.svg) ![GitHub](https://img.shields.io/github/license/anasrar/samehadaku-lewatin.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/anasrar/Samehadaku-Lewatin.svg)

🏃‍ Just Bypassing URL Shorter Using Node.js From Samehadaku.tv, Work on Linux, Windows, and Termux

# Install With NPM

```
$ npm install samehadaku-lewatin -g
```

# Use With NPX

```
$ npx samehadaku-lewatin <args>
```

# Install With Git

Clone This Repository

```
$ git clone https://github.com/anasrar/Samehadaku-Lewatin.git samehadaku
```

Change Directory

```
$ cd samehadaku
```

## Install Dependencies

```
$ npm install
```

## Link Into Binary

```
$ npm link
```

# How To Use

Get List Anime From Homepage
```
$ samehadaku list
```

![DEMO](DEMO.gif)

___

Get List Anime From Specific Page
```
$ samehadaku page 3
```

Get List Anime From Search Page
```
$ samehadaku search "some anime"
```

Get List Anime From URL Page
```
$ samehadaku from "https://www.samehadaku.tv/2019/04/fairy-tail-episode-304-subtitle-indonesia.html"
```

Save All Link Quality From Specific Page Use Flag ```-s``` or ```--save```
```
$ samehadaku list -s
```
```
$ samehadaku page 2 --save
```
```
$ samehadaku search "some anime" -s
```
```
$ samehadaku from "https://www.samehadaku.tv/2019/04/fairy-tail-episode-304-subtitle-indonesia.html" --save
```

Link Save In JSON Format On Some .txt File

## Downloader

### Google Drive

```
samehadaku gdrivedl <url>
```
example

```
samehadaku gdrive "https://drive.google.com/open?id=xxx"
or
samehadaku gdrive "https://drive.google.com/file/d/xxx/view"
```

Thanks To [ariakm25](https://github.com/ariakm25) For Make Great Tools

https://github.com/ariakm25/GDriveDL

### Zippyshare

```
samehadaku zippydl <url>
```
example

```
samehadaku zippydl "https://xxx.zippyshare.com/v/xxx/file.html"
```

https://github.com/anasrar/Zippy-DL

# Changelog
[HERE](CHANGELOG.md)

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details