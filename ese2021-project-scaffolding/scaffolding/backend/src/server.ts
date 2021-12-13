import express, {Application} from 'express';
import morgan from 'morgan';
import {TodoItemController} from './controllers/todoitem.controller';
import {TodoListController} from './controllers/todolist.controller';
import {UserController} from './controllers/user.controller';
import {SecuredController} from './controllers/secured.controller';
import {Sequelize} from 'sequelize';
import {TodoList} from './models/todolist.model';
import {TodoItem} from './models/todoitem.model';
import {User} from './models/user.model';
import {Post} from './models/post.model';
import {Product} from './models/product.model';
import {Order} from './models/order.model';
import {Vote} from './models/vote.model';
import {Category} from './models/category.model';


import cors from 'cors';
import {AdminController} from './controllers/admin.controller';
import {ItemImage} from './models/itemImage.model';
import {PostController} from './controllers/post.controller';
import {CategoryController} from './controllers/category.controller';
import {ProductController} from './controllers/product.controller';
import {OrderController} from './controllers/order.controller';
import * as fs from 'fs';


export class Server {
    private server: Application;
    private sequelize: Sequelize;
    private port = process.env.PORT || 3000;

    /***
     * If testdata should be generated, the call for the method makeTestData should have no parameter or true. If no
     * testdata should be generated, i.e. a database with only the table but no content, then the call for makeTestData
     * should have the parameter false
     */
    constructor() {
        this.server = this.configureServer();
        this.sequelize = this.configureSequelize();

        TodoItem.initialize(this.sequelize); // creates the tables if they dont exist
        TodoList.initialize(this.sequelize);
        User.initialize(this.sequelize);
        ItemImage.initialize(this.sequelize);
        Post.initialize(this.sequelize);
        Product.initialize(this.sequelize);
        Order.initialize(this.sequelize);
        Vote.initialize(this.sequelize);
        Category.initialize(this.sequelize);
        TodoItem.createAssociations();
        TodoList.createAssociations();
        ItemImage.createAssociations();
        Post.createAssociations();
        Order.createAssociations();
        Vote.createAssociations();


        this.sequelize.sync({force: true}).then(() => {                           // create connection to the database
            this.makeTestData().then(() => {
                this.server.listen(this.port, () => {                            // start server on specified port
                    console.log(`server listening at http://localhost:${this.port}`);   // indicate that the server has started
                });
            });
        });
    }

    private configureServer(): Application {
        // options for cors middleware
        const options: cors.CorsOptions = {
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'X-Access-Token',
            ],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: `http://localhost:${this.port}`,
            preflightContinue: false,
        };

        return express()
            .use(cors())
            .use(express.json())                    // parses an incoming json to an object
            .use(morgan('tiny'))                    // logs incoming requests
            .use('/todoitem', TodoItemController)   // any request on this path is forwarded to the TodoItemController
            .use('/todolist', TodoListController)
            .use('/user', UserController)
            .use('/post', PostController)
            .use('/order', OrderController)
            .use('/category', CategoryController)
            .use('/product', ProductController)
            .use('/secured', SecuredController)
            .use('/admin', AdminController)
            .options('*', cors(options))
            .use(express.static('./src/public'))
            // this is the message you get if you open http://localhost:3000/ when the server is running
            .get('/', (req, res) => res.send('<h1>Welcome to the ESE-2021 Backend Scaffolding <span style="font-size:50px">&#127881;</span></h1>'));
    }

    private configureSequelize(): Sequelize {
        return new Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite',
            logging: false // can be set to true for debugging
        });
    }

    private makeTestData(createsData: boolean = true): Promise<void> {
        this.sequelize.query('DELETE FROM product');
        this.sequelize.query('DELETE FROM vote');
        this.sequelize.query('DELETE FROM "order"');
        this.sequelize.query('DELETE FROM users');
        this.sequelize.query('DELETE FROM post');
        this.sequelize.query('DELETE FROM category');

        if (createsData) {
            // Password for every user is: notSecure12+
            const category = fs.readFileSync('sql_testdata/category.sql', 'utf8');
            const product = fs.readFileSync('sql_testdata/product.sql', 'utf8');
            const vote = fs.readFileSync('sql_testdata/vote.sql', 'utf8');
            const order = fs.readFileSync('sql_testdata/order.sql', 'utf8');
            const users = fs.readFileSync('sql_testdata/users.sql', 'utf8');
            const post = fs.readFileSync('sql_testdata/post.sql', 'utf8');

            this.sequelize.query(category);
            this.sequelize.query(users);
            this.sequelize.query(post);
            this.sequelize.query(vote);
            this.sequelize.query(product);
            this.sequelize.query(order);
        }
        return Promise.resolve();
    }
}

const server = new Server(); // starts the server
