(function() {
    Jamwich.Views.Search = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            console.log("initialized search!");
            this.render();
        },
        render: function() {
            this.$el.append("<ul> <li>hello world</li> </ul>");
        }
    })
})();