const request = require('supertest');
const app = require('./server.app');
const fs = require('fs');

fileName = 'Client/Games.JSON'
if (!fs.existsSync(fileName)) { // Create the game directory file if it's not already created
    console.log("[STARTUP] Game Storage JSON not found, creating...")
    fs.writeFileSync(fileName, '[]');
}
teamFiles = 'Client/Teams.JSON'
if (!fs.existsSync(teamFiles)) { // Create the team directory file if it's not already created
    console.log("[STARTUP] Team Storage JSON not found, creating...")
    fs.writeFileSync(teamFiles, '[]');
}
let teamfile, teamCount, gameCount;
try {
    file = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    teamfile = JSON.parse(fs.readFileSync(teamFiles, 'utf8'));
    gameCount = file.length;
    teamCount = teamfile.length;
} catch (e) {
    console.log(e);
}
console.log("Testing with GameID: " + gameCount + " and TeamID: " + teamCount);

describe("Testing server.app.js", () => {
    // Tests for Games.JSON
    test("POST /api/addGame - should add a game and respond with the GameID as a string and 200 status", () => {
        const gameData = {
            BO: "5",
            MapPool: "1|2|3|4|5|6|7",
            MapOrder: "1|2|3|4|5|6|7",
            AgentOrder: "1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20",
            Teams: "5|4",
        };

        return request(app)
            .post('/api/addGame')
            .send(gameData)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
                expect(typeof response.text).toBe('string');
            });
    });

    test("GET /api/getAllGames - should return a list of all games with 200 status", () => {
        return request(app)
            .get('/api/getAllGames')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch(/json/);
            });
    });

    test("GET /api/getGame - should return a specific game when given a valid GameID", () => {
        return request(app)
            .get('/api/getGame?id=' + gameCount.toString())
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch(/json/);
            });
    });

    test("GET /api/getGame - should return 400 if GameID does not exist", () => {
        return request(app)
            .get('/api/getGame?id=999') // Assuming GameID 999 doesn't exist
            .then(response => {
                expect(response.status).toBe(400);
                expect(response.text).toBe("Error 400: GameID not found.");
            });
    });

    test("POST /api/editGame - should edit a game and respond with 'Edit Successful.' as a string and 200 status", () => {
        const gameData = {
            BO: "5",
            MapPool: "7|2|3|4|5|6|1",
            MapOrder: "7|2|3|4|5|6|1",
            AgentOrder: "1|2|3|4|5|6|7|9|8|10|11|12|13|14|15|16|17|18|19|20",
            Teams: "4|5",
            GameID: gameCount
        };

        return request(app)
            .post('/api/editGame')
            .send(gameData)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
                expect(typeof response.text).toBe('string');
            });
    });

    test("POST /api/deleteGame - should soft delete a game and respond with 'Delete Successful.' as a string and 200 status", () => {
        const gameData = {
            GameID: gameCount
        };

        return request(app)
            .post('/api/deleteGame')
            .send(gameData)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.text).toBe("Delete Successful.");
            });
    });

    test("POST /api/harshDeleteGame - should actually delete a game and respond with 'Harsh Delete Successful.' as a string and 200 status", () => {
        const gameData = {
            GameID: gameCount
        };

        return request(app)
            .post('/api/harshDeleteGame')
            .send(gameData)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.text).toBe("Harsh Delete Successful.");
            });
    });

    // Tests for Teams.JSON
    test("POST /api/addTeam - should add a Team and respond with the TeamID as a string and 200 status", () => {
        const teamData = {
            Name: "Testing Team",
            Players: "John|Doe|Jane|Doe|Player5",
        };
        return request(app)
            .post('/api/addTeam')
            .send(teamData)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
                expect(typeof response.text).toBe('string');
            });
    });

    test("GET /api/getAllTeams - should return a list of all teams with 200 status", () => {
        return request(app)
            .get('/api/getAllTeams')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch(/json/);
            });
    });

    test("GET /api/getTeam - should return a specific team when given a valid TeamID", () => {
        return request(app)
            .get('/api/getTeam?id=' + teamCount.toString())
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch(/json/);
            });
    });

    test("GET /api/getTeam - should return 400 if GameID does not exist", () => {
        return request(app)
            .get('/api/getTeam?id=999') // Assuming TeamID 999 doesn't exist
            .then(response => {
                expect(response.status).toBe(400);
                expect(response.text).toBe("Error 400: TeamID not found.");
            });
    });

    test("POST /api/editTeam - should edit a team and respond with 'Edit Successful.' as a string and 200 status", () => {
        const teamData = {
            Name: "Team Testing",
            Players: "John|Doe|Jane|Doe|Player5",
            TeamID: teamCount
        };

        return request(app)
            .post('/api/editTeam')
            .send(teamData)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
                expect(typeof response.text).toBe('string');
            });
    });

    test("POST /api/deleteTeam - should soft delete a team and respond with 'Delete Successful.' as a string and 200 status", () => {
        const teamData = {
            TeamID: teamCount
        };
        return request(app)
            .post('/api/deleteTeam')
            .send(teamData)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.text).toBe("Delete Successful.");
            });
    });

    test("POST /api/harshDeleteTeam - should actually delete a team and respond with 'Harsh Delete Successful.' as a string and 200 status", () => {
        const teamData = {
            TeamID: teamCount
        };

        return request(app)
            .post('/api/harshDeleteTeam')
            .send(teamData)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.text).toBe("Harsh Delete Successful.");
            });
    });

    // Misc Testing
    test("GET /api/status - should return 200 status", () => {
        return request(app)
            .get('/api/status')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    test("GET /api/agents - should return a json of all agents with 200 status", () => {
        return request(app)
            .get('/api/agents')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch(/json/);
            });
    });

    test("GET /api/maps - should return a json of all maps with 200 status", () => {
        return request(app)
            .get('/api/maps')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch(/json/);
            });
    });

    test("GET /api/getImage - should return a jpeg of the map Abyss when given a valid TeamID", () => {
        return request(app)
            .get('/api/getImage?FileName=Abyss')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch(/jpeg/);
            });
    });

});
