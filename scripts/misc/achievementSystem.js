class Achievement {
    constructor(id, title, descr, score, img) {
        this.id = id;
        this.title = title;
        this.description = descr;
        this.score = score;
        this.img = img;
        this.completed = false;
        $achievements.push(this);
    }
}

function createAchievements() {
    var descr = getAchievDescriptions();
    var titles = getAchievTitles();
    var score = 10;
    for (let i = 0; i < descr.length; i++) {
        var d = descr[i];
        var t = titles[i];
        var achiev = new Achievement(i, t, d, score);

    }
}

function getAchievDescriptions() {
    return ["Finish the tutorial",
        "Finish a level in campaign mode",
        "Save a level",
        "Play the arcade"];
}
function getAchievTitles() {

    return ["Babysteps",
        "First victory",
        "Safety first!",
        "Arcade mode"];
}
