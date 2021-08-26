const { Restify, defaultEndPoints } = require("../index");

const routes = [
  {
    path: "/exams",
    targets: [
      {
        path: "/count",
        method: "get",
        middleWare: () => console.log(),
        customEndPoint: () => console.log(),
      },
      {
        path: "/delete",
        method: "get",
        middleWare: () => console.log(),
        endPoint: defaultEndPoints.delete,
      },
    ],
  },
];

console.log(new Restify({ routes }));
