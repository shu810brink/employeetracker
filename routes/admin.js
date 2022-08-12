// var express = require('express');
// var router = express.Router();
const admin = require('../models/admin');
const employee = require('../models/user');
function adminRoute(app){
app.get('/admin', function (req, res, next) {
	return res.render('adminregister.ejs');
});


// get addmin panel route

app.get('/adminpanel', function (req, res, next) {
	employee.find((err,val)=>{
        if(err){
            console.log(err)
        }else{
            return res.render('adminpanel.ejs',{'value':val})
        }
    })
})






app.post('/admin', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			admin.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var d;
					admin.findOne({},function(err,data){

						if (data) {
							console.log("if");
							d = data.unique_id + 1;
						}else{
							d=1;
						}

						var newPerson = new admin({
							unique_id:d,
							email:personInfo.email,
							username: personInfo.username,
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
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Failed":"Email is already In  use."});
				}

			});
		}else{
			res.send({"Failed ":"password does not match"});
		}
	}
});

app.get('/adminlogin', function (req, res, next) {
	return res.render('adminlogin.ejs');
});

app.post('/adminlogin', function (req, res, next) {
	//console.log(req.body);
	admin.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				// res.send({"Success":"Success!"});
				return res.redirect('/adminpanel');
				
			}else{
				res.send({"Failed":"Wrong password!"});
			}
		}else{
			res.send({"Failed":" Email  not registered!"});
		}
	});
});

app.get('/adminprofile', function (req, res, next) {
	console.log("adminprofile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/admin');
		}else{
			//console.log("found");
			return res.render('admindata.ejs', {"name":data.username,"email":data.email});
		}
	});
});

app.get('/adminlogout', function (req, res, next) {
	console.log("adminlogout")
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

app.get('/adminforgetpass', function (req, res, next) {
	res.render("forgetadminpass.ejs");
});

app.post('/adminforgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"failed":" Email  not registered!"});
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
			res.send({"Failed":"Password does not match! Both Password should be same."});
		}
		}
	});
	
});
}

module.exports = adminRoute;