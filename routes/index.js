// var express = require('express');
// var router = express.Router();
const User = require('../models/user');
function userRoute(app){
app.get('/', function (req, res, next) {
	return res.render('login.ejs');
});
app.get('/register', function (req, res, next) {
	return res.render('index.ejs')
})
app.get('/userTask' ,function (req, res, next) {
	User.findOne({unique_id:req.session.userId},(err,data)=>{
		if(err){
			console.log(err)
		}else{
			console.log(data)
			
	return res.render(('userTask.ejs'),{'Data':data})
			// return res.send(data.designation)
		}
	})

	


})

app.post('/', function(req, res, next) {
	console.log(req.body);
	const  personInfo = req.body;


	if(!personInfo.firstName || !personInfo.lastName || !personInfo.designation|| !personInfo.teamLeader||!personInfo.username ||!personInfo.date_of_birth || !personInfo.email||!personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({username:personInfo.username},function(err,data){
				if(!data){
					var c; 
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							firstName:personInfo.firstName,
							lastName:personInfo.lastName,
							designation: personInfo.designation,
							teamLeader: personInfo.teamLeader,
							username: personInfo.username,
							date_of_birth:personInfo.date_of_birth,
							email:personInfo.email,

							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are registered,You can login now."});
				}else{
					res.send({"Failed":"Email is already used."});
				}

			});
		}else{
			res.send({"Failed":"password does not match"});
		}
	}
});

app.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

app.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({username:req.body.username},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
				
			}else{
				res.send({"Failed":"Wrong password!"});
			}
		}else{
			res.send({"Failed":" Email  not registered !"});
		}
	});
});

app.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			// return res.render('data.ejs', {"name":data.firstName + data.lastname,"email":data.email});
			return res.redirect('/userTask');
		}
	});
});

app.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

app.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

app.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not registered !"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Failed":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});
}
module.exports = userRoute;