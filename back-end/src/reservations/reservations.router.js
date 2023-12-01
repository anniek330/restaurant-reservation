/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//route to all reservations
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

//route to a single reservation
router.route("/:reservation_id").get(controller.read).all(methodNotAllowed);

router.route("/:reservation_id/status").all(methodNotAllowed);

//router.route("/date=XXXX-XX-XX").all(methodNotAllowed);

module.exports = router;
