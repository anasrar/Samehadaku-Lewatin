const request = require('request-promise');
const cheerio = require('cheerio');
const inquirer = require('inquirer');
const chalk = require('chalk');
const urlz = require('url');
const clipboard = require('clipboardy');
const fs = require('fs');
const path = require('path');

let shorturl = ['coeg.in', 'telondasmu.com', 'tetew.info', 'greget.space', 'siherp.com'],
    safeurl = ['njiir.com'],
    safeurl2 = ['eue.siherp.com'],
    collect = {};

const querySearch = (q, u) => {
    if (!u) return null;
    q = q.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + q + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(u);
    return results == null ? null : results[1];
}

const getListSearch = (url, save = false) => {
    let arrQuest = [];
    request(url, (err, res, body) => {
        if (err && res.statusCode !== 200) throw err;

        let $ = cheerio.load(body),
            list = $('body').find('#posts-container>li'),
            prev = $('body').find('li.current').prev(),
            next = $('body').find('li.current').next();

        if (!list.length) {
            console.log(`anime with query ${decodeURIComponent(querySearch('s', url))} has not found`)
        } else {
            list.each((i, el) => {
                arrQuest.push({
                    name: $(el).find('.post-title').text().trim(),
                    value: $(el).find('.post-title>a').attr('href')
                },
                    new inquirer.Separator(chalk.gray(`└> ${$(el).find('.date.meta-item').text().trim()}`)));
                if ((list.length - 1) === i && next.length) arrQuest.push({
                    name: `Next Page > ${next.find('a').text()}`,
                    value: {
                        page: true,
                        url: next.find('a').attr('href')
                    }
                });
                if ((list.length - 1) === i && prev.length) arrQuest.push({
                    name: `Prev Page < ${prev.find('a').text()}`,
                    value: {
                        page: true,
                        url: prev.find('a').attr('href')
                    }
                });
            })
        }

    }).then(() => {
        inquirer.prompt([{
            type: "list",
            pageSize: (arrQuest.length * 2),
            name: "result",
            message: "Select Please",
            choices: arrQuest
        }]).then((a) => {
            if (a.result.page === true) {
                getListSearch(a.result.url, save)
            } else {
                getLinks(a.result, save)
            }
        })
    })
}

const getList = (url, save = false) => {
    let arrQuest = [];
    request(url, (err, res, body) => {
        if (err && res.statusCode !== 200) throw err;

        let $ = cheerio.load(body),
            list = $('#tie-block_1744').find('.posts-items>li'),
            prev = $('#tie-block_1744').find('li.current').prev(),
            next = $('#tie-block_1744').find('li.current').next();

        list.each((i, el) => {
            arrQuest.push({
                name: $(el).find('.post-title').text().trim(),
                value: $(el).find('.post-title>a').attr('href')
            },
                new inquirer.Separator(chalk.gray(`└> ${$(el).find('.date.meta-item').text().trim()}`)));
            if ((list.length - 1) === i && next.length) arrQuest.push({
                name: `Next Page > ${next.find('a').text()}`,
                value: {
                    page: true,
                    url: next.find('a').attr('href')
                }
            });
            if ((list.length - 1) === i && prev.length) arrQuest.push({
                name: `Prev Page < ${prev.find('a').text()}`,
                value: {
                    page: true,
                    url: prev.find('a').attr('href')
                }
            });
        });
    }).then(() => {
        inquirer.prompt([{
            type: "list",
            pageSize: (arrQuest.length * 2),
            name: "result",
            message: "Select Please",
            choices: arrQuest
        }]).then((a) => {
            if (a.result.page === true) {
                getList(a.result.url, save)
            } else {
                getLinks(a.result, save)
            }
        })
    })
}

const getLinks = (url, save = false) => {
    let arrQuest = [];

    request(url, (err, res, body) => {
        if (err && res.statusCode !== 200) throw err;

        let $ = cheerio.load(body);

        $('#the-post').find('.download-eps').each((i, el) => {
            arrQuest.push({
                name: $(el).prev().text(),
                value: {
                    html: $(el).html(),
                    type: $(el).prev().text().trim()
                }
            });
        });

    }).then(() => {

        inquirer.prompt([{
            type: "list",
            name: "format",
            message: "Select The Format",
            choices: arrQuest
        }]).then(a => {
            let $ = cheerio.load(a.format.html);

            if (save) {
                $('li').each((i, el) => {
                    let reso = $(el).find('strong').text().trim();
                    collect[reso] = {};
                    $(el).find('a').each((i, el) => {
                        let server = $(el).text().trim(),
                            link = $(el).attr('href');
                        collect[reso][server] = link;
                        Pancal(link, save, { reso, server, name: path.basename(url, '.html'), type: a.format.type })
                    })
                })
            } else {
                arrQuest = [];
                $('li').each((i, el) => {
                    let reso = $(el).find('strong').text().trim();
                    arrQuest.push(new inquirer.Separator(chalk.green(`████ ${reso} ████`)));
                    $(el).find('a').each((i, el) => {
                        arrQuest.push({
                            name: $(el).text() + ' [' + reso + ']',
                            value: $(el).attr('href')
                        });
                    });
                });

                inquirer.prompt([{
                    type: "list",
                    name: "url",
                    message: "Select The Resolution and Server ",
                    choices: arrQuest
                }]).then(a => {
                    Pancal(a.url)
                })
            }


        })
    })
}

