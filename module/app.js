const { getList, getLinks, Pancal, getListSearch, getListJSON } = require('./fetch');
const { ZippyDL, GDriveDL } = require('./dl');
const chalk = require('chalk');
const minimist = require('minimist');

let url = "https://www.samehadaku.tv/",
    version = require('../package.json').version;

console.log(`${chalk.yellow(`╔═╗╔═╗╔╦╗╔═╗╦ ║╔═╗╔╦╗╔═╗╦╔═║ ╦  ╦  ╔═╗╦ ╦╔═╗╔╦╗╦╔╗║
╚═╗╠═╣║║║║╣ ╠═╣╠═╣ ║║╠═╣╠╩╗║ ║  ║  ║╣ ║║║╠═╣ ║ ║║║║
╚═╝║ ║╩ ╩╚═╝║ ╩║ ║═╩╝║ ║╩ ╩╚═╝  ╚═╝╚═╝╚╩╝╩ ╩ ╩ ╩║╚╝`)}
===============================================================
Version    : ${version}
Repository : https://github.com/anasrar/Samehadaku-Lewatin
===============================================================`);

const args = minimist(process.argv.slice(2));
let cmd = args._[0] || 'help';

if (args.help || args.h) {
    cmd = 'help'
}
switch (cmd) {
    case 'list':
        getListJSON(url + 'wp-json/wp/v2/posts?per_page=14&tags[]=2&tags[]=8&tags[]=9&page=1', (args.s === true || args.save === true));
        break;
    case 'page':
        let page = args._[1] || 1;
        getListJSON(url + 'wp-json/wp/v2/posts?per_page=14&tags[]=2&tags[]=8&tags[]=9&page=' + page, (args.s === true || args.save === true));
        break;
    case 'search':
        let query = args._[1] || "";
        getListSearch(url + '?s=' + encodeURIComponent(query), (args.s === true || args.save === true));
        break;
    case 'from':
        let laman = args._[1] || url;
        if (laman == url) {
            getListJSON(url + 'wp-json/wp/v2/posts?per_page=14&tags[]=2&tags[]=8&tags[]=9&page=1', (args.s === true || args.save === true));
        } else {
            getLinks(laman, (args.s === true || args.save === true));
        }
        break;
    case 'help':
        console.log(
            `Usage: samehadaku <command> [options]

where <command> is one of:
    list, page, search, help, from, zippydl, gdrivedl

options: [-s|--save] for save link to text file with json format`
        );
        break;
    case 'zippydl':
        url = args._[1]
        if (!url) {
            console.log('Please insert url, e.g : samehadaku zippydl "https://xxx.zippyshare.com/v/xxx/file.html"')
            break;
        }
        ZippyDL(url)
        break;
    case 'gdrivedl':
        url = args._[1]
        if (!url) {
            console.log('Please insert url, e.g : samehadaku gdrive "https://drive.google.com/open?id=xxx" or "https://drive.google.com/file/d/xxx/view"')
            break;
        }
        GDriveDL(url)
        break;
    default:
        console.error(`"${cmd}" is not a valid command!`)
        break;
}
// console.log(args)