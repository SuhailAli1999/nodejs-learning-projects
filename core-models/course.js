const http = require("http");
const fs = require("fs");

http
  .createServer((req, res) => {
    const { method, url } = req;
    // add course
    if (method == "POST" && url == "/course") {
      let body = "";
      req.on("data", (data) => {
        body += data;
      });

      req.on("end", () => {
        const course = JSON.parse(body);

        const { id, name } = course;

        const newCourse = {
          id: id,
          name: name,
        };

        fs.readFile("course.txt", "utf-8", (error, data) => {
          if (error) {
            console.error(error.message);
            return;
          }
          let courses = [];

          if (data) {
            courses = JSON.parse(data);
          }

          const targetId = id;

          const coursesWithId = courses.find(
            (course) => course.id === targetId
          );

          if (coursesWithId) {
            res.end(
              JSON.stringify({
                message: `Course with ID ${targetId} exists.`,
              })
            );
            return;
          } else {
            courses.push(newCourse);
            fs.writeFile(
              "course.txt",
              JSON.stringify(courses),
              "utf-8",
              (error) => {
                if (error) {
                  console.error("Error writing file:", error);
                } else {
                  res.end(
                    JSON.stringify({ message: "Course added successfully" })
                  );
                }
              }
            );
          }
        });
      });
    }
    // get all course
    else if (method == "GET" && url == "/course") {
      fs.readFile("course.txt", "utf-8", (error, data) => {
        res.end(data);
      });
    }
    // delete course
    else if (method == "DELETE" && url.startsWith("/course/")) {
      const id = +url.split("/")[2];
      fs.readFile("course.txt", "utf-8", (error, data) => {
        if (error) {
          console.error(error.message);
          return;
        }
        let courses = [];

        if (data) {
            courses = JSON.parse(data);
        }

        const targetId = id;
        const courseWithId = courses.findIndex((course) => {
          return course.id === targetId;
        });

        if (courseWithId != -1) {
            courses.splice(courseWithId, 1);
          fs.writeFile(
            "course.txt",
            JSON.stringify(courses),
            "utf-8",
            (error) => {
              if (error) {
                console.error("Error writing file:", error);
              } else {
                res.end(
                  JSON.stringify({ message: "courses deleted successfully" })
                );
              }
            }
          );
        } else {
          res.end(
            JSON.stringify({
              message: `courses with ID ${targetId} not exists.`,
            })
          );
        }
      });
    }
    // update course
    else if (method == "PUT" && url.startsWith("/course/")) {
      let body = "";
      req.on("data", (data) => {
        body += data;
      });
      const id = +url.split("/")[2];

      req.on("end", () => {
        const course = JSON.parse(body);
        const { name } = course;

        const updatecourse = {
          id: id,
          name: name,
        };

        fs.readFile("course.txt", "utf-8", (error, data) => {
          if (error) {
            console.error(error.message);
            return;
          }
          let courses = [];

          if (data) {
            courses = JSON.parse(data);
          }

          const targetId = id;

          const courseWithId = courses.findIndex(
            (department) => department.id === targetId
          );

          if (courseWithId != -1) {
            courses.splice(courseWithId, 1);
            courses.push(updatecourse);
            fs.writeFile(
              "course.txt",
              JSON.stringify(courses),
              "utf-8",
              (error) => {
                if (error) {
                  console.error("Error writing file:", error);
                } else {
                  res.end(
                    JSON.stringify({
                      message: "course updated successfully",
                    })
                  );
                }
              }
            );
          } else {
            res.end(
              JSON.stringify({
                message: `course with ID ${targetId} not exists.`,
              })
            );
          }
        });
      });
    }
    //search for a course by ID
    else if (method == "GET" && url.startsWith("/courseById/")) {
      const id = +url.split("/")[2];
      fs.readFile("course.txt", "utf-8", (error, data) => {
        if (error) {
          console.error(error.message);
          return;
        }
        let courses = [];

        if (data) {
            courses = JSON.parse(data);
        }

        const targetId = id;

        const courseWithId = courses.find(
          (course) => course.id === targetId
        );
        if (courseWithId) {
          res.end(JSON.stringify(courseWithId));
        } else {
          res.end(
            JSON.stringify({
              message: `course with ID ${targetId} not exists.`,
            })
          );
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Not found" }));
    }
  })
  .listen(3000, () => {
    console.log("Server is running on port 3000");
  });
