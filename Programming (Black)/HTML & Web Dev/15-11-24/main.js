var verbs = ['blush', 'paste', 'lock', 'scatter', 'slow', 'repair', 'connect', 'cheat', 'brush']
var adverbs = ['cheerfully', 'happily', 'quickly', 'slowly', 'sadly', 'angrily', 'loudly', 'quietly', 'softly']
var nouns = ['carpenter', 'pencil', 'dog', 'cat', 'bird', 'fish', 'tree', 'flower', 'river']
var adjectives = ['beautiful', 'ugly', 'big', 'small', 'tall', 'short', 'fat', 'thin', 'long']

function randomPoem() {
    var verb = verbs[Math.floor(Math.random() * verbs.length)]
    var adverb = adverbs[Math.floor(Math.random() * adverbs.length)]
    var noun = nouns[Math.floor(Math.random() * nouns.length)]
    var adjective = adjectives[Math.floor(Math.random() * adjectives.length)]

    var poem = 'The ' + adjective + ' ' + noun + ' ' + verb + ' ' + adverb + '.'
    console.log(poem)
    document.getElementById('textTable').innerHTML = poem;
}

var brainrot = ['skibidi', 'gyatt', 'rizz', 'only in ohio', 'duke', 'dennis', 'did', 'you', 'pray', 'today', 'livvy', 'dunne', 'rizzing', 'up', 'baby', 'gronk', 'sussy', 'imposter', 'pibby', 'glitch', 'in', 'real', 'life', 'sigma', 'alpha', 'omega', 'male', 'grindset', 'andrew', 'tate', 'goon', 'cave', 'freddy', 'fazbear', 'colleen', 'ballinger', 'smurf', 'cat', 'vs', 'strawberry', 'elephant', 'blud', 'dawg', 'shmlawg', 'ishowspeed', 'a', 'whole', 'bunch', 'of', 'turbulence', 'ambatukam', 'bro', 'really', 'thinks', 'carti', 'literally', 'hitting', 'the', 'griddy', 'the', 'ocky', 'way', 'kai', 'cenat', 'fanum', 'tax', 'garten', 'of', 'banban', 'no', 'edging', 'in', 'class', 'not', 'the', 'mosquito', 'again', 'bussing', 'axel', 'in', 'harlem', 'whopper', 'whopper', 'whopper', 'whopper', '1', '2', 'buckle', 'my', 'shoe', 'goofy', 'ahh', 'aiden', 'ross', 'sin', 'city', 'monday', 'left', 'me', 'broken', 'quirked', 'up', 'white', 'boy', 'busting', 'it', 'down', 'sexual', 'style', 'goated', 'with', 'the', 'sauce', 'john', 'pork', 'grimace', 'shake', 'kiki', 'do', 'you', 'love', 'me', 'huggy', 'wuggy', 'nathaniel', 'b', 'lightskin', 'stare', 'biggest', 'bird', 'omar', 'the', 'referee', 'amogus', 'uncanny', 'wholesome', 'reddit', 'chungus', 'keanu', 'reeves', 'pizza', 'tower', 'zesty', 'poggers', 'kumalala', 'savesta', 'quandale', 'dingle', 'glizzy', 'rose', 'toy', 'ankha', 'zone', 'thug', 'shaker', 'morbin', 'time', 'dj', 'khaled', 'sisyphus', 'oceangate', 'shadow', 'wizard', 'money', 'gang', 'ayo', 'the', 'pizza', 'here', 'PLUH', 'nair', 'butthole', 'waxing', 't-pose', 'ugandan', 'knuckles', 'family', 'guy', 'funny', 'moments', 'compilation', 'with', 'subway', 'surfers', 'gameplay', 'at', 'the', 'bottom', 'nickeh30', 'ratio', 'uwu', 'delulu', 'opium', 'bird', 'cg5', 'mewing', 'fortnite', 'battle', 'pass', 'all', 'my', 'fellas', 'gta', '6', 'backrooms', 'gigachad', 'based', 'cringe', 'kino', 'redpilled', 'no', 'nut', 'november', 'pokénut', 'november', 'foot', 'fetish', 'F', 'in', 'the', 'chat', 'i', 'love', 'lean', 'looksmaxxing', 'gassy', 'social', 'credit', 'bing', 'chilling', 'xbox', 'live', 'mrbeast', 'kid', 'named', 'finger', 'better', 'caul', 'saul', 'i', 'am', 'a', 'surgeon', 'hit', 'or', 'miss', 'i', 'guess', 'they', 'never', 'miss', 'huh', 'i', 'like', 'ya', 'cut', 'g', 'ice', 'spice', 'gooning', 'fr', 'we', 'go', 'gym', 'kevin', 'james', 'josh', 'hutcherson', 'coffin', 'of', 'andy', 'and', 'leyley', 'metal', 'pipe', 'falling'];

