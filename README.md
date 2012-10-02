## troll
#### Language sentiment analysis and neural networks... for trolls.

Troll is a tool for performing sentiment analysis (ie: "is this naughty or nice") on arbitrary blocks of text and associating it with a unique user. Using this data, combined with a rather naivé neural network and some simple training, users can be reliably classified as "trolls".

### Installation
```bash
npm install troll
```

### String Analysis
```javascript
var troll   = require('troll');

troll.analyze('This is great!', 'user123', function (err, result) {
    console.log(result);    // 6
});

troll.analyze('I hate this... totally stupid.', 'user456', function (err, result) {
    console.log(result);    // -10 
});
```

### User Classification
```javascript
troll.classify('user123', function (err, result) {
    console.dir(result);    // { user: 'user123', total: 24, sum: 10, troll: false }
});
```

### Training
```javascript
troll.train('user456', true, function (err) {
    console.log('The neural network has been told that user456 is a "troll"'); 
});
```

---

### Redis Connection Options
```javascript

```

---

### Testing
```bash
npm test
```

### Credits
- Sentiment analysis using [AFINN](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010) by [thinkroth](https://github.com/thinkroth)
- Neural network by [harthur](https://github.com/harthur)