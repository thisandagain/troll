## troll
#### Language sentiment analysis and neural networks... for trolls.

Troll is a tool for performing sentiment analysis (ie: "is this naughty or nice") on arbitrary blocks of text and associating it with a unique user. Using this data, combined with a rather naivé neural network and some training, users can be classified as "trolls".

### Installation
Troll uses [Redis](http://redis.io/) for data storage. Once Redis is up and running, you can install Troll using NPM:
```bash
npm install troll
```

### String Analysis
```javascript
var troll   = require('troll');

troll.analyze('This is great!', 'user123', function (err, result) {
    console.log(result);    // 6
});

troll.analyze('I hate this stupid thing.', 'user456', function (err, result) {
    console.log(result);    // -10 
});
```

### Training
Before attempting to classify a user, you'll need to train Troll. You can specify your own training data or use a basic set that is included. To load the included training set:
```javascript
troll.train(function (err, result) {
    console.dir(result);    // { error: 0.005, iterations: 72 }
});
```

### User Classification
Once trained, now you can classify:
```javascript
troll.classify('user123', function (err, result) {
    console.dir(result);    // { total: 9, sum: 36, troll: 0.010294962292857838 }
});
```

The value returned for the `troll` key represents the probability of that user being a troll. A value close to zero means that they are most likely not a troll, while a number closer to one means that they are.

---

### Redis Connection Options
Troll uses your environment by looking at `process.env` for connection settings. If none are found, default [Redis](http://redis.io/) connection settings are used:
```
TROLL_HOST: null
TROLL_PORT: null
TROLL_PASS: null
```

---

### Testing
```bash
npm test
```

### Credits
- Sentiment analysis using [AFINN](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010) by [thinkroth](https://github.com/thinkroth)
- Neural network by [harthur](https://github.com/harthur)