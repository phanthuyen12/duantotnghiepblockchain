const express = require('express');
const app = express();
const port = 3333;
const path = require('path');
// Cấu hình sử dụng các middleware
app.use(express.static('public')); // Nếu có thư mục 0public chứa các tài nguyên tĩnh (css, js, ...)
app.set('view engine', 'ejs'); // Sử dụng template engine EJS, có thể thay đổi thành Pug, Handlebars, vv.
app.use(express.static(path.join(__dirname,'public')));

// Import và sử dụng các router
const indexRouter = require('./routes/admin');
app.use('/', indexRouter);

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