const Pancal = (url, save = false, config = {}) => {
    let next = !1,
        urlnya;

    request(url, (err, res, body) => {
        if (err && res.statusCode !== 200) throw err;

        let $ = cheerio.load(body);
        urlnya = $('#splash').find('a[href*="?r=a"]');
        if (urlnya.length) {
            urlnya = $('#splash').find('a[href*="?r=a"]').attr('href');
            urlnya = Buffer.from(querySearch('r', urlnya), 'base64').toString('ascii');
            next = [...shorturl, ...safeurl, ...safeurl2].indexOf(urlz.parse(urlnya).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1 ? urlnya : false;
        } else {
            if (safeurl.indexOf(urlz.parse(url).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1) {
                urlnya = decodeURIComponent(querySearch('url', url))
                urlnya = decodeURIComponent(Buffer.from(urlnya, 'base64').toString('ascii').substr(2).split('').reverse().join('').substr(2).split('').reverse().join(''))
                let build = '';
                for (let i = 0; i < urlnya.length; i++) {
                    build = String.fromCharCode(40 ^ urlnya.charCodeAt(i)) + build;
                }
                urlnya = build
                next = [...shorturl, ...safeurl, ...safeurl2].indexOf(urlz.parse(urlnya).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1 ? urlnya : false;
            } else if (safeurl2.indexOf(urlz.parse(url).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1) {
                urlnya = decodeURIComponent(querySearch('url', url))
                urlnya = decodeURIComponent(Buffer.from(urlnya, 'base64').toString('ascii'))
                next = [...shorturl, ...safeurl, ...safeurl2].indexOf(urlz.parse(urlnya).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1 ? urlnya : false;
            } else {
                urlnya = url
            }
        }

    }).then(() => {
        if (next) {
            Pancal(next, save, config)
        } else {
            if (save) {
                collect[config.reso][config.server] = urlnya;
                fs.writeFileSync('./[' + config.type + ']' + config.name + '.txt', JSON.stringify(collect, null, 4));
            } else {
                console.log(`URL : ${chalk.blue(urlnya)}`);
                clipboard.writeSync(urlnya);
                console.log(chalk.green('URL Has Copy On Your Clipboard'))
            }
        }
    })
}

const getListJSON = (url, save = false) => {
    let arrQuest = []
    request(url, (err, res, body) => {
        if (err && res.statusCode !== 200) throw err;

        let page = parseInt(querySearch('page', url)),
            total = parseInt(res.headers['x-wp-totalpages'])

        let list = JSON.parse(body)
        list.forEach(c => {
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
        });
    }).then(() => {
        inquirer.prompt([{
            type: "list",
            pageSize: (arrQuest.length * 2),
            name: "result",
            message: "Select Please",
            choices: arrQuest
        }]).then((a) => {
            if (a.result.page === true) {
                getListJSON(a.result.url, save)
            } else {
                getLinksHTML(a.result, save)
            }
        })
    })
}

const getLinksHTML = (html, save = false) => {
    let arrQuest = [],
        stamp = new Date().getTime(),
        $ = cheerio.load(html)

    $('.download-eps').each((i, el) => {
        arrQuest.push({
            name: $(el).prev().text(),
            value: {
                html: $(el).html(),
                type: $(el).prev().text().trim()
            }
        })
    })

    inquirer.prompt([{
        type: "list",
        name: "format",
        message: "Select The Format",
        choices: arrQuest
    }]).then(a => {
        let $ = cheerio.load(a.format.html);

        if (save) {
            $('li').each((i, el) => {
                let reso = $(el).find('strong').text().trim();
                collect[reso] = {};
                $(el).find('a').each((i, el) => {
                    let server = $(el).text().trim(),
                        link = $(el).attr('href');
                    collect[reso][server] = link;
                    Pancal(link, save, { reso, server, name: stamp, type: a.format.type })
                })
            })
        } else {
            arrQuest = [];
            $('li').each((i, el) => {
                let reso = $(el).find('strong').text().trim();
                arrQuest.push(new inquirer.Separator(chalk.green(`████ ${reso} ████`)));
                $(el).find('a').each((i, el) => {
                    arrQuest.push({
                        name: $(el).text() + ' [' + reso + ']',
                        value: $(el).attr('href')
                    });
                });
            });

            inquirer.prompt([{
                type: "list",
                name: "url",
                message: "Select The Resolution and Server ",
                choices: arrQuest
            }]).then(a => {
                Pancal(a.url)
            })
        }


    })
}

module.exports = {
    querySearch,
    getListSearch,
    getList,
    getLinks,
    Pancal,
    getListJSON,
    getLinksHTML
}