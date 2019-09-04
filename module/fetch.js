const axios = require('axios')
const chalk = require('chalk')
const cheerio = require('cheerio')
const clipboard = require('clipboardy')
const fs = require('fs')
const inquirer = require('inquirer')
const urlz = require('url')

let shorturl = ['coeg.in', 'telondasmu.com', 'tetew.info', 'greget.space', 'siherp.com', 'ahexa.com'],
    safeurl = ['njiir.com'],
    safeurl2 = ['eue.siherp.com'],
    safelink2 = ['anjay.info'],
    collect = {};

const querySearch = (q, u) => {
    if (!u) return null;
    q = q.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + q + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(u);
    return results == null ? null : results[1];
}

const getPage = async (url, save = false) => {
    let { data } = await axios.get(url)
    getLinks(data, save)
}

const getList = async (url, save = false) => {
    let arrQuest = []
    let { headers, data } = await axios.get(url)
    let page = parseInt(querySearch('page', url))
    let total = parseInt(headers['x-wp-totalpages'])
    data.forEach(c => {
        arrQuest.push({
            name: c.title.rendered,
            value: c.content.rendered
        },
            new inquirer.Separator(chalk.gray(`└> ${new Date(c.date).toLocaleString('en-us', { month: 'long', year: 'numeric', day: 'numeric' })}`)));
    })
    if (page < total) arrQuest.push({
        name: `Next Page > ${(page + 1)}`,
        value: {
            page: true,
            url: "https://www.samehadaku.tv/wp-json/wp/v2/posts?per_page=14&page=" + (page + 1)
        }
    })
    if (page > 1) arrQuest.push({
        name: `Prev Page < ${(page - 1)}`,
        value: {
            page: true,
            url: "https://www.samehadaku.tv/wp-json/wp/v2/posts?per_page=14&page=" + (page - 1)
        }
    })
    let answer = await inquirer.prompt([{
        type: "list",
        pageSize: (arrQuest.length * 2),
        name: "result",
        message: "Select Please",
        choices: arrQuest
    }]).then(a => a)
    if (answer.result.page === true) {
        getList(answer.result.url, save)
    } else {
        getLinks(answer.result, save)
    }
}

const getLinks = async (html, save = false) => {
    let arrQuest = []
    let stamp = new Date().getTime()
    let $ = cheerio.load(html)

    $('.download-eps').each((i, el) => {
        arrQuest.push({
            name: $(el).prev().text(),
            value: {
                html: $(el).html(),
                type: $(el).prev().text().trim()
            }
        })
    })

    let answer = await inquirer.prompt([{
        type: "list",
        name: "format",
        message: "Select The Format",
        choices: arrQuest
    }]).then(a => a)
    $ = cheerio.load(answer.format.html)

    if (save) {
        $('li').each((i, el) => {
            let reso = $(el).find('strong').text().trim()
            collect[reso] = {};
            $(el).find('a').each((i, el) => {
                let server = $(el).text().trim(),
                    link = $(el).attr('href');
                collect[reso][server] = link
                Pancal(link, save, { reso, server, name: stamp, type: answer.format.type });
            })
        })
    } else {
        arrQuest = []
        $('li').each((i, el) => {
            let reso = $(el).find('strong').text().trim()
            arrQuest.push(new inquirer.Separator(chalk.green(`████ ${reso} ████`)))
            $(el).find('a').each((i, el) => {
                arrQuest.push({
                    name: $(el).text() + ' [' + reso + ']',
                    value: $(el).attr('href')
                })
            })
        })
        let answer2 = await inquirer.prompt([{
            type: "list",
            name: "url",
            message: "Select The Resolution and Server ",
            choices: arrQuest
        }]).then(a => a)
        Pancal(answer2.url)
    }
}

const Pancal = async (url, save = false, config = {}) => {
    let next = !1
    let urlnya = null

    let { data } = await axios.get(url)

    let $ = cheerio.load(data)
    urlnya = $('#splash').find('a[href*="?r=a"]')
    if (urlnya.length) {
        urlnya = $('#splash').find('a[href*="?r=a"]').attr('href');
        urlnya = Buffer.from(querySearch('r', urlnya), 'base64').toString('ascii');
    } else {
        if (safeurl.indexOf(urlz.parse(url).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1) {
            urlnya = decodeURIComponent(querySearch('url', url))
            urlnya = decodeURIComponent(Buffer.from(urlnya, 'base64').toString('ascii').substr(2).split('').reverse().join('').substr(2).split('').reverse().join(''))
            let build = '';
            for (let i = 0; i < urlnya.length; i++) {
                build = String.fromCharCode(40 ^ urlnya.charCodeAt(i)) + build;
            }
            urlnya = build
        } else if (safeurl2.indexOf(urlz.parse(url).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1) {
            urlnya = decodeURIComponent(querySearch('url', url))
            urlnya = decodeURIComponent(Buffer.from(urlnya, 'base64').toString('ascii'))
        } else if (safelink2.indexOf(urlz.parse(url).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1) {
            var params = new URLSearchParams();
            params.append('eastsafelink_id', querySearch('id', url));
            let { data } = await axios.post('https://www.anjay.info/cluster-detection/', params).then(a => a)
            urlnya = data.match(/var a='(https?:\/\/[^ ]*)'/)[1]
            next = false
        } else {
            urlnya = url
        }
    }
    next = [...shorturl, ...safeurl, ...safeurl2, ...safelink2].indexOf(urlz.parse(urlnya).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1 ? urlnya : false;
    if (next) {
        Pancal(next, save, config)
    } else {
        if (save) {
            collect[config.reso][config.server] = urlnya
            fs.writeFileSync('./[' + config.type + ']' + config.name + '.txt', JSON.stringify(collect, null, 4))
            console.log(`Proccesing...`)
        } else {
            console.log(`URL : ${chalk.blue(urlnya)}`)
            clipboard.writeSync(urlnya)
            console.log(chalk.green('URL Has Copy On Your Clipboard'))
        }
    }
}

module.exports = {
    getList,
    getPage
}