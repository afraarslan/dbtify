const router = require("express").Router();
const mysql = require("../mysql");

router.get("/", async (req, res) => {
  try {
    const listener = await mysql.query(`SELECT *  FROM dbtify.listeners`);
    res.send(listener);
  } catch (error) {
    console.log("KML: error", error);
  }
});

//list all and filter  genres
router.get("/genres", async (req, res) => {
  const { q } = req.query;
  if (q) {
    const songs = await mysql.query(
      `select s.* from dbtify.albums as alb  inner join dbtify.albumSongs as als on alb.id = als.albumId inner join dbtify.songs as s on s.id=als.songId where genre = '${q}'`
    );
    if (Array.isArray(songs)) {
      res.json({ songs, q });
    } else {
      res.json({ q, songs: [] });
    }
  } else {
    const genres = await mysql.query(
      "select distinct genre from dbtify.albums"
    );
    if (Array.isArray(genres)) {
      res.json(genres.map((e) => e.genre));
    } else {
      res.json([]);
    }
  }
});

//list all songs
router.get("/:listenerid/songs", async (req, res) => {
  const songs = await mysql.query("select * from dbtify.songs");
  res.json(songs);
});

router.get("/:listenerid/songs/search", async (req, res) => {
  const { q } = req.query;
  const albums = await mysql.query(
    `select *  from dbtify.songs where title like '%${q}%'`
  );
  res.send(albums);
});

//list all songs of the artist
router.get("/:listenerid/artists/:artistid/songs", async (req, res) => {
  const { listenerid, artistid } = req.params;
  const songs = await mysql.query(
    `SELECT * FROM dbtify.songs JOIN dbtify.artistSongs ON dbtify.songs.id = dbtify.artistSongs.songId where artistId=${artistid}`
  );
  res.send(songs);
});

//list all albums
router.get("/:listenerid/albums", async (req, res) => {
  const albums = await mysql.query("select * from dbtify.albums");
  res.send(albums);
});

//list all songs in the album
router.get("/:listenerid/albums/:albumid", async (req, res) => {
  const { listenerid, albumid } = req.params;
  const albumDetail = await mysql.query(
    `SELECT * FROM dbtify.albums where id=${albumid}`
  );
  if (albumDetail) {
    return res.send(albumDetail[0]);
  } else res.send();
});

//list all songs in the album
router.get("/:listenerid/albums/:albumid/songs", async (req, res) => {
  const { listenerid, albumid } = req.params;
  const songs = await mysql.query(
    `SELECT * FROM dbtify.songs JOIN dbtify.albumSongs ON dbtify.albumSongs.songId = dbtify.songs.id where albumId=${albumid}`
  );
  res.send(songs);
});

//list all albums of the artist
router.get("/:listenerid/artists/:artistid/albums", async (req, res) => {
  const { listenerid, artistid } = req.params;
  const albums = await mysql.query(
    `SELECT * FROM dbtify.albums JOIN dbtify.artistAlbums ON dbtify.artistAlbums.albumId = dbtify.albums.id where artistId=${artistid}`
  );
  res.send(albums);
});

//list all artists
router.get("/:listenerid/artists", async (req, res) => {
  const artists = await mysql.query("select * from dbtify.artists");
  res.send(artists);
});

router.get("/:listenerid/songs/:songid", async (req, res) => {
  const song = await mysql.query(
    `select * from dbtify.songs where dbtify.songs.id =${req.params.songid}`
  );
  res.send(song);
});

//list all liked songs of the listener
router.get("/:listenerid/liked-songs", async (req, res) => {
  const { listenerid } = req.params;
  const songs = await mysql.query(
    `select * from dbtify.listenerSongs where listenerId = '${listenerid}'`
  );
  if (songs && songs.length) {
    res.json(songs.map((e) => e.songId));
  } else {
    res.json([]);
  }
});

router.get("/:listenerid/unliked-songs/:songid", async (req, res) => {
  const { listenerid, songid } = req.params;

  const del = await mysql.query(
    `delete from dbtify.listenerSongs where listenerId=${listenerid} and songId=${songid}`
  );

  res.json({});
});

//like a song
router.get("/:listenerid/liked-songs/:songid", async (req, res) => {
  const { listenerid, songid } = req.params;

  const songIntance = await mysql.query(
    `select * from dbtify.artistSongs where songId=${songid}`
  );

  if (songIntance) {
    console.log("KML: songIntance", songIntance[0].artistId);

    const artistid = songIntance[0].artistId;

    const ins = await mysql.query(
      `insert into dbtify.listenerSongs (listenerId, songId, artistId) values ('${listenerid}', '${songid}', '${artistid}') `
    );
    res.json(ins);
  } else {
    res.json({});
  }
});

//list other listeners liked songs
router.get("/:listenerid/others-liked-songs", async (req, res) => {
  const { listenerid } = req.params;
  const liked_songs = await mysql.query(
    `select  l.username, s.title from dbtify.listenerSongs as ls inner join dbtify.listeners as l on l.id = ls.listenerId inner join dbtify.songs as s on s.id=ls.songId`
  );
  res.send(liked_songs);
});

//list all liked album of the listener
router.get("/:listenerid/liked-albums", async (req, res) => {
  const { listenerid } = req.params;
  const albums = await mysql.query(
    `select * from dbtify.listenerAlbums where listenerId = '${listenerid}'`
  );

  if (albums && albums.length) {
    res.json(albums.map((e) => e.albumId));
  } else {
    res.json([]);
  }
});

//like an album
router.get("/:listenerid/liked-albums/:albumid", async (req, res) => {
  const { listenerid, albumid } = req.params;

  const ins = await mysql.query(
    `insert into dbtify.listenerAlbums (listenerId, albumId) values ('${listenerid}', '${albumid}') `
  );
  res.json(ins);
});

//rank artists by their popularity
router.get("/:listenerid/popular-artists", async (req, res) => {
  const albums = await mysql.query(
    `SELECT COUNT(ls.id) as count, a.firstname, a.lastname FROM dbtify.listenerSongs as ls JOIN dbtify.artists as a on a.id = ls.artistId GROUP BY artistId ORDER BY COUNT(ls.id) DESC`
  );
  res.send(albums);
});

//list popular songs of the artist
router.get("/:listenerid/artists/:artistid/popular-songs", async (req, res) => {
  const { listenerid, artistid } = req.params;
  const songs = await mysql.query(
    `SELECT COUNT(ls.id) as count, s.title FROM dbtify.listenerSongs as ls JOIN dbtify.songs as s on s.id = ls.songId where songId in (select songId from dbtify.artistSongs where artistId = '${artistid}') GROUP BY songId ORDER BY COUNT(id) DESC`
  );
  res.send(songs);
});

//get contributers of an artist
router.post("/:listenerid/get-contributers", async (req, res) => {
  const { listenerid } = req.params;
  const { firstname, lastname } = req.body;
  const songs = await mysql.query(
    `call dbtify.GetAllContributers('${firstname}', ${
      lastname ? "'" + lastname + "'" : "null"
    });`
  );
  res.send(songs);
});

module.exports = router;
