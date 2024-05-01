const http = require("http");
const fs = require("fs");

http
  .createServer((req, res) => {
    const { method, url } = req;
    // add student
    if (method == "POST" && url == "/student") {
      let body = "";
      req.on("data", (data) => {
        body += data;
      });

      req.on("end", () => {
        const student = JSON.parse(body);

        const { id, name, password, email, department, courses } = student;

        const newStudent = {
          id: id,
          name: name,
          password: password,
          email: email,
          department: department,
          courses: courses,
        };

        fs.readFile("student.txt", "utf-8", (error, data) => {
          if (error) {
            console.error(error.message);
            return;
          }
          let students = [];

          if (data) {
            students = JSON.parse(data);
          }

          const targetId = id;

          const studentWithId = students.find(
            (student) => student.id === targetId
          );

          if (studentWithId) {
            res.end(
              JSON.stringify({ message: `Student with ID ${targetId} exists.` })
            );
            return;
          } else {
            students.push(newStudent);
            fs.writeFile(
              "student.txt",
              JSON.stringify(students),
              "utf-8",
              (error) => {
                if (error) {
                  console.error("Error writing file:", error);
                } else {
                  res.end(
                    JSON.stringify({ message: "Student added successfully" })
                  );
                }
              }
            );
          }
        });
      });
    }
    // get all student
    else if (method == "GET" && url == "/student") {
      fs.readFile("student.txt", "utf-8", (error, data) => {
        res.end(data);
      });
    }
    // delete student
    else if (method == "DELETE" && url.startsWith("/student/")) {
      const id = +url.split("/")[2];
      fs.readFile("student.txt", "utf-8", (error, data) => {
        if (error) {
          console.error(error.message);
          return;
        }
        let students = [];

        if (data) {
          students = JSON.parse(data);
        }

        const targetId = id;

        const studentWithId = students.findIndex(
          (student) => student.id === targetId
        );

        if (studentWithId != -1) {
          students.splice(studentWithId, 1);
          fs.writeFile(
            "student.txt",
            JSON.stringify(students),
            "utf-8",
            (error) => {
              if (error) {
                console.error("Error writing file:", error);
              } else {
                res.end(
                  JSON.stringify({ message: "Student deleted successfully" })
                );
              }
            }
          );
        } else {
          res.end(
            JSON.stringify({
              message: `Student with ID ${targetId} not exists.`,
            })
          );
        }
      });
    }
    // update student
    else if (method == "PUT" && url.startsWith("/student/")) {
      let body = "";
      req.on("data", (data) => {
        body += data;
      });
      const id = +url.split("/")[2];

      req.on("end", () => {
        const student = JSON.parse(body);
        const { name, password, email, department, courses } = student;

        const updateStudent = {
          id: id,
          name: name,
          password: password,
          email: email,
          department: department,
          courses: courses,
        };

        fs.readFile("student.txt", "utf-8", (error, data) => {
          if (error) {
            console.error(error.message);
            return;
          }
          let students = [];

          if (data) {
            students = JSON.parse(data);
          }

          const targetId = id;

          const studentWithId = students.findIndex(
            (student) => student.id === targetId
          );

          if (studentWithId != -1) {
            students.splice(studentWithId, 1);
            students.push(updateStudent);
            fs.writeFile(
              "student.txt",
              JSON.stringify(students),
              "utf-8",
              (error) => {
                if (error) {
                  console.error("Error writing file:", error);
                } else {
                  res.end(
                    JSON.stringify({ message: "Student updated successfully" })
                  );
                }
              }
            );
          } else {
            res.end(
              JSON.stringify({
                message: `Student with ID ${targetId} not exists.`,
              })
            );
          }
        });
      });
    }
    //search for a student by ID
    else if (method == "GET" && url.startsWith("/studentById/")) {
      const id = +url.split("/")[2];
      fs.readFile("student.txt", "utf-8", (error, data) => {
        if (error) {
          console.error(error.message);
          return;
        }
        let students = [];

        if (data) {
          students = JSON.parse(data);
        }

        const targetId = id;

        const studentWithId = students.find(
          (student) => student.id === targetId
        );
        if (studentWithId) {
          res.end(JSON.stringify(studentWithId));
        } else {
          res.end(
            JSON.stringify({
              message: `Student with ID ${targetId} not exists.`,
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
