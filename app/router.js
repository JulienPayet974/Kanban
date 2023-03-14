const router = require ('express').Router();
const listController = require ('./controllers/listController');
const cardController = require ('./controllers/cardController');
const tagController = require ('./controllers/tagController');

// équivalent à :
// const express = require ('express');
// const router = express.Router();

// nos routes

// listes 

/**
 * Récupère l'ensemble des listes
 * @route GET /list
 * @group Liste
 * @returns {object} 200 - An object with "result"
 * @returns {Error}  default - Unexpected error
 */
router.get('/lists', listController.getAll);

/**
 * Récupère une liste par son id
 * @route GET /list/:id
 * @group Liste
 * @param {integer} id.query.required
 * @returns {object} 200 - An object with "result"
 * @returns {Error}  default - Unexpected error
 */
router.get('/lists/:id', listController.getOne);

router.post('/lists', listController.create);
router.patch('/lists/:id', listController.update);

router.delete('/lists/:id', listController.remove);

// cartes
router.get('/lists/:id/cards', cardController.getAllByListId);
router.get('/cards/:id', cardController.getOne);

router.post('/cards', cardController.create);
router.patch('/cards/:id', cardController.update);

router.delete('/cards/:id', cardController.remove);

// tags

router.get('/tags', tagController.getAll);
router.get('/tags/:id', tagController.getOne);
router.post('/tags', tagController.create);
router.patch('/tags/:id', tagController.update);

router.delete('/tags/:id', tagController.remove);

router.post('/cards/:id/tag', tagController.associateCard);
router.delete('/cards/:card_id/tag/:tag_id', tagController.unassociateCard);

module.exports = router;