const mysql = require("./mysql");

mysql.query("CREATE DATABASE IF NOT EXISTS dbtify");

mysql.query("Set SQL_SAFE_UPDATES = 0;");

mysql.query("use dbtify ");
const listeners = `
    CREATE TABLE IF NOT EXISTS dbtify.listeners (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE,
    UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE);
  `;

mysql.query(listeners);

const artists = `
    CREATE TABLE IF NOT EXISTS dbtify.artists (
    id INT NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(255) NULL,
    lastname VARCHAR(255) NULL,
    PRIMARY KEY (id));
  `;

mysql.query(artists);

const albums = `
    CREATE TABLE IF NOT EXISTS dbtify.albums (
    id INT NOT NULL AUTO_INCREMENT,
    genre VARCHAR(255) NULL,
    title VARCHAR(255) NULL,
    PRIMARY KEY (id));
  `;

mysql.query(albums);

const songs = `
    CREATE TABLE IF NOT EXISTS dbtify.songs (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NULL,
    PRIMARY KEY (id));
  `;
mysql.query(songs);

const listenerAlbums = `CREATE TABLE IF NOT EXISTS dbtify.listenerAlbums (
  id INT NOT NULL AUTO_INCREMENT,
  albumId INT NULL,
  listenerId INT NULL,
  PRIMARY KEY (id),
  INDEX albumId_idx (albumId ASC) VISIBLE,
  INDEX listenerId_idx (listenerId ASC) VISIBLE,
  CONSTRAINT fk_listeneralbums_albumId
    FOREIGN KEY (albumId)
    REFERENCES dbtify.albums (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  CONSTRAINT fk_listeneralbums_listenerId
    FOREIGN KEY (listenerId)
    REFERENCES dbtify.listeners (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);
    `;

mysql.query(listenerAlbums);

const listenerSongs = `CREATE TABLE IF NOT EXISTS dbtify.listenerSongs (
  id INT NOT NULL AUTO_INCREMENT,
  songId INT NULL,
  listenerId INT NULL,
  artistId INT NULL,
  PRIMARY KEY (id),
  INDEX songId_idx (songId ASC) VISIBLE,
  INDEX listenerId_idx (listenerId ASC) VISIBLE,
  INDEX artistId_idx (artistId ASC) VISIBLE,
  CONSTRAINT fk_listenerSongs_songId
    FOREIGN KEY (songId)
    REFERENCES dbtify.songs (id)
      ON DELETE NO ACTION
      ON UPDATE CASCADE,
  CONSTRAINT fk_listenerSongs_listenerId
    FOREIGN KEY (listenerId)
    REFERENCES dbtify.listeners (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  CONSTRAINT fk_listenerSongs_artistId
    FOREIGN KEY (artistId)
    REFERENCES dbtify.artists (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);`;

mysql.query(listenerSongs);

const artistAlbums = `CREATE TABLE IF NOT EXISTS dbtify.artistAlbums (
  id INT NOT NULL AUTO_INCREMENT,
  artistId INT NULL,
  albumId INT NULL,
  PRIMARY KEY (id),
  INDEX artistId_idx (artistId ASC) VISIBLE,
  INDEX albumId_idx (albumId ASC) VISIBLE,
  CONSTRAINT fk_artistAlbums_artistId
    FOREIGN KEY (artistId)
    REFERENCES dbtify.artists (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  CONSTRAINT fk_artistAlbums_albumId
    FOREIGN KEY (albumId)
    REFERENCES dbtify.albums (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE);
;`;

mysql.query(artistAlbums);

const artistSongs = `CREATE TABLE IF NOT EXISTS dbtify.artistSongs (
  id INT NOT NULL AUTO_INCREMENT,
  artistId INT NULL,
  songId INT NULL,
  PRIMARY KEY (id),
  INDEX artistId_idx (artistId ASC) VISIBLE,
  INDEX songId_idx (songId ASC) VISIBLE,
  CONSTRAINT fk_artistSongs_artistId
    FOREIGN KEY (artistId)
    REFERENCES dbtify.artists (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_artistSongs_songId
    FOREIGN KEY (songId)
    REFERENCES dbtify.songs (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE);`;

mysql.query(artistSongs);

const albumSongs = `CREATE TABLE IF NOT EXISTS  dbtify.albumSongs (
  id INT NOT NULL AUTO_INCREMENT,
  albumId INT NULL,
  songId INT NULL,
  PRIMARY KEY (id),
  INDEX albumId_idx (albumId ASC) VISIBLE,
  INDEX songId_idx (songId ASC) VISIBLE,
  CONSTRAINT fk_albumSongs_albumId
    FOREIGN KEY (albumId)
    REFERENCES dbtify.albums (id)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT fk_albumSongs_songId
    FOREIGN KEY (songId)
    REFERENCES dbtify.songs (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE);`;

mysql.query(albumSongs);

const artistContributers = `CREATE TABLE IF NOT EXISTS dbtify.artistContributers (
  id INT NOT NULL AUTO_INCREMENT,
  artistId INT NULL,
  contributerId INT NULL,
  PRIMARY KEY (id),
  INDEX artistId_idx (artistId ASC) VISIBLE,
  INDEX contributerId_idx (contributerId ASC) VISIBLE,
  CONSTRAINT fk_artistContributers_artistId
    FOREIGN KEY (artistId)
    REFERENCES dbtify.artists (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_artistContributers_contributerId
    FOREIGN KEY (contributerId)
    REFERENCES dbtify.artists (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE);`;

mysql.query(artistContributers);

const albumTrigger = `CREATE TRIGGER albums_BEFORE_DELETE
  BEFORE DELETE ON dbtify.albums FOR EACH ROW
  BEGIN
  DELETE FROM dbtify.songs where id in (SELECT songId from dbtify.albumSongs where albumId=OLD.id);
  END;`;

mysql.query(albumTrigger);

const songTrigger = `CREATE TRIGGER songs_BEFORE_DELETE
  BEFORE DELETE ON dbtify.songs FOR EACH ROW
  BEGIN
       DELETE FROM dbtify.listenerSongs where songId=OLD.id;
       DELETE FROM dbtify.artistSongs where songId=OLD.id;

  END;`;

mysql.query(songTrigger);

const likedTrigger = `CREATE TRIGGER listeneralbums_AFTER_INSERT
  AFTER INSERT ON dbtify.listenerAlbums FOR EACH ROW
  BEGIN
  INSERT INTO dbtify.listenerSongs (songId, listenerId, artistId) (SELECT album.songId, NEW.listenerId, artist.artistId FROM dbtify.albumSongs as album INNER JOIN dbtify.artistSongs as artist ON album.songId = artist.songId where album.albumId=NEW.albumId);
  END;`;

mysql.query(likedTrigger);

const storedProcedure = `CREATE PROCEDURE GetAllContributers(IN artistName VARCHAR(255), IN artistSurname VARCHAR(255))
  BEGIN
    IF artistSurname IS not NULL THEN
    SELECT * FROM dbtify.artists where id in (SELECT ac.contributerId FROM dbtify.artistContributers as ac JOIN dbtify.artists as a ON a.id=ac.artistId where a.firstname = artistName AND a.lastname=artistSurname);
    ELSE
    SELECT * FROM dbtify.artists where id in (SELECT ac.contributerId FROM dbtify.artistContributers as ac JOIN dbtify.artists as a ON a.id=ac.artistId where a.firstname = artistName);
    END IF;
  END `;

mysql.query(storedProcedure);
