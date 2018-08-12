const Express = require('express');
const BodyParser = require('body-parser');
const Morgan = require('morgan');
const Path = require('path');
const CORS = require('cors');
const { IS_PROXY } = require('../configs/server');
const PORT = process.env.PORT || 6998;
const app = Express();


app.use(CORS());
app.use(BodyParser.json({ type: '*/*' }));
app.use(Morgan('dev'));


if (IS_PROXY) {
    const proxy = require('./routers/proxy');
    proxy(app);

    app.use(Express.static(Path.join(__dirname, '../dist'))); 
    app.get('*', (req, res) => {
        res.sendFile(Path.join(__dirname, '../dist/index.html'));
    });
}
else {
    const routers = require('./routers');
    routers(app);
}


app.listen(PORT, () => {
    console.log(`Server serving on port ${PORT}`);
});