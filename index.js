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
    console.log(rows);

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


}
app.init();

module.exports = app;