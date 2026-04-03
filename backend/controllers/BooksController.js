const db = require('../configs/db');
const logger = require('../utils/logger');

function BooksController() { }

const getQuery = `
SELECT 
   b.id as id,
   b.title as title,
   b.releaseDate as releaseDate,
   b.description as description,
   b.pages as pages,
   b.createdAt as createdAt,
   b.updatedAt as updatedAt,
   a.id as authorId,
   a.name as name,
   a.birthday as birthday,
   a.bio as bio
FROM book b 
INNER JOIN author a ON b.authorId = a.id
`;

BooksController.prototype.get = (req, res) => {
   logger.info('BooksController [GET]');

   db.query(getQuery, (err, books) => {
      if (err) {
         logger.error(`Error executing query: ${err.message}`);
         return res.status(500).json({
            message: "Database error while fetching books"
         });
      }

      logger.info(`Books count: ${books.length}`);

      return res.status(200).json({
         books: books,
      });
   });
};

BooksController.prototype.create = (req, res) => {
   const {
      title,
      description,
      releaseDate,
      pages,
      author: authorId,
   } = req.body;

   logger.info(`BooksController [CREATE] - title: ${title}, authorId: ${authorId}`);

   db.query(
      `INSERT INTO book (title, releaseDate, description, pages, authorId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, new Date(releaseDate), description, pages, authorId, new Date(), new Date()],
      (err) => {
         if (err) {
            logger.error(`Error executing query: ${err.message}`);
            return res.status(500).json({
               message: "Database error while creating book"
            });
         }

         db.query(getQuery, (err, books) => {
            if (err) {
               logger.error(`Error executing query: ${err.message}`);
               return res.status(500).json({
                  message: "Database error after insert"
               });
            }

            logger.info(`Book created successfully. books count: ${books.length}`);

            return res.status(201).json({
               message: "Book created successfully!",
               books: books,
            });
         });
      }
   );
};

BooksController.prototype.update = (req, res) => {
   const bookId = req.params.id;
   const {
      title,
      description,
      releaseDate,
      pages,
      author: authorId,
   } = req.body;

   logger.info(`BooksController [UPDATE] - id: ${bookId}`);

   db.query(
      `UPDATE book SET title = ?, releaseDate = ?, description = ?, pages = ?, authorId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, new Date(releaseDate), description, pages, authorId, bookId],
      (err) => {
         if (err) {
            logger.error(`Error executing query: ${err.message}`);
            return res.status(500).json({
               message: "Database error while updating book"
            });
         }

         db.query(getQuery, (err, books) => {
            if (err) {
               logger.error(`Error executing query: ${err.message}`);
               return res.status(500).json({
                  message: "Database error after update"
               });
            }

            logger.info(`Book updated successfully. books count: ${books.length}`);

            return res.status(200).json({
               message: "Book updated successfully!",
               books: books,
            });
         });
      }
   );
};

BooksController.prototype.delete = (req, res) => {
   const bookId = req.params.id;

   logger.info(`BooksController [DELETE] - bookId: ${bookId}`);

   db.query('DELETE FROM book WHERE id = ?', [bookId], (err) => {
      if (err) {
         logger.error(`Error executing query: ${err.message}`);
         return res.status(500).json({
            message: "Database error while deleting book"
         });
      }

      db.query(getQuery, (err, books) => {
         if (err) {
            logger.error(`Error executing query: ${err.message}`);
            return res.status(500).json({
               message: "Database error after delete"
            });
         }

         logger.info(`Book deleted successfully. books count: ${books.length}`);

         return res.status(200).json({
            message: "Book deleted successfully!",
            books: books,
         });
      });
   });
};

module.exports = new BooksController();
