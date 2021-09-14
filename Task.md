# Social network

## Pasiruosimas

Sukurti duombaze pavadinimu "social".

Importuoti duotas lenteles, tokiu eiliskumu:

- users
- like_options
- friends
- posts
- comments
- posts_likes

## Uzduotys

**1** _Registruotu vartotoju sarasas, isrikiuotas nuo naujausio link seniausio. Reikia nurodyti varda, post'u kieki, komentaru kieki ir like'u kieki_

pvz.:

```
Users:
1. Vardenis: posts (3), comments (2), likes (0);
2. Vardenis: posts (3), comments (2), likes (0);
3. Vardenis: posts (3), comments (2), likes (0);
```

**2** _Isspausdinti, koki turini turetu matyti Ona (antrasis vartotojas). Irasus pateikti nuo naujausio_

pvz.:

```
Ona's feed:
Vardenis wrote a post "Post text" (2021-09-09 20:18:45)
Vardenis wrote a post "Post text" (2021-09-09 20:18:45)
Vardenis wrote a post "Post text" (2021-09-09 20:18:45)
```

**3** _Visu irasu (posts) sarasas su komentarais ir like'ais_

pvz.:

```
Posts:
1. "Post text" (2021-09-09 20:18:45) has 2 reactions: 1 like, 1 angry and 2 comments:
1-1. "Comment text" from Vardenis (2021-09-09 20:18:45);
1-2. "Comment text" from Vardenis (2021-09-09 20:18:45);
2. "Post text" (2021-09-09 20:18:45) has 5 reactions: 3 like, 2 angry and 3 comments:
1-1. "Comment text" from Vardenis (2021-09-09 20:18:45);
1-2. "Comment text" from Vardenis (2021-09-09 20:18:45);
1-3. "Comment text" from Vardenis (2021-09-09 20:18:45);
```

**4** _Isspausdinti, kas kokius draugus stebi (visi vartotojai)_

pvz.:

```
User's relationships:
1. Vardenis is following Vardenis (since 2021-09-09 20:18:45);
2. Vardenis is following Vardenis (since 2021-09-09 20:18:45);
3. Vardenis is following Vardenis (since 2021-09-09 20:18:45);
```

**5** _Koks yra like'u naudojamumas. Isrikiuoti nuo labiausiai naudojamo_

pvz.:

```
Like options statistics:
1. Like - 5 time;
2. Wow - 3 time;
3. Angry - 2 time;
4. Yay - 0 time;
```

**6** _Isspausdinti visus komentarus, kuriuose yra nurodytas paieskos tekstas. Jei nieko nerasta, tai parodyti atitinkama pranesima. Visa tai turi buti funkcijos pavydale, kuri gauna vieninteli parametra - paieskos fraze_

pvz.:

```
Comments with search term "nice":
1. "This is nice!" (2021-09-09 20:18:45);
2. "Nice one!" (2021-09-09 20:18:45);
```

**7** _Isspausdinti naujausia vartotojo post'a. Visa tai turi buti funkcijos pavidale, kuri gauna vieninteli parametra - vartotojo id. Jei vartotojas neturi parases nei vieno post'o, grazinti atitinkama pranesima_

pvz.:

```
Latest post from Vardenis:
"Post text" (2021-09-09 20:18:45).
```

```
Seems like Vardenis hasn't posted yet.
```
