// server/server.js

let express = require("express");
let graphqlHTTP = require("express-graphql");
let { buildSchema } = require("graphql");
let cors = require("cors");
let Pusher = require("pusher");
let bodyParser = require("body-parser");
let Multipart = require("connect-multiparty");

let schema = buildSchema(`
    type User {
        id: String!
        nickname: String!
        avatar: String!
    }
    type Post {
        id: String!
        user: User!
        caption: String!
        image: String!
    }
    type Query {
        user(id: String): User!
        post(user_id: String, post_id: String) : Post!
        posts(user_id: String): [Post]
    }
`);

// Maps id to User object
let userslist = {
    a: {
        id: "a",
        nickname: "Chris",
        avatar: "https://st.motortrend.com/uploads/sites/10/2015/11/2016-nissan-gtr-premium-coupe-angular-front.png"
    },
    b: {
        id: "b",
        nickname: "Austin",
        avatar: "https://st.motortrend.com/uploads/sites/10/2015/11/2016-nissan-gtr-premium-coupe-angular-front.png"
    }
};
let postslist = {
    a: {
        a: {
            id: "a",
            user: userslist["a"],
            caption: "Moving the community!",
            image: "https://pbs.twimg.com/media/DOXI0IEXkAAkokm.jpg"
        },
        b: {
            id: "b",
            user: userslist["b"],
            caption: "Angular Book :)",
            image: "https://cdn-images-1.medium.com/max/1000/1*ltLfTw87lE-Dqt-BKNdj1A.jpeg"
        },
        c: {
            id: "c",
            user: userslist["a"],
            caption: "Me at Frontstack.io",
            image: "https://pbs.twimg.com/media/DNNhrp6W0AAbk7Y.jpg:large"
        },
        d: {
            id: "b",
            user: userslist["b"],
            caption: "Moving the community!",
            image: "https://pbs.twimg.com/media/DOXI0IEXkAAkokm.jpg"
        }
    }
};

// The root provides a resolver function for each API endpoint
let root = {
    user: function({ id }) {
        return userslist[id];
    },
    post: function({ user_id, post_id }) {
        return postslist[user_id][post_id];
    },
    posts: function({ user_id }) {
        return Object.values(postslist[user_id]);
    }
};

let pusher = new Pusher({
    appId: '773367',
    key: '41d87ef596e474059338',
    secret: '0f94229d2381ee10c46f',
    cluster: 'us2',
    encrypted: true
});

let app = express();
app.use(cors());

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    })
);

// add Middleware
let multipartMiddleware = new Multipart();

// trigger add a new post
app.post('/newpost', multipartMiddleware, (req,res) => {
    console.log("hi");
    // create a sample post
    let post = {
        user: {
            nickname: req.body.name,
            avatar: req.body.avatar
        },
        image: req.body.image,
        caption: req.body.caption
    }

    // trigger pusher event
    pusher.trigger("posts-channel", "new-post", {
        post
    });

    return res.json({ status: "Post Created" });
});

// set application port
app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");