module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getJobs(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM db_jobs", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.jobs  = results;
            complete();
        });
    }

    function getPeople(res, mysql, context, complete){
        mysql.pool.query("SELECT db_people.id, uname, gname, db_jobs.name AS job, level FROM db_people INNER JOIN db_jobs ON db_people.job = db_jobs.id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    function getPerson(res, mysql, context, id, complete){
        var sql = "SELECT id, uname, gname, job, level FROM db_people WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            console.log(context.person);
            complete();
        });
    }

    function getGuild(res, mysql, context, id, complete){
        var sql = "SELECT COUNT(id) AS count FROM db_people WHERE gname = (SELECT gname FROM db_people WHERE id = ?)";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guild = results[0];
            console.log(context.guild);
            complete();
        });
    }



    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        getPeople(res, mysql, context, complete);
        getJobs(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('people', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedjob.js", "updateperson.js"];
        var mysql = req.app.get('mysql');
        getGuild(res, mysql, context, req.params.id, complete);
        getPerson(res, mysql, context, req.params.id, complete);
        getJobs(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-person', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO db_people (uname, gname, job, level) VALUES (?,?,?,?)";
        var inserts = [req.body.uname, req.body.gname, req.body.job, req.body.level];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/people');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE db_people SET uname=?, gname=?, job=?, level=? WHERE id=?";
        var inserts = [req.body.uname, req.body.gname, req.body.job, req.body.level, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM db_people WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();