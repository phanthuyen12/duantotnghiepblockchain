const express = require('express');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/studentRoutes');
const viewRouter = require('./routes/viewRouters');

const app = express();
const PORT = 3000;


app.use(express.json());
app.use('/api', studentRoutes);
app.use('/', viewRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
