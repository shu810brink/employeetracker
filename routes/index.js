const User = require('../models/user');
const multer=require('multer');
const project= require('../models/project')
const fetchprojectData = require('../controllers/employee/task')


function userRoute(app){
let userLogin = false;
//get login
app.get('/', function (req, res, next) {
	return res.render('employee/login.ejs');
});
//get user task
// app.get('/userTask',fetchprojectData().findProjects)

app.get('/userTask',fetchprojectData().getprojects)

//get user
app.get('/login', function (req, res, next) {
	return res.render('employee/login.ejs');
});
//post login
app.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({username:req.body.username},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id

				User.findOneAndUpdate({username:req.username},{lastLogin: Date.now() },(err,data)=>{
					if (err){
						console.log('time not updated')
						res.send({"Success":"Success!"});
						userLogin = true

					}else{
						console.log(data,'time updated successfully')
						res.send({"Success":"Success!"});
						userLogin = true
					}
				})
			}else{
				res.send({"Failed":"Wrong password!"});
				userLogin = false
			}
		}else{
			res.send({"Failed":" Email  not registered !"});
		}
	});
});
//get profile--
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
//get Logout---
app.get('/logout', function (req, res, next) {
	console.log("logout")
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
			userLogin = false
    		return res.redirect('/');
    	}
    });

});
//forgot pswrd----
app.get('/forgetpass', function (req, res, next) {
	res.render("employee/forget.ejs");
});
// post forgotpswrd
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