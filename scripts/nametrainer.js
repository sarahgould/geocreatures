function listOfWeights (array) {
    var object = {}
    array.forEach(function(v) {
        object[v] = 0.1
    })
    return object
}

function weightedRandomIn (weightedList) {
    // Figure out the total of all the weights
    var totalWeight = 0
    for (var i in weightedList) {
        totalWeight += weightedList[i]
    }

    // Pick a random number within the total weight range
    var n = Math.random() * totalWeight

    // Look for the item chosen by the random number and return it
    for (var j in weightedList) {
        if (n <= weightedList[j]) {
            return j
        }
        n -= weightedList[j]
    }
}

function generateSyllable (syllablePosition) {
    // Get the weights for the appropriate syllable position
    var parts = syllableWeights[syllablePosition]

    // Generate parts of syllable
    var syllable = {
        position: syllablePosition,
        onset: weightedRandomIn(parts.onsets),
        nucleus: weightedRandomIn(parts.nuclei),
        coda: weightedRandomIn(parts.codas)
    }

    // Return the syllable
    return syllable
}

function judgeSyllable (syllable, addWeight) {
    // Modify weights of given syllable
    syllableWeights[syllable.position].onsets[syllable.onset] += addWeight
    syllableWeights[syllable.position].nuclei[syllable.nucleus] += addWeight
    syllableWeights[syllable.position].codas[syllable.coda] += addWeight
}

function generateWord () {
    // Create a new word
    var word = {
        numSyllables: parseInt(weightedRandomIn(numSyllableWeights)),
        syllables: []
    }

    // Generate its syllables
    for (var i in range(word.numSyllables+1)) {
        word.syllables.push(generateSyllable(i))
    }

    // Return word
    return word
}

function judgeWord (word, addWeight) {
    // Modify weights of given word
    //numSyllableWeights[word.numSyllables] += addWeight
    for (var i in word.syllables) {
        judgeSyllable(word.syllables[i], addWeight)
    }
}

function flattenWord (word) {
    var stringWord = ''
    for (var i in word.syllables) {
        var syllable = word.syllables[i]
        stringWord += syllable.onset + syllable.nucleus + syllable.coda
    }
    return capitalize(stringWord)
}

function syllableParts () {
    return {
        onsets: listOfWeights(onsets),
        nuclei: listOfWeights(nuclei),
        codas: listOfWeights(codas)
    }
}

var syllableWeights = {
    0: syllableParts(),
    1: syllableParts(),
    2: syllableParts()
}

var numSyllableWeights = listOfWeights([0, 1, 2])

var favoriteWords = []

function displayWord(word) {
    return $('<div>')
        .addClass('word')
        .data('word', word)
        .text(flattenWord(word))
}

function setupVoting(el) {
    for (var i in range(50)) {
        var word = generateWord()
        displayWord(word)
            .appendTo($(el))
            .click(function () {
                $(this).toggleClass('accepted')
            })
    }

    var nextButton = $('<div>')
        .addClass('nextRound')
        .text('Next Round')
        .click(function () {
            $('.word')
                .each(function() {
                    var weight = ($(this).hasClass('accepted') ? 0.02 : -0.01)
                    judgeWord($(this).data('word'), weight)
                    if ($(this).hasClass('accepted')) {
                        favoriteWords.push($(this).text())
                    }
                })
                .remove()
            $(this).remove()
            setupVoting(el)
        })
        .appendTo(el)
}
