const mysql = require('mysql2/promise');

const app = {}

app.init = async () => {
    // prisijungti prie duomenu bazes
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'social',
    });

    let sql = '';
    let rows = [];
    //console.log('social starts');  // testuoju, ar spausdina

    // LOGIC BELOW
    function firstCapital(str) {
        return str[0].toUpperCase() + str.slice(1);
    }

    function formatDate(date) {
        const dateF = new Date(date);
        return dateF.toLocaleString();
    }
    /*
         // kitas datos formatas 
        function formatDate(date) {
            const d = new Date(date);
            const dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + ' ' +
                [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
            return dformat;
        }
    */
    //**1** _Registruotu vartotoju sarasas, isrikiuotas nuo naujausio link 
    //seniausio. Reikia nurodyti varda, post'u kieki, komentaru kieki ir like'u kieki
    sql = 'SELECT `users`.`id`, `firstname`, \
    COUNT(DISTINCT `posts`.`id`) as posts,\
    COUNT(DISTINCT `comments`.`id`) as comments,\
    COUNT(DISTINCT `posts_likes`.`id`) as likes\
    FROM `users`\
    LEFT JOIN `posts`\
        ON `posts`.`user_id` = `users`.`id`\
    LEFT JOIN `comments`\
        ON `comments`.`user_id` = `users`.`id`\
    LEFT JOIN `posts_likes`\
        ON `posts_likes`.`user_id` = `users`.`id`\
    GROUP BY `users`.`id`\
    ORDER BY `register_date` DESC';
    [rows] = await connection.execute(sql);

    console.log(`Users: `);
    i = 0;
    for (let item of rows) {
        console.log(`${++i}. ${firstCapital(item.firstname)}: posts (${item.posts}), comments (${item.comments}), likes (${item.likes});`);
    }

    console.log('------------------------');

    //**2** _Isspausdinti, koki turini turetu matyti Ona (antrasis vartotojas). 
    // Irasus pateikti nuo naujausio
    sql = 'SELECT `users`.`id`,`friends`.`friend_id`,\
     (SELECT `users`.`firstname`\
     FROM `users`\
     WHERE `users`.`id` = `friends`.`friend_id`) as friendname,\
      `posts`.`text`, `posts`.`date` \
     FROM `users`, `friends`, `posts`\
     WHERE `users`.`id` = `friends`.`user_id`\
     AND `users`.`id` = 2\
     AND `friends`.`friend_id` = `posts`.`user_id`\
     ORDER BY `date` DESC';
    /*
        sql = 'SELECT `users`.`firstname`, `posts`.`text` \
            FROM `posts` \
            LEFT JOIN `users` \
                ON `users`.`id` = `posts`.`user_id` \
            LEFT JOIN `friends` \
                ON `friends`.`friend_id` = `posts`.`user_id` \
            WHERE `friends`.`user_id` = 2';
    */
    [rows] = await connection.execute(sql);
    //console.log(rows);
    console.log(`Ona's feed: `);
    i = 0;
    for (const { friendname, text, date } of rows) {
        console.log(`${firstCapital(friendname)} wrote a post "${text}" (${formatDate(date)});`);
    }
    console.log('------------------------');

    //** 3 ** _Visu irasu(posts) sarasas su komentarais ir like'ais
    sql = 'SELECT `posts`.`id`, `posts`.`text`, `posts`.`date` as postDate,\
    `comments`.`text` as comment,\
    `comments`.`date` as commentDate,\
    `like_options`.`text` as liketext\
      FROM `posts`\
      LEFT JOIN `posts_likes`\
      ON `posts_likes`.`post_id` = `posts`.`id`\
      LEFT JOIN `comments`\
      ON `comments`.`post_id` = `posts`.`id`\
      LEFT JOIN `like_options`\
      ON `like_options`.`id` = `posts`.`id`';
    [rows] = await connection.execute(sql);
    //console.log(rows);

    console.log('------------------------');

    //**4** _Isspausdinti, kas kokius draugus stebi (visi vartotojai)
    sql = 'SELECT `follow_date`,\
    (SELECT `users`.`firstname` \
        FROM `users` \
        WHERE `users`.`id` = `friends`.`friend_id`) as friend, \
    (SELECT `users`.`firstname` \
        FROM `users` \
        WHERE `users`.`id` = `friends`.`user_id`) as me \
     FROM `friends`';
    [rows] = await connection.execute(sql);
    //console.log(rows);

    console.log(`User's relationships: `);
    i = 0;
    for (const item of rows) {
        /* const d = new Date(item.follow_date);
         const dFormat = [d.getMonth() + 1,
         d.getDate(),
         d.getFullYear()].join('/') + ' ' +
             [d.getHours(),
             d.getMinutes(),
             d.getSeconds()].join(':');*/
        //console.log(`${++i}. ${firstCapital(item.me)} is following ${firstCapital(item.friend)} (since ${dFormat});`);
        console.log(`${++i}. ${firstCapital(item.me)} is following ${firstCapital(item.friend)} (since ${formatDate(item.follow_date)});`);
    }
    console.log('------------------------');

    // **5** _Koks yra like'u naudojamumas. Isrikiuoti nuo labiausiai naudojamo
    sql = 'SELECT `like_options`.`text`, COUNT(`posts_likes`.`like_option_id`) as times\
    FROM `posts_likes`\
    LEFT JOIN `like_options`\
    ON `like_options`.`id`= `posts_likes`.`like_option_id`\
    GROUP BY `posts_likes`.`like_option_id`\
    ORDER BY times DESC';
    [rows] = await connection.execute(sql);
    //console.log(rows);
    console.log(`Like options statistics: `);
    i = 0;
    for (let item of rows) {
        console.log(`${++i}. ${firstCapital(item.text)} - ${item.times} time;`);
    }

    console.log('------------------------');

    //**6** _Isspausdinti visus komentarus, kuriuose yra nurodytas paieskos 
    //tekstas. Jei nieko nerasta, tai parodyti atitinkama pranesima. Visa 
    //tai turi buti funkcijos pavydale, kuri gauna vieninteli parametra - 
    //paieskos fraze

    async function specword(word) {
        sql = 'SELECT `comments`.`text`, `comments`.`date`\
    FROM `comments`\
    WHERE `text` LIKE "%'+ word + '%"';
        [rows] = await connection.execute(sql);
        if (rows.length === 0) {   // tikrinam, ar array tuscias
            console.error('ERROR: Needed word is not mentioned here!');
        } else {
            console.log(`Comments with search term "${word}": `);
            i = 0;
            for (let { text, date } of rows) {
                console.log(`${++i}."${text}" (${formatDate(date)});`);
            }
        }
    }
    await specword('nice');
    await specword('lol');  //meta error, nes nera ieskomo zodzio
    console.log('------------------------');

    //**7** _Isspausdinti naujausia vartotojo post'a. Visa tai turi buti funkcijos 
    //pavidale, kuri gauna vieninteli parametra - vartotojo id. Jei vartotojas 
    //neturi parases nei vieno post'o, grazinti atitinkama pranesima

    // teisingas variantas - pagal vartotoju sarasa
    async function newestpost() {
        sql = 'SELECT `users`.`id` as user,\
            `users`.`firstname`,\
            `posts`.`user_id` as poster,\
            `posts`.`date`, `posts`.`text`\
        FROM `users`\
        LEFT JOIN `posts`\
            ON `posts`.`user_id` = `users`.`id`\
        ORDER BY `posts`.`date` DESC';
        [rows] = await connection.execute(sql);
        //const uniqueUser = rows.map(obj => obj.user);
        console.log(rows);
        let uniquePosters = [];
        for (const item of rows) {
            if (!uniquePosters.includes(item.user)) {
                uniquePosters.push(item.user);

                if (item.text === null || item.text === '') {
                    console.error(`ERROR: Seems like ${firstCapital(item.firstname)} hasn't posted yet.`)
                }
                else if (uniquePosters) {
                    console.log(`Latest post from ${firstCapital(item.firstname)}: "${item.text}" (${formatDate(item.date)}).`);
                }
            }
        }
        //console.log(uniquePosters.length)
        //console.log(uniquePosters);
    }
    await newestpost();
    console.log('------------------------');

    // pagal zinuciu sarasa, bet nematomi vartotojai, kurie nieko neparase, nebent zinute tuscias tekstas
    /*   async function newestpost() {
           sql = 'SELECT `posts`.`user_id` as user,\
           `users`.`firstname`, `posts`.`date`, `posts`.`text`\
               FROM `posts`\
           LEFT JOIN `users`\
               ON `posts`.`user_id` = `users`.`id`\
           GROUP BY `posts`.`date`\
           ORDER BY `posts`.`date` DESC';
           [rows] = await connection.execute(sql);
           //const uniqueUser = rows.map(obj => obj.user);
           //console.log(rows);
           let uniquePosters = [];
           for (const item of rows) {
               if (!uniquePosters.includes(item.user)) {
                   uniquePosters.push(item.user);
   
                   if (item.text === '') {
                       console.error(`ERROR: Seems like ${firstCapital(item.firstname)} hasn't posted yet.`)
                   }
                   else if (uniquePosters) {
                       console.log(`Latest post from ${firstCapital(item.firstname)}: "${item.text}" (${formatDate(item.date)}).`);
                   }
               }
               //console.log(uniquePosters.length)
               //console.log(uniquePosters);
           }
       }
       await newestpost();
       console.log('------------------------');*/
}
app.init();

module.exports = app;