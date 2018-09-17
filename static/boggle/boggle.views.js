this.boggle = this.boggle || {};

(function(boggle, Backbone, _) {
  "use strict";
  var views = {};

  views.Base = Backbone.View.extend({
    initialize: function (options) {
      options = options || {};
      this.children = options.children || {};
      if(this.model != null) {
        this.bindModelEvents(this.model, this.modelEvents);
      }
      if(this.collection != null) {
        this.bindModelEvents(this.collection, this.collectionEvents);
      }
    },
    render: function () {
      this.$el.html(this.html());
      _.each(this.children, this.assignChild, this);
      if(typeof this.afterRender === "function") {
        this.afterRender.apply(this, arguments);
      }
    },
    assignChild: function (view, key) {
      view.setElement(this.$("#"+key)).render();
    },
    bindModelEvents: function (model, modelEvents) {
      _.each(modelEvents, function (methodName, eventString) {
        var method = this[methodName] || methodName;
        this.listenTo(model, eventString, method);
      }, this);
    },
    remove: function () {
      _.each(this.children, function (view) {
        view.stopListening();
      }, this);
      this._super("remove");
    },
    _super: function (method) {
      var args = Array.prototype.slice.call(arguments, 1);
      return this.constructor.__super__[method].apply(this, args);
    }
  });

  views.Game = views.Base.extend({
    initialize: function (options) {
      this.urlEncodeGame = options.urlEncodeGame;
      this._super("initialize", options);
    },
    modelEvents: {
      "change:gameState": function (model, gameState) {
        if(gameState !== "wrong") {
          this.render();
        }
      }
    },
    html: function () {
      var json = this.model.toJSON();
      
      switch(json.gameState) {
        case "init":
        case "ready":
          return "<h1>Press SPACE to play.</h1>";
        case "over":
          return "<div class='u-fixedTop u-zTop'>" +
          "<div id='clock'></div><div id='scoreboard'></div>" +
          "</div>" +
          "<div id='letterGrid' class='u-clockHeightMargin'></div>" +
          "<div id='typewriter' class='u-fixedBottom u-zTypewriter'></div>" +
          "<div class='u-gridWidthMargin u-scrollContainer u-zAnswers'>" +
          "<div id='answers'></div>" +
          "<section class='Messages'>"+
          "<h1>Whoah! "+json.score+" points!</h1>"+
          "<img src='http://thecatapi.com/api/images/get?format=src&type=gif''>"+
          "<br>Sharable link: <br><input type='text' value='"+this.urlEncodeGame()+"'>"+
          "</section>" +
          "</div>"+
          "<div id='controls' class='u-fixedBottom u-zControls'></div>";
        case "playing":
          return "<div class='u-fixedTop u-zTop'><div id='clock'></div><div id='scoreboard'></div>" +
          "<div id='letterGrid'></div></div>" +
          "<div id='typewriter' class='u-fixedBottom u-zTypewriter'></div>" +
          "<div id='answers' " +
          "class='u-gridWidthMargin u-clockHeightMargin u-scrollContainer u-zAnswers'></div>" +
          "<div id='controls' class='u-fixedBottom u-zControls'></div>";
      }
    },
  });

  views.LetterGrid = views.Base.extend({
    collectionEvents: {
      "reset add remove change": "render"
    },
    initialize: function (options) {
      this._super("initialize");
      this.width = options.width;
      this.height = options.height;
    },
    _block: function (options) {
      return "<div class='Block u-width" + options.width +
          " u-height" + options.height + " " + options.classNames.join(" ") + "'>" + 
          options.content + "</div>";
    },
    html: function () {
      var blocks = this.collection.map(function (model) {
        return this._block({
          width: 1,
          height: 1,
          content: "<div class='Block-inner'>" + model.get("letter") + "</div>",
          classNames: [
            ("Block--rot" + model.get("rotation")),
            (model.get("highlight") ? "u-highlight" : ""),
            (model.isqupdbn() ? "Block--underline" : "")
          ]
        });
      }, this).join("");
      return this._block({
        width: this.width,
        height: this.height,
        content: blocks,
        classNames: ["LetterGrid"]
      });
    },
  });

  views.Typewriter = views.Base.extend({
    initialize: function () {
      this._super("initialize");
      _.bindAll(this, "_keyDowned");
    },
    html: function () {
      var json = this.model.toJSON();
      if(json.gameState === "paused") {
        return "<div class='Typewriter Typewriter--paused'>"+
               "PAUSED -- Press SPACE to continue playing</div>";
      } else {
        return "<div class='Typewriter'>" + this.collection.map(function (model) {
          var json = model.toJSON();
          return "<div class='Block u-widthHalf'>"+json.letter+"</div>";
        }).join("") + "<div class='Block Typewriter-cursor'>&brvbar;</div></div>";
      }
    },
    afterRender: function () {
      this.$cursor = this.$(".Typewriter-cursor");
    },
    collectionEvents: {
      "add remove reset": "render"
    },
    modelEvents: {
      "change:gameState": "_changeState"
    },
    _changeState: function () {
      var self = this;
      switch(this.model.get("gameState")) {
        case "playing":
          this.render();
          document.body.addEventListener("keydown", this._keyDowned);
          this._cursorInterval = setInterval(function () {
            self.$cursor.toggleClass("u-hidden");
          }, 600);
          break;
        case "paused":
          clearInterval(this._cursorInterval);
          this.render();
          break;
        case "wrong":
          clearInterval(this._cursorInterval);
          document.body.removeEventListener("keydown", this._keyDowned);
          this.$cursor.addClass("u-hidden");
          this.$(".Typewriter").addClass("Typewriter--wrong");
          break;
        case "over":
          clearInterval(this._cursorInterval);
          document.body.removeEventListener("keydown", this._keyDowned);
          this.collection.reset();
          this.$cursor.addClass("u-hidden");
          break;
      }
    },
    _keyDowned: function (e) {
      var abc = "abcdefghijklmnopqrstuvwxyz",
          letter;

      switch(this.model.get("gameState")) {
        case "playing":
          break;
        default:
          return;
      }
      if(e.metaKey && e.keyCode !== 8) {
        return;
      }

      if(e.keyCode >= 65 && e.keyCode <= 90) {
        letter = abc[e.keyCode - 65];
      }
      if(e.keyCode >= 97 && e.keyCode <= 122) {
        letter = abc[e.keyCode - 97];
      }
      if(e.keyCode === 190) {
        letter = ".";
      }

      e.preventDefault();

      if(e.keyCode === 13) {
        var word = "" + this.collection;
        this.trigger("enter", word);
      }

      if(letter != null && this.collection.length < 16) {
        this.collection.push({
          letter: letter
        });
      }

      if(e.keyCode === 8) {
        if(e.metaKey) {
          this.collection.reset();
        } else {
          this.collection.pop();
        }
      }
    }
  });

  views.WordList = views.Base.extend({
    initialize: function (options) {
      this._super("initialize");
      this.letterGrid = options.letterGrid;  
    },
    collectionEvents: {
      "add remove change": "render"
    },
    modelEvents: {
      "change:gameState": "render"
    },
    events: {
      "mouseover .Answers-text": "handleMouseoverAnswer",
      "mouseout": "handleMouseoutAnswers",
    },
    html: function () {
      var json = this.model.toJSON();
      var items = this.collection.map(function (model) {
        var itemJson = model.toJSON();
        if(json.gameState == "over") {
          if(itemJson.found) {
            return "<li><div class='Answers-accentContainer'>" + 
                   "<div class='Answers-checkIcon'>&check;</div>" +
                   "<div class='Answers-text'>" +
                   "<a target='_blank' href='https://www.google.com/webhp#q=define+"+
                   itemJson.word+"'>"+itemJson.word+"</a>" +
                   "</div>" +
                   "<div class='Answers-accent'></div></div></li>"; 
          } else {
            return "<li><div class='Answers-accentContainer'>" +
                   "<div class='Answers-checkIcon'></div>" +
                   "<div class='Answers-text'>" +
                   "<a target='_blank' href='https://www.google.com/webhp#q=define+"+
                   itemJson.word+"'>"+itemJson.word+"</a>" +
                   "</div>" +
                   "<div class='Answers-accent'></div></div></li>"; 
          }
        } else {
          if(itemJson.found) {
            return "<li><div class='Answers-accentContainer'>" + 
                   "<div class='Answers-checkIcon'>&check;</div>" +
                   "<div class='Answers-text'>" + itemJson.word +
                   "</div>" +
                   "<div class='Answers-accent'></div></div></li>"; 
          } else {
            return "<li><div class='Answers-accentContainer'>" +
              "<div class='Answers-checkIcon'></div>" +
              "<div class='Answers-accent'></div></div></li>"; 
          }
        }
      }).join("");

      return "<ul class='Answers'>"+items+"</ul>";
    },
    afterRender: function (changedModel) {
      var self = this;
      if(changedModel != null) {
        this.$(".Answers-text").each(function (index, el) {
          if($(el).text().trim() === changedModel.get("word")) {
            self.$el.scrollTop($(el).offset().top - $(el).outerHeight());
          }
        });
      }
    },
    handleMouseoverAnswer: function (e) {
      var word = $(e.target).text();
      var cubes = this.collection.get(word).get("cubes");
      var self = this;
      this.letterGrid.each(function (cube) {
        cube.set({highlight: false}, {silent: true}); 
      });
      _.forEach(cubes, function (index) {
        self.letterGrid.at(index).set({highlight: true}, {silent: true});
      });
      this.letterGrid.trigger("change");
    },
    handleMouseoutAnswers: function () {
      this.letterGrid.each(function (cube) {
        cube.set({highlight: false}, {silent: true}); 
      });
      this.letterGrid.trigger("change");
    },
  });

  views.Clock = views.Base.extend({
    html: function () {
      var json = this.model.toJSON();
      var seconds = "" + json.seconds;
      if(seconds.length === 1) {
        seconds = "0" + seconds;
      }
      if(json.minutes === 0) {
        if(json.seconds === 0) {
          return "<div class='Clock Clock--alert'>Press SPACE to play again</div>";
        } else if(json.seconds <= 30) {
          return "<div class='Clock Clock--alert'>t - :" + seconds + "</div>";
        } else {
          return "<div class='Clock'>t - :" + seconds + "</div>";
        }
      } else {
        return "<div class='Clock'>t - " + json.minutes + ":" + seconds + "</div>";
      }
    },
    modelEvents: {
      "change:seconds": "render"
    }
  });

  views.Scoreboard = views.Base.extend({
    html: function () {
      var json = this.model.toJSON(),
          self = this;
      var percent = Math.ceil((json.score/json.maxScore) * 100);
      if(json.scoreDelta > 0) {
        setTimeout(function () {
          self.model.set({scoreDelta: 0}); 
        }, 1000);
        return "<div class='Scoreboard Scoreboard--delta'>"+ 
          "score! "+json.score+" (+"+json.scoreDelta+") / "+json.maxScore+" = "+percent+"%</div>";
      } else {
        return "<div class='Scoreboard'>"+json.score+" / "+json.maxScore+" = "+percent+"%</div>";
      }
    },
    modelEvents: {
      "change": "render"
    }
  });

  views.Controls = views.Base.extend({
    initialize: function () {
      this._super("initialize");
      this._setVisualTheme();  
    },
    html: function () {
      var json = this.model.toJSON();
      return "<div class='Controls u-pullRight u-textRight'>"+
        "theme: <a href='#' class='js-change-theme'>"+
        json.visualThemeName +
        "</a><br>Made by " +
        "<a href='https://patrickcanfield.com' target='_blank'>Patrick Canfield</a></div>";
    },
    events: {
      "click .js-change-theme": function () {
        if(this.model.get("visualThemeName") === "Sun") {
          this.model.set({visualThemeName: "Moon"});
        } else {
          this.model.set({visualThemeName: "Sun"});
        }
        this.model.save();
      }
    },
    modelEvents: {
      "change:visualThemeName": "_changeVisualTheme"
    },
    _setVisualTheme: function () {
      $("#visual-theme-css-link").attr({
        href: "boggle.theme."+this.model.get("visualThemeName")+".css"
      });
    },
    _changeVisualTheme: function () {
      this.render();
      this._setVisualTheme();
    }
  });

  boggle.views = views;
})(this.boggle, this.Backbone, this._);
