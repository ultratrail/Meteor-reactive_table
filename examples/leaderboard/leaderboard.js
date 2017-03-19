// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Trailers = new Meteor.Collection("trailers");

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    trailers : function () {
      return Trailers.find({}, {sort: {progress: 1, name: 1}});
    },

    tableSettings : function () {
      return {
          fields: [
            { key: 'name', label: 'Full Name' },
            { key: 'name', label: 'First Name', fn: function (name) { return name ? name.split(' ')[0] : ''; } },
            { key: 'progress', label: 'Progress' } //Distance travelled since the beginning of the trail
            { key: 'health', label: 'Health'} //Physical condition of the trailer
            { key: 'position', label: 'Position'} //pos on the map
          ]
      };
    },

    selected_name : function () {
      var trailer = Trailers.findOne(Session.get("selected_trailer"));
      return trailer && trailer.name;
    }
  });

  Template.trailer.helpers({
    selected : function () {
      return Session.equals("selected_trailer", this._id) ? "selected" : '';
    }
  });

  Template.leaderboard.events({
    'click input.inc': function () {
      Trailers.update(Session.get("selected_trailer"), {$inc: {progress: 1}});
    }
  });

  Template.trailer.events({
    'click': function () {
      Session.set("selected_trailer", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Trailers.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Trailers.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