function randomRot() {
    var word1 = brainrot[Math.floor(Math.random() * brainrot.length)]
    var word2 = brainrot[Math.floor(Math.random() * brainrot.length)]
    var word3 = brainrot[Math.floor(Math.random() * brainrot.length)]
    var word4 = brainrot[Math.floor(Math.random() * brainrot.length)]

    var rot = 'The ' + word1 + ' ' + word2 + ' ' + word3 + ' ' + word4 + '.'
    document.getElementById('textTable').innerHTML = rot;
}

function howBeat() {
    var options = ['⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠛⠛⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⣿⠋⠈⠀⠀⠀⠀⠐⠺⣖⢄⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⡏⢀⡆⠀⠀⠀⢋⣭⣽⡚⢮⣲⠆⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⡇⡼⠀⠀⠀⠀⠈⠻⣅⣨⠇⠈⠀⠰⣀⣀⣀⡀⠀⢸⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣟⢷⣶⠶⣃⢀⣿⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⠀⠈⠓⠚⢸⣿⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⢀⡠⠀⡄⣀⠀⠀⠀⢻⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠐⠉⠀⠀⠙⠉⠀⠠⡶⣸⠁⠀⣠⣿⣿⣿⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⣿⣦⡆⠀⠐⠒⠢⢤⣀⡰⠁⠇⠈⠘⢶⣿⣿⣿⣿⣿⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠠⣄⣉⣙⡉⠓⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n' +
    '⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⣀⣀⠀⣀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿', 
    'Team 2 is fantastic, they just need to work on communication, aim, map awareness, crosshair placement, economy management, pistol aim, awp flicks, grenade spots, smoke spots, pop flashes, positioning, bomb plant positions, retake ability, bunny hopping, spray control and getting kills',
    'Ive seen Team 2 play, they dont even use a monitor. They visualize the map in a detailed rendering, completely in their minds. They have a biological wallhack; their godlike perceptions highlight all enemies within light-years. Their eyes are closed as their mice gracefully swerve across the table, making immaculate twitches as they flick from head to head. The bullets that escape their gun barrels are surgical; each making a deadly strike in between the diddlers eyes.',
    'My dad beats me FeelsBadMan My mom beats me FeelsBadMan My brother beats me FeelsBadMan My sister beats me FeelsBadMan At least I feel safe with Diddlers, because they cant beat anything FeelsGoodMan',
    'I want to eat 🍽 outrageous 😮 amounts of raw 🤤 fish 🐟 tonight 🌙 just the rawer the better 💦 🎣 and I want to be surrounded 👦 🤝 👦 by boys 🧔 💕 💋 🧔 or men 💪 preferably men 😍 🤩 ',
    '1 kill, 20 assists? That’s that real discord kitten valorant, I 100% respect it. Those are the stats I put up when I’m tryna get free discord nitro from some shady guy I met on craigslist.Y’all wouldn’t get it'];
    var option1 = options[Math.floor(Math.random() * options.length)];
    console.log(option1);
    document.getElementById('textTable').innerHTML = option1;
}


/**
 * Event Handlers
 */

document.getElementById('poemButton').addEventListener('click', function() {
    console.log("Generated Poem:")
    randomPoem();
})

document.getElementById('rotButton').addEventListener('click', function() {
    console.log("Generated Rot:")
    randomRot();
})

document.getElementById('beatButton').addEventListener('click', function() {
    console.log("Generated CopyPasta:")
    howBeat();
})