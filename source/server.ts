import * as express from 'express';
import * as path from 'path';

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, '../view'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '../static')));

app.get('/', (req, res) => {
  res.render('index', {title: 'SmartHome Web'});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
