
const isClient = (req, res, next) => {
    
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}


const isAdmin = (req, res, next) => {
    
    let isAdmin = req.user.local.isAdmin;
    

    if(req.isAuthenticated() && isAdmin) {
        next();
    }else {
        res.redirect(400);
    }
}


module.exports = {
    isAdmin,
    isClient
}
