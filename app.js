const program =  require("commander");
const inquirer = require("inquirer");
const figlet =  require("figlet");
const chalk = require("chalk");
const request = require("request-promise");
const cheerio = require("cheerio");
const extractDomain = require('extract-domain');
const clipboard = require('clipboardy');

let url = "https://www.samehadaku.tv/";
let shorturl = ['coeg.in', 'tetew.info', 'greget.space', 'siherp.com'];

const querySearch = (q, u) => {
    if (!u) u = url;
	q = q.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+q+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( u );
	return results == null ? null : results[1];
}

const myfunc = {
    init: () => {
        console.log(chalk.yellow(figlet.textSync('SamehadakuLewatin')));        
        console.log('===============================================================');
        console.log('🔨  Version    : 1.2.9');
        console.log('📚  Repository : https://github.com/anasrar/Samehadaku-Lewatin');
        console.log('===============================================================');
    },
    hasil: (url) => {
        console.log('🌐  URL : '+chalk.blue(url));
        clipboard.writeSync(url); 
        console.log(chalk.green('✅  URL Has Copy On Your Clipboard'))
    },
    getFromList: (url) => {

        let arrData = [];

        request(url, (err, res, body) => {
            if (err && res.statusCode !== 200) throw err;

            let $ = cheerio.load(body);

            $('#tie-block_2598').find('.posts-items>li').each((i, el) => {
                new inquirer.Separator(chalk.red('============== '+(i+1)+' ==============')),
                arrData.push({
                    name: $(el).find('.post-title').text(),
                    value: $(el).find('.post-title>a').attr('href')
                },
                new inquirer.Separator('⏲  '+chalk.gray($(el).find('.date.meta-item').text())),
                new inquirer.Separator('👉  '+chalk.green($(el).find('.post-title>a').attr('href'))),
                new inquirer.Separator(chalk.red('============== = =============='))
                );
                // console.log(chalk.green($(el).find('.post-title').text()));
                // console.log(chalk.gray($(el).find('.date.meta-item').text()));
                // console.log(chalk.blue($(el).find('.post-title>a').attr('href')))
            });
        }).then(() => {
            inquirer.prompt([{
                type: "list",
                name: "url",
                message: "Select The Anime",
                choices: arrData
            }]).then((answer) => {

                arrData = [];

                request(answer.url, (err, res, body) => {
                    if (err && res.statusCode !== 200) throw err;

                    let $ = cheerio.load(body);

                    $('#the-post').find('.download-eps').each((i, el) => {

                        arrData.push(
                        {
                            name: $(el).prev().text(),
                            value: $(el).html()
                        });

                        // console.log($(el).prev().text());
                        // console.log($(el).html());
                        // console.log(arrData);
                    });

                }).then(() => {
                    inquirer.prompt([{
                        type: "list",
                        name: "format",
                        message: "Select The Format",
                        choices: arrData
                    }]).then((answer) => {

                        arrData = [];

                        let $ = cheerio.load(answer.format);

                        $('li').each((i, el) => {

                            let reso = $(el).find('strong').text();
                            arrData.push(new inquirer.Separator(chalk.green(`== ${reso} ==`)));
                            $(el).find('a').each((i, el) => {
                                arrData.push({
                                    name: $(el).text() + ' ['+reso+']',
                                    value: $(el).attr('href')
                                });
                                // console.log($(el).attr('href'));
                            });
                        });

                        inquirer.prompt([{
                            type: "list",
                            name: "url",
                            message: "Select The Resolution and Server ",
                            choices: arrData
                        }]).then((answer) => {
                            let next = !1;
                            request(answer.url, (err, res, body) => {
                                if (err && res.statusCode !== 200) throw err;
                                let $ = cheerio.load(body);
                                let url = $('#splash').find('a[href*="?r=a"]').attr('href');
                                url = Buffer.from(querySearch('r', url), 'base64').toString('ascii');
                                next = shorturl.indexOf(extractDomain(url)) !== -1 ? url : false;
                            }).then((a) => {
                                if (next) {
                                    request(next, (err, res, body) => {
                                        if (err && res.statusCode !== 200) throw err;
                                        let $ = cheerio.load(body);
                                        let url = $('#splash').find('a[href*="?r=a"]').attr('href');
                                        url = Buffer.from(querySearch('r', url), 'base64').toString('ascii');
                                        myfunc.hasil(url)
                                        // next = shorturl.indexOf(extractDomain(url)) !== -1 ? url : false;
                                    })
                                } else {
                                    let $ = cheerio.load(a);
                                    let url = $('#splash').find('a[href*="?r=a"]').attr('href');
                                    url = Buffer.from(querySearch('r', url), 'base64').toString('ascii');
                                    myfunc.hasil(url);
                                }
                            });
                        });
                    });
                });
            });
        });

    }
}

program.version('🔨  Version    : 1.2.9', '-v, --version');

program.command("list").description("Get List Update Anime { Name, Link, and Date }").action(() => {

    myfunc.init();
    console.log(chalk.yellow('⏳  Getting List Anime...'));
    myfunc.getFromList(url);

});

program.command("page <int>").description("Get List Anime From Page { Name, Link, and Date }").action((int) => {

    myfunc.init();
    console.log(chalk.yellow('⏳  Getting List Anime From Page '+int+'...'));
    myfunc.getFromList(url+'page/'+int);

});

program.parse(process.argv);