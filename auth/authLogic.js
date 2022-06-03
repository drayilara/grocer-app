

const isClient = (req, res, next) => {

    let admin = req.user.local.isAdmin; 
    
    if(req.isAuthenticated() && !admin) {
        next();
    } else {
        res.redirect("/login");
    }
}


const isAdmin = (req, res, next) => {

    let admin = req.user.local.isAdmin; 
    

    if(req.isAuthenticated() && admin) {
        next();
    }else {
        res.sendStatus(401);
    }
}


module.exports = {
    isAdmin,
    isClient
}
