const { getPage, getList } = require('./fetch');
const { ZippyDL, GDriveDL } = require('./dl');
const chalk = require('chalk');
const minimist = require('minimist');
const request = require('request-promise');
const semver = require('semver')

let url = "https://www.samehadaku.tv/",
    version = require('../package.json').version;

console.log(`${chalk.yellow(`╔═╗╔═╗╔╦╗╔═╗╦ ║╔═╗╔╦╗╔═╗╦╔═║ ╦  ╦  ╔═╗╦ ╦╔═╗╔╦╗╦╔╗║
╚═╗╠═╣║║║║╣ ╠═╣╠═╣ ║║╠═╣╠╩╗║ ║  ║  ║╣ ║║║╠═╣ ║ ║║║║
╚═╝║ ║╩ ╩╚═╝║ ╩║ ║═╩╝║ ║╩ ╩╚═╝  ╚═╝╚═╝╚╩╝╩ ╩ ╩ ╩║╚╝`)}
===============================================================
Version    : ${version}
Repository : https://github.com/anasrar/Samehadaku-Lewatin
===============================================================`);

(async () => {
    await request("https://raw.githubusercontent.com/anasrar/Samehadaku-Lewatin/master/package.json", (err, res, body) => {
        if (err && res.statusCode !== 200) throw err;
        const newVersion = JSON.parse(body).version
        if (semver.lt(version, newVersion)) {
            console.log(`${chalk.yellow(`We Have New Version : ${newVersion}`)}`)
        }
    })

    const args = minimist(process.argv.slice(2));
    let cmd = args._[0] || 'help';

    if (args.help || args.h) {
        cmd = 'help'
    }
    switch (cmd) {
        case 'list':
            getList(url + 'wp-json/wp/v2/posts?per_page=14&page=1', (args.s === true || args.save === true));
            break;
        case 'page':
            let page = args._[1] || 1;
            getList(url + 'wp-json/wp/v2/posts?per_page=14&page=' + page, (args.s === true || args.save === true));
            break;
        case 'from':
            let laman = args._[1] || url;
            if (laman == url) {
                getListJSON(url + 'wp-json/wp/v2/posts?per_page=14&page=1', (args.s === true || args.save === true));
            } else {
                getPage(laman, (args.s === true || args.save === true));
            }
            break;
        case 'help':
            console.log(
                `Usage: samehadaku <command> [options]

where <command> is one of:
    list, page, help, from, zippydl, gdrivedl

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

})();

// console.log(args)