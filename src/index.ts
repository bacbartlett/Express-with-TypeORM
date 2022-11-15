import express, { Express, Request, Response } from 'express';
import path from 'path';
import { AppDataSource } from './databaseSetup';
import { User } from './entries/User';
import examplerouter from './routes/examplerouter';

const app: Express = express();
const port = process.env.PORT || 3000;

const pathToPublic = path.join(__dirname, "..", "public");

AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

app.use(express.json());

app.use(express.static(pathToPublic))

app.use('/router', examplerouter)

app.get('/users', async (req: Request, res: Response) => {
    const usersRepo = await AppDataSource.getRepository(User);
    const users = await usersRepo.find();
    res.json(users);
});

app.post('/user', async (req: Request, res: Response) => {
    const {firstName, lastName, phoneNumber} = req.body;
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    await AppDataSource.manager.save(user);
    res.json({saved: true});
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});