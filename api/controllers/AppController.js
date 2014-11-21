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
          console.log(req.session.user);
          res.view({user: req.session.user});
      } else {
          res.redirect('/');
      }
  },
  search: function (req, res) {

  }
};

