const router = require("express").Router();
const mysql = require("../mysql");

router.get("/", async (req, res) => {
  try {
    const artist = await mysql.query(`SELECT *  FROM dbtify.artists`);
    console.log("KML: artist", artist);
    res.send(artist);
  } catch (error) {
    console.log("KML: error", error);
  }
});

router.get("/:artistid", async (req, res) => {
  try {
    const { artistid } = req.params;
    const artist = await mysql.query(
      `SELECT *  FROM dbtify.artists where id=${artistid}`
    );
    console.log("KML: artist", artist);
    res.send(artist);
  } catch (error) {
    console.log("KML: error", error);
  }
});

//delete a song
router.get("/:artistid/songs/:id/delete", async (req, res) => {
  const { id } = req.params;
  const songs = await mysql.query(
    `delete from dbtify.songs where id = (${id})`
  );
  res.send(songs);
});

//update a song
router.post("/:artistid/songs/:id/update", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const songs = await mysql.query(
    `update dbtify.songs set title = ('${title}') where id = (${id})`
  );
  res.send(songs);
});

//returns songs of the artist
router.get("/:artistid/songs", async (req, res) => {
  try {
    const { artistid } = req.params;
    const songs = await mysql.query(
      `SELECT songs.title FROM dbtify.songs  JOIN dbtify.artistSongs ON dbtify.artistSongs.songId = dbtify.songs.id where artistId=${artistid}`
    );
    res.send(songs);
  } catch (error) {
    console.log("KML: error", error);
  }
});

//returns albums of the artist
router.get("/:artistid/albums", async (req, res) => {
  try {
    const { artistid } = req.params;
    const albums = await mysql.query(
      `SELECT albums.* FROM dbtify.albums  JOIN dbtify.artistAlbums ON dbtify.artistAlbums.albumId = dbtify.albums.id where artistId=${artistid}`
    );
    res.send(albums);
  } catch (error) {
    console.log("KML: error", error);
  }
});

const addContributers = async function (artistid, contributers) {
  for (let index = 0; index < contributers.length; index++) {
    const element = contributers[index];
    const instance = await mysql.query(
      `select * from dbtify.artists where firstname='${element.firstname}' and lastname= '${element.lastname}'`
    );

    if (!Array.isArray(instance) || !instance.length) {
      const newartist = await mysql.query(
        `insert into dbtify.artists (firstname, lastname) values ('${element.firstname}', '${element.lastname}')`
      );
      await mysql.query(
        `insert into dbtify.artistContributers (artistId, contributerId) values (${artistid}, ${newartist.insertId})`
      );
    } else {
      await mysql.query(
        `insert into dbtify.artistContributers (artistId, contributerId) values (${artistid}, ${instance[0].id})`
      );
    }
  }
};

//add an album of the artist
router.post("/:artistid/albums/add", async (req, res) => {
  const { artistid } = req.params;

  const { genre, title, songs, contributers = [] } = req.body;
  const album = await mysql.query(
    `insert into dbtify.albums (genre, title) values ('${genre}','${title}')`
  );

  await mysql.query(
    `insert into dbtify.artistAlbums (artistId, albumId) values ('${artistid}', '${album.insertId}')`
  );

  await addContributers(artistid, contributers);

  for (x of songs) {
    const addedSong = await mysql.query(
      `insert into dbtify.songs (title) values ('${x}')`
    );
    await mysql.query(
      `insert into dbtify.artistSongs (artistId, songId) values ('${artistid}', '${addedSong.insertId}')`
    );
    await mysql.query(
      `insert into dbtify.albumSongs (albumId, songId) values ('${album.insertId}', '${addedSong.insertId}')`
    );
  }
  res.send();
});

//returns songs in the album
router.get("/:artistid/albums/:albumid", async (req, res) => {
  try {
    const { artistid, albumid } = req.params;
    const songs = await mysql.query(
      `SELECT songs.* FROM dbtify.songs JOIN dbtify.albumSongs ON dbtify.albumSongs.songId = dbtify.songs.id where albumId=${albumid}`
    );
    const album = await mysql.query(
      `SELECT * FROM dbtify.albums where id=${albumid}`
    );
    const info = { album, songs };
    res.send(info);
  } catch (error) {
    console.log("KML: error", error);
  }
});

//add a song into an album
router.post("/:artistid/albums/:id/add", async (req, res) => {
  const { id, artistid } = req.params;
  const { title, contributers = [] } = req.body;
  const song = await mysql.query(
    `insert into dbtify.songs (title) values ('${title}')`
  );

  await addContributers(artistid, contributers);

  if (song) {
    await mysql.query(
      `insert into dbtify.albumSongs (albumId, songId) values ('${id}', '${song.insertId}')`
    );
    await mysql.query(
      `insert into dbtify.artistSongs (artistId, songId) values ('${artistid}', '${song.insertId}')`
    );
  }

  res.send();
});

//delete an album
router.get("/:artistid/albums/:id/delete", async (req, res) => {
  const { id } = req.params;
  const albums = await mysql.query(
    `delete from dbtify.albums where id = (${id})`
  );
  res.send(albums);
});

//update an album
router.post("/:artistid/albums/:id/update", async (req, res) => {
  const { id } = req.params;
  const { title, genre } = req.body;
  const albums = await mysql.query(
    `update dbtify.albums set title = '${title}', genre = '${genre}' where id = (${id})`
  );
  res.send(albums);
});

module.exports = router;
