const http = require("http");
const fs = require("fs");

http
  .createServer((req, res) => {
    const { method, url } = req;
    // add department
    if (method == "POST" && url == "/department") {
      let body = "";
      req.on("data", (data) => {
        body += data;
      });

      req.on("end", () => {
        const student = JSON.parse(body);

        const { id, name } = student;

        const newDepartment = {
          id: id,
          name: name,
        };

        fs.readFile("department.txt", "utf-8", (error, data) => {
          if (error) {
            console.error(error.message);
            return;
          }
          let departments = [];

          if (data) {
            departments = JSON.parse(data);
          }

          const targetId = id;

          const departmentWithId = departments.find(
            (department) => department.id === targetId
          );

          if (departmentWithId) {
            res.end(
              JSON.stringify({
                message: `Department with ID ${targetId} exists.`,
              })
            );
            return;
          } else {
            departments.push(newDepartment);
            fs.writeFile(
              "department.txt",
              JSON.stringify(departments),
              "utf-8",
              (error) => {
                if (error) {
                  console.error("Error writing file:", error);
                } else {
                  res.end(
                    JSON.stringify({ message: "Department added successfully" })
                  );
                }
              }
            );
          }
        });
      });
    }
    // get all department
    else if (method == "GET" && url == "/department") {
      console.log("in");
      fs.readFile("department.txt", "utf-8", (error, data) => {
        res.end(data);
      });
    }
    // delete student
    else if (method == "DELETE" && url.startsWith("/department/")) {
      const id = +url.split("/")[2];
      fs.readFile("department.txt", "utf-8", (error, data) => {
        if (error) {
          console.error(error.message);
          return;
        }
        let departments = [];

        if (data) {
          departments = JSON.parse(data);
        }

        const targetId = id;
        const departmentsWithId = departments.findIndex((department) => {
          return department.id === targetId;
        });

        if (departmentsWithId != -1) {
          departments.splice(departmentsWithId, 1);
          fs.writeFile(
            "department.txt",
            JSON.stringify(departments),
            "utf-8",
            (error) => {
              if (error) {
                console.error("Error writing file:", error);
              } else {
                res.end(
                  JSON.stringify({ message: "department deleted successfully" })
                );
              }
            }
          );
        } else {
          res.end(
            JSON.stringify({
              message: `department with ID ${targetId} not exists.`,
            })
          );
        }
      });
    }
    // update department
    else if (method == "PUT" && url.startsWith("/department/")) {
      let body = "";
      req.on("data", (data) => {
        body += data;
      });
      const id = +url.split("/")[2];

      req.on("end", () => {
        const department = JSON.parse(body);
        const { name } = department;

        const updateDepartment = {
          id: id,
          name: name,
        };

        fs.readFile("department.txt", "utf-8", (error, data) => {
          if (error) {
            console.error(error.message);
            return;
          }
          let departments = [];

          if (data) {
            departments = JSON.parse(data);
          }

          const targetId = id;

          const departmentWithId = departments.findIndex(
            (department) => department.id === targetId
          );

          if (departmentWithId != -1) {
            departments.splice(departmentWithId, 1);
            departments.push(updateDepartment);
            fs.writeFile(
              "department.txt",
              JSON.stringify(departments),
              "utf-8",
              (error) => {
                if (error) {
                  console.error("Error writing file:", error);
                } else {
                  res.end(
                    JSON.stringify({
                      message: "department updated successfully",
                    })
                  );
                }
              }
            );
          } else {
            res.end(
              JSON.stringify({
                message: `department with ID ${targetId} not exists.`,
              })
            );
          }
        });
      });
    }
    //search for a department by ID
    else if (method == "GET" && url.startsWith("/departmentById/")) {
      const id = +url.split("/")[2];
      fs.readFile("department.txt", "utf-8", (error, data) => {
        if (error) {
          console.error(error.message);
          return;
        }
        let departments = [];

        if (data) {
          departments = JSON.parse(data);
        }

        const targetId = id;

        const departmentWithId = departments.find(
          (department) => department.id === targetId
        );
        if (departmentWithId) {
          res.end(JSON.stringify(departmentWithId));
        } else {
          res.end(
            JSON.stringify({
              message: `department with ID ${targetId} not exists.`,
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
