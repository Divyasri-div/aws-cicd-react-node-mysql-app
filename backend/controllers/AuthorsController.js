const db = require('../configs/db');
const logger = require('../utils/logger');

function AuthorsController() { }

const getQuery = 'SELECT * FROM author';

AuthorsController.prototype.get = (req, res) => {
   logger.info('AuthorsController [GET]');

   db.query(getQuery, (err, authors) => {
      if (err) {
         logger.error(`Error executing query: ${err.message}`);
         return res.status(500).json({
            message: "Database error while fetching authors"
         });
      }

      logger.info(`Authors count: ${authors.length}`);

      return res.status(200).json({
         authors: authors,
      });
   });
};

AuthorsController.prototype.create = (req, res) => {
   const { name, birthday, bio } = req.body;

   logger.info(`AuthorsController [CREATE] - name: ${name}`);

   db.query(
      'INSERT INTO author (name, birthday, bio, createdAt, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      [name, new Date(birthday), bio],
      (err) => {
         if (err) {
            logger.error(`Error executing query: ${err.message}`);
            return res.status(500).json({
               message: "Database error while creating author"
            });
         }

         db.query(getQuery, (err, authors) => {
            if (err) {
               logger.error(`Error executing query: ${err.message}`);
               return res.status(500).json({
                  message: "Database error after insert"
               });
            }

            logger.info(`Author created successfully. authors count: ${authors.length}`);

            return res.status(201).json({
               message: "Author created successfully!",
               authors: authors,
            });
         });
      }
   );
};

AuthorsController.prototype.update = (req, res) => {
   const authorId = req.params.id;
   const { name, birthday, bio } = req.body;

   logger.info(`AuthorsController [UPDATE] - authorId: ${authorId}`);

   db.query(
      'UPDATE author SET name = ?, birthday = ?, bio = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [name, new Date(birthday), bio, authorId],
      (err) => {
         if (err) {
            logger.error(`Error executing query: ${err.message}`);
            return res.status(500).json({
               message: "Database error while updating author"
            });
         }

         db.query(getQuery, (err, authors) => {
            if (err) {
               logger.error(`Error executing query: ${err.message}`);
               return res.status(500).json({
                  message: "Database error after update"
               });
            }

            logger.info(`Author updated successfully. authors count: ${authors.length}`);

            return res.status(200).json({
               message: "Author updated successfully!",
               authors: authors,
            });
         });
      }
   );
};

AuthorsController.prototype.delete = (req, res) => {
   const authorId = req.params.id;

   logger.info(`AuthorsController [DELETE] - authorId: ${authorId}`);

   db.query('DELETE FROM author WHERE id = ?', [authorId], (err) => {
      if (err) {
         logger.error(`Error executing query: ${err.message}`);
         return res.status(500).json({
            message: "Database error while deleting author"
         });
      }

      db.query(getQuery, (err, authors) => {
         if (err) {
            logger.error(`Error executing query: ${err.message}`);
            return res.status(500).json({
               message: "Database error after delete"
            });
         }

         logger.info(`Author deleted successfully. authors count: ${authors.length}`);

         return res.status(200).json({
            message: "Author deleted successfully!",
            authors: authors,
         });
      });
   });
};

module.exports = new AuthorsController();
