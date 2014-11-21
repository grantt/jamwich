/**
 * AppController
 *
 * @description :: Server-side logic for managing apps
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `AppController.home()`
   */
  home: function (req, res) {
      if (req.session.user) {
          res.view({username: req.session.user.username});
      } else {
          res.redirect('/');
      }
  }
};

