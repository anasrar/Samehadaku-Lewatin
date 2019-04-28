```
╔═╗╔═╗╔╦╗╔═╗╦ ║╔═╗╔╦╗╔═╗╦╔═║ ╦  ╦  ╔═╗╦ ╦╔═╗╔╦╗╦╔╗║
╚═╗╠═╣║║║║╣ ╠═╣╠═╣ ║║╠═╣╠╩╗║ ║  ║  ║╣ ║║║╠═╣ ║ ║║║║
╚═╝║ ║╩ ╩╚═╝║ ╩║ ║═╩╝║ ║╩ ╩╚═╝  ╚═╝╚═╝╚╩╝╩ ╩ ╩ ╩║╚╝
```

# Samehadaku Lewatin

[![NPM](https://nodei.co/npm/samehadaku-lewatin.png?compact=true)](https://nodei.co/npm/samehadaku-lewatin/)

![GitHub package.json version](https://img.shields.io/github/package-json/v/anasrar/samehadaku-lewatin.svg) ![GitHub](https://img.shields.io/github/license/anasrar/samehadaku-lewatin.svg)

🏃‍ Just Bypassing URL Shorter Using Node.js From Samehadaku.tv

# Install With NPM

```
$ npm install samehadaku-lewatin -g
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

# Changelog
## 2.2.3 - 28/04/2019
### Upadte
- Fix Fetch List Anime Use JSON

## 2.1.2 - 15/04/2019
### Fix
- Fix Pagination

## 2.1.1 - 13/04/2019
### Added
- Command From URL Page

## 2.0.1 - 13/04/2019
### Added
- Command Search
- Add Select Next And Prev Page
- Optimizing Code

## 1.2.9 - 23/02/2019
### Added
- Command Save 1 Quality Link As Text File [#1](https://github.com/anasrar/Samehadaku-Lewatin/issues/1)
- Command Page
- Optimizing Code

## 1.2.8 - 22/02/2019
### Added
- Copy to clipboard
- New Safelink URL [ siherp.com ]

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

[i1]: https://github.com/anasrar/Samehadaku-Lewatin/issues/1