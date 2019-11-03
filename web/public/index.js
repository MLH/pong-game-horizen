(() => {
  const fetchPost = async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  };

  Game.ready(function() {
    var size = document.getElementById("size");
    var sound = document.getElementById("sound");
    var stats = document.getElementById("stats");
    var footprints = document.getElementById("footprints");
    var predictions = document.getElementById("predictions");
    var pong = Game.start("game", Pong, {
      sound: sound.checked,
      stats: stats.checked,
      footprints: footprints.checked,
      predictions: predictions.checked,
      eventHandlers: {
        start: async (message, data) => {
          const json = await fetchPost("/api/games", data);
          console.log({ message, json });
        }
      }
    });
    Game.addEvent(sound, "change", function() {
      pong.enableSound(sound.checked);
    });
    Game.addEvent(stats, "change", function() {
      pong.showStats(stats.checked);
    });
    Game.addEvent(footprints, "change", function() {
      pong.showFootprints(footprints.checked);
    });
    Game.addEvent(predictions, "change", function() {
      pong.showPredictions(predictions.checked);
    });
  });
})();
