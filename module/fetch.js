import request from 'request-promise';
import cheerio from 'cheerio';
import inquirer from 'inquirer';
import chalk from 'chalk';
import urlz from 'url';
import clipboard from 'clipboardy';
import fs from 'fs';
import path from 'path';

let shorturl = ['coeg.in', 'telondasmu.com', 'tetew.info', 'greget.space', 'siherp.com'],
    collect = {};

export const querySearch = (q, u) => {
    if (!u) u = url;
	q = q.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+q+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( u );
	return results == null ? null : results[1];
}

export const getListSearch = (url, save = false) => {
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
                if((list.length - 1) === i && next.length) arrQuest.push({
                    name: `Next Page > ${next.find('a').text()}`,
                    value: {
                        page: true,
                        url: next.find('a').attr('href')
                    }
                });
                if((list.length - 1) === i && prev.length) arrQuest.push({
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
            if(a.result.page === true){
                getListSearch(a.result.url, save)
            } else {
                getLinks(a.result, save)
            }
        })
    })
}

export const getList = (url, save = false) => {
    let arrQuest = [];
    request(url, (err, res, body) => {
        if (err && res.statusCode !== 200) throw err;

        let $ = cheerio.load(body),
        list = $('#tie-block_2598').find('.posts-items>li'),
        prev = $('#tie-block_2598').find('li.current').prev(),
        next = $('#tie-block_2598').find('li.current').next();

        list.each((i, el) => {
            arrQuest.push({
                name: $(el).find('.post-title').text().trim(),
                value: $(el).find('.post-title>a').attr('href')
            },
            new inquirer.Separator(chalk.gray(`└> ${$(el).find('.date.meta-item').text().trim()}`)));
            if((list.length - 1) === i && next.length) arrQuest.push({
                name: `Next Page > ${next.find('a').text()}`,
                value: {
                    page: true,
                    url: next.find('a').attr('href')
                }
            });
            if((list.length - 1) === i && prev.length) arrQuest.push({
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
            if(a.result.page === true){
                getList(a.result.url, save)
            } else {
                getLinks(a.result, save)
            }
        })
    })
}

export const getLinks = (url, save = false) => {
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
                        Pancal(link, save, {reso, server, name: path.basename(url, '.html'), type: a.format.type})
                    })
                })
            } else {
                arrQuest = [];
                $('li').each((i, el) => {
                    let reso = $(el).find('strong').text().trim();
                    arrQuest.push(new inquirer.Separator(chalk.green(`████ ${reso} ████`)));
                    $(el).find('a').each((i, el) => {
                        arrQuest.push({
                            name: $(el).text() + ' ['+reso+']',
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

export const Pancal = (url, save = false, config = {}) => {
    let next = !1,
    urlnya;

    request(url, (err, res, body) => {
        if (err && res.statusCode !== 200) throw err;

        let $ = cheerio.load(body);
        urlnya = $('#splash').find('a[href*="?r=a"]').attr('href');
        urlnya = Buffer.from(querySearch('r', urlnya), 'base64').toString('ascii');
        next = shorturl.indexOf(urlz.parse(urlnya).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1 ? urlnya : false;

    }).then(() => {
        if (next) {
            Pancal(next, save, config)
        } else {
            if (save) {
                collect[config.reso][config.server] = urlnya;
                fs.writeFileSync('./['+config.type+']'+config.name+'.txt',JSON.stringify(collect, null, 4));
            } else {
                console.log(`URL : ${chalk.blue(urlnya)}`);
                clipboard.writeSync(urlnya); 
                console.log(chalk.green('URL Has Copy On Your Clipboard'))
            }
        }
    })
}